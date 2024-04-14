import { initializeApp } from 'firebase-admin/app'
import { setGlobalOptions } from 'firebase-functions/v2'
import * as dotenv from 'dotenv'

dotenv.config()
initializeApp()
setGlobalOptions({ region: 'europe-west3' })

export { createStripeLink } from './onCall/createStripeLink'
