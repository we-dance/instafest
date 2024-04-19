<script setup lang="ts">
import { customerAccountSchema, fields, columns } from '~/types/customerAccount'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <AdminGrid
    header="Customers"
    subheader="List of customers"
    add="Add Customer"
    edit="Edit Customer"
    collection="customers"
    :schema="customerAccountSchema"
    :fields="fields"
    :columns="columns"
  />
</template>
