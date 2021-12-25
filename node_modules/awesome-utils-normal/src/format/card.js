// 银行卡四位分割
const formatCardNo = (str) => {
	if (str) {
		str = str.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
		return str;
	} else {
		return '';
	}
};

export { formatCardNo };
