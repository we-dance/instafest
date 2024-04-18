<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '~/components/ui/toast/use-toast'
import { adminAccountShemaInput } from '~/types/adminAccount'

const form = useForm({
  validationSchema: toTypedSchema(adminAccountShemaInput),
  initialValues: {
    country: 'DE',
  },
})

const { registerUser } = useFirebaseAuth()
const router = useRouter()

const onSubmit = form.handleSubmit(async (values: any, actions: any) => {
  try {
    await registerUser(values)
    router.replace('/admin/')
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      actions.setFieldError('email', 'This email is already taken')
    } else {
      toast({
        title: 'Error',
        description: error.message,
      })
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
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

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="password" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex justify-end">
        <Button type="submit"> Register </Button>
      </CardFooter>
    </Card>
  </form>
</template>
