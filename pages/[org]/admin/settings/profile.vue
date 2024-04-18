<script setup>
definePageMeta({
  layout: 'admin',
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

    <AdminAccountForm />
  </div>
</template>
