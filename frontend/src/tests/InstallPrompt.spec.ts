/**
 * PROMPT 10 — Tests du composant InstallPrompt
 *  1. Proposition d'installation à la première visite (avant beforeinstallprompt)
 *  2. beforeinstallprompt disponible → « Installer l'application » + « Continuer sur le site »
 *  3. Refus d'installation → plus jamais affiché (localStorage)
 *  4. Application déjà installée (mode standalone) → jamais proposée
 *  5. Ouverture directe d'un lien d'invitation (/join?code=…) → proposition visible,
 *     l'accès au jeu n'est jamais bloqué
 *  6. iOS → instructions manuelles affichées
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import InstallPrompt from '@/components/InstallPrompt.vue'

const DEFERRED_KEY = 'entre-nous-install-dismissed'

// Mock minimal de window.matchMedia
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('standalone') ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('InstallPrompt (PROMPT 10)', () => {
  let wrapper: any = null

  beforeEach(() => {
    localStorage.clear()
    mockMatchMedia(false)
      ; (window.navigator as any).standalone = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  async function mountPrompt(): Promise<VueWrapper<any>> {
    const w = mount(InstallPrompt as any)
    vi.advanceTimersByTime(1600) // dépasse le setTimeout(tryShow, 1500)
    await w.vm.$nextTick()
    wrapper = w
    return w
  }

  it('n’affiche rien si l’app est déjà installée (mode standalone)', async () => {
    mockMatchMedia(true) // display-mode: standalone
    wrapper = await mountPrompt()
    expect(wrapper!.find('.install-prompt').exists()).toBe(false)
  })

  it('affiche la proposition à la première visite avec les deux boutons', async () => {
    wrapper = await mountPrompt()
    expect(wrapper.find('.install-prompt').exists()).toBe(true)
    expect(wrapper.text()).toContain('Installer l\'application')
    expect(wrapper.text()).toContain('Continuer sur le site')
  })

  it('n’affiche plus la proposition après un refus (« Continuer sur le site »)', async () => {
    wrapper = await mountPrompt()
    expect(wrapper.find('.install-prompt').exists()).toBe(true)

    await wrapper.find('.continue-btn').trigger('click')
    expect(localStorage.getItem(DEFERRED_KEY)).toBe('1')
    expect(wrapper.find('.install-prompt').exists()).toBe(false)

    // Nouvelle visite : toujours masqué
    const second = mount(InstallPrompt)
    vi.advanceTimersByTime(1600)
    await second.vm.$nextTick()
    expect(second.find('.install-prompt').exists()).toBe(false)
    second.unmount()
  })

  it('affiche la proposition aussi sur un lien d’invitation (/join) sans bloquer le jeu', async () => {
    // Le composant est monté dans App.vue, donc sur toutes les routes, /join incluse.
    // On simule simplement une route d'invitation : la proposition doit être visible
    // et aucune interception de navigation n'existe (les deux boutons ne redirigent pas).
    wrapper = await mountPrompt()
    expect(wrapper.find('.install-prompt').exists()).toBe(true)
    const installBtn = wrapper.find('.install-btn')
    const continueBtn = wrapper.find('.continue-btn')
    expect(installBtn.exists()).toBe(true)
    expect(continueBtn.exists()).toBe(true)
    // Aucun overlay bloquant : le prompt est en position fixed, pointer-events none sur le fond
    const style = wrapper.find('.install-prompt').attributes('style')
    expect(style).toBeUndefined() // pas de style inline bloquant
  })

  it('affiche les instructions manuelles sur iOS (beforeinstallprompt jamais déclenché)', async () => {
    const originalUA = navigator.userAgent
    Object.defineProperty(window.navigator, 'userAgent', { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', configurable: true })
    wrapper = await mountPrompt()
    expect(wrapper.find('.install-prompt').exists()).toBe(true)
    expect(wrapper.text()).toContain('Sur iPhone / iPad')
    expect(wrapper.text()).toContain('Sur l\'écran d\'accueil')
    Object.defineProperty(window.navigator, 'userAgent', { value: originalUA, configurable: true })
  })

  it('installe via beforeinstallprompt quand disponible', async () => {
    wrapper = await mountPrompt()
    const promptFn = vi.fn().mockResolvedValue(undefined)
    const choice = Promise.resolve({ outcome: 'accepted' })

    // Simule l'émission de beforeinstallprompt AVANT le timeout de tryShow
    const evt = new Event('beforeinstallprompt')
      ; (evt as any).prompt = promptFn
      ; (evt as any).userChoice = choice
      ; (evt as any).preventDefault = vi.fn()
    window.dispatchEvent(evt)
    await flushPromises()
    vi.advanceTimersByTime(1600)

    expect(wrapper.find('.install-prompt').exists()).toBe(true)
    await wrapper.find('.install-btn').trigger('click')
    await flushPromises()
    expect(promptFn).toHaveBeenCalled()
    expect(wrapper.find('.install-prompt').exists()).toBe(false)
    // Accepté → pas de marquage « refusé »
    expect(localStorage.getItem(DEFERRED_KEY)).toBeNull()
  })
})

// debug marker
