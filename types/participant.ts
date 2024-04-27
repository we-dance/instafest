import { z } from 'zod'

export enum ParticipantStatus {
  INVITED = 'invited',
  REGISTERED = 'registered',
  DECLINED = 'declined',
  CANCELED = 'canceled',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
  WAITLISTED = 'waitlisted',
}

export const schema = z.object({
  customerId: z.string(),
  name: z.string(),
  eventId: z.string(),
  updatedAt: z.coerce.date(),
  joinedAt: z.coerce.date().optional(),
  invitedAt: z.coerce.date().optional(),
  declinedAt: z.coerce.date().optional(),
  canceledAt: z.coerce.date().optional().nullable(),
  waitlistedAt: z.coerce.date().optional(),
  role: z.string(),
  status: z.nativeEnum(ParticipantStatus),
  checkInStatus: z.nativeEnum(ParticipantStatus).optional(),
})

const existing = schema.extend({
  id: z.string(),
})

export type Participant = z.infer<typeof existing>
