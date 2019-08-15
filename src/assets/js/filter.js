import moment from 'moment'
import BigNumber from "../js/bignumber"

/**
 * 保留小数位数，默认4位
 * @param num
 * @returns {*}
 */
let decimals_4 = (num, fixedNum) => {
    if (num) {
        if (fixedNum === 0) {
            fixedNum = 0;
        } else {
            fixedNum = fixedNum || 4;
        }
        num = floorFix(num, fixedNum);
    } else if (num === 0) {
        return '0.0000';
    }
    return num;
};
//修正乘法的精度问题
let accMul = function (arg1, arg2) {
    let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};

let floorFix = (str, length) => { // 去尾后保留多少位小数
    let fix = function (name, str, length) {
        str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
        length = isNaN(parseInt(length)) ? 4 : parseInt(length);
        let pow = Math.pow(10, length);
        //修正小数乘一个整数出小数的情况,乘完之后再进行四舍五入取0位小数
        return ((Math[name](accMul(str, pow))) / pow).toFixed(length);
    };
    return fix('floor', str, length);
};

let formatName = (name) => {
    if (!name) {
        return '';
    }
    return name.substr(0, 8) + '****' + name.substr(32);
};


let formatPhone = (phone) => {
    if (!phone) {
        return '';
    }
    phone = phone + '';
    return phone.substr(0, 3) + "****" + phone.substr(7)
};

let changeToText = (status) => {
    let orderType = null;
    // let _lang = localStorage.getItem('lang');
    let _lang ='zh-cn'
    let name = null;
    if (_lang === 'zh-cn') {
        switch (status) {
            case 'CREATED':
                name = '已创建';
                break;
            case 'PLEDGE_PENDING':
                name = '质押确认中';
                break;
            case 'PLEDGED':
                name = '借币中';
                break;
            case 'CANCEL_PENDING':
                name = '取消确认中';
                break;
            case 'CANCELED':
                name = '已取消';
                break;
            case 'LOAN_PENDING':
                name = '出借确认中';
                break;
            case 'BUY_IN_PENDING':
                name = '加仓确认中';
                break;
            case 'REPAYMENT_PENDING':
                name = '还款确认中';
                break;
            case 'CLOSE_PENDING':
                name = '平仓确认中';
                break;
            case 'LOANED':
                name = '账单已成立(还款中)';
                break;
            case 'CLOSED':
                name = '已完成';
                break;
            case 'REPAY_PENDING':
                name = '还款确认中';
                break;
            case 'REPAID':
                name = '已完成';
                break;
            case 'FORCE_REPAY_PENDING':
                name = '强制还款确认中';
                break;
            case 'FORCE_REPAID':
                name = '已完成';
                break;
        }
    } else {
        switch (status) {
            case 'CREATED':
                name = 'Created';
                break;
            case 'PLEDGE_PENDING':
                name = 'Confirming';
                break;
            case 'PLEDGED':
                name = 'Confirming';
                break;
            case 'CANCEL_PENDING':
                name = 'Confirming';
                break;
            case 'CANCELED':
                name = 'Cancelled';
                break;
            case 'LOAN_PENDING':
                name = 'Confirming';
                break;
            case 'BUY_IN_PENDING':
                name = 'Confirming';
                break;
            case 'REPAYMENT_PENDING':
                name = 'Confirming';
                break;
            case 'CLOSE_PENDING':
                name = 'Confirming';
                break;
            case 'LOANED':
                name = 'Established(Repaying)';
                break;
            case 'CLOSED':
                name = 'Completed';
                break;
            case 'REPAY_PENDING':
                name = 'Confirming';
                break;
            case 'REPAID':
                name = 'Completed';
                break;
            case 'FORCE_REPAY_PENDING':
                name = 'Confirming';
                break;
            case 'FORCE_REPAID':
                name = 'Completed';
                break;
        }
    }
    return name;
};

let datefmt = function (input, fmtstring) {
    if (input) {
        return moment(input).format(fmtstring);
    } else {
        return '--';
    }
};

let decimals_symbol = function (input) {
    if (input) {
        let num = new BigNumber(input).toFixed(8);
        return Number(num.toString());
    } else {
        return Number(0);
    }
};

let chainBalanceConvert = function (input, decimal) {
    if (input) {
        let pow = new BigNumber(10).exponentiatedBy(decimal);
        let num = new BigNumber(input).dividedBy(pow).toFixed(4);
        return Number(num.toString());
    } else {
        return Number(0);
    }
};

export {
    decimals_4,
    decimals_symbol,
    chainBalanceConvert,
    formatPhone,
    formatName,
    changeToText,
    datefmt,
    floorFix,
}