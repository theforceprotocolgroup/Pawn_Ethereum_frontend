<template>
    <div class="swiper-container swiper1">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in 1" v-if="banner==''">
                <img src="../../assets/img/logo.png" width="100%" style="display:block;">
            </div>
            <div class="swiper-slide" v-for="item in banner" v-if="banner!=''">
                <a :href="item.url">
                    <div class="swiper-img flex3">
                        <img :src="item.image" width="100%" alt="banner" style="display:block;">
                    </div>
                </a>
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
</template>
<script>
    import VueAwesomeSwiper from 'vue-awesome-swiper';   //引用swiper
    import 'swiper/dist/css/swiper.min.css';        //引用css
    export default {
        props: ['banner'],    //首页传过来的数据
        components: {
            VueAwesomeSwiper
        },
        mounted() {
            var mySwiper = new Swiper('.swiper1', {
                pagination: '.swiper-pagination',
                autoplay: 3000,
                paginationClickable: true,
                centeredSlides: true,
                autoplayDisableOnInteraction: false,
                preventClicks: false,
                speed: 600,
                observer: true,
                loop: true,
                observeParents: true
            })

        }
    }
</script>

