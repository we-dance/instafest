<script setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'

defineProps({
  title: String,
})
</script>

<template>
  <div class="hidden md:block p-4">
    <slot />
  </div>
  <div
    class="sticky top-0 z-40 h-16 p-4 md:hidden border-b flex items-center gap-4"
  >
    <Sheet>
      <SheetTrigger>
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left">
        <slot />
      </SheetContent>
    </Sheet>
    <div>{{ title }}</div>
  </div>
</template>
