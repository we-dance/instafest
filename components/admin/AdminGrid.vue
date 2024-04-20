<script setup lang="ts">
import type { CellContext, ColumnDef } from '@tanstack/vue-table'
import {
  collection as firebaseCollection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore'
import AdminRowActions from '~/components/admin/AdminRowActions'
import { getColumnsDef, getFieldsDef, normalizeDoc } from '~/lib/utils'

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  subheader: {
    type: String,
    default: '',
  },
  schema: {
    type: Object,
    required: true,
  },
  collection: {
    type: String,
    required: true,
  },
  add: {
    type: String,
    default: '',
  },
  edit: {
    type: String,
    default: 'Edit',
  },
  fields: {
    type: Array,
  },
  columns: {
    type: Array,
  },
})

const { $db } = useNuxtApp()
const { orgId } = useOrganizationStore()

const unsubscribe = ref<any>(null)
const items = ref<any[]>([])
const item = ref<any>({})
const editing = ref(false)

function onEdit(id: string) {
  item.value = id === '-' ? {} : items.value.find((p) => p.id === id)
  editing.value = true
}

async function onRemove(id: string) {
  if (!orgId) return

  await deleteDoc(doc($db, 'organizations', orgId, props.collection, id))
}

onMounted(() => {
  if (!orgId) return

  const q = query(
    firebaseCollection($db, 'organizations', orgId, props.collection)
  )

  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    items.value = []
    let docs: any[] = []

    querySnapshot.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
      })
    })

    items.value = docs.map(normalizeDoc)
  })
})

onUnmounted(() => unsubscribe.value && unsubscribe.value())

const computedFields = props.fields || getFieldsDef(props.schema)
const computedColumns = props.columns || getColumnsDef(props.schema)

const extendedColumns = [
  ...computedColumns,
  {
    id: 'actions',
    enableHiding: false,
    cell: (ctx: CellContext<any, any>) => {
      return h(AdminRowActions, {
        item: ctx.row.original,
        onEdit: onEdit,
        onRemove: onRemove,
      })
    },
  },
]
</script>

<template>
  <AdminPage :header="header" :subheader="subheader">
    <template v-if="add" #toolbar>
      <Button variant="outline" @click="onEdit('-')">{{ add }}</Button>
    </template>

    <AdminForm
      v-if="editing"
      v-model:item="item"
      :collection="collection"
      :title="edit"
      :fields="computedFields"
      :schema="schema"
      @close="editing = false"
    />

    <DataTable :data="items" :columns="extendedColumns" />
  </AdminPage>
</template>
