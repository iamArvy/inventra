<script setup lang="ts">
defineProps({
    headers: Array
})
</script>
<template>
        <table >
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key ="index">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <slot />
            </tbody>
        </table>
</template>

<style scoped>
table{
    width: 100%;
    flex: 1 1 1;
    text-align: left;
}
thead{
    background-color: rgba(0, 0, 255, 0.151);
}
th{
    padding: 12px;
}
</style>