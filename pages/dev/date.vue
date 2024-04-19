<script setup lang="ts">
import { formatDate } from '~/lib/utils'

const today = new Date()
const val = ref(today)
</script>

<template>
  <div class="mx-auto max-w-[400px] mt-4">
    <pre>{{ { format: formatDate(val), val, type: typeof val } }}</pre>
    <InputDate v-model="val" />
  </div>
</template>
