var date, timer;

function setTimer() {
    var inputTime = trim($('#timer-input').value);
    var timeReg = /^\d+-\d{1,2}-\d{1,2}/;
    
    if (timeReg.test(inputTime) && !isNaN(Date.parse(inputTime))) {
        date = new Date(inputTime);
        var curTime = new Date();
        if (date - curTime < 0) {
            $('#timer-err').innerHTML = '你设置了一个过去的时间，请重新设置';
            return;
        }
        
        clearTimeout(timer);
        timerCountDown();
        timer = setTimeout(timerCountDown, 1000);
    } else {
        $('#timer-err').innerHTML = '请输入正确的日期格式YYYY-MM-DD';
    }
}

function timerCountDown() {
    var curTime = new Date();
    var timeLeft = date - curTime;
    
    if (timeLeft < 1000) {
        clearTimeout(timer);
        $('#timer-countdown').innerHTML = date.toDateString + '已到';
        return;
    }
    
    function addZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }
    
    var inputYear = date.getFullYear().toString();
    var inputMonth = date.getMonth() + 1;
    var inputDay = date.getDate();
    console.log(inputDay);
    
    inputMonth = addZero(inputMonth);
    inputDay = addZero(inputDay);
    
    var leftDay = parseInt(timeLeft / 1000 / 3600 / 24).toString();
    var leftHour = parseInt(timeLeft / 1000 / 3600 % 24);
    var leftMin = parseInt(timeLeft / 1000 / 60 % 60);
    var leftSec = parseInt(timeLeft / 1000 % 60);
    
    leftHour = addZero(leftHour);
    leftMin = addZero(leftMin);
    leftSec = addZero(leftSec);
    
    $('#timer-countdown').innerHTML = '距离' + inputYear + '年' + inputMonth + '月' + inputDay + '日还有' + leftDay + '日' + leftHour + '小时' + leftMin + '分钟' + leftSec + '秒';
    
    timer = setTimeout(timerCountDown, 1000);
}

$.on('#timer-btn', 'click', setTimer);