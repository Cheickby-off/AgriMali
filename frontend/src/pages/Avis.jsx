import { useState } from 'react';
import axios from 'axios';

function Avis() {
  const user = JSON.parse(localStorage.getItem('user'));
  const key = 'avis_produits';
  const [avis, setAvis] = useState(JSON.parse(localStorage.getItem(key)) || [
    { id: 1, produit: 'Sac de Maïs 50kg', auteur: 'Koné Ibrahim', note: 5, commentaire: 'Excellent produit, très frais !', date: '2026-06-01' },
    { id: 2, produit: 'Mangues fraîches', auteur: 'Diallo Aminata', note: 4, commentaire: 'Très bonnes mangues de Sikasso', date: '2026-06-02' },
    { id: 3, produit: 'Fraise 100kg', auteur: 'Fall Mohamed', note: 5, commentaire: 'Livraison rapide, produit conforme', date: '2026-06-03' },
  ]);
  const [form, setForm] = useState({ produit: '', note: 5, commentaire: '' });
  const [message, setMessage] = useState('');

  const publier = () => {
    if (!form.produit || !form.commentaire) { alert('Remplis tous les champs !'); return; }
    const nouvelAvis = { id: Date.now(), produit: form.produit, auteur: user?.nom || 'Anonyme', note: form.note, commentaire: form.commentaire, date: new Date().toISOString().split('T')[0] };
    const updated = [nouvelAvis, ...avis];
    setAvis(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setForm({ produit: '', note: 5, commentaire: '' });
    setMessage('✅ Avis publié avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  const etoiles = (note) => '⭐'.repeat(note) + '☆'.repeat(5 - note);

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>⭐ Avis & Notes</h2>

      {/* Formulaire */}
      <div style={{ border: '1px solid #1D9E75', borderRadius: '12px', padding: '20px', background: '#F0FBF7', marginBottom: '24px' }}>
        <h3 style={{ color: '#085041', marginBottom: '14px' }}>✍️ Laisser un avis</h3>
        <input
          placeholder="Nom du produit"
          value={form.produit}
          onChange={e => setForm({ ...form, produit: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', fontSize: '14px' }}
        />
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', color: '#555', marginRight: '10px' }}>Note :</label>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setForm({ ...form, note: n })} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', opacity: n <= form.note ? 1 : 0.3 }}>⭐</button>
          ))}
        </div>
        <textarea
          placeholder="Votre commentaire..."
          value={form.commentaire}
          onChange={e => setForm({ ...form, commentaire: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', fontSize: '14px', resize: 'none' }}
        />
        {message && <p style={{ color: '#27500A', marginBottom: '8px' }}>{message}</p>}
        <button onClick={publier} style={{ padding: '10px 24px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Publier l'avis
        </button>
      </div>

      {/* Liste avis */}
      {avis.map(a => (
        <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '12px', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{a.produit}</span>
            <span style={{ fontSize: '13px', color: '#888' }}>{a.date}</span>
          </div>
          <p style={{ fontSize: '18px', marginBottom: '6px' }}>{etoiles(a.note)}</p>
          <p style={{ fontSize: '14px', color: '#333', marginBottom: '6px' }}>{a.commentaire}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>— {a.auteur}</p>
        </div>
      ))}
    </div>
  );
}

export default Avis;