<template>
    <div class="orderDetail">
        <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../assets/img/return_back.png" alt class="image-center"/>
      </span>
            详情
        </div>
        <div class="loading" v-if="!isLoad">Loading...</div>
        <div
                class="orderDetail-top"
                :class="{
      LOANED:item.status === 'LOANED',
      BORROWED: item.status === 'PLEDGED' && item.borrowed,
      CANCEL: item.status === 'CANCELED',
      OK: item.status === 'CLOSED' || item.status === 'REPAID' || item.status === 'FORCE_REPAID'
      }"
                v-if="isLoad"
        >
            <!--<img src="../assets/img/cancel.png" class="orderDetail-top-icon">-->
            <!--<label class="orderDetail-top-status">取消</label>-->
            <!-- 还款中 status=LOANED && borrowed=true -->
            <i class="orderDetail-top-icon"></i>
            <label class="orderDetail-top-status">{{item.status | changeToText}}</label>
            <span class="orderDetail-top-num">
        <template
                v-if="item.repaymentAmount"
        >{{item.repaymentAmount | decimals_symbol(item.borrowedSymbol)}}</template>
        <template v-else>{{item.borrowedAmount | decimals_symbol(item.borrowedSymbol)}}</template>
        <label class="small">{{item.borrowedSymbol}}</label>
      </span>
            <p class="orderDetail-top-percent">
                {{$t('borrow.currPledgeRate')}}{{(item.pledgeRate * 100) |
            decimals_4}}%
            </p>
        </div>
        <ul class="orderDetail-bottom" v-if="isLoad">
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.orderType')}}</label>
                <label class="orderDetail-bottom-detail-content">{{item.isBorrowed | borrowStatus}}</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.tokenAmount')}}</label>
                <label class="orderDetail-bottom-detail-content">
                    {{item.borrowedAmount |
                decimals_symbol(item.borrowedSymbol)}} {{item.borrowedSymbol}}
                </label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.annualInterest')}}</label>
                <label class="orderDetail-bottom-detail-content">{{item.interestRate * 100 | decimals_4}}%</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.pledgeAmount')}}</label>
                <label class="orderDetail-bottom-detail-content">
                    {{item.pledgeAmount |
                decimals_symbol(item.pledgeSymbol)}} {{item.pledgeSymbol}}
                </label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.loanTerm')}}</label>
                <label class="orderDetail-bottom-detail-content">{{item.days}}{{$t('borrow.days')}}</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.createDate')}}</label>
                <label
                        class="orderDetail-bottom-detail-content"
                >{{item.createdDate | datefmt('YYYY-MM-DDHH:mm')}}</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.orderID')}}</label>
                <label class="orderDetail-bottom-detail-content">{{item.orderNumber}}</label>
            </li>
            <li class="orderDetail-bottom-detail">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.deadline')}}</label>
                <label
                        class="orderDetail-bottom-detail-content"
                >{{item.deadline | datefmt('YYYY-MM-DD HH:mm')}}</label>
            </li>

            <li class="orderDetail-bottom-detail" v-if="item.status==='REPAID'">
                <label class="orderDetail-bottom-detail-title">{{$t('borrow.closeTime')}}</label>
                <label
                        class="orderDetail-bottom-detail-content"
                >{{item.repaymentDate | datefmt('YYYY-MM-DD HH:mm')}}</label>
            </li>
        </ul>
        <span
                class="orderDetail-button"
                @click="cancelOrder"
                v-if="isLoad && item.status==='PLEDGED' && isShowButtons"
        >{{$t('borrow.cancelOrder')}}</span>

        <!--待还款-->
        <div class="orderDetail-btns" v-if="isLoad && item.status ==='LOANED' && isShowButtons">
      <span
              class="orderDetail-btns-li"
              :class="{gray:item.pledgeRate < 0.5}"
              @click="toSupplyPage"
      >{{$t('borrow.coverNow')}}</span>
            <span
                    class="orderDetail-btns-li blueBg"
                    v-if="isRequesting === false"
                    @click.stop.prevent="returnMoney"
            >{{$t('borrow.repayNow')}}</span>
            <span
                    class="orderDetail-btns-li blueBg"
                    v-if="isRequesting === true"
            >{{$t('borrow.repaying')}}..</span>
        </div>

        <div class="m_50" v-if="isLoad && item.status==='PLEDGED' && isShowButtons">
            <p class="rulesDetail">*{{$t('text.orderRulesOne')}}：</p>
            <p
                    class="rulesDetail"
            >·{{$t('text.orderRulesTwoPre')}}{{item.days}}{{$t('text.orderRulesTwoSuf')}};</p>
            <p
                    class="rulesDetail"
            >·{{$t('text.orderRulesThreePre')}}{{item.days}}{{$t('text.orderRulesThreeSuf')}}≥66%；</p>
        </div>
        <popup :content="popContent" :show="showPop" @sure="confirmPopup" @cancel="cancelPopup"></popup>
    </div>
</template>

<script>
    import popup from "../components/Popup/index";
    import service from "../assets/js/commonService";
    import ercStake from "../assets/js/ercContract";
    import config from "../assets/js/config";
    import {floorFix} from "../assets/js/filter";

    export default {
        components: {
            popup
        },
        data() {
            return {
                coinsInfo: null,
                accountName: null, //钱包名称
                item: null,
                order_id: null,
                isShowButtons: false, //只有出借的某些状态有按钮，借出没有按钮
                isLoad: false,
                isRequesting: false,
                popContent: "确认取消订单？",
                showPop: false
            };
        },
        created() {
            this.order_id = this.$route.query.list;
        },
        filters: {
            borrowStatus(val) {
                return val ? "借币" : "出借";
            }
        },
        mounted() {
            let that = this;
            that.getOrderDetail();
            this.accountName = window.ethereum.selectedAddress;
            this.coinsInfo = JSON.parse(config.getItem("config"));
        },
        methods: {
            cancelPopup() {
                this.showPop = false;
            },
            confirmPopup() {
                this.showPop = false;
                ercStake.ercStake.cancelorder(this.item.orderNumber, this.item.orderHash);
            },
            cancelOrder() {
                this.showPop = true;
            },
            getOrderDetail() {
                service.borrowOrderDetail({
                    orderNumber: this.order_id,
                    account: window.ethereum.selectedAddress
                }).then(rep => {
                    console.log(rep);
                    this.item = rep.data;
                    this.isShowButtons = this.item.isBorrowed;
                    this.isLoad = true;
                });
            },
            toSupplyPage() {
                if (this.item.pledgeRate < 0.5) {
                    return false;
                }
                this.$router.push({
                    name: "supply",
                    query: {
                        list: this.item.orderNumber,
                        orderHash: this.item.orderHash,
                        borrowedSymbol: this.item.borrowedSymbol,
                        currentRate: this.item.pledgeRate,
                        pledgeAmount: this.item.pledgeAmount,
                        pledgeSymbol: this.item.pledgeSymbol,
                        pledgeAccount: this.item.pledgeAccount
                    }
                });
            },
            returnMoney() {
                let currentAccount = window.ethereum.selectedAddress;
                if (currentAccount.toLowerCase() !== this.item.initiator.toLowerCase()) {
                    window.error("当前用户不是借款人")
                }
                this.isRequesting = true;
                let orderData = {
                    borrower: window.ethereum.selectedAddress,
                    hash: this.item.orderHash,
                    token: this.item.borrowedAccount,
                    repayAmount: this.item.chainRepaymentAmount,
                    id: this.item.orderNumber
                };
                console.log(orderData);
                console.log(this.item);
                ercContract.ercStake.approve(
                    orderData.token,
                    window.ethereum.selectedAddress,
                    orderData.repayAmount,
                    function (transactionHash) {
                        console.log("loading...", transactionHash);
                    }, function (err, success) {
                        if (err) {
                            //approve 失败
                            console.log("Approve error: ", err);
                            return;
                        }
                        if (success) {
                            ercStake.ercStake.repay(
                                orderData.borrower,
                                orderData.hash,
                                orderData.token,
                                orderData.repayAmount,
                                orderData.id
                            ).then(receipt => {
                                console.log("contract.methods.Repay.receipt: ", receipt);
                                if (receipt.events.Repay) {
                                    let respBorrower = receipt.events.Repay.returnValues.borrower;
                                    let txHash = receipt.transactionHash;
                                    console.log("repay respBorrower: ", respBorrower);
                                    console.log("repay txHash: ", txHash);
                                    if (currentAccount.toLowerCase() === respBorrower.toLowerCase()) {
                                        window.success('success');
                                        service.repay({
                                            txId: txHash,
                                            orderNumber: order_id,
                                            account: fromAddress_
                                        }).then(rep => {
                                            if (rep.status === 200) {
                                                window.location.href = '/#/order?list=' + order_id;
                                            } else {
                                                window.error(rep.msg);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                );
            },
            toBack() {
                this.$router.push({path: "myorder"});
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
        margin-top: 100px;
        .loading {
            padding-top: 200px;
            text-align: center;
            font-size: 30px;
            color: #333;
        }

        &-top {
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

            &-percent {
                position: absolute;
                bottom: 60px;
                color: #f1a600;
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

            .blueBg {
                background: #5a70f3;
                box-shadow: 1px 3px 1px #cfd7f3; /*no*/
                color: #fff;
            }

            .gray {
                background: #dcdcdc !important;
                border: 1px solid #dcdcdc; /*no*/
                color: #fff !important;
            }
        }

        .m_50 {
            margin: 50px 0;

            .rulesDetail {
                color: #9197a7;
                font-size: 22px;
                text-align: left;
                padding: 0 35px;
            }
        }
        .back-container {
            .button-box {
                margin: 50px auto;
                width: 80%;
                height: 80px;
                background: #4184ff;
                border-radius: 50px;
                line-height: 80px;
                text-align: center;
                color: #fff;
                font-size: 30px;
                font-weight: 600;
                box-shadow: 0px 9px 29px 0px rgba(204, 205, 206, 0.36);
            }
        }
    }
</style>
