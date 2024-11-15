<script setup lang="ts">
import Ratings from './Ratings.vue'
</script>
<template>
    <article>
        <Ratings :rating="3" />
        <h2>Sara M.</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum mollitia quod obcaecati assumenda sapiente! Fuga et enim officia mollitia magni?
        </p>
      </article>
</template>
<style scoped>
article{
    width: 450px;
    padding: 1rem;
    border: 2px solid black;
    border-radius: 30px;
}
</style>