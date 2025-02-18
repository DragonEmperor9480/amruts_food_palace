import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/types/recipe'

interface CartItem {
  recipe: Recipe
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value
      .reduce((total, item) => {
        const price = (item.recipe.caloriesPerServing / 100) * 2.5
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  })

  function addToCart(recipe: Recipe, quantity: number) {
    const existingItem = items.value.find((item) => item.recipe.id === recipe.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ recipe, quantity })
    }
  }

  function removeFromCart(recipeId: number) {
    items.value = items.value.filter((item) => item.recipe.id !== recipeId)
  }

  function updateQuantity(recipeId: number, quantity: number) {
    const item = items.value.find((item) => item.recipe.id === recipeId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(recipeId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
