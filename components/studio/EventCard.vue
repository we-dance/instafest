<script setup lang="ts">
import { getEventDates } from '~/lib/utils'
import type { Event } from '~/types/event'
import { ParticipantStatus } from '~/types/participant'

const props = defineProps<{
  event: Event
}>()

const event = toRef(props, 'event')
const { uid, account } = useCustomer()
const { orgId } = useOrganizationStore()
const {
  updateParticipant,
  enrollment,
  isRegistered,
  isOverCapacity,
  isWaitlisted,
  total,
  followers,
  waitlisted,
  leaders,
} = useEvent(event)

const route = useRoute()
const router = useRouter()
const autoJoinId = route.query.join

const isAlertOpen = ref(false)
const alertTitle = ref('')
const alertDescription = ref('')

function showAlert(title: string, description: string) {
  alertTitle.value = title
  alertDescription.value = description
  isAlertOpen.value = true
}

onMounted(() => {
  if (autoJoinId && props.event.id === autoJoinId) {
    enroll()
    router.replace({ query: {} })
  }
})

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
    await updateParticipant(uid.value, {
      ...eventLog,
      canceledAt: null,
      updatedAt: new Date(),
    })
  } else {
    await updateParticipant(uid.value, {
      ...eventLog,
      customerId: uid.value,
      name: account.value?.name || '',
      eventId: props.event.id,
      updatedAt: new Date(),
      role: account.value?.gender === 'male' ? 'leader' : 'follower',
    })
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

async function withdraw() {
  if (!orgId) {
    throw new Error('Organization ID is required')
  }

  if (!enrollment.value) {
    showAlert('Nicht angemeldet', 'Du bist nicht für diesen Kurs angemeldet.')

    return
  }

  await updateParticipant(uid.value, {
    canceledAt: new Date(),
    updatedAt: new Date(),
    status: ParticipantStatus.CANCELED,
  })

  showAlert(
    'Abmeldung bestätigt',
    'Schade, dass du nicht dabei sein kannst. Wir hoffen, dich bald wieder bei uns begrüßen zu dürfen!'
  )
}
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
      <Button v-if="isRegistered" variant="destructive" @click="withdraw()"
        >Verlassen</Button
      >
      <Button v-else-if="isWaitlisted" variant="destructive" @click="withdraw()"
        >Von Warteliste abmelden</Button
      >
      <Button v-else-if="isOverCapacity" @click="enroll()">Warteliste</Button>
      <Button v-else @click="enroll()">Beitreten</Button>
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
