//深拷贝
const deepCopy = (source) => {
	if (!source) {
		return source;
	}
	let sourceCopy = source instanceof Array ? [] : {};
	for (let item in source) {
		sourceCopy[item] = typeof source[item] === 'object' ? deepCopy(source[item]) : source[item];
	}
	return sourceCopy;
};

export { deepCopy };
