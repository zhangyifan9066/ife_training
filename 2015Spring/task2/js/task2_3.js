function slideEvent(event, target) {
    var selectNav = target;
    var selectIndex = getIndex(target);
    if (!selectIndex)
        return;
    autoIndex = selectIndex;
    
    var curNav = $('.slide-nav-cur');
    var curIndex = getIndex(curNav);
    if (!curIndex)
        return;
    
    var selectImg = $('#slide-img-item' + selectIndex);
    var curImg = $('#slide-img-item' + curIndex);
    
    
    if (curIndex == selectIndex) {
        return;
    } else {
        curNav.className = curNav.className.replace(' slide-nav-cur', '');
        if (curIndex < selectIndex)
            slideImg('left', selectImg, curImg);
        else if (curIndex > selectIndex)
            slideImg('right', selectImg, curImg);
        selectNav.className += ' slide-nav-cur';
    }

    
    function getIndex(ele) {
        var id = ele.id;
        if (!id)
            return null;
        var navId = id.match(/slide-nav-item(\d)/);
        if (!navId)
            return;
        return navId[1];
    }
    
    function slideImg(dir, selectImg, curImg) {
        var selectStyle = selectImg.style;
        var curStyle = curImg.style;
        selectStyle.marginLeft = 0;
        curStyle.marginLeft = 0;
        var selectWidth = parseInt(getComputedValue($('.slide-img')).width);
        var curWidth = selectWidth;
        
        
        var step = 8;
        var iteration, firstStep, i = 0;
        
        if (dir === 'right') {
            selectStyle.marginLeft = -selectWidth + 'px';
            selectStyle.display = 'list-item';
            iteration = parseInt(selectWidth / step);
            firstStep = selectWidth - iteration * step;
            
            setTimeout(slide, 4, firstStep, step, selectStyle, i, iteration + 1, selectStyle);
        } else {
            selectStyle.display = 'list-item';
            iteration = parseInt(curWidth / step) ;
            firstStep = -(curWidth - iteration * step);
            step = -step;
            
            setTimeout(slide, 4, firstStep, step, curStyle, i, iteration + 1, selectStyle);
        }
    }
    
    function slide(firstStep, step, style, cnt, iteration, selectStyle) {
        var curMarginLeft = parseInt(style.marginLeft);
        
        if (cnt === 0)
            style.marginLeft = curMarginLeft + firstStep + 'px';
        else
            style.marginLeft = curMarginLeft + step + 'px';
        
        if (cnt < iteration) {
            cnt++;
            setTimeout(slide, 4, firstStep, step, style, cnt, iteration, selectStyle);
        } else {
            curImg.className = curImg.className.replace(' slide-img-cur', '');
            selectImg.className += ' slide-img-cur';
            style.marginLeft = 0;
            selectStyle.display = '';
        }
    }
}

function getComputedValue(ele) {
    if (window.getComputedStyle) {
        return getComputedStyle(ele, null);
    } else {
        return ele.currentStyle;
    }
}

function autoSlide() {
    slideEvent(null, $('#slide-nav-item' + autoIndex));
    autoIndex = autoIndex === 5 ? 1 : ++autoIndex;
    setTimeout(autoSlide, 5000);
}

var slideWindowWidth = parseInt(getComputedValue($('.slide-img')).width);
$('.slide-img-wrap').style.width = slideWindowWidth * 5 + 'px';
var slideItems = document.getElementsByTagName('li');
var i, len = slideItems.length;
for (i = 0; i < len; i++) {
    if (slideItems[i].className.match('slide-img-item'))
        slideItems[i].style.width = slideWindowWidth + 'px';
}
$.delegate('.slide-nav', 'li', 'click', slideEvent);

var autoIndex = 2;
setTimeout(autoSlide, 5000);