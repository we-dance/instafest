import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { adminAccountShema, type AdminAccount } from '~/types/adminAccount'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { until } from '@vueuse/core'

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
    await until(authStateInitialized).toBe(true)

    if (!uid.value) {
      return
    }

    const accountRef = await getDoc(doc($db, 'accounts', uid.value))

    account.value = adminAccountShema.parse({
      ...accountRef.data(),
      id: accountRef.id,
    })

    return account.value
  }

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCreds = await signInWithEmailAndPassword($auth, email, password)

      if (userCreds) {
        user.value = userCreds.user

        return true
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        authError.value = e
      }

      return false
    }
    return false
  }

  const registerUser = async (userAccount: AdminAccount): Promise<boolean> => {
    if (!userAccount.password) {
      return false
    }

    const userCreds = await createUserWithEmailAndPassword(
      $auth,
      userAccount.email,
      userAccount.password
    )

    if (userCreds) {
      user.value = userCreds.user
      const data = { ...userAccount }
      delete data.password
      await setDoc(doc($db, 'accounts', user.value.uid), data)

      return true
    }

    return false
  }

  function setUser(newUser: User | null) {
    user.value = newUser
    authStateInitialized.value = true
  }

  return {
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
