<template>
  <div id="app">
    <router-view />
    <InstallPrompt />
  </div>
</template>

<script setup lang="ts">
import InstallPrompt from '@/components/InstallPrompt.vue'
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