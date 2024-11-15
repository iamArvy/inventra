<script setup lang="ts">
defineProps<{
src:string
}>()
</script>
<template>
    <figure>
        <img :src="src" alt="">
    </figure>
</template>

<style scoped>
img{
    width: 100%;
}
figure{
    /* height: 100%; */
    overflow: hidden;
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    border-radius: 10px;
}
</style>