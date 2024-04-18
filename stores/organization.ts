import { defineStore } from 'pinia'
import type { Organization } from '~/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  const org = ref<Organization | null>(null)

  const orgId = computed(() => org.value?.id)
  const orgSlug = computed(() => org.value?.slug)

  const { uid } = useFirebaseAuth()

  function isOwner() {
    if (!uid.value) {
      return false
    }

    return org.value?.owners.includes(uid.value)
  }

  function setOrg(data: Organization) {
    org.value = data
  }

  return {
    org,
    orgId,
    setOrg,
    orgSlug,
    isOwner,
  }
})
