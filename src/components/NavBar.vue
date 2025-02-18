<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRecipeStore } from '@/stores/recipeStore'
import CartDrawer from './CartDrawer.vue'
import SearchBar from './SearchBar.vue'

const cart = useCartStore()
const recipeStore = useRecipeStore()

const sortOptions = ref([
  { id: 'rating-high', name: 'Rating: High to Low' },
  { id: 'rating-low', name: 'Rating: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'price-low', name: 'Price: Low to High' },
])

const handleSort = (sortId: string) => {
  recipeStore.sortRecipes(sortId)
}
</script>

<template>
  <CartDrawer>
    <div class="navbar bg-base-100 shadow-lg w-screen px-4">
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Home</a></li>
            <li><a>Menu</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
        <a class="btn btn-ghost normal-case text-xl text-primary">Amrut's Food Palace</a>
      </div>

      <div class="navbar-center flex-none lg:flex items-center gap-2">
        <ul class="menu menu-horizontal px-1 hidden lg:flex">
          <li><a>Home</a></li>
          <li><a>Menu</a></li>
          <li><a>About</a></li>
        </ul>
        <SearchBar class="max-w-sm" />
      </div>

      <div class="navbar-end gap-2">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            Sort By
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="option in sortOptions" :key="option.id">
              <a @click="handleSort(option.id)">{{ option.name }}</a>
            </li>
          </ul>
        </div>

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
  </CartDrawer>
</template>

<style scoped>
.navbar {
  @apply sticky top-0 z-40 h-16;
  margin: 0;
  left: 0;
  right: 0;
}

.menu-horizontal {
  @apply mx-4;
}

.menu-horizontal > li > a {
  @apply px-4;
}
</style>
