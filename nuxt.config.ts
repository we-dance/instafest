// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'h-full bg-white',
      },
      bodyAttrs: {
        class: 'h-full',
      },
    },
  },
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: '123',

    // Public keys that are exposed to the client
    public: {
      firebaseConfig: process.env.FIREBASE_CONFIG,
      emulators: process.env.FIREBASE_EMULATORS === 'true',
      stripeMode: process.env.STRIPE_MODE,
    },
  },
  modules: ['@vite-pwa/nuxt', '@vueuse/nuxt'],
})
