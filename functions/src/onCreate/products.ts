import * as admin from 'firebase-admin'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import * as logger from 'firebase-functions/logger'
import { createProduct } from '../lib/stripe'

export const createStripeProduct = onDocumentCreated(
  'organizations/{orgId}/products/{productId}',
  async (event) => {
    const productSnap = event.data
    const orgId = event.params.orgId

    const db = admin.firestore()

    const orgRef = db.collection('organizations').doc(orgId)
    const orgSnap = await orgRef.get()

    if (!orgSnap.exists) {
      logger.error('Organization does not exist.')
      return
    }

    const org = { ...orgSnap.data(), id: orgSnap.id }

    if (!org) {
      logger.error('Organization does not exist.')
      return
    }

    await createProduct(productSnap, org)
  }
)
