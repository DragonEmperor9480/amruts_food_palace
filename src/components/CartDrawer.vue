<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()

const formatPrice = (calories: number) => {
  return ((calories / 100) * 2.5).toFixed(2)
}
</script>

<template>
  <div class="drawer drawer-end">
    <input id="cart-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <label for="cart-drawer" class="drawer-button">
        <slot></slot>
      </label>
    </div>
    <div class="drawer-side z-50">
      <label for="cart-drawer" class="drawer-overlay"></label>
      <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-primary">Your Cart</h2>
          <button
            class="btn btn-ghost btn-sm text-error"
            @click="cart.clearCart()"
            v-if="cart.items.length"
          >
            Clear Cart
          </button>
        </div>

        <div v-if="cart.items.length === 0" class="text-center py-8">
          <p class="text-neutral-500">Your cart is empty</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.recipe.id"
            class="card card-compact bg-base-100 shadow-md"
          >
            <div class="card-body">
              <div class="flex gap-2">
                <img
                  :src="item.recipe.image"
                  :alt="item.recipe.name"
                  class="w-20 h-20 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-primary">{{ item.recipe.name }}</h3>
                  <p class="text-sm text-neutral-600">
                    ${{ formatPrice(item.recipe.caloriesPerServing) }} each
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      class="btn btn-xs btn-circle btn-primary text-white"
                      @click="cart.updateQuantity(item.recipe.id, item.quantity - 1)"
                    >
                      -
                    </button>
                    <span class="text-sm font-medium">{{ item.quantity }}</span>
                    <button
                      class="btn btn-xs btn-circle btn-primary text-white"
                      @click="cart.updateQuantity(item.recipe.id, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  class="btn btn-ghost btn-sm text-error"
                  @click="cart.removeFromCart(item.recipe.id)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span class="text-primary">${{ cart.totalPrice }}</span>
          </div>

          <button class="btn btn-primary w-full text-white">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>
