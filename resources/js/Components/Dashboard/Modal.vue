<template>
    <dialog class="page" ref="dialog">
      <div class="container">
        <h2>Welcome</h2>
        <p>Hi! This is a modal dialog.</p>
        <button @click="closeDialog">Close</button>
      </div>
    </dialog>
  </template>
  
  <!-- <style scoped>
  .page {
    width: 100vw;
    height: 100vh;
    display: flex;
    place-items: center;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
  }
  .container {
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style> -->
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const props = {
    show
  }
  
  const dialog = ref<HTMLDialogElement | null>(null);
  
  const closeDialog = () => {
    if (dialog.value) {
      dialog.value.close();
    }
  };
  
  onMounted(() => {
    if (dialog.value) {
      dialog.value.showModal();
    }
  });
  </script>
  