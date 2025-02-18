<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const recipe = ref<any>(null)
const loading = ref(true)
const quantity = ref(1)
const activeTab = ref('ingredients')

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

const increment = () => quantity.value++
const decrement = () => {
  if (quantity.value > 1) quantity.value--
}

const calculatePrice = (calories: number) => {
  return ((calories / 100) * 2.5).toFixed(2)
}

onMounted(fetchRecipe)
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <div v-else-if="recipe" class="container mx-auto px-4 py-8">
    <button @click="router.push('/')" class="btn btn-ghost mb-4">
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
      <div class="rounded-xl overflow-hidden shadow-lg">
        <img :src="recipe.image" :alt="recipe.name" class="w-full h-[400px] object-cover" />
      </div>

      <!-- Details Section -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-primary mb-2">{{ recipe.name }}</h1>
          <div class="flex flex-wrap gap-2">
            <div class="badge badge-primary">{{ recipe.cuisine }}</div>
            <div class="badge badge-outline">{{ recipe.difficulty }}</div>
            <div class="badge badge-ghost">{{ recipe.mealType.join(', ') }}</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="rating rating-md">
            <input
              type="radio"
              :name="`rating-${recipe.id}`"
              class="mask mask-star-2 bg-primary"
              :checked="true"
            />
            <span class="ml-2 text-lg font-semibold">{{ recipe.rating }}</span>
          </div>
          <div class="divider divider-horizontal"></div>
          <div class="text-xl font-bold text-primary">
            ${{ calculatePrice(recipe.caloriesPerServing) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-neutral-600">
          <div><span class="font-semibold">Prep Time:</span> {{ recipe.prepTimeMinutes }} mins</div>
          <div><span class="font-semibold">Cook Time:</span> {{ recipe.cookTimeMinutes }} mins</div>
          <div><span class="font-semibold">Servings:</span> {{ recipe.servings }}</div>
          <div>
            <span class="font-semibold">Calories:</span> {{ recipe.caloriesPerServing }} per serving
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs tabs-boxed">
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'ingredients' }"
            @click="activeTab = 'ingredients'"
          >
            Ingredients
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'instructions' }"
            @click="activeTab = 'instructions'"
          >
            Instructions
          </a>
        </div>

        <div v-if="activeTab === 'ingredients'" class="space-y-2">
          <ul class="list-disc list-inside">
            <li v-for="ingredient in recipe.ingredients" :key="ingredient" class="text-neutral-700">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div v-else class="space-y-2">
          <ol class="list-decimal list-inside">
            <li v-for="(step, index) in recipe.instructions" :key="index" class="text-neutral-700">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- Add to Cart Section -->
        <div class="card bg-base-200 p-4 mt-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button class="btn btn-circle btn-sm" @click="decrement">-</button>
              <span class="text-xl font-semibold">{{ quantity }}</span>
              <button class="btn btn-circle btn-sm" @click="increment">+</button>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary text-white" @click="addToCart">Add to Cart</button>
              <button class="btn btn-outline btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <div class="alert alert-error max-w-md mx-auto">Recipe not found</div>
    <button @click="router.push('/')" class="btn btn-primary mt-4">Return to Home</button>
  </div>
</template>
