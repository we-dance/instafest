<script setup>
definePageMeta({
  layout: 'admin',
})

const { orgSlug } = useOrganizationStore()
</script>

<template>
  <AdminPage header="Welcome to Instafest" subheader="Next Steps">
    <router-link
      :to="`/${orgSlug}/admin/settings`"
      class="underline hover:no-underline"
      >1. Setup Stripe</router-link
    >
  </AdminPage>
</template>
