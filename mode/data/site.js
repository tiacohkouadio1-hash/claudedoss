/* ==========================================================================
   LA MAISON — ce qui est commun aux deux univers (mode & décoration).
   Chaque univers apparaît dans le diaporama d'accueil (une ou plusieurs photos),
   à la manière des « adresses » d'une maison de restaurants.
   Pour ajouter un 3e univers plus tard : ajouter un bloc dans `univers`.
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
      images: ["mode-wax-plumes-escalier.jpg", "mode-lin-passepoil-face.jpg", "mode-gilet-wax.jpg"],
      lien: "catalogue.html",
      bouton: "Voir le catalogue"
    },
    {
      id: "decoration",
      titre: "Décoration",
      sousTitre: "IYAM Décoration",
      infos: ["Petits & moyens événements", "Sur-mesure"],
      motsCles: ["Anniversaire", "Baptême", "Baby shower"],
      images: ["deco-arche-anniversaire.jpg", "deco-table-fleurs.jpg", "deco-chiffres-lumineux.jpg"],
      lien: "decoration.html",
      bouton: "Découvrir IYAM"
    }
  ]
};
