/*
 * @Author: batman
 * @Date: 2019-12-21 23:00:33
 * @LastEditors  : batman
 * @LastEditTime : 2020-01-20 14:01:38
 * @Description: 表单合法性校验,多数用于WAP，h5, app 等移动端的开发，（用ES6语法重新编写过）
 */
Function.prototype.before = function (beforefn) {
	var _self = this; // 保存原函数的引用
	return function () {
		// 返回了原函数和新函数的“代理”函数
		// 执行新函数，且保证this不被劫持，新函数的接受的参数也会被原封不动地传入原函数，新函数在原函数之前执行。
		if (beforefn.apply(this, arguments) === false) {
			// beforefn 返回 false 的情况直接 return, 不再执行后面的原函数
			return;
		}
		return _self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，并且保证this不被劫持
	};
};

Function.prototype.after = function (afterfn) {
	var _self = this;
	return function () {
		var ret = _self.apply(this, arguments);
		afterfn.apply(this, arguments);
		return ret;
	};
};

const strategies = {
	isNonEmpty: function (value, name) {
		if (value === '') {
			return name + '不能为空';
		}
	},
	minLength: function (value, length, name) {
		if (value.length < length) {
			return name + '长度不能小于' + length + '位';
		}
	},
	maxLength: function (value, length, name) {
		if (value.length > length) {
			return name + '长度不能大于' + length + '位';
		}
	},
	isMobile: function (value, name) {
		if (!/(^1[0-9]{10}$)/.test(value)) {
			return name + '格式不正确';
		}
	},
};

class Validator {
	constructor(cache) {
		this.cahce = cache;
	}
	add(dom, rules) {
		var self = this;
		for (let [strategy, value] of rules.entries()) {
			(function () {
				var strategyAry = strategy.split(':');
				var name = value;
				self.cache.push(function () {
					var strategy = strategyAry.shift();
					strategyAry.unshift(dom.value);
					strategyAry.push(name);
					if (strategies[strategy]) {
						return strategies[strategy].apply(dom, strategyAry);
					} else {
						console.error('请在 validator.js 中新增 ' + strategy + ' 校验规则');
					}
				});
			})();
		}
	}
	start() {
		for (var i = 0, validatorFuc; (validatorFuc = this.cache[i++]); ) {
			var errorMsg = validatorFuc();
			if (errorMsg) {
				return errorMsg;
			}
		}
	}
}

export { Validator };

/*  调用示例 */
/* var registerForm = document.getElementById('registerForm');

let map1 = new Map([
    ["isNonEmpty", "用户名"],
    ["minLength:10", "用户名"]
]), map2 = new Map([
    ["minLength:6", "密码"]
]), map3 = new Map([
    ["isMobile", "手机号"]
]);

var validatorFunc = function () {
    var validator = new Validator();

    validator.add( registerForm.userName, map1);
    validator.add( registerForm.password, map2);
    validator.add( registerForm.phoneNumber, map3);

    var errorMsg = validator.start();
    return errorMsg;
};

registerForm.onsubmit = function () {
    var errorMsg = validatorFunc();
    if( errorMsg ) {
        alert( errorMsg );
        return false;
    }
    map1 = null;
    map2 = null;
    map3 = null;

}.before( function () {
    console.log('aaaa');
}); */
