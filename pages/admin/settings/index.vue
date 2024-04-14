<script setup>
import { Loader2 } from 'lucide-vue-next'
import { httpsCallable } from 'firebase/functions'

definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const { account } = useFirebaseAuth()

async function connectStripe() {
  loading.value = true

  try {
    const { $functions } = useNuxtApp()
    const createStripeLink = httpsCallable($functions, 'createStripeLink')
    const response = await createStripeLink()

    window.location.href = response.data.url
  } catch (error) {
    console.error('Error connecting to Stripe:', error)
  }
}
</script>

<template>
  <div>
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Integrations
    </h2>
    <p class="mt-1 text-sm leading-6 text-gray-500">
      Connect applications to your account.
    </p>

    <ul
      role="list"
      class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
    >
      <li class="flex justify-between gap-x-6 py-6">
        <div class="font-medium text-gray-900">Stripe</div>
        <div class="flex gap-2">
          <span v-if="account && account.stripeAccountId" class="text-green-600"
            >Connected</span
          >
          <Button v-else :disabled="loading" @click="connectStripe()">
            <template v-if="loading">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </template>
            <template v-else>Connect</template>
          </Button>
        </div>
      </li>
    </ul>
  </div>
</template>
