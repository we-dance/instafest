import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import {
  customerAccountSchema,
  type CustomerAccount,
  type CustomerAccountInput,
} from '~/types/customerAccount'
import type { Organization } from '~/types/organization'

export default function () {
  const { $db } = useNuxtApp()
  const { org } = useOrganizationStore()

  if (!org) {
    throw new Error('Organization not found')
  }

  const authStateInitialized = useState<Boolean>(
    'authStateInitialized',
    () => false
  )
  const user = useState<User | null>('user', () => null)
  const account = useState<CustomerAccount | null>('account', () => null)
  const uid = computed(() => user.value?.uid)

  async function loadAccount() {
    console.log('loading customer account')
    await until(authStateInitialized).toBe(true)

    if (!uid.value) {
      return
    }

    const accountRef = doc($db, 'organizations', org.id, 'customers', uid.value)
    const accountSnap = await getDoc(accountRef)

    account.value = customerAccountSchema.parse({
      ...accountSnap.data(),
      id: accountSnap.id,
    })

    return account.value
  }

  async function register(
    input: CustomerAccountInput,
    org: Organization
  ): Promise<boolean> {
    const auth = getAuth()
    auth.tenantId = org.tenantId

    const userCreds = await createUserWithEmailAndPassword(
      auth,
      input.email,
      input.password
    )

    if (userCreds) {
      user.value = userCreds.user
      const data: any = { ...input }
      delete data.password
      const accountRef = doc(
        $db,
        'organizations',
        org.id,
        'customers',
        user.value.uid
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
    loadAccount,
    register,
    user,
    setUser,
    account,
    uid,
    login,
  }
}
