<script setup lang="ts">
// import { RouterLink } from 'vue-router'
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
</script>
<template>
  <header>
    <DesktopNav id="desktop" />
    <MobileNav id="mobile" />
  </header>
</template>
<style scoped>
header {
  height: var(--headerheight);
  font-family: Poppins, sans-serif;
  position: fixed;
  top: 0;
  width: 100vw;
  font-size: 16px;
  z-index: 999999;
  background: white;
  display: flex;
  place-items: center;
}
#mobile{
  display: none;
}
@media screen and (max-width: 500px) {
  #desktop{
    display: none;
  }
  #mobile{
    display: flex;
  }
}
</style>
