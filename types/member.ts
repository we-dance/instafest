import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
})

export type Member = z.infer<typeof schema>
