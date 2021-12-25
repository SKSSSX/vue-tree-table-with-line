// 浅拷贝
const shallowCopy = (source, target = {}) => {
	var key;
	for (key in source) {
		if (source.hasOwnProperty(key)) {
			// 意思就是proto上面的属性,我不拷贝
			target[key] = source[key];
		}
	}
	return target;
};

export { shallowCopy };
