import Stripe from 'stripe'

function getStripe(account: any) {
  if (!account) {
    throw new Error('Account is required')
  }

  const stripeKey = String(process.env.STRIPE_SECRET_KEY)

  const stripe = new Stripe(stripeKey)

  const options = {
    stripeAccount: account.stripeAccountId,
  }

  return { stripe, options }
}

export { getStripe }
