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

    <main class="isolate relative">
      <Toaster />
      <slot />
    </main>
  </div>
</template>
