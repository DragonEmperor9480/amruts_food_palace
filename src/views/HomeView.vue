<script setup lang="ts">
import { onMounted } from 'vue'
import FoodCard from '@/components/FoodCard.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const store = useRecipeStore()

onMounted(async () => {
  await store.fetchRecipes()
})
</script>

<template>
  <div class="space-y-8">
    <!-- AI Recommendations Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-primary mb-4">🤖 AI-Powered Recommendations</h2>
      <div v-if="store.loading" class="text-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <div v-else-if="store.error" class="alert alert-error">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FoodCard v-for="recipe in store.aiRecommendations" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <!-- All Recipes Section -->
    <section>
      <h2 class="text-2xl font-bold mb-4">All Recipes</h2>
      <div v-if="store.loading" class="text-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <div v-else-if="store.error" class="alert alert-error">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FoodCard v-for="recipe in store.recipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>
  </div>
</template>
