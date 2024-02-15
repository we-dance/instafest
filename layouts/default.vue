<script setup>
const { user, onAuthLoaded } = useFirebaseAuth()
const router = useRouter()

onAuthLoaded(() => {
  if (user.value) {
    router.replace('/app/')
  }
})
</script>

<template>
  <div class="bg-white">
    <landing-header />

    <main class="isolate">
      <slot />
    </main>
  </div>
</template>
