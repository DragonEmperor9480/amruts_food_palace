import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/types/recipe'

interface Filters {
  cuisine: string
  mealType: string
  difficulty: string
  maxPrice: number
}

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: ref<Recipe[]>([]),
    filteredRecipes: ref<Recipe[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
    selectedCuisine: '',
    selectedMealType: '',
    selectedDifficulty: '',
    searchTerm: '',
    sortBy: 'rating-high',
  }),

  actions: {
    setSearchTerm(term: string) {
      this.searchTerm = term
    },

    resetFilters() {
      this.selectedCuisine = ''
      this.selectedMealType = ''
      this.selectedDifficulty = ''
      this.searchTerm = ''
      this.sortBy = 'rating-high'
      this.filteredRecipes = [...this.recipes]
    },

    // Calculate price from calories
    calculatePrice(calories: number): number {
      // Base price in dollars = calories/100 * 2.5
      const priceInDollars = (calories / 100) * 2.5
      // Convert to rupees (1 USD = 83 INR approximately)
      const priceInRupees = priceInDollars * 83
      return Math.round(priceInRupees)
    },

    // Sort recipes function
    sortRecipes(sortType: string) {
      console.log('Sorting recipes by:', sortType) // Debug log

      // Make a copy of the current recipes
      const recipesToSort =
        this.filteredRecipes.length > 0 ? [...this.filteredRecipes] : [...this.recipes]

      switch (sortType) {
        case 'rating-high':
          recipesToSort.sort((a, b) => b.rating - a.rating)
          break
        case 'price-high':
          recipesToSort.sort(
            (a, b) =>
              this.calculatePrice(b.caloriesPerServing) - this.calculatePrice(a.caloriesPerServing),
          )
          break
        case 'price-low':
          recipesToSort.sort(
            (a, b) =>
              this.calculatePrice(a.caloriesPerServing) - this.calculatePrice(b.caloriesPerServing),
          )
          break
        default:
          console.warn('Unknown sort type:', sortType)
          return
      }

      // Update filteredRecipes with the sorted results
      this.filteredRecipes = recipesToSort
      console.log('Sorted recipes:', this.filteredRecipes) // Debug log
    },

    // Apply filters
    applyFilters(filters: Filters) {
      // Start with all recipes
      let result = [...this.recipes]

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
          (recipe) => this.calculatePrice(recipe.caloriesPerServing) <= filters.maxPrice,
        )
      }

      // Update filteredRecipes with the filtered results
      this.filteredRecipes = result
    },

    // Fetch all recipes
    async fetchRecipes() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://dummyjson.com/recipes')
        const data = await response.json()
        this.recipes = data.recipes
        this.filteredRecipes = data.recipes // Initialize filtered recipes with all recipes
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to fetch recipes'
      } finally {
        this.loading = false
      }
    },

    // Search recipes
    async searchRecipes(query: string) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${query}`)
        const data = await response.json()
        this.recipes = data.recipes
        this.filteredRecipes = data.recipes
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to search recipes'
      } finally {
        this.loading = false
      }
    },
  },

  // Computed property for displaying recipes
  get displayRecipes() {
    return this.filteredRecipes
  },
})
