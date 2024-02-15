import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import type firebase from 'firebase/compat/app'

declare module '#app' {
  interface NuxtApp {
    $auth: Auth
    $firestore: Firestore
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
  const firestore = getFirestore(app)

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('firestore', firestore)
  nuxtApp.provide('firestore', firestore)
})
