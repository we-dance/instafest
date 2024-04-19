<script setup lang="ts">
import { h } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore'
import type { ColumnDef } from '@tanstack/vue-table'
import { type Event } from '~/types/event'
import AdminRowActions from '~/components/admin/AdminRowActions'
import { DateFormatter } from '@internationalized/date'

definePageMeta({
  layout: 'admin',
})

const { $db } = useNuxtApp()
const { orgId } = useOrganizationStore()
const events = ref([])
const event = ref({})
const editing = ref(false)

function edit(id: string) {
  event.value = id === '-' ? {} : events.value.find((p) => p.id === id)
  editing.value = true
}

async function remove(id: string) {
  await deleteDoc(doc($db, 'organizations', orgId, 'events', id))
}

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
  timeStyle: 'short',
})

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      return df.format(row.getValue('startDate'))
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      return df.format(row.getValue('endDate'))
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(AdminRowActions, {
        item: row.original,
        onEdit: edit,
        onRemove: remove,
      })
    },
  },
]

const unsubscribe = ref(null)

onMounted(() => {
  const q = query(collection($db, 'organizations', orgId, 'events'))

  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    events.value = []

    querySnapshot.forEach((doc) => {
      events.value.push({
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        id: doc.id,
      })
    })
  })
})

onUnmounted(() => unsubscribe.value && unsubscribe.value())
</script>

<template>
  <AdminPage header="Team" subheader="Instructors, DJs, Photographers, etc.">
    <template #toolbar>
      <Button variant="outline" @click="edit('-')"> Add Member </Button>
    </template>

    <AdminEventForm
      v-if="editing"
      v-model:event="event"
      @close="editing = false"
    />

    <DataTable :data="events" :columns="columns" />
  </AdminPage>
</template>
