/*
 * @Author: batman
 * @Date: 2020-02-23 18:04:23
 * @LastEditors: batman
 * @LastEditTime: 2020-02-23 18:07:54
 * @Description: 检查这个值value是否已经存在于已归类的数组之中
 */
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
const arrayIncludesWith = (array, value, comparator) => {
	var index = -1,
		length = array == null ? 0 : array.length;

	while (++index < length) {
		if (comparator(value, array[index])) {
			return true;
		}
	}
	return false;
};

export default arrayIncludesWith;
