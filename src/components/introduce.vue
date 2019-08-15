<template>
    <div class="introduce">
        <img src="../assets/img/logo.png" alt="" class="logo">
        <p class="content">币币贷是基于ETH网络的去中心化质押借贷平台，借款人通过将Token质押到智能合约获得稳定币，出借人将稳定币通过智能合约借给借款人，获得利息收益。</p>
        <p class="price">*币种价格来源blockCC：</p>
        <p>https://block.cc/</p>
        <p>币种价格每5分钟更新一次</p>
        <span class="btn" @click="tologin">立即使用</span>
    </div>
</template>

<script>
    import config from '../assets/js/config';
    import ercStake from '../assets/js/ercContract';


    export default {
        name: 'introduce',
        data() {
            return {
                accountName: null
            }
        },
        mounted() {
            this.accountName = window.ethereum.selectedAddress;
        },
        methods: {
            tologin() {
                config.setItem('accountName',"0x");
                localStorage.setItem('token',"0x");
                this.$router.push({path: 'home'});
            }
        }
    }
</script>

<style scoped lang="scss">
    .introduce {
        margin-top: 90px;
        text-align: center;
        .logo {
            width: 120px;
            height: 180px;
        }
        p {
            text-align: left;
            padding: 0 30px;
            color: #9297a8;
            font-size: 28px;
        }
        .content {
            margin-top: 80px;
        }
        .content-1 {
            margin-top: 50px;
        }
        .price {
            margin-top: 100px;
        }
        .btn {
            position: fixed;
            bottom: 100px;
            left: 37%;
            display: inline-block;
            width: 200px;
            height: 50px;
            line-height: 50px;
            border-radius: 10px;
            color: #fff;
            text-align: center;
            background: rgba(90, 112, 243, 255);
            margin-top: 100px;
        }
    }
</style>
