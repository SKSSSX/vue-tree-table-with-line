/*
 * @Author: batman
 * @Date: 2019-12-21 06:40:50
 * @LastEditors  : batman
 * @LastEditTime : 2019-12-21 22:58:24
 * @Description: 格式化手机号的工具函数
 */
const formatPhone = (phoneNum) => {
	let phone = '';
	if (typeof phoneNum !== 'string') {
		phone = String(phoneNum);
	} else {
		phone = phoneNum;
	}
	if (/^1\d{10}$/i.test(phone)) {
		return phone.replace(/\s/g, '').replace(/(\d{3})(\d{0,4})(\d{0,4})/, '$1 $2 $3');
	} else {
		throw new Error('输入的不是手机号');
	}
};

export { formatPhone };
