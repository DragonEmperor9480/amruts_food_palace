<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRecipeStore } from '@/stores/recipeStore'
import SearchBar from './SearchBar.vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const store = useRecipeStore()
const activeSort = ref('rating-high')
const showMobileSearch = ref(false)
const isCartOpen = ref(false)
const isFilterOpen = ref(false)
const router = useRouter()

// Initialize filters with default values
const filters = ref({
  cuisine: '',
  mealType: '',
  difficulty: '',
  maxPrice: 100,
})

// Initialize availableFilters with empty arrays
const availableFilters = ref({
  cuisines: [] as string[],
  mealTypes: [] as string[],
  difficulties: [] as string[],
})

const handleSort = (sortId: string) => {
  console.log('Sorting by:', sortId) // Debug log
  activeSort.value = sortId
  store.sortRecipes(sortId)
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
}

const initializeFilters = () => {
  const cuisineSet = new Set<string>()
  const mealTypeSet = new Set<string>()
  const difficultySet = new Set<string>()

  store.recipes.forEach((recipe) => {
    if (recipe.cuisine) cuisineSet.add(recipe.cuisine)
    if (recipe.mealType) {
      recipe.mealType.forEach((type) => mealTypeSet.add(type))
    }
    if (recipe.difficulty) difficultySet.add(recipe.difficulty)
  })

  availableFilters.value = {
    cuisines: Array.from(cuisineSet).sort(),
    mealTypes: Array.from(mealTypeSet).sort(),
    difficulties: Array.from(difficultySet).sort(),
  }
}

const resetFilters = () => {
  filters.value = {
    cuisine: '',
    mealType: '',
    difficulty: '',
    maxPrice: 100,
  }
  store.resetFilters()
  isFilterOpen.value = false
}

const applyFilters = () => {
  store.applyFilters(filters.value)
  isFilterOpen.value = false
}

// Initialize filters when recipes are loaded
watch(
  () => store.recipes,
  (newRecipes) => {
    if (newRecipes.length > 0) {
      initializeFilters()
    }
  },
  { immediate: true },
)

// Initial sort on component mount
onMounted(() => {
  handleSort('rating-high')
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleOutsideClick = (event: MouseEvent) => {
  const filterContent = document.querySelector('.filter-content')
  if (filterContent && !filterContent.contains(event.target as Node)) {
    isFilterOpen.value = false
  }
}

// Close filter modal on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFilterOpen.value) {
    isFilterOpen.value = false
  }
}

const resetAllFilters = () => {
  // Reset all filters in the store
  store.resetFilters()
  // Reset search if it exists
  if (store.setSearchTerm) {
    store.setSearchTerm('')
  }
}

const resetAndGoHome = async () => {
  // Reset all filters
  store.resetFilters()

  // Navigate to home page
  if (router.currentRoute.value.path !== '/') {
    await router.push('/')
  }

  // Force a re-render of the home page without full refresh
  store.$reset()
  await router.replace({ path: '/', force: true })
}
</script>

<template>
  <!-- Main Navbar -->
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a
            class="btn btn-ghost text-xl text-primary hover:bg-primary/5"
            @click="resetAndGoHome"
            style="cursor: pointer"
          >
            Amrut's Food Palace
          </a>
        </div>

        <!-- Desktop Search Bar -->
        <div class="hidden lg:flex flex-1 justify-center px-8">
          <SearchBar />
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-3">
          <!-- Sort Buttons -->
          <div class="flex-none hidden lg:flex items-center gap-2">
            <button
              class="btn btn-sm"
              :class="
                activeSort === 'rating-high'
                  ? 'btn-primary text-white'
                  : 'btn-ghost text-neutral-600'
              "
              @click="handleSort('rating-high')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Top Rated
            </button>
            <button
              class="btn btn-sm"
              :class="
                activeSort === 'price-high'
                  ? 'btn-primary text-white'
                  : 'btn-ghost text-neutral-600'
              "
              @click="handleSort('price-high')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7l4-4m0 0l4 4m-4-4v18"
                />
              </svg>
              Price: High to Low
            </button>
            <button
              class="btn btn-sm"
              :class="
                activeSort === 'price-low' ? 'btn-primary text-white' : 'btn-ghost text-neutral-600'
              "
              @click="handleSort('price-low')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 17l-4 4m0 0l-4-4m4 4V3"
                />
              </svg>
              Price: Low to High
            </button>
          </div>

          <!-- Filter Button -->
          <div class="relative">
            <button
              @click="isFilterOpen = true"
              class="btn btn-ghost text-neutral-700 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>

            <!-- Filter Modal -->
            <Teleport to="body">
              <div
                v-if="isFilterOpen"
                class="fixed inset-0 z-50 overflow-hidden"
                @click="handleOutsideClick"
                aria-labelledby="filter-title"
                role="dialog"
                aria-modal="true"
              >
                <!-- Background overlay -->
                <div class="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity"></div>

                <!-- Filter panel -->
                <div class="fixed inset-0 overflow-y-auto">
                  <div class="flex min-h-full items-center justify-center p-4">
                    <div
                      class="filter-content relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
                      @click.stop
                    >
                      <div class="bg-white px-6 py-6">
                        <div class="flex justify-between items-center border-b pb-4 mb-6">
                          <h3 class="text-lg font-semibold text-primary">Filters</h3>
                          <button
                            @click="isFilterOpen = false"
                            class="btn btn-ghost btn-sm btn-circle hover:bg-neutral-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <!-- Cuisine Filter -->
                        <div class="form-control mb-4">
                          <label class="label">
                            <span class="label-text text-neutral-800 font-medium"
                              >Cuisine Type</span
                            >
                          </label>
                          <select
                            v-model="filters.cuisine"
                            class="select select-bordered w-full bg-white text-neutral-700 hover:border-primary focus:border-primary"
                          >
                            <option value="" class="text-neutral-700">All Cuisines</option>
                            <option
                              v-for="cuisine in availableFilters.cuisines"
                              :key="cuisine"
                              :value="cuisine"
                              class="text-neutral-700"
                            >
                              {{ cuisine }}
                            </option>
                          </select>
                        </div>

                        <!-- Meal Type Filter -->
                        <div class="form-control mb-4">
                          <label class="label">
                            <span class="label-text text-neutral-800 font-medium">Meal Type</span>
                          </label>
                          <select
                            v-model="filters.mealType"
                            class="select select-bordered w-full bg-white text-neutral-700 hover:border-primary focus:border-primary"
                          >
                            <option value="" class="text-neutral-700">All Meal Types</option>
                            <option
                              v-for="type in availableFilters.mealTypes"
                              :key="type"
                              :value="type"
                              class="text-neutral-700"
                            >
                              {{ type }}
                            </option>
                          </select>
                        </div>

                        <!-- Difficulty Filter -->
                        <div class="form-control mb-4">
                          <label class="label">
                            <span class="label-text text-neutral-800 font-medium"
                              >Difficulty Level</span
                            >
                          </label>
                          <select
                            v-model="filters.difficulty"
                            class="select select-bordered w-full bg-white text-neutral-700 hover:border-primary focus:border-primary"
                          >
                            <option value="" class="text-neutral-700">All Difficulties</option>
                            <option
                              v-for="level in availableFilters.difficulties"
                              :key="level"
                              :value="level"
                              class="text-neutral-700"
                            >
                              {{ level }}
                            </option>
                          </select>
                        </div>

                        <!-- Price Range Filter -->
                        <div class="form-control mb-6">
                          <label class="label">
                            <span class="label-text text-neutral-800 font-medium">
                              Max Price: ₹{{ filters.maxPrice * 83 }}
                            </span>
                          </label>
                          <input
                            type="range"
                            v-model="filters.maxPrice"
                            min="0"
                            max="100"
                            class="range range-primary"
                            step="5"
                          />
                          <div
                            class="w-full flex justify-between text-xs px-2 mt-1 text-neutral-600"
                          >
                            <span>₹0</span>
                            <span>₹4,150</span>
                            <span>₹8,300</span>
                          </div>
                        </div>

                        <!-- Filter Actions -->
                        <div class="flex justify-end gap-2 pt-4 border-t">
                          <button
                            @click="resetFilters"
                            class="btn btn-ghost text-neutral-700 hover:bg-neutral-100"
                          >
                            Reset
                          </button>
                          <button
                            @click="
                              () => {
                                applyFilters()
                                isFilterOpen = false
                              }
                            "
                            class="btn bg-primary hover:bg-primary/90 text-white border-0"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- Cart Button -->
          <router-link
            to="/cart"
            class="btn btn-ghost btn-circle text-neutral-700 hover:text-primary"
          >
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="badge badge-sm indicator-item bg-primary border-0 text-white">
                {{ cart.totalItems }}
              </span>
            </div>
          </router-link>
        </div>

        <!-- Mobile Navigation -->
        <div class="flex lg:hidden items-center gap-2">
          <button @click="toggleMobileSearch" class="btn btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button @click="toggleCart" class="btn btn-ghost btn-sm text-primary relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="badge badge-sm badge-primary text-white absolute -top-2 -right-2">
              {{ cart.totalItems }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-show="showMobileSearch" class="lg:hidden py-2 border-t">
        <SearchBar />
      </div>
    </nav>
  </header>

  <!-- Cart Sidebar -->
  <div v-if="isCartOpen" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="isCartOpen = false"></div>

    <!-- Cart Content -->
    <div class="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold text-neutral-800">Shopping Cart</h2>
        <button @click="isCartOpen = false" class="btn btn-ghost btn-sm btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <!-- Add your cart content here -->
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-16"></div>
</template>

<style scoped>
.container {
  max-width: 1440px;
}

.btn-sm {
  @apply h-9 min-h-0;
}

/* Transition for mobile search */
.mobile-search-enter-active,
.mobile-search-leave-active {
  transition: all 0.3s ease;
}

.mobile-search-enter-from,
.mobile-search-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Add these new styles */
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

/* Add these styles */
.select option {
  color: #374151; /* text-neutral-700 */
  background-color: white;
  padding: 8px;
}

.select:focus {
  outline: none;
  border-color: var(--primary);
}

.label-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.range-primary::-webkit-slider-thumb {
  background: var(--primary);
}

.range-primary::-moz-range-thumb {
  background: var(--primary);
}

.filter-content {
  pointer-events: auto;
}

.select option {
  padding: 8px;
}
</style>
