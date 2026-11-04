/* ==========================================================================
   IYAM DÉCORATION — contenu de la page Décoration.
   Pour ajouter une réalisation : ajouter une photo dans images/ puis une
   ligne dans `galerie`. Pour ajouter un type d'événement : `occasions`.
   ========================================================================== */
window.DECORATION = {
  nom: "IYAM",
  sousNom: "Décoration",
  titre: "Sublimez",
  titreScript: "vos moments",
  sousTitre: "créons des souvenirs inoubliables",
  accroche: "Petits & moyens événements · Devis gratuit sur demande",
  presentation: "Je vous accompagne pour décorer vos événements avec goût, créativité et attention aux détails, afin de faire de chaque instant un moment inoubliable.",
  devise: "Chaque détail compte, chaque moment mérite d'être unique.",
  instagram: "iyam_deco",
  email: "iyam.deco@gmail.com",
  telephone: "07 45 23 68 91",
  whatsapp: "33745236891",          // numéro au format international, sans + ni espaces
  photoHeros: "deco-arche-ballons.jpg",

  // Types d'événements (visuels du flyer — à remplacer par vos photos au fil des réalisations)
  occasions: [
    { titre: "Baby shower",     photo: "deco-baby-shower.jpg" },
    { titre: "Anniversaire",    photo: "deco-arche-anniversaire.jpg" },
    { titre: "Bride to be",     photo: "deco-bride.jpg" },
    { titre: "Baptême",         photo: "deco-bapteme.jpg" },
    { titre: "Événements",      photo: "deco-table-fleurs.jpg" },
    { titre: "Et plus encore !", photo: "deco-et-plus.jpg" }
  ],

  prestations: [
    { titre: "Décoration sur-mesure", icone: "sur-mesure",            texte: "Un concept personnalisé selon votre thème, vos envies et votre budget." },
    { titre: "Ballons & mise en scène", icone: "ballons",          texte: "Arches, colonnes et compositions de ballons, installées sur place." },
    { titre: "Fonds & backdrops", icone: "backdrop",                texte: "Drapés, fonds photo et décors pour mettre en valeur le cœur de la fête." },
    { titre: "Fleurs & éléments déco", icone: "fleurs",           texte: "Bouquets séchés, fleurs, vases, chiffres lumineux : location ou fourniture." },
    { titre: "Déco tables & espaces", icone: "table",            texte: "Art de la table, centres de table, candy bar, buffets et coin photo." },
    { titre: "Idées créatives & personnalisées", icone: "idees", texte: "Écoute, conseils et petites attentions pour un événement à votre image." }
  ],

  pourquoi: ["Écoute & conseil", "Déco créative & élégante", "Matériel de qualité", "Passion & attention aux détails"],
  valeurs: ["Élégance", "Créativité", "Émotions"],

  // Réalisations : ajoutez vos nouvelles photos en haut de la liste
  galerie: [
    { photo: "deco-arche-anniversaire.jpg", legende: "Anniversaire · arche de ballons & drapé" },
    { photo: "deco-table-fleurs.jpg",       legende: "Art de la table · tulle & fleurs orange" },
    { photo: "deco-chiffres-lumineux.jpg",  legende: "Chiffres lumineux" },
    { photo: "deco-arche-ballons.jpg",      legende: "Colonne de ballons tons terre" },
    { photo: "deco-ambiance.jpg",           legende: "Bouquet séché & ballons" }
  ]
};
