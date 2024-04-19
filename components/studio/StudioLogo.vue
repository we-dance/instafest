<script setup>
const { org } = useOrganizationStore()
</script>

<template>
  <img
    v-if="org.slug === 'salsea'"
    src="https://salsea.de/wp-content/uploads/2023/04/salsea-tanzschule-logo-white-final.png"
  />
  <div v-else class="font-bold">{{ org.name }}</div>
</template>
