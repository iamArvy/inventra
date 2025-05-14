<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import CartList from './partials/CartList.vue';
import CartItem from './partials/CartItem.vue';
import OrderSummary from './partials/OrderSummary.vue';
import OrderSection from './partials/OrderSection.vue';
import CartPageDivider from './partials/CartPageDivider.vue';
import { router } from '@inertiajs/vue3';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import DialogModal from '@/Components/DialogModal.vue';
const props = defineProps<{
    items: {
        product: {
            id: string,
            name: string,
            price: string,
            discount: number,
            images: string[],
        },
        quantity : number,
    }[],
    total: number,
    quantity: number
}>()
const checkout = () => {
    router.get(route('cart.checkout'))
}
</script>
<template>
    <AppLayout>
        <CartPageDivider>
            <template #main>
                <OrderSection>
                <CartList>
                    <CartItem v-for="(item, index) in props.items" :key="index" :item="item" :last="index + 1 === props.items.length" />
                </CartList>
            </OrderSection>
            </template>
            <template #summary>
                <OrderSection>
                    <OrderSummary :total="props.total"/>
                    <PrimaryButton @click="checkout()">Checkout</PrimaryButton>
                </OrderSection>
            </template>
        </CartPageDivider>
    </AppLayout>
</template>

<style scoped>
/* section{
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    gap: 1rem;
} */
</style>