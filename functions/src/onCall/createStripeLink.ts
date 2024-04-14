import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getStripe } from '../lib/stripe'

export const createStripeLink = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Request had invalid credentials.')
  }

  const userId = request.auth.uid

  const db = admin.firestore()

  const accountRef = db.collection('accounts').doc(userId)
  const accountSnap = await accountRef.get()

  if (!accountSnap.exists) {
    throw new HttpsError('not-found', 'User does not exist.')
  }

  const account = accountSnap.data()

  if (!account) {
    throw new HttpsError('not-found', 'User does not exist.')
  }

  const { stripe } = getStripe(account)

  let stripeAccountId = account.stripeAccountId
  if (!stripeAccountId) {
    const stripeAccount = await stripe.accounts.create({
      country: account.country,
      email: account.email,
      type: 'standard',
    })

    stripeAccountId = stripeAccount.id

    db.collection('accounts').doc(userId).update({
      stripeAccountId,
    })
  }

  const isLocal = process.env.FUNCTIONS_EMULATOR === 'true'
  const baseUrl = isLocal ? process.env.BASE_URL_DEV : process.env.BASE_URL

  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/admin/settings?refresh=true`,
      return_url: `${baseUrl}/admin/settings?success=true`,
      type: 'account_onboarding',
    })

    return { url: accountLink.url }
  } catch (error) {
    logger.error('Error creating Stripe account link:', error)
    throw new HttpsError('internal', 'Unable to create Stripe account link.')
  }
})
