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
import { durationOptions, type Product } from '~/types/product'
import AdminRowActions from '~/components/admin/AdminRowActions'

definePageMeta({
  layout: 'admin',
})

const { $db } = useNuxtApp()
const { orgId } = useOrganizationStore()
const products = ref([])
const product = ref({})
const editing = ref(false)

function edit(id: string) {
  product.value = id === '-' ? {} : products.value.find((p) => p.id === id)
  editing.value = true
}

async function remove(id: string) {
  await deleteDoc(doc($db, 'organizations', orgId, 'products', id))
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const value = String(row.getValue('duration'))

      return durationOptions.find((d) => d.value === value)?.label
    },
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-right' }, 'Price'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('price'))

      const formatted = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
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
  const q = query(collection($db, 'organizations', orgId, 'products'))

  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    products.value = []

    querySnapshot.forEach((doc) => {
      products.value.push({
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
        <h2 class="text-2xl font-bold tracking-tight">Products</h2>
        <p class="text-muted-foreground">
          List of products available for purchase
        </p>
      </div>
      <Button variant="outline" @click="edit('-')"> Add Product </Button>
    </div>

    <AdminProductForm
      v-if="editing"
      v-model:product="product"
      @close="editing = false"
    />

    <DataTable :data="products" :columns="columns" />
  </div>
</template>
