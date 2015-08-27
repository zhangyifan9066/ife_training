var suggestData = ['task', 'task001', 'task23', 'TASk5', 'task6sdf', 't', 'Tad', 'taw', 'td', 'tcaa'];

function getSuggestData(e) {
    var keyCode = e.which || e.keyCode;
    if (keyCode === 38 || keyCode === 40 || keyCode === 13)
        return;
    var target = e.target || e.srcElement;
    var input = trim(target.value);
    var filter = Array.prototype.filter || function(fun/*, thisArg*/) {
        'use strict';

        if (this === undefined || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
    
    var result = input === '' ? [] : filter.call(suggestData, function(obj) {
        var reg = new RegExp('^' + this, 'i');
        return reg.test(obj) ? true : false;
    }, input).sort(function(a, b) {
        a = a.toLowerCase(); b = b.toLowerCase();
        if (a>b) return 1;
        if (a <b) return -1;
        return 0;
    }).slice(0, 10);
    
    var i, len = result.length;
    var suggest = $('.search-suggest');
    var suggestItems = suggest.children;
    
    if (len === 0) {
        suggest.className = suggest.className.replace(' search-suggest-active', '');
    } else {
        if (!(/ search-suggest-active/.test(suggest.className)))
            suggest.className += ' search-suggest-active';
    }
    
    for (i = 0; i < 10; i++) {
        //if (keyCode !== 38 && keyCode !== 40)
        suggestItems[i].className = suggestItems[i].className.replace(' search-suggest-select');
        if (i < len) {
            var reg = new RegExp('^(' + input + ')', 'i');
            suggestItems[i].innerHTML = result[i].replace(reg, '<span>$1</span>');
            if (!(/ search-suggest-active/.test(suggestItems[i].className)))
                suggestItems[i].className += ' search-suggest-active';
        } else {
            suggestItems[i].innerHTML = '';
            suggestItems[i].className = suggestItems[i].className.replace(' search-suggest-active', '');
        }
    }
}

function keyNavItem(e) {
    var keyCode = e.which || e.keyCode;
    if (keyCode === 38 || keyCode === 40) {
        var suggest = $('.search-suggest');
        var suggestItems = suggest.children;
        var activeReg = / search-suggest-active/;
        var curReg = / search-suggest-select/;
        
        if (!activeReg.test(suggest.className))
            return;
        var i, item, totalItem = 0, curIndex = -1;
        for (i = 0; i < 10; i++) {
            item = suggestItems[i];
            if (activeReg.test(item.className))
                totalItem++;
            if (curReg.test(item.className))
                curIndex = i;
        }
        
        if (curIndex < 0) {
            if (keyCode === 38)
                suggestItems[totalItem - 1].className += ' search-suggest-select';
            else if (keyCode === 40)
                suggestItems[0].className += ' search-suggest-select';
        } else {
            var curItem = suggestItems[curIndex];
            curItem.className = curItem.className.replace(' search-suggest-select', '');
            if (keyCode === 38) {
                if (curIndex === 0)
                    suggestItems[totalItem - 1].className += ' search-suggest-select';
                else
                    curItem.previousElementSibling.className += ' search-suggest-select';
            } else if (keyCode === 40) {
                if (curIndex === totalItem - 1)
                    suggestItems[0].className += ' search-suggest-select';
                else
                    curItem.nextElementSibling.className += ' search-suggest-select';
            }
        }
    }
}

function mouseNavItem(e, target) {
    var suggest = $('.search-suggest');
    var suggestItems = suggest.children;
    
    for (var i = 0; i < 10; i++) {
        suggestItems[i].className = suggestItems[i].className.replace(' search-suggest-select', '');
    }
    
    target.className += ' search-suggest-select';
}

function selectItem(ele) {
    var suggest = $('.search-suggest');
    var suggestItems = suggest.children;
    $('.search-input').value = ele.textContent;
    
    for (var i = 0; i < 10; i++) {
        suggestItems[i].innerHTML = '';
        suggestItems[i].className = suggestItems[i].className.replace(' search-suggest-active', '');
        suggestItems[i].className = suggestItems[i].className.replace(' search-suggest-select', '');
    }
    suggest.className = suggest.className.replace(' search-suggest-active', '');
}

$.on('.search-input', 'keyup', getSuggestData);
$.on('.search-input', 'keydown', keyNavItem);
$.delegate('.search-suggest', 'li', 'mouseover', mouseNavItem);
$.on('.search-input', 'keydown', function(e) {
    var keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
        var suggestItems = $('.search-suggest').children;
        for (var i = 0; i < 10; i++) {
            if (/ search-suggest-select/.test(suggestItems[i].className))
                break;
        }
        selectItem(suggestItems[i]);
    }
});
$.delegate('.search-suggest', 'li', 'click', function(e, target) {
    selectItem(target);
});