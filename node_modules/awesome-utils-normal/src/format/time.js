/* eslint-disable indent */
//时间格式化
const parseTime = (type, value) => {
	let result;
	if (value === true) {
		result = '是';
	} else if (value === false) {
		result = '否';
	} else if (typeof value === 'number' && value.toString().length >= 13) {
		const oDate = new Date(value);
		const year = oDate.getFullYear();
		const month = oDate.getMonth() + 1;
		const day = oDate.getDate();
		const hour = oDate.getHours();
		const minute = oDate.getMinutes();
		const seconds = oDate.getSeconds();
		switch (type) {
			case 0: //01-05
				result = `${format(month)}-${format(day)}`;
				break;
			case 1: // 11:11
				result = `${format(hour)}:${format(minute)}`;
				break;
			case 2: //2017-08
				result = `${format(year)}-${format(month)}`;
				break;
			case 3: //2017-08-15
				result = `${format(year)}-${format(month)}-${format(day)}`;
				break;
			case 4: //2017-08-15 13:37
				result = `${format(year)}-${format(month)}-${format(day)} ${format(hour)}:${format(minute)}`;
				break;
			case 5: //2017-08-15 13:39:03
				result = `${format(year)}-${format(month)}-${format(day)} ${format(hour)}:${format(minute)}:${format(seconds)}`;
				break;
			default:
				result = value;
		}
	} else {
		result = value;
	}
	return result;
};

//两位数补齐
const format = (value) => {
	return value >= 10 ? value + '' : '0' + value;
};

//时间差
/**
 * @param {number} time
 * @param {string} type
 * @returns {string}
 */
const formatTime = (time, type) => {
	if (String(time).length === 10) {
		// 秒
		time = parseInt(time) * 1000;
	} else {
		// 毫秒
		time = +time;
	}
	const d = new Date(time);
	const now = Date.now();

	const diff = (now - d) / 1000;

	if (diff < 30) {
		return '刚刚';
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前';
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前';
	} else if (diff < 3600 * 24 * 2) {
		return '1天前';
	}
	if (type) {
		return parseTime(time, type);
	} else {
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
	}
};

export { parseTime, formatTime };
