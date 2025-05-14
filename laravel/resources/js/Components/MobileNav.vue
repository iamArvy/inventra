<script setup >
// import { RouterLink } from 'vue-router'
import SearchBar from './SearchBar.vue';
</script>
<template>
    <section>

      <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="30" height="30" />
      <!-- <nav>
        <div id="shop-list">
          Shop
          <i class="bx bx-chevron-down"></i>
          <ul>
            <li>Men</li>
            <li>Women</li>
            <li>Shoes</li>
            <li>Clothes</li>
            <li>Bags</li>
            <li>Testing</li>
            <li>Testing</li>
          </ul>
        </div>
        <RouterLink>On Sale</RouterLink>
        <RouterLink>New Arrivals</RouterLink>
        <RouterLink>Brand</RouterLink>
      </nav>
      <SearchBar /> -->
      <div class="user-options">
        <RouterLink><i class="bx bx-user-circle"></i></RouterLink>
        <RouterLink><i class="bx bx-cart-alt"></i></RouterLink>
      </div>
    </section>
</template>
<style scoped>
section{
    flex-direction: row;
    place-items: center;
    justify-content: space-between;
}
</style>