import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe, RecipeResponse } from '@/types/recipe'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed property for AI recommendations (top rated recipes)
  const aiRecommendations = computed(() => {
    return [...recipes.value].sort((a, b) => b.rating - a.rating).slice(0, 4)
  })

  // Fetch all recipes
  async function fetchRecipes() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://dummyjson.com/recipes')
      const data: RecipeResponse = await response.json()
      recipes.value = data.recipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipes'
    } finally {
      loading.value = false
    }
  }

  // Search recipes
  async function searchRecipes(query: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`https://dummyjson.com/recipes/search?q=${query}`)
      const data: RecipeResponse = await response.json()
      recipes.value = data.recipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search recipes'
    } finally {
      loading.value = false
    }
  }

  // Sort recipes
  function sortRecipes(sortBy: string) {
    switch (sortBy) {
      case 'rating-high':
        recipes.value.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        recipes.value.sort((a, b) => a.rating - b.rating)
        break
      case 'price-high':
        recipes.value.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing)
        break
      case 'price-low':
        recipes.value.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing)
        break
    }
  }

  return {
    recipes,
    loading,
    error,
    aiRecommendations,
    fetchRecipes,
    searchRecipes,
    sortRecipes,
  }
})
