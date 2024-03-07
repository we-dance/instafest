<script setup lang="ts">
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
  <header class="m-4 h-16 flex">
    <StudioLogo />
  </header>
  <div class="p-4 max-w-[400px] mx-auto">
    <Tabs default-value="account">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="account"> Registrieren </TabsTrigger>
        <TabsTrigger value="password"> Anmelden </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Neu hier?</CardTitle>
            <CardDescription>
              Genieße die Vorteile einer personalisierten Kursanmeldung.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <form class="gap-4 flex flex-col">
              <FormField name="level">
                <FormItem>
                  <FormLabel>Dein Tanzlevel</FormLabel>
                  <FormControl>
                    <Select default-value="beginner">
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle dein Tanzlevel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="beginner"> Anfänger </SelectItem>
                          <SelectItem value="intermediate">
                            Mittelstufe
                          </SelectItem>
                          <SelectItem value="advanced">
                            Fortgeschritten
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription
                    >Du hast keine oder nur wenig
                    Tanzerfahrung.</FormDescription
                  >
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="level">
                <FormItem>
                  <FormLabel>Datum deines nächsten Kurses auswählen</FormLabel>
                  <FormControl>
                    <Select default-value="11.03">
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

              <FormField name="discount">
                <FormItem>
                  <FormLabel>Rabattcode</FormLabel>
                  <FormControl>
                    <div class="flex gap-2">
                      <Input />
                      <Button variant="secondary">Anwenden</Button>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="student">
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <div class="flex items-center space-x-2">
                      <Switch
                        :checked="student"
                        @update:checked="student = !student"
                        id="airplane-mode"
                      />
                      <Label for="airplane-mode">Ich bin Student/in</Label>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="double">
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <div class="flex items-center space-x-2">
                      <Switch
                        :checked="double"
                        @update:checked="double = !double"
                        id="airplane-mode"
                      />
                      <Label for="airplane-mode">2 mal pro Woche</Label>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="package">
                <FormItem>
                  <FormLabel>Wähle dein Paket</FormLabel>
                  <FormControl>
                    <Select default-value="Probestunde">
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
                            <div
                              v-if="option.extra"
                              class="text-xs text-gray-500"
                            >
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

              <FormField name="gender">
                <FormItem>
                  <FormLabel>Anrede</FormLabel>
                  <FormControl>
                    <Select default-value="">
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

              <FormField name="name">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="phone">
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="password">
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>
            </form>
          </CardContent>
          <CardFooter>
            <Button as-child>
              <router-link to="/account">Weiter</router-link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen zurück!</CardTitle>
            <CardDescription>
              Greife auf deine Kursinformationen und deinen Fortschritt zu.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="email">Email</Label>
              <Input id="email" type="email" />
            </div>
            <div class="space-y-1">
              <Label for="new">Passwort</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter class="flex justify-end">
            <Button>Anmelden</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
