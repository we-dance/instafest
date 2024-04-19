<script setup lang="ts">
import {
  collection as firebaseCollection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore'
import AdminRowActions from '~/components/admin/AdminRowActions'
import { getColumnsDef, getFieldsDef } from '~/lib/utils'

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
    default: 'Add',
  },
  edit: {
    type: String,
    default: 'Edit',
  },
})

const { $db } = useNuxtApp()
const { orgId } = useOrganizationStore()

const unsubscribe = ref(null)
const items = ref([])
const item = ref({})
const editing = ref(false)

function onEdit(id: string) {
  item.value = id === '-' ? {} : items.value.find((p) => p.id === id)
  editing.value = true
}

async function onRemove(id: string) {
  await deleteDoc(doc($db, 'organizations', orgId, props.collection, id))
}

onMounted(() => {
  const q = query(
    firebaseCollection($db, 'organizations', orgId, props.collection)
  )

  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    items.value = []
    let docs = []

    querySnapshot.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
      })
    })

    docs = docs.map((doc) => {
      const result = { ...doc }
      if (result.startDate) {
        result.startDate = result.startDate.toDate()
      }
      if (result.endDate) {
        result.endDate = result.endDate.toDate()
      }
      return result
    })

    items.value = docs
  })
})

onUnmounted(() => unsubscribe.value && unsubscribe.value())

const fields = getFieldsDef(props.schema)
const columns = [
  ...getColumnsDef(props.schema),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h(AdminRowActions, {
        item: row.original,
        onEdit: onEdit,
        onRemove: onRemove,
      })
    },
  },
]
</script>

<template>
  <AdminPage :header="header" :subheader="subheader">
    <template #toolbar>
      <Button variant="outline" @click="onEdit('-')">{{ add }}</Button>
    </template>

    <AdminForm
      v-if="editing"
      v-model:item="item"
      :collection="collection"
      :title="edit"
      :fields="fields"
      :schema="schema"
      @close="editing = false"
    />

    <DataTable :data="items" :columns="columns" />
  </AdminPage>
</template>
