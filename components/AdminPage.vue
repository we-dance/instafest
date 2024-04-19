<script setup>
defineProps({
  header: String,
  subheader: String,
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ header }}</h2>
        <p class="text-muted-foreground">{{ subheader }}</p>
      </div>

      <slot name="toolbar" />
    </div>

    <slot />
  </div>
</template>
