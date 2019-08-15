<template>
    <div class="list">
        <div v-if="list && list.length > 0">
            <div class="detail" v-for="item in list" :key="item.index">
                <div v-if="(pageFrom=='home' && item.status !== 'CANCELED')||(pageFrom=='more')">
                    <p class="detail-title">
                        <i class="detail-title-icon"></i>
                        <label class="detail-title-number">{{item.initiator | formatName}}</label>
                    </p>
                    <div class="detail-bottom">
                        <div class="detail-bottom-content">
              <span class="big orange">
                {{item.interestRate * 100 | decimals_4(0)}}
                <i
                        class="percent"
                >.{{item.interestRate * 100 | subNum(4)}}%</i>
              </span>
                            <label class="small">{{$t('borrow.annualInterest')}}</label>
                        </div>
                        <div class="detail-bottom-content">
                            <p class="name">
                                {{$t('borrow.tokenAmount')}}
                                <label
                                        class="orange medium"
                                >{{item.borrowedAmount | decimals_symbol(item.borrowedSymbol)}}</label>
                                <i class="orange smallName">{{item.borrowedSymbol}}</i>
                            </p>
                            <p class="name m_t_30">
                                {{$t('borrow.loanTerm')}}
                                <label class="black">{{item.days}}{{$t('borrow.days')}}</label>
                            </p>
                        </div>
                        <div class="detail-bottom-content" v-if="!item.loanable">
                            <span class="btn unable">{{item.status | changeToText}}</span>
                        </div>
                        <div class="detail-bottom-content" v-if="item.loanable">
                            <span class="btn" @click="toLendDetailPage(item)">{{$t('borrow.lendNow')}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <loading-more :has-more="hasMore" :title="title"></loading-more>
        </div>
        <div v-if="list.length == 0">
            <no-data></no-data>
        </div>
    </div>
</template>

<script>
    import config from "../../assets/js/config";
    import {floorFix} from "../../assets/js/filter";
    import NoData from "../../components/NoData.vue";
    import LoadingMore from "../../components/loading-more/loading-more.vue";

    export default {
        components: {NoData, LoadingMore},
        props: {
            list: {
                type: Array,
                default: []
            },
            from: {
                type: String,
                defult: "home"
            },
            hasMore: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "更多"
            }
        },
        data() {
            return {
                floorFix,
                accountName: null,
                btnName: this.$t("borrow.lendNow"),
                pageFrom: this.from
            };
        },
        filters: {
            subNum(num, decimal) {
                num = floorFix(num, decimal) + "";
                return num.split(".")[1];
            }
        },
        mounted() {
            this.accountName = window.ethereum.selectedAddress;
        },
        methods: {
            toLendDetailPage(item) {
                this.$router.push({
                    path: "lend",
                    query: {
                        list: JSON.stringify(item),
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .detail {
        padding: 0 25px;
        background: #fff;
        margin-bottom: 26px;

        &-title {
            /*height: 75px;*/
            display: flex;
            padding-top: 36px;
            padding-bottom: 26px;
            align-items: center;
            border-bottom: 1px solid rgba(239, 239, 244, 1);

            &-icon {
                width: 38px;
                height: 38px;
                background: url("../../assets/img/etcicon.png") no-repeat center;
                background-size: contain;
                display: inline-block;
            }

            &-number {
                color: #697d91;
                font-size: 24px;
            }
        }

        &-bottom {
            display: flex;
            height: 162px;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 40px;
            padding-top: 30px;

            &-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                .big {
                    font-size: 58px;
                    font-weight: 400;
                }

                .percent {
                    font-size: 32px;
                    font-style: normal;
                }

                .medium {
                    font-size: 28px;
                }

                .orange {
                    color: #ff7120;
                }

                .small {
                    font-size: 22px;
                    color: #95a0ab;
                }

                .name {
                    font-size: 24px;
                    color: #697d91;
                }

                .m_t_30 {
                    margin-top: 25px;
                }

                .smallName {
                    font-size: 22px;
                    font-style: normal;
                }

                .black {
                    color: #465062;
                }

                .btn {
                    font-size: 28px;
                    color: #fff;
                    background: #5170eb;
                    width: 160px;
                    height: 62px;
                    line-height: 62px;
                    border-radius: 40px;
                    text-align: center;
                }

                .unable {
                    background: #dcdcdc !important;
                }
            }
        }
    }
</style>