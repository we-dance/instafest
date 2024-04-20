import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getStripe } from '../lib/stripe'
import { getAdminUrl } from '../lib/organization'

export const createStripeLink = onCall(async (request) => {
  const userId = request.auth?.uid

  if (!userId) {
    throw new HttpsError('unauthenticated', 'Request had invalid credentials.')
  }

  const orgId = request.data?.orgId
  if (!orgId) {
    throw new HttpsError('invalid-argument', 'Organization ID is required.')
  }

  const db = admin.firestore()

  const accountRef = db.collection('accounts').doc(userId)
  const accountSnap = await accountRef.get()

  if (!accountSnap.exists) {
    throw new HttpsError('not-found', 'Account does not exist.')
  }

  const account = accountSnap.data()

  if (!account) {
    throw new HttpsError('not-found', 'Account does not exist.')
  }

  const orgRef = db.collection('organizations').doc(orgId)
  const orgSnap = await orgRef.get()

  if (!orgSnap.exists) {
    throw new HttpsError('not-found', 'Organization does not exist.')
  }

  const org = orgSnap.data()

  if (!org) {
    throw new HttpsError('not-found', 'Organization does not exist.')
  }

  const { stripe } = getStripe(org)

  let stripeAccountId = org.stripeAccountId
  if (!stripeAccountId) {
    const stripeAccount = await stripe.accounts.create({
      country: account.country,
      email: account.email,
      type: 'standard',
    })

    stripeAccountId = stripeAccount.id

    db.collection('organizations').doc(orgId).update({
      stripeAccountId,
    })
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: getAdminUrl('/settings?refresh=true'),
      return_url: getAdminUrl('/settings?success=true'),
      type: 'account_onboarding',
    })

    return { url: accountLink.url }
  } catch (error) {
    logger.error('Error creating Stripe account link:', error)
    throw new HttpsError('internal', 'Unable to create Stripe account link.')
  }
})
