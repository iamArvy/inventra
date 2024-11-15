<template>
  <span class="stars" :style="ratingFillStyle">
    <!-- Assuming bxs-star represents a filled star -->
    <i class="bx bxs-star" v-for="n in 5" :key="n"></i>
  </span>
  <div class="rating-fill"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const ratingFillStyle = computed(() => {
  const gradientWidth = (props.rating / 5) * 100
  return {
    '--rating-width': `${gradientWidth}%`
  }
})
// Props definition
const props = defineProps<{
  rating: number // Rating out of 5
}>()
</script>

<style scoped>
.stars {
  /* background: linear-gradient(to right, #ffd900 0, #705f00 20%, #ffd900 20%); */
  background: linear-gradient(to right, #ffd900 var(--rating-width), #ccc var(--rating-width));
  background-clip: text;
  -webkit-background-clip: text;
  background-position: 0;
  -webkit-text-fill-color: transparent;
  -webkit-text-size-adjust: none;
}

.bx {
  display: inline-block;
}
</style>
