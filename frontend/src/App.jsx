import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Accueil        from './pages/Accueil';
import Produits       from './pages/Produits';
import Commandes      from './pages/Commandes';
import Dashboard      from './pages/Dashboard';
import Login          from './pages/Login';
import Panier         from './pages/Panier';
import Profil         from './pages/Profil';
import Notifications  from './pages/Notifications';
import Avis           from './pages/Avis';
import Forum          from './pages/Forum';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Accueil />} />
        <Route path="/produits"       element={<Produits />} />
        <Route path="/commandes"      element={<Commandes />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/panier"         element={<Panier />} />
        <Route path="/profil"         element={<Profil />} />
        <Route path="/notifications"  element={<Notifications />} />
        <Route path="/avis"           element={<Avis />} />
        <Route path="/forum"          element={<Forum />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;