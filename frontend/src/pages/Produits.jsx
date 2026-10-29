import { useEffect, useState } from 'react';
import api from '../api';

function Produits() {
  const [produits, setProduits]   = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('Tous');
  const [loading, setLoading]     = useState(true);
  const [erreur, setErreur]       = useState('');
  const [erreurPublication, setErreurPublication] = useState('');
  const [publicationEnCours, setPublicationEnCours] = useState(false);
  const [formulaire, setFormulaire] = useState({
    nom: '', prix: '', quantite: '', categorie: '', description: ''
  });
  const [tentative, setTentative] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    let actif = true;
    api.get('/produits')
      .then(res => {
        if (!Array.isArray(res.data)) {
          throw new Error('La réponse de l’API produits est invalide.');
        }
        if (actif) setProduits(res.data);
      })
      .catch(error => {
        console.error('Erreur de chargement des produits :', error);
        if (actif) setErreur('Impossible de charger les produits. Vérifiez la connexion au serveur puis réessayez.');
      })
      .finally(() => {
        if (actif) setLoading(false);
      });
    return () => { actif = false; };
  }, [tentative]);

  const getImage = (nom) => {
    const n = nom.toLowerCase();
    if (n.includes('maïs') || n.includes('mais')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400';
    if (n.includes('riz'))       return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';


    if (n.includes('tomate'))    return 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400';
    if (n.includes('oignon'))    return 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400';

    if (n.includes('piment'))    return 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400';

    if (n.includes('chou'))      return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400';
    if (n.includes('carotte'))   return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400';
    if (n.includes('concombre')) return 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400';

    if (n.includes('épinard') || n.includes('epinard')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400';
    if (n.includes('laitue'))    return 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400';
    if (n.includes('poivron'))   return 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400';
    if (n.includes('mangue'))    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400';
    if (n.includes('banane'))    return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400';
    if (n.includes('pastèque') || n.includes('pasteque')) return 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400';
    if (n.includes('citron'))    return 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400';
    if (n.includes('papaye'))    return 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400';
    if (n.includes('ananas'))    return 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400';
    if (n.includes('goyave'))    return 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400';
    if (n.includes('orange'))    return 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400';
    if (n.includes('fraise'))    return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400';
    if (n.includes('arachide'))  return 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400';



    if (n.includes('pomme de terre')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400';

    if (n.includes('ail'))       return 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400';
    if (n.includes('pomme'))     return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400';
    return 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400';
  };

  const categories = [
    'Tous',
    ...new Set(produits.map(produit => produit.categorie).filter(Boolean))
  ];

  const produitsFiltres = produits.filter(p => {
    const nom = (p.nom || '').toLowerCase();
    const categorieProduit = p.categorie || '';
    const matchRecherche = nom.includes(recherche.toLowerCase()) ||
                           categorieProduit.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie = categorie === 'Tous' || categorieProduit === categorie;
    return matchRecherche && matchCategorie;
  });

  if (loading) return <p style={{ padding: '24px' }}>Chargement...</p>;

  const publierProduit = async () => {
    const nom = formulaire.nom.trim();
    const prix = Number(formulaire.prix);
    const quantite = Number(formulaire.quantite);
    const categorieProduit = formulaire.categorie.trim();

    if (!nom || !categorieProduit || !formulaire.prix || formulaire.quantite === '' ||
        !Number.isFinite(prix) || prix <= 0 ||
        !Number.isInteger(quantite) || quantite < 0) {
      setErreurPublication('Renseignez un nom, une catégorie, un prix positif et une quantité entière positive ou nulle.');
      return;
    }

    if (!user || user.type !== 'Agriculteur' || !localStorage.getItem('token')) {
      setErreurPublication('Connectez-vous avec un compte agriculteur pour publier un produit.');
      return;
    }

    setPublicationEnCours(true);
    setErreurPublication('');
    try {
      const res = await api.post('/produits', {
        ...formulaire,
        nom,
        prix,
        quantite,
        categorie: categorieProduit
      });
      setProduits(prev => [...prev, {
        ...formulaire,
        nom,
        prix,
        quantite,
        categorie: categorieProduit,
        id: res.data.id
      }]);
      setFormulaire({ nom: '', prix: '', quantite: '', categorie: '', description: '' });
    } catch (error) {
      console.error('Erreur de publication du produit :', error);
      setErreurPublication('La publication a échoué. Vérifiez les informations et réessayez.');
    } finally {
      setPublicationEnCours(false);
    }
  };

  return (
    <div className="products-page">
      <h2 style={{ marginBottom: '16px' }}>🌾 Nos Produits ({produitsFiltres.length})</h2>
      {erreur && (
        <div role="alert" style={{ marginBottom: '16px', color: '#791F1F', background: '#FCEBEB', padding: '12px', borderRadius: '8px' }}>
          {erreur}
          {!loading && (
            <button type="button" onClick={() => {
              setErreur('');
              setLoading(true);
              setTentative(value => value + 1);
            }} style={{ marginLeft: '12px' }}>
              Réessayer
            </button>
          )}
        </div>
      )}

      {/* 🔍 BARRE DE RECHERCHE */}
      <div style={{ marginBottom: '14px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher (ex: maïs, tomate, mangue...)"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '2px solid #1D9E75', fontSize: '14px', outline: 'none' }}
        />
        {recherche && (
          <button onClick={() => setRecherche('')} style={{ padding: '12px 16px', background: '#ddd', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
            ✕
          </button>
        )}
      </div>

      {/* 🏷️ FILTRES PAR CATÉGORIE */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategorie(cat)} style={{
            padding: '6px 16px', borderRadius: '99px', border: '1px solid #1D9E75',
            background: categorie === cat ? '#1D9E75' : 'transparent',
            color: categorie === cat ? '#fff' : '#1D9E75',
            cursor: 'pointer', fontSize: '13px', fontWeight: categorie === cat ? 'bold' : 'normal'
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ➕ PUBLIER — agriculteurs seulement */}
      {user?.type === 'Agriculteur' && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #1D9E75', borderRadius: '12px', background: '#F0FBF7' }}>
          <h3 style={{ color: '#085041', marginBottom: '12px' }}>➕ Publier un produit</h3>
          <div className="product-form-grid">
            <input placeholder="Nom du produit" value={formulaire.nom} onChange={e => setFormulaire({ ...formulaire, nom: e.target.value })} required maxLength={150} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="Prix en FCFA" type="number" min="1" step="1" value={formulaire.prix} onChange={e => setFormulaire({ ...formulaire, prix: e.target.value })} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="Quantité" type="number" min="0" max="2147483647" step="1" value={formulaire.quantite} onChange={e => setFormulaire({ ...formulaire, quantite: e.target.value })} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="Catégorie" value={formulaire.categorie} onChange={e => setFormulaire({ ...formulaire, categorie: e.target.value })} required maxLength={100} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input placeholder="Description" value={formulaire.description} onChange={e => setFormulaire({ ...formulaire, description: e.target.value })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', gridColumn: '1 / -1' }} />
          </div>
          {erreurPublication && <p role="alert" style={{ color: '#791F1F', marginBottom: '10px' }}>{erreurPublication}</p>}
          <button onClick={publierProduit} disabled={publicationEnCours} style={{ padding: '10px 24px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {publicationEnCours ? 'Publication...' : 'Publier'}
          </button>
        </div>
      )}

      {/* GRILLE PRODUITS */}
      {!erreur && produitsFiltres.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
          Aucun produit trouvé pour "{recherche}" 😕
        </p>
      ) : !erreur && (
        <div className="products-grid fade-in">
          {produitsFiltres.map(p => (

          <div key={p.id} className="card-hover card" style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '14px', background: '#fff' }}>
          <img
                src={getImage(p.nom)}
                alt={p.nom}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400'; }}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
              />
              <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>{p.nom}</h3>
              <p style={{ color: '#1D9E75', fontWeight: 'bold', fontSize: '15px' }}>{Number(p.prix).toLocaleString('fr-FR')} FCFA</p>
              <p style={{ color: '#888', fontSize: '12px' }}>Qté : {p.quantite} · {p.categorie}</p>
              <span style={{
                display: 'inline-block', marginTop: '6px', padding: '2px 10px',
                borderRadius: '99px', fontSize: '11px',
                background: p.quantite > 0 ? '#EAF3DE' : '#FCEBEB',
                color: p.quantite > 0 ? '#27500A' : '#791F1F'
              }}>
                {p.quantite > 0 ? 'Disponible' : 'Épuisé'}
              </span>
              {p.quantite > 0 && (
                <button onClick={async () => {
                  const user = JSON.parse(localStorage.getItem('user'));
                  if (!user) { alert('Connectez-vous d\'abord !'); return; }
                  const panier = JSON.parse(localStorage.getItem('panier')) || [];
                  const existant = panier.find(item => item.id === p.id);
                  if (existant) {
                    existant.quantite += 1;
                  } else {
                    panier.push({ id: p.id, nom: p.nom, prix: p.prix, quantite: 1, image: getImage(p.nom) });
                  }
                  localStorage.setItem('panier', JSON.stringify(panier));
                  alert(`${p.nom} ajouté au panier ! 🛒`);
                }} style={{
                  marginTop: '8px', width: '100%', padding: '7px',
                  background: '#085041', color: '#fff', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                }}>
                  🛒 Ajouter au panier

                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Produits;