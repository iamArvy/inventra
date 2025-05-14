<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import ProductGallery from './partials/ProductGallery.vue';
import ProductInfo from './partials/ProductInfo.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
const props = defineProps<{
    product: {
      id: string
        name: string
        description:string
        images:string[]
        price: number
        discount? : number
        rating: number
    }
}>()

const quantity = ref(1)

const form = useForm({
  'product_id': props.product.id,
  'quantity' : 1,
  'variant_id' : ''
})

const addtocart = () => {
  form.quantity = quantity.value
  form.post(route('product.add.cart'))
  console.log(form.errors)
}
</script>

<template>
  <AppLayout>
    <section>
        <ProductGallery :images="product.images" id="gallery" />
        <ProductInfo :product="product" />
    </section>
    <div class="quantity">
      <button class="quantifier" @click="quantity++">
        add
      </button>
      <span>
        {{ quantity }}
      </span>
      <button class="quantifier" @click="quantity>1 ? quantity-- : null">
        subtract
      </button>
    </div>

    <PrimaryButton @click="addtocart">AddToCart</PrimaryButton>
    <!-- <HeroSection />
    <BrandMarquee class="full-width" />
    <ProductListSection title="New Arrivals" />
    <ProductListSection title="Top Selling" />
    <Categories /> -->
    <!-- <Testimonial /> -->
  </AppLayout>
</template>

<style scoped>
section{
    display: grid;
    /* flex-direction: row; */
    gap: 10px;
    grid-template-columns: 1fr 1fr;
    /* height: 500px; */
    /* padding: 5rem; */
}
</style>