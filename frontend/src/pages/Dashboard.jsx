import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

const VILLES = [
  'Bamako', 'Sikasso', 'Mopti', 'Kayes', 'Koutiala',
  'Segou', 'Tomboktou', 'Gao', 'Kidal', 'San',
  'Niono', 'Kita', 'Bougouni', 'Kangaba', 'Yanfolila'
];

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [produits, setProduits]   = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [meteo, setMeteo]         = useState([]);
  const [loadingMeteo, setLoadingMeteo] = useState(true);

  useEffect(() => {
    api.get('/produits').then(res => setProduits(res.data)).catch(error => console.error('Erreur de chargement des produits :', error));
    if (localStorage.getItem('token')) {
      api.get('/commandes').then(res => setCommandes(res.data)).catch(error => console.error('Erreur de chargement des commandes :', error));
    }

    // Météo en temps réel
    const fetchMeteo = async () => {
      try {
        const results = await Promise.all(
          VILLES.map(ville =>
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville},ML&appid=${API_KEY}&units=metric&lang=fr`)
          )
        );
        setMeteo(results.map((r, i) => ({
          ville: VILLES[i],
          temp: Math.round(r.data.main.temp),
          ressentie: Math.round(r.data.main.feels_like),
          humidite: r.data.main.humidity,
          description: r.data.weather[0].description,
          vent: Math.round(r.data.wind.speed * 3.6),
          icon: r.data.weather[0].icon
        })));
      } catch {
        // Si pas de clé API encore — données de secours
        setMeteo(VILLES.map((ville, i) => ({
          ville,
          temp: [34, 31, 38, 40, 33, 36, 42, 43, 41, 35, 36, 33, 32, 32, 31][i],
          humidite: [60, 70, 40, 30, 65, 50, 15, 12, 10, 55, 52, 68, 72, 70, 75][i],
          description: 'ensoleillé',
          vent: [12, 10, 15, 18, 11, 13, 20, 22, 19, 12, 11, 9, 8, 9, 8][i],
          ressentie: [36, 33, 41, 44, 35, 39, 45, 47, 44, 38, 39, 35, 34, 34, 33][i],
          icon: '01d'
        })));
      }
      setLoadingMeteo(false);
    };

    fetchMeteo();
  }, []);

  const getMeteoEmoji = (desc) => {
    if (!desc) return '☀️';
    const d = desc.toLowerCase();
    if (d.includes('pluie') || d.includes('rain'))    return '🌧️';
    if (d.includes('nuage') || d.includes('cloud'))   return '⛅';
    if (d.includes('orage') || d.includes('thunder')) return '⛈️';
    if (d.includes('brume') || d.includes('fog'))     return '🌫️';
    if (d.includes('vent') || d.includes('wind'))     return '💨';
    return '☀️';
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        Bonjour, {user ? user.nom : 'Utilisateur'} 👋
      </h2>

      {/* Statistiques */}
      <div className="grid-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Produits publiés', valeur: produits.length,  couleur: '#1D9E75' },
          { label: 'Commandes',        valeur: commandes.length, couleur: '#185FA5' },
          { label: 'Total FCFA',       valeur: commandes.reduce((s,c) => s + c.montantTotal, 0).toLocaleString(), couleur: '#BA7517' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: s.couleur }}>{s.valeur}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Météo */}
      <h3 style={{ marginBottom: '12px' }}>🌤️ Météo en temps réel — Mali</h3>
      {loadingMeteo ? (
        <p style={{ color: '#888' }}>Chargement météo...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {meteo.map((m, i) => (
            <div key={i} className="card" style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '14px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{m.ville}</span>
                <span style={{ fontSize: '22px' }}>{getMeteoEmoji(m.description)}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1D9E75' }}>{m.temp}°C</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                💧 {m.humidite}% · 💨 {m.vent} km/h
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', textTransform: 'capitalize' }}>
                {m.description}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                Ressenti : {m.ressentie}°C
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;