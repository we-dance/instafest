<script setup>
definePageMeta({
  layout: 'admin',
})

import { useForm } from 'vee-validate'
import { until } from '@vueuse/core'
import { toTypedSchema } from '@vee-validate/zod'
import { adminAccountShema } from '~/types/adminAccount'

const { account: currentAccount, updateAccount } = useFirebaseAuth()

const form = useForm({
  validationSchema: toTypedSchema(adminAccountShema),
  initialValues: currentAccount.value,
})

const onSubmit = form.handleSubmit(async (values) => {
  await updateAccount(values)
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Personal Information</h2>
        <p class="text-muted-foreground">
          Use a permanent address where you can receive mail.
        </p>
      </div>
    </div>

    <form @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="country">
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="DE">Germany</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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

      <Button type="submit">Save</Button>
    </form>
  </div>
</template>
