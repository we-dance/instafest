import { z } from 'zod'

export const customerAccountSchemaInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  gender: z.string(),
  phone: z.string(),
  level: z.string(),
  package: z.string(),
  course: z.string(),
})

export const customerAccountSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  gender: z.string(),
  phone: z.string(),
  id: z.string().optional(),
})

export type CustomerAccountInput = z.infer<typeof customerAccountSchemaInput>
export type CustomerAccount = z.infer<typeof customerAccountSchema>
