<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { doc, collection, onSnapshot } from 'firebase/firestore'
import { h } from 'vue'
import { until } from '@vueuse/core'
import { Button } from '~/components/ui/button/index'
import { formatDate, normalizeDoc, getEventDates } from '~/lib/utils'
import { type Participant, ParticipantStatus } from '~/types/participant'

definePageMeta({
  layout: 'admin',
})

const { orgId } = useOrganizationStore()
const { $db } = useNuxtApp()
const route = useRoute()
const eventId = route.params.id

const event = ref<Event | null>(null)

if (!eventId) {
  throw new Error('Event ID is required')
}

if (!orgId) {
  throw new Error('Organization ID is required')
}

const eventRef = doc(collection($db, 'organizations', orgId, 'events'), eventId)

onSnapshot(eventRef, (eventSnap) => {
  event.value = normalizeDoc({ ...eventSnap.data(), id: eventSnap.id })
})

await until(event).not.toBeNull()

const { participants, updateParticipant } = useEvent(event)

async function checkin(participant: Participant, on: boolean) {
  if (on) {
    await updateParticipant(participant.customerId, {
      status: ParticipantStatus.CHECKED_IN,
      updatedAt: new Date(),
      checkedInAt: new Date(),
      checkInStatus: participant.status,
    })
  } else {
    await updateParticipant(participant.customerId, {
      status: participant.checkInStatus || ParticipantStatus.REGISTERED,
      updatedAt: new Date(),
      checkedInAt: null,
      checkInStatus: null,
    })
  }
}

const columns: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Role',
    accessorKey: 'role',
  },
  {
    header: 'Updated At',
    accessorKey: 'updatedAt',
    cell: ({ row }) => {
      return formatDate(row.original.updatedAt)
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      if (row.original.status !== ParticipantStatus.CHECKED_IN) {
        return h(
          Button,
          {
            onClick: () => {
              checkin(row.original, true)
            },
          },
          'Check-in'
        )
      } else {
        return h(
          Button,
          {
            onClick: () => {
              checkin(row.original, false)
            },
            class: 'bg-green-500',
          },
          'Attending'
        )
      }
    },
  },
]
</script>

<template>
  <Suspense>
    <AdminPage :header="event.name" :subheader="getEventDates(event)">
      <DataTable :data="participants" :columns="columns" />
    </AdminPage>
  </Suspense>
</template>
