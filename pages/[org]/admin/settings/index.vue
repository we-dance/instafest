<script setup>
import { Loader2 } from 'lucide-vue-next'
import { httpsCallable } from 'firebase/functions'
import { toast } from '~/components/ui/toast/use-toast'

definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const { account } = useFirebaseAuth()
const { org, orgId } = useOrganizationStore()

async function connectStripe() {
  loading.value = true

  try {
    const { $functions } = useNuxtApp()
    const createStripeLink = httpsCallable($functions, 'createStripeLink')
    const response = await createStripeLink({ orgId })

    window.location.href = response.data.url
  } catch (error) {
    toast({
      title: 'Error connecting Stripe',
      description: error.message,
      variant: 'destructive',
    })

    loading.value = false
  }
}
</script>

<template>
  <AdminPage
    header="Integrations"
    subheader="Connect applications to your account"
  >
    <ul
      role="list"
      class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
    >
      <li class="flex justify-between gap-x-6 py-6">
        <div class="font-medium text-gray-900">Stripe</div>
        <div class="flex gap-2">
          <span v-if="org.stripeAccountId" class="text-green-600"
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
  </AdminPage>
</template>
