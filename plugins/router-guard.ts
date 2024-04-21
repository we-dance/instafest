export default defineNuxtPlugin(() => {
  const router = useRouter()

  if (!process.client) {
    return
  }

  router.beforeEach((to, from, next) => {
    const hostname: string = window.location.hostname

    switch (hostname) {
      case 'montuno.club':
        if (!to.path.startsWith('/montunoclub')) {
          next('/montunoclub' + to.path)
        } else {
          next()
        }
        break
      case 'app.salsea.de':
        if (!to.path.startsWith('/salsea')) {
          next('/salsea' + to.path)
        } else {
          next()
        }
        break
      default:
        next()
    }
  })
})
