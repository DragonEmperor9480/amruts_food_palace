<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRecipeStore } from '@/stores/recipeStore'
import CartDrawer from './CartDrawer.vue'
import SearchBar from './SearchBar.vue'
import FilterMenu from './FilterMenu.vue'

const cart = useCartStore()
const store = useRecipeStore()
const activeSort = ref('rating-high')

const handleSort = (sortId: string) => {
  activeSort.value = sortId
  store.sortRecipes(sortId)
}
</script>

<template>
  <CartDrawer>
    <div class="navbar bg-white shadow-lg w-screen px-4">
      <!-- Logo -->
      <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl text-primary font-bold">
          Amrut's Food Palace
        </a>
      </div>

      <!-- Center Section -->
      <div class="navbar-center flex-1 lg:flex items-center justify-center gap-4">
        <!-- Sort Buttons -->
        <div class="hidden lg:flex items-center gap-2">
          <button
            class="btn btn-sm"
            :class="
              activeSort === 'rating-high' ? 'btn-primary text-white' : 'btn-ghost text-neutral-600'
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
              activeSort === 'price-high' ? 'btn-primary text-white' : 'btn-ghost text-neutral-600'
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

        <!-- Search Bar -->
        <SearchBar class="max-w-sm hidden lg:flex" />
      </div>

      <!-- Right Section -->
      <div class="navbar-end gap-2">
        <!-- Filter Menu -->
        <FilterMenu />

        <!-- Mobile Search Toggle -->
        <button class="btn btn-ghost btn-circle lg:hidden">
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

        <!-- Cart Button -->
        <label for="cart-drawer" class="btn btn-ghost btn-circle text-primary drawer-button">
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
            <span class="badge badge-sm indicator-item bg-primary text-white">
              {{ cart.totalItems }}
            </span>
          </div>
        </label>
      </div>
    </div>

    <!-- Mobile Search (Shown below navbar on mobile) -->
    <div class="lg:hidden w-full bg-white px-4 py-2 shadow-md">
      <SearchBar />
    </div>
  </CartDrawer>
</template>

<style scoped>
.navbar {
  @apply sticky top-0 z-40 h-16;
  margin: 0;
  left: 0;
  right: 0;
}

.btn-sm {
  @apply h-9 min-h-0;
}
</style>
