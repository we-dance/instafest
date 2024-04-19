import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

export type Event = z.infer<typeof schema>
