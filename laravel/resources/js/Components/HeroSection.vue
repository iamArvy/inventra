<script setup>
import PrimaryButton from './PrimaryButton.vue'
</script>

<template>
  <section id="hero full-width" class="full-width">
    <!-- <div class="container"> -->
      <article>
        <h1>Find Shoes that matches your style</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero recusandae vel at quidem
          aliquid laudantium!
        </p>
        <PrimaryButton value="Shop Now" />
        <div class="numbers">
          <div class="number">
            <h2>200+</h2>
            <p>International brands</p>
          </div>
          <div class="number">
            <h2>2,000+</h2>
            <p>High-Quality Products</p>
          </div>
          <div class="number">
            <h2>30,000+</h2>
            <p>Happy Customers</p>
          </div>
        </div>
      </article>
      <figure>
        <img src="/assets/sneakers.png" alt="" />
      </figure>
    <!-- </div> -->
  </section>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Matemasie&family=New+Amsterdam&display=swap');
img {
  width: 100%;
}
section {
  background-color: #f2f0f1;
  padding-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
article {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.numbers {
  display: flex;
  justify-content: space-between;
}
.numbers h2 {
  font-size: 40px;
}
.numbers > * {
  flex: 1 1;
}
h1 {
  font-family:
    New Amsterdam,
    sans-serif;
  line-height: 64px;
  font-size: 70px;
  font-weight: bold;
  text-transform: uppercase;
}
p {
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-weight: normal;
}
@media screen and (max-width: 500px) {
  section{
    grid-template-columns: 1fr;
    margin-top: 1rem;
  }
  h1{
    font-size: 60px;
    line-height: 44px;
    width: 80%;
  }
  .numbers{
    flex-wrap: wrap;
    place-items: center center;
  }
  button{
    width: 100%;
  }
  .numbers h2{
    font-size: 35px;
  }
  }
</style>
