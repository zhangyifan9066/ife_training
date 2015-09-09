function handleMouseDown(e, target) {
    drag(e, target);
}

function handleMouseMove(e, dragIns) {
    var target = dragIns.target;
    if (dragIns.firstTime) {
        document.body.appendChild(target);
        dragIns.firstTime = false;
    }
    updatePosition(e, dragIns);
    updateShadowItem(e, dragIns);
}

function handleMouseUp(e, dragIns) {
    drop(dragIns);
}

function addShadowItem(dragIns, insertPos) {
    var lists = dragIns.lists;
    var items = dragIns.items;
    var target = dragIns.target;
    var itemPoses = dragIns.itemPoses;
    var itemSizes = dragIns.itemSizes;
    
    var shadowItem = document.createElement('li');
    addClass(shadowItem, 'drag-list-item drag-shadow');
    shadowItem.style.height = getComputedValue(target).height;
    
    var listIndex = insertPos.list;
    var itemIndex = insertPos.item;
    if (itemIndex < 0) {
        lists[listIndex].appendChild(shadowItem);
//        var list = itemPoses[listIndex];
//        var lastItemPos = list[list.length - 1];
//        lastItemPos.y += target.offsetHeight;
//        itemPoses[listIndex].push(lastItemPos);
//        itemSizes[listIndex].push({
//            width: target.offsetWidth,
//            height: target.offsetHeight
//        });
//        items[listIndex].push(shadowItem);
    } else {
        lists[listIndex].insertBefore(shadowItem, items[listIndex][itemIndex]);
        
        var i, len;
        for (i = itemIndex, len = items[listIndex].length; i < len; i++) {
            itemPoses[listIndex][i].y += target.offsetHeight;
        }
//        itemPoses[listIndex].splice(itemIndex, 0, itemPoses[listIndex][itemIndex]);
//        items[listIndex].splice(itemIndex, 0, {
//            width: target.offsetWidth,
//            height: target.offsetHeight
//        });
//        items[listIndex].splice(itemIndex, 0, shadowItem);
    }
    dragIns.shadowItem = shadowItem;
    
    
}

function removeShadowItem(dragIns) {
    var insertPos = dragIns.insertPos;
    var listIndex = insertPos.list;
    var itemIndex = insertPos.item;
    var target = dragIns.target;
    var itemPoses = dragIns.itemPoses;
    
    dragIns.shadowItem.remove();
    dragIns.shadowItem = null;
    if (itemIndex >= 0) {
        var i, len;
        for (i = itemIndex, len = itemPoses[listIndex].length; i < len; i++) {
            itemPoses[listIndex][i].y -= target.offsetHeight;
        }
    }
}

function updatePosition(e, dragIns) {
    var target = dragIns.target;    
    target.style.position = 'absolute';
    target.style.left = e.pageX - dragIns.mousePos.x + dragIns.startPos.x + 'px';
    target.style.top = e.pageY - dragIns.mousePos.y + dragIns.startPos.y + 'px';
}

function updateShadowItem(e, dragIns) {
    var insertPos = findInsertPos(dragIns, e.pageX, e.pageY);
    console.log(insertPos);
    if (dragIns.insertPos && (insertPos.list === dragIns.insertPos.list && insertPos.item === dragIns.insertPos.item))
        return;
    if (dragIns.shadowItem)
        removeShadowItem(dragIns);
    dragIns.insertPos = insertPos;
    if (insertPos.list < 0)
        return;
    addShadowItem(dragIns, insertPos);
}

function findInsertPos(dragIns, mouseX, mouseY) {
    var i, len;
    var lists = dragIns.lists;
    var listPoses = dragIns.listPoses;
    var listSizes = dragIns.listSizes;
    var items = dragIns.items;
    var itemPoses = dragIns.itemPoses;
    var itemSizes = dragIns.itemSizes;
    
    for (i = 0, len = lists.length; i < len; i++) {
        if (mouseX >= listPoses[i].x && mouseX <= listPoses[i].x + listSizes[i].width) {
            var j, totalItems = items[i].length;
            if (totalItems === 0) {
                if (mouseY >= listPoses[i].y && mouseY <= listPoses[i].y + listSizes[i].height) {
                    return {list: i, item: -1};
                }
            } else {
                if (mouseY >= listPoses[i].y && mouseY <= itemPoses[i][0].y + 15) {
                    return {list: i, item: 0};
                }
                for (j = 1; j < totalItems; j++) {
                    //console.log(i + ' ' + j);
                    //console.log(itemPoses[i][j]);
                    if (mouseY >= itemPoses[i][j - 1].y + itemSizes[i][j - 1].height - 15 && mouseY <= itemPoses[i][j].y + 15) {
                        return {list: i, item: j};
                    }
                }
//                console.dir(itemSizes[i]);
//                console.dir(itemSizes[i][totalItems - 1]);
//                console.dir(itemSizes[i][totalItems - 1].y);
                
                if (mouseY >= itemPoses[i][totalItems - 1].y + itemSizes[i][totalItems - 1].height && mouseY <= listPoses[i].y + listSizes[i].height) {
                    return {list: i, item: -1};
                }
            }
        }
    }
    
    return {list: -1, item: -1};
}

function getScrollOffset() {
    var scrollOffset = {};
    scrollOffset.x = window.pageXOffset || (document.documentElement || document.body).scrollLeft;
    scrollOffset.y = window.pageYOffset || (document.documentElement || document.body).scrollTop;
    return scrollOffset;
}

function getElePos(target) {
    var scrollOffset = getScrollOffset();
    var pos = {};
    var box = getPosition(target);
    pos.x = Math.round(box.left) + scrollOffset.x;
    pos.y = Math.round(box.top) + scrollOffset.y;
    return pos;
}

function getAllLists(ele) {
    var lists = getElementsByClassName('drag-list', ele);
    var i, len, listPoses = [], listSizes = [];
    for (i = 0, len = lists.length; i < len; i++) {
        listPoses.push(getElePos(lists[i]));
        listSizes.push({
            width: lists[i].offsetWidth,
            height: lists[i].offsetHeight
        });
    }
    return {
        lists: lists,
        listPoses: listPoses,
        listSizes: listSizes
    };
}

function getAllItems(lists, target) {
    var items = [];
    var itemPoses = [];
    var itemSizes = [];
    var targetInsertPos = {};
    var i, len;
    for  (i = 0, len = lists.length; i < len; i++) {
        var listItems = getElementsByClassName('drag-list-item', lists[i]);
        
        var j, totalItems, listItemPoses = [], listItemSizes = [], targetHeight = 0, targetIndex = -1;
        for (j = 0, totalItems = listItems.length; j < totalItems; j++) {  
            if (listItems[j] === target) {
                targetHeight = target.offsetHeight;
                targetIndex = j;
                targetInsertPos.list = i;
                if (j < totalItems - 1)
                    targetInsertPos.item = j;
                else if (j === totalItems - 1)
                    targetInsertPos.item = -1;
            } else {
                var pos = getElePos(listItems[j]);
                pos.y -= targetHeight;
                listItemPoses.push(pos);
                listItemSizes.push({
                    width: listItems[j].offsetWidth,
                    height: listItems[j].offsetHeight
                });
            }
        }
        
        if (targetIndex >= 0)
            listItems.splice(targetIndex, 1);
        items.push(listItems);
        itemPoses.push(listItemPoses);
        itemSizes.push(listItemSizes);
    }
    
    return {
        items: items,
        itemPoses: itemPoses,
        itemSizes: itemSizes,
        targetInsertPos: targetInsertPos
    };
}

function drag(e, target) {
    var dragIns = {};
    dragIns.target = target;
    dragIns.firstTime = true;
    dragIns.startPos = getElePos(target);
    dragIns.mousePos = {
        x: e.pageX,
        y: e.pageY
    };
    dragIns.handleMouseMove = function (e) {
        handleMouseMove(e, dragIns);
    };
    dragIns.handleMouseUp = function (e) {
        handleMouseUp(e, dragIns);
    };
    
    var dragPanel = $('.drag-panel');
    var allLists = getAllLists(dragPanel);
    console.log(allLists);
    dragIns.lists = allLists.lists;
    dragIns.listPoses = allLists.listPoses;
    dragIns.listSizes = allLists.listSizes;
    
    var allItems = getAllItems(dragIns.lists, target);
    dragIns.items = allItems.items;
    dragIns.itemPoses = allItems.itemPoses;
    dragIns.itemSizes = allItems.itemSizes;
    dragIns.targetInsertPos = allItems.targetInsertPos;
    console.dir(allItems);
    
    addClass(target, 'drag-dragged');
    target.style.position = 'relative';
    
    document.addEventListener('mousemove', dragIns.handleMouseMove, false);
    document.addEventListener('mouseup', dragIns.handleMouseUp, false);
}

function drop(dragIns) {
    var lists = dragIns.lists;
    var items = dragIns.items;
    var target = dragIns.target;
    var insertPos, listIndex, itemIndex;
    
    removeClass(target, 'drag-dragged');
    target.style.position = '';
    target.style.left = '';
    target.style.top = '';
    
    document.removeEventListener('mousemove', dragIns.handleMouseMove, false);
    document.removeEventListener('mouseup', dragIns.handleMouseUp, false);
    
    if (dragIns.shadowItem) {
        insertPos = dragIns.insertPos;
        listIndex = insertPos.list;
        itemIndex = insertPos.item;
        
        removeShadowItem(dragIns);
    } else {
        insertPos = dragIns.targetInsertPos;
        listIndex = insertPos.list;
        itemIndex = insertPos.item;
    }
    if (itemIndex < 0) {
        lists[listIndex].appendChild(target);
    } else {
        lists[listIndex].insertBefore(target, items[listIndex][itemIndex]);
    }
}

var dragPanel = $('.drag-panel');
var dragLists = dragPanel.children;
var listIndex, listLength;
for (listIndex = 0, listLength = dragPanel.childElementCount; listIndex < listLength; listIndex++) {
    delegateEvent(dragLists[listIndex], 'li', 'mousedown', handleMouseDown);
}

function getComputedValue(ele) {
    if (window.getComputedStyle) {
        return getComputedStyle(ele, null);
    } else {
        return ele.currentStyle;
    }
}