<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'

const store = useRecipeStore()

const filters = ref({
  cuisines: [] as string[],
  mealTypes: [] as string[],
  difficulties: [] as string[],
  priceRange: [0, 100] as [number, number],
})

const selectedFilters = ref({
  cuisine: '',
  mealType: '',
  difficulty: '',
  maxPrice: 100,
})

// Initialize filters from available recipes
const initializeFilters = () => {
  const cuisineSet = new Set<string>()
  const mealTypeSet = new Set<string>()
  const difficultySet = new Set<string>()

  store.recipes.forEach((recipe) => {
    cuisineSet.add(recipe.cuisine)
    recipe.mealType.forEach((type) => mealTypeSet.add(type))
    difficultySet.add(recipe.difficulty)
  })

  filters.value.cuisines = Array.from(cuisineSet)
  filters.value.mealTypes = Array.from(mealTypeSet)
  filters.value.difficulties = Array.from(difficultySet)
}

// Watch for filter changes
watch(
  selectedFilters,
  (newFilters) => {
    store.applyFilters(newFilters)
  },
  { deep: true },
)

// Reset filters
const resetFilters = () => {
  selectedFilters.value = {
    cuisine: '',
    mealType: '',
    difficulty: '',
    maxPrice: 100,
  }
  store.resetFilters()
}

// Initialize filters when recipes are loaded
watch(() => store.recipes, initializeFilters, { immediate: true })
</script>

<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost m-1 text-neutral-700 font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
      Filters
    </label>

    <div
      tabindex="0"
      class="dropdown-content z-[1] card card-compact w-96 p-2 shadow-xl bg-white mt-2"
    >
      <div class="card-body">
        <!-- Cuisine Filter -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium text-neutral-700">Cuisine</span>
          </label>
          <select v-model="selectedFilters.cuisine" class="select select-bordered w-full">
            <option value="">All Cuisines</option>
            <option v-for="cuisine in filters.cuisines" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>
        </div>

        <!-- Meal Type Filter -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium text-neutral-700">Meal Type</span>
          </label>
          <select v-model="selectedFilters.mealType" class="select select-bordered w-full">
            <option value="">All Meal Types</option>
            <option v-for="type in filters.mealTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Difficulty Filter -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium text-neutral-700">Difficulty</span>
          </label>
          <select v-model="selectedFilters.difficulty" class="select select-bordered w-full">
            <option value="">All Difficulties</option>
            <option
              v-for="difficulty in filters.difficulties"
              :key="difficulty"
              :value="difficulty"
            >
              {{ difficulty }}
            </option>
          </select>
        </div>

        <!-- Price Range Filter -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-medium text-neutral-700">
              Max Price: ${{ selectedFilters.maxPrice }}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            v-model="selectedFilters.maxPrice"
            class="range range-primary"
            step="5"
          />
          <div class="w-full flex justify-between text-xs text-neutral-500 px-2">
            <span>$0</span>
            <span>$50</span>
            <span>$100</span>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-ghost text-neutral-600 hover:bg-neutral-100">Reset</button>
          <button class="btn btn-primary text-white hover:bg-primary/90">Apply Filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  @apply bg-white;
}

.select,
.range {
  @apply bg-white border-neutral-300;
}

.select:focus,
.range:focus {
  @apply border-primary;
}

.label-text {
  @apply text-neutral-700;
}

.range-primary {
  @apply bg-neutral-200;
}

.range-primary::-webkit-slider-thumb {
  @apply bg-primary;
}
</style>
