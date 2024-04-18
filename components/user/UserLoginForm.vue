<script setup lang="ts">
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from '~/components/ui/toast/use-toast'

configure({
  validateOnBlur: false,
})

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  ),
})

const { org } = useOrganizationStore()
const { login } = useCustomer()
const router = useRouter()

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    await login(values.email, values.password)
    router.replace(`/${org.slug}/app/settings`)
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
    <Card>
      <CardHeader>
        <CardTitle>Willkommen zurück!</CardTitle>
        <CardDescription>
          Greife auf deine Kursinformationen und deinen Fortschritt zu.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2">
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
            <FormLabel>Passwort</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="password" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex justify-end">
        <Button type="submit">Anmelden</Button>
      </CardFooter>
    </Card>
  </form>
</template>
