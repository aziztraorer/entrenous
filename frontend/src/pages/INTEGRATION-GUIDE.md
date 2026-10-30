# Entre Nous - Guide d'Intégration Vue 3

## 📁 Structure des Fichiers

Place les fichiers dans ton projet Vue 3:

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.vue           ← Accueil
│   │   ├── CreateGamePage.vue      ← Créer une partie
│   │   ├── WaitPage.vue            ← Attendre un joueur
│   │   ├── GamePage.vue            ← Le jeu
│   │   ├── EndPage.vue             ← Partie terminée
│   │   └── NotFoundPage.vue        ← 404 Page
│   ├── router/
│   │   └── index.ts                ← Router configuration
│   ├── App.vue
│   ├── main.ts
│   └── ...
```

---

## 🚀 Intégration Rapide

### 1️⃣ Copier les fichiers

Copie tous les fichiers `.vue` dans `frontend/src/pages/`

### 2️⃣ Mettre à jour le router

Remplace le contenu de `frontend/src/router/index.ts` par le contenu du fichier `router-index.ts` fourni.

### 3️⃣ Mettre à jour App.vue

Assure-toi que `App.vue` utilise `<router-view>`:

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style>
:root {
  --bg-light: #FBF7F3;
  --bg-card: #FEFDFB;
  --text-primary: #2C2420;
  --text-secondary: #6B6158;
  --accent-rose: #C07A7A;
  --accent-burgundy: #6B3B3B;
  --border-subtle: #E8DFD6;
  --shadow-soft: rgba(44, 36, 32, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-light: #1A1714;
    --bg-card: #2A231D;
    --text-primary: #F5F0EB;
    --text-secondary: #B8A899;
    --accent-rose: #D9A5A5;
    --accent-burgundy: #C98686;
    --border-subtle: #3D342A;
    --shadow-soft: rgba(245, 240, 235, 0.1);
  }
}

:root[data-theme="dark"] {
  --bg-light: #1A1714;
  --bg-card: #2A231D;
  --text-primary: #F5F0EB;
  --text-secondary: #B8A899;
  --accent-rose: #D9A5A5;
  --accent-burgundy: #C98686;
  --border-subtle: #3D342A;
  --shadow-soft: rgba(245, 240, 235, 0.1);
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg-light);
  color: var(--text-primary);
  font-family: 'Crimson Text', Georgia, serif;
  margin: 0;
  padding: 1rem;
  line-height: 1.6;
}

html, body, #app {
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  body {
    padding: 0.5rem;
  }
}
</style>
```

### 4️⃣ Vérifier les imports

Assure-toi que les fonts Playfair Display et Crimson Text sont chargées. Ajoute à `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Crimson+Text:ital@0;1&display=swap" rel="stylesheet">
```

---

## 🔌 Intégration Backend

### 1️⃣ Adapter les appels API

Remplace les `TODO` dans les pages:

**CreateGamePage.vue**:
```typescript
const response = await fetch('/api/games', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    playerName: playerName.value || 'Anonyme',
    difficulty: difficulty.value
  })
})
const data = await response.json()
const gameId = data.id
```

**WaitPage.vue**:
```typescript
// Poll pour vérifier si l'autre joueur a rejoint
const checkForJoin = setInterval(async () => {
  const response = await fetch(`/api/games/${gameId}`)
  const game = await response.json()
  
  if (game.status === 'active') {
    clearInterval(checkForJoin)
    router.push(`/game/${gameId}`)
  }
}, 2000)
```

**GamePage.vue**:
```typescript
const submitResponse = async () => {
  const response = await fetch(`/api/games/${gameId}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: playerID,
      challengeId: challenge.id,
      content: response.value
    })
  })
  // Handle response...
}
```

### 2️⃣ Ajouter Socket.IO (Temps réel)

Installe Socket.IO:
```bash
npm install socket.io-client
```

Crée un service `src/services/socketService.ts`:

```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('sessionToken')
  }
})

socket.on('response:submit', (data) => {
  console.log('Joueur a soumis une réponse:', data)
})

socket.on('game:ended', (data) => {
  console.log('Jeu terminé!')
})

export default socket
```

### 3️⃣ Intégrer Socket.IO dans GamePage.vue

```typescript
import socket from '@/services/socketService'

onMounted(() => {
  socket.emit('game:join', { gameId })
  
  socket.on('response:received', (data) => {
    messages.value.push({
      player: 'Joueur 2',
      text: `Réponse reçue ✓`
    })
  })
})
```

---

## 🎨 Personnaliser le Style

Toutes les couleurs sont en CSS variables dans `:root`. Change-les dans `App.vue`:

```css
:root {
  --bg-light: #YourColor;
  --accent-rose: #YourColor;
  /* ... etc */
}
```

---

## 📝 Environment Variables

Crée un fichier `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Utilise dans le code:

```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL
```

---

## ✅ Checklist d'Intégration

- [ ] Tous les fichiers `.vue` copiés dans `src/pages/`
- [ ] Router mis à jour avec `router-index.ts`
- [ ] `App.vue` configuré avec `<router-view>`
- [ ] Fonts Google Fonts chargées dans `index.html`
- [ ] Socket.IO installé et configuré
- [ ] API endpoints connectés au backend
- [ ] Variables d'environnement définies
- [ ] Tests de navigation entre pages
- [ ] Tests des boutons et formulaires
- [ ] Tests du thème clair/sombre

---

## 🧪 Tester Localement

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visite `http://localhost:5173`

---

## 🚀 Points d'Entrée

Les routes sont:

| Route | Page | Descrition |
|-------|------|-----------|
| `/` | HomePage | Accueil |
| `/create` | CreateGamePage | Créer une partie |
| `/wait/:gameId` | WaitPage | Attendre un joueur |
| `/game/:gameId` | GamePage | Le jeu |
| `/end/:gameId` | EndPage | Partie terminée |
| `/*` | NotFoundPage | 404 |

---

## 💡 Conseils

1. **Lazy Loading**: Les pages utilisent `import()` pour le lazy loading
2. **Meta Tags**: Le titre de la page se met à jour avec `router.beforeEach`
3. **Auth Guard**: Le middleware vérifie si l'utilisateur a un token
4. **Dark Mode**: Supporter automatiquement le mode sombre via CSS

---

## 🐛 Dépannage

**Pages ne s'affichent pas?**
- Vérifie que les fichiers sont dans `src/pages/`
- Vérifie que le router importe les bonnes pages

**Styles ne s'appliquent pas?**
- Vérifie que `App.vue` a les variables CSS dans `:root`
- Vérifie que les fonts sont chargées

**Socket.IO ne fonctionne pas?**
- Vérifie que le backend écoute sur le port 3000
- Vérifie les logs du navigateur (F12)

---

**Besoin d'aide?** Consulte les fichiers `.vue` directement ou le backend API.

Happy coding! 🚀
