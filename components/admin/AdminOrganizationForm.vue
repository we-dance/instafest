<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from '~/components/ui/toast/use-toast'
import { addDoc, collection } from 'firebase/firestore'

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(3),
      website: z.string().url().optional(),
    })
  ),
})

const router = useRouter()
const { uid } = useFirebaseAuth()
const { $db } = useNuxtApp()
const orgStore = useOrganizationStore()

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    const data = {
      ...values,
      slug: values.name.toLowerCase().replace(/\s/g, '-'),
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      owners: [uid.value],
    }

    const docRef = await addDoc(collection($db, 'organizations'), data)
    orgStore.setOrg({
      ...data,
      id: docRef.id,
    })

    router.push(`/${data?.slug}/admin/`)
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
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
    <FormField v-slot="{ componentField }" name="website">
      <FormItem>
        <FormLabel>Website</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">Submit</Button>
  </form>
</template>
