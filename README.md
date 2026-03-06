# 🌾 RecolteCheck

Une application simple pour le suivi des récoltes agricoles — fonctionne sur Android et iOS avec une synchronisation cloud via Firebase.

---

## A) Écrans requis (9 écrans)

| # | Écran | Chemin | Description |
|---|--------|--------|-------|
| 1 | Connexion | `(auth)/login` | Saisie Email + Mot de passe |
| 2 | Inscription | `(auth)/register` | Enregistrement d'un nouvel agriculteur (Nom, Tél, Email, MDP) |
| 3 | Liste des Parcelles | `(tabs)/index` | Page d'accueil — Affichage de toutes les parcelles + bouton d'ajout |
| 4 | Profil | `(tabs)/profile` | Consultation et modification des données personnelles + Déconnexion |
| 5 | Ajouter une Parcelle | `parcelle/add` | Formulaire : Nom, Surface, Cultures, Période de récolte |
| 6 | Détails de la Parcelle| `parcelle/[id]` | Infos de la parcelle + liste des zones + modification/suppression |
| 7 | Modifier la Parcelle | `parcelle/edit/[id]` | Modification des données de la parcelle |
| 8 | Ajouter une Zone | `zone/add` | Ajout d'une zone dans une parcelle (Nom + Surface) |
| 9 | Détails de la Zone | `zone/[id]` | Affichage de la zone + historique des récoltes + bouton ajout récolte |
| 10| Ajouter une Récolte | `recolte/add` | Enregistrement d'une récolte (Type, Poids, Notes) |

---

## B) Modèle de données Firestore

```
users/{userId}
├── nom: string              // Nom de famille
├── prenom: string           // Prénom
├── telephone: string        // Numéro de téléphone
├── email: string            // Email
├── createdAt: timestamp
│
└── parcelles/{parcelleId}
    ├── nom: string              // Nom de la parcelle
    ├── surface: number          // Surface en hectares
    ├── cultures: string[]       // Liste des types de cultures
    ├── periodeRecolte: string   // Période de récolte estimée
    ├── createdAt: timestamp
    │
    └── zones/{zoneId}
        ├── nom: string          // Nom de la zone
        ├── surface: number      // Surface de la zone
        ├── createdAt: timestamp
        │
        └── recoltes/{recolteId}
            ├── culture: string      // Type de culture récoltée
            ├── poids: number        // Poids en kilogrammes
            ├── date: timestamp      // Date de la récolte
            ├── notes: string        // Notes/Remarques
            ├── createdAt: timestamp
```

**Relations :**
- `parcelles` → Sous-collection dans `users/{userId}`
- `zones` → Sous-collection dans `parcelles/{parcelleId}`
- `recoltes` → Sous-collection dans `zones/{zoneId}`
- Toutes les données sont liées à l'agriculteur via son `userId`.

---

## C) Configuration Firebase Auth

1. **Création du projet Firebase :**
   - Allez sur la [Firebase Console](https://console.firebase.google.com)
   - Créez un nouveau projet nommé `RecolteCheck`

2. **Activer l'Authentication :**
   - Menu latéral : `Build` → `Authentication`
   - Cliquez sur `Get Started`
   - Activez la méthode `Email/Password`

3. **Ajouter l'application Android :**
   - Paramètres du projet → `Add app` → Android
   - Nom du package : `com.recoltecheck.app`
   - Téléchargez `google-services.json` et placez-le dans `android/app/`

4. **Ajouter l'application iOS :**
   - Paramètres du projet → `Add app` → iOS
   - Bundle ID : `com.recoltecheck.app`
   - Téléchargez `GoogleService-Info.plist` et placez-le dans `ios/`

5. **Activer Firestore :**
   - Menu : `Build` → `Firestore Database`
   - Cliquez sur `Create database`
   - Choisissez l'emplacement le plus proche (ex: `europe-west1`)
   - Démarrez en mode Production

6. **Déployer les règles de sécurité :**
   - Copiez le contenu de `firestore.rules` et collez-le dans l'onglet Firestore → Rules

---

## D) Règles de sécurité Firestore

Fichier : `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chaque agriculteur n'accède qu'à ses propres données
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Interdire l'accès à tout autre chemin
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Explication :**
- `request.auth != null` → L'utilisateur doit être authentifié.
- `request.auth.uid == userId` → L'utilisateur ne peut accéder qu'aux documents sous son UID.
- `{document=**}` → La règle s'applique en cascade à toutes les sous-collections (parcelles, zones, récoltes).

---

## E) Plan d'exécution (Milestones)

### Étape 1 : Authentification (Auth) ✅
- Configuration Firebase dans le projet (install `@react-native-firebase/*`)
- Ajout de `AuthContext` pour la gestion d'état
- Écran de connexion (`login.tsx`)
- Écran d'inscription (`register.tsx`)
- Redirection automatique entre Auth et Tabs selon l'état de l'utilisateur

### Étape 2 : Profil Utilisateur (Profil CRUD) ✅
- Écran de profil (`profile.tsx`)
- Lecture des données utilisateur depuis Firestore
- Modification et sauvegarde des informations personnelles
- Bouton de déconnexion

### Étape 3 : Gestion des Parcelles (Parcelles CRUD) ✅
- Liste des parcelles sur la page d'accueil
- Écran d'ajout de parcelle (`parcelle/add.tsx`)
- Écran de détails de la parcelle (`parcelle/[id].tsx`)
- Écran de modification (`parcelle/edit/[id].tsx`)
- Suppression de parcelle
- Écoute des changements en temps réel (real-time sync)

### Étape 4 : Types de Cultures par Parcelle ✅
- Champ `cultures: string[]` dans la parcelle
- Saisie des cultures via une liste séparée par des virgules
- Affichage des cultures sous forme de badges (chips)

### Étape 5 : Zones par Parcelle (Zones) ✅
- Liste des zones dans l'écran de détails de la parcelle
- Écran d'ajout de zone (`zone/add.tsx`)
- Suppression de zone
- Synchronisation en temps réel

### Étape 6 : Récoltes par Zone (Récoltes + Historique) ✅
- Écran de détails de la zone (`zone/[id].tsx`) avec historique
- Écran d'ajout de récolte (`recolte/add.tsx`)
- Suppression de récolte
- Affichage de la production totale par zone
- Tri par date (la plus récente en premier)

### Étape 7 : Synchronisation Cloud ✅
- Stockage automatique de toutes les données dans Firestore
- Utilisation de `onSnapshot` pour la mise à jour instantanée
- Données accessibles sur n'importe quel appareil après connexion

---

## F) Extraits de code

### Exemple : Écoute en temps réel
```typescript
// services/firestoreService.ts
export function subscribeParcelles(userId: string, callback: (parcelles: Parcelle[]) => void) {
  return parcellesRef(userId).orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    const items: Parcelle[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Parcelle);
    });
    callback(items);
  });
}
```

### Exemple : Vérification Auth et Routage
```typescript
// app/_layout.tsx
useEffect(() => {
  if (loading) return;
  const inAuthGroup = segments[0] === '(auth)';
  if (!user && !inAuthGroup) {
    router.replace('/(auth)/login');
  } else if (user && inAuthGroup) {
    router.replace('/(tabs)');
  }
}, [user, loading, segments]);
```

---

## Lancement

```bash
# Installation des dépendances
npm install

# Lancement sur Android
npx expo run:android

# Lancement sur iOS
npx expo run:ios
```

> **Note :** Vous devez placer `google-services.json` dans `android/app/` et `GoogleService-Info.plist` dans `ios/` avant de lancer l'application.

---

## Hypothèses (Assumptions)

1. **Méthode d'Auth :** Email + Mot de passe uniquement (plus simple).
2. **Poids des récoltes :** En kilogrammes (kg) comme unité par défaut.
3. **Surface :** En hectares (ha) comme unité par défaut.
4. **Date de récolte :** Enregistrée automatiquement à l'ajout (date actuelle).
5. **Cultures :** Saisies sous forme de texte séparé par des virgules.
6. **Langue :** Interface prévue en arabe/français.

---

## Vérification des Besoins (Verification Against Requirements)

| # | Besoin | État | Emplacement |
|---|---------|--------|--------|
| 1 | Authentification via Firebase Auth | ✅ | `context/AuthContext.tsx` + `app/(auth)/*` |
| 2 | Un seul type de profil : "Agriculteur" | ✅ | Pas de système de rôles — chaque utilisateur est agriculteur |
| 3 | Gestion des infos personnelles | ✅ | `app/(tabs)/profile.tsx` + `services/firestoreService.ts` |
| 4 | Gestion des parcelles (surface, cultures, période) | ✅ | `app/parcelle/*` + `services/firestoreService.ts` |
| 5 | Suivi des récoltes par zone + historique | ✅ | `app/zone/[id].tsx` + `app/recolte/add.tsx` |
| 6 | Synchronisation Cloud | ✅ | Firestore `onSnapshot` globalement |
| 7 | Compatible Android et iOS | ✅ | React Native + Expo |

---

## Stack Technique

- **React Native** (Expo SDK 54) + **Expo Router** v6
- **Firebase Auth** (Email/Password)
- **Cloud Firestore** (Real-time sync)
- **TypeScript**
