import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy load pages for better performance
const HomePage = () => import('@/pages/HomePage.vue')
const CreateGamePage = () => import('@/pages/CreateGamePage.vue')
const JoinGamePage = () => import('@/pages/JoinGamePage.vue')
const WaitPage = () => import('@/pages/WaitPage.vue')
const GamePage = () => import('@/pages/GamePage.vue')
const EndPage = () => import('@/pages/EndPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Entre Nous - Découvrez-vous ensemble'
    }
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateGamePage,
    meta: {
      title: 'Créer une partie - Entre Nous'
    }
  },
  {
    path: '/join',
    name: 'Join',
    component: JoinGamePage,
    meta: {
      title: 'Rejoindre une partie - Entre Nous'
    }
  },
  {
    path: '/wait/:gameId',
    name: 'Wait',
    component: WaitPage,
    meta: {
      title: 'En attente - Entre Nous'
    }
  },
  {
    path: '/game/:gameId',
    name: 'Game',
    component: GamePage,
    meta: {
      title: 'Le Jeu - Entre Nous',
      requiresAuth: true
    }
  },
  {
    path: '/end/:gameId',
    name: 'End',
    component: EndPage,
    meta: {
      title: 'Partie Terminée - Entre Nous'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: 'Page Non Trouvée - Entre Nous'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = title
  }
  next()
})

// Authentication guard (example)
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth as boolean
  const token = localStorage.getItem('sessionToken')

  if (requiresAuth && !token) {
    // Redirect to home if game page is accessed without auth
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
