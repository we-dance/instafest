import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
  type User,
} from 'firebase/auth'
import {
  adminAccountShema,
  type AdminAccount,
  type AdminAccountInput,
} from '~/types/adminAccount'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { until } from '@vueuse/core'
import type { CustomerAccountInput } from '~/types/customerAccount'
import type { Organization } from '~/types/organization'

export default function () {
  const { $auth, $db } = useNuxtApp()

  const authStateInitialized = useState<Boolean>(
    'authStateInitialized',
    () => false
  )
  const user = useState<User | null>('user', () => null)
  const account = useState<AdminAccount | null>('account', () => null)
  const authError = ref<Error | null>(null)
  const uid = computed(() => user.value?.uid)

  const logoutUser = async (): Promise<void> => {
    await signOut($auth)
    user.value = null
  }

  async function updateAccount(userAccount: AdminAccount) {
    if (!user.value) {
      return
    }

    const data = { ...userAccount }

    await updateDoc(doc($db, 'accounts', uid.value), data)
    await loadAccount()
  }

  async function loadAccount() {
    console.log('loading admin account')
    await until(authStateInitialized).toBe(true)

    if (!uid.value) {
      return
    }

    const accountRef = doc($db, 'accounts', uid.value)
    const accountSnap = await getDoc(accountRef)

    account.value = adminAccountShema.parse({
      ...accountSnap.data(),
      id: accountSnap.id,
    })

    return account.value
  }

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const userCreds = await signInWithEmailAndPassword($auth, email, password)

    if (userCreds) {
      user.value = userCreds.user

      return true
    }

    return false
  }

  async function registerUser(input: AdminAccountInput): Promise<boolean> {
    const userCreds = await createUserWithEmailAndPassword(
      $auth,
      input.email,
      input.password
    )

    if (userCreds) {
      user.value = userCreds.user
      const data: any = { ...input }
      delete data.password
      await setDoc(doc($db, 'accounts', user.value.uid), data)

      return true
    }

    return false
  }

  async function registerCustomer(
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
      await setDoc(
        doc($db, 'organizations', org.id, 'customers', user.value.uid),
        data
      )

      return true
    }

    return false
  }

  function setUser(newUser: User | null) {
    user.value = newUser
    authStateInitialized.value = true
  }

  return {
    registerCustomer,
    user,
    setUser,
    account,
    logoutUser,
    registerUser,
    loginUser,
    authError,
    updateAccount,
    loadAccount,
    uid,
  }
}
