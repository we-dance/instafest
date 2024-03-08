<script setup>
const double = ref(false)
const student = ref(false)

const availableOptions = [
  {
    value: 'Probestunde',
    displayText: '15.00€ – Probestunde',
    extra: 'Probestunde gratis bei Kursanmeldung',
    description: '2 Probestunden für 2 Tanzstile in 1 Woche',
    student: false,
    double: false,
  },
  {
    value: 'Salsea Flex',
    displayText: '90.00€ einmalig – 1 Monat',
    student: false,
    double: false,
  },
  {
    value: 'ABOx3',
    displayText: '80.00€ monatlich – 3 Monate',
    extra: 'Inkl. 1 Party im Monat',
    student: false,
    double: false,
  },
  {
    value: 'ABOx6',
    displayText: '70.00€ monatlich – 6 Monate',
    extra: 'Inkl. 2 Partys im Monat',
    student: false,
    double: false,
  },
  {
    value: 'Probestunde',
    displayText: '15.00€ – Probestunde',
    extra: 'Probestunde gratis bei Kursanmeldung',
    student: false,
    double: true,
  },
  {
    value: 'Salsea Flex',
    displayText: '120.00€ einmalig – 1 Monat',
    student: false,
    double: true,
  },
  {
    value: 'ABOx3',
    displayText: '110.00€ monatlich – 3 Monate',
    extra: 'Inkl. 1 Party im Monat',
    student: false,
    double: true,
  },
  {
    value: 'ABOx6',
    displayText: '100.00€ monatlich – 6 Monate',
    extra: 'Inkl. 2 Partys im Monat',
    student: false,
    double: true,
  },
  ////////
  {
    value: 'Probestunde',
    displayText: '15.00€ – Probestunde',
    extra: 'Probestunde gratis bei Kursanmeldung',
    student: true,
    double: false,
  },
  {
    value: 'Salsea Flex',
    displayText: '75.00€ einmalig – 1 Monat',
    student: true,
    double: false,
  },
  {
    value: 'ABOx3',
    displayText: '65.00€ monatlich – 3 Monate',
    extra: 'Inkl. 1 Party im Monat',
    student: true,
    double: false,
  },
  {
    value: 'ABOx6',
    displayText: '55.00€ monatlich – 6 Monate',
    extra: 'Inkl. 2 Partys im Monat',
    student: true,
    double: false,
  },
  {
    value: 'Probestunde',
    displayText: '15.00€ – Probestunde',
    extra: 'Probestunde gratis bei Kursanmeldung',
    student: true,
    double: true,
  },
  {
    value: 'Salsea Flex',
    displayText: '95.00€ einmalig – 1 Monat',
    student: true,
    double: true,
  },
  {
    value: 'ABOx3',
    displayText: '85.00€ monatlich – 3 Monate',
    extra: 'Inkl. 1 Party im Monat',
    student: true,
    double: true,
  },
  {
    value: 'ABOx6',
    displayText: '75.00€ monatlich – 6 Monate',
    extra: 'Inkl. 2 Partys im Monat',
    student: true,
    double: true,
  },
]

const packageOptions = computed(() => {
  return availableOptions.filter((option) => {
    return option.student === student.value && option.double === double.value
  })
})
</script>

<template>
  <form>
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
              <Select v-bind="componentField" default-value="beginner">
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

        <FormField v-slot="{ componentField }" name="level">
          <FormItem>
            <FormLabel>Datum deines nächsten Kurses auswählen</FormLabel>
            <FormControl>
              <Select v-bind="componentField" default-value="11.03">
                <SelectTrigger>
                  <SelectValue placeholder="Wähle dein Tanzlevel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="11.03">
                      Montag, 11 März, 19:00-20:00</SelectItem
                    >
                    <SelectItem value="08.04">
                      Montag, 8 April, 19:00-20:00
                    </SelectItem>
                    <SelectItem value="06.05">
                      Montag, 6 Mai, 19:00-20:00
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="student">
          <FormItem>
            <FormLabel />
            <FormControl>
              <div class="flex items-center space-x-2">
                <Switch
                  :checked="student"
                  v-bind="componentField"
                  @update:checked="student = !student"
                />
                <Label for="airplane-mode">Ich bin Student/in</Label>
              </div>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="double">
          <FormItem>
            <FormLabel />
            <FormControl>
              <div class="flex items-center space-x-2">
                <Switch
                  :checked="double"
                  v-bind="componentField"
                  @update:checked="double = !double"
                />
                <Label for="airplane-mode">2 mal pro Woche</Label>
              </div>
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
                      v-for="option in packageOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.displayText }}
                      <div v-if="option.extra" class="text-xs text-gray-500">
                        {{ option.extra }}
                      </div>
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
        <Button as-child>
          <router-link to="/studio/app/settings">Weiter</router-link>
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
