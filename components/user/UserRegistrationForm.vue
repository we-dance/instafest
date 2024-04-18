<script setup>
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  getDocs,
} from 'firebase/firestore'
import { useForm, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customerAccountSchemaInput } from '~/types/customerAccount'
import { toast } from '~/components/ui/toast/use-toast'

const { org, orgId } = useOrganizationStore()
const { $db } = useNuxtApp()
const events = ref([])
const products = ref([])

function getLabel(event) {
  if (!event.startDate || !event.endDate) return ''

  return `${event.startDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })}, ${event.startDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}-${event.endDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

const eventsOptions = computed(() =>
  events.value.map((event) => ({
    value: event.id,
    label: getLabel(event),
  }))
)

const productOptions = computed(() =>
  products.value.map((product) => ({
    value: product.id,
    displayText: `${product.price}€ – ${product.name}`,
    description: product.description,
  }))
)

onMounted(async () => {
  const eventRefs = await getDocs(
    query(collection($db, 'organizations', orgId, 'events'))
  )
  events.value = eventRefs.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((event) => {
      event.startDate = event.startDate ? event.startDate.toDate() : ''
      event.endDate = event.endDate ? event.endDate.toDate() : ''

      return event
    })

  const productsRefs = await getDocs(
    query(collection($db, 'organizations', orgId, 'products'))
  )
  products.value = productsRefs.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })
})

configure({
  validateOnBlur: false,
})

const form = useForm({
  validationSchema: toTypedSchema(customerAccountSchemaInput),
  initialValues: {
    level: 'beginner',
    course: eventsOptions.value[0]?.value || '',
    package: productOptions.value[0]?.value || '',
  },
})

const { register } = useCustomer()
const router = useRouter()

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await register(values)
    router.push(`/${org.slug}/app`)
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
        <CardTitle>Neu hier?</CardTitle>
        <CardDescription>
          Genieße die Vorteile einer personalisierten Kursanmeldung.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <FormField v-slot="{ componentField }" name="level">
          <FormItem>
            <FormLabel>Dein Tanzlevel</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Wähle dein Tanzlevel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="beginner"> Anfänger </SelectItem>
                    <SelectItem value="intermediate"> Mittelstufe </SelectItem>
                    <SelectItem value="advanced"> Fortgeschritten </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription
              >Du hast keine oder nur wenig Tanzerfahrung.</FormDescription
            >
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="course">
          <FormItem>
            <FormLabel>Datum deines nächsten Kurses auswählen</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Wähle dein Kurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="event in eventsOptions"
                      :key="event.value"
                      :value="event.value"
                    >
                      {{ event.label }}</SelectItem
                    >
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="package">
          <FormItem>
            <FormLabel>Wähle dein Paket</FormLabel>
            <FormControl>
              <Select v-bind="componentField" default-value="Probestunde">
                <SelectTrigger>
                  <SelectValue placeholder="Paket auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in productOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.displayText }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription
              >2 Probestunden für 2 Tanzstile in 1 Woche</FormDescription
            >
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="gender">
          <FormItem>
            <FormLabel>Anrede</FormLabel>
            <FormControl>
              <Select v-bind="componentField" default-value="">
                <SelectTrigger>
                  <SelectValue placeholder="Anrede auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="female"> Frau </SelectItem>
                    <SelectItem value="male"> Herr </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

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
        <Button type="submit"> Weiter </Button>
      </CardFooter>
    </Card>
  </form>
</template>
