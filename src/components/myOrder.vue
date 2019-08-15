<template>
    <div class="order">
        <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../assets/img/return_back.png" alt class="image-center"/>
      </span>
            我的订单
        </div>
        <ul class="order-tabs">
            <li
                    class="order-tabs-tab"
                    :class="{choose:type==='ALL'}"
                    @click="changeType('ALL')"
            >{{$t('order.allRecords')}}
            </li>
            <li
                    class="order-tabs-tab"
                    :class="{choose:type==='IN_PROGRESS'}"
                    @click="changeType('IN_PROGRESS')"
            >{{$t('order.inProgress')}}
            </li>
            <li
                    class="order-tabs-tab"
                    :class="{choose:type==='COMPLETED'}"
                    @click="changeType('COMPLETED')"
            >{{$t('order.completed')}}
            </li>
            <li
                    class="order-tabs-tab"
                    :class="{choose:type==='CANCELED'}"
                    @click="changeType('CANCELED')"
            >{{$t('order.canceled')}}
            </li>
        </ul>
        <template v-if="!isLoading">
            <scroll
                    ref="scroll"
                    class="order-content"
                    :data="list"
                    :pullup="pullup"
                    @scrollToEnd="loadMore"
            >
                <div class="order-list wrapper">
                    <div
                            class="order-list-content"
                            @click.stop.prevent="toLendPage(item)"
                            v-for="(item,index) in list"
                            :key="index"
                    >
                        <p class="order-list-content-top">
                            <label class="order-list-content-top-name">
                                {{item.isBorrowed | borrowStatus}}
                                {{item.borrowedAmount | decimals_symbol(item.borrowedSymbol) }} {{item.borrowedSymbol}}
                            </label>
                            <label class="order-list-content-top-status blue">{{item.status | changeToText}}</label>
                        </p>
                        <p class="order-list-content-bottom">
              <span class="order-list-content-bottom-name">
                {{$t('borrow.currPledgeRate')}}
                <label
                        class="order-list-content-bottom-name-percent"
                >{{item.pledgeRate * 100 | decimals_4}}%</label>
              </span>
                            <span
                                    class="order-list-content-bottom-date"
                            >{{$t('borrow.deadline')}}:{{item.deadline | datefmt('YYYY-MM-DD HH:mm')}}</span>
                        </p>
                        <span class="order-list-content-other"></span>
                    </div>
                    <loading-more :has-more="hasMore" :title="loadingTitle"></loading-more>
                </div>
            </scroll>
        </template>
        <div v-if="list.length === 0" style="margin-top: 90px;">
            <no-data></no-data>
        </div>
    </div>
</template>

<script>
    import service from "../assets/js/commonService";
    import config from "../assets/js/config";
    import Scroll from "./children/scroll_init.vue";
    import LoadingMore from "../components/loading-more/loading-more.vue";
    import NoData from "../components/NoData.vue";

    export default {
        data() {
            return {
                hasData: false,
                type: "ALL",
                walletName: null,
                list: [],
                counter: 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
                num: 5, // 一次显示多少条
                pageStart: 0, // 开始页数
                pageEnd: 0, // 结束页数
                isShowLoading: false,
                pulldown: true,
                hasMore: false,
                loadingTitle: "下拉加载更多",
                pullup: true,
                probeType: 3,
                pageNo: 0,
                pageSize: 20,
                isLoading: true
            };
        },
        components: {
            Scroll,
            LoadingMore,
            NoData
        },
        created() {
            this.getOrders();
            this.walletName = window.ethereum.selectedAddress;
        },
        filters: {
            borrowStatus(val) {
                return val ? "借币" : "出借";
            }
        },
        methods: {
            loadMore() {
                if (!this.hasMore) {
                    this.loadingTitle = this.$t("text.noMoreContent");
                    return;
                }
                this.pageNo++;
                this.getOrders();
            },
            toLendPage(item) {
                this.$router.push({
                    path: "order",
                    query: {
                        list: item.orderNumber
                    }
                });
            },
            changeType(type) {
                this.type = type;
                this.pageNo = 0;
                this.list = [];
                this.getOrders();
            },
            getOrders() {
                service
                    .getMyOrders({
                        sort: "orderNumber,desc",
                        page: this.pageNo,
                        size: this.pageSize,
                        status: this.type,
                        account: window.ethereum.selectedAddress
                    })
                    .then(
                        rep => {
                            this.isLoading = false;
                            if (rep.status === 200) {
                                this.list = [];
                                let curr_list = rep.data.content;
                                if (curr_list.length > 0) {
                                    this.list.push(...curr_list);
                                }
                                if (rep.data.last) {
                                    this.hasMore = false;
                                    this.loadingTitle = "";
                                } else {
                                    this.hasMore = true;
                                    this.loadingTitle = this.$t("tips.pullDownForMore");
                                }
                            } else {
                            }
                        },
                        error => {
                        }
                    );
            },
            toBack() {
                this.$router.push({ path: "account" });
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../assets/scss/base";

    .header {
        position: fixed;
        z-index: 110;
        top: 0;
        left: 0;
        right: 0;
        height: 100px;
        line-height: 100px;
        font-size: 36px;
        text-align: center;
        font-family: PingFangSC-Semibold;
        background: #fff;
        border-bottom: 1px solid #e2e2e2;
        font-weight: 600;
        color: #0c1e48;
        .icon-arrow {
            position: inherit;
            top: 0;
            left: 0;
            right: 0;
            width: 80px;
            height: 100px;
            img {
                margin-bottom: 30px;
                width: 20px;
            }
        }
    }

    .order {
        position: fixed;
        top: 100px;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f5f6f7;

        &-tabs {
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            border-bottom: 1px solid #e0e0e0;
            padding: 0 30px;
            position: fixed;
            top: 100px;
            left: 0;
            right: 0;
            z-index: 99;
            background: #fff;

            &-tab {
                font-size: 28px;
                line-height: 90px;
                color: #97a0ac;
                position: relative;
            }

            .choose {
                color: #111e4b;
            }

            .choose::after {
                content: "";
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background-color: #5170ec;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }

        .order-content {
            position: fixed;
            top: 191px;
            left: 0;
            right: 0;
            bottom: 0;

            .order-list {
                overflow: hidden;
                background: #fff;

                &-content {
                    box-sizing: border-box;
                    padding: 35px 86px 35px 28px;
                    position: relative;
                    border-bottom: 1px solid #e0e0e0;

                    &-top {
                        color: #0c1e48;
                        font-size: 30px;

                        &-status {
                            float: right;
                            font-size: 28px;
                        }

                        .blue {
                            color: #5170ec;
                        }

                        .green {
                            color: #52ae14;
                        }

                        .ok {
                            color: #0c1e48;
                        }

                        .gray {
                            color: #9297a8;
                        }
                    }

                    &-bottom {
                        margin-top: 20px;

                        &-name {
                            color: #465062;
                            font-size: 26px;

                            &-percent {
                                color: #ec5151;
                            }
                        }

                        &-date {
                            color: #9297a8;
                            float: right;
                        }
                    }

                    &-other {
                        width: 12px;
                        height: 23px;
                        background: url("../assets/img/arrow.png") no-repeat center;
                        background-size: contain;
                        display: inline-block;
                        position: absolute;
                        right: 30px;
                        bottom: 70px;
                    }
                }
            }

            .order-no {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                &-icon {
                    width: 458px;
                    height: 264px;
                    background: url("../assets/img/no.png") no-repeat center;
                    background-size: contain;
                    display: block;
                    margin-top: 130px;
                }

                &-text {
                    color: #5684ff;
                    font-size: 30px;
                    margin-top: 68px;
                    display: block;
                }
            }
        }
    }
</style>
