<script setup lang="ts">
/**
 * UpdatePrompt — bannière « Mise à jour disponible »
 *
 * Quand un nouveau Service Worker est prêt (nouvelle version déployée),
 * un bouton permet d'appliquer la mise à jour immédiatement :
 * plus besoin d'effacer le cache manuellement.
 *
 * Fonctionne avec registerType: 'prompt' + message SKIP_WAITING au SW.
 * L'événement 'vite-plugin-pwa:register-sw' et workbox-window sont gérés
 * ici via l'API Service Worker standard (onupdatefound).
 */
import { ref, onMounted, onUnmounted } from 'vue'

const updateReady = ref(false)
let waitingWorker: ServiceWorker | null = null

function onWorkerStateChange() {
  // Quand le SW en attente passe à 'installed' → nouvelle version prête.
  // On n'exige PAS navigator.serviceWorker.controller : sur une visite site
  // normal (page chargée sans contrôleur), la bannière doit s'afficher aussi.
  if (waitingWorker?.state === 'installed') {
    updateReady.value = true
  }
}

function applyUpdate() {
  if (!waitingWorker) return
  waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  // Dès que le nouveau SW contrôle la page, on recharge pour charger les nouveaux fichiers
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  }, { once: true })
}

onMounted(async () => {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return
    // CAS 0 : aucune mise à jour en attente → on déclenche une vérification
    // immédiate auprès du serveur (utile pour les visites sans rechargement)
    if (!reg.waiting && !reg.installing) {
      reg.update().catch(() => {})
    }
    // CAS 1 : un SW en attente existe déjà (mise à jour prête au chargement)
    if (reg.waiting) {
      waitingWorker = reg.waiting
      onWorkerStateChange()
    }
    // CAS 2 : une mise à jour arrive pendant la session
    reg.addEventListener('updatefound', () => {
      const installing = reg.installing
      if (!installing) return
      waitingWorker = installing
      installing.addEventListener('statechange', onWorkerStateChange)
    })
  } catch {
    // jamais bloquer l'app pour la mise à jour
  }
})

onUnmounted(() => {
  waitingWorker?.removeEventListener('statechange', onWorkerStateChange)
})
</script>

<template>
  <Transition name="update-fade">
    <div v-if="updateReady" class="update-banner" role="status">
      <div class="update-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0114.85-3.36 10 10 0 01.69 11.26M21.49 15a9 9 0 01-14.85 3.36 10 10 0 01-.69-11.26">
          </path>
        </svg>
        <span class="update-text">Une nouvelle version est disponible</span>
        <button class="update-btn" @click="applyUpdate">Mettre à jour</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.update-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: calc(100% - 2rem);
  max-width: 440px;
}

.update-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--accent-burgundy, #6B3B3B);
  color: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.update-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.update-btn {
  background: white;
  color: var(--accent-burgundy, #6B3B3B);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
}

.update-btn:hover {
  opacity: 0.9;
}

.update-fade-enter-active,
.update-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.update-fade-enter-from,
.update-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
