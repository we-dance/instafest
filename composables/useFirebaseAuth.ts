import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { type UserAccount } from '~/types/userAccount'
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'

export default function () {
  const { $auth, $db } = useNuxtApp()

  const authLoaded = ref(false)
  const authError = ref<Error | null>(null)
  const uid = useLocalStorage<String | null>('uid', null)
  const user = useState<User | null>('user', () => null)
  const account = useState<UserAccount | null>('account', () => null)

  const logoutUser = async (): Promise<void> => {
    await signOut($auth)
    user.value = null
    uid.value = null
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

      account.value = {
        ...snap.data(),
        id: snap.id,
      }
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
        uid.value = userCreds.user.uid

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

    const userCreds = await createUserWithEmailAndPassword(
      $auth,
      userAccount.email,
      userAccount.password
    )

    if (userCreds) {
      user.value = userCreds.user
      uid.value = userCreds.user.uid
      const data = { ...userAccount }
      delete data.password
      await setDoc(doc($db, 'accounts', user.value.uid), data)

      return true
    }

    return false
  }

  onMounted(() => {
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser
      uid.value = firebaseUser?.uid
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
    authError,
    updateAccount,
    loadAccount,
    uid,
  }
}
