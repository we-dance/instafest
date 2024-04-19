<script setup>
import { cn } from '@/lib/utils'

defineProps({
  items: Array,
})
</script>

<template>
  <nav class="flex flex-col space-y-1">
    <Button
      v-for="item in items"
      :key="item.name"
      as-child
      variant="ghost"
      :class="
        cn(
          'w-full text-left justify-start flex gap-2',
          $route.path === item.to && 'bg-muted hover:bg-muted'
        )
      "
    >
      <RouterLink :to="item.to">
        <component
          v-if="item.icon"
          :is="item.icon"
          class="h-6 w-6 shrink-0"
          aria-hidden="true"
        />
        <span class="truncate">
          {{ item.name }}
        </span>
      </RouterLink>
    </Button>
  </nav>
</template>
