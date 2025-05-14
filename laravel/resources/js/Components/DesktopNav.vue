<script setup>
import {Link} from '@inertiajs/vue3';

defineOptions({
  name: 'DesktopNav'
})
</script>

<template>
    <section>
      <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="30" height="30" />
      <nav>
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
      <SearchBar />
      <div class="user-options">
        <Link :href="route('cart.index', )"><i class="bx bx-user-circle"></i></Link>
        <Link><i class="bx bx-cart-alt"></i></Link>
      </div>
    </section>
</template>
<style scoped>
section {
  display: flex;
  place-items: center center;
  justify-content: space-between;
  width: 100%;
}
#shop-list {
  cursor: pointer;
  position: relative;
}
#shop-list:hover ul {
  display: block;
  position: absolute;
  width: fit-content;
  padding: 10px;
  background: blue;
  /* z-index: 999999; */
}
#shop-list ul {
  display: none;
}
nav {
  display: flex;
  gap: 24px;
  place-items: center;
}
a {
  color: black;
}
.user-options i {
  font-size: 24px;
}
.user-options {
  display: flex;
  gap: 14px;
}
</style>