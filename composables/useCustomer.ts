import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  customerAccountSchema,
  type CustomerAccount,
  type CustomerAccountInput,
} from '~/types/customerAccount'

export default function () {
  const { $db } = useNuxtApp()
  const { org } = useOrganizationStore()

  const authStateInitialized = useState<Boolean>(
    'authStateInitialized',
    () => false
  )
  const user = useState<User | null>('user', () => null)
  const account = useState<CustomerAccount | null>('account', () => null)
  const enrollments = useState<any[]>('enrolments', () => [])
  const uid = computed(() => user.value?.uid)

  async function logoutUser(): Promise<void> {
    const auth = getAuth()
    if (!org) return

    auth.tenantId = org.tenantId

    await signOut(auth)
    user.value = null
  }

  function initEnrollments() {
    if (!uid.value) return
    if (!org) return

    const q = query(
      collection($db, 'organizations', org.id, 'participants'),
      where('customerId', '==', uid.value)
    )

    onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      enrollments.value = []

      querySnapshot.forEach((doc) => {
        enrollments.value.push({
          ...doc.data(),
          id: doc.id,
        })
      })
    })
  }

  async function loadAccount() {
    await until(authStateInitialized).toBe(true)

    if (!uid.value) return
    if (!org) return

    const accountRef = doc($db, 'organizations', org.id, 'customers', uid.value)
    const accountSnap = await getDoc(accountRef)

    try {
      account.value = customerAccountSchema.parse({
        ...accountSnap.data(),
        id: accountSnap.id,
      })
    } catch (error) {
      logoutUser()
    }

    initEnrollments()

    return account.value
  }

  async function updateAccount(input: CustomerAccount) {
    if (!uid.value) return false
    if (!org) return false

    const data = { ...input }

    const accountRef = doc($db, 'organizations', org.id, 'customers', uid.value)

    await updateDoc(accountRef, data)
    await loadAccount()
  }

  async function register(input: CustomerAccountInput): Promise<boolean> {
    if (!org) return false

    const auth = getAuth()
    auth.tenantId = org.tenantId

    const userCreds = await createUserWithEmailAndPassword(
      auth,
      input.email,
      input.password
    )

    if (userCreds) {
      user.value = userCreds.user
      if (!uid.value) return false

      const data: any = { ...input }
      delete data.password
      const accountRef = doc(
        $db,
        'organizations',
        org.id,
        'customers',
        uid.value
      )
      await setDoc(accountRef, data)

      return true
    }

    return false
  }

  function setUser(newUser: User | null) {
    user.value = newUser
    authStateInitialized.value = true
  }

  async function login(email: string, password: string): Promise<boolean> {
    if (!org) return false

    const auth = getAuth()
    auth.tenantId = org.tenantId
    const userCreds = await signInWithEmailAndPassword(auth, email, password)

    if (userCreds) {
      user.value = userCreds.user

      return true
    }

    return false
  }

  return {
    enrollments,
    loadAccount,
    updateAccount,
    register,
    user,
    setUser,
    account,
    uid,
    login,
  }
}
