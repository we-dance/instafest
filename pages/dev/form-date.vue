<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})

import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const schema = z.object({
  startDate: z.coerce.date(),
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    startDate: new Date(),
  },
})

const onSubmit = handleSubmit(async (values: any) => {
  console.log(values)
})
</script>

<template>
  <div class="mx-auto max-w-[400px] mt-4">
    <form @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="startDate">
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <InputDate v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit">Submit</Button>
    </form>
  </div>
</template>
