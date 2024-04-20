export function getBaseUrl() {
  const isLocal = process.env.FUNCTIONS_EMULATOR === 'true'
  const baseUrl = isLocal ? process.env.BASE_URL_DEV : process.env.BASE_URL

  return baseUrl
}

export function getAppUrl(org: any, suffix = '') {
  return getBaseUrl() + '/' + org.slug + '/app' + suffix
}

export function getAdminUrl(org: any, suffix = '') {
  return getBaseUrl() + '/' + org.slug + '/admin' + suffix
}
