<script setup>
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore'
import { getEventDates } from '~/lib/utils'

definePageMeta({
  layout: 'studio',
  colorMode: 'dark',
})

const { orgId } = useOrganizationStore()
const { $db } = useNuxtApp()

const events = ref([])

onMounted(async () => {
  const q = query(collection($db, 'organizations', orgId, 'events'))

  onSnapshot(q, (eventRefs) => {
    events.value = eventRefs.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .map((event) => {
        event.startDate = event.startDate ? event.startDate.toDate() : ''
        event.endDate = event.endDate ? event.endDate.toDate() : ''

        return event
      })
  })
})
</script>

<template>
  <AdminPage header="Events">
    <StudioEventCard v-for="event in events" :event="event" :key="event.id" />
  </AdminPage>
</template>
