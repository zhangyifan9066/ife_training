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
    return '[object Function]' === '[object ' + Object.prototype.toString.call(obj) + ']';
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
    for (i = len - 1; i >= 0; i--)
        fn(arr[i], i, arr);
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


function addClass(element, newClassName) {
    var newClasses = ({}.toString.call(newClassName) === '[object String]') ? newClassName.mathc(/\S+/g) : [];
    if (element.nodeType === 1) {
        var oldClassName = element.className || '';
        var oldClasses = oldClassName.match(/\S+/g);
        var i, len;
        newClasses.forEach(function (ele, idx, arr) {
            len = oldClasses.length;
            for (i = 0; i < len; i++) {
                if (ele !== oldClasses[i])
                    oldClasses.push(ele);
            }
        });
        
        element.className = oldClasses.join(' ');
    }
}


function removeClass(element, oldClassName) {
    var oldClasses = ({}.toString.call(oldClassName) === '[object String]') ? oldClassName.mathc(/\S+/g) : [];
    if (element.nodeType === 1) {
        var className = element.className || '';
        var classes = className.match(/\S+/g);
        var i, len;
        oldClasses.forEach(function (ele, idx, arr) {
            len = classes.length;
            for (i = 0; i < len; i++) {
                if (ele === classes[i])
                    classes.splice(i, 1);
            }
        });
        
        element.className = classes.join(' ');
    }
}


function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNod.parentNode;
}


function getPosition(element) {
    var cur = element, parent, left, top;
    if (!(element instanceof HTMLElement))
        return null;
    while (cur) {
        left += element.offsetLeft;
        top += element.offsetTop;
        cur = cur.offsetParent;
    }
    
}


function $(selector) {
    if ({}.toString.call(selector) !== '[object String]')
        return null;
    var selectors = selector.trim().split(/\s+/);
    
    var idReg = /^#((?:[^\W0-9]|[-_])+[\w-_]*)$/;
    var tagReg = /^\w+$/;
    var classReg = /^.((?:[^\W0-9]|[-_])+[\w-_]*)$/;
    var attrReg = /^\[((?:[^\W0-9]|[-_])+[\w-_]*)(?:=(["'])?([^"'\]]+)\2)?\]$/;
    
    function hasClass(ele, className) {
        if (!className || !ele)
            return false;
        var allClasses = ele.className;
        if (!allClasses)
            return false;
        allClasses = allClasses.split(/\s+/);
        var i, len = allClasses.length;
        for (i = 0; i < len; i++) {
            if (allClasses[i] === className)
                return true;
        }
        return false;
    }
    
    var selectFn = {
        'id': function (ele, id) {
            return [document.getElementById(id)];
        },
        'tag': function (ele, tag) {
            return [].slice.call(ele.getElementsByTagName(tag), 0);
        },
        'class': function(ele, className) {
            var result = [];
            if (ele.getElementsByClassName) {
                return [].slice.call(ele.getElementsByClassName(className), 0);
            } else {
                var allChildren = ele.getElementsByTagName('*');
                var i, len = allChildren.length;
                for (i = 0; i < len; i++) {
                    if (hasClass(allChildren[i], className))
                        result.psuh(allChildren[i]);
                }
            }
            return result;
        },
        'attr': function(ele, attr, value) {
            var result = [];
            var allChildren = ele.getElementsByTagName('*');
            var i, len = allChildren.length;
            for (i = 0; i < len; i++) {
                if (value !== undefined) {
                    if (allChildren[i].getAttribute(attr) === value)
                        result.push(allChildren[i]);
                } else {
                    if (allChildren[i].hasAttribute(attr))
                        result.push(allChildren[i]);
                }
            }
            return result;
        }
    };
    
    function select(ele, selector) {
        var result, type, params = [ele];
        if (result = selector.match(idReg)) {
            type = 'id';
            params.push(result[1]);
        } else if (result = selector.match(tagReg)) {
            type = 'tag';
            params.push(result[0]);
        } else if (result = selector.match(classReg)) {
            type = 'class';
            params.push(result[1]);
        } else if (result = selector.match(attrReg)) {
            type = 'attr';
            params.push(result[1], result[3]);
        }
        
        if (!type)
            return null;
        
        result = selectFn[type].apply(null, params);
        if (result.length === 0)
            return null;
        return result;
    }
    
    var queue = [document], buf = [];
    var i, len = selectors.length;
    var ele, newEles;
    for (i = 0; i < len; i++) {
        while (queue.length !== 0) {
            ele = queue.shift();
            newEles = select(ele, selectors[i]);
            if (newEles !== null) {
                if (i === len - 1) {
                    return newEles[0];
                }
                buf = buf.concat(newEles);
            }
        }
        queue = buf;
        buf = [];
    }
    return null;
}


function addEvent(element, event, listener) {
    if (element.attachEvent) {
        element['e' + event + listener] = listener;
        element[event + listener] = function() {
            element['e' + event + listener](window.event);
        };
        element.attachEvent('on' + event, element[event + listener]);
    } else if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
}


function removeEvent(element, event, listener) {
    if (element.detachEvent) {
        element.detachEvent('on' + event, element[event + listener]);
        delete element[event + listener];
        delete element['e' + event + listener];
    } else {
        element.removeEventListener(event, listener, false);
    }
}


function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function (event) {
        var target = event.target || event.srcElement;
        if (target && target.tagName.toUpperCase() === tag.toUpperCase()) {
            listener.call(null, event, target);
        }
    });
}


function addClickEvent(element, listener) {
    addEvent(element, 'click', listener);
}


function addEnterEvent(element, listener) {
    addEvent(element, 'keypress', function(event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === 13) {
            listener.call(element, event);
        }
    });
}

$.on = function (selector, event, listener) {
    addEvent($(selector), event, listener);
};

$.un = function (selector, event, listener) {
    removeEvent($(selector), event, listener);
};

$.click = function (selector, listener) {
    addClickEvent($(selector), listener);
};

$.enter = function (selector, listener) {
    addEnterEvent($(selector), listener);
};

$.delegate = function (selector, tag, eventName, listener) {
    delegateEvent($(selector), tag, eventName, listener);
}


function isIE() {
    return /msie (\d+\.\d+)/i.test(navigator.userAgent) || 'ActiveXObject' in window
        ? (document.documentMode || + RegExp['\x241']) : -1;
}


function setCookie(cookieName, cookieValue, expiredays) {
    var expire = new Date();
    if (typeof expiredays === 'number') {
        expire.setDate(expire.getDate() + expiredays);
    }
    
    document.cookie = cookieName + '=' + encodeURIComponent(cookieValue) + (typeof expiredays === 'number') ? '; expires=' + expire.toUTCString() : "";
}


function getCookie(cookieName) {
    var re = new RegExp('(?:^| |;)' + cookieName + '=([^;]*)(;|$)');
    var result = document.cookie.match(re);
    
    if (!result)
        return null;
    return result[1];
}


function ajax(url, option) {
    var option = option || {};
    var data = dataToString(option.data || {});
    var type = (option.type || 'GET').toUpperCase();
    var successHandler = isFunction(option.onsuccess) ? option.onsuccess : function() {};
    var failHandler = isFunction(option.onfail) ? option.onfail : function() {};
    
        
    function dataToString(data) {
        var dataArray = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                dataArray.push(encodeURIComponent(key + '=' + data[key]));
            }
        }
        return dataArray.join('&');
    }

    url = url ? encodeURIComponent(url) : '';
    if (type === 'GET' && data !== '') {
        url += '?' + data;
    }
    
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open(type, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            successHandler(xhr, xhr.responseText);
        } else {
            failHandler(xhr);
        }
    };
    
    if (type === 'GET') {
        xhr.send();
    } else if (type === 'POST') {
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(data);
    }
}