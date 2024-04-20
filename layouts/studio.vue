<script setup>
import {
  CalendarIcon,
  DocumentDuplicateIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const { link } = useOrganizationStore()
const router = useRouter()
const { account } = useCustomer()

const navigation = computed(() => [
  {
    name: 'Termine',
    to: link('/app/'),
    icon: CalendarIcon,
  },
  {
    name: 'Abonnements',
    to: link('/app/subscriptions'),
    icon: DocumentDuplicateIcon,
  },
  {
    name: account.value.name,
    to: link('/app/settings'),
    icon: UserIcon,
  },
  {
    name: 'Abmelden',
    to: '/logout',
  },
])
</script>

<template>
  <div class="bg-background">
    <div class="md:grid md:grid-cols-5">
      <Sidebar>
        <StudioLogo variant="full" class="h-14 mb-4" />
        <SidebarNav :items="navigation" />
      </Sidebar>
      <div class="col-span-3 md:col-span-4 md:border-l">
        <div class="h-full px-4 py-6 md:px-8">
          <Toaster />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
