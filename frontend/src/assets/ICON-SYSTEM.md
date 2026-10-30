# Entre Nous - Système d'Icônes Feather Icons

## Vue d'ensemble
Ce document décrit le système d'icônes SVG utilisé sur tout le site Entre Nous. Toutes les icônes utilisent **Feather Icons** (https://feathericons.com/) pour une cohérence visuelle et une élégance minimaliste.

---

## Logo & Branding

### Logo Principal - Cœur
Utilisé dans le header de chaque page.
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>
```

---

## Navigation & Actions

### Boutons Principaux

#### Créer (Plus)
Pour créer une nouvelle partie.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
```

#### Rejoindre (Arrow Right)
Pour rejoindre une partie existante.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

#### Soumettre (Checkmark)
Pour valider une réponse.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
```

#### Passer (Skip)
Pour sauter une question.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"></polyline>
</svg>
```

#### Retour (Chevron Left)
Pour revenir à la page précédente.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="15 18 9 12 15 6"></polyline>
</svg>
```

#### Accueil (Home)
Pour retourner à la page d'accueil.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  <polyline points="9 22 9 12 15 12 15 22"></polyline>
</svg>
```

---

## Catégories de Défis

### Social - Utilisateurs
```html
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
  <circle cx="9" cy="7" r="4"></circle>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
</svg>
```

### Personnel - Cible/Objectif
```html
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1"></circle>
  <path d="M12 1v6m8 4h-6m-8 0H1m11 11v-6"></path>
</svg>
```

### Amusant - Chat/Conversation
```html
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>
```

### Profond - Smiley Pensif
```html
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
  <line x1="9" y1="9" x2="9.01" y2="9"></line>
  <line x1="15" y1="9" x2="15.01" y2="9"></line>
</svg>
```

### Créatif - Palette/Art
```html
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v20M2 12h20"></path>
  <circle cx="12" cy="12" r="10"></circle>
</svg>
```

---

## Statistiques & Informations

### Horloge - Temps/Durée
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <polyline points="12 6 12 12 16 14"></polyline>
</svg>
```

### Calendrier - Défi/Numéro
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="21 8 21 21 3 21 3 8"></polyline>
  <line x1="1" y1="3" x2="23" y2="3"></line>
  <path d="M10 5v3m4 -3v3"></path>
</svg>
```

### Partage - Réseau
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="18" cy="5" r="3"></circle>
  <circle cx="6" cy="12" r="3"></circle>
  <circle cx="18" cy="19" r="3"></circle>
  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
</svg>
```

---

## Partage & Communication

### Copier - Document
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
</svg>
```

### SMS
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>
```

### Email
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1"></circle>
  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path>
  <polyline points="22 6 12 13 2 6"></polyline>
</svg>
```

---

## Confidentialité & Sécurité

### Checkmark - Validation
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
```

### Lock - Sécurité
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>
```

### Clock - Données supprimées
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <polyline points="12 6 12 12 16 14"></polyline>
</svg>
```

---

## Statistiques Finales

### Rejouer - Refresh
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="23 4 23 10 17 10"></polyline>
  <polyline points="1 20 1 14 7 14"></polyline>
  <path d="M3.51 9a9 9 0 0114.85-3.36 10 10 0 01.69 11.26M21.49 15a9 9 0 01-14.85 3.36 10 10 0 01-.69-11.26"></path>
</svg>
```

### Moments clés - Document
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
  <polyline points="13 2 13 9 20 9"></polyline>
</svg>
```

---

## Principes d'Utilisation

### Couleurs
- **Défaut**: `stroke="currentColor"` (utilise la couleur de texte du parent)
- **Accent**: `stroke="var(--accent-rose)"` pour les icônes importantes
- **Secondaire**: `stroke="var(--text-secondary)"` pour les icônes moins visibles

### Tailles
- **Header/Navigation**: 16-18px
- **Catégories**: 32px
- **Bouttons**: 18px
- **Stats**: 16-24px

### Stroke Width
- **Toutes les icônes**: `stroke-width="2"` par défaut

### Attributs SVG Recommandés
```html
<svg 
  width="18" 
  height="18" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
>
  <!-- contenu -->
</svg>
```

---

## Intégration dans Vue 3

### Composant Réutilisable - Icon.vue
```vue
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <component :is="`${name}Icon`" />
  </svg>
</template>

<script setup>
defineProps({
  name: String, // 'heart', 'check', 'lock', etc.
  size: { type: Number, default: 18 },
  color: { type: String, default: 'currentColor' },
  className: String
})
</script>
```

### Utilisation
```vue
<Icon name="heart" size="20" color="var(--accent-rose)" />
<Icon name="check" />
<Icon name="lock" color="var(--accent-burgundy)" />
```

---

## Ressources

- **Feather Icons**: https://feathericons.com/
- **SVG Editor Online**: https://www.svgedit.net/
- **Icon Generator**: Tous les SVG peuvent être téléchargés depuis feathericons.com

---

**Dernière mise à jour**: 27 octobre 2026
**Version**: 1.0
**Statut**: Complet et approuvé pour production
