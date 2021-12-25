import baseUniq from './.internal/baseUniq';
/**
 * @description 数组去重函数，数组中的元素是对象，数组，等用的
 * @category Array
 * @param {Array} 需要去重的数组
 * @param {Function} 唯一值比较器
 * @return: {Array} 去重后的数组
 * @usage:
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 *
 */

const uniqWith = (array, comparator) => {
	comparator = typeof comparator === 'function' ? comparator : undefined;
	return array && array.length ? baseUniq(array, undefined, comparator) : [];
};

export default uniqWith;
