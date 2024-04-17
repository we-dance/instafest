import { collection, getDocs, query, where } from 'firebase/firestore'
import { useOrganizationStore } from '~/stores/organization'
import type { Organization } from '~/types/organization'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const slug = to.params.org
  if (!slug) return

  const { $db } = useNuxtApp()
  if (!$db) return

  const orgStore = useOrganizationStore()

  const orgRef = collection($db, 'organizations')
  const querySnapshot = await getDocs(query(orgRef, where('slug', '==', slug)))
  const orgData = querySnapshot.docs
    .map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Organization)
    )
    .find((o) => o.slug === slug)

  if (orgData) {
    orgStore.setOrg(orgData)
  } else {
    throw createError({
      statusCode: 404,
      statusMessage: 'Organization Not Found',
    })
  }
})
