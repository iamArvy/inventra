<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref } from 'vue'
import ProductItem from '@/Components/Emporium/ProductItem.vue';
defineProps<{
  products: {
    name: string
  id: string
  images: string[]
  price: number
  discount?: number
  }[]
}>()
const swiperOptions = ref({
  // spaceBetween: 50,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  breakpoints: {
    1100: {
      slidesPerView: 5,
      spaceBetween: 30
    },
    881: {
      slidesPerView: 3,
      spaceBetween: 10
    },
    851: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    501: {
      slidesPerView: 2,
      spaceBetween: 1
    }
  }
})
</script>
<template>
  <swiper v-bind="swiperOptions">
    <swiper-slide v-for="(product, index) in products" :key="index">
        <ProductItem :product="product" />
      <!-- <ScrollerItem :item="item" route="artist" params="id" rounded /> -->
    </swiper-slide>
  </swiper>
</template>
