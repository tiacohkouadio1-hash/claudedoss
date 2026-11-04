/* ==========================================================================
   CATALOGUE — le SEUL fichier à modifier pour faire vivre le site.
   --------------------------------------------------------------------------
   • Ajouter une pièce      → copier un bloc dans `pieces` et changer les valeurs
   • Ajouter une collection → ajouter un bloc dans `collections`
   • Annoncer un pop-up     → ajouter un bloc dans `popups`
   Les photos vont dans le dossier mode/images/ (voir mode/README.md).
   Les pièces ci-dessous viennent de vos photos : vérifiez noms, tailles,
   statuts et matières (« À préciser » = information manquante).
   ========================================================================== */

window.CATALOGUE = {

  /* --- Identité de la marque de mode (le nom de la maison est dans site.js) ------------------------------------------- */
  marque: {
    nom: "IYAM Paris",
    signature: "Créations couture & pièces de défilé",
    accroche: "Wax, velours, tulle et plumes : des pièces de défilé et des prototypes pensés comme des œuvres, en exemplaire unique.",
    presentation: "Chaque pièce présentée ici a été imaginée, coupée et assemblée à l'atelier, à Paris. La plupart existent en un seul exemplaire et dans une seule taille. Certaines peuvent être reproduites sur commande, à vos mesures.",
    email: "iyam.deco@gmail.com",                 // ← à remplacer si la mode a sa propre adresse
    instagram: "https://instagram.com/iyam_deco", // ← idem pour le compte Instagram mode
    ville: "Paris"
  },

  /* --- Réglages d'affichage -------------------------------------------- */
  reglages: {
    // Ordre des grandes familles sur l'accueil et dans le catalogue.
    // Inversez-le le jour où le prêt-à-porter devient l'offre principale :
    // ["pret-a-porter", "creation"]
    ordreFamilles: ["creation", "pret-a-porter"],
    afficherPrix: false,            // true pour afficher les prix renseignés
    devise: "€",
    afficherPiecesArchivees: true   // pièces de défilé non disponibles (montrées comme portfolio)
  },

  /* --- Familles ---------------------------------------------------------
     "creation"      : prototypes & pièces de défilé, exemplaire unique
     "pret-a-porter" : modèles déclinés en plusieurs tailles, avec stock   */
  familles: {
    "creation":      { titre: "Créations & défilés", description: "Prototypes et pièces de défilé, en exemplaire unique." },
    "pret-a-porter": { titre: "Prêt-à-porter",       description: "Modèles disponibles en plusieurs tailles, en ligne et lors de nos pop-up stores." }
  },

  /* --- Collections ------------------------------------------------------
     visible: false → la collection et ses pièces restent cachées
     (pratique pour préparer une collection avant son lancement).        */
  collections: [
    { id: "defile",      titre: "Pièces de défilé", famille: "creation",      annee: null, visible: true,
      description: "Les silhouettes créées pour le défilé : wax, tulle, velours et plumes." },
    { id: "creations",   titre: "Créations",        famille: "creation",      annee: null, visible: true,
      description: "Prototypes et pièces uniques, entre couture et vestiaire de tous les jours." },
    { id: "capsule-01",  titre: "Capsule 01",       famille: "pret-a-porter", annee: 2026, visible: false,
      description: "Première capsule de prêt-à-porter — bientôt disponible." }
  ],

  /* --- Pièces -----------------------------------------------------------
     ref         : référence unique (sert aussi d'adresse de la fiche)
     statut      : "disponible" | "reservee" | "vendue" | "archive" | "sur-commande" | "bientot"
                   (archive = pièce de défilé montrée mais non à vendre)
     taille      : pour une pièce unique → une seule taille (ex. "38", "M", "Unique")
     tailles     : pour le prêt-à-porter → [{ taille: "S", stock: 3 }, …]
     photos      : noms de fichiers dans mode/images/ (la 1re = photo principale)
     prix        : nombre ou null (affiché seulement si reglages.afficherPrix)
     enAvant     : true → mise en avant sur la page d'accueil                */
  pieces: [
    {
      ref: "DF-01", nom: "Ensemble wax, velours & plumes", collection: "defile",
      categorie: "Ensemble", statut: "archive", taille: "À préciser",
      matieres: ["Wax orange", "Tulle orange", "Velours vert", "Plumes"],
      description: "Bustier en velours vert rehaussé de plumes orange, jupe à volants superposés en wax et longue traîne de tulle.",
      photos: ["mode-wax-plumes-face.jpg", "mode-wax-plumes-escalier.jpg", "mode-wax-plumes-miroir.jpg", "mode-wax-plumes-escalier-2.jpg", "mode-wax-plumes-escalier-3.jpg"],
      prix: null, enAvant: true
    },
    {
      ref: "CR-01", nom: "Ensemble lin passepoilé", collection: "creations",
      categorie: "Ensemble", statut: "disponible", taille: "À préciser",
      matieres: ["Lin gris", "Passepoil orange"],
      description: "Veste kimono à manches courtes et pantalon droit en lin, soulignés d'un passepoil orange.",
      photos: ["mode-lin-passepoil-face.jpg", "mode-lin-passepoil-profil.jpg"], prix: null, enAvant: true
    },
    {
      ref: "CR-02", nom: "Gilet wax", collection: "creations",
      categorie: "Gilet", statut: "disponible", taille: "À préciser",
      matieres: ["Wax orange"],
      description: "Gilet ajusté sans manches en wax orange, à porter sur un col roulé.",
      photos: ["mode-gilet-wax.jpg"], prix: null, enAvant: true
    },
    {
      ref: "CR-03", nom: "Bustier wax", collection: "creations",
      categorie: "Haut", statut: "disponible", taille: "À préciser",
      matieres: ["Wax orange"],
      description: "Bustier drapé en wax, à porter seul ou par-dessus un manteau comme une ceinture-corset.",
      photos: ["mode-bustier-wax.jpg"], prix: null, enAvant: true
    },
    {
      ref: "CR-04", nom: "Robe bustier camel", collection: "creations",
      categorie: "Robe", statut: "disponible", taille: "À préciser",
      matieres: ["Tissu effet python camel"],
      description: "Robe courte à bonnets structurés et fente sur la cuisse, en tissu effet python.",
      photos: ["mode-robe-bustier-camel.jpg"], prix: null, enAvant: true
    },

    /* Exemple de modèle PRÊT-À-PORTER (collection masquée tant que visible: false) */
    {
      ref: "CA01-01", nom: "Gilet wax (prêt-à-porter)", collection: "capsule-01",
      categorie: "Gilet", statut: "bientot",
      tailles: [ { taille: "XS", stock: 2 }, { taille: "S", stock: 4 }, { taille: "M", stock: 4 }, { taille: "L", stock: 1 }, { taille: "XL", stock: 0 } ],
      matieres: ["Wax"],
      description: "Exemple : le gilet wax décliné en plusieurs tailles. Passez capsule-01 en visible: true pour le voir.",
      photos: ["mode-gilet-wax.jpg"], prix: 120, enAvant: false
    }
  ],

  /* --- Pop-up stores ----------------------------------------------------
     Les dates passées sont automatiquement classées dans « Précédents ».  */
  popups: [
    // { titre: "Pop-up d'hiver", lieu: "Galerie Exemple", adresse: "12 rue Exemple, Paris",
    //   debut: "2026-12-05", fin: "2026-12-07", horaires: "11h – 19h",
    //   description: "Pièces de défilé et premières tailles de la Capsule 01.", collections: ["capsule-01"] }
  ]
};
