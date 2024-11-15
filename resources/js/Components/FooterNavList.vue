<script setup>
// import { defineComponent } from '@vue/composition-api'
defineProps({
  items: Array
})
</script>

<template>
  <li>
    <h2><slot /></h2>
    <ul>
      <li v-for="item in items" :key="item">
        <router-link :to="item.url">{{ item.name }}</router-link>
      </li>
    </ul>
  </li>
</template>
<style scoped>
h2 {
  text-transform: uppercase;
}
ul>li {
  text-transform: capitalize;
}
ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
a {
  color: var(--light-black);
}
@media screen and (max-width: 500px) {
  h2{
    font-size: 20px;
  }
  li{
    font-size: 15px;
  }
}
</style>
