<script setup lang="ts">
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '~/components/ui/toast/use-toast'
import { durationOptions, productShema } from '~/types/product'

const emit = defineEmits(['close'])
const product = defineModel('product', { type: Object, default: {} })

configure({
  validateOnBlur: false,
})

const form = useForm({
  validationSchema: toTypedSchema(productShema),
  initialValues: product.value,
})

const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()
const { orgId } = useOrganizationStore()

const onSubmit = form.handleSubmit(async (values: any) => {
  const data = {
    ...values,
    updatedAt: +new Date(),
    updatedBy: uid.value,
  }

  if (!product.value.id) {
    data.createdBy = uid.value
    data.createdAt = +new Date()
  }

  try {
    if (!product.value.id) {
      await addDoc(collection($db, 'organizations', orgId, 'products'), data)
    } else {
      await updateDoc(
        doc($db, 'organizations', orgId, 'products', product.value.id),
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
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
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
          <FormField v-slot="{ componentField }" name="price">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="duration">
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Select v-bind="componentField" default-value="0">
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="option in durationOptions"
                        :key="option.value"
                        :value="option.value"
                        >{{ option.label }}</SelectItem
                      >
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
