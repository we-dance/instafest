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
  <div class="w-full min-h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
#__nuxt {
  @apply min-h-full;
}
</style>
