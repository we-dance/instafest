import { collection, getDocs, query, where } from 'firebase/firestore'
import { useOrganizationStore } from '~/stores/organization'
import type { Organization } from '~/types/organization'
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const slug = to.params.org
  if (!slug) return

  const { $auth, $db } = useNuxtApp()
  if (!$db) return

  const { setOrg, isOwner } = useOrganizationStore()
  const { setUser, loadAccount } = useFirebaseAuth()

  onAuthStateChanged($auth, setUser)
  await loadAccount()

  const orgRef = collection($db, 'organizations')
  const querySnapshot = await getDocs(query(orgRef, where('slug', '==', slug)))
  const org = querySnapshot.docs
    .map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Organization)
    )
    .find((o) => o.slug === slug)

  if (!org) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Organization Not Found',
    })
  }

  setOrg(org)

  if (!isOwner()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
})
