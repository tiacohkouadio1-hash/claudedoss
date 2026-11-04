# Site catalogue — créations, défilés & prêt-à-porter

Site vitrine en forme de **catalogue évolutif** : il présente aujourd'hui les
prototypes et pièces de défilé (exemplaires uniques, une seule taille) et
accueillera demain le **prêt-à-porter** (plusieurs tailles, stocks) et les
**pop-up stores**, sans rien reconstruire.

Le site est statique (HTML/CSS/JS, aucune installation). Ouvrez `index.html` dans
un navigateur, ou lancez `python3 -m http.server` dans ce dossier.

## Le principe : un seul fichier à modifier

Tout le contenu se trouve dans **`data/catalogue.js`**. Les pages se construisent
toutes seules à partir de ce fichier.

| Je veux…                                  | Je modifie dans `data/catalogue.js`                       |
|-------------------------------------------|-----------------------------------------------------------|
| Changer le nom, l'e-mail, l'Instagram     | `marque`                                                  |
| Ajouter une pièce                         | copier un bloc dans `pieces`                              |
| Ajouter une collection                    | ajouter un bloc dans `collections`                        |
| Préparer une collection sans la montrer   | `visible: false` sur la collection                        |
| Marquer une pièce vendue / réservée       | `statut: "vendue"` / `"reservee"`                         |
| Annoncer un pop-up store                  | ajouter un bloc dans `popups`                             |
| Mettre le prêt-à-porter en premier        | `reglages.ordreFamilles: ["pret-a-porter", "creation"]`   |
| Afficher les prix                         | `reglages.afficherPrix: true`                             |
| Remplacer le nom écrit par un logo        | `marque.logo: "logo.png"` (fichier dans `images/`)        |

### Ajouter une pièce unique (création / défilé)

```js
{
  ref: "DF-06", nom: "Nom de la pièce", collection: "defile-2025",
  categorie: "Robe", statut: "disponible", taille: "38",
  matieres: ["Wax", "Velours"],
  description: "Quelques lignes sur la pièce.",
  photos: ["df-06-face.jpg", "df-06-dos.jpg"], prix: null, enAvant: false
},
```

### Ajouter un modèle de prêt-à-porter (plusieurs tailles)

La différence : `tailles` (avec le stock de chaque taille) remplace `taille`.

```js
{
  ref: "CA01-02", nom: "Veste courte", collection: "capsule-01",
  categorie: "Veste", statut: "disponible",
  tailles: [ { taille: "S", stock: 3 }, { taille: "M", stock: 0 }, { taille: "L", stock: 2 } ],
  matieres: ["Velours"], description: "…",
  photos: ["ca01-02.jpg"], prix: 220, enAvant: true
},
```

Une taille à `stock: 0` apparaît barrée (épuisée), et à 1 ou 2 en orange
(« dernières pièces »). Le filtre « Taille » du catalogue ne montre que les
tailles en stock.

### Les statuts

| Statut         | Affiché             | Bouton proposé                         |
|----------------|---------------------|----------------------------------------|
| `disponible`   | Disponible          | Demander cette pièce                   |
| `sur-commande` | Sur commande        | Commander à mes mesures                |
| `archive`      | Pièce de défilé     | Prêt, location ou version sur mesure   |
| `reservee`     | Réservée            | Demander une pièce similaire           |
| `vendue`       | Vendue              | Demander une pièce similaire           |
| `bientot`      | Bientôt             | Me prévenir de la sortie               |

Chaque bouton ouvre un e-mail déjà rempli avec la référence de la pièce.

## Les photos

- Placez-les dans `images/`, au format **portrait 3:4** (par exemple 1200 × 1600 px).
- Nommez-les d'après la référence : `df-06-face.jpg`, `df-06-dos.jpg`…
- La 1re photo est la photo principale. La 2e apparaît au survol dans le catalogue.
- Une pièce sans photo affiche un aplat wax/velours avec sa référence.
- Les visuels actuels sont **découpés dans vos croquis**, en attendant les photos.

## Les pages

| Page              | Contenu                                                                    |
|-------------------|----------------------------------------------------------------------------|
| `index.html`      | Diaporama plein écran des pièces `enAvant`, univers, sélection, prochain pop-up |
| `catalogue.html`  | Toutes les pièces, avec filtres (univers, collection, type, statut, taille) |
| `piece.html?ref=` | Fiche d'une pièce : photos, taille(s), matières, demande par e-mail        |
| `pop-up.html`     | Pop-up à venir et passés (classés automatiquement selon la date)           |
| `maison.html`     | Présentation et contact                                                    |

Les filtres du catalogue s'inscrivent dans l'adresse (ex.
`catalogue.html?collection=defile-2025`) : on peut partager un lien vers une
sélection, par exemple sur Instagram.

## Fichiers

```
mode/
├── data/catalogue.js   ← le contenu (à modifier)
├── images/             ← les photos
├── assets/style.css    ← couleurs et mise en page (palette dans :root)
├── assets/app.js       ← le moteur (pas besoin d'y toucher)
└── *.html              ← gabarits des pages
```

## Pour plus tard

- **Vente en ligne** : quand le prêt-à-porter démarrera, les fiches pourront
  recevoir un bouton de paiement (Stripe Payment Links, ou une boutique Shopify
  reliée par référence) sans changer la structure.
- **Modifier sans code** : le fichier de données peut être remplacé par une
  interface d'administration (Decap CMS) ou un tableur (Airtable / Google Sheets).
- **Mise en ligne** : GitHub Pages, Netlify ou Vercel, gratuitement.
