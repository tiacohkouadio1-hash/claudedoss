/* ==========================================================================
   Moteur du site : lit window.CATALOGUE (data/catalogue.js) et construit
   l'en-tête, le menu, le pied de page et le contenu de chaque page.
   Vous n'avez normalement PAS besoin de modifier ce fichier pour ajouter
   des pièces, des collections ou des pop-up stores.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.CATALOGUE, S = window.SITE, D = window.DECORATION;
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
    if (!ph.length) return sansPhoto(p);
    var h = '<img src="' + esc(img(ph[0])) + '" alt="' + esc(p.nom) + '" loading="lazy">';
    if (ph[1] && classe !== "simple") h += '<img class="second" src="' + esc(img(ph[1])) + '" alt="" loading="lazy">';
    return h;
  }
  // En attendant les photos : un aplat aux couleurs de la marque, avec le nom de la pièce
  function sansPhoto(p) {
    var teintes = ["wax", "velours", "encre"];
    return '<div class="sans-photo ' + teintes[(p._i || 0) % 3] + '"><span class="caps">' + esc(p.ref) + "</span><strong>" + esc(p.nom) + '</strong><span class="caps">Photo à venir</span></div>';
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
  // Logo : le nom de la maison, dont le « A » est remplacé par une paire de ciseaux rouges (comme sur les étiquettes)
  var CISEAUX = '<svg class="ciseaux" viewBox="0 0 40 52" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.4"><circle cx="9" cy="43" r="6"/><circle cx="31" cy="43" r="6"/></g>' +
    '<g fill="currentColor"><path d="M12.5 38.5 L35.5 1.5 L38.5 3.5 L16.5 40.5Z"/><path d="M27.5 38.5 L4.5 1.5 L1.5 3.5 L23.5 40.5Z"/></g></svg>';
  function logoHTML(classe) {
    var m = S.maison;
    if (m.logo) return '<img src="' + esc(img(m.logo)) + '" alt="' + esc(m.nom) + '">';
    var k = m.nom.toUpperCase().indexOf("A");
    var lettres = k < 0 ? esc(m.nom) : esc(m.nom.slice(0, k)) + CISEAUX + esc(m.nom.slice(k + 1));
    return '<span class="logo-nom ' + (classe || "") + '" role="img" aria-label="' + esc(m.nom) + '">' + lettres + "</span>" +
      (m.surTitre ? '<span class="logo-ville">' + esc(m.surTitre) + "</span>" : "");
  }
  var LIENS = [
    ["index.html", "Accueil"], ["catalogue.html", "Mode"], ["decoration.html", "Décoration"],
    ["pop-up.html", "Pop-up stores"], ["maison.html", "La maison"]
  ];
  function chrome() {
    var surImage = PAGE === "accueil" || PAGE === "decoration";
    var courant = location.pathname.split("/").pop() || "index.html";
    var entete = document.createElement("header");
    entete.className = "entete" + (surImage ? " sur-image" : " plein");
    // Bloc logo à la manière d'une maison : « IY✂M PARIS — présente — Maison <script> »
    var BLOC = { accueil: ["Maison", "Iyam"], catalogue: ["Atelier", "Couture"], piece: ["Atelier", "Couture"],
                 decoration: ["Maison", "Décoration"], popup: ["Les", "Pop-up"], maison: ["La", "Maison"] }[PAGE] || ["Maison", "Iyam"];
    entete.innerHTML = '<a class="logo lockup" href="index.html" aria-label="' + esc(S.maison.nom) + ' — accueil">' +
      '<span class="l-marque">' + logoHTML("petit-logo").replace(/<span class="logo-ville">.*<\/span>$/, "") + '<span class="l-ville">' + esc(S.maison.surTitre || "") + "</span></span>" +
      '<span class="l-presente">présente</span><span class="l-maison">' + esc(BLOC[0]) + '</span><span class="l-script">' + esc(BLOC[1]) + "</span></a>" +
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
    pied.innerHTML = '<div class="wrap"><div class="grand logo">' + logoHTML("grand-logo") + "</div>" +
      '<div class="pied-grille"><div><p style="max-width:44ch;opacity:.85">' + esc(S.maison.presentation) + "</p></div>" +
      '<div><h4 class="caps">Explorer</h4>' + LIENS.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + "</a>"; }).join("") + "</div>" +
      '<div><h4 class="caps">Contact</h4><a href="mailto:' + esc(M.email) + '">Mode · ' + esc(M.email) + '</a><a href="' + esc(M.instagram) + '" target="_blank" rel="noopener">Mode · Instagram</a>' +
      (D ? '<a href="mailto:' + esc(D.email) + '">IYAM · ' + esc(D.email) + '</a><a href="https://instagram.com/' + esc(D.instagram) + '" target="_blank" rel="noopener">IYAM · @' + esc(D.instagram) + "</a>" : "") + "</div></div>" +
      '<div class="pied-bas"><span>© ' + new Date().getFullYear() + " " + esc(S.maison.nom) + "</span><span>Mode · Décoration</span></div></div>";
    document.body.appendChild(pied);
  }

  /* ---------------- Accueil : la « roue » des scènes (style maison de restaurants) ----------------
     Le nom de la scène active est à l'horizontale ; les autres tournent sur un arc,
     inclinés et transparents, au-dessus et en dessous — comme les adresses d'une maison. */
  function pageAccueil() {
    var SC = S.scenes || [];
    var heros = $("#heros");
    heros.innerHTML = SC.map(function (sc, i) {
      return '<div class="diapo' + (i === 0 ? " active" : "") + '"><img src="' + esc(img(sc.image)) + '" alt=""' + (i ? ' loading="lazy"' : "") + "></div>";
    }).join("") +
      '<div class="roue" aria-hidden="true">' + SC.map(function (sc, i) {
        return '<button class="nom-roue" tabindex="-1" data-i="' + i + '"><span>' + esc(sc.titre) + "</span></button>";
      }).join("") + "</div>" +
      '<a class="adresse" id="adresse" href="#"></a>' +
      '<div class="compteur caps"><button class="prec" aria-label="Scène précédente">←</button><span id="compteur"></span><button class="suiv" aria-label="Scène suivante">→</button></div>' +
      '<h1 class="sr" id="titreAccessible"></h1>';
    var diapos = heros.querySelectorAll(".diapo"), noms = heros.querySelectorAll(".nom-roue");
    var n = SC.length, i = 0, minuteur;
    function montrer(k) {
      i = (k + n) % n;
      diapos.forEach(function (d, j) { d.classList.toggle("active", j === i); });
      noms.forEach(function (el, j) {
        var d = j - i;                                 // écart avec la scène active, ramené dans [-n/2, n/2]
        if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        el.style.setProperty("--d", d);
        el.classList.toggle("actif", d === 0);
        el.classList.toggle("loin", Math.abs(d) > 1);
        el.classList.toggle("cache", Math.abs(d) > 2);
      });
      var sc = SC[i], a = $("#adresse");
      a.href = sc.lien;
      a.innerHTML = sc.lignes.map(esc).join("<br>") + '<span class="voir">Découvrir →</span>';
      $("#compteur").textContent = String(i + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
      $("#titreAccessible").textContent = "IYAM — " + sc.titre;
    }
    function lancer() { clearInterval(minuteur); if (n > 1) minuteur = setInterval(function () { montrer(i + 1); }, 5000); }
    function aller(k) { montrer(k); lancer(); }
    noms.forEach(function (el) { el.addEventListener("click", function () {
      var j = +el.dataset.i; if (j === i) location.href = SC[i].lien; else aller(j);
    }); });
    heros.querySelector(".prec").addEventListener("click", function () { aller(i - 1); });
    heros.querySelector(".suiv").addEventListener("click", function () { aller(i + 1); });
    document.addEventListener("keydown", function (e) {
      if (window.scrollY > window.innerHeight * 0.5) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") aller(i + 1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") aller(i - 1);
    });
    var ty = null, tx = null;
    heros.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    heros.addEventListener("touchend", function (e) {
      if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) aller(i + (dx < 0 ? 1 : -1));
    });
    montrer(0); lancer();

    $("#presentation").textContent = S.maison.presentation;

    var U = S.univers;
    $("#univers").innerHTML = U.map(function (u) {
      return '<a class="famille apparait univers-' + esc(u.id) + '" href="' + esc(u.lien) + '">' +
        '<img src="' + esc(img(u.image)) + '" alt="" loading="lazy"><div><p class="caps">' + esc(u.sousTitre) + "</p><h3>" + esc(u.titre) + "</h3><p>" +
        u.infos.map(esc).join(" · ") + '</p><p class="caps" style="margin-top:14px">' + esc(u.bouton) + " →</p></div></a>";
    }).join("");

    var selection = pieces.filter(function (p) { return ACHETABLE[p.statut]; }).slice(0, 6);
    if (selection.length < 3) selection = pieces.slice(0, 6);
    $("#selection").innerHTML = selection.map(carte).join("");

    if (D) $("#occasionsAccueil").innerHTML = D.occasions.map(polaroid).join("");

    var prochain = popupsTries().avenir[0];
    if (prochain) {
      $("#bandeauPopup").hidden = false;
      $("#bandeauPopup .contenu").innerHTML = evenementHTML(prochain, false);
    }
  }

  function polaroid(o) {
    return '<figure class="polaroid apparait"><img src="' + esc(img(o.photo)) + '" alt="' + esc(o.titre) + '" loading="lazy"><figcaption>' + esc(o.titre) + "</figcaption></figure>";
  }

  /* ---------------- Décoration (style du flyer IYAM) ---------------- */
  var ICONES = {
    "sur-mesure": '<circle cx="24" cy="24" r="4"/><circle cx="24" cy="14" r="5"/><circle cx="33.5" cy="21" r="5"/><circle cx="30" cy="32" r="5"/><circle cx="18" cy="32" r="5"/><circle cx="14.5" cy="21" r="5"/>',
    "ballons": '<path d="M9 38a15 15 0 0 1 30 0"/><circle cx="9" cy="34" r="3.2"/><circle cx="11" cy="26" r="3.2"/><circle cx="16" cy="19" r="3.2"/><circle cx="24" cy="16" r="3.2"/><circle cx="32" cy="19" r="3.2"/><circle cx="37" cy="26" r="3.2"/><circle cx="39" cy="34" r="3.2"/>',
    "backdrop": '<path d="M7 9h34"/><path d="M10 9v31M38 9v31"/><path d="M10 9c3 9 9 12 14 12s11-3 14-12"/><path d="M17 15v25M31 15v25"/>',
    "fleurs": '<path d="M18 28h12l-2 12h-8z"/><path d="M24 28V12"/><path d="M24 20c-6 0-9-4-9-8 5 0 9 3 9 8zM24 17c5 0 8-3 8-7-4 0-8 2-8 7z"/>',
    "table": '<path d="M8 36h32"/><rect x="13" y="22" width="5" height="14" rx="1"/><rect x="21.5" y="18" width="5" height="18" rx="1"/><rect x="30" y="24" width="5" height="12" rx="1"/><path d="M15.5 17c-1.5 2 0 3.5 0 3.5s1.5-1.5 0-3.5zM24 13c-1.5 2 0 3.5 0 3.5s1.5-1.5 0-3.5zM32.5 19c-1.5 2 0 3.5 0 3.5s1.5-1.5 0-3.5z"/>',
    "whatsapp": '<path d="M10 38l2.2-7A14 14 0 1 1 17 36z"/><path d="M19 17c0 6 6 12 12 12l2-3-3.5-2-2 1.5c-2-1-4-3-5-5l1.5-2-2-3.5z"/>',
    "instagram": '<rect x="9" y="9" width="30" height="30" rx="9"/><circle cx="24" cy="24" r="7"/><circle cx="32.5" cy="15.5" r="1.2" fill="currentColor"/>',
    "email": '<rect x="7" y="12" width="34" height="24" rx="3"/><path d="M8 14l16 12 16-12"/>',
    "idees": '<path d="M24 9a10 10 0 0 0-6 18v4h12v-4a10 10 0 0 0-6-18z"/><path d="M19 35h10M20.5 39h7"/><path d="M24 3v2M10 10l1.5 1.5M38 10l-1.5 1.5M5 22h2M41 22h2"/>'
  };
  function icone(nom) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONES[nom] || ICONES["sur-mesure"]) + "</svg>";
  }
  var COEUR = '<svg class="coeur" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21s-9-5.6-9-12A5 5 0 0 1 12 6a5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill="currentColor"/></svg>';

  function pageDecoration() {
    $("#dHeros").innerHTML =
      '<div class="flyer-photo"><img src="' + esc(img(D.photoHeros)) + '" alt="Décoration IYAM : arche de ballons, drapé et bouquet séché"></div>' +
      '<div class="flyer-texte">' +
        '<div class="flyer-marque"><span class="fm-nom">' + esc(D.nom) + '</span><span class="fm-sous">' + esc(D.sousNom) + "</span>" +
        '<span class="filet">' + COEUR + "</span></div>" +
        '<h1><span class="serif">' + esc(D.titre) + '</span> <span class="script">' + esc(D.titreScript) + " " + COEUR + "</span></h1>" +
        '<p class="fl-sous">' + esc(D.sousTitre) + "</p>" +
        '<p class="fl-texte">' + esc(D.presentation) + "</p>" +
        '<p class="pinceau">' + esc(D.devise) + "</p>" +
      "</div>";
    $("#dOccasions").innerHTML = D.occasions.map(polaroid).join("");
    $("#dPrestations").innerHTML = D.prestations.map(function (p) {
      return '<li class="apparait"><span class="pastille">' + icone(p.icone) + "</span><h3>" + esc(p.titre) + "</h3><p>" + esc(p.texte) + "</p></li>";
    }).join("");
    $("#dPourquoi").innerHTML = D.pourquoi.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    $("#dValeurs").innerHTML = D.valeurs.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    $("#dGalerie").innerHTML = D.galerie.map(function (g) {
      return '<figure class="apparait"><img src="' + esc(img(g.photo)) + '" alt="' + esc(g.legende) + '" loading="lazy"><figcaption>' + esc(g.legende) + "</figcaption></figure>";
    }).join("");
    var corps = "Bonjour,\n\nJe souhaite un devis pour une décoration.\n\nType d'événement :\nDate :\nLieu :\nNombre d'invités :\nThème / couleurs souhaitées :\nBudget indicatif :\n";
    var mail = "mailto:" + D.email + "?subject=" + encodeURIComponent("Demande de devis — décoration") + "&body=" + encodeURIComponent(corps);
    $("#dDevis").href = mail;
    $("#dContact").innerHTML =
      (D.whatsapp ? '<a href="https://wa.me/' + esc(D.whatsapp) + "?text=" + encodeURIComponent("Bonjour, je souhaite un devis pour une décoration.") + '" target="_blank" rel="noopener"><span class="rond">' + icone("whatsapp") + "</span>" + esc(D.telephone) + "</a>" : "") +
      '<a href="https://instagram.com/' + esc(D.instagram) + '" target="_blank" rel="noopener"><span class="rond">' + icone("instagram") + "</span>" + esc(D.instagram) + "</a>" +
      '<a href="' + mail + '"><span class="rond">' + icone("email") + "</span>" + esc(D.email) + "</a>";
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
    document.title = p.nom + " — " + S.maison.nom;
    var c = collection(p.collection), ph = p.photos || [];
    var galerie = '<div class="galerie"><div class="principale">' +
      (ph.length ? '<img id="photoPrincipale" src="' + esc(img(ph[0])) + '" alt="' + esc(p.nom) + '">' : sansPhoto(p)) + "</div>" +
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
    $("#mPresentation").textContent = S.maison.presentation;
    $("#mPhoto").innerHTML = '<img src="images/iyam-etiquettes.jpg" alt="Étiquettes IYAM Paris">';
    $("#mUnivers").innerHTML = S.univers.map(function (u) {
      var email = u.id === "decoration" && D ? D.email : M.email;
      var tel = u.id === "decoration" && D && D.whatsapp ? '<a class="bouton contour" href="https://wa.me/' + esc(D.whatsapp) + '" target="_blank" rel="noopener">WhatsApp · ' + esc(D.telephone) + "</a>" : "";
      var insta = u.id === "decoration" && D ? "https://instagram.com/" + D.instagram : M.instagram;
      return '<div class="contact-univers"><p class="caps sur-titre">' + esc(u.sousTitre) + "</p><h3>" + esc(u.titre) + "</h3>" +
        '<div class="actions"><a class="bouton" href="mailto:' + esc(email) + '">' + esc(email) + '</a><a class="bouton contour" href="' + esc(insta) + '" target="_blank" rel="noopener">Instagram</a>' + tel + "</div></div>";
    }).join("");
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
  ({ accueil: pageAccueil, catalogue: pageCatalogue, piece: pagePiece, popup: pagePopup, maison: pageMaison, decoration: pageDecoration }[PAGE] || function () {})();
  document.querySelectorAll("[data-marque]").forEach(function (el) { el.textContent = S.maison.nom; });
  document.title = document.title.replace("{marque}", S.maison.nom);
  observer();
})();
