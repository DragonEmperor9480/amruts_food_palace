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
  <div class="container mx-auto px-4 space-y-8">
    <!-- AI Recommendations Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-primary mb-6">🤖 AI-Powered Recommendations</h2>
      <div v-if="store.loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <div v-else-if="store.error" class="alert alert-error">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FoodCard v-for="recipe in store.aiRecommendations" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <!-- All Recipes Section -->
    <section>
      <h2 class="text-2xl font-bold mb-6">All Recipes</h2>
      <div v-if="store.loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <div v-else-if="store.error" class="alert alert-error">
        {{ store.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FoodCard v-for="recipe in store.recipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
}
</style>
