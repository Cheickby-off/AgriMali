import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [mode, setMode]   = useState('connexion');
  const [form, setForm]   = useState({ nom: '', email: '', motDePasse: '', telephone: '', type: 'Acheteur' });
  const navigate          = useNavigate();

  const handleConnexion = async () => {
    try {
      const res = await api.post('/utilisateurs/connexion', {
        email: form.email, motDePasse: form.motDePasse
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Bienvenue ' + res.data.user.nom + ' !');
      navigate('/dashboard');
    } catch {
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleInscription = async () => {
    if (!form.nom || !form.email || !form.motDePasse) {
      alert('Remplis tous les champs !');
      return;
    }
    if (form.motDePasse.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    try {
      await api.post('/utilisateurs/inscription', {
        nom: form.nom,
        email: form.email,
        motDePasse: form.motDePasse,
        telephone: form.telephone || '',
        type: form.type
      });
      alert('Compte créé avec succès ! Connectez-vous maintenant.');
      setMode('connexion');
    } catch {
      alert('Erreur — cet email existe peut-être déjà.');
    }
  };

  const input = (placeholder, champ, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[champ]}
      onChange={e => setForm({ ...form, [champ]: e.target.value })}
      style={{ width: '100%', padding: '10px', marginTop: '4px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' }}
    />
  );

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '32px', border: '1px solid #ddd', borderRadius: '16px', background: '#fff' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '40px' }}>🌱</div>
        <h2 style={{ color: '#1D9E75', margin: '8px 0 4px' }}>AgriMali</h2>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1D9E75' }}>
        <button onClick={() => setMode('connexion')} style={{
          flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
          background: mode === 'connexion' ? '#1D9E75' : '#fff',
          color: mode === 'connexion' ? '#fff' : '#1D9E75'
        }}>
          Se connecter
        </button>
        <button onClick={() => setMode('inscription')} style={{
          flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
          background: mode === 'inscription' ? '#1D9E75' : '#fff',
          color: mode === 'inscription' ? '#fff' : '#1D9E75'
        }}>
          S'inscrire
        </button>
      </div>

      {/* CONNEXION */}
      {mode === 'connexion' && (
        <div>
          <label style={{ fontSize: '13px', color: '#555' }}>Email</label>
          {input('ex: cheick@agrimali.ml', 'email', 'email')}
          <label style={{ fontSize: '13px', color: '#555' }}>Mot de passe</label>
          {input('••••••••', 'motDePasse', 'password')}
          <button onClick={handleConnexion} style={{
            width: '100%', padding: '12px', background: '#1D9E75',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            Se connecter
          </button>
        </div>
      )}

      {/* INSCRIPTION */}
      {mode === 'inscription' && (
        <div>
          <label style={{ fontSize: '13px', color: '#555' }}>Nom complet</label>
          {input('Ex: Diallo Aminata', 'nom')}
          <label style={{ fontSize: '13px', color: '#555' }}>Email</label>
          {input('Ex: aminata@mail.com', 'email', 'email')}
          <label style={{ fontSize: '13px', color: '#555' }}>Mot de passe</label>
          {input('Choisissez un mot de passe', 'motDePasse', 'password')}
          <label style={{ fontSize: '13px', color: '#555' }}>Téléphone (optionnel)</label>
          {input('+223 XX XX XX XX', 'telephone')}
          <label style={{ fontSize: '13px', color: '#555' }}>Je suis :</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            style={{ width: '100%', padding: '10px', marginTop: '4px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option value="Acheteur">Acheteur</option>
            <option value="Agriculteur">Agriculteur</option>
          </select>
          <button onClick={handleInscription} style={{
            width: '100%', padding: '12px', background: '#1D9E75',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            Créer mon compte
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;