import baseUniq from './.internal/baseUniq.js';
/**
 * @description 数组去重函数，数组中的元素是基本数据类型(undefined、null、number、boolean、string、Symbol)，引用数据类型（set，array，function，object，）数组中可能包含单一或者多种数据类型两种情况;
 * @category Array
 * @param {Array} 需要去重的数组
 * @return: {Array} 去重后的数组
 * @usage:
 *
 * let array = [2, 1, 2];
 * _.uniq(array);
 * // => [2, 1]
 *
 */

const uniq = (array) => {
	return array && array.length ? baseUniq(array) : [];
};

export default uniq;
