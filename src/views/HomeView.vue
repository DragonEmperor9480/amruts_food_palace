<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'
import FoodCard from '@/components/FoodCard.vue'
import FilterMenu from '@/components/FilterMenu.vue'

const store = useRecipeStore()

// Computed properties for filtered recipes
const filteredRecipes = computed(() => store.filteredRecipes)
const aiRecommendations = computed(() => store.aiRecommendations)

// Fetch recipes when component mounts
onMounted(async () => {
  await store.fetchRecipes()
})
</script>

<template>
  <main class="min-h-screen bg-neutral-50 pb-8">
    <FilterMenu />

    <!-- AI Recommendations Section -->
    <section v-if="aiRecommendations.length" class="container mx-auto px-4 mt-8">
      <h2 class="text-2xl font-bold mb-4 text-neutral-800">AI Recommendations</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FoodCard v-for="recipe in aiRecommendations" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <!-- All Recipes Section -->
    <section class="container mx-auto px-4 mt-8">
      <h2 class="text-2xl font-bold mb-4 text-neutral-800">All Recipes</h2>
      <div
        v-if="filteredRecipes.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <FoodCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
      <div v-else class="text-center py-8">
        <p class="text-neutral-600">No recipes found matching your criteria.</p>
      </div>
    </section>
  </main>
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
