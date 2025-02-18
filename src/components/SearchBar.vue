<script setup lang="ts">
import { ref } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'

const searchQuery = ref('')
const store = useRecipeStore()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    store.searchRecipes(searchQuery.value)
  } else {
    store.fetchRecipes()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  store.fetchRecipes()
}
</script>

<template>
  <div class="form-control w-full max-w-md">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Search recipes..."
        class="input w-full pl-12 pr-4 bg-neutral-50 border-neutral-200 focus:border-primary text-neutral-800 placeholder:text-neutral-400 rounded-full"
      />
      <button
        @click="handleSearch"
        class="absolute left-0 top-0 h-full px-4 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors"
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
  </div>
</template>

<style scoped>
.input {
  @apply transition-all duration-200 ease-in-out;
  @apply focus:ring-2 focus:ring-primary/20 focus:outline-none;
}

.input:hover {
  @apply border-primary/50;
}
</style>
