import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/globals.css'

// Service worker : géré par vite-plugin-pwa (en prod il enregistre sw.js lui-même).
// En dev, /sw.js n'existe pas (Vite renvoie du HTML → erreur MIME), d'où ce guard.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.log('SW registration failed: ', err))
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
