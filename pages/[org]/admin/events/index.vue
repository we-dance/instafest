<script setup lang="ts">
import { h } from 'vue'
import type { CellContext } from '@tanstack/vue-table'
import { RouterLink } from 'vue-router'
import { schema } from '~/types/event'
import { getColumnsDef } from '~/lib/utils'

definePageMeta({
  layout: 'admin',
})

const { link } = useOrganizationStore()

const extendGrid = {
  name: {
    cell: (ctx: CellContext<any, number>) => {
      const name = ctx.row.original.name
      const id = ctx.row.original.id

      return h(
        RouterLink,
        {
          to: link(`/admin/events/${id}`),
          class: 'underline hover:no-underline',
        },
        name
      )
    },
  },
}

const columns = getColumnsDef(schema, extendGrid)
</script>

<template>
  <AdminGrid
    header="Events"
    subheader="List of events"
    add="Add Event"
    edit="Edit Event"
    collection="events"
    :schema="schema"
    :columns="columns"
  />
</template>
