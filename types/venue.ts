import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  address: z.string().optional().default(''),
})

export type Venue = z.infer<typeof schema>
