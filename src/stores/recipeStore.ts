import { defineStore } from 'pinia'
import type { Recipe } from '@/types/recipe'
import type { RecipeState, RecipeGetters, RecipeActions } from '@/types/store'

const API_URL = 'https://dummyjson.com/recipes'

export const useRecipeStore = defineStore<'recipe', RecipeState, RecipeGetters, RecipeActions>(
  'recipe',
  {
    state: () => ({
      recipes: [],
      selectedCuisine: '',
      selectedMealType: '',
      selectedDifficulty: '',
      searchTerm: '',
      sortBy: 'rating-high',
    }),

    getters: {
      filteredRecipes(state): Recipe[] {
        let filtered = [...state.recipes]

        // Apply filters
        if (state.selectedCuisine) {
          filtered = filtered.filter((recipe) => recipe.cuisine === state.selectedCuisine)
        }

        if (state.selectedMealType) {
          filtered = filtered.filter((recipe) => recipe.mealType.includes(state.selectedMealType))
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

        // Apply sorting
        switch (state.sortBy) {
          case 'rating-high':
            filtered.sort((a, b) => b.rating - a.rating)
            break
          case 'rating-low':
            filtered.sort((a, b) => a.rating - b.rating)
            break
          case 'reviews-high':
            filtered.sort((a, b) => b.reviewCount - a.reviewCount)
            break
          case 'reviews-low':
            filtered.sort((a, b) => a.reviewCount - b.reviewCount)
            break
          case 'calories-high':
            filtered.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing)
            break
          case 'calories-low':
            filtered.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing)
            break
        }

        return filtered
      },

      aiRecommendations(state): Recipe[] {
        // Get recipes with high ratings and review counts
        return [...state.recipes]
          .sort((a, b) => {
            const scoreA = a.rating * Math.log10(a.reviewCount + 1)
            const scoreB = b.rating * Math.log10(b.reviewCount + 1)
            return scoreB - scoreA
          })
          .slice(0, 4) // Get top 4 recommendations
      },
    },

    actions: {
      async fetchRecipes() {
        try {
          const response = await fetch(API_URL)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const data = await response.json()
          this.recipes = data.recipes
        } catch (error) {
          console.error('Error fetching recipes:', error)
          this.recipes = []
        }
      },

      async searchRecipes(term: string) {
        try {
          const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(term)}`)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const data = await response.json()
          this.recipes = data.recipes
          this.searchTerm = term
        } catch (error) {
          console.error('Error searching recipes:', error)
        }
      },

      async getRecipeById(id: string) {
        try {
          const response = await fetch(`${API_URL}/${id}`)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const recipe = await response.json()
          return recipe
        } catch (error) {
          console.error('Error fetching recipe:', error)
          return undefined
        }
      },

      setSearchTerm(term: string) {
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

      calculatePrice(calories: number): number {
        const priceInDollars = (calories / 100) * 2.5
        return Math.round(priceInDollars * 83)
      },
    },
  },
)
