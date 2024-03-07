<script setup>
import {
  doc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
const { $db } = useNuxtApp()
const { uid } = useFirebaseAuth()

definePageMeta({
  layout: 'admin',
})

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  duration: 0,
  accountId: uid.value,
}
const product = ref(emptyProduct)
const products = ref([])

async function addProduct() {
  await addDoc(collection($db, 'products'), product.value)
  product.value = { ...emptyProduct }
}

onMounted(() => {
  const q = query(
    collection($db, 'products'),
    where('accountId', '==', uid.value)
  )

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    products.value = []

    querySnapshot.forEach((doc) => {
      products.value.push({
        ...doc.data(),
        id: doc.id,
      })
    })
  })
})
</script>

<template>
  <div>
    <h1>Products</h1>
    <form @submit.prevent="addProduct()">
      <input v-model="product.name" type="text" placeholder="Name" />
      <input
        v-model="product.description"
        type="text"
        placeholder="Description"
      />
      <input v-model="product.price" type="number" placeholder="Price" />
      <select v-model="product.duration">
        <option value="0">One Time</option>
        <option value="1">1 Month</option>
        <option value="3">3 Months</option>
        <option value="6">6 Months</option>
        <option value="12">12 Months</option>
      </select>
      <button type="submit">Add Product</button>
    </form>

    <ul
      role="list"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="product in products"
        :key="product.name"
        class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
      >
        <div class="flex w-full items-center justify-between space-x-6 p-6">
          <div class="flex flex-col">
            <div class="flex items-center space-x-3">
              <h3 class="truncate text-sm font-medium text-gray-900">
                {{ product.name }}
              </h3>
              <span
                class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >{{ product.price }} EUR</span
              >
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ product.description }}
            </p>
            <a
              :href="product.paymentLink"
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Order
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
