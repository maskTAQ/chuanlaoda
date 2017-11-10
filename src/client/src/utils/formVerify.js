// 策略对象
const strategies = {
    isNoEmpty: function (value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    isNoSpace: function (value, errorMsg) {
        if (value.trim() === '') {
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMsg) {
        if (value.trim().length < length) {
            return errorMsg;
        }
    },
    maxLength: function (value, length, errorMsg) {
        if (value.length > length) {
            return errorMsg;
        }
    },
    isPhone: function (value, errorMsg) {
        if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
            return errorMsg;
        }
    },
    isEmail: function (value, errorMsg) {
        if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)) {
            return errorMsg;
        }
    }
}

// 验证类
const Validator = function () {
    this.cache = [];
}
Validator.prototype.add = function (value, rules, callback) {
    let itemRule = [];
    rules.forEach(rule => {
        const strategyAry = rule
            .strategy
            .split(':');
        const errorMsg = rule.errorMsg;
        const strategy = strategyAry.shift();
        strategyAry.unshift(value);
        strategyAry.push(errorMsg);
        itemRule.push(function () {
            return strategies[strategy].apply(this, strategyAry);
        })
    });
    itemRule.callback = callback || function () {};
    this
        .cache
        .push(itemRule);
}

Validator.prototype.start = function () {
    let result = [];
    this
        .cache
        .forEach(itemRules => {
            let errorMsg = [];
            itemRules.forEach(rule => {
                let e = rule();
                if (e) {
                    result.push(e);
                    errorMsg.push(e);
                }

            });
            if (errorMsg.length) {
                itemRules.callback(errorMsg);
            }

        });
    return result;
};
export default Validator;
