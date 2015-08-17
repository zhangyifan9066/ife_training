/**
 * Judge if obj is an Array
 * @param {Object} obj - Any object
 * @return {Boolean} Return true if obj is an Array, false otherwise
 */ 
function isArray(obj) {
    return '[object Array]' === '[object ' + Object.prototype.toString.call(obj) + ']';
}

/**
 * Judge if obj os a Function
 * @param {Object} obj 
 * @return {Boolean} Return true if obj is a Function, false otherwise
 */ 
function isFunction(obj) {
    return 'object Function]' === '[object ' + Object.prototype.toString.call(obj) + ']';
}

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 *
 * @returns {Boolean} 检查结果
 */
function isPlain(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
        //一般的情况，直接用toString判断
        Object.prototype.toString.call(obj) !== "[object Object]" ||
        //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
        //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
        //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
        !('isPrototypeOf' in obj)
       ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
}

function cloneObject(src) {
    var result, i, len;
    if (!src)
        return src;
    if ({}.toString.call(src).search(/Number|String|Boolean/) >= 0) {
        if (typeof src === 'object')
            return new Object(src);
        else
            return src;
    }
    if (isArray(src)) {
        result = [];
        len = src.length;
        for (i = 0; i < len; ++i)
            result[i] = cloenObjec(src[i]);
        return result;
    }
    if ({}.toString.call(src) === '[object Date]') {
        return new Date(src.toString());
    }
    if (isPlain(src)) {
        result = {};
        Object.getOwnPropertyNames(src).forEach(function (ele, idx, arr) {
            var des = Object.getOwnPropertyDescriptor(src, ele);
            typeof des.value !== undefined && (des.value = cloneObject(des.value));
            Object.defineProperty(result, ele, des);
        });
        return result;
    }
}


function uniqArray(arr) {
    return arr.reduce(function (prevValue, curValue, idx, arr) {
        prevValue.indexOf(curValue) < 0 && prevValue.push(curValue);
        return prevValue;
    }, []);
}


function uniqArray1(arr) {
    var len = arr.length, ele, i;
    var result = arr.slice(0);
    while (len-- > 0) {
        ele = result[len];
        i = len;
        while (i-- > 0) {
            if (ele === result[i]) {
                result.splice(len, 1);
                break;
            }
        }
    }
    return result;
}


function simpleTrim(str) {
    var len = str.length;
    var i, j, c;
    
    for (i = 0; i < len; i++) {
        c = str.charAt(i);
        if (c !== ' ' && c !== '\t')
            break;
    }
    
    for (j = len - 1; j >= 0; j--) {
        c = str.charAt(j);
        if (c !== ' ' &&  c !== '\t')
            break;
    }
    
    return str.slice(i, j + 1);
}


function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}


function each(arr, fn) {
    var i, len = arr.length;
    for (i = 0; i < len; i++)
        fn(arr[i], i);
}


function getObjectLength(obj) {
    var cnt = 0, key;
    
    for (key in obj) {
        if ({}.hasOwnProperty.call(obj, key))
            cnt++;
    }
    
    return cnt;
}


function isEmail(emailStr) {
    return /^[\w.+-]+\@([\w-]+\.)+\w+$/.test(emailStr);
}


function isMobilePhone(phone) {
    return /^1\d{2}(-?)\d{4}\1\d{4}$/.test(phone);
}




var a = 1;
var b = new Number(3);

console.dir(cloneObject(a));
console.dir(cloneObject(b));

var arr = [1, 4, 'fff', 1, 10, 1, 'asd', 10, 'eee', 'fff', 10];
console.log(uniqArray(arr));
console.log(uniqArray1(arr));
console.log(uniqArray3(arr));
