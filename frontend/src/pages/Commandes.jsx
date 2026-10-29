import { useEffect, useState } from 'react';
import api from '../api';

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api.get('/commandes')
      .then(res => setCommandes(res.data))
      .catch(err => {
        console.error('Erreur de chargement des commandes :', err);
        setErreur('Impossible de charger les commandes. Réessayez plus tard.');
      });
  }, []);

  const couleur = (s) => {
    if (s === 'Livrée')       return { background: '#EAF3DE', color: '#27500A' };
    if (s === 'En livraison') return { background: '#FAEEDA', color: '#633806' };
    if (s === 'Annulée')      return { background: '#FCEBEB', color: '#791F1F' };
    return { background: '#E6F1FB', color: '#0C447C' };
  };

  const actionParRole = {
    Agriculteur: {
      'En attente': { statut: 'Confirmée', libelle: 'Confirmer la commande' },
      'Confirmée': { statut: 'En livraison', libelle: 'Lancer la livraison' },
      'En livraison': { statut: 'Livrée', libelle: 'Confirmer la livraison' }
    },
    Acheteur: {
      'En attente': { statut: 'Annulée', libelle: 'Annuler la commande' }
    }
  };

  const changerStatut = async (commandeId, statut) => {
    setErreur('');
    try {
      await api.put(`/commandes/${commandeId}/statut`, { statut });
      setCommandes(prev => prev.map(c => c.id === commandeId ? { ...c, statut } : c));
    } catch (error) {
      console.error('Erreur de mise à jour de la commande :', error);
      setErreur(error.response?.data?.erreur || 'Impossible de modifier le statut de la commande.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '20px' }}>Mes Commandes</h2>
      {!user && <p>Connectez-vous pour consulter vos commandes.</p>}
      {erreur && <p role="alert" style={{ color: '#791F1F', marginBottom: '12px' }}>{erreur}</p>}
      {commandes.map(c => (
        <div key={c.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: '1px solid #ddd', borderRadius: '12px',
          padding: '16px 20px', marginBottom: '12px', background: '#fff'
        }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>Commande #{c.id}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>{c.dateCommande}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', color: '#1D9E75' }}>
              {Number(c.montantTotal).toLocaleString('fr-FR')} FCFA
            </div>
            <span style={{
              display: 'inline-block', padding: '3px 10px',
              borderRadius: '99px', fontSize: '12px', marginTop: '4px',
              ...couleur(c.statut)
            }}>{c.statut}</span>
            {actionParRole[user?.type]?.[c.statut] && (
              <div>
                <button onClick={() => changerStatut(c.id, actionParRole[user.type][c.statut].statut)} style={{
                  marginTop: '8px', padding: '6px 14px',
                  background: user.type === 'Acheteur' ? '#9a3412' : '#1D9E75', color: '#fff', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                }}>
                  {actionParRole[user.type][c.statut].libelle}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Commandes;