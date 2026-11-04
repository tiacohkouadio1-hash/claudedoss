/* ==========================================================================
   Moteur du site : lit window.CATALOGUE (data/catalogue.js) et construit
   l'en-tête, le menu, le pied de page et le contenu de chaque page.
   Vous n'avez normalement PAS besoin de modifier ce fichier pour ajouter
   des pièces, des collections ou des pop-up stores.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.CATALOGUE;
  var M = C.marque, R = C.reglages;
  var PAGE = document.body.getAttribute("data-page");

  /* ---------------- Utilitaires ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel) { return document.querySelector(sel); }
  function param(nom) { return new URLSearchParams(location.search).get(nom); }
  function img(nom) { return /^(https?:)?\/\//.test(nom) ? nom : "images/" + nom; }

  var STATUTS = {
    "disponible":   "Disponible",
    "reservee":     "Réservée",
    "vendue":       "Vendue",
    "archive":      "Pièce de défilé",
    "sur-commande": "Sur commande",
    "bientot":      "Bientôt"
  };
  var ACHETABLE = { "disponible": 1, "sur-commande": 1 };

  var collectionsVisibles = C.collections.filter(function (c) { return c.visible !== false; });
  function collection(id) { return C.collections.find(function (c) { return c.id === id; }); }
  function familleDe(p) { var c = collection(p.collection); return c ? c.famille : "creation"; }
  function estPAP(p) { return Array.isArray(p.tailles); }

  // Ordre d'affichage : famille (selon réglages) → collection → ordre du fichier
  var rangFamille = {}; R.ordreFamilles.forEach(function (f, i) { rangFamille[f] = i; });
  var rangCollection = {}; C.collections.forEach(function (c, i) { rangCollection[c.id] = i; });

  var pieces = C.pieces
    .map(function (p, i) { p._i = i; return p; })
    .filter(function (p) {
      var c = collection(p.collection);
      if (!c || c.visible === false) return false;
      if (p.visible === false) return false;
      if (!R.afficherPiecesArchivees && p.statut === "archive") return false;
      return true;
    })
    .sort(function (a, b) {
      return (rangFamille[familleDe(a)] - rangFamille[familleDe(b)]) ||
             (rangCollection[a.collection] - rangCollection[b.collection]) || (a._i - b._i);
    });

  function prixTexte(p) {
    if (!R.afficherPrix || p.prix == null) return "";
    return new Intl.NumberFormat("fr-FR").format(p.prix) + " " + R.devise;
  }
  function tailleTexte(p) {
    if (!estPAP(p)) return p.taille ? "Taille " + p.taille + " · pièce unique" : "Pièce unique";
    var dispo = p.tailles.filter(function (t) { return t.stock > 0; }).map(function (t) { return t.taille; });
    return dispo.length ? "Tailles " + dispo.join(" · ") : "Épuisé";
  }
  function visuel(p, classe) {
    var ph = p.photos || [];
    if (!ph.length) return '<div class="sans-photo">' + esc(p.ref) + "</div>";
    var h = '<img src="' + esc(img(ph[0])) + '" alt="' + esc(p.nom) + '" loading="lazy">';
    if (ph[1] && classe !== "simple") h += '<img class="second" src="' + esc(img(ph[1])) + '" alt="" loading="lazy">';
    return h;
  }
  function carte(p) {
    var indispo = p.statut === "vendue" || p.statut === "reservee";
    var c = collection(p.collection);
    return '<a class="carte apparait' + (indispo ? " indispo" : "") + '" href="piece.html?ref=' + encodeURIComponent(p.ref) + '">' +
      '<div class="visuel"><span class="statut ' + esc(p.statut) + '">' + esc(STATUTS[p.statut] || p.statut) + "</span>" + visuel(p) + "</div>" +
      '<div class="meta"><h3>' + esc(p.nom) + '</h3><span class="ref">' + esc(p.ref) + "</span></div>" +
      '<div class="sous">' + esc(c ? c.titre : "") + " · " + esc(tailleTexte(p)) + (prixTexte(p) ? " · " + prixTexte(p) : "") + "</div></a>";
  }
  function mailto(sujet, corps) {
    return "mailto:" + M.email + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps || "");
  }
  function dateFr(iso, opts) {
    return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", opts || { day: "numeric", month: "long", year: "numeric" });
  }

  /* ---------------- En-tête, menu, pied de page ---------------- */
  function logoHTML() {
    if (M.logo) return '<img src="' + esc(img(M.logo)) + '" alt="' + esc(M.nom) + '">';
    return '<span class="petit">Maison</span><span class="script">' + esc(M.nom) + "</span>";
  }
  var LIENS = [
    ["index.html", "Accueil"], ["catalogue.html", "Catalogue"],
    ["pop-up.html", "Pop-up stores"], ["maison.html", "La maison"]
  ];
  function chrome() {
    var surImage = PAGE === "accueil";
    var courant = location.pathname.split("/").pop() || "index.html";
    var entete = document.createElement("header");
    entete.className = "entete" + (surImage ? " sur-image" : " plein");
    entete.innerHTML = '<a class="logo" href="index.html">' + logoHTML() + "</a>" +
      '<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>';
    document.body.prepend(entete);

    var menu = document.createElement("div");
    menu.className = "menu"; menu.id = "menu"; menu.setAttribute("aria-hidden", "true");
    menu.innerHTML = '<button class="fermer" aria-label="Fermer le menu">×</button><nav>' +
      LIENS.map(function (l) { return '<a href="' + l[0] + '"' + (l[0] === courant ? ' aria-current="page"' : "") + ">" + l[1] + "</a>"; }).join("") +
      '</nav><div class="pied-menu caps"><a href="' + esc(M.instagram) + '" target="_blank" rel="noopener">Instagram</a><a href="mailto:' + esc(M.email) + '">' + esc(M.email) + "</a></div>";
    document.body.appendChild(menu);

    var burger = entete.querySelector(".burger");
    function basculer(ouvert) {
      menu.classList.toggle("ouvert", ouvert);
      menu.setAttribute("aria-hidden", ouvert ? "false" : "true");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      document.body.style.overflow = ouvert ? "hidden" : "";
    }
    burger.addEventListener("click", function () { basculer(true); });
    menu.querySelector(".fermer").addEventListener("click", function () { basculer(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") basculer(false); });

    if (surImage) {
      var maj = function () { entete.classList.toggle("plein", window.scrollY > window.innerHeight * 0.75); };
      window.addEventListener("scroll", maj, { passive: true }); maj();
    }

    var pied = document.createElement("footer");
    pied.className = "pied";
    pied.innerHTML = '<div class="wrap"><div class="grand">' + esc(M.nom) + "</div>" +
      '<div class="pied-grille"><div><p style="max-width:44ch;opacity:.85">' + esc(M.signature) + ". " + esc(M.ville) + ".</p></div>" +
      '<div><h4 class="caps">Explorer</h4>' + LIENS.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + "</a>"; }).join("") + "</div>" +
      '<div><h4 class="caps">Contact</h4><a href="mailto:' + esc(M.email) + '">' + esc(M.email) + '</a><a href="' + esc(M.instagram) + '" target="_blank" rel="noopener">Instagram</a></div></div>' +
      '<div class="pied-bas"><span>© ' + new Date().getFullYear() + " " + esc(M.nom) + "</span><span>Pièces uniques & prêt-à-porter</span></div></div>";
    document.body.appendChild(pied);
  }

  /* ---------------- Accueil ---------------- */
  function pageAccueil() {
    var une = pieces.filter(function (p) { return p.enAvant && p.photos && p.photos.length; });
    if (!une.length) une = pieces.filter(function (p) { return p.photos && p.photos.length; }).slice(0, 5);

    // Diaporama plein écran
    var heros = $("#heros");
    var POS = [[6, 22], [8, 72], [58, 30], [64, 78], [30, 52]];
    heros.innerHTML = une.map(function (p, i) {
      return '<div class="diapo' + (i === 0 ? " active" : "") + '"><img src="' + esc(img(p.photos[0])) + '" alt=""' + (i ? ' loading="lazy"' : "") + "></div>";
    }).join("") +
      '<div class="fantomes" aria-hidden="true"></div>' +
      '<div class="legende"><h1 id="hTitre"></h1><div class="infos" id="hInfos"></div></div>' +
      '<div class="points">' + une.map(function (p, i) { return '<button aria-label="' + esc(p.nom) + '"' + (i === 0 ? ' class="active"' : "") + "></button>"; }).join("") + "</div>";
    var diapos = heros.querySelectorAll(".diapo"), points = heros.querySelectorAll(".points button");
    var i = 0, minuteur;
    function montrer(n) {
      i = (n + une.length) % une.length;
      diapos.forEach(function (d, k) { d.classList.toggle("active", k === i); });
      points.forEach(function (d, k) { d.classList.toggle("active", k === i); });
      var p = une[i], c = collection(p.collection);
      $("#hTitre").textContent = p.nom;
      $("#hInfos").innerHTML = esc(c ? c.titre : "") + "<br>" + esc((p.matieres || []).join(" · ")) +
        '<br><a href="piece.html?ref=' + encodeURIComponent(p.ref) + '">Voir la pièce</a>';
      // Les noms des autres pièces flottent en filigrane, comme des lieux sur une carte
      var autres = une.filter(function (_, k) { return k !== i; }).slice(0, 3);
      heros.querySelector(".fantomes").innerHTML = autres.map(function (a, k) {
        var pos = POS[(i + k) % POS.length];
        return '<span style="top:' + pos[0] + "%;left:" + pos[1] + '%">' + esc(a.nom.replace(/\s*\(.*\)$/, "")) + "</span>";
      }).join("");
    }
    function lancer() { clearInterval(minuteur); if (une.length > 1) minuteur = setInterval(function () { montrer(i + 1); }, 6000); }
    points.forEach(function (b, k) { b.addEventListener("click", function () { montrer(k); lancer(); }); });
    montrer(0); lancer();

    $("#manifeste").innerHTML = esc(M.accroche).replace(/(Wax|velours|tulle|exemplaire unique)/gi, "<em>$1</em>");
    $("#presentation").textContent = M.presentation;

    // Familles dans l'ordre choisi dans les réglages
    $("#familles").innerHTML = R.ordreFamilles.map(function (f) {
      var F = C.familles[f];
      var dans = pieces.filter(function (p) { return familleDe(p) === f; });
      var photo = dans.find(function (p) { return p.photos && p.photos.length; });
      var aVenir = !dans.length;
      return '<a class="famille apparait' + (aVenir ? " a-venir" : "") + '" href="' + (aVenir ? "pop-up.html" : "catalogue.html?famille=" + f) + '">' +
        (photo ? '<img src="' + esc(img(photo.photos[0])) + '" alt="" loading="lazy">' : "") +
        (aVenir ? '<span class="bientot caps">Bientôt</span>' : "") +
        "<div><h3>" + esc(F.titre) + "</h3><p>" + esc(F.description) + '</p><p class="caps" style="margin-top:14px">' +
        (aVenir ? "Être informé·e" : dans.length + " pièce" + (dans.length > 1 ? "s" : "") + " →") + "</p></div></a>";
    }).join("");

    var selection = pieces.filter(function (p) { return ACHETABLE[p.statut]; }).slice(0, 6);
    if (selection.length < 3) selection = pieces.slice(0, 6);
    $("#selection").innerHTML = selection.map(carte).join("");

    var prochain = popupsTries().avenir[0];
    if (prochain) {
      $("#bandeauPopup").hidden = false;
      $("#bandeauPopup .contenu").innerHTML = evenementHTML(prochain, false);
    }
  }

  /* ---------------- Catalogue ---------------- */
  function pageCatalogue() {
    var etat = {
      famille: param("famille") || "", collection: param("collection") || "",
      categorie: param("categorie") || "", dispo: param("dispo") || "", taille: param("taille") || ""
    };
    var familles = R.ordreFamilles.filter(function (f) { return pieces.some(function (p) { return familleDe(p) === f; }); });

    function source(sans) {
      return pieces.filter(function (p) {
        return (sans === "famille" || !etat.famille || familleDe(p) === etat.famille) &&
               (sans === "collection" || !etat.collection || p.collection === etat.collection) &&
               (sans === "categorie" || !etat.categorie || p.categorie === etat.categorie) &&
               (sans === "dispo" || !etat.dispo || (etat.dispo === "achat" ? ACHETABLE[p.statut] : p.statut === etat.dispo)) &&
               (sans === "taille" || !etat.taille || taillesDe(p).indexOf(etat.taille) >= 0);
      });
    }
    function taillesDe(p) {
      return estPAP(p) ? p.tailles.filter(function (t) { return t.stock > 0; }).map(function (t) { return t.taille; }) : (p.taille ? [p.taille] : []);
    }
    function uniques(liste) { return liste.filter(function (v, k) { return v && liste.indexOf(v) === k; }); }

    function ligne(cle, nom, options) {
      if (options.length < 2 && !etat[cle]) return "";
      return '<div class="ligne-filtre"><span class="nom caps">' + nom + "</span>" +
        '<button class="puce" data-cle="' + cle + '" data-val="" aria-pressed="' + (!etat[cle]) + '">Tout</button>' +
        options.map(function (o) {
          return '<button class="puce" data-cle="' + cle + '" data-val="' + esc(o[0]) + '" aria-pressed="' + (etat[cle] === o[0]) + '">' + esc(o[1]) + "</button>";
        }).join("") + "</div>";
    }
    function rendre() {
      var cols = collectionsVisibles.filter(function (c) { return source("collection").some(function (p) { return p.collection === c.id; }); });
      var cats = uniques(source("categorie").map(function (p) { return p.categorie; }));
      var statuts = uniques(source("dispo").map(function (p) { return p.statut; }));
      var ORDRE_T = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
      var tailles = uniques([].concat.apply([], source("taille").map(taillesDe))).sort(function (a, b) {
        var x = ORDRE_T.indexOf(a), y = ORDRE_T.indexOf(b);
        if (x >= 0 && y >= 0) return x - y; if (!isNaN(a) && !isNaN(b)) return a - b; return String(a).localeCompare(b);
      });
      var dispos = [];
      if (statuts.some(function (s) { return ACHETABLE[s]; })) dispos.push(["achat", "Disponible à l'achat"]);
      statuts.forEach(function (s) { dispos.push([s, STATUTS[s] || s]); });

      $("#filtres").innerHTML =
        ligne("famille", "Univers", familles.map(function (f) { return [f, C.familles[f].titre]; })) +
        ligne("collection", "Collection", cols.map(function (c) { return [c.id, c.titre]; })) +
        ligne("categorie", "Pièce", cats.map(function (c) { return [c, c]; })) +
        ligne("dispo", "Statut", dispos) +
        ligne("taille", "Taille", tailles.map(function (t) { return [t, t]; }));

      var res = source();
      $("#compte").textContent = res.length + " pièce" + (res.length > 1 ? "s" : "");
      $("#grille").innerHTML = res.length ? res.map(carte).join("") : '<p class="vide">Aucune pièce ne correspond à ces critères.</p>';
      var titre = etat.collection ? collection(etat.collection).titre : etat.famille ? C.familles[etat.famille].titre : "Catalogue";
      $("#titrePage").textContent = titre;
      var intro = etat.collection ? collection(etat.collection).description : etat.famille ? C.familles[etat.famille].description :
        "Toutes les créations : pièces de défilé, prototypes" + (familles.indexOf("pret-a-porter") >= 0 ? " et prêt-à-porter." : ".");
      $("#introPage").textContent = intro;
      observer();
    }
    $("#filtres").addEventListener("click", function (e) {
      var b = e.target.closest(".puce"); if (!b) return;
      etat[b.dataset.cle] = b.dataset.val;
      if (b.dataset.cle === "famille") etat.collection = "";
      var q = new URLSearchParams(); Object.keys(etat).forEach(function (k) { if (etat[k]) q.set(k, etat[k]); });
      history.replaceState(null, "", "catalogue.html" + (q.toString() ? "?" + q : ""));
      rendre();
    });
    rendre();
  }

  /* ---------------- Fiche pièce ---------------- */
  function pagePiece() {
    var ref = param("ref");
    var p = pieces.find(function (x) { return x.ref === ref; });
    var zone = $("#fiche");
    if (!p) {
      zone.innerHTML = '<div><h1 style="font-family:var(--f-titre);text-transform:uppercase;font-size:48px">Pièce introuvable</h1><p class="intro">Cette référence n\'existe pas ou n\'est plus présentée.</p><div class="actions"><a class="bouton" href="catalogue.html">Retour au catalogue</a></div></div>';
      return;
    }
    document.title = p.nom + " — " + M.nom;
    var c = collection(p.collection), ph = p.photos || [];
    var galerie = '<div class="galerie"><div class="principale">' +
      (ph.length ? '<img id="photoPrincipale" src="' + esc(img(ph[0])) + '" alt="' + esc(p.nom) + '">' : '<div class="sans-photo">' + esc(p.ref) + "</div>") + "</div>" +
      (ph.length > 1 ? '<div class="vignettes">' + ph.map(function (f, k) {
        return '<button data-src="' + esc(img(f)) + '" aria-current="' + (k === 0) + '" aria-label="Photo ' + (k + 1) + '"><img src="' + esc(img(f)) + '" alt=""></button>';
      }).join("") + "</div>" : "") + "</div>";

    var taillesHTML;
    if (estPAP(p)) {
      taillesHTML = '<div class="tailles">' + p.tailles.map(function (t) {
        var cl = t.stock <= 0 ? "epuise" : t.stock <= 2 ? "dernieres" : "";
        return '<span class="taille ' + cl + '" title="' + (t.stock <= 0 ? "Épuisé" : t.stock <= 2 ? "Dernières pièces" : "Disponible") + '">' + esc(t.taille) + "</span>";
      }).join("") + '</div><p class="note-taille">Barré : épuisé · Orange : dernières pièces</p>';
    } else {
      taillesHTML = esc(p.taille || "Unique") + '<p class="note-taille">Pièce unique, réalisée en un seul exemplaire et une seule taille.</p>';
    }

    var sujet = "Demande — " + p.ref + " · " + p.nom;
    var corps = "Bonjour,\n\nJe suis intéressé·e par la pièce « " + p.nom + " » (réf. " + p.ref + ").\n\n";
    var action;
    switch (p.statut) {
      case "disponible":   action = '<a class="bouton" href="' + mailto(sujet, corps + "Est-il possible de l'essayer / de l'acquérir ?") + '">Demander cette pièce</a>'; break;
      case "sur-commande": action = '<a class="bouton" href="' + mailto(sujet, corps + "J'aimerais la commander à mes mesures.") + '">Commander à mes mesures</a>'; break;
      case "bientot":      action = '<a class="bouton" href="' + mailto(sujet, corps + "Pouvez-vous me prévenir de sa sortie ?") + '">Me prévenir de la sortie</a>'; break;
      case "archive":      action = '<a class="bouton" href="' + mailto(sujet, corps + "Est-il possible de la louer, de l'emprunter pour un shooting ou d'en commander une version ?") + '">Prêt, location ou version sur mesure</a>'; break;
      default:             action = '<a class="bouton" href="' + mailto(sujet, corps + "Une pièce similaire est-elle possible ?") + '">Demander une pièce similaire</a>';
    }

    zone.innerHTML = galerie + '<div class="fiche-texte">' +
      '<div class="fil caps"><a href="catalogue.html">Catalogue</a> / <a href="catalogue.html?collection=' + encodeURIComponent(p.collection) + '">' + esc(c.titre) + "</a></div>" +
      "<h1>" + esc(p.nom) + '</h1><div class="ref caps">Réf. ' + esc(p.ref) + "</div>" +
      (prixTexte(p) ? '<div class="prix">' + prixTexte(p) + "</div>" : "") +
      '<p class="desc">' + esc(p.description) + "</p>" +
      '<dl class="dl">' +
      "<div><dt>Statut</dt><dd>" + esc(STATUTS[p.statut] || p.statut) + "</dd></div>" +
      "<div><dt>" + (estPAP(p) ? "Tailles" : "Taille") + "</dt><dd>" + taillesHTML + "</dd></div>" +
      (p.matieres && p.matieres.length ? "<div><dt>Matières</dt><dd>" + esc(p.matieres.join(", ")) + "</dd></div>" : "") +
      "<div><dt>Collection</dt><dd>" + esc(c.titre) + (c.annee && String(c.titre).indexOf(c.annee) < 0 ? " · " + c.annee : "") + "</dd></div>" +
      "</dl>" +
      '<div class="actions">' + action + '<a class="bouton contour" href="' + esc(M.instagram) + '" target="_blank" rel="noopener">Instagram</a></div></div>';

    zone.querySelectorAll(".vignettes button").forEach(function (b) {
      b.addEventListener("click", function () {
        $("#photoPrincipale").src = b.dataset.src;
        zone.querySelectorAll(".vignettes button").forEach(function (x) { x.setAttribute("aria-current", x === b); });
      });
    });

    var proches = pieces.filter(function (x) { return x.collection === p.collection && x.ref !== p.ref; }).slice(0, 3);
    if (proches.length) {
      $("#proches").hidden = false;
      $("#grilleProches").innerHTML = proches.map(carte).join("");
    }
  }

  /* ---------------- Pop-up stores ---------------- */
  function popupsTries() {
    var auj = new Date().toISOString().slice(0, 10);
    var l = (C.popups || []).slice().sort(function (a, b) { return a.debut < b.debut ? -1 : 1; });
    return {
      avenir: l.filter(function (e) { return (e.fin || e.debut) >= auj; }),
      passes: l.filter(function (e) { return (e.fin || e.debut) < auj; }).reverse()
    };
  }
  function evenementHTML(e, passe) {
    var d = new Date(e.debut + "T12:00:00");
    var date = d.getDate() + " " + d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
    var periode = e.fin && e.fin !== e.debut ? "Du " + dateFr(e.debut, { day: "numeric", month: "long" }) + " au " + dateFr(e.fin) : dateFr(e.debut);
    var cols = (e.collections || []).map(function (id) { var c = collection(id); return c && c.visible !== false ? '<a href="catalogue.html?collection=' + id + '">' + esc(c.titre) + "</a>" : ""; }).filter(Boolean);
    return '<article class="evenement' + (passe ? " passe" : "") + '"><div class="date">' + esc(date) + "</div>" +
      "<div><h3>" + esc(e.titre) + '</h3><p class="caps" style="margin-top:8px">' + esc(e.lieu || "") + (e.adresse ? " — " + esc(e.adresse) : "") + "</p>" +
      "<p>" + esc(periode) + (e.horaires ? " · " + esc(e.horaires) : "") + "</p>" +
      (e.description ? "<p>" + esc(e.description) + "</p>" : "") +
      (cols.length ? "<p>À découvrir : " + cols.join(", ") + "</p>" : "") + "</div>" +
      (e.lien ? '<a class="bouton clair" href="' + esc(e.lien) + '" target="_blank" rel="noopener">Infos</a>' : "<span></span>") + "</article>";
  }
  function pagePopup() {
    var t = popupsTries();
    $("#avenir").innerHTML = t.avenir.length ? t.avenir.map(function (e) { return evenementHTML(e, false); }).join("") :
      '<div class="evenement"><div class="date">—</div><div><h3>Prochaine date bientôt annoncée</h3><p>Les pop-up stores présenteront les pièces de défilé et les premiers modèles de prêt-à-porter, en plusieurs tailles. Laissez-nous votre adresse pour être prévenu·e.</p></div>' +
      '<a class="bouton clair" href="' + mailto("Prévenez-moi du prochain pop-up", "Bonjour,\n\nJ'aimerais être prévenu·e de votre prochain pop-up store.\n\nVille :") + '">Être prévenu·e</a></div>';
    if (t.passes.length) {
      $("#blocPasses").hidden = false;
      $("#passes").innerHTML = t.passes.map(function (e) { return evenementHTML(e, true); }).join("");
    }
  }

  /* ---------------- La maison ---------------- */
  function pageMaison() {
    $("#mPresentation").textContent = M.presentation;
    var photo = pieces.find(function (p) { return p.photos && p.photos.length; });
    if (photo) $("#mPhoto").innerHTML = '<img src="' + esc(img(photo.photos[0])) + '" alt="' + esc(photo.nom) + '">';
    $("#mContact").innerHTML =
      '<a class="bouton" href="mailto:' + esc(M.email) + '">' + esc(M.email) + "</a>" +
      '<a class="bouton contour" href="' + esc(M.instagram) + '" target="_blank" rel="noopener">Instagram</a>';
  }

  /* ---------------- Apparition au défilement ---------------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function observer() {
    document.querySelectorAll(".apparait:not(.vu)").forEach(function (el) { io ? io.observe(el) : el.classList.add("vu"); });
  }

  /* ---------------- Démarrage ---------------- */
  chrome();
  ({ accueil: pageAccueil, catalogue: pageCatalogue, piece: pagePiece, popup: pagePopup, maison: pageMaison }[PAGE] || function () {})();
  document.querySelectorAll("[data-marque]").forEach(function (el) { el.textContent = M.nom; });
  document.title = document.title.replace("{marque}", M.nom);
  observer();
})();
