/*
 * @Author: batman
 * @Date: 2020-01-14 11:21:52
 * @LastEditors: batman
 * @LastEditTime: 2020-02-23 18:11:20
 * @Description: 返回一个新的自由数组副本(时间复杂度O(n²))
 */
import createSet from './createSet';
import setToArray from './setToArray';
import arrayIncludesWith from './arrayIncludesWith';
/** 用于数组优化的最大阈值 */
const LARGE_ARRAY_SIZE = 200;

/**
 * @private
 * @param {Array} array 待处理的数组
 * @param {Function} [iteratee] 迭代器（递归）执行每个元素
 * @param {Function} [comparator] 比较器
 * @returns {Array} 返回一个新的自由数组副本
 * @usage 当前只能应用无迭代器，无比较器的情况
 */
const baseUniq = (array, iteratee, comparator) => {
	let index = -1;
	let isCommon = true; // 初始化为普通函数
	let includes = () => {}; // 向下兼容，内部使用使用while做循环
	const { length } = array;
	const result = []; // 对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址，const命令只是保证指向的地址不变，并不保证该地址的数据不变，所以将对象声明为常量必须非常小心。
	let seen = result; // seen 指向result，节省了存储空间，空间复杂度不变

	/** 针对于多种情况的前置判断 start */
	if (comparator) {
		// 如果有comparator，标注为非普通函数处理
		isCommon = false;
		includes = arrayIncludesWith; // includes 判重方法更换为 arrayIncludesWith
	} else {
		// 判断是否有迭代器，没有则设为Set类型（支持Set类型的环境直接调用生成Set实例去重）
		const set = iteratee ? null : createSet(array);
		if (set) {
			return setToArray(set); //Set类型转数组（Set类型中不存在重复元素，相当于去重了）直接返回
		}
	}
	/** 针对于多种情况的前置判断 end */

	outer: while (++index < length) {
		// 循环遍历每一个元素
		let value = array[index]; // 取出当前遍历值
		const computed = iteratee ? iteratee(value) : value;
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			// 普通模式执行下面代码
			let seenIndex = seen.length; // 取当前容器的长度为下一个元素的索引值
			while (seenIndex--) {
				// 循环seen（拷贝数组）-> 从后往前 和 result（原数组）-> 从前往后，比较
				if (seen[seenIndex] === computed) {
					// 匹配到重复的元素
					continue outer; // 直接跳出当前循环直接进入下一轮outer:
				}
			}
			if (iteratee) {
				// 有迭代器的情况下
				seen.push(computed); // 结果推入缓存容器
			}
			result.push(value); // 追加入结果数组
		}
		// 非正常数组处理模式下，调用includes方法，判断缓存容器中是否存在重复的值
		else if (!includes(seen, computed, comparator)) {
			if (seen !== result) {
				// 非普通模式下，result和seen内存空间地址不一样
				seen.push(computed);
			}
			result.push(value); // 追加入结果数组
		}
	}
	return result; // 循环完成，返回去重后的数组
};
export default baseUniq;
