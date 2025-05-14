<script setup>

</script>
<template>
    <form>
        <h3><slot name="title" /></h3>
        <div id="content">
            <slot />
        </div>
    </form>
</template>

<style scoped>
h3{
    margin-bottom: 10px;
}
</style>