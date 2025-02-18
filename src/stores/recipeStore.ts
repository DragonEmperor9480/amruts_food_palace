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
  function calculatePrice(calories: number): number {
    // Base price in dollars = calories/100 * 2.5
    const priceInDollars = (calories / 100) * 2.5
    // Convert to rupees (1 USD = 83 INR approximately)
    const priceInRupees = priceInDollars * 83
    return Math.round(priceInRupees)
  }

  // Sort recipes function
  function sortRecipes(sortType: string) {
    console.log('Sorting recipes by:', sortType) // Debug log

    // Make a copy of the current recipes
    const recipesToSort =
      filteredRecipes.value.length > 0 ? [...filteredRecipes.value] : [...recipes.value]

    switch (sortType) {
      case 'rating-high':
        recipesToSort.sort((a, b) => b.rating - a.rating)
        break
      case 'price-high':
        recipesToSort.sort(
          (a, b) => calculatePrice(b.caloriesPerServing) - calculatePrice(a.caloriesPerServing),
        )
        break
      case 'price-low':
        recipesToSort.sort(
          (a, b) => calculatePrice(a.caloriesPerServing) - calculatePrice(b.caloriesPerServing),
        )
        break
      default:
        console.warn('Unknown sort type:', sortType)
        return
    }

    // Update filteredRecipes with the sorted results
    filteredRecipes.value = recipesToSort
    console.log('Sorted recipes:', filteredRecipes.value) // Debug log
  }

  // Apply filters
  function applyFilters(filters: Filters) {
    // Start with all recipes
    let result = [...recipes.value]

    // Apply each filter if it's set
    if (filters.cuisine) {
      result = result.filter((recipe) => recipe.cuisine === filters.cuisine)
    }

    if (filters.mealType) {
      result = result.filter((recipe) => recipe.mealType.includes(filters.mealType))
    }

    if (filters.difficulty) {
      result = result.filter((recipe) => recipe.difficulty === filters.difficulty)
    }

    if (filters.maxPrice) {
      result = result.filter(
        (recipe) => calculatePrice(recipe.caloriesPerServing) <= filters.maxPrice,
      )
    }

    // Update filteredRecipes with the filtered results
    filteredRecipes.value = result
  }

  // Reset filters
  function resetFilters() {
    filteredRecipes.value = [...recipes.value]
  }

  // Fetch all recipes
  async function fetchRecipes() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://dummyjson.com/recipes')
      const data = await response.json()
      recipes.value = data.recipes
      filteredRecipes.value = data.recipes // Initialize filtered recipes with all recipes
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
      const data = await response.json()
      recipes.value = data.recipes
      filteredRecipes.value = data.recipes
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search recipes'
    } finally {
      loading.value = false
    }
  }

  // Computed property for displaying recipes
  const displayRecipes = computed(() => {
    return filteredRecipes.value
  })

  return {
    recipes,
    filteredRecipes: displayRecipes, // Export the computed property
    loading,
    error,
    fetchRecipes,
    searchRecipes,
    applyFilters,
    resetFilters,
    calculatePrice,
    sortRecipes,
  }
})
