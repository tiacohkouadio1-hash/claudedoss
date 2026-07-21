# Abidjan Photovoltaïque ☀️

Projet de démonstration autour de l'énergie solaire photovoltaïque à **Abidjan
(Côte d'Ivoire)**. Il contient deux livrables :

| Livrable | Fichier | Description |
|---|---|---|
| 🖥️ **Landing page** | [`index.html`](index.html) | Site vitrine autonome (HTML/CSS/JS, sans dépendance) présentant une offre d'installation solaire, avec un **calculateur d'estimation** intégré et un formulaire de contact. |
| 🧾 **Générateur de devis** | [`devis.html`](devis.html) | Devis personnalisé à partir de la facture : prix détaillé poste par poste, **gains à court et long terme**, économies cumulées sur 25 ans, imprimable en PDF. |
| 📄 **Étude technique** | [`docs/etude-photovoltaique-abidjan.md`](docs/etude-photovoltaique-abidjan.md) | Dossier sur le potentiel PV à Abidjan : ressource solaire, réglementation, dimensionnement, coûts et rentabilité. |
| 📊 **Business plan** | [`docs/business-plan.md`](docs/business-plan.md) | Modèle économique : audit énergétique (cadre 2024), configurations PV, funnel commercial, digitalisation. |
| 📈 **Modèle financier** | [`docs/modele-financier-pv.xlsx`](docs/modele-financier-pv.xlsx) | Classeur Excel : dimensionnement depuis la facture, comparatif des 3 configs, cash-flow 25 ans, sensibilité. |
| 🛠️ **Offre de maintenance** | [`docs/offre-maintenance.md`](docs/offre-maintenance.md) | Contrats de maintenance (3 formules) + intervention garantie 48 h ; analyse du marché ivoirien. |

## Aperçu de la landing page

Ouvrez simplement le fichier dans un navigateur :

```bash
# Ouverture directe
xdg-open index.html      # Linux
open index.html          # macOS

# Ou via un petit serveur local
python3 -m http.server 8000
# puis http://localhost:8000
```

La page est **entièrement autonome** (styles et scripts en ligne), responsive et
compatible thème clair / sombre.

## Le calculateur

Le mini-calculateur de la page estime, à partir de la facture mensuelle et du
prix du kWh :

- la consommation annuelle (kWh) ;
- la **puissance crête recommandée** (kWc) ;
- le nombre de panneaux et la surface de toiture ;
- la production annuelle, l'économie estimée et le **temps de retour**.

Il repose sur un productible de référence de **~1 400 kWh/kWc/an** à Abidjan,
cohérent avec l'étude.

## ⚠️ Avertissement

Tous les chiffres (irradiation, coûts en FCFA, tarifs CIE, temps de retour) sont
des **ordres de grandeur indicatifs** destinés à la sensibilisation et au
dimensionnement préliminaire. Ils ne remplacent pas un relevé de consommation
réel ni un devis d'installateur agréé. Les coordonnées de contact du site sont
fictives (démonstration).

## Structure

```
/
├── index.html                              # Landing page (vitrine + calculateur)
├── devis.html                              # Générateur de devis (imprimable PDF)
├── docs/
│   ├── etude-photovoltaique-abidjan.md     # Étude technique
│   ├── business-plan.md                    # Business plan
│   ├── modele-financier-pv.xlsx            # Modèle financier (Excel)
│   └── offre-maintenance.md                # Offre maintenance + intervention 48 h
├── README.md                               # Ce fichier
└── CLAUDE.md                               # Instructions projet
```

## Modèle financier (Excel)

Le classeur `docs/modele-financier-pv.xlsx` contient 7 onglets :

1. **Hypothèses** — tous les paramètres (productible, tarif, coûts/kWc…). Cellules
   bleues/jaunes = à modifier.
2. **Cas client** — entrez la facture mensuelle, le tarif et le taux de couverture ;
   le dimensionnement (kWc, panneaux, surface) se calcule automatiquement.
3. **Comparatif configs** — B1 / B2 / B3 côte à côte : CAPEX, économies, payback, VAN.
4. **Cash-flow B1 / B2 / B3** — projection sur 25 ans (production, économies,
   remplacements, flux cumulé, VAN, année de rentabilité).
5. **Sensibilité** — payback selon le tarif électricité × le coût du kWc.

> Le classeur se **recalcule à l'ouverture**. Les chiffres par défaut sont un
> exemple (facture 45 000 FCFA/mois) — remplacez-les par les données réelles du
> client. Résultat clé à retenir : au tarif actuel, **B1 (sans batterie)
> s'amortit** alors que les configs **avec batterie se justifient par le confort
> et la résilience** (coupures, clim nocturne), pas par le seul retour financier.
