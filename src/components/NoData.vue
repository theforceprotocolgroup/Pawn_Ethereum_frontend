<template>
    <div class="comp-no-data" :class="'comp-no-data--' + theme">
        <div class="icon-box">
            <img src="../assets/img/no.png" width="229" height="132">
        </div>
        <div class="text-box">
            <slot>{{$t('text.noMoreContent')}}</slot>
        </div>
    </div>
</template>

<script type="text/babel">

    export default {
        data() {
            return {};
        },
        props: {
            theme: {
                type: String,
                default: 'gray' // gray or dark
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .comp-no-data {
        padding: 32px 0;
        text-align: center;
        color: #bbb;

        &--gray {
            color: #bbb;
        }

        &--dark {
            color: #63657e;
        }

        .text-box {
            text-align: center;

            .order-no-icon {
                width: 458px;
                height: 264px;
                /*background: url("../assets/img/no.png") no-repeat center;*/
                background-size: contain;
                display: block;
                margin-top: 130px;
            }

            > .row {
                &:first-child {
                    font-size: 12px;
                }

                &:nth-child(2) {
                    font-size: 12px;
                }
            }
        }
    }
</style>
