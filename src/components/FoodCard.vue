<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '../types/recipe'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cart = useCartStore()

const props = defineProps<{
  recipe: Recipe
}>()

const quantity = ref(1)
const showBuyModal = ref(false)
const modalQuantity = ref(1) // Separate quantity for modal

const increment = () => {
  quantity.value++
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  cart.addToCart(props.recipe, quantity.value)
}

const buyNow = () => {
  modalQuantity.value = quantity.value // Sync modal quantity with card quantity
  showBuyModal.value = true
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

const confirmPurchase = () => {
  cart.clearCart() // Clear existing cart
  cart.addToCart(props.recipe, modalQuantity.value) // Use modal quantity
  router.push('/cart') // Navigate to cart
  closeModal()
}

const closeModal = () => {
  showBuyModal.value = false
  modalQuantity.value = quantity.value // Reset modal quantity to card quantity
  // Restore body scroll when modal is closed
  document.body.style.overflow = 'auto'
}

// Handle escape key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showBuyModal.value) {
    closeModal()
  }
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Calculate price in rupees
const calculatePriceInRupees = (calories: number) => {
  const priceInDollars = (calories / 100) * 2.5
  return Math.round(priceInDollars * 83) // 1 USD = 83 INR
}

const viewRecipe = () => {
  router.push(`/recipe/${props.recipe.id}`)
}

const handleOutsideClick = (event: MouseEvent) => {
  const modalContent = document.querySelector('.modal-content')
  // Close if click is outside modal content
  if (modalContent && !modalContent.contains(event.target as Node)) {
    closeModal()
  }
}

// Watch for quantity changes to sync between card and modal
watch(quantity, (newValue) => {
  if (!showBuyModal.value) {
    modalQuantity.value = newValue
  }
})
</script>

<template>
  <div class="card w-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
    <figure class="px-4 pt-4 cursor-pointer" @click="viewRecipe">
      <img :src="recipe.image" :alt="recipe.name" class="rounded-xl h-48 w-full object-cover" />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-primary font-bold text-xl">
        {{ recipe.name }}
        <div class="badge badge-primary text-white">{{ recipe.cuisine }}</div>
      </h2>

      <div class="flex items-center gap-2">
        <div class="rating rating-sm flex items-center">
          <input
            type="radio"
            :name="`rating-${recipe.id}`"
            class="mask mask-star-2 bg-primary"
            :checked="true"
          />
          <span class="ml-1 text-neutral-800 font-semibold">{{ recipe.rating }}</span>
        </div>
        <div class="badge badge-ghost text-neutral-700">{{ recipe.difficulty }}</div>
      </div>

      <p class="text-sm text-neutral-700 font-medium">
        Prep time: {{ recipe.prepTimeMinutes }} mins | Cook time: {{ recipe.cookTimeMinutes }} mins
      </p>

      <div class="flex justify-between items-center mt-2">
        <div class="text-xl font-bold text-primary">
          ₹{{ calculatePriceInRupees(recipe.caloriesPerServing) }}
        </div>

        <div class="flex items-center gap-2">
          <button
            class="btn btn-circle btn-sm bg-primary text-white hover:bg-primary/90"
            @click="decrement"
          >
            -
          </button>
          <span class="text-lg font-semibold text-neutral-800">{{ quantity }}</span>
          <button
            class="btn btn-circle btn-sm bg-primary text-white hover:bg-primary/90"
            @click="increment"
          >
            +
          </button>
        </div>
      </div>

      <div class="card-actions justify-end items-center mt-4">
        <button @click="addToCart" class="btn btn-ghost text-primary hover:bg-primary/10">
          Add to Cart
        </button>
        <button @click="buyNow" class="btn bg-primary hover:bg-primary/90 text-white border-0">
          Buy Now
        </button>
      </div>
    </div>

    <!-- Teleport the modal to body to prevent layout issues -->
    <Teleport to="body">
      <!-- Buy Now Modal -->
      <div
        v-if="showBuyModal"
        class="fixed inset-0 z-50 overflow-hidden"
        @click="handleOutsideClick"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity"></div>

        <!-- Modal panel -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <!-- Added modal-content class here -->
            <div
              class="modal-content relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
              @click.stop
            >
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-semibold leading-6 text-primary mb-4">Confirm Purchase</h3>

                <!-- Item Details -->
                <div class="flex gap-4 mb-6">
                  <img
                    :src="recipe.image"
                    :alt="recipe.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 class="font-semibold text-neutral-800">{{ recipe.name }}</h4>
                    <div class="text-neutral-600 text-sm">{{ recipe.cuisine }}</div>
                    <div class="text-primary font-bold mt-1">
                      ₹{{ calculatePriceInRupees(recipe.caloriesPerServing) }}
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <button
                        class="btn btn-xs btn-circle bg-primary hover:bg-primary/90 text-white border-0"
                        @click="modalQuantity > 1 ? modalQuantity-- : null"
                      >
                        -
                      </button>
                      <span class="text-neutral-700">{{ modalQuantity }}</span>
                      <button
                        class="btn btn-xs btn-circle bg-primary hover:bg-primary/90 text-white border-0"
                        @click="modalQuantity++"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Price Summary -->
                <div class="bg-neutral-50 p-4 rounded-lg mb-6">
                  <div class="flex justify-between mb-2">
                    <span class="text-neutral-600">Price</span>
                    <span class="text-neutral-800">
                      ₹{{ calculatePriceInRupees(recipe.caloriesPerServing) * modalQuantity }}
                    </span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-neutral-600">Delivery</span>
                    <span class="text-neutral-800">₹60</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-600">GST (18%)</span>
                    <span class="text-neutral-800">
                      ₹{{
                        Math.round(
                          calculatePriceInRupees(recipe.caloriesPerServing) * modalQuantity * 0.18,
                        )
                      }}
                    </span>
                  </div>
                  <div class="border-t border-neutral-200 mt-2 pt-2">
                    <div class="flex justify-between">
                      <span class="font-bold text-neutral-800">Total</span>
                      <span class="font-bold text-primary">
                        ₹{{
                          calculatePriceInRupees(recipe.caloriesPerServing) * modalQuantity +
                          60 +
                          Math.round(
                            calculatePriceInRupees(recipe.caloriesPerServing) *
                              modalQuantity *
                              0.18,
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Modal Actions -->
                <div class="flex justify-end gap-2 mt-4">
                  <button
                    class="btn btn-ghost text-neutral-600 hover:bg-neutral-100"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn bg-primary hover:bg-primary/90 text-white border-0"
                    @click="confirmPurchase"
                  >
                    Proceed to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.card {
  @apply transition-all duration-300 ease-in-out;
  min-width: 300px;
}

.card:hover {
  @apply transform -translate-y-1;
}

.card-body {
  @apply p-4;
}

/* Ensure text contrast */
.text-primary {
  @apply font-bold;
}

.badge-primary {
  @apply text-white font-medium;
}

.btn-primary {
  @apply font-semibold;
}

.modal-content {
  pointer-events: auto;
}
</style>
