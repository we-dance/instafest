<script setup>
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold leading-7 text-gray-900 mb-4">
      Next Steps
    </h1>
    <router-link to="/app/settings/stripe" class="underline hover:no-underline"
      >1. Setup Stripe</router-link
    >
  </div>
</template>
