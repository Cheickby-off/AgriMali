import { useState } from 'react';

function Forum() {
  const user = JSON.parse(localStorage.getItem('user'));
  const key = 'forum_posts';
  const [posts, setPosts] = useState(JSON.parse(localStorage.getItem(key)) || [
    { id: 1, auteur: 'Coulibaly Sira', type: 'Agriculteur', titre: 'Meilleure période pour planter le maïs ?', contenu: 'Bonjour à tous, je voulais savoir quelle est la meilleure période pour planter le maïs à Sikasso cette année ?', date: '2026-06-01', likes: 5, reponses: [
      { id: 1, auteur: 'Diakite Cheick', contenu: 'En général juin-juillet est la meilleure période avec les premières pluies.', date: '2026-06-01' }
    ]},
    { id: 2, auteur: 'Doumbia Sitan', type: 'Agriculteur', titre: 'Prix du riz en hausse à Mopti', contenu: 'J\'ai remarqué que le prix du riz a augmenté de 20% ce mois-ci à Mopti. Quelqu\'un a des informations ?', date: '2026-06-02', likes: 8, reponses: [] },
    { id: 3, auteur: 'Fall Zeïnabou', type: 'Agriculteur', titre: 'Conseil pour protéger les mangues', contenu: 'Mes mangues sont attaquées par des insectes cette saison. Quels remèdes naturels conseillez-vous ?', date: '2026-06-03', likes: 12, reponses: [
      { id: 1, auteur: 'Simaga Fatoumata', contenu: 'Utilisez du savon de Marseille dilué dans de l\'eau, c\'est très efficace !', date: '2026-06-03' }
    ]},
  ]);

  const [form, setForm]           = useState({ titre: '', contenu: '' });
  const [reponseForm, setReponseForm] = useState({});
  const [postOuvert, setPostOuvert]   = useState(null);
  const [message, setMessage]         = useState('');

  const publierPost = () => {
    if (!form.titre || !form.contenu) { alert('Remplis tous les champs !'); return; }
    if (!user) { alert('Connectez-vous d\'abord !'); return; }
    const nouveau = {
      id: Date.now(), auteur: user.nom, type: user.type,
      titre: form.titre, contenu: form.contenu,
      date: new Date().toISOString().split('T')[0],
      likes: 0, reponses: []
    };
    const updated = [nouveau, ...posts];
    setPosts(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setForm({ titre: '', contenu: '' });
    setMessage('✅ Post publié !');
    setTimeout(() => setMessage(''), 3000);
  };

  const liker = (id) => {
    const updated = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const repondre = (postId) => {
    const contenu = reponseForm[postId];
    if (!contenu) return;
    if (!user) { alert('Connectez-vous d\'abord !'); return; }
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, reponses: [...p.reponses, { id: Date.now(), auteur: user.nom, contenu, date: new Date().toISOString().split('T')[0] }] };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setReponseForm({ ...reponseForm, [postId]: '' });
  };

  const getBadge = (type) => {
    if (type === 'Agriculteur') return { bg: '#EAF3DE', color: '#27500A', label: '🌾 Agriculteur' };
    if (type === 'Acheteur')    return { bg: '#FFF3E0', color: '#633806', label: '🛒 Acheteur' };
    return { bg: '#E6F1FB', color: '#0C447C', label: '⚙️ Admin' };
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>🌾 Forum AgriMali</h2>

      {/* Nouveau post */}
      <div style={{ border: '1px solid #1D9E75', borderRadius: '12px', padding: '20px', background: '#F0FBF7', marginBottom: '24px' }}>
        <h3 style={{ color: '#085041', marginBottom: '14px' }}>✍️ Nouveau sujet</h3>
        <input
          placeholder="Titre de votre question ou sujet..."
          value={form.titre}
          onChange={e => setForm({ ...form, titre: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', fontSize: '14px' }}
        />
        <textarea
          placeholder="Décrivez votre question ou partagez votre expérience..."
          value={form.contenu}
          onChange={e => setForm({ ...form, contenu: e.target.value })}
          rows={4}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box', fontSize: '14px', resize: 'none' }}
        />
        {message && <p style={{ color: '#27500A', marginBottom: '8px' }}>{message}</p>}
        <button onClick={publierPost} style={{ padding: '10px 24px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Publier
        </button>
      </div>

      {/* Liste posts */}
      {posts.map(p => {
        const badge = getBadge(p.type);
        return (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '18px', marginBottom: '14px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{p.titre}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{p.auteur}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: badge.bg, color: badge.color }}>{badge.label}</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>{p.date}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#444', marginBottom: '12px', lineHeight: '1.6' }}>{p.contenu}</p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => liker(p.id)} style={{ background: '#EAF3DE', border: 'none', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '13px', color: '#27500A' }}>
                👍 {p.likes}
              </button>
              <button onClick={() => setPostOuvert(postOuvert === p.id ? null : p.id)} style={{ background: '#E6F1FB', border: 'none', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '13px', color: '#0C447C' }}>
                💬 {p.reponses.length} réponse{p.reponses.length !== 1 ? 's' : ''}
              </button>
            </div>

            {/* Réponses */}
            {postOuvert === p.id && (
              <div style={{ marginTop: '14px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
                {p.reponses.map(r => (
                  <div key={r.id} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{r.auteur}</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#444' }}>{r.contenu}</p>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    placeholder="Votre réponse..."
                    value={reponseForm[p.id] || ''}
                    onChange={e => setReponseForm({ ...reponseForm, [p.id]: e.target.value })}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                  />
                  <button onClick={() => repondre(p.id)} style={{ padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    Répondre
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Forum;