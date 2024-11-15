<!-- <script setup>
// import {use}
import { Link, router, useForm } from '@inertiajs/vue3';
const form = useForm({
    // _method: 'POST',
    name: props.user.name,
    description: props.user.email,
    photo: null,
});
const photoInput = ref(null);

const submit = () => {
    if (photoInput.value) {
        form.photo = photoInput.value.files[0];
    }

    form.post(route('user-profile-information.update'), {
        errorBag: 'updateProfileInformation',
        preserveScroll: true,
        onSuccess: () => clearPhotoFileInput(),
    });
};
</script>
<template>
    <ul >
        <li v-for="product in $page.props.products">{{ product.name }}</li>
    </ul>

    <form @submit.prevent="submit" enctype="multipart/form-data">

    </form>
</template> -->
<script setup>
import DashboardLayout from '../../Layouts/DashboardLayout.vue';
import Section from '@/Components/Dashboard/Section.vue';
// import SectionLayout from '@/Layouts/SectionLayout.vue';

const props = defineProps({
    products: Array,
});


</script>

<template>
    <DashboardLayout>
        <Section>
            Work in Progress
        </Section>
    </DashboardLayout>
</template>
