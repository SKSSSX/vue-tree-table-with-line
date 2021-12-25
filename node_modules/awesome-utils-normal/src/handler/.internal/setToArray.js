/**
 * 将“set”转换为其值的数组
 *
 * @private
 * @param {Object} set 要转换的set集合.
 * @returns {Array} 返回其值的数组
 */
const setToArray = (set) => {
	let index = -1;
	const result = new Array(set.size);
	set.forEach((value) => {
		result[++index] = value;
	});
	return result;
};
export default setToArray;
