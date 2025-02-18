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
    recipes: [] as Recipe[],
    filteredRecipes: ref<Recipe[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
    selectedCuisine: '',
    selectedMealType: '',
    selectedDifficulty: '',
    searchTerm: '',
    sortBy: 'rating-high',
  }),

  getters: {
    filteredRecipes: (state): Recipe[] => {
      let filtered = [...state.recipes]

      if (state.selectedCuisine) {
        filtered = filtered.filter((recipe) => recipe.cuisine === state.selectedCuisine)
      }

      if (state.selectedMealType) {
        filtered = filtered.filter((recipe) => recipe.mealType === state.selectedMealType)
      }

      if (state.selectedDifficulty) {
        filtered = filtered.filter((recipe) => recipe.difficulty === state.selectedDifficulty)
      }

      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (recipe) =>
            recipe.name.toLowerCase().includes(searchLower) ||
            recipe.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
      }

      return filtered
    },

    aiRecommendations: (state): Recipe[] => {
      return state.recipes.filter((recipe) => recipe.rating >= 4.5).slice(0, 5)
    },
  },

  actions: {
    async fetchRecipes() {
      try {
        const response = await fetch('/data/recipes.json')
        const data = await response.json()
        this.recipes = data
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    },

    setSearchTerm(term: string) {
      this.searchTerm = term
    },

    searchRecipes(term: string) {
      this.searchTerm = term
    },

    applyFilters(cuisine: string, mealType: string, difficulty: string) {
      this.selectedCuisine = cuisine
      this.selectedMealType = mealType
      this.selectedDifficulty = difficulty
    },

    resetFilters() {
      this.selectedCuisine = ''
      this.selectedMealType = ''
      this.selectedDifficulty = ''
      this.searchTerm = ''
      this.sortBy = 'rating-high'
    },

    sortRecipes(sortType: string) {
      this.sortBy = sortType
    },

    getRecipeById(id: string): Recipe | undefined {
      return this.recipes.find((recipe) => recipe.id.toString() === id)
    },

    calculatePrice(calories: number): number {
      const priceInDollars = (calories / 100) * 2.5
      return Math.round(priceInDollars * 83)
    },
  },

  // Computed property for displaying recipes
  get displayRecipes() {
    return this.filteredRecipes
  },
})
