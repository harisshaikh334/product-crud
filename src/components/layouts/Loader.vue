<template>
  <div class="loader-container d-flex flex-column justify-content-center align-items-center">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p v-if="message" class="mt-3 text-muted">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define props for the component
const props = defineProps({
  message: {
    type: String,
    default: 'Loading data...' // Default message for the loader
  }
});
</script>

<style scoped>
/* Full-screen overlay styles */
.loader-container {
  position: fixed; /* Position relative to the viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  z-index: 9999; /* Ensure it's on top of almost everything */
  /* Bootstrap flex classes handle centering: d-flex flex-column justify-content-center align-items-center */
}
</style>
