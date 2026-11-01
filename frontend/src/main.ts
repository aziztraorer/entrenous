// Service worker : enregistré par le fichier registerSW.js injecté par
// vite-plugin-pwa (registerType: 'autoUpdate'). Aucun enregistrement manuel ici,
// pour éviter deux enregistrements concurrents (cause classique de conflit).

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/globals.css'

// Service worker : enregistré par le fichier registerSW.js injecté par
// vite-plugin-pwa (registerType: 'autoUpdate'). Aucun enregistrement manuel ici,
// pour éviter deux enregistrements concurrents (cause classique de conflit).

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
