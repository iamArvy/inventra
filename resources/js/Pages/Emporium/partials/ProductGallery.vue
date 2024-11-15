<script setup lang="ts">
import ImgFigure from "@/Components/Emporium/ImgFigure.vue";
import { ref } from "vue";
defineProps<{
    images: string[];
}>();
const currentImg = ref(0);
const changeCurrentImg = (index: number) => {
    currentImg.value = index;
};
</script>
<template>
    <div id="gallery">
        <div class="big">
            <ImgFigure :src="images[currentImg]" />
        </div>
        <div id="small">
            <ImgFigure
                v-for="(image, index) in images"
                :src="image"
                :active="currentImg == index ? true : false"
                @click="changeCurrentImg(index)"
                class="smallerimgs"
            />
        </div>
    </div>
</template>
<style scoped>
#gallery{
    display: flex;
    flex-direction: row-reverse;
    /* grid-template-columns: 1fr 1fr; */
}
.big {
    /* flex: 1; */
    width: 300px;
    height: 300px;
    background-color: red;
}
#small{
    width: 50px;
    /* height: 100px; */
    background-color: blue;
    display: flex;
    flex-direction: column;
}
/* .smallerimgs {
    width: 160px;
    height: 100px;
} */
div.smallerimgs {
    display: flex;
    flex-direction: row;
    /* width: 50%; */
    gap: 10px;
}
/* img{
    width: 100px;
} */
</style>
