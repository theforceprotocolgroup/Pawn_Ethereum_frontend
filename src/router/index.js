import Vue from 'vue'
import Router from 'vue-router'
import Introduce from '@/components/introduce'
import Home from '@/components/home'
import Borrow from '@/views/borrow/borrow'
import borrowDetail from '@/views/borrow/borrowDetail'
import Lend from '@/views/lend/lendDetail'
import LoadMore from '@/views/lend/loadMore'
import OrderDetail from '@/components/orderDetail'
import Account from '@/components/account'
import Asset from '@/components/asset'
import Transaction from '@/components/transaction'
import Pop from '@/components/children/pop'
import myOrder from '@/components/myOrder'
import About from '@/components/aboutUs'
import Supply from '@/components/supplyPledge'
import Protocol from '@/components/protocol'
import ChooseAere from '@/components/Main'
import config from '../assets/js/config';
import settingEmail from '@/components/settingEmail'

Vue.use(Router);

export default new Router({
    routes: [{
            path: '*',
            redirect: '/home'
        },
        {
            path: '/',
            name: 'introduce',
            component: Introduce,
            beforeEnter: (to, from, next) => {
                if (config.getItem_local('token')) {
                    next({
                        path: 'home'
                    });
                } else {
                    next();
                }
            }
        }, {
            path: '/home',
            name: 'home',
            component: Home,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/setting-email',
            name: 'SettingEmail',
            component: settingEmail,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/borrow',
            name: 'borrow',
            component: Borrow,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/borrow-detail',
            name: 'borrowDetail',
            component: borrowDetail,
            props: (route) => {
                return {
                    paramsBaseData: route.query.paramsBaseData
                }
            },
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/lend',
            name: 'lend',
            component: Lend,
            props: (route) => {
                return {
                    paramsBaseData: route.query.list
                }
            },
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/order',
            name: 'order',
            component: OrderDetail,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/account',
            name: 'account',
            component: Account,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/asset',
            name: 'asset',
            component: Asset,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/transaction',
            name: 'transaction',
            component: Transaction,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/pop',
            name: 'pop',
            component: Pop,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/myorder',
            name: 'myorder',
            component: myOrder,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/loadmore',
            name: 'loadmore',
            component: LoadMore,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/chooseAere',
            name: 'chooseAere',
            component: ChooseAere,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        },
        {
            path: '/supply',
            name: 'supply',
            component: Supply,
            beforeEnter: (to, from, next) => {
                if (!config.getItem_local('token')) {
                    next({
                        path: 'login'
                    });
                } else {
                    next();
                }
            }
        }, {
            path: '/protocol',
            component: Protocol
        }
    ]
})