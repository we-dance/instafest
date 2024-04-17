<script setup>
useHead({
  htmlAttrs: {
    class: 'bg-white',
  },
})
</script>

<template>
  <div class="bg-white h-full">
    <LandingHeader />

    <main class="isolate">
      <slot />
    </main>
  </div>
</template>
