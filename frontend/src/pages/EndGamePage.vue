<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <h1 class="text-3xl font-bold mb-4">Game Over!</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Thanks for playing Entre Nous
      </p>
      <router-link
        to="/"
        class="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Play Again
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
