<script setup>
// import { type } from 'os';
import Modal from './Modal.vue';

const emit = defineEmits(['close']);

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: String,
        default: '2xl',
    },
    closeable: {
        type: Boolean,
        default: true,
    },
    close : Function,
    title:{
        type: String,
        default: 'Modal'
    }
});

const close = () => {
    emit('close');
};
const emitClose = () => {
    if (props.close) {
        props.close(); // Call the passed close function
    }
};
</script>

<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :closeable="closeable"
        @close="close"
    >
    
        <div class="px-6 py-4">
            <header class="text-lg font-medium text-gray-900">
                <h1>{{ title }}</h1>
                <button @click="emitClose">Close</button>
            </header>

            <div class="mt-4 text-sm text-gray-600">
                <slot name="content" />
            </div>
        </div>

        <div class="flex flex-row justify-end px-6 py-4 bg-gray-100 text-end">
            <slot name="footer" />
        </div>
    </Modal>
</template>

<style scoped>
header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>