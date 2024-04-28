<script setup>
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore'
import { getEventDates } from '~/lib/utils'

definePageMeta({
  layout: 'studio',
  colorMode: 'dark',
})

const { orgId } = useOrganizationStore()
const { $db } = useNuxtApp()
const { account } = useCustomer()

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
  <AdminPage>
    <Card class="max-w-sm">
      <CardHeader>
        <CardTitle>Hallo {{ account.name }}!</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-gray-600 dark:text-gray-400">Aktuelles Paket</span>
          <span class="font-medium text-gray-900 dark:text-gray-50"
            >Silver</span
          >
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600 dark:text-gray-400"
            >Verbleibende Klassen</span
          >
          <span class="font-medium text-gray-900 dark:text-gray-50">4</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600 dark:text-gray-400"
            >Verbleibende Partys</span
          >
          <span class="font-medium text-gray-900 dark:text-gray-50">4</span>
        </div>
      </CardContent>
    </Card>

    <StudioEventCard v-for="event in events" :event="event" :key="event.id" />
  </AdminPage>
</template>
