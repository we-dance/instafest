<script setup>
const userNavigation = [{ name: 'Abmelden', to: '/logout' }]

const { account } = useCustomer()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative">
        {{ account.name }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuItem v-for="item in userNavigation" :key="item.name">
        {{ item.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
