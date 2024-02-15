<script setup lang="ts">
type LogoVariant = 'icon' | 'text' | 'full' | 'full-on-dark'

defineProps({
  variant: {
    type: String as PropType<LogoVariant>,
    default: 'icon',
  },
})
</script>

<template>
  <img
    v-if="variant === 'full-on-dark'"
    class="h-10 w-auto"
    src="/logo-horizontal-on-dark.svg"
    alt="InstaFest"
  />
  <img
    v-else-if="variant === 'full'"
    class="h-10 w-auto"
    src="/logo-horizontal.svg"
    alt="InstaFest"
  />
  <img
    v-else-if="variant === 'text'"
    class="h-10 w-auto"
    src="/logo-text.svg"
    alt="InstaFest"
  />
  <img v-else class="h-10 w-auto" src="/logo.svg" alt="InstaFest" />
</template>
