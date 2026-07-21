# Abidjan Photovoltaïque ☀️

Projet de démonstration autour de l'énergie solaire photovoltaïque à **Abidjan
(Côte d'Ivoire)**. Il contient deux livrables :

| Livrable | Fichier | Description |
|---|---|---|
| 🖥️ **Landing page** | [`index.html`](index.html) | Site vitrine autonome (HTML/CSS/JS, sans dépendance) présentant une offre d'installation solaire, avec un **calculateur d'estimation** intégré et un formulaire de contact. |
| 📄 **Étude technique** | [`docs/etude-photovoltaique-abidjan.md`](docs/etude-photovoltaique-abidjan.md) | Dossier sur le potentiel PV à Abidjan : ressource solaire, réglementation, dimensionnement, coûts et rentabilité. |

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
├── docs/
│   └── etude-photovoltaique-abidjan.md     # Étude technique
├── README.md                               # Ce fichier
└── CLAUDE.md                               # Instructions projet
```
