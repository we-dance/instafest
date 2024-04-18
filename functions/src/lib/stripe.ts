import Stripe from 'stripe'

function getStripe(org: any) {
  if (!org) {
    throw new Error('Organization is required')
  }

  const stripeKey = String(process.env.STRIPE_SECRET_KEY)

  const stripe = new Stripe(stripeKey)

  const options = {
    stripeAccount: org.stripeAccountId,
  }

  return { stripe, options }
}

export { getStripe }
