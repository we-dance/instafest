import Stripe from 'stripe'

function getStripe(test: boolean = false, account: any) {
  if (!account) {
    throw new Error('Account is required')
  }

  const stripeKey = test
    ? String(process.env.STRIPE_SECRET_KEY_TEST)
    : String(process.env.STRIPE_SECRET_KEY)

  const stripeAccountIdKey = test ? 'stripeAccountIdTest' : 'stripeAccountId'

  const stripe = new Stripe(stripeKey)

  const options = {
    stripeAccount: account[stripeAccountIdKey],
  }

  return { stripe, stripeAccountIdKey, options }
}

export { getStripe }
