<script setup lang="ts">
import { schema, columns } from '~/types/product'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <AdminGrid
    header="Products"
    subheader="List of products"
    add="Add Product"
    edit="Edit Product"
    collection="products"
    :schema="schema"
    :columns="columns"
  />
</template>
