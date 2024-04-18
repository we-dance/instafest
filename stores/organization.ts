import { defineStore } from 'pinia'
import type { Organization } from '~/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  const org = ref<Organization | null>(null)

  const orgId = computed(() => org.value?.id)
  const orgSlug = computed(() => org.value?.slug)

  const { uid } = useFirebaseAuth()

  function link(to: string) {
    return `/${orgSlug.value}${to}`
  }

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
    link,
    org,
    orgId,
    setOrg,
    orgSlug,
    isOwner,
  }
})
