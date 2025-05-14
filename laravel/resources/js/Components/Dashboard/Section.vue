<script setup lang="ts">
defineProps({
    header: String
})
</script>
<template>
    <section>
        <h2>{{ header }}</h2>
        <slot />
    </section>
</template>

<style scoped>
section {
    width: 100%;
    background-color: white;
    padding: 10px;
}
</style>