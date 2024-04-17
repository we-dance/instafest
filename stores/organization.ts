import { defineStore } from 'pinia'
import type { Organization } from '~/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  const org = ref<Organization | null>(null)

  const orgId = computed(() => org.value?.id)
  const orgSlug = computed(() => org.value?.slug)

  function setOrg(data: Organization) {
    org.value = data
  }

  return {
    org,
    orgId,
    setOrg,
    orgSlug,
  }
})
