<script setup>
definePageMeta({
  layout: 'empty',
})
import { collection, getDocs, query, where } from 'firebase/firestore'

const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()

const orgsSnap = await getDocs(
  query(
    collection($db, 'organizations'),
    where('owners', 'array-contains', uid.value)
  )
)

const orgs = orgsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
</script>

<template>
  <div class="h-[100vh] flex items-center justify-center">
    <div class="flex flex-col gap-4">
      <Button as-child v-for="org in orgs" :key="org.id">
        <router-link :to="`/${org.slug}/admin`">{{ org.name }}</router-link>
      </Button>
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline"> Add Organization</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to your account.
            </DialogDescription>
          </DialogHeader>
          <AdminOrganizationForm class="max-w-[400px] w-full" />
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
