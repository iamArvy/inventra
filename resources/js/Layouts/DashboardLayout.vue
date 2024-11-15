<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import ApplicationMark from '@/Components/ApplicationMark.vue';
import Banner from '../Components/Banner.vue';
import Dropdown from '../Components/Dropdown.vue';
import DropdownLink from '../Components/DropdownLink.vue';
import NavLink from '../Components/NavLink.vue';
import ResponsiveNavLink from '../Components/ResponsiveNavLink.vue';
import DialogModal from '../Components/DialogModal.vue';
defineProps({
    title: String,
});

const compactview = ref(false);

const logout = () => {
    router.post(route('logout'));
};
let nav: { name: string; route?: string; icon?: string}[] = [
  { name: "Dashboard", route:'/store/dashboard', icon: `bx bxs-dashboard`},
  { name: "Statistics", icon: "bx bxs-doughnut-chart"},
  { name: "Payment", icon:"bx bxs-wallet" },
  { name: "Transactions" },
  { name: "Products", route:'/store/products', icon: "bx bx-shopping-bag"},
  { name: "Customer", icon: "bx bx-user"},
  { name: "Messages", icon:"bx bx-message-dots" },
];
const open = ref(false)
const modalTitle = ref('')
const opensettings = () => {
    modalTitle.value = 'Settings'
    open.value = true
}
const closeModal = () => {
    open.value = false
}
</script>

<template>
    <div class="container">
        <DialogModal :show="open" :title="modalTitle" :close="closeModal">
            <template #content>
               hello
            </template>
        </DialogModal>
        <Head :title="title" />
        <Banner />
        <nav>
        <header>
            <h1>Emporium</h1>
        </header>
        <ul>
            <li v-for="link in nav" :key="link.name">
                <ResponsiveNavLink :href="link.route" :active="$page.url === link.route"><i :class="link.icon"></i>{{ link.name }}</ResponsiveNavLink>
            </li>
        </ul>
        <footer>
            <ResponsiveNavLink as="button" @click="opensettings"><i class='bx bx-cog'></i> Settings</ResponsiveNavLink>
            <ResponsiveNavLink as="button" @click="logout"><i class='bx bx-log-out-circle'></i>Logout</ResponsiveNavLink>
        </footer>
    </nav>
    <main>
        <header><h1>{{ title }}</h1></header>
        <slot />
    </main>
    </div>
</template>
<style scoped>
nav header{
    margin: 5px;
    padding: 10px;
    color: #475BE8;
}
h1{
    font-size: 22px;
    font-weight: 900 ;
}
.container{
    max-width: 1280px;
    display: flex;
    flex-direction: row;
    height: 100svh;
    background-color: #f5f5f5;
}
nav{
    position: relative;
    width: 200px;
    padding: 10px;
    height: 100svh;
    background-color: white;
}
ul{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
main{
    flex: 1 1 1;
    padding: 2rem;
    width: 100%;
}
footer{
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-bottom: 10px;
}
</style>
