import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

declare module '#app' {
  interface NuxtApp {
    $auth: Auth
    $db: Firestore
    $functions: ReturnType<typeof getFunctions>
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  let firebaseConfig
  try {
    firebaseConfig = JSON.parse(config.public.firebaseConfig)
  } catch (e) {}

  if (!firebaseConfig) {
    throw new Error('FIREBASE_CONFIG is not set in .env')
  }

  const app = initializeApp(firebaseConfig)

  const analytics = getAnalytics(app)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const functions = getFunctions(app, 'europe-west3')

  if (window.location.hostname === 'localhost' && config.public.emulators) {
    console.log('Running in local mode')
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  }

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('db', db)
  nuxtApp.provide('db', db)

  nuxtApp.vueApp.provide('functions', functions)
  nuxtApp.provide('functions', functions)
})
