<script setup>
import NavList from './FooterNavList.vue'
const items = [
  { name: 'about', url: '/' },
  { name: 'about', url: '/' },
  { name: 'about', url: '/' },
  { name: 'about', url: '/' }
]
</script>

<template>
  <footer>
    <section class="top">
      <div class="footer-about">
        <div class="logo">
          <img alt="Vue logo" class="logo" src="/assets/logo.svg" width="50" height="50" />
        </div>
        <p>
          We have Shoes that suits your style and which you're proud to wear, From women to men.
        </p>
        <div class="socials"></div>
      </div>
      <ul>
      <NavList :items="items">Company</NavList>
      <NavList :items="items">Help</NavList>
      <NavList :items="items">FAQ</NavList>
      <NavList :items="items">RESOURCES</NavList>
      </ul>
    </section>
  </footer>
</template>
<style scoped>
footer {
  background: var(--grey);
  padding-top: 3rem;
  padding-bottom: 3rem;
}
section {
  display: flex;
  flex-direction: row;
  /* place-items: center; */
  justify-content: space-between;
}
.footer-about {
  display: flex;
  max-width: 300px;
  flex-direction: column;
  gap: 1rem;
}
@media screen and (max-width: 500px) {
  section{
    flex-direction: column;
  }
  ul{
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
  }
  li{
    min-width: 40%;
    margin-top: 1rem;
  }
  .footer-about{
    max-width: unset;
    font-size: 13px;
  }
}
</style>
