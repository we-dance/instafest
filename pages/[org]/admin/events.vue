<script setup lang="ts">
import { eventSchema } from '~/types/event'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <AdminGrid
    header="Events"
    subheader="List of events"
    add="Add Event"
    edit="Edit Event"
    collection="events"
    :schema="eventSchema"
  />
</template>
