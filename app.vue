<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'min-h-full',
  },
  bodyAttrs: {
    class: 'min-h-full',
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
#__nuxt {
  @apply min-h-full;
}
</style>
