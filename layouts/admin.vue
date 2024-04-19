<script setup>
import { cn } from '@/lib/utils'
import {
  CalendarIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  SwatchIcon,
  MapPinIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'

const { orgSlug } = useOrganizationStore()

const router = useRouter()

const { account } = useFirebaseAuth()

const navigation = computed(() => [
  {
    name: 'Dashboard',
    to: `/${orgSlug}/admin`,
    icon: HomeIcon,
  },
  {
    name: 'Products',
    to: `/${orgSlug}/admin/products`,
    icon: SwatchIcon,
  },
  {
    name: 'Instructors',
    to: `/${orgSlug}/admin/instructors`,
    icon: UsersIcon,
  },
  {
    name: 'Venues',
    to: `/${orgSlug}/admin/venues`,
    icon: MapPinIcon,
  },
  {
    name: 'Events',
    to: `/${orgSlug}/admin/events`,
    icon: CalendarIcon,
  },
  {
    name: 'Customers',
    to: `/${orgSlug}/admin/customers`,
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Settings',
    to: `/${orgSlug}/admin/settings`,
    icon: Cog6ToothIcon,
  },
  {
    name: `${account.value.firstName} ${account.value.lastName}`,
    to: `/${orgSlug}/admin/settings/profile`,
  },
  { name: 'Sign out', to: '/logout' },
])
</script>

<template>
  <div class="bg-background">
    <div class="md:grid md:grid-cols-5">
      <Sidebar>
        <InstafestLogo variant="full" class="h-12 mb-4" />
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
