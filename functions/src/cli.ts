import { initializeApp } from 'firebase-admin/app'
import * as dotenv from 'dotenv'
import { Command } from 'commander'
import * as admin from 'firebase-admin'
import { createProduct, getStripe } from './lib/stripe'

dotenv.config()
initializeApp()

const program = new Command()

program
  .command('stripe:products:create')
  .argument('<orgId>', 'Org ID')
  .description('Create products in Stripe')
  .action(async (orgId) => {
    const db = admin.firestore()
    const orgSnap = await db.collection('organizations').doc(orgId).get()
    const org: any = { ...orgSnap.data(), id: orgSnap.id }

    const productSnaps = await db
      .collection(`organizations/${org.slug}/products/`)
      .get()

    for (const productSnap of productSnaps.docs) {
      await createProduct(productSnap, org)
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
