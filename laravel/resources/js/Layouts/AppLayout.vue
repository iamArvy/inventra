<template>
    <HeaderBar class="sticky full-width" />
    <main>
      <slot />
    </main>
    <FooterBar class="full-width" />
  </template>
  <script setup>
  import HeaderBar from '@/Components/HeaderBar.vue'
  import FooterBar from '@/Components/FooterBar.vue'
  </script>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  :root {
    --gradient: linear-gradient(to left, #0000ff, #00ffff);
    --primary: #101357;
    --secondary: #fbaf08;
    --heading: #101357;
    --subheading: #00ff00;
    --headerbg: #101357;
    --discount: rgba(255, 51, 51);
    --discount-bg: rgba(255, 51, 51, 0.1);
    --lighter-black: rgba(0, 0, 0, 0.4);
    --stars: #ffc633;
    --grey: #f0f0f0;
    --light-black: rgba(0, 0, 0, 0.6);
    --black: rgba(0, 0, 0);
    --buttonbg: #fbaf08;
    --bodybg: #fffff0;
    --herotext: #ffbf00;
    --headerheight: 70px;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Poppins, sans-serif;
  }
  section {
    width: 100%;
    padding-left: 6rem;
    padding-right: 6rem;
  }
  
  p {
    color: var(--light-black);
  }
  a {
    text-decoration: none;
  }
  li {
    list-style: none;
  }
  /* .body{
      max-width: 100vw;
      overflow: hidden;
  } */
  /* .sticky{
      position: fixed;
      top: 0;
      z-index: 99;
      padding: 5px 2rem;
  } */
  .solid-heading {
    /* color:rgba(66, 68, 110, 1); */
    font-weight: bold;
    font-family: Poppins, sans-serif;
  }
  .my-button {
    background-color: var(--buttonbg);
  }
  .button-success {
    color: rgba(215, 255, 224, 1);
  }
  main {
    /* background-color: var(--bodybg); */
    color: var(--bodytext);
    /* height: 100vh; */
  }
  main {
    /* position: relative; */
    margin-top: var(--headerheight);
  }
  @media screen and (max-width: 500px) {
    section {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
  </style>
  