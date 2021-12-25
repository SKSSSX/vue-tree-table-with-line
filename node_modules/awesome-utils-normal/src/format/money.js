/**
 * 金额千分符,并且保留n位小数
 * @param s 需要格式化的金额
 * @param n 小数位数
 * @param defaultValue 默认值
 * 使用方法：formatThousandthMoney(price, 2, '')
 */
const formatThousandthMoney = (s, n, defaultValue) => {
	if (typeof s === 'undefined') {
		return '0.00';
	}
	if (!s && typeof s !== 'undefined' && s !== 0 && defaultValue === undefined) {
		return '0.00';
	}
	if (!s && typeof s !== 'undefined' && s !== 0 && defaultValue !== undefined) {
		return defaultValue;
	}
	n = n > 0 && n <= 20 ? n : 2;
	// eslint-disable-next-line no-useless-escape
	s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
	var l = s.split('.')[0].split('').reverse();
	var r = s.split('.')[1];
	var t = '';
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length && l[i + 1] !== '-' ? ',' : '');
	}
	return t.split('').reverse().join('') + '.' + r;
};

export { formatThousandthMoney };
