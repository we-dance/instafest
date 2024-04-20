<script setup lang="ts">
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getEventDates } from '~/lib/utils'
import type { Event } from '~/types/event'
import { ParticipantStatus, type Participant } from '~/types/participant'

const props = defineProps<{
  event: Event
}>()

const { uid, enrollments, account } = useCustomer()
const { orgId } = useOrganizationStore()
const { $db } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const autoJoinId = route.query.join
const loaded = ref(false)

const participants = ref<any[]>([])
const isAlertOpen = ref(false)
const alertTitle = ref('')
const alertDescription = ref('')

function showAlert(title: string, description: string) {
  alertTitle.value = title
  alertDescription.value = description
  isAlertOpen.value = true
}

onMounted(() => {
  if (!uid.value) {
    throw new Error('User ID is required')
  }

  if (!orgId) {
    throw new Error('Organization ID is required')
  }

  const q = query(
    collection($db, 'organizations', orgId, 'participants'),
    where('eventId', '==', props.event.id)
  )

  onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    participants.value = []
    const docs: Participant[] = []

    querySnapshot.forEach((doc) => {
      participants.value.push(doc.data())
    })

    loaded.value = true
  })
})

watch(loaded, () => {
  if (autoJoinId && loaded.value) {
    if (props.event.id === autoJoinId) {
      enroll()
      router.replace({ query: {} })
    }
  }
})

function isActive(participant: Participant) {
  return [ParticipantStatus.REGISTERED, ParticipantStatus.CHECKED_IN].includes(
    participant.status
  )
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

async function enroll() {
  if (!orgId) {
    throw new Error('Organization ID is required')
  }

  if (!uid.value) {
    throw new Error('User ID is required')
  }

  if (isRegistered.value) {
    showAlert(
      'Bereits angemeldet',
      'Du bist bereits für diesen Kurs angemeldet.'
    )

    return
  }

  let eventLog

  if (isOverCapacity.value) {
    eventLog = {
      waitlistedAt: new Date(),
      status: ParticipantStatus.WAITLISTED,
    }
  } else {
    eventLog = {
      joinedAt: new Date(),
      status: ParticipantStatus.REGISTERED,
    }
  }

  if (enrollment.value) {
    await updateDoc(
      doc($db, 'organizations', orgId, 'participants', enrollment.value.id),
      {
        ...eventLog,
        canceledAt: null,
        updatedAt: new Date(),
      }
    )
  } else {
    const newEnrollment = {
      ...eventLog,
      customerId: uid.value,
      name: account.value?.name,
      eventId: props.event.id,
      updatedAt: new Date(),
      role: account.value?.gender === 'male' ? 'leader' : 'follower',
    }

    await addDoc(
      collection($db, 'organizations', orgId, 'participants'),
      newEnrollment
    )
  }

  if (eventLog.status === ParticipantStatus.WAITLISTED) {
    showAlert(
      'Warteliste',
      'Du bist auf der Warteliste gelandet. Wir informieren dich, sobald ein Platz frei wird!'
    )
  } else {
    showAlert(
      'Anmeldung bestätigt',
      'Deine Anmeldung zum Tanzkurs ist im Kasten! Zeit, die Tanzschuhe zu schnüren und die Hüften locker zu machen – wir sehen uns auf der Tanzfläche!'
    )
  }
}

async function withdraw(enrollment: any) {
  if (!orgId) {
    throw new Error('Organization ID is required')
  }

  await updateDoc(
    doc($db, 'organizations', orgId, 'participants', enrollment.id),
    {
      canceledAt: new Date(),
      updatedAt: new Date(),
      status: ParticipantStatus.CANCELED,
    }
  )

  showAlert(
    'Abmeldung bestätigt',
    'Schade, dass du nicht dabei sein kannst. Wir hoffen, dich bald wieder bei uns begrüßen zu dürfen!'
  )
}

const enrollment = computed(() =>
  enrollments.value?.find((e) => e.eventId === props.event.id)
)

const isRegistered = computed(
  () =>
    enrollment.value && enrollment.value.status === ParticipantStatus.REGISTERED
)

const isWaitlisted = computed(
  () =>
    enrollment.value && enrollment.value.status === ParticipantStatus.WAITLISTED
)

const isOverCapacity = computed(
  () => props.event.capacity && total.value >= props.event.capacity
)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ event.name }}</CardTitle>
      <CardDescription>
        {{ getEventDates(event) }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-2">
        <p v-if="event.description" class="text-sm text-gray-500">
          {{ event.description }}
        </p>
        <p class="text-sm text-gray-500">
          {{ total }}
          of {{ event.capacity || '∞' }} • {{ followers }} followers •
          {{ leaders }} leaders • {{ waitlisted }} waitlisted
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <ButtonGroup>
        <Button
          v-if="isRegistered"
          variant="destructive"
          @click="withdraw(enrollment)"
          >Verlassen</Button
        >
        <Button
          v-else-if="isWaitlisted"
          variant="destructive"
          @click="withdraw(enrollment)"
          >Von Warteliste abmelden</Button
        >
        <Button v-else-if="isOverCapacity" @click="enroll(enrollment)"
          >Warteliste</Button
        >
        <Button v-else @click="enroll(enrollment)">Beitreten</Button>
      </ButtonGroup>
    </CardFooter>
  </Card>

  <AlertDialog v-model:open="isAlertOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ alertTitle }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ alertDescription }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Schließen</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
