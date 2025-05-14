<template>
  <section>
    <!-- <marquee-text speed="60" pauseOnHover loop direction="left"> -->
    <ul>
      <li>Versace</li>
      <li>ZARA</li>
      <li>GUCCI</li>
      <li>Prada</li>
      <li>Calvin Klein</li>
    </ul>
    <!-- </marquee-text> -->
  </section>
</template>
<style scoped>
section {
  background-color: black;
}
ul {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  color: white;
  font-weight: 700;
  font-size: 30px;
  /* gap: 1.5rem; */
}
li {
  white-space: nowrap;
}
marquee-text {
  width: 100%;
}
@media screen and (max-width: 500px) {
  ul{
    flex-wrap: wrap;
  }
}
</style>
<script setup>
// import MarqueeText from 'vue-marquee-text-component'
</script>
