<script setup lang="ts">
/**
 * InstallPrompt (PROMPT 10)
 * - Propose l'installation dès la première visite via beforeinstallprompt
 * - Fallback : instructions manuelles (iPhone/iPad, Safari, Firefox)
 * - « Installer l'application » / « Continuer sur le site » — jamais bloquant
 * - Ne réapparaît pas si déjà installée (mode standalone) ni après refus (localStorage)
 * - Ne perd jamais le lien d'invitation : l'app s'ouvre sur l'URL actuelle
 *   (start_url dans le manifeste = '/', les routes /join?code=... sont conservées
 *   par le navigateur en mode standalone)
 */
import { ref, onMounted, onUnmounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DEFERRED_KEY = 'entre-nous-install-dismissed'

const visible = ref(false)
const showManual = ref(false)
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const platform = ref<'ios' | 'android' | 'desktop'>('desktop')

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true || // iOS Safari
    document.referrer.startsWith('android-app://')
  )
}

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

function detectPlatform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

function onBeforeInstallPrompt(e: Event) {
  e.preventDefault()
  deferredPrompt.value = e as BeforeInstallPromptEvent
  tryShow()
}

/** Événement capté par le script inline de index.html, avant le montage de Vue */
function retrieveEarlyPrompt() {
  const early = (window as any).__installPromptEvent
  if (early && !deferredPrompt.value) {
    deferredPrompt.value = early as BeforeInstallPromptEvent
    ;(window as any).__installPromptEvent = null
    tryShow()
  }
}

function tryShow() {
  if (isStandalone()) return
  if (localStorage.getItem(DEFERRED_KEY) === '1') return
  // beforeinstallprompt disponible → fenêtre native possible
  if (deferredPrompt.value) {
    visible.value = true
  } else if (platform.value === 'ios') {
    // Safari iOS/iPadOS ne déclenche jamais beforeinstallprompt :
    // on affiche les instructions manuelles directement.
    visible.value = true
    showManual.value = true
  } else {
    // Chrome/Firefox desktop sans critères PWA remplis : instructions génériques
    visible.value = true
    showManual.value = true
  }
}

/** Réagit aussi à l'installation effectuée via les menus du navigateur */
function onAppInstalled() {
  visible.value = false
  localStorage.removeItem(DEFERRED_KEY)
}

async function install() {
  if (!deferredPrompt.value) {
    showManual.value = true
    return
  }
  await deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  deferredPrompt.value = null
  visible.value = false
  if (outcome === 'dismissed') {
    localStorage.setItem(DEFERRED_KEY, '1')
  }
}

function dismiss() {
  localStorage.setItem(DEFERRED_KEY, '1')
  visible.value = false
}

onMounted(() => {
  try {
    platform.value = detectPlatform()
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    // Récupère l'événement capté avant le montage, puis écoute les suivants.
    retrieveEarlyPrompt()
    tryShow()
    setTimeout(tryShow, 1500)
  } catch {
    // Ne jamais bloquer l'accès au jeu pour un problème d'affichage
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})
</script>

<template>
  <div v-if="visible" class="install-prompt" role="dialog" aria-label="Proposition d'installation">
      <div class="install-content">
        <p class="install-title">Installer Entre Nous ?</p>
        <p class="install-text">
          Installe l'application pour retrouver tes parties plus facilement.
          Tu peux aussi continuer sans installer — rien n'est bloqué.
        </p>

        <div class="install-actions">
          <!-- Bouton natif : visible uniquement quand l'installation est réellement possible -->
          <button v-if="deferredPrompt" class="install-btn" @click="install">Installer l'application</button>
          <button class="continue-btn" @click="dismiss">Continuer sur le site</button>
        </div>

        <div v-if="showManual" class="manual-help">
          <template v-if="platform === 'ios'">
            <p><strong>Sur iPhone / iPad :</strong></p>
            <ol>
              <li>Ouvre ce site dans <strong>Safari</strong>.</li>
              <li>Touche le bouton <strong>Partager</strong> (carré avec flèche).</li>
              <li>Choisis <strong>« Sur l'écran d'accueil »</strong>.</li>
              <li>Touche <strong>Ajouter</strong>.</li>
            </ol>
          </template>
          <template v-else>
            <p><strong>Installation manuelle :</strong></p>
            <ol>
              <li>Ouvre le menu de ton navigateur (⋮ ou ⋯).</li>
              <li>Choisis <strong>« Installer l'application »</strong> ou « Ajouter à l'écran d'accueil ».</li>
            </ol>
          </template>
          <p class="manual-note">Ton lien d'invitation reste valable après installation.</p>
        </div>
      </div>
    </div>
</template>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.install-content {
  pointer-events: auto;
  background: #fff;
  border: 1px solid #E8DFD6;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(44, 36, 32, 0.18);
  padding: 1rem 1.25rem;
  max-width: 420px;
  width: 100%;
}

.install-title {
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.35rem 0;
}

.install-text {
  font-size: 0.9rem;
  color: #6B6158;
  margin: 0 0 0.9rem 0;
}

.install-actions {
  display: flex;
  gap: 0.6rem;
}

.install-btn {
  flex: 1;
  padding: 0.65rem 1rem;
  background: #6B3B3B;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.continue-btn {
  flex: 1;
  padding: 0.65rem 1rem;
  background: transparent;
  color: #6B3B3B;
  border: 1px solid #C07A7A;
  border-radius: 8px;
  cursor: pointer;
}

.manual-help {
  margin-top: 0.9rem;
  font-size: 0.85rem;
  color: #6B6158;
  border-top: 1px solid #E8DFD6;
  padding-top: 0.7rem;
}

.manual-help ol {
  margin: 0.3rem 0 0.5rem 1.2rem;
  padding: 0;
}

.manual-note {
  font-style: italic;
  margin-top: 0.4rem;
}

.install-fade-enter-active,
.install-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.install-fade-enter-from,
.install-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
