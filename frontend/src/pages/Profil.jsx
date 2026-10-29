import { useState } from 'react';
import axios from 'axios';

function Profil() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    motDePasse: '',
  });
  const [photo, setPhoto] = useState(localStorage.getItem('photo_' + user?.id) || null);
  const [message, setMessage] = useState('');

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      localStorage.setItem('photo_' + user?.id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updated = { ...user, nom: form.nom, telephone: form.telephone };
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur lors de la mise à jour');
    }
  };

  const initiales = user?.nom?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>👤 Mon Profil</h2>

      {/* Photo de profil */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {photo ? (
            <img src={photo} alt="profil" style={{
              width: '110px', height: '110px', borderRadius: '50%',
              objectFit: 'cover', border: '3px solid #1D9E75'
            }} />
          ) : (
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              background: '#1D9E75', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '36px', fontWeight: 'bold',
              color: '#fff', border: '3px solid #085041', margin: '0 auto'
            }}>
              {initiales}
            </div>
          )}
          <label style={{
            position: 'absolute', bottom: '0', right: '0',
            background: '#1D9E75', color: '#fff', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px', border: '2px solid #fff'
          }}>
            📷
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </label>
        </div>
        <p style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '18px' }}>{user?.nom}</p>
        <span style={{
          display: 'inline-block', padding: '3px 14px', borderRadius: '99px',
          background: user?.type === 'Agriculteur' ? '#EAF3DE' : user?.type === 'Administrateur' ? '#E6F1FB' : '#FFF3E0',
          color: user?.type === 'Agriculteur' ? '#27500A' : user?.type === 'Administrateur' ? '#0C447C' : '#633806',
          fontSize: '13px', fontWeight: 'bold', marginTop: '4px'
        }}>
          {user?.type}
        </span>
      </div>

      {/* Formulaire */}
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>
            Nom complet
          </label>
          <input
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            value={form.email}
            disabled
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>L'email ne peut pas être modifié</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>
            Téléphone
          </label>
          <input
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            placeholder="+223 XX XX XX XX"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>
            Nouveau mot de passe (optionnel)
          </label>
          <input
            type="password"
            value={form.motDePasse}
            onChange={e => setForm({ ...form, motDePasse: e.target.value })}
            placeholder="Laisser vide pour ne pas changer"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {message && (
          <div style={{
            padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
            background: message.includes('✅') ? '#EAF3DE' : '#FCEBEB',
            color: message.includes('✅') ? '#27500A' : '#791F1F',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <button onClick={handleSave} style={{
          width: '100%', padding: '12px', background: '#1D9E75',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          💾 Sauvegarder
        </button>
      </div>

      {/* Infos compte */}
      <div style={{ background: '#F0FBF7', border: '1px solid #1D9E75', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
        <h3 style={{ color: '#085041', marginBottom: '12px', fontSize: '15px' }}>📊 Infos du compte</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#555', fontSize: '13px' }}>ID utilisateur</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>#{user?.id}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#555', fontSize: '13px' }}>Type de compte</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{user?.type}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#555', fontSize: '13px' }}>Statut</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1D9E75' }}>✅ Actif</span>
        </div>
      </div>
    </div>
  );
}

export default Profil;