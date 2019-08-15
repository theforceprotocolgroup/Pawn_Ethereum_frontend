<template>
    <div id="area" class="area">
        <div class="area-box" v-for="(item, index) in areaList" @click="chooseArea(index)"
             :class="{'area-selected':isSelected[index]}">
            <span class="area-name">{{item.zh}}</span>
            <span class="area-mark" v-show="isSelected[index]"></span>
        </div>
    </div>
</template>
<script>
    import filters from '../assets/common/tools/filters';
    import get from '../assets/common/tools/get.js';
    import areas from '../assets/common/areas.js';

    let fromPage = decodeURIComponent(get.data.fromPage);
    export default {
        filters,
        props: [],
        components: {},
        data() {
            return {
                areaList: [],
                isSelected: [],
            }
        },
        created() {
            let list = areas.areas;

            this.areaList = list.sort(
                function compareFunction(param1, param2) {
                    return param1.zh.localeCompare(param2.zh, "zh");
                }
            );

            let len = this.areaList.length;
            for (let i = 0; i < len; i++) {
                this.isSelected[i] = false;
            }
        },
        mounted() {

        },
        methods: {
            chooseArea(index) {
                this.isSelected.forEach((item, index) => {
                    this.isSelected[index] = false;
                });
                this.isSelected[index] = true;
                let areaNum = this.areaList[index].pre;
                let areaFormat = this.areaList[index].format;
                // cookie.setCookie('kAreaNow',areaNum);
                // cookie.setCookie('kFormatNow',areaFormat);
                // window.localStorage.setItem('kAreaNow',areaNum);
                // window.localStorage.setItem('kFormatNow',areaFormat);
                this.$forceUpdate();
                setTimeout(() => {
                    this.locationUrl(fromPage, areaNum);
                }, 500);
            },
            locationUrl(fromPage, areaNum) {
                this.$router.push({
                    path: 'login',
                    query: {
                        kAreaNow: areaNum
                    }
                })
                // this.$router.push({name: 'login',params: { kAreaNow: areaNum }});
                // console.log(fromPage);
                // return false;
                //   location.href = fromPage;
                /*switch(_lf){
                    case 'redpacket':
                        location.href = './redpacket.html?lf=area&packetId='+id+'&pageType=ch#/';
                        break;
                    case 'redpacket_en':
                        location.href = './redpacket.html?lf=area&packetId='+id+'&pageType=en#/en';
                        break;
                    case 'bind':
                        location.href = './bind-mobile.html?lf=area&packetId='+id+'&pageType=ch#/';
                        break;
                    case 'bind_en':
                        location.href = './bind-mobile.html?lf=area&packetId='+id+'&pageType=en#/en';
                        break;
                    case 'change':
                        location.href = './change-mobile.html?lf=area&packetId='+id+'&pageType=ch#/';
                        break;
                    case 'change_en':
                        location.href = './change-mobile.html?lf=area&packetId='+id+'&pageType=en#/en';
                        break;
                }*/
            }
        }
    }
</script>
<style lang="scss" scoped>
    /**
   * @file
   * @author z.y
   * @date 2018/01/24
   */
    @import '../assets/scss/style';

    html, body {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        background: #fff;
        -webkit-overflow-scrolling: touch;
    }

    a {
        text-decoration: none;
    }

    .app {
        padding-bottom: .15rem;
    }

    .area {
        $colorSelected: #f8f8f8;
        $colorGold: #b89d71;
        $colorBorder: #e8e8e8;
        $colorFont: #222;

        &-box {
            position: relative;
            height: 70px;
            line-height: 70px;
            padding-left: 30px;

            &::after {
                position: absolute;
                bottom: 0;
                left: 30px;
                content: '';
                display: block;
                width: 100%;
                height: 1px; /*no*/
                background-color: $colorBorder;
            }

            &:last-child {
                &::after {
                    display: none;
                }
            }
        }

        &-selected {
            background-color: $colorSelected;
        }

        &-name {
            display: inline-block;
            line-height: 70px;
            vertical-align: middle;
            font-size: 28px;
            color: $colorFont;
        }

        &-mark {
            position: absolute;
            top: 10px;
            right: 78px;
            display: block;
            width: 50px;
            height: 40px;
            background-image: url('../assets/img/selected.png');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
</style>
