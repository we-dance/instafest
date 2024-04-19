<script setup lang="ts">
import { schema } from '~/types/member'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <AdminGrid
    header="Team"
    subheader="Instructors, DJs, Photographers, etc."
    add="Add Member"
    edit="Edit Member"
    collection="members"
    :schema="schema"
  />
</template>
