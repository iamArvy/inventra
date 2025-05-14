<script setup lang="ts">
    defineProps<{
        price: number
        discount?: number
    }>();
const discountedPrice = (price:number, discount:number) => {
  return price - (price * (discount / 100));
}
</script>
<template>
    <div class="price">
        <h3>${{ discount ? discountedPrice(price, discount) : price }}</h3>
        <div class="discount" v-if="discount">
          <h3>${{ price }}</h3>
          <span>-{{discount}}%</span>
        </div>
        <span></span>
      </div>
</template>
<style scoped>
.price {
  display: flex;
  gap: 10px;
}
.discount {
  place-items: center;
}
.discount > * {
  display: inline;
}
.discount > h3 {
  text-decoration: line-through;
  color: grey;
}
.discount > span {
  color: red;
  font-size: 10px;
  border-radius: 5px;
  padding: 2px 5px;
  background-color: rgba(255, 0, 0, 0.1);
}
</style>