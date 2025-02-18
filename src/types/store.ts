import type { Recipe } from './recipe'

export interface RecipeState {
  recipes: Recipe[]
  selectedCuisine: string
  selectedMealType: string
  selectedDifficulty: string
  searchTerm: string
  sortBy: string
}

export interface RecipeGetters {
  filteredRecipes: Recipe[]
  aiRecommendations: Recipe[]
}

export interface RecipeActions {
  fetchRecipes: () => Promise<void>
  setSearchTerm: (term: string) => void
  searchRecipes: (term: string) => void
  applyFilters: (cuisine: string, mealType: string, difficulty: string) => void
  resetFilters: () => void
  sortRecipes: (sortType: string) => void
  getRecipeById: (id: string) => Recipe | undefined
  calculatePrice: (calories: number) => number
}
