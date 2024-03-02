import { initializeApp } from 'firebase-admin/app'
import * as dotenv from 'dotenv'
import { Command } from 'commander'
import * as admin from 'firebase-admin'
import { getStripe } from './lib/stripe'

dotenv.config()
initializeApp()

const program = new Command()

async function createProduct(productSnap: any, account: any) {
  const product: any = { ...productSnap.data(), id: productSnap.id }

  if (product.stripeProductId) {
    return
  }

  const { stripe, options } = getStripe(account)

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

program
  .command('stripe:products:create')
  .argument('<accountId>', 'Product ID')
  .description('Create products in Stripe')
  .action(async (accountId) => {
    const db = admin.firestore()
    const productSnaps = await db.collection('products').get()
    const accountSnap = await db.collection('accounts').doc(accountId).get()
    const account: any = { ...accountSnap.data(), id: accountSnap.id }

    for (const productSnap of productSnaps.docs) {
      await createProduct(productSnap, account)
    }
  })

program
  .command('stripe:session:create')
  .argument('<priceId>', 'Price ID')
  .description('Create checkout session in Stripe')
  .action(async (priceId) => {
    const db = admin.firestore()
    const priceRefs = await db
      .collection('products')
      .where('stripePriceId', '==', priceId)
      .get()

    if (priceRefs.empty) {
      console.log('Products with this stripePriceId not found.')
      return
    }

    const priceSnap = priceRefs.docs[0]
    const price: any = { ...priceSnap.data(), id: priceSnap.id }
    const accountSnap = await db
      .collection('accounts')
      .doc(price.accountId)
      .get()
    const account: any = { ...accountSnap.data(), id: accountSnap.id }

    const { stripe, options } = getStripe(account)

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://yourwebsite.com/success',
        cancel_url: 'https://yourwebsite.com/cancel',
      },
      options
    )

    console.log(session.url)
  })

program.parse()
