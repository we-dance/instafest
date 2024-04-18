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
const customers = ref([])
const customer = ref({})
const editing = ref(false)

function edit(id: string) {
  customer.value = id === '-' ? {} : customers.value.find((p) => p.id === id)
  editing.value = true
}

async function remove(id: string) {
  await deleteDoc(doc($db, 'organizations', orgId, 'customers', id))
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
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
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
  const q = query(collection($db, 'organizations', orgId, 'customers'))

  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    customers.value = []

    querySnapshot.forEach((doc) => {
      customers.value.push({
        ...doc.data(),
        id: doc.id,
      })
    })
  })
})

onUnmounted(() => unsubscribe.value && unsubscribe.value())
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Customers</h2>
        <p class="text-muted-foreground">List of customers</p>
      </div>
      <Button variant="outline" @click="edit('-')"> Add Customer </Button>
    </div>

    <AdminEventForm
      v-if="editing"
      v-model:event="customer"
      @close="editing = false"
    />

    <DataTable :data="customers" :columns="columns" />
  </div>
</template>
