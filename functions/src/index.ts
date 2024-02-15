import { initializeApp } from 'firebase-admin/app'
import * as dotenv from 'dotenv'

dotenv.config()
initializeApp()

export { createStripeLink } from './lib/createStripeLink'
