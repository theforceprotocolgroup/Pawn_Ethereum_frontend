<template>
    <div class="orderDetail">
        <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../assets/img/return_back.png" alt class="image-center"/>
      </span>
            立即补仓
        </div>
        <div class="loading" v-if="!isLoad">Loading...</div>
        <div class="orderDetail-top" v-if="isLoad">
            <label class="orderDetail-top-status green">{{$t('borrow.coverPledgeAssets')}}</label>
            <span class="orderDetail-top-num red">
        {{(currentRate * 100) | decimals_4}}
        <label class="small">%</label>
      </span>
            <p class="orderDetail-top-percent">{{$t('borrow.closeLine')}}{{(closingRate * 100)}}%</p>
        </div>
        <ul class="orderDetail-bottom" v-if="isLoad">
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.targetPledgeRate')}}</label>
                <label class="orderDetail-bottom-detail-content">180.0000%</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.pledgeToken')}}</label>
                <label class="orderDetail-bottom-detail-content">{{pledgeSymbol}}</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.coverPledgeAssets')}}</label>
                <label class="orderDetail-bottom-detail-content">{{amount | decimals_symbol(pledgeSymbol)}}</label>
            </li>
        </ul>
        <span class="orderDetail-button" @click="toSupply">{{$t('borrow.coverNow')}}</span>
        <pop
                :content="popContent"
                :show="showPop"
                :status="resStatus"
                @sure="confirmPop"
                @cancel="closePop"
        ></pop>
    </div>
</template>

<script>
    import pop from "@/components/children/web3pop";

    import service from "../assets/js/commonService";
    import config from "../assets/js/config";
    import ercStake from "../assets/js/ercContract";

    export default {
        components: {
            pop
        },
        data() {
            return {
                popContent: "借币中",
                showPop: false,
                resStatus: 0,

                coinsInfo: null,
                item: null,
                order_id: null,
                orderType: null,
                isLoad: false,
                borrowedSymbol: null,
                amount: 0,
                currentRate: null,
                closingRate: null,
                orderHash: null,
                chainData: {
                    tokenContract: null,
                    marginAmount: null,
                    orderHash: null,
                    borrower: null
                }
            };
        },
        created() {
            this.order_id = this.$route.query.list;
            this.orderHash = this.$route.query.orderHash;
            this.borrowedSymbol = this.$route.query.borrowedSymbol;
            this.currentRate = this.$route.query.currentRate;
            this.pledgeAmount = this.$route.query.pledgeAmount;
            this.pledgeSymbol = this.$route.query.pledgeSymbol;
            this.pledgeAccount = this.$route.query.pledgeAccount;
        },
        mounted() {
            this.getSupplyInit();
        },
        methods: {
            toSupply() {
                if (this.chainData.marginAmount <= 0) {
                    window.warning("不需要补仓");
                    return;
                }
                let self = this;
                ercStake.ercStake.approve(
                    this.chainData.tokenContract,
                    window.ethereum.selectedAddress,
                    this.chainData.marginAmount,
                    function (transactionHash) {
                        console.log("loading...", transactionHash);
                        self.showPop = true;
                        self.resStatus = 0;
                    },
                    function (err, success) {
                        if (err) {
                            self.resStatus = 110;
                            console.log("Approve error: ", err);
                            return;
                        }
                        if (success) {
                            self.showPop = true;
                            self.resStatus = 5;
                            let data = {
                                borrower: self.chainData.borrower,
                                hash: self.chainData.orderHash,
                                token: self.chainData.tokenContract,
                                amount: self.chainData.marginAmount
                            };
                            console.log(data);
                            self.isCallback = true;
                            self.resStatus = 0;
                            ercStake.ercStake.callMargin(data.borrower, data.hash, data.token, data.amount)
                                .then(receipt => {
                                    console.log(receipt);
                                    console.log("contract.methods.Callmargin.receipt: ", receipt);
                                    if (receipt.events.Callmargin) {
                                        window.success("success");
                                        let txHash = receipt.transactionHash;
                                        service.supply({
                                            txId: txHash,
                                            orderNumber: self.order_id,
                                            account: window.ethereum.selectedAddress
                                        }).then(rep => {
                                            if (rep.status === 200) {
                                                self.resStatus = 6;
                                                window.location.href = "/#/order?list=" + self.order_id;
                                            } else {
                                                self.resStatus = 110;
                                                window.error(rep.msg);
                                            }
                                        });
                                    }
                                }).catch(function (error) {
                                self.resStatus = 110;
                                console.log(error);
                                window.error(error.message);
                            });
                        }
                    }
                );
            },
            getSupplyInit() {
                service.getSupplyInit({orderNumber: this.order_id}).then(rep => {
                    this.isLoad = true;
                    if (rep.status === 200) {
                        this.amount = rep.data.amount;
                        this.closingRate = rep.data.closingRate;
                        this.chainData = rep.data.chainData;
                    }
                });
            },
            toBack() {
                this.$router.back();
            },
            /**
             * @description pop弹框
             *
             */
            closePop() {
                this.showPop = false;
            },
            confirmPop() {
                this.showPop = false;
            },
            statusPop() {
                this.showPop = true;
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../assets/scss/base";

    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 100px;
        line-height: 100px;
        font-size: 36px;
        text-align: center;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        border-bottom: 1px solid #e2e2e2;
        background: #fff;
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

    .orderDetail {
        background: #fff;
        .loading {
            padding-top: 200px;
            text-align: center;
            font-size: 30px;
            color: #333;
        }

        &-top {
            margin-top: 100px;
            text-align: center;
            padding: 95px 0 122px 0;
            position: relative;

            &-icon {
                width: 78px; /*no*/
                height: 70px; /*no*/
                background: url("../assets/img/help.png") no-repeat center;
                background-size: contain;
                margin: 0 auto 10px auto;
                display: block;
            }

            &-status {
                font-size: 30px;
                color: #4db834;
                display: block;
                text-align: center;
            }

            &-num {
                color: #0c1e48;
                font-size: 68px;
                margin-top: 65px;
                display: block;
                text-align: center;

                .small {
                    font-size: 30px;
                }
            }

            .red {
                color: orangered;
            }

            &-percent {
                position: absolute;
                bottom: 60px;
                /*color: #f1a600;*/
                color: #333;
                font-size: 26px;
                width: 100%;
                text-align: center;
            }
        }

        .LOANED {
            > i {
                /*还款中,待还款*/
                background: url("../assets/img/status/help.png") no-repeat center;
                background-size: contain;
            }
        }

        .BORROWED {
            /*借币中*/
            > i {
                background: url("../assets/img/status/borrowing.png") no-repeat center;
                background-size: contain;
            }

            > label {
                color: #fccb35 !important;
            }
        }

        .CANCEL {
            /*已取消*/
            > i {
                background: url("../assets/img/status/cancel.png") no-repeat center;
                background-size: contain;
            }

            > label {
                color: #bfbfbf !important;
            }
        }

        .OK {
            /*已完成*/
            > i {
                background: url("../assets/img/status/alreday.png") no-repeat center;
                background-size: contain;
            }

            > label {
                color: #4184ff !important;
            }
        }

        &-bottom {
            background: #fafbff;
            margin: 0 30px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            padding: 30px;

            &-detail {
                width: 100%;
                margin-bottom: 25px;

                &-title {
                    text-align: left;
                    float: left;
                    font-size: 24px;
                    color: #9197a7;
                    display: inline-block;
                }

                &-content {
                    text-align: right;
                    float: right;
                    font-size: 24px;
                    color: #465062;
                    display: inline-block;
                }
            }
        }

        &-button {
            display: block;
            width: 270px;
            height: 90px;
            line-height: 90px;
            border-radius: 50px;
            border: 1px solid #5a70f3; /*no*/
            font-size: 30px;
            margin: 90px auto;
            text-align: center;
        }

        &-btns {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 90px;
            line-height: 90px;
            margin: 90px 0;

            &-li {
                display: block;
                width: 270px;
                height: 90px;
                line-height: 90px;
                border-radius: 50px;
                border: 1px solid #5a70f3; /*no*/
                font-size: 30px;
                margin: 0 auto;
                text-align: center;
            }
        }
    }
</style>
