<script setup lang="ts">
import { onMounted, computed } from 'vue'
import FoodCard from '@/components/FoodCard.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const store = useRecipeStore()

// Compute AI recommendations (top 4 rated recipes)
const aiRecommendations = computed(() => {
  return [...store.recipes].sort((a, b) => b.rating - a.rating).slice(0, 4)
})

onMounted(async () => {
  await store.fetchRecipes()
})
</script>

<template>
  <div class="container mx-auto px-4 space-y-8">
    <!-- AI Recommendations Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
        <span class="text-3xl">🤖</span>
        <span class="bg-primary/10 text-primary px-4 py-2 rounded-lg">
          AI-Powered Recommendations
        </span>
      </h2>
      <div v-if="store.loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <div v-else-if="store.error" class="alert alert-error text-white">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FoodCard v-for="recipe in aiRecommendations" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <!-- All Recipes Section -->
    <section>
      <h2 class="text-2xl font-bold text-neutral-800 mb-6 px-4 py-2 bg-neutral-100 rounded-lg">
        All Recipes
      </h2>
      <div v-if="store.loading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <span class="ml-4 text-lg text-neutral-600">Searching recipes...</span>
      </div>
      <div v-else-if="store.error" class="alert alert-error text-white">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FoodCard v-for="recipe in store.filteredRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
}

/* Improved text contrast */
h2 {
  @apply text-neutral-800 font-bold;
}

.alert-error {
  @apply text-white font-medium;
}
</style>
