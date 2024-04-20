import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number(),
})

const existing = schema.extend({
  id: z.string(),
})

export type Event = z.infer<typeof existing>
