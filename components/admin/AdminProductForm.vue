<script setup lang="ts">
import { addDoc, collection } from 'firebase/firestore'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '~/components/ui/toast/use-toast'
import { durationOptions, productShema } from '~/types/product'

const form = useForm({
  validationSchema: toTypedSchema(productShema),
})

const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()
const { orgId } = useOrganizationStore()
const open = ref(false)

const onSubmit = form.handleSubmit(async (values: any) => {
  open.value = false

  const data = {
    ...values,
    description: values.description || '',
    createdAt: +new Date(),
    updatedAt: +new Date(),
    createdBy: uid.value,
    updatedBy: uid.value,
  }

  try {
    await addDoc(collection($db, 'organizations', orgId, 'products'), data)
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline"> Add Product </Button>
    </DialogTrigger>
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
