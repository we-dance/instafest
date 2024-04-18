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
  const { setUser: setUserAdmin, loadAccount: loadAccountAdmin } =
    useFirebaseAuth()

  if (to.fullPath === '/logout') {
    return
  }

  if (to.meta.layout === 'admin') {
    onAuthStateChanged($auth, setUserAdmin)

    await loadAccountAdmin()
  }

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

  const { setUser: setUserCustomer, loadAccount: loadAccountCustomer } =
    useCustomer()

  if (to.meta.layout === 'admin' && !isOwner()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  if (to.meta.layout === 'studio') {
    onAuthStateChanged($auth, setUserCustomer)

    await loadAccountCustomer()
  }
})
