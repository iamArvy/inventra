<script setup lang="ts">
// import AppLayout from '@/Layouts/AppLayout.vue';
import DashboardLayout from "../../Layouts/DashboardLayout.vue";
import Section from "../../Components/Dashboard/Section.vue";
import Table from "../../Components/Dashboard/Table.vue";
import TableRow from "../../Components/Dashboard/TableRow.vue";
import Modal from "../../Components/Dashboard/Modal.vue";
// import Welcome from '@/Components/Welcome.vue';
import { ref } from "vue";
import { Link, router, useForm } from "@inertiajs/vue3";
import ActionMessage from "@/Components/ActionMessage.vue";
import FormSection from "@/Components/FormSection.vue";
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import DialogModal from "@/Components/DialogModal.vue";
import axios from "axios";
import CreateProductForm from "./Partials/CreateProductForm.vue";

const props = defineProps<{
    products: {
        name: string;
        images?: string;
        id: string;
    }[];
}>();

const form = useForm({
    // _method: 'PUT',
    name: null,
    description: null,
    category_id: 1,
    images: null,
});

const photoInput = ref(null);

// const submit = () => {
//     if (photoInput.value) {
//         form.images = photoInput.value.files;
//     }

//     form.post(route('store.product.create'), {
//         // errorBag: 'updateProfileInformation',
//         preserveScroll: true,
//         onSuccess: () => clearPhotoFileInput(),
//     });
// };

// const selectNewPhoto = () => {
//     photoInput.value.click();
// };

// const clearPhotoFileInput = () => {
//     if (photoInput.value?.value) {
//         photoInput.value.value = null;
//     }
// };
const ProductHeaders = [
    "Product Name",
    "Category",
    "Price",
    "Quantity Left",
    "Quantity Sold",
    "Status",
];
const items = (item: any) => {
    let data = [
        // {'value':item.images && item.images.length > 0 ? item.images[0] : null, 'type':'image'},
        { value: item.name, type: "string" },
        { value: item.name, type: "string" },
        { value: item.name, type: "string" },
        { value: item.name, type: "string" },
        { value: item.name, type: "string" },
        { value: item.name, type: "string" },
    ];
    return data;
};
const cproduct = ref({});
const open = ref(false);
const modalTitle = ref("");
const modalType = ref("");
const currentComponent = ref()
const openproduct = (id: string) => {
    modalTitle.value = "Product Information";
    open.value = true;
    const response = axios.get(route("store.product.show", { product: id }));
};
const closeModal = () => {
    open.value = false;
    modalType.value = ''
};
const opencreate = () => {
    modalTitle.value = "CreateProduct"
    open.value = true
    modalType.value = 'form'
}
</script>

<template>
    <DashboardLayout title="Products">
        <DialogModal :show="open" :close="closeModal" :title="modalTitle">
            <template #content>
<!--                 
                Hello
                {{}} -->
                <CreateProductForm v-if="modalType == 'form' " />
            </template>
        </DialogModal>
        <Section> </Section>
        <Section>

        <PrimaryButton @click="opencreate()">
            Create New
        </PrimaryButton>
            <Table :headers="ProductHeaders">
                <TableRow
                    v-for="product in $page.props.products"
                    :key="product"
                    :items="items(product)"
                    @click="openproduct(product.id)"
                />
            </Table>
        </Section>
        <!-- <Modal /> -->

        <!-- <FormSection @submitted="submit">
            <template #form> -->
        <!-- Profile Photo -->
        <!-- <div class="col-span-6 sm:col-span-4"> -->
        <!-- Profile Photo File Input -->
        <!-- <input
                        id="photo"
                        ref="photoInput"
                        type="file"
                        class="hidden"
                        multiple
                        @change="updatePhotoPreview"
                    >

                    <InputLabel for="photo" value="Photo" />

                    <SecondaryButton class="mt-2 me-2" type="button" @click.prevent="selectNewPhoto">
                        Select A New Photo
                    </SecondaryButton> -->
        <!-- 
                    <SecondaryButton
                        v-if="user.profile_photo_path"
                        type="button"
                        class="mt-2"
                        @click.prevent="deletePhoto"
                    >
                        Remove Photo
                    </SecondaryButton> -->
        <!-- 
                    <InputError :message="form.errors.images" class="mt-2" />
                </div> -->

        <!-- Name -->
        <!-- <div class="col-span-6 sm:col-span-4">
                    <InputLabel for="name" value="Name" />
                    <TextInput
                        id="name"
                        v-model="form.name"
                        type="text"
                        class="mt-1 block w-full"
                        required
                        autocomplete="name"
                    />
                    <InputError :message="form.errors.name" class="mt-2" />
                </div> -->

        <!-- Email -->
        <!-- <div class="col-span-6 sm:col-span-4">
                    <InputLabel for="email" value="Description" />
                    <TextInput
                        id="email"
                        v-model="form.description"
                        type="text"
                        class="mt-1 block w-full"
                        required
                        autocomplete="username"
                    />
                    <InputError :message="form.errors.description" class="mt-2" />

                </div>
            </template>

            <template #actions>
                <ActionMessage :on="form.recentlySuccessful" class="me-3">
                    Saved.
                </ActionMessage>

                <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Save
                </PrimaryButton>
            </template>
        </FormSection> -->
    </DashboardLayout>
</template>
