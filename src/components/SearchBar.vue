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
</script>

<template>
  <div class="form-control">
    <div class="input-group">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Search recipes..."
        class="input input-bordered w-full max-w-xs focus:outline-none focus:border-primary"
      />
      <button class="btn btn-primary text-white" @click="handleSearch">
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
    </div>
  </div>
</template>

<style scoped>
.input-group {
  @apply bg-white rounded-lg overflow-hidden;
}

.input {
  @apply text-neutral-800;
}

.input::placeholder {
  @apply text-neutral-400;
}
</style>
