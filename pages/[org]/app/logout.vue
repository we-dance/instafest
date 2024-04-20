<script setup lang="ts">
definePageMeta({
  layout: 'studio',
  colorMode: 'dark',
})

const { link } = useOrganizationStore()
const { logoutUser } = useCustomer()
const router = useRouter()

onMounted(async () => {
  await logoutUser()
  router.replace(link('/'))
})
</script>

<template>
  <div>Logging out...</div>
</template>
