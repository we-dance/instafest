<script setup lang="ts">
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '~/components/ui/toast/use-toast'

const props = defineProps({
  title: {
    type: String,
    default: 'Edit',
  },
  description: {
    type: String,
    default: '',
  },
  submit: {
    type: String,
    default: 'Save',
  },
  fields: {
    type: Array,
    default: () => [],
  },
  collection: {
    type: String,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])
const item = defineModel('item', { type: Object, default: {} })

configure({
  validateOnBlur: false,
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: item.value,
})

const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()
const { orgId } = useOrganizationStore()

const onSubmit = handleSubmit(async (values: any) => {
  const data = {
    ...values,
    updatedAt: +new Date(),
    updatedBy: uid.value,
  }

  if (!item.value.id) {
    data.createdBy = uid.value
    data.createdAt = +new Date()
  }

  try {
    if (!item.value.id) {
      await addDoc(
        collection($db, 'organizations', orgId, props.collection),
        data
      )
    } else {
      await updateDoc(
        doc($db, 'organizations', orgId, props.collection, item.value.id),
        data
      )
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  }
  emit('close')
})
</script>

<template>
  <Sheet open @update:open="(v) => v || emit('close')">
    <SheetContent>
      <form @submit.prevent="onSubmit">
        <SheetHeader>
          <SheetTitle>{{ title }}</SheetTitle>
          <SheetDescription>{{ description }}</SheetDescription>
        </SheetHeader>
        <template v-for="field in fields" :key="field.accessorKey">
          <FormField v-slot="{ componentField }" :name="field.accessorKey">
            <FormItem>
              <FormLabel>{{ field.label }}</FormLabel>
              <FormControl>
                <component
                  :is="field.as"
                  v-bind="{ ...componentField, ...field.bind }"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
        </template>
        <SheetFooter class="justify-end">
          <Button type="submit">{{ submit }}</Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
