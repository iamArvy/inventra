<script setup>
import FormSection from '@/Components/FormSection.vue';
import { Link, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import ActionMessage from '@/Components/ActionMessage.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import TextInput from '@/Components/TextInput.vue';

const form = useForm({
    // _method: 'PUT',
    name: null,
    description: null,
    category_id: 1,
    images: null,
    price: null
});

const photoInput = ref(null);

const submit = () => {
    if (photoInput.value) {
        form.images = photoInput.value.files;
    }

    form.post(route('store.product.create'), {
        // errorBag: 'updateProfileInformation',
        preserveScroll: true,
        onSuccess: () => clearPhotoFileInput(),
    });
};


const selectNewPhoto = () => {
    photoInput.value.click();
};

const clearPhotoFileInput = () => {
    if (photoInput.value?.value) {
        photoInput.value.value = null;
    }
};
</script>
<template>
    <FormSection @submitted="submit">
        <template #title>
            Profile Information
        </template>

        <template #description>
            Update your account's profile information and email address.
        </template>

        <template #form>
            <!-- Profile Photo -->
            <div class="col-span-6 sm:col-span-4">
                <!-- Profile Photo File Input -->
                <input
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
                </SecondaryButton>
<!-- 
                <SecondaryButton
                    v-if="user.profile_photo_path"
                    type="button"
                    class="mt-2"
                    @click.prevent="deletePhoto"
                >
                    Remove Photo
                </SecondaryButton> -->

                <InputError :message="form.errors.images" class="mt-2" />
            </div>

            <!-- Name -->
            <div class="col-span-6 sm:col-span-4">
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
            </div>

            <!-- Email -->
            <div class="col-span-6 sm:col-span-4">
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
            <div class="col-span-6 sm:col-span-4">
                <InputLabel for="price" value="Price" />
                <TextInput
                    id="price"
                    v-model="form.price"
                    type="number"
                    class="mt-1 block w-small"
                    required
                />
                <InputError :message="form.errors.price" class="mt-2" />

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
    </FormSection>
</template>