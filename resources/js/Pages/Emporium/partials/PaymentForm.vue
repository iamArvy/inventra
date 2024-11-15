<script setup lang='ts'>
import {onMounted, ref} from 'vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
// const loading = ref(false);
// const submitPayment
const props = defineProps<{
    open: Function
}>()
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

const loading = ref<boolean>(false)
const checkout = async () => {
    loading.value = true;
    // const stripe = await stripePromise;
    await props.open();
    // const { token, error } = stripe ? await stripe.createToken(card) : null;

    // if (error) {
    //     errorMessage.value = error.message ? error.message : '';
    // } else {
    //     // Send token to your server for processing
    //     // Example: sendTokenToServer(token.id);
    // }

    loading.value = false;
}
</script>

<template>
    <!-- <form @submit.prevent="handleSubmit"> -->

        
        <!-- @vue-ignore -->
        <PrimaryButton @click="checkout()" :disabled="loading"> Checkout </PrimaryButton>
    <!-- </form> -->
</template>