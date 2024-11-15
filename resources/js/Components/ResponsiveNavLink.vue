<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    active: Boolean,
    href: String,
    as: String,
});

// const classes = computed(() => {
//     return props.active
//         ? 'active'
//         : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out';
// });
</script>

<template>
    <div>
        <button v-if="as == 'button'" :class="props.active ? 'active' : null" class="link">
            <slot />
        </button>

        <Link v-else :href="href" :class="props.active ? 'active' : null" class="link">
            <slot />
        </Link>
    </div>
</template>

<style scoped>
.link{
    display: flex;
    place-items: center;
    gap: 5px;
    height: 45px;
    border-radius: 12px;
    font-size: 14px;
    transition: all 150ms ease-in-out;
    padding: 16px;
    font-weight: 500;
}
a:hover{
    color: #1f2937;
    background-color: #d1d5db;
}
a.active{
    background-color: #475BE8;
    color: white;
}
button:hover{
    color: #475BE8;
}
</style>