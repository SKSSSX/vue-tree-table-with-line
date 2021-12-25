// 生成随机字符串
export const randomGenerate = (length) => {
	const chars = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	];
	if (!Number.isInteger(length) || length <= 0) {
		console.error('请检查输入随机字符串长度是否为正整数！');
		return 'Error';
	}
	let randomString = '';
	for (let i = 0; i < length; i++) {
		randomString += chars[Math.floor(Math.random() * chars.length)];
	}
	return randomString;
};
