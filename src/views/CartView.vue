<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

const updateQuantity = (recipeId: number, newQuantity: number) => {
  cart.updateQuantity(recipeId, newQuantity)
}

const removeItem = (recipeId: number) => {
  cart.removeFromCart(recipeId)
}

const continueShopping = () => {
  router.push('/')
}

const checkout = () => {
  // Implement checkout logic
  console.log('Proceeding to checkout...')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items Section -->
      <div class="lg:w-2/3">
        <h1 class="text-2xl font-bold text-neutral-800 mb-6">Shopping Cart</h1>

        <!-- Empty Cart Message -->
        <div v-if="cart.items.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto text-neutral-300 mb-4"
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
          <p class="text-neutral-600 text-lg mb-4">Your cart is empty</p>
          <button
            @click="continueShopping"
            class="btn bg-primary hover:bg-primary/90 text-white border-0"
          >
            Continue Shopping
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.recipe.id"
            class="bg-white rounded-lg shadow p-4 flex items-center gap-4"
          >
            <!-- Item Image -->
            <img
              :src="item.recipe.image"
              :alt="item.recipe.name"
              class="w-24 h-24 object-cover rounded-lg"
            />

            <!-- Item Details -->
            <div class="flex-1">
              <h3 class="font-semibold text-lg text-neutral-800">{{ item.recipe.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <span class="badge badge-ghost">{{ item.recipe.cuisine }}</span>
                <span>•</span>
                <span>{{ item.recipe.difficulty }}</span>
              </div>
              <div class="text-primary font-bold mt-1">
                ${{ ((item.recipe.caloriesPerServing / 100) * 2.5).toFixed(2) }}
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-2">
              <button
                class="btn btn-circle btn-sm bg-primary hover:bg-primary/90 text-white border-0"
                @click="updateQuantity(item.recipe.id, item.quantity - 1)"
              >
                -
              </button>
              <span class="text-lg font-semibold text-neutral-800 w-8 text-center">
                {{ item.quantity }}
              </span>
              <button
                class="btn btn-circle btn-sm bg-primary hover:bg-primary/90 text-white border-0"
                @click="updateQuantity(item.recipe.id, item.quantity + 1)"
              >
                +
              </button>
            </div>

            <!-- Remove Button -->
            <button
              @click="removeItem(item.recipe.id)"
              class="btn btn-ghost btn-circle text-neutral-400 hover:text-red-500"
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
      </div>

      <!-- Order Summary Section -->
      <div class="lg:w-1/3">
        <div class="bg-white rounded-lg shadow p-6 sticky top-24">
          <h2 class="text-xl font-bold text-neutral-800 mb-4">Order Summary</h2>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>${{ cart.totalPrice }}</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Tax</span>
              <span>${{ (Number(cart.totalPrice) * 0.1).toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3 mt-3">
              <div class="flex justify-between font-bold text-lg text-neutral-800">
                <span>Total</span>
                <span
                  >${{
                    (Number(cart.totalPrice) + 5 + Number(cart.totalPrice) * 0.1).toFixed(2)
                  }}</span
                >
              </div>
            </div>
          </div>

          <button
            @click="checkout"
            class="btn bg-primary hover:bg-primary/90 text-white border-0 w-full"
            :disabled="cart.items.length === 0"
          >
            Proceed to Checkout
          </button>

          <button
            @click="continueShopping"
            class="btn btn-ghost text-neutral-700 hover:bg-neutral-100 w-full mt-2"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
}
</style>
