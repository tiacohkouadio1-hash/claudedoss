# Étude du potentiel photovoltaïque à Abidjan

> Dossier technique — évaluation de la ressource solaire, du cadre réglementaire,
> des coûts et de la rentabilité d'une installation photovoltaïque à Abidjan
> (Côte d'Ivoire).

**Version :** 1.0 · **Zone :** Abidjan, District Autonome (≈ 5,35° N, 4,00° O)

> ⚠️ **Avertissement.** Les chiffres ci-dessous sont des ordres de grandeur
> destinés au dimensionnement préliminaire et à la sensibilisation. Ils doivent
> être confirmés par un relevé de consommation réel, un devis d'installateur
> agréé et, le cas échéant, une étude de structure de toiture.

---

## 1. Contexte

Abidjan bénéficie d'un climat tropical de savane, avec un ensoleillement élevé
et régulier tout au long de l'année. La proximité de l'équateur (~5° N) donne
une durée du jour quasi constante (≈ 12 h) et un soleil proche du zénith, deux
atouts majeurs pour le solaire photovoltaïque.

Les principaux moteurs de l'intérêt pour le PV à Abidjan sont :

- la **hausse tendancielle du tarif de l'électricité** du réseau (CIE) ;
- les **coupures et micro-coupures** qui poussent à l'autonomie (souvent couplée
  batterie ou groupe électrogène) ;
- la **baisse continue du coût des modules** (panneaux) et des onduleurs ;
- une volonté d'**indépendance énergétique** pour les commerces et industries.

---

## 2. Ressource solaire

| Grandeur | Valeur indicative à Abidjan |
|---|---|
| Irradiation globale horizontale (GHI) | ≈ **1 800 – 2 000 kWh/m²/an** |
| Moyenne journalière (GHI) | ≈ **4,9 – 5,5 kWh/m²/jour** |
| « Heures de soleil plein » équivalentes | ≈ **4,5 – 5,0 h/jour** |
| Température moyenne | ≈ 26–28 °C (impact sur le rendement) |
| Saisons | Grande saison sèche (déc.–mars, la plus productive) ; saisons des pluies (mai–juil., sept.–oct., production réduite) |

**Facteur de performance (Performance Ratio, PR).** En climat chaud et humide,
on retient prudemment un **PR de 0,75 à 0,80** (pertes thermiques, poussière,
câblage, onduleur, salissures liées à l'harmattan et aux pluies).

**Productible spécifique estimé :**

```
Productible ≈ GHI_utile × PR
            ≈ 1 900 kWh/m²/an × 0,78
            ≈ 1 300 – 1 500 kWh par kWc installé et par an
```

> On retient dans cette étude une valeur de travail de **≈ 1 400 kWh/kWc/an**,
> soit environ **3,8 kWh/jour par kWc**.

---

## 3. Cadre réglementaire et acteurs

- **Distributeur / gestionnaire réseau :** CIE (Compagnie Ivoirienne d'Électricité).
- **Cadre institutionnel :** ministère en charge de l'Énergie, avec des objectifs
  nationaux de montée en puissance des énergies renouvelables dans le mix.
- **Autoconsommation :** l'installation raccordée au réseau pour l'autoconsommation
  est le cas le plus courant pour le résidentiel et le tertiaire.
- **Revente du surplus (net-metering) :** le cadre pour l'injection et la
  rémunération du surplus reste à confirmer au cas par cas auprès de la CIE et
  des autorités. **Ne pas présumer** d'un rachat du surplus dans le calcul de
  rentabilité par défaut.

> 📌 **À vérifier avant tout projet :** conditions de raccordement, autorisation
> éventuelle, normes d'installation (protection, mise à la terre) et assurance.

---

## 4. Typologie des installations

| Type | Puissance typique | Usage | Stockage |
|---|---|---|---|
| Résidentiel modeste | 1 – 3 kWc | Éclairage, TV, réfrigérateur, ventilateurs | Optionnel |
| Résidentiel confort | 3 – 6 kWc | + climatisation, pompe, équipements | Recommandé |
| Villa / grande maison | 6 – 12 kWc | Autonomie forte, plusieurs clims | Oui |
| Commerce / PME | 10 – 100 kWc | Bureaux, boutiques, ateliers | Selon besoin |
| Industrie | > 100 kWc | Process, froid, production | Souvent réseau + PV |

**Trois architectures possibles :**

1. **Raccordé réseau (on-grid), sans batterie** — le moins cher, réduit la
   facture mais s'arrête pendant les coupures.
2. **Hybride (on-grid + batterie)** — autoconsommation + secours pendant les
   coupures. C'est le plus pertinent à Abidjan vu la fréquence des coupures.
3. **Autonome (off-grid)** — sites isolés sans réseau ; nécessite un stockage
   important, coût par kWh plus élevé.

---

## 5. Méthode de dimensionnement

### 5.1 Étapes

1. **Relever la consommation** (kWh/mois sur les factures CIE, sur 12 mois).
2. **Définir le taux de couverture visé** par le solaire (ex. 60–90 %).
3. **Calculer la puissance crête** nécessaire :

```
Puissance (kWc) = Consommation annuelle couverte (kWh) / Productible (1 400 kWh/kWc/an)
```

4. **Estimer la surface de toiture** : environ **6 – 7 m² par kWc** (modules
   ~450–550 Wc).
5. **Dimensionner l'onduleur** (≈ 0,9 – 1,1 × la puissance crête).
6. **Dimensionner le stockage** si hybride (voir 5.3).

### 5.2 Exemple — foyer type

| Paramètre | Valeur |
|---|---|
| Consommation mensuelle | 400 kWh/mois → 4 800 kWh/an |
| Taux de couverture visé | 80 % → 3 840 kWh/an |
| **Puissance requise** | 3 840 / 1 400 ≈ **2,7 kWc → 3 kWc** |
| Nombre de panneaux (500 Wc) | ≈ **6 panneaux** |
| Surface toiture | ≈ **18 – 21 m²** |
| Onduleur | ≈ 3 kW |

### 5.3 Stockage (option hybride)

```
Capacité batterie (kWh) = Consommation à secourir la nuit (kWh) / Profondeur de décharge utile
```

Exemple : secourir 6 kWh la nuit avec des batteries lithium (DoD ≈ 90 %) →
≈ **6,7 kWh utiles**, soit un pack **≈ 7 – 10 kWh**.

---

## 6. Analyse économique

> Les prix sont des **ordres de grandeur en FCFA (XOF)**, très dépendants du
> fournisseur, de la qualité du matériel et de la présence d'un stockage.
> À confirmer par devis.

### 6.1 Hypothèses de coût (installation clé en main)

| Configuration | Coût indicatif (FCFA/kWc) |
|---|---|
| On-grid sans batterie | ≈ 550 000 – 800 000 |
| Hybride avec batterie lithium | ≈ 1 200 000 – 1 800 000 |

### 6.2 Exemple — installation 3 kWc on-grid

| Poste | Valeur |
|---|---|
| Investissement | 3 kWc × 700 000 ≈ **2 100 000 FCFA** |
| Production annuelle | 3 × 1 400 ≈ **4 200 kWh/an** |
| Tarif électricité évité (hypothèse) | ≈ **80 FCFA/kWh** |
| Économie annuelle | 4 200 × 80 ≈ **336 000 FCFA/an** |
| **Temps de retour brut (payback)** | 2 100 000 / 336 000 ≈ **6,3 ans** |
| Durée de vie modules | ≈ 25 ans (garantie de production) |

> Avec une durée de vie de ~25 ans et un payback ~6 ans, l'installation produit
> « gratuitement » (hors maintenance) pendant ~18 ans. L'ajout de batteries
> améliore le confort (secours coupures) mais **allonge le temps de retour**.

### 6.3 Sensibilité

- **Tarif électricité ↑** → payback plus court (le PV devient plus rentable).
- **Autoconsommation ↑** (consommer quand le soleil produit) → rentabilité ↑.
- **Batterie** → confort et résilience ↑, mais rentabilité pure ↓.

---

## 7. Maintenance et durée de vie

| Élément | Durée de vie indicative | Entretien |
|---|---|---|
| Modules PV | ~25 ans (garantie perf.) | Nettoyage 2–4×/an (poussière, harmattan) |
| Onduleur | ~10–15 ans | Ventilation, remplacement à mi-vie |
| Batteries lithium | ~8–12 ans | Surveillance BMS, température |
| Câblage / protections | ~25 ans | Contrôle annuel des connexions |

**Points d'attention locaux :** poussière de l'harmattan (déc.–févr.),
salissures liées aux pluies, chaleur (ventilation de l'onduleur), qualité des
protections électriques et de la mise à la terre.

---

## 8. Recommandations

1. **Commencer par mesurer** la consommation réelle (12 mois de factures).
2. **Prioriser l'autoconsommation** : décaler les usages (pompe, chauffe-eau,
   recharge) sur les heures ensoleillées.
3. **Choisir l'hybride** si les coupures sont fréquentes et l'activité sensible.
4. **Dimensionner sans surdimensionner** tant que le rachat du surplus n'est pas
   garanti (le surplus non consommé est perdu en on-grid sans injection).
5. **Exiger du matériel garanti** et un **installateur agréé** (SAV local).
6. **Prévoir la maintenance** (nettoyage, contrôle annuel) dès le budget.

---

## 9. Sources et méthode

- Ordres de grandeur d'irradiation cohérents avec les bases publiques de
  ressource solaire pour la région d'Abidjan (GHI ≈ 1 800–2 000 kWh/m²/an).
- Hypothèses de coûts et de tarifs à **valider localement** (devis, factures CIE).
- Modèle de productible simplifié : `Productible = GHI × PR`, PR ≈ 0,78.

> Ce document est une base de travail. Pour un projet réel, faire réaliser une
> étude détaillée par un professionnel agréé.
