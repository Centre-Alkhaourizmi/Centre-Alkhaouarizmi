# Centre Alkhaouarizmi — Landing page

Page d'atterrissage bilingue (français / arabe) pour le Centre Alkhaouarizmi, Tanger.
Objectif unique : présenter le centre et récolter des inscriptions dans une Google Sheet.

```
landing-page/
├── index.html                    ← la page complète (HTML + CSS + JS inline)
├── apps-script.gs                ← code Google Apps Script (réception du formulaire)
├── README.md
└── assets/
    ├── logo.png                  ← logo horizontal du centre
    └── hero-placeholder.svg      ← image temporaire du hero (à remplacer par une photo)
```

Aucune dépendance, aucun build : ouvrir `index.html` dans un navigateur suffit.

---

## 1. Le formulaire est connecté à Google Sheets

**C'est déjà en place et testé de bout en bout** — un envoi depuis la page arrive bien dans la feuille.

- Feuille : **[Centre Alkhaouarizmi — Inscriptions](https://docs.google.com/spreadsheets/d/1LTQy5aL0Sw7tZY9bWjmsYPK0gAUQZkwweUmEAWq_BKg/edit)**
  (onglet `Inscriptions`, colonnes **Date · Nom · Niveau · Téléphone · Matière · Message**)
- Web App déployé, `SCRIPT_URL` renseignée dans `index.html` (en haut du `<script>`).

Le script est dans `apps-script.gs`, lié au classeur via **Extensions → Apps Script**.

**Après toute modification de `apps-script.gs`** : collez la nouvelle version dans l'éditeur,
puis **Déployer → Gérer les déploiements → Modifier (crayon) → Version : Nouvelle version →
Déployer**. L'URL `/exec` ne change pas, donc rien à retoucher dans `index.html`.

**Si les inscriptions cessent d'arriver**, ouvrez l'URL `/exec` dans un navigateur : elle doit
répondre `{"result":"ok",...}`. Si elle demande une connexion, c'est que le déploiement n'est
plus sur *Qui a accès : Tout le monde*.

L'envoi utilise `mode: 'no-cors'` : le navigateur ne peut pas lire la réponse d'Apps Script.
La page considère donc l'envoi comme réussi dès que la requête est partie — c'est le
fonctionnement normal de ce montage, la Sheet reste la source de vérité.

Les champs sont transmis sous les noms `nom`, `niveau`, `telephone`, `matiere`, `message`
(attributs `name` du formulaire). Si vous renommez un champ dans `index.html`, changez-le
aussi dans `apps-script.gs`.

---

## 2. Mise en ligne

Hébergement statique classique : déposez le dossier tel quel sur Netlify, Vercel,
GitHub Pages, ou en FTP chez un hébergeur mutualisé. `index.html` doit rester à la racine,
à côté du dossier `assets/`.

Avant la mise en ligne, remplacez dans `index.html` :

- `og:url` — l'URL définitive du site ;
- `og:image` / `twitter:image` — une vraie image de partage (1200 × 630 px) ;
- les liens Instagram / Facebook / TikTok du footer (actuellement les pages d'accueil) ;
- le numéro `06 12 34 56 78` (header, hero `tel:`, footer, WhatsApp `wa.me/212612345678`)
  si le numéro définitif diffère.

---

## 3. Contenu et personnalisation

**Textes FR / AR** — tout le contenu vit dans l'objet `I18N` en haut du `<script>`, en deux
blocs `fr` et `ar`. Les éléments de la page portent un `data-i18n="clé"` correspondant.
Pour modifier un texte, il suffit de changer la valeur dans les deux langues.

**Langue par défaut — l'arabe.** Le HTML est servi en `lang="ar" dir="rtl"` avec les textes
arabes déjà en place : la page s'affiche correctement dès le premier pixel, même avant que le
JavaScript ne s'exécute (et même s'il est désactivé). Le choix du visiteur est ensuite mémorisé
dans `localStorage` et prend le dessus à la visite suivante. Le passage en français repasse la
page en `dir="ltr"` — toute la mise en page se retourne : logo, hero, formulaire, flèches.

Pour repasser le défaut au français : dans `index.html`, mettez `const DEFAULT_LANG = 'fr';`
(bas du `<script>`). Le premier affichage restera en arabe une fraction de seconde, sauf à
remettre aussi les textes statiques et `<html lang="fr" dir="ltr">` en français.

**Polices** — SF Pro pour le latin, SF Arabic pour l'arabe. Ce sont des polices système
Apple : aucune requête réseau, rendu natif sur macOS / iOS. Sur Windows et Android, la pile
de repli utilise Segoe UI / Roboto / Noto Naskh Arabic.

**Photo du hero** — `assets/hero-placeholder.svg` est une illustration temporaire.
Remplacez-la par une vraie photo (`assets/hero.jpg`, format ~5:4, 1000 px de large minimum)
et mettez à jour le `src` dans la section hero.

**Validation du téléphone** — accepte les formats marocains `06…`, `07…`, `05…`,
avec ou sans espaces, ainsi que `+212…` et `00212…`.

---

## 4. Accessibilité et responsive

- HTML sémantique, `lang` / `dir` synchronisés avec la langue active, labels associés à
  chaque champ, erreurs annoncées via `aria-invalid` + `aria-describedby`, confirmation en
  `role="status"`.
- Icônes en SVG inline, décoratives (`aria-hidden`) ou accompagnées d'un texte accessible.
- Sous 768 px : une seule colonne, en-tête replié en menu burger, champs du formulaire
  empilés. Le mouvement est désactivé si `prefers-reduced-motion` est actif.
