<script setup>
import {
  CalendarIcon,
  DocumentDuplicateIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Termine', href: '#', icon: CalendarIcon, current: true },
  {
    name: 'Abonnements',
    href: '#',
    icon: DocumentDuplicateIcon,
    current: false,
  },
  {
    name: 'Mein Konto',
    href: '/studio/app/settings',
    icon: UserIcon,
    current: false,
  },
]
</script>

<template>
  <div
    class="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-4"
  >
    <div class="flex h-16 shrink-0 items-center">
      <StudioLogo class="h-16 w-auto" />
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <a
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-primary-foreground text-foreground'
                    : 'text-primary hover:text-foreground hover:bg-accent',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                ]"
              >
                <component
                  :is="item.icon"
                  class="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                {{ item.name }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
