<template>
    <transition name="tips-fade">
        <div class="alert" v-show="showFlag" :style="tipsStyle">
            {{content}}
        </div>
    </transition>
</template>
<style lang="scss">
    .alert {
        $line-height: 35px;
        position: fixed;
        left: 50%;
        top: 50%;
        line-height: $line-height;
        z-index: 9999999;
        font-size: 12px; /*no*/
        background-color: rgba(0, 0, 0, .8);
        border-radius: 9px;
        color: #ffffff;
        text-align: center;
        padding: 15px 30px;
        white-space: nowrap;
        transform: translate3d(-50%, -50%, 0);
        max-width: 80%;
    }

    .tips-fade-enter, .tips-fade-leave-active {
        opacity: 0;
        top: 55%;
    }

    .tips-fade-enter-active, .tips-fade-leave-active {
        transition: all .25s linear;
    }
</style>
<script>
    export default {
        data() {
            return {}
        },
        props: ['showFlag', 'content', 'showTime', 'tipsStyle', 'callback'],
        watch: {
            showFlag() {
                if (this.showFlag) {
                    this.hide(this.callback);
                }
            }
        },
        methods: {
            hide(callback) {
                let time = this.showTime || 2000; // 停留时间
                clearTimeout(time);
                let timer = setTimeout(() => {
                    this.$emit('hidetips');
                    callback && callback();
                }, time);
            }
        }
    }
</script>
