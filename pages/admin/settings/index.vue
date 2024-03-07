<script setup>
import { httpsCallable } from 'firebase/functions'

definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const { account } = useFirebaseAuth()

async function connectStripe() {
  const config = useRuntimeConfig()
  const test = config.public.stripeMode === 'test'

  loading.value = true

  try {
    const { $functions } = useNuxtApp()
    const createStripeLink = httpsCallable($functions, 'createStripeLink')
    const response = await createStripeLink()

    window.location.href = response.data.url
  } catch (error) {
    console.error('Error connecting to Stripe:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button
      :disabled="loading"
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="connectStripe()"
    >
      Connect Stripe
    </button>
    <pre>{{ account }}</pre>
  </div>
</template>
