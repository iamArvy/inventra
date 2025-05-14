<script setup lang="ts">
defineProps<{
    items: {
        value: string;
        type: string;
    }[]
}>()
</script>
<template>
    <tr>
        <td v-for="(item, index) in items" :key="index">
            <!-- <figure v-if="item?.type == 'image'">
                <img :src="'/'+item?.value">
            </figure> -->
            <span>{{ item.value }}</span>
        </td>
    </tr>
</template>

<style scoped>
tr:hover{
    background-color: grey;
}
td{
    padding: 12px;
}
</style>