<script setup lang="ts">
import ImgFigure from '@/Components/Emporium/ImgFigure.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { onMounted, ref } from 'vue';
import CartList from './partials/CartList.vue';
import CartItem from './partials/CartItem.vue';
import OrderSummary from './partials/OrderSummary.vue';
import OrderSection from './partials/OrderSection.vue';
import CartPageDivider from './partials/CartPageDivider.vue';
import { router, useForm } from '@inertiajs/vue3';
import CartForm from './partials/CartForm.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import DialogModal from '@/Components/DialogModal.vue';
// import PaymentForm from './partials/PaymentForm.vue'
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

// onMounted(()=>{
//     console.log(props)
// })
const cardElement = ref<HTMLElement | null>(null);
const errorMessage = ref('');
onMounted (async () => {
    const stripe = await stripePromise;
    const elements = stripe ? stripe.elements() : null;

    // Create an instance of the card Element
    const card = elements ? elements.create('card') : null;
    if(card && cardElement.value){
        card.mount(cardElement.value);
    // @ts-ignore
        card.on('change', (event) => {
            if (event.error) {
                errorMessage.value = event.error.message;
            } else {
                errorMessage.value = '';
            }
        });
    }
    
});
import {loadStripe} from '@stripe/stripe-js';
import Checkout from './partials/Checkout.vue';
const stripePromise = loadStripe('pk_test_51PmFiu02eysoiQ0x66ktCGXziza5Mk6wnyte1DU8ExYsoHZjjGKbQ1Kchn3UMiiHOOOcLdqhigurMR1y0KYmBKFZ00rQsZjEIX');

const form = useForm({
    delivery: {
        receipient_name:null,
        receipient_phone:null,
        state:null,
        city:null,
        addr:null
    },
    payment_method: null
})

const details = form.delivery
const formloading = ref<boolean>(false);
const formerror = ref<string>('')
const buttonloading = ref<boolean>(false)
const checkout = async () => {
    if(!form.delivery.receipient_name || !form.delivery.receipient_phone || !form.delivery.addr || !form.delivery.state || !form.delivery.city){
        
    }
    buttonloading.value = true
    // const {paymentMethod, error} = await stripePromise.createPaymentMethod({
    //     type: 'card',
    //     card: cardElement
    // });
    // if (error) formerror.value = error.message; buttonloading.value = false
    // form.payment_method = paymentMethod.id
    show.value = true
}
const handleSubmit = async () => {    

    form.post(route('cart.checkout'))


}
const show = ref<boolean>(false)
const openDialog = () =>{
    console.log('test')
    show.value=true
}

const closeDialog = () =>{
    show.value=false
}
</script>
<template>
    <AppLayout>
        <DialogModal :show="show" title="Order Details" :close="closeDialog">
            <Checkout :cartItems='props.items' :cartTotal="props.total" :cartQuantity="props.quantity" :form="details" />
        </DialogModal>
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
                <OrderSection>
                    <form @submit.prevent='checkout'>
                        <CartForm>
                            <template #title>Delivery Information</template>
                            <input type="text" placeholder="State" v-model="form.delivery.state" required>
                            <input type="text" placeholder="City" v-model="form.delivery.city" required>
                            <input type="text" placeholder="Address" v-model="form.delivery.addr" required>
                            <input type="text" placeholder="Receipient Name" v-model="form.delivery.receipient_name" required>
                            <input type="number" placeholder="Receipient Phone Number" v-model="form.delivery.receipient_phone" required>
                        </CartForm>
                        <CartForm>
                            <template #title>Card Information</template>
                            <div id="card-element" ref="cardElement"></div>
                            <p v-if="errorMessage">{{ errorMessage }}</p>
                            <!-- <PaymentForm :open="openDialog" /> -->
                        </CartForm>
                    </form>
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