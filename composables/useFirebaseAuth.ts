import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

export default function () {
  const { $auth } = useNuxtApp()

  const authLoaded = ref(false)
  const user = useState<User | null>('user', () => null)

  const logoutUser = async (): Promise<void> => {
    await signOut($auth)
    user.value = null
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
      }
      return false
    }
    return false
  }

  const registerUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCreds = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      )
      if (userCreds) {
        user.value = userCreds.user
        return true
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return false
    }
    return false
  }

  onMounted(() => {
    onAuthStateChanged($auth, (firebaseUser) => {
      authLoaded.value = true
      user.value = firebaseUser
    })
  })

  return {
    user,
    logoutUser,
    registerUser,
    loginUser,
  }
}
