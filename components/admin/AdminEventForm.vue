<script setup lang="ts">
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '~/components/ui/toast/use-toast'
import { eventSchema } from '~/types/event'

const emit = defineEmits(['close'])
const event = defineModel('event', { type: Object, default: {} })

configure({
  validateOnBlur: false,
})

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(eventSchema),
  initialValues: event.value,
})

const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()
const { orgId } = useOrganizationStore()

const startDate = computed({
  get: () =>
    event.value.startDate
      ? event.value.startDate.toISOString().slice(0, 16)
      : '',
  set: (value) => setFieldValue('startDate', new Date(value)),
})

const endDate = computed({
  get: () =>
    event.value.endDate ? event.value.endDate.toISOString().slice(0, 16) : '',
  set: (value) => setFieldValue('endDate', new Date(value)),
})

const onSubmit = handleSubmit(async (values: any) => {
  const data = {
    ...values,
    updatedAt: +new Date(),
    updatedBy: uid.value,
  }

  if (!event.value.id) {
    data.createdBy = uid.value
    data.createdAt = +new Date()
  }

  try {
    if (!event.value.id) {
      await addDoc(collection($db, 'organizations', orgId, 'events'), data)
    } else {
      await updateDoc(
        doc($db, 'organizations', orgId, 'events', event.value.id),
        data
      )
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
    })
  }
  emit('close')
})
</script>

<template>
  <Toaster />
  <Dialog open @update:open="(v) => v || emit('close')">
    <DialogContent class="sm:max-w-[500px]">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex gap-4">
          <FormField name="startDate">
            <FormItem class="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" v-model="startDate" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="endDate">
            <FormItem class="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" v-model="endDate" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter class="justify-end">
          <Button type="submit"> Save </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
