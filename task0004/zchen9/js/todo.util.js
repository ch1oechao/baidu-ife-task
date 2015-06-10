/**
 * @file todo.util.js
 * @author zchen9(zxcvbnm.pop@qq.com)
 */


/**
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 *
 * @class
 */
function each(arr, fn) {
    for( var i=0; i < arr.length; i++ ) {
        fn(arr[i], i);
    }
}

/**
 * 为element增加一个样式名为newClassName的新样式
 *
 * @class
 */
function addClass(element,value) {
    //判断className属性是否为空
    if(!element.className) {
        element.className = value;
    }
    else {
        //若不为空，把空格和新的class设置值追加到className属性上去
        newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

/**
 * 移除element中的样式oldClassName
 *
 * @class
 */
function removeClass(element, oldClassName) {
    if ( element.className == oldClassName ) {
        try{
            element.removeAttribute("class");
        }
        catch( ex ) {
            element.className = "";
        }
    }
}

/**
 * 实现一个简单的$()选择器
 *
 * @class
 */
function $(selector) {

    var selItem = selector.split(" ");

    if ( selItem.length === 1 ) {
        var aitem = selItem.toString();
        switch ( aitem.substr(0, 1) ) {
            case "#":
                return document.getElementById( aitem.substr(1) );
                break;
            case ".":
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(aitem.substr(1))
                }else {
                    var nodes = document.getElementsByTagName("*"),ret = [];
                    for(i = 0; i < nodes.length; i++) {
                        if(hasClass(nodes[i],aitem.substr(1))){
                            ret.push(nodes[i])
                        }
                    }
                    return ret;
                }
                break;
            case "[":
                if ( aitem.charAt( aitem.length - 1 ) === "]" ) {

                    var item = aitem.substring( 1, aitem.length - 1 );
                    var elements = document.getElementsByTagName("*");

                    if ( item.indexOf("=")  != -1 ) {
                        var items = item.split("=");
                        for ( var j = 0; j < elements.length; j++) {
                            if ( elements[j].getAttribute( items[0] ) === items[1] ) {
                                return elements[j];
                            }
                        }
                    }
                    else {
                        for ( var i=0; i < elements.length; i++ ) {
                            if ( elements[i].hasAttribute( item ) ) {
                                return elements[i];
                            }
                        }
                    }
                }
                else
                {
                    throw Error( "']' is missing !" );
                }
                break;
            default :
                return document.getElementsByTagName( aitem );
        }
    }
    else {
        for ( var k = 1; k < selItem.length; i++ ) {
            
            if ( selItem[0].substr(0, 1) == "#" ) {
                var itemId = document.getElementById( selItem[0].substr(1) );
                switch ( selItem[k].substr(0,1) ) {
                    case ".":
                        return itemId.getElementsByClassName( selItem[k].substr(1) )[0];
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
            else if ( selItem[0].substr(0, 1) == "." ) {
                var itemClass = document.getElementsByClassName( selItem[0].substr(1) );
                switch ( selItem[k].substr(0, 1) ) {
                    case "#":
                        return itemClass.getElementById( selItem[k].substr(1) );
                        break;
                    default :
                        return itemId.getElementsByTagName( selItem[k] );
                }
            }
        }
    }
}

/**
 * 判断class属性
 *
 * @class
 */
function hasClass(tagStr,classStr){
    var arr=tagStr.className.split(/\s+/ ); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i=0;i<arr.length;i++){
        if (arr[i]==classStr){
            return true ;
        }
    }
    return false ;
}

/**
 * 给一个element绑定一个针对event事件的响应，响应函数为listener
 *
 * @class
 */
function addEvent(element, event, listener) {
    if ( element.addEventListener ) {
        element.addEventListener( event, listener, false );
    }
    else if ( element.attachEvent ) {
        element.attachEvent( "on" + event, listener );
    }
    else {
        element[ "on" + event ] = listener;
    }

}

/**
 * 移除element对象对于event事件发生时执行listener的响应，当listener为空时，移除所有响应函数
 *
 * @class
 */
function removeEvent(element, event, listener) {
    if ( element.removeEventListener ) {
        element.removeEventLinster( event, listener, false );
    }
    else if( element.detachEvent ) {
        element.detachEvent( "on" + event, listener );
    }
    else {
        element[ "on" + event ] = null;
    }
}

/**
 * 实现对click事件的绑定
 *
 * @class
 */
function addClickEvent(element, listener) {
    if ( element.addEventListener ) {
        element.addEventListener( "click", listener, false );
    }
    else if ( element.attachEvent ) {
        element.attachEvent( "onclick", listener );
    }else {
        element["onclick"] = listener;
    }
}

/**
 * 实现对于按Enter键时的事件绑定
 *
 * @class
 */
function addEnterEvent(element, listener) {
    var e = event ? event : window.event;
    var ele = element ? e.target : e.srcElement;
    var curKey = 0;
    curKey = e.keyCode|| e.which|| e.charCode; //支持IE、FF
    if ( curKey == 13 ) {
        listener();
    }
}

/**
 * 遍历元素添加事件
 *
 * @class
 */
function delegateEvent(element, tag, eventName, listener) {
    var e = event ? event : window.event;
    var ele = element ? element : document.body;
    var eleChild = ele.children;
    for ( var i = 0 ; i < eleChild.length ; i++ ) {
        if ( eleChild[i].nodeName === tag 
            || eleChild[i].nodeName.toLowerCase() === tag 
            ) {
            addEvent(eleChild[i], eventName, listener);
        }
    }
}

/**
 * 阻止事件冒泡
 *
 * @class
 */
function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation ) {
        // 因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    }
    else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

/**
 *功能：阻止事件默认行为
 *
 * @class
 */
function stopDefault( e ) {
    // 阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault ) {
        e.preventDefault();
    }
    else {
        // IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
    }
    return false;
}

// 兼容IE FF的getElementsByTagName办法
var getElementsByTagName = function(tag,name) {
    var returns = document.getElementsByName(name);
    if (returns.length > 0) return returns;
    returns = [];
    var e = document.getElementsByTagName(tag);
    for (var i = 0; i < e.length; i++) {
        if (e[i].getAttribute("name") == name) {
            returns[returns.length] = e[i];
        }
    }
    return returns;
};


//遍历元素监听事件
function delegateEleEvent(ele,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        listener(ele[i]);
    }
}

//遍历元素添加鼠标事件
function delegateEleMouseEvent(ele,event,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        addEvent(ele[i],event,listener);
    }
}

//遍历元素添加点击事件
function delegateClickEvent(ele,listener){
    for(var i = 0,len=ele.length;i<len;i++){
        addClickEvent(ele[i],listener);
    }
}

//遍历元素初始化样式
function delegateInitClass(ele,classname){
    var eles = ele.parentNode.children;
    for(var i = 0,len=eles.length;i<len;i++){
        removeClass(eles[i],classname);
    }
    addClass(ele,classname);
}

//addLoadEvent() —— 共享onload事件
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function(){
            oldonload();
            func();
        }
    }
}

//添加数组原型方法 查找指定位置的元素
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

//添加数组原型方法 去除指定位置的元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
