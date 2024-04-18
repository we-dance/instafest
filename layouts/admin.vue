<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  CalendarIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  SwatchIcon,
  XMarkIcon,
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
    current: router.currentRoute.value.path === `/${orgSlug}/admin`,
  },
  {
    name: 'Products',
    to: `/${orgSlug}/admin/products`,
    icon: SwatchIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/products`,
  },
  {
    name: 'Instructors',
    to: `/${orgSlug}/admin/instructors`,
    icon: UsersIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/instructors`,
  },
  {
    name: 'Venues',
    to: `/${orgSlug}/admin/venues`,
    icon: MapPinIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/venues`,
  },
  {
    name: 'Events',
    to: `/${orgSlug}/admin/events`,
    icon: CalendarIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/events`,
  },
  {
    name: 'Customers',
    to: `/${orgSlug}/admin/customers`,
    icon: DocumentDuplicateIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/customers`,
  },
  {
    name: 'Settings',
    to: `/${orgSlug}/admin/settings`,
    icon: Cog6ToothIcon,
    current: router.currentRoute.value.path === `/${orgSlug}/admin/settings`,
  },
  {
    name: 'Your profile',
    to: `/${orgSlug}/admin/settings/profile`,
    current:
      router.currentRoute.value.path === `/${orgSlug}/admin/settings/profile`,
  },
  { name: 'Sign out', to: '/admin/logout' },
])

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-full">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="relative z-50 lg:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <InstafestLogo variant="full-on-dark" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link
                            :to="item.to"
                            :class="[
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <InstafestLogo variant="full-on-dark" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li
                  v-if="account"
                  class="text-white flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  Hi, {{ account.firstName }} {{ account.lastName }}
                </li>
                <li v-for="item in navigation" :key="item.name">
                  <router-link
                    :to="item.to"
                    :class="[
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72 min-h-full">
      <div class="sticky top-0 z-40 h-16 p-4 md:hidden border-b">
        <button
          type="button"
          class="text-gray-700 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <main class="py-10 bg-background">
        <div class="px-4 sm:px-6 lg:px-8">
          <Toaster />
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
