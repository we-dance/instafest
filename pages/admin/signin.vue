<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  colorMode: 'light',
})
</script>

<template>
  <header class="m-4 h-16 flex">
    <InstafestLogo variant="full" />
  </header>
  <div class="p-4 max-w-[400px] mx-auto">
    <Tabs default-value="register">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="register"> Register </TabsTrigger>
        <TabsTrigger value="login"> Login </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <AdminRegistrationForm />
      </TabsContent>
      <TabsContent value="login">
        <AdminLoginForm />
      </TabsContent>
    </Tabs>
  </div>
</template>
