<script setup lang="ts">
import ImgFigure from '@/Components/ImgFigure.vue'
import Ratings from '@/Components/Emporium/Ratings.vue';
import { ref } from 'vue';
import Price from '@/Components/Emporium/Price.vue';
defineProps<{
    product: {
        name: string
        rating: number
        description: string
        price: number
        discount?: number
    }
}>()
const currentImg = ref(0)
const changeCurrentImg = (index:number) =>{
    currentImg.value = index
}
</script>
<template>
    <div id="product-info">
        <h1>{{ product.name }}</h1>
        <Ratings :rating="product.rating" />
        <Price :price="product.price" :discount="product.discount" />
        <p>{{ product.description }}</p>
    </div>
</template>