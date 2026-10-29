import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Panier() {
  const [panier, setPanier] = useState(
    JSON.parse(localStorage.getItem('panier')) || []
  );
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const total = panier.reduce((sum, p) => sum + p.prix * p.quantite, 0);

  const supprimer = (id) => {
    const nouveau = panier.filter(p => p.id !== id);
    setPanier(nouveau);
    localStorage.setItem('panier', JSON.stringify(nouveau));
  };

  const modifierQte = (id, qte) => {
    if (qte < 1) return;
    const nouveau = panier.map(p => p.id === id ? { ...p, quantite: qte } : p);
    setPanier(nouveau);
    localStorage.setItem('panier', JSON.stringify(nouveau));
  };

  const commander = async () => {
    if (!user) { alert('Connectez-vous d\'abord !'); return; }
    if (panier.length === 0) { alert('Votre panier est vide !'); return; }
    try {
      await api.post('/commandes', {
        produits: panier.map(({ id, quantite }) => ({ id, quantite }))
      });
      localStorage.removeItem('panier');
      setPanier([]);
      alert('Commande passée avec succès ! 🎉');
      navigate('/commandes');
    } catch {
      alert('Erreur lors de la commande');
    }
  };

  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#f1f5f9' : '#1a1a1a';
  const subTextColor = isDark ? '#94a3b8' : '#555555';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: textColor }}>🛒 Mon Panier</h2>

      {panier.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
          <p style={{ fontSize: '18px', marginBottom: '16px', color: textColor }}>
            Votre panier est vide
          </p>
          <p style={{ fontSize: '14px', marginBottom: '24px', color: subTextColor }}>
            Ajoutez des produits depuis la page Produits
          </p>
          <button onClick={() => navigate('/produits')} style={{
            padding: '12px 28px', background: '#1D9E75', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
          }}>
            Voir les produits
          </button>
        </div>
      ) : (
        <>
          {panier.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              border: `1px solid ${cardBorder}`, borderRadius: '12px',
              padding: '16px', marginBottom: '12px', background: cardBg
            }}>
              <img src={p.image} alt={p.nom} style={{
                width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'
              }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '15px', marginBottom: '4px', color: textColor }}>{p.nom}</h3>
                <p style={{ color: '#1D9E75', fontWeight: 'bold' }}>{p.prix.toLocaleString()} FCFA</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => modifierQte(p.id, p.quantite - 1)} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: `1px solid ${cardBorder}`, background: cardBg,
                  cursor: 'pointer', fontSize: '16px', color: textColor
                }}>−</button>
                <span style={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center', color: textColor }}>
                  {p.quantite}
                </span>
                <button onClick={() => modifierQte(p.id, p.quantite + 1)} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: `1px solid ${cardBorder}`, background: cardBg,
                  cursor: 'pointer', fontSize: '16px', color: textColor
                }}>+</button>
              </div>
              <p style={{ fontWeight: 'bold', color: '#085041', minWidth: '100px', textAlign: 'right' }}>
                {(p.prix * p.quantite).toLocaleString()} FCFA
              </p>
              <button onClick={() => supprimer(p.id)} style={{
                background: '#FCEBEB', color: '#791F1F', border: 'none',
                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px'
              }}>
                🗑️
              </button>
            </div>
          ))}

          <div style={{
            border: '1px solid #1D9E75', borderRadius: '12px',
            padding: '20px', background: isDark ? '#0f2e1f' : '#F0FBF7', marginTop: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: textColor }}>Total :</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1D9E75' }}>
                {total.toLocaleString()} FCFA
              </span>
            </div>
            <button onClick={commander} style={{
              width: '100%', padding: '14px', background: '#1D9E75',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              ✅ Confirmer la commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Panier;