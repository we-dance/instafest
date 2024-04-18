import { collection, getDocs, query, where } from 'firebase/firestore'
import { useOrganizationStore } from '~/stores/organization'
import type { Organization } from '~/types/organization'
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = to.params.org

  const { $auth, $db } = useNuxtApp()

  if (!$db) return

  const { setUser: setUserAdmin, loadAccount: loadAccountAdmin } =
    useFirebaseAuth()

  if (!slug) {
    if (to.fullPath === '/admin/') {
      onAuthStateChanged($auth, setUserAdmin)
      await loadAccountAdmin()
    }

    return
  }

  const { setOrg, isOwner } = useOrganizationStore()

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

  const {
    setUser: setUserCustomer,
    loadAccount: loadAccountCustomer,
    uid: uidCustomer,
  } = useCustomer()

  if (to.meta.layout === 'admin' && !isOwner()) {
    return navigateTo('/admin/signin')
  }

  if (to.meta.layout === 'studio') {
    onAuthStateChanged($auth, setUserCustomer)

    await loadAccountCustomer()

    if (!uidCustomer.value) {
      return navigateTo(`/${slug}`)
    }
  }
})
