<script setup lang="ts">
import { ref } from 'vue'
import type { Recipe } from '../types/recipe'

const props = defineProps<{
  recipe: Recipe
}>()

const quantity = ref(1)

const increment = () => {
  quantity.value++
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Mock price calculation based on calories (just for demo)
const calculatePrice = (calories: number) => {
  return ((calories / 100) * 2.5).toFixed(2)
}
</script>

<template>
  <div class="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
    <figure class="px-4 pt-4">
      <img :src="recipe.image" :alt="recipe.name" class="rounded-xl h-48 w-full object-cover" />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-primary">
        {{ recipe.name }}
        <div class="badge badge-secondary">{{ recipe.cuisine }}</div>
      </h2>

      <div class="flex items-center gap-2">
        <div class="rating rating-sm">
          <input
            type="radio"
            :name="`rating-${recipe.id}`"
            class="mask mask-star-2 bg-primary"
            :checked="true"
          />
          <span class="ml-1">{{ recipe.rating }}</span>
        </div>
        <div class="badge badge-outline">{{ recipe.difficulty }}</div>
      </div>

      <p class="text-sm text-gray-600">
        Prep time: {{ recipe.prepTimeMinutes }} mins | Cook time: {{ recipe.cookTimeMinutes }} mins
      </p>

      <div class="flex justify-between items-center mt-2">
        <div class="text-xl font-bold text-primary">
          ${{ calculatePrice(recipe.caloriesPerServing) }}
        </div>

        <div class="flex items-center gap-2">
          <button class="btn btn-circle btn-sm" @click="decrement">-</button>
          <span class="text-lg">{{ quantity }}</span>
          <button class="btn btn-circle btn-sm" @click="increment">+</button>
        </div>
      </div>

      <div class="card-actions justify-end mt-4">
        <button class="btn btn-outline btn-primary">Add to Cart</button>
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply transition-all duration-300 ease-in-out;
}

.card:hover {
  @apply transform -translate-y-1;
}
</style>
