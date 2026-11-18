# PanierMalin

Application web anti-gaspillage alimentaire conçue pour les quartiers d'Abidjan. Elle permet aux boulangeries, maquis et restaurants de mettre en ligne leurs invendus du jour entre -50% et -70%, et aux clients de les réserver en ligne avant fermeture.

Projet réalisé dans le cadre du module **Fondamentaux du Web** — MIAGE 2ème Année, Université Polytechnique de Bingerville (UPB).

**Membres du groupe :**
- Kone Mohamed Lukmane
- Akambi Bili
- Bagayoko Abdoulaye
- Elleli Océane
- Kone Ira Maéva

---

## Fonctionnalités

**Espace Client :**
- Filtrage des paniers par quartier d'Abidjan (Cocody, Marcory, Plateau, Yopougon, etc.) et par catégorie
- Recherche par mot-clé et tri (prix croissant, remise la plus forte, stock disponible)
- Carte interactive (Leaflet / OpenStreetMap) affichant les commerces, la distance estimée et un lien d'itinéraire Google Maps
- Enregistrement des paniers favoris (réservé aux utilisateurs connectés)
- Réservation avec choix de la quantité, mode de réception (retrait direct au commerce ou livraison à domicile) et règlement Wave ou Orange Money
- Génération d'un code de retrait unique (`PM-XXXX`) copiable en un clic
- Suivi des commandes, confirmation de réception, annulation d'une commande en cours et compteur d'impact (paniers sauvés, économies en FCFA, CO2 évité)

**Espace Commerçant :**
- Tableau de bord individuel (nombre de paniers vendus, chiffre d'affaires, commandes en attente)
- Publication, modification, désactivation et réactivation des paniers
- Validation rapide des retraits en saisissant le code client (`PM-XXXX`)

**Gestion des comptes :**
- Connexion et inscription avec choix de l'indicatif pays (`+225`, `+221`, `+223`, `+226`, `+228`, `+229`, `+224`, `+233`, `+237`, `+33`, `+1`) et contrôle automatique du format du numéro
- Option pour afficher ou masquer le mot de passe lors de la saisie
- Données enregistrées localement dans le navigateur (`localStorage`) et séparées pour chaque compte

---

## Fichiers du projet

```text
paniermalin/
├── index.html          # Structure HTML des 8 écrans de l'application
├── style.css           # Styles et mise en page responsive
├── app.js              # Logique front-end et persistance locale isolée par compte
├── logo.png            # Logo PanierMalin
├── scripts/
│   ├── serve.js        # Serveur statique local léger (sans dépendance)
│   └── lint.js         # Contrôle qualité et linting du projet
├── tests/
│   └── app.test.js     # Suite de tests automatisés
├── docs/
│   ├── Livrable_2_PanierMalin.pdf
│   └── Livrable_2_PanierMalin.pptx
├── .env.example        # Modèle de variables d'environnement
├── .eslintrc.json      # Règles de linting JavaScript
├── .editorconfig       # Conventions d'indentation et d'encodage
├── .gitignore
├── package.json        # Scripts npm (start, lint, test)
└── README.md           # Documentation
```

---

## Configuration & lancement

### 1. Variables d'environnement (optionnel)
Copier `.env.example` en `.env` pour personnaliser le port local :
```bash
cp .env.example .env
```

### 2. Lancer l'application (au choix)
- **Avec Live Server (VS Code)** : ouvrir le dossier dans VS Code, clic droit sur `index.html` → **Open with Live Server**.
- **Avec Node.js (zéro dépendance à installer)** :
  ```bash
  npm start
  ```
  Puis ouvrir `http://localhost:5500` dans le navigateur.

---

## Qualité du code & tests

- Vérifier la syntaxe, le linting et la conformité Starter Kit :
  ```bash
  npm run lint
  ```
- Exécuter la suite de tests automatisés :
  ```bash
  npm test
  ```

---

## Comptes de test (`+225`)

| Profil | Nom / Établissement | Numéro | Mot de passe |
| :--- | :--- | :--- | :--- |
| Client | Awa Koné | `07 00 00 00 03` | `demo1234` |
| Commerçant | Le Fournil Cocody | `07 00 00 00 01` | `demo1234` |
| Commerçant | Maquis Chez Tantie | `07 00 00 00 02` | `demo1234` |
