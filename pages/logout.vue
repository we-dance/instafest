<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { logoutUser } = useFirebaseAuth()
const router = useRouter()

onMounted(async () => {
  await logoutUser()
  router.replace('/')
})
</script>

<template>
  <div>Logging out...</div>
</template>
