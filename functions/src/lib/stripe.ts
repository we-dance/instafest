import Stripe from 'stripe'
import { getAppUrl } from './organization'

export function getStripe(org: any) {
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

export async function createProduct(productSnap: any, org: any) {
  const product: any = { ...productSnap.data(), id: productSnap.id }

  if (product.stripeProductId) {
    return
  }

  const { stripe, options } = getStripe(org)

  const stripeProduct = await stripe.products.create(
    {
      name: product.name,
      description: product.description,
      type: 'service',
    },
    options
  )

  const stripePrice = await stripe.prices.create(
    {
      unit_amount: product.price * 100,
      currency: 'eur',
      product: stripeProduct.id,
    },
    options
  )

  const paymentLink = await stripe.paymentLinks.create(
    {
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: getAppUrl(org, '/'),
        },
      },
    },
    options
  )

  const updates = {
    stripeProductId: stripeProduct.id,
    stripePriceId: stripePrice.id,
    paymentLink: paymentLink.url,
  }

  productSnap.ref.update(updates)
}
