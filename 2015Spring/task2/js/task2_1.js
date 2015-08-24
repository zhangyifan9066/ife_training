// step1
function showHobby1() {
    var hobbies = $('#text1').value;
    var arr = hobbies.split(',');
    each(arr, function (ele, index, arr) {
        ele = trim(ele);
        if (ele === '') {
            arr.splice(index, 1);
        } else {
            arr[index] = ele;
        }
    });
    arr = uniqArray1(arr);
    var newEle = document.createElement('p');
    newEle.innerHTML = arr.length ? arr.join(', ') : '没有填写兴趣爱好';
    $('#btn1').parentNode.appendChild(newEle);
}

$.click('#btn1', showHobby1);

// step2
function showHobby2() {
    var hobbies = $('#text2').value;
    var arr = hobbies.split(/[\r\n 　,，、;；]/);
    each(arr, function (ele, index, arr) {
        ele = trim(ele);
        if (ele === '') {
            arr.splice(index, 1);
        } else {
            arr[index] = ele;
        }
    });
    arr = uniqArray1(arr);
    var newEle = document.createElement('p');
    newEle.innerHTML = arr.length ? arr.join(', ') : '没有填写兴趣爱好';
    $('#btn2').parentNode.appendChild(newEle);
}

$.click('#btn2', showHobby2);

// step3
function validate(e) {
    var err = $('#err');
    var hobbies = $('#text3').value;
    var arr = hobbies.split(/[\r\n 　,，、;；]/);
    each(arr, function (ele, index, arr) {
        ele = trim(ele);
        if (ele === '') {
            arr.splice(index, 1);
        } else {
            arr[index] = ele;
        }
    });
    arr = uniqArray1(arr);
    if (arr.length === 0) {
        //err.innerHTML = '你必须输入至少一个兴趣爱好';
    } else if (arr.length > 9) {
        var key = e.which || e.keyCode;
        if (!key || (key && key > 0x20 && key < 0x7f)) {
            e.preventDefault();
        }
        err.innerHTML = '你最多只能输入10个兴趣爱好';
    } else {
        err.innerHTML = '';
    }
    return arr;
}
function isBlank() {
    if (trim($('#text3').value) === '') {
        $('#err').innerHTML = '你必须输入至少一个兴趣爱好';
        return true;
    }
    return false;
}

function showHobby3(e) {
    var arr = validate(e);
    if (isBlank())
        return;
    
    var hobbyList = document.createElement('ul');

    function addHobby(ele, index) {
        var listItem = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkboxid' + index);
        var label = document.createElement('label');
        label.setAttribute('for', 'checkboxid' + index);
        label.innerHTML = ele;
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        hobbyList.appendChild(listItem);
    }
    
    var i, len = arr.length;
    for (i = 0; i < len; i++) {
        addHobby(arr[i], i);
    }
    
    $('#btn3').parentNode.appendChild(hobbyList);
}

$('#text3').addEventListener('keyup', isBlank, false);
$('#text3').addEventListener('keydown', validate, false);
$.click('#btn3', showHobby3);