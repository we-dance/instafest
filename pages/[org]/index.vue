<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  colorMode: 'dark',
})
</script>

<template>
  <header class="m-4 h-16 flex">
    <StudioLogo />
  </header>
  <div class="p-4 max-w-[400px] mx-auto">
    <Tabs default-value="register">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="register"> Registrieren </TabsTrigger>
        <TabsTrigger value="login"> Anmelden </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <UserRegistrationForm />
      </TabsContent>
      <TabsContent value="login">
        <UserLoginForm />
      </TabsContent>
    </Tabs>
  </div>
</template>
