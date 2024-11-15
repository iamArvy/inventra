<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Rating from './Ratings.vue'
import ImgFigure from './ImgFigure.vue';
import Price from './Price.vue';
defineProps<{
product:{
  name: string
  id: string
  images: string[]
  price: number
  discount?: number
}
}>()
const rating = 3.5
</script>
<template>
  <!-- @vue-ignore -->
  <Link :href="route('product.show', { product: product.id })">
    <ImgFigure :src="product.images[0]" />
    <figcaption>
      <h2>{{ product.name }}</h2>
      <span
        ><Rating :rating="rating" /><span>{{ rating }}</span
        >/5</span
      >
      <Price :price="product.price" :discount="product.discount" />
    </figcaption>
  </Link>
</template>
<style scoped>
figcaption {
  color: black;
}

h2 {
  font-size: 15px;
}
a {
  text-decoration: none;
}
@media screen and (max-width: 500px) {
  img{
    max-width: 200px;
  }
  #mobile{
    display: flex;
  }
}
</style>
