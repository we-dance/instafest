<script setup>
definePageMeta({
  layout: 'studio',
  colorMode: 'dark',
})
</script>

<template>
  <div>
    <NuxtLayout name="dashboard">
      <template #header>Mein Konto</template>
      <div class="container max-w-[600px] mx-auto">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Daten</CardTitle>
              <CardDescription />
            </CardHeader>
            <CardContent class="space-y-2">
              <form class="gap-4 flex flex-col">
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
            <CardFooter class="flex justify-end">
              <Button as-child>
                <router-link to="/account">Speichern</router-link>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>
