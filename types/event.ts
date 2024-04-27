import { z } from 'zod'
import { schema as ParticipantSchema } from './participant'

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number(),
})

const existing = schema.extend({
  id: z.string(),
  participants: z.record(ParticipantSchema),
})

export type Event = z.infer<typeof existing>
