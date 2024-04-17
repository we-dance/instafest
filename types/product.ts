import { z } from 'zod'

export const durationOptions = [
  { value: '0', label: 'One Time' },
  { value: '1', label: '1 month' },
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
]

export const productShema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().gt(0),
  duration: z.string(),
})

export type Product = z.infer<typeof productShema>
