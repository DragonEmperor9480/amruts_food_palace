import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/types/recipe'

interface Filters {
  cuisine: string
  mealType: string
  difficulty: string
  maxPrice: number
}

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const filteredRecipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Calculate price from calories
  const calculatePrice = (calories: number) => (calories / 100) * 2.5

  // Computed property for AI recommendations
  const aiRecommendations = computed(() => {
    return [...(filteredRecipes.value.length ? filteredRecipes.value : recipes.value)]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
  })

  // Fetch all recipes
  async function fetchRecipes() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://dummyjson.com/recipes')
      const data = await response.json()
      recipes.value = data.recipes
      filteredRecipes.value = data.recipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipes'
    } finally {
      loading.value = false
    }
  }

  // Apply filters
  function applyFilters(filters: Filters) {
    filteredRecipes.value = recipes.value.filter((recipe) => {
      const priceMatch = calculatePrice(recipe.caloriesPerServing) <= filters.maxPrice
      const cuisineMatch = !filters.cuisine || recipe.cuisine === filters.cuisine
      const mealTypeMatch = !filters.mealType || recipe.mealType.includes(filters.mealType)
      const difficultyMatch = !filters.difficulty || recipe.difficulty === filters.difficulty

      return priceMatch && cuisineMatch && mealTypeMatch && difficultyMatch
    })
  }

  // Reset filters
  function resetFilters() {
    filteredRecipes.value = recipes.value
  }

  // Search recipes
  async function searchRecipes(query: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`https://dummyjson.com/recipes/search?q=${query}`)
      const data = await response.json()
      recipes.value = data.recipes
      filteredRecipes.value = data.recipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search recipes'
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    filteredRecipes,
    loading,
    error,
    aiRecommendations,
    fetchRecipes,
    searchRecipes,
    applyFilters,
    resetFilters,
  }
})
