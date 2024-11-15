<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import HeroSection from '@/Components/HeroSection.vue'
import BrandMarquee from '@/Components/BrandMarquee.vue'
import ProductSwiper from '@/Components/Emporium/ProductSwiper.vue'
import ProductListSection from '@/Components/ProductListSection.vue'
import Testimonial from '@/Components/TestimonialSection.vue'
import { onMounted } from 'vue'
interface Product {
  name: string
  id: string
  images: string[]
  price: number
  discount?: number
}
const props = defineProps<{
products: Product[]
}>()

onMounted(()=>{
  console.log(props.products)
})
</script>

<template>
  <AppLayout>
    <HeroSection />
    <BrandMarquee class="full-width" />
    <ProductListSection title="New Arrivals">
      <ProductSwiper :products="products"  />
    </ProductListSection>
    <ProductListSection title="Top Selling">
      <ProductSwiper :products="products"  />
    </ProductListSection>
    <Categories />
    <!-- <Testimonial /> -->
  </AppLayout>
</template>