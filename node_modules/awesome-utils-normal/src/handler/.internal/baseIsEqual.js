import isObjectLike from './isObjectLike.js';
import baseIsEqualDeep from './baseIsEqualDeep';
/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison 无序比较
 *  2 - Partial comparison 部分比较
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
	if (value === other) {
		return true;
	}
	if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
		return value !== value && other !== other;
	}
	return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

export default baseIsEqual;
