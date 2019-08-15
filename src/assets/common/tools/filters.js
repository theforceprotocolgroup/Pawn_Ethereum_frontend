/**
 * @file
 * @auth jinguangguo
 * @date 2016/9/19
 */

//修正乘法的精度问题
let accMul = function (arg1, arg2) {
	let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
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

/**
 * 保留小数位
 * @param name
 * @param str
 * @param length
 * @returns {string}
 */
let fix = function (name, str, length) {
	str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
	length = isNaN(parseInt(length)) ? 2 : parseInt(length);
	let pow = Math.pow(10, length);
	//修正小数乘一个整数出小数的情况,乘完之后再进行四舍五入取0位小数
	return ((Math[name](accMul(str, pow))) / pow).toFixed(length);
};

export default {
	// 金额展示
	// 示例: {{item.moneyChange|sign}} {{item.moneyChange|abs|currency(' ')}} G
	sign(str) { // 判断正负
		str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
		//3-16前写法 return str != 0 ? str > 0 ? '+' : '-' : '';
		return str >= 0 ? '+' : '-';
	},
	sign2(str) { // 判断正负2
		str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
		return str != 0 ? str > 0 ? '↑' : '↓' : '';
	},
	abs(str) { // 绝对值
		str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
		return Math.abs(str);
	},
	fix(str, length) { // 四舍五入后保留多少位小数
		return fix('round', str, length);
	},
	floorFix(str, length) { // 去尾后保留多少位小数
		return fix('floor', str, length);
	},
	ceilFix(str, length, isGop) { // 向上进一后保留多少位小数 最后一个参数默认就是两位，true为果仁数设置为三位
		if (str === 0 || (str + '').indexOf('.') < 0) {
			return (isGop === undefined ? (str + '.00') : (str + '.000'));
		}
		return ((str + '').split('.')[1].length && (str + '').split('.')[1].length === (length ? length : 2)) ? parseFloat(str) : fix('ceil', parseFloat(str), length);
	},
	tail(str, length) { // 尾数
		str = typeof str !== 'string' ? '' : parseFloat(str);
		length = isNaN(parseInt(length)) ? 4 : Math.abs(parseInt(length));
		return str.substr(-length);
	},
	omit(str, length, replace) { // 省略
		let l = 5; // 默认保留长度
		length = isNaN(parseInt(length)) ? l : parseInt(length); //没传length isNaN()返回true
		return str.length > length ? (str.substring(0, length) + (replace || '...')) : str;
	},
	phone(str) { // 手机省略
		let phoneReg = /^((13[0-9])|(14[57])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
		return phoneReg.test(str) ? String(str).substr(0, 3) + '****' + String(str).substr(-4) : str;
	},
	address: function(str, length) { // 地址省略
		return this.omit(str, 8, '**********');
	},
	rmb: function (str, hasPlus) {
		if (str === '' || typeof str == 'undefined') {
			return '0.00';
		} else {
			// 正负数
			var negative = str < 0 ? '-' : (hasPlus ? '+' : '');
			// 整数部分
			var integer = parseInt(str = Math.abs(+str || 0)
					.toFixed(2), 10) + '';
			var part = (part = integer.length) > 3 ? part % 3 : 0;

			return (part ? integer.substr(0, part) + ',' : '')
				+ integer.substr(part).replace(/(\d{3})(?=\d)/g, '$1' + ',')
				+ ('.' + Math.abs(str - integer).toFixed(2).slice(2));
		}
	},
	fomatGopCount : function (num) {   //对千位取整
		var hundred = parseInt((num % 1000)).toString().length >= 3 ? parseInt((num % 1000)/100) : 0; //百位数
		if(num % 1000 > 0){
			return hundred >= 5 ? parseInt((num + 1000)/1000)*1000 : parseInt(num/1000)*1000;
		}else{
			return num;
		}
	},
	numFormat: function(_num){
		let numString = _num.toString();
		let ePos = numString.indexOf('e')>-1 ? numString.indexOf('e') :(numString.indexOf('E')>-1 ? numString.indexOf('E') : false);
		if(ePos >= 0 && ePos != false){
			let pow = numString.slice(ePos+1);
			let powNum = Math.abs(parseInt(pow));
			return _num.toFixed(powNum+1);
		} else {
			return _num;
		}
	}
};