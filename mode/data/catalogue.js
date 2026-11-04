/* ==========================================================================
   CATALOGUE — le SEUL fichier à modifier pour faire vivre le site.
   --------------------------------------------------------------------------
   • Ajouter une pièce      → copier un bloc dans `pieces` et changer les valeurs
   • Ajouter une collection → ajouter un bloc dans `collections`
   • Annoncer un pop-up     → ajouter un bloc dans `popups`
   Les photos vont dans le dossier mode/images/ (voir mode/README.md).
   Les pièces ci-dessous sont illustrées par vos croquis : remplacez noms, tailles,
   statuts et photos par les vraies informations.
   ========================================================================== */

window.CATALOGUE = {

  /* --- Identité de la marque ------------------------------------------- */
  marque: {
    nom: "Nom de la marque",
    signature: "Créations couture & pièces de défilé",
    accroche: "Wax, velours et tulle : des pièces de défilé et des prototypes pensés comme des œuvres, en exemplaire unique.",
    presentation: "Chaque pièce présentée ici a été imaginée, coupée et assemblée à l'atelier. La plupart existent en un seul exemplaire et dans une seule taille. Certaines peuvent être reproduites sur commande, à vos mesures.",
    email: "contact@exemple.com",
    instagram: "https://instagram.com/votre-compte",
    ville: "Paris"
    // logo: "logo.png"   ← décommentez et placez le fichier dans images/ pour remplacer le nom écrit
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
    { id: "defile-2025", titre: "Défilé 2025",      famille: "creation",      annee: 2025, visible: true,
      description: "Les silhouettes présentées lors du défilé 2025." },
    { id: "prototypes",  titre: "Prototypes",       famille: "creation",      annee: 2024, visible: true,
      description: "Recherches de formes, de matières et de construction." },
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
      ref: "DF-01", nom: "Robe à traîne velours", collection: "defile-2025",
      categorie: "Robe", statut: "archive", taille: "36",
      matieres: ["Velours vert", "Plumes orange", "Wax"],
      description: "Robe longue en velours vert, poignets et ourlet de traîne bordés de plumes orange.",
      photos: ["croquis-robe-traine-verte.jpg"], prix: null, enAvant: true
    },
    {
      ref: "DF-02", nom: "Robe sirène wax", collection: "defile-2025",
      categorie: "Robe", statut: "disponible", taille: "38",
      matieres: ["Wax orange", "Doublure satin"],
      description: "Fourreau sirène en wax orange, col drapé et évasé en corolle au bas de la jambe.",
      photos: ["croquis-robe-sirene-orange.jpg"], prix: null, enAvant: true
    },
    {
      ref: "DF-03", nom: "Bustier vert & volute", collection: "defile-2025",
      categorie: "Haut", statut: "archive", taille: "S",
      matieres: ["Velours vert", "Organza orange"],
      description: "Bustier plongeant en velours, épaule enveloppée d'une volute d'organza dégradé.",
      photos: ["croquis-bustier-vert.jpg"], prix: null, enAvant: true
    },
    {
      ref: "DF-04", nom: "Cape à épaules structurées", collection: "defile-2025",
      categorie: "Cape", statut: "sur-commande", taille: "Unique",
      matieres: ["Wax orange", "Velours vert"],
      description: "Cape longue à épaulettes architecturées, col en velours vert. Reproductible sur commande.",
      photos: ["croquis-cape-orange.jpg"], prix: null, enAvant: true
    },
    {
      ref: "DF-05", nom: "Redingote wax perlée", collection: "defile-2025",
      categorie: "Manteau", statut: "disponible", taille: "M",
      matieres: ["Wax orange", "Tissu perlé vert"],
      description: "Redingote longue fendue, revers et poignets en tissu perlé vert.",
      photos: ["croquis-redingote-wax.jpg", "croquis-manteau-wax.jpg"], prix: null, enAvant: true
    },
    {
      ref: "PR-01", nom: "Tunique bicolore", collection: "prototypes",
      categorie: "Haut", statut: "reservee", taille: "M",
      matieres: ["Wax orange", "Velours vert"],
      description: "Prototype de tunique asymétrique, moitié wax, moitié velours.",
      photos: ["croquis-tunique-bicolore.jpg"], prix: null, enAvant: false
    },
    {
      ref: "PR-02", nom: "Chemise tulle croisé", collection: "prototypes",
      categorie: "Ensemble", statut: "disponible", taille: "L",
      matieres: ["Coton blanc", "Tulle vert", "Wax orange"],
      description: "Chemise blanche ceinturée d'un croisé de tulle vert et wax, pantalon droit orange.",
      photos: ["croquis-chemise-tulle.jpg"], prix: null, enAvant: false
    },
    {
      ref: "PR-03", nom: "Ensemble cargo", collection: "prototypes",
      categorie: "Ensemble", statut: "vendue", taille: "L",
      matieres: ["Toile", "Poches en wax orange"],
      description: "Étude streetwear : cargo ample, poches plaquées en wax.",
      photos: ["croquis-ensemble-cargo.jpg"], prix: null, enAvant: false
    },
    {
      ref: "PR-04", nom: "Veste velours", collection: "prototypes",
      categorie: "Veste", statut: "archive", taille: "M",
      matieres: ["Velours vert", "Wax"],
      description: "Prototype de veste courte en velours, poche passepoilée en wax.",
      photos: ["croquis-veste-velours.jpg"], prix: null, enAvant: false
    },

    /* Exemple de modèle PRÊT-À-PORTER (collection masquée pour l'instant) */
    {
      ref: "CA01-01", nom: "Chemise wax (exemple)", collection: "capsule-01",
      categorie: "Chemise", statut: "bientot",
      tailles: [ { taille: "XS", stock: 2 }, { taille: "S", stock: 4 }, { taille: "M", stock: 4 }, { taille: "L", stock: 1 }, { taille: "XL", stock: 0 } ],
      matieres: ["Coton", "Wax"],
      description: "Exemple de modèle décliné en plusieurs tailles. Passez la collection capsule-01 en visible: true pour le voir.",
      photos: ["croquis-chemise-tulle.jpg"], prix: 180, enAvant: false
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
