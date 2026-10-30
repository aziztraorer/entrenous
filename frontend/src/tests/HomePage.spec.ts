/**
 * HomePage component tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'

describe('HomePage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the home page with title', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Entre Nous')
  })

  it('renders process steps', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Créer')
    expect(wrapper.text()).toContain('Inviter')
    expect(wrapper.text()).toContain('Jouer')
  })

  it('renders category cards', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Social')
    expect(wrapper.text()).toContain('Personnel')
    expect(wrapper.text()).toContain('Profond')
  })
})
