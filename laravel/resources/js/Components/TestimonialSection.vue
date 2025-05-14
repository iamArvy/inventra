<script setup>
// import Ratings from './Ratings.vue'
import Article from './TestimonialArticle.vue'
import OwlCarousel from './OwlCarousel.vue'
</script>

<template>
  <section>
    <OwlCarousel/>
    <div class="header">
      <h1>Our Happy Customers</h1>
      <div class="controller"></div>
    </div>
    <div class="testimonies">
      <Article />
    </div>
  </section>
</template>
