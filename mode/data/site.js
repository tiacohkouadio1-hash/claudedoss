/* ==========================================================================
   LA MAISON — ce qui est commun aux deux univers (mode & décoration).
   `scenes`  : la roue de l'accueil — chaque scène = un nom, une photo plein écran
               et deux lignes d'infos, comme les adresses d'une maison de restaurants.
   `univers` : les grandes cartes « Explorer » (mode, décoration…).
   ========================================================================== */
window.SITE = {
  maison: {
    surTitre: "Paris",               // petite ligne sous le logo
    nom: "IYAM",                     // le logo IY✂M est dessiné automatiquement à partir de ce nom
    // logo: "logo.png",             // ← ou un logo (fichier dans images/)
    presentation: "IYAM est une maison de création parisienne à deux visages : la mode, avec des pièces de défilé et des créations en exemplaire unique, et la décoration d'événements, pour faire de chaque moment un souvenir."
  },

  univers: [
    {
      id: "mode",
      titre: "Mode",
      sousTitre: "IYAM Paris · Créations & défilés",
      infos: ["Pièces uniques", "Prêt-à-porter à venir"],
      motsCles: ["Défilés", "Prototypes", "Prêt-à-porter"],
      image: "mode-wax-plumes-face.jpg",
      lien: "catalogue.html",
      bouton: "Voir le catalogue"
    },
    {
      id: "decoration",
      titre: "Décoration",
      sousTitre: "IYAM Décoration",
      infos: ["Petits & moyens événements", "Sur-mesure"],
      motsCles: ["Anniversaire", "Baptême", "Baby shower"],
      image: "deco-arche-anniversaire.jpg",
      lien: "decoration.html",
      bouton: "Découvrir IYAM"
    }
  ],

  /* Roue de l'accueil : ajoutez, retirez ou réordonnez librement les scènes */
  scenes: [
    { titre: "Défilé",          image: "mode-wax-plumes-escalier.jpg",  lignes: ["IYAM Paris", "Pièces de défilé"],              lien: "catalogue.html?collection=defile" },
    { titre: "Décoration",      image: "deco-arche-anniversaire.jpg",   lignes: ["IYAM Décoration créative", "Petits & moyens événements"], lien: "decoration.html" },
    { titre: "Créations",       image: "mode-lin-passepoil-face.jpg",   lignes: ["Pièces uniques", "Prêt-à-porter à venir"],     lien: "catalogue.html?collection=creations" },
    { titre: "Art de la table", image: "deco-table-fleurs.jpg",         lignes: ["Tables & espaces", "Devis gratuit sur demande"], lien: "decoration.html#prestations" },
    { titre: "Wax",             image: "mode-gilet-wax.jpg",            lignes: ["Gilet wax", "Pièce unique · disponible"],      lien: "piece.html?ref=CR-02" },
    { titre: "Anniversaire",    image: "deco-chiffres-lumineux.jpg",    lignes: ["Ballons & mise en scène", "Chiffres lumineux"], lien: "decoration.html#galerie" }
  ]
};
