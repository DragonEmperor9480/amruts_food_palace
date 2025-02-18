<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  onComplete: () => void
}>()

const isVisible = ref(true)

const handleClick = () => {
  isVisible.value = false
  document.body.style.overflow = 'auto' // Restore scrolling
  props.onComplete()
}

onMounted(() => {
  // Prevent scrolling while splash screen is visible
  document.body.style.overflow = 'hidden'
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-[100] cursor-pointer" @click="handleClick">
      <div class="relative w-full h-full">
        <!-- Background GIF -->
        <img
          src="/gifs/beginning.gif"
          alt="Amrut's Food Palace"
          class="w-full h-full object-cover"
        />

        <!-- Overlay Content -->
        <div class="absolute inset-0 bg-black/20 flex flex-col items-center justify-between py-16">
          <!-- Title at top -->
          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-bold text-white animate-fade-in text-center px-4"
          >
            Amrut's Food Palace
          </h1>

          <!-- Tap to Order text at bottom -->
          <div class="text-center space-y-4">
            <p
              class="text-3xl md:text-4xl lg:text-5xl text-white font-light tracking-wider animate-pulse-slow"
            >
              Tap to Order
            </p>
            <div class="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-white animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-in;
}

.animate-pulse-slow {
  animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseSlow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.05);
  }
}

/* Text shadow for better visibility */
h1,
p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
