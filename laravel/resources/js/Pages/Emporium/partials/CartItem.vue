<script setup lang="ts">
import ImgFigure from '@/Components/Emporium/ImgFigure.vue';
import { Link } from '@inertiajs/vue3';

defineProps<{
 item:{
        product: {
            id: string,
            name: string,
            price: string,
            discount: number,
            images: string[],
        },
        quantity : number,
    }
    last?:boolean
}>()
</script>
<template>
    <li>
        <Link :href="'/product/'+item.product.id">
            <ImgFigure :src="item.product.images[0]" class="img" />
            <figcaption>
                <h1>{{ item.product.name }}</h1>
                <p>${{ item.product.price }}</p>
                <p>QTY: {{ item.quantity }}</p>
            </figcaption>
        </Link>
    </li>
    <hr v-if="!last">
</template>
<style scoped>
.img{
    width: 100px;
    height: 100px;
}
li{
    padding: 10px;
}
li>a{
    display: flex;
    flex-direction: row;
    /* padding: 10px; */
    /* height: 200px; */
}
</style>