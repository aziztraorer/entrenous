/**
 * Configuration centralisée des URL backend (API + Socket.IO)
 *
 * Priorité :
 * 1. `VITE_API_URL` / `VITE_SOCKET_URL` (variables d'environnement Vite, injectées au build)
 * 2. En développement (`import.meta.env.DEV`) : fallback http://localhost:3000
 * 3. En production : fallback https://entrenous.onrender.com (backend Render)
 *
 * Ce fichier est la SEULE source de vérité. Aucune page ne doit déclarer
 * d'URL directement.
 */

const envApiUrl = import.meta.env.VITE_API_URL
const envSocketUrl = import.meta.env.VITE_SOCKET_URL

const devFallback = 'http://localhost:3000'
const prodFallback = 'https://entrenous.onrender.com'

export const isDev = import.meta.env.DEV

const fallback = isDev ? devFallback : prodFallback

export const API_URL = envApiUrl || fallback
export const SOCKET_URL = envSocketUrl || API_URL

/** Construit une URL de route API, ex. apiUrl('/api/games') */
export const apiUrl = (path: string): string => `${API_URL}${path}`
