import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { type UserAccount } from '~/types/UserAccount'
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'

export default function () {
  const { $auth, $db } = useNuxtApp()

  const authLoaded = ref(false)
  const authError = ref<Error | null>(null)
  const user = useState<User | null>('user', () => null)
  const account = useState<UserAccount | null>('account', () => null)

  const logoutUser = async (): Promise<void> => {
    await signOut($auth)
    user.value = null
  }

  async function updateAccount(userAccount: UserAccount) {
    if (!user.value) {
      return
    }

    const data = { ...userAccount }

    await updateDoc(doc($db, 'accounts', user.value.uid), data)
  }

  function loadAccount() {
    if (!user.value) {
      return
    }

    onSnapshot(doc($db, 'accounts', user.value.uid), (snap) => {
      if (!snap.exists()) {
        return
      }

      account.value = snap.data() as UserAccount
    })
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

  const registerUser = async (userAccount: UserAccount): Promise<boolean> => {
    if (!userAccount.password) {
      return false
    }

    try {
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        authError.value = e
      }

      return false
    }

    return false
  }

  function onAuthLoaded(callback: () => void) {
    callback()
  }

  onMounted(() => {
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser
      authLoaded.value = true
      loadAccount()
    })
  })

  return {
    user,
    account,
    logoutUser,
    registerUser,
    loginUser,
    authLoaded,
    onAuthLoaded,
    authError,
    updateAccount,
  }
}
