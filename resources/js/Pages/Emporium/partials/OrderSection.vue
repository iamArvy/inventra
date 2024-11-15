<script setup lang="ts">

</script>
<template>
    <div id="container">
        <slot/>
    </div>
</template>
<style scoped>
#container{
    border: 1px solid grey;
    padding: 1rem;
    border-radius: 20px;
    height: fit-content;
}
</style>