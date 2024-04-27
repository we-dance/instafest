import { doc, updateDoc } from 'firebase/firestore'
import { normalizeDoc } from '~/lib/utils'
import type { Event } from '~/types/event'
import { ParticipantStatus, type Participant } from '~/types/participant'

export default function (event: Ref<Event>) {
  const { orgId } = useOrganizationStore()
  const { $db } = useNuxtApp()
  const { uid } = useCustomer()

  const participants = computed(() => {
    const result = event.value?.participants
      ? Object.values(event.value.participants)
      : []

    return result.map(normalizeDoc)
  })

  function isActive(participant: Participant) {
    return [
      ParticipantStatus.REGISTERED,
      ParticipantStatus.CHECKED_IN,
    ].includes(participant.status)
  }

  const total = computed(
    () => participants.value.filter((p: Participant) => isActive(p)).length
  )

  const followers = computed(
    () =>
      participants.value.filter(
        (p: Participant) => isActive(p) && p.role === 'follower'
      ).length
  )
  const leaders = computed(
    () =>
      participants.value.filter(
        (p: Participant) => isActive(p) && p.role === 'leader'
      ).length
  )
  const waitlisted = computed(
    () =>
      participants.value.filter(
        (p: Participant) => p.status === ParticipantStatus.WAITLISTED
      ).length
  )

  const enrollment = computed(() =>
    participants.value.find((p: Participant) => p.customerId === uid.value)
  )

  const isRegistered = computed(
    () =>
      enrollment.value &&
      enrollment.value.status === ParticipantStatus.REGISTERED
  )

  const isWaitlisted = computed(
    () =>
      enrollment.value &&
      enrollment.value.status === ParticipantStatus.WAITLISTED
  )

  const isOverCapacity = computed(
    () => event.value?.capacity && total.value >= event.value.capacity
  )

  async function updateParticipant(customerId: string, participant: any) {
    if (!orgId) {
      throw new Error('Organization ID is required')
    }

    const existingParticipant = event.value.participants?.[customerId] || {}

    const update = {
      ...existingParticipant,
      ...participant,
    }

    const eventRef = doc($db, 'organizations', orgId, 'events', event.value.id)

    await updateDoc(eventRef, {
      [`participants.${customerId}`]: update,
    })
  }

  return {
    event,
    participants,
    total,
    followers,
    leaders,
    waitlisted,
    isActive,
    isOverCapacity,
    updateParticipant,
    enrollment,
    isRegistered,
    isWaitlisted,
  }
}
