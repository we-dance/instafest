import { z } from 'zod'

export const adminAccountShemaInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
})

export const adminAccountShema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  country: z.string().min(2),
  id: z.string().optional(),
})

export type AdminAccountInput = z.infer<typeof adminAccountShemaInput>
export type AdminAccount = z.infer<typeof adminAccountShema>
