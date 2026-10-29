import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

function Accueil() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#f1f5f9' : '#1a1a1a';

  useEffect(() => {
    api.get('/produits')
      .then(res => setProduits(res.data.slice(0, 4)))
      .catch(error => console.error('Erreur de chargement des produits en vedette :', error));
  }, []);

  return (
    <div>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #085041 0%, #1D9E75 60%, #2dd4a0 100%)',
        padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌱</div>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
          Bienvenue sur AgriMali
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          La plateforme qui connecte directement agriculteurs et acheteurs au Mali — sans intermédiaire, sans surcoût.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/produits')} style={{
            padding: '14px 32px', background: '#fff', color: '#085041',
            border: 'none', borderRadius: '10px', fontSize: '16px',
            fontWeight: 'bold', cursor: 'pointer'
          }}>
            🛒 Voir les produits
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 32px', background: 'transparent', color: '#fff',
            border: '2px solid #fff', borderRadius: '10px', fontSize: '16px',
            fontWeight: 'bold', cursor: 'pointer'
          }}>
            Se connecter
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#085041', padding: '24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[
            { chiffre: '500+', label: 'Agriculteurs' },
            { chiffre: '2000+', label: 'Acheteurs' },
            { chiffre: '31+', label: 'Produits' },
            { chiffre: '20', label: 'Villes du Mali' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2dd4a0' }}>{s.chiffre}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMMENT ÇA MARCHE ── */}
      <div className="home-section" style={{ padding: '60px 40px', background: isDark ? '#0f172a' : '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '40px', color: textColor }}>
          Comment ça marche ?
        </h2>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { emoji: '📝', titre: 'Inscrivez-vous', desc: 'Créez votre compte en tant qu\'agriculteur ou acheteur en quelques secondes.' },
            { emoji: '🌾', titre: 'Publiez ou achetez', desc: 'Les agriculteurs publient leurs produits, les acheteurs passent commande directement.' },
            { emoji: '🚚', titre: 'Recevez votre commande', desc: 'Suivez votre livraison en temps réel et recevez vos produits frais.' },
          ].map((e, i) => (
            <div key={i} className="card" style={{
              background: isDark ? '#1e293b' : '#fff',
              borderRadius: '16px', padding: '28px', textAlign: 'center',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>{e.emoji}</div>
              <h3 style={{ fontSize: '17px', marginBottom: '10px', color: '#1D9E75' }}>{e.titre}</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#666', lineHeight: '1.6' }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUITS EN VEDETTE ── */}
      {produits.length > 0 && (
        <div className="home-section" style={{ padding: '40px', background: isDark ? '#0f172a' : '#fff' }}>
          <h2 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '8px', color: textColor }}>
            🌾 Produits en vedette
          </h2>
          <p style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#888', marginBottom: '28px', fontSize: '14px' }}>
            Découvrez les produits frais de nos agriculteurs
          </p>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
            {produits.map(p => (
              <div key={p.id} className="card-hover" style={{
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px', overflow: 'hidden',
                background: isDark ? '#1e293b' : '#fff',
                cursor: 'pointer'
              }} onClick={() => navigate('/produits')}>
                <div style={{ height: '120px', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                  {p.nom.toLowerCase().includes('maïs') ? '🌽' :
                   p.nom.toLowerCase().includes('mangue') ? '🥭' :
                   p.nom.toLowerCase().includes('riz') ? '🍚' :
                   p.nom.toLowerCase().includes('tomate') ? '🍅' :
                   p.nom.toLowerCase().includes('banane') ? '🍌' :
                   p.nom.toLowerCase().includes('orange') ? '🍊' :
                   p.nom.toLowerCase().includes('pomme') ? '🍎' :
                   p.nom.toLowerCase().includes('fraise') ? '🍓' : '🌾'}
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ fontSize: '13px', marginBottom: '4px', color: textColor }}>{p.nom}</h3>
                  <p style={{ color: '#1D9E75', fontWeight: 'bold', fontSize: '14px' }}>{p.prix.toLocaleString()} FCFA</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={() => navigate('/produits')} style={{
              padding: '12px 28px', background: '#1D9E75', color: '#fff',
              border: 'none', borderRadius: '10px', fontSize: '15px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              Voir tous les produits →
            </button>
          </div>
        </div>
      )}

      {/* ── ÉQUIPE FONDATRICE ── */}
      <div style={{ padding: '60px 40px', background: isDark ? '#1e293b' : '#f0fbf7' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '32px', color: textColor }}>
          Notre équipe fondatrice
        </h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { nom: 'Diakite Cheick Al Hassane', role: 'Fondateur — PDG', initiales: 'DC' },
            { nom: 'Traoré Fatimata', role: 'Co-fondatrice — Admin', initiales: 'TF' },
            { nom: 'Diakite S Mariam', role: 'Co-fondatrice — Admin', initiales: 'MSD' },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: isDark ? '#0f172a' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#ddd'}`,
              borderRadius: '14px', padding: '18px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: '260px'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#1D9E75', color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '16px', flexShrink: 0
              }}>{p.initiales}</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: textColor }}>{p.nom}</div>
                <div style={{ color: '#1D9E75', fontSize: '13px', marginTop: '2px' }}>{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: '#085041', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
          © 2026 AgriMali — Du champ à votre table 🌱
        </p>
      </div>

    </div>
  );
}

export default Accueil;