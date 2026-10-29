import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [menuOuvert, setMenuOuvert] = useState(false);
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  const notifs = JSON.parse(localStorage.getItem('notifs_' + user?.id)) || [];
  const nonLues = notifs.filter(n => !n.lu).length;

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('darkMode', next);
  };

  return (
    <nav className="navbar" style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '12px 24px',
      background: '#1D9E75', color: '#fff',
      position: 'sticky', top: 0, zIndex: 100
    }}>

      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={logo} alt="AgriMali" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '22px', letterSpacing: '1px' }}>
          AgriMali
        </span>
      </Link>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOuvert}
        onClick={() => setMenuOuvert(!menuOuvert)}
      >
        {menuOuvert ? '✕' : '☰'}
      </button>

      <div className={`nav-links${menuOuvert ? ' nav-links-open' : ''}`} onClick={() => setMenuOuvert(false)} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <Link to="/produits"  style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>🌾Produits</Link>
        <Link to="/commandes" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>🛒Commandes</Link>
        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>🌤️ Météo</Link>
        <Link to="/avis"      style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>⭐ Avis</Link>
        <Link to="/forum"     style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>🌾 Forum</Link>

        {user
          ? <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profil" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#085041', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 'bold',
                  fontSize: '13px', border: '2px solid #fff'
                }}>
                  {user.nom?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{user.nom}</span>
              </Link>
              <button onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }} style={{
                padding: '6px 14px', background: 'transparent',
                color: '#fff', border: '1px solid #fff',
                borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
              }}>
                Déconnexion
              </button>
            </div>
          : <Link to="/login" style={{
              color: '#fff', textDecoration: 'none', fontSize: '14px',
              border: '1px solid #fff', padding: '6px 14px', borderRadius: '8px'
            }}>
              Connexion
            </Link>
        }
        {/* Panier */}
        <Link to="/panier" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🛒
          {panier.length > 0 && (
            <span style={{ background: '#fff', color: '#1D9E75', borderRadius: '99px', padding: '1px 7px', fontSize: '11px', fontWeight: 'bold' }}>
              {panier.length}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <Link to="/notifications" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🔔
          {nonLues > 0 && (
            <span style={{ background: '#fff', color: '#1D9E75', borderRadius: '99px', padding: '1px 7px', fontSize: '11px', fontWeight: 'bold' }}>
              {nonLues}
            </span>
          )}
        </Link>

        {/* Mode sombre */}
        <button onClick={toggleDark} style={{
          background: 'transparent', border: '1px solid #fff',
          color: '#fff', borderRadius: '8px', padding: '5px 10px',
          cursor: 'pointer', fontSize: '16px'
        }}>
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;