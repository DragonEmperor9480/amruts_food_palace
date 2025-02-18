<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipeStore'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()
const cart = useCartStore()

const recipe = ref<any>(null)
const loading = ref(true)
const quantity = ref(1)
const activeTab = ref('ingredients')
const showBuyModal = ref(false)

const fetchRecipe = async () => {
  try {
    const response = await fetch(`https://dummyjson.com/recipes/${route.params.id}`)
    recipe.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (recipe.value) {
    cart.addToCart(recipe.value, quantity.value)
  }
}

const buyNow = () => {
  showBuyModal.value = true
}

const confirmPurchase = () => {
  cart.clearCart() // Clear existing cart
  cart.addToCart(recipe.value, quantity.value) // Add only this item
  router.push('/cart')
  closeModal()
}

const closeModal = () => {
  showBuyModal.value = false
}

const increment = () => quantity.value++
const decrement = () => {
  if (quantity.value > 1) quantity.value--
}

const calculatePrice = (calories: number) => {
  return ((calories / 100) * 2.5).toFixed(2)
}

const calculatePriceInRupees = (calories: number) => {
  const priceInDollars = (calories / 100) * 2.5
  return Math.round(priceInDollars * 83)
}

onMounted(fetchRecipe)
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <div v-else-if="recipe" class="container mx-auto px-4 py-8">
    <button @click="router.push('/')" class="btn btn-ghost text-primary mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Recipes
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Image Section -->
      <div class="rounded-xl overflow-hidden shadow-lg bg-white">
        <img :src="recipe.image" :alt="recipe.name" class="w-full h-[400px] object-cover" />
      </div>

      <!-- Details Section -->
      <div class="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        <div>
          <h1 class="text-3xl font-bold text-primary mb-2">{{ recipe.name }}</h1>
          <div class="flex flex-wrap gap-2">
            <div class="badge badge-primary text-white">{{ recipe.cuisine }}</div>
            <div class="badge badge-outline text-neutral-700">{{ recipe.difficulty }}</div>
            <div class="badge bg-neutral-200 text-neutral-700">
              {{ recipe.mealType.join(', ') }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="rating rating-md flex items-center">
            <input
              type="radio"
              :name="`rating-${recipe.id}`"
              class="mask mask-star-2 bg-primary"
              :checked="true"
            />
            <span class="ml-2 text-lg font-semibold text-neutral-800">{{ recipe.rating }}</span>
          </div>
          <div class="divider divider-horizontal"></div>
          <div class="text-xl font-bold text-primary">
            ${{ calculatePrice(recipe.caloriesPerServing) }}
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-neutral-100 p-3 rounded-lg">
            <div class="font-semibold text-neutral-800">Prep Time</div>
            <div class="text-neutral-600">{{ recipe.prepTimeMinutes }} mins</div>
          </div>
          <div class="bg-neutral-100 p-3 rounded-lg">
            <div class="font-semibold text-neutral-800">Cook Time</div>
            <div class="text-neutral-600">{{ recipe.cookTimeMinutes }} mins</div>
          </div>
          <div class="bg-neutral-100 p-3 rounded-lg">
            <div class="font-semibold text-neutral-800">Servings</div>
            <div class="text-neutral-600">{{ recipe.servings }}</div>
          </div>
          <div class="bg-neutral-100 p-3 rounded-lg">
            <div class="font-semibold text-neutral-800">Calories</div>
            <div class="text-neutral-600">{{ recipe.caloriesPerServing }}/serving</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs tabs-boxed bg-neutral-100">
          <a
            class="tab text-neutral-600 hover:text-primary"
            :class="{ 'tab-active !text-white bg-primary': activeTab === 'ingredients' }"
            @click="activeTab = 'ingredients'"
          >
            Ingredients
          </a>
          <a
            class="tab text-neutral-600 hover:text-primary"
            :class="{ 'tab-active !text-white bg-primary': activeTab === 'instructions' }"
            @click="activeTab = 'instructions'"
          >
            Instructions
          </a>
        </div>

        <div v-if="activeTab === 'ingredients'" class="space-y-2 bg-neutral-50 p-4 rounded-lg">
          <ul class="list-disc list-inside">
            <li
              v-for="ingredient in recipe.ingredients"
              :key="ingredient"
              class="text-neutral-700 py-1"
            >
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div v-else class="space-y-2 bg-neutral-50 p-4 rounded-lg">
          <ol class="list-decimal list-inside">
            <li
              v-for="(step, index) in recipe.instructions"
              :key="index"
              class="text-neutral-700 py-1"
            >
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- Add quantity controls and Buy Now button -->
        <div class="flex items-center gap-4 mt-6">
          <div class="flex items-center gap-2">
            <button
              class="btn btn-circle bg-primary hover:bg-primary/90 text-white border-0"
              @click="quantity > 1 ? quantity-- : null"
            >
              -
            </button>
            <span class="text-neutral-700 text-lg">{{ quantity }}</span>
            <button
              class="btn btn-circle bg-primary hover:bg-primary/90 text-white border-0"
              @click="quantity++"
            >
              +
            </button>
          </div>

          <button @click="addToCart" class="btn btn-outline btn-primary">Add to Cart</button>

          <button @click="buyNow" class="btn bg-primary hover:bg-primary/90 text-white border-0">
            Buy Now
          </button>
        </div>
      </div>
    </div>

    <!-- Buy Now Modal -->
    <dialog :open="showBuyModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box bg-white">
        <div class="flex items-start gap-4">
          <img :src="recipe.image" :alt="recipe.name" class="w-24 h-24 object-cover rounded-lg" />
          <div>
            <h4 class="font-semibold text-neutral-800">{{ recipe.name }}</h4>
            <div class="text-neutral-600 text-sm">{{ recipe.cuisine }}</div>
            <div class="text-primary font-bold mt-1">
              ₹{{ calculatePriceInRupees(recipe.caloriesPerServing) }}
            </div>
            <div class="flex items-center gap-2 mt-2">
              <button
                class="btn btn-xs btn-circle bg-primary hover:bg-primary/90 text-white border-0"
                @click="quantity > 1 ? quantity-- : null"
              >
                -
              </button>
              <span class="text-neutral-700">{{ quantity }}</span>
              <button
                class="btn btn-xs btn-circle bg-primary hover:bg-primary/90 text-white border-0"
                @click="quantity++"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="bg-neutral-50 p-4 rounded-lg my-6">
          <div class="flex justify-between mb-2">
            <span class="text-neutral-600">Price</span>
            <span class="text-neutral-800">
              ₹{{ calculatePriceInRupees(recipe.caloriesPerServing) * quantity }}
            </span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-neutral-600">Delivery</span>
            <span class="text-neutral-800">₹60</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-600">GST (18%)</span>
            <span class="text-neutral-800">
              ₹{{ Math.round(calculatePriceInRupees(recipe.caloriesPerServing) * quantity * 0.18) }}
            </span>
          </div>
          <div class="border-t border-neutral-200 mt-2 pt-2">
            <div class="flex justify-between">
              <span class="font-bold text-neutral-800">Total</span>
              <span class="font-bold text-primary">
                ₹{{
                  calculatePriceInRupees(recipe.caloriesPerServing) * quantity +
                  60 +
                  Math.round(calculatePriceInRupees(recipe.caloriesPerServing) * quantity * 0.18)
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
          <button class="btn btn-ghost text-neutral-600 hover:bg-neutral-100" @click="closeModal">
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
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>

  <div v-else class="text-center py-12">
    <div class="alert alert-error max-w-md mx-auto text-white">Recipe not found</div>
    <button @click="router.push('/')" class="btn btn-primary text-white mt-4">
      Return to Home
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
}

.tab-active {
  @apply !bg-primary text-white;
}

.badge {
  @apply font-medium;
}

.btn-primary {
  @apply font-semibold;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
