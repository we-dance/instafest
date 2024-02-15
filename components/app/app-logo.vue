<script setup lang="ts">
type LogoVariant = 'icon' | 'text' | 'full'

defineProps({
  variant: {
    type: String as PropType<LogoVariant>,
    default: 'icon',
  },
})
</script>

<template>
  <img
    v-if="variant === 'full'"
    class="mx-auto h-10 w-auto"
    src="/logo-horizontal.svg"
    alt="InstaFest"
  />
  <img
    v-else-if="variant === 'text'"
    class="mx-auto h-10 w-auto"
    src="/logo-text.svg"
    alt="InstaFest"
  />
  <img v-else class="mx-auto h-10 w-auto" src="/logo.svg" alt="InstaFest" />
</template>
