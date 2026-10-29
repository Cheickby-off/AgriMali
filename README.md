# AgriMali

Application web React/Vite avec une API Node.js/Express et une base MySQL.

## Développement local

1. Crée la base de données en exécutant `backend/database.sql` dans MySQL.
2. Copie `backend/.env.example` vers `backend/.env`, puis renseigne les identifiants MySQL et un secret JWT aléatoire.
3. Lance l’API depuis `backend/` avec `npm install` puis `npm start`.
4. Copie `frontend/.env.example` vers `frontend/.env`. En local, le proxy Vite dirige `/api` vers `http://localhost:3000`.
5. Lance l’interface depuis `frontend/` avec `npm install` puis `npm run dev`.

## Déploiement GitHub Pages

- Dans **Settings → Pages**, définis **Source** sur **GitHub Actions**.
- Le workflow `.github/workflows/deploy-pages.yml` construit automatiquement `frontend/` à chaque changement publié sur `main`, puis déploie le résultat sur `https://cheickby-off.github.io/AgriMali/`.
- Si l’API Railway est prête, ajoute `VITE_API_URL` dans les **Variables** du dépôt GitHub avec l’URL complète se terminant par `/api`. Sans API configurée, l’interface s’affiche mais les données et connexions à l’API ne fonctionneront pas.
- Après chaque déploiement, vérifie l’exécution du workflow dans l’onglet **Actions** du dépôt.

## Déploiement Vercel

- Importe le dépôt GitHub dans Vercel et définis `frontend` comme **Root Directory**.
- Vercel détecte Vite ; la configuration `frontend/vercel.json` redirige les routes React vers `index.html`.
- Renseigne `VITE_API_URL` dans les variables d’environnement Vercel avec l’URL complète de l’API, par exemple `https://api.example.com/api`.
- Pour Railway, crée un service MySQL et un service Node depuis ce dépôt avec `backend` comme répertoire racine. Le service Node démarre avec `npm start`. Importe `backend/database.sql` dans MySQL et mappe ses valeurs de connexion vers `DB_HOST`, `DB_USER`, `DB_PASSWORD` et `DB_NAME`.
- Configure aussi `PORT`, `JWT_SECRET` et `FRONTEND_URL` dans le service API Railway. `FRONTEND_URL` doit contenir l’URL exacte du frontend publié (Vercel ou GitHub Pages) ; plusieurs origines peuvent être séparées par des virgules.
- `VITE_OPENWEATHER_API_KEY` configure la météo côté frontend : cette clé sera visible dans le navigateur. Crée une clé dédiée et limite-la par domaine/quotas chez le fournisseur ; ne réutilise pas la clé précédemment inscrite dans le code.
- N’envoie jamais les fichiers `.env` ou les secrets sur GitHub.
