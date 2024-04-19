<script setup lang="ts">
import { schema } from '~/types/venue'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <AdminGrid
    header="Venues"
    subheader="List of venues"
    add="Add Venue"
    edit="Edit Venue"
    collection="venues"
    :schema="schema"
  />
</template>
