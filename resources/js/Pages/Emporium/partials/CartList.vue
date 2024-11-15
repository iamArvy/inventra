<script setup lang="ts"></script>
<template>
        <ul>
                <slot />
            </ul>
</template>
<style scoped>
ul{
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
    max-height: 400px;
    overflow-x: auto;
}
</style>
<!-- </template> -->