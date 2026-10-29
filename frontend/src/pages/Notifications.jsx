import { useState, useEffect } from 'react';

function Notifications() {
  const user = JSON.parse(localStorage.getItem('user'));
  const key = 'notifs_' + user?.id;
  const [notifs, setNotifs] = useState(JSON.parse(localStorage.getItem(key)) || [
    { id: 1, type: 'commande', message: 'Votre commande #5001 est en cours de livraison', date: '2026-06-05', lu: false },
    { id: 2, type: 'produit', message: 'Votre produit Sac de Maïs 50kg a été vendu', date: '2026-06-04', lu: false },
    { id: 3, type: 'message', message: 'Vous avez un nouveau message de Coulibaly Sira', date: '2026-06-03', lu: true },
    { id: 4, type: 'livraison', message: 'Commande #5002 livrée avec succès !', date: '2026-06-02', lu: true },
  ]);

  const marquerLu = (id) => {
    const updated = notifs.map(n => n.id === id ? { ...n, lu: true } : n);
    setNotifs(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const supprimer = (id) => {
    const updated = notifs.filter(n => n.id !== id);
    setNotifs(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const toutMarquerLu = () => {
    const updated = notifs.map(n => ({ ...n, lu: true }));
    setNotifs(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const getIcon = (type) => {
    if (type === 'commande')  return '🛒';
    if (type === 'produit')   return '🌾';
    if (type === 'message')   return '💬';
    if (type === 'livraison') return '🚚';
    return '🔔';
  };

  const nonLues = notifs.filter(n => !n.lu).length;

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🔔 Notifications {nonLues > 0 && <span style={{ background: '#1D9E75', color: '#fff', borderRadius: '99px', padding: '2px 10px', fontSize: '14px', marginLeft: '8px' }}>{nonLues}</span>}</h2>
        {nonLues > 0 && (
          <button onClick={toutMarquerLu} style={{ padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
          <p>Aucune notification</p>
        </div>
      ) : (
        notifs.map(n => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            border: `1px solid ${n.lu ? '#ddd' : '#1D9E75'}`,
            borderRadius: '12px', padding: '16px', marginBottom: '10px',
            background: n.lu ? '#fff' : '#F0FBF7'
          }}>
            <div style={{ fontSize: '28px' }}>{getIcon(n.type)}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: n.lu ? 'normal' : 'bold', marginBottom: '4px' }}>{n.message}</p>
              <p style={{ fontSize: '12px', color: '#888' }}>{n.date}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!n.lu && (
                <button onClick={() => marquerLu(n.id)} style={{ padding: '5px 10px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  ✓ Lu
                </button>
              )}
              <button onClick={() => supprimer(n.id)} style={{ padding: '5px 10px', background: '#FCEBEB', color: '#791F1F', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;