<script setup>
definePageMeta({
  layout: 'studio',
  colorMode: 'dark',
})

import { collection, deleteDoc, doc, query, getDocs } from 'firebase/firestore'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customerAccountSchema } from '~/types/customerAccount'
import { toast } from '~/components/ui/toast/use-toast'

const { account, updateAccount } = useCustomer()

const form = useForm({
  validationSchema: toTypedSchema(customerAccountSchema),
  initialValues: account.value,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await updateAccount(values)
  } catch (error) {
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
    <Card>
      <CardHeader>
        <CardTitle>Persönliche Daten</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent class="space-y-2">
        <form class="gap-4 flex flex-col" @submit.prevent="onSubmit">
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

          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
      </CardContent>
      <CardFooter class="flex justify-end">
        <Button type="submit"> Speichern </Button>
      </CardFooter>
    </Card>
  </form>
</template>
