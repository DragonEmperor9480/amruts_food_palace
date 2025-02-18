<script setup lang="ts">
import FoodCard from '@/components/FoodCard.vue'

// Test data
const testRecipe = {
  id: 1,
  name: 'Classic Margherita Pizza',
  ingredients: ['Pizza dough', 'Tomato sauce', 'Fresh mozzarella cheese'],
  instructions: ['Preheat oven', 'Prepare pizza', 'Bake'],
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  servings: 4,
  difficulty: 'Easy',
  cuisine: 'Italian',
  caloriesPerServing: 300,
  tags: ['Pizza', 'Italian'],
  userId: 166,
  image: 'https://cdn.dummyjson.com/recipe-images/1.webp',
  rating: 4.6,
  reviewCount: 98,
  mealType: ['Dinner'],
}
</script>

<template>
  <div class="flex justify-center items-center">
    <FoodCard :recipe="testRecipe" />
  </div>
</template>
