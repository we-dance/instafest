<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: Date | string
  modelValue?: Date | string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', payload: Date | string): void
}>()

const timezoneOffset = new Date().getTimezoneOffset() * 60000

const value = computed({
  get: () => {
    if (!props.modelValue) return ''

    if (!props.modelValue.getTime) {
      return props.modelValue
    }

    const localDate = new Date(props.modelValue.getTime() - timezoneOffset)
    return localDate.toISOString().substring(0, 16)
  },
  set: (newValue: string) => {
    if (!newValue) {
      emit('update:modelValue', undefined)
      return
    }

    const date = new Date(newValue)
    emit('update:modelValue', date)
  },
})
</script>

<template>
  <Input v-model="value" type="datetime-local" :class="props.class" />
</template>
