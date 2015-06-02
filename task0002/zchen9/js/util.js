/**
 * @file util.js
 * @author zchen9(zxcvbnm.pop@qq.com)
 */

/**
 * 判断arr是否为一个数组，返回一个bool值
 *
 * @param {Array} arr 传入一个数组
 * @return {boolean} bool值 true表示是数组，false表示不是数组
 */
function isArray(arr){
    //方法一
    //return arr instanceof Array;
    //方法二
    //return Array.isArray(arr);
    //方法三
    return Object.prototype.toString.call(arr) == "[object Array]";
}

/**
 * 判断fn是否为一个函数，返回一个bool值
 *
 * @param {Function} fn 传入一个函数
 * @return {boolean} bool值 true表示是函数，false表示不是函数
 */

function isFunction(fn){
    //方法一
    //return typeof fn === "function";
    //方法二
    //return fn instanceof Function;
    //方法三
    return Object.prototype.toString.call(fn) == "[object Function]";
}
/**
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
 *
 * @param {Array|Object} src 传入数组或对象
 * @return {Array|Object} tar 返回src克隆对象
 */

function cloneObject(src){
    var tar = src.constructor === Array ? [] : {};
    for (var i in src) {
        if (src.hasOwnProperty(i)) {
            tar[i] = typeof src[i] === "object" ? cloneObject(src[i]) : src[i];
        }
    }
    return tar;
}
/**
 * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
 *
 * @param {Array} arr 传入一个数组
 * @return {Array} temp 返回一个重新排序且去掉重复元素的数组
 */
//方法1
function uniqArray(arr){
    var temp = [];
    if (arr instanceof Array) {
        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== arr[i + 1]) {
                temp.push(arr[i]);
            }
        }
    }
    return temp;
}
//方法2
//function uniqArray(arr){
//  var temp = [];
//  if (arr instanceof Array) {
//      for (var i = 0; i < arr.length; i++) {
//          temp.push(arr[i]);
//          for (var j = i + 1; j <= arr.length; j++) {
//              if (arr[i] === arr[j]) {
//                  temp.pop(arr[j]);
//              }
//          }
//      }
//  }
//  return temp;
//}

/**
 * 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
 *
 * @param {string} str 传递一个字符串
 * @return {string} 返回去掉空格的字符串
 */
function trim(str){
    return str.replace( /\s+/g, "" );
}

/**
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 *
 * @param {Array} arr 传递一个数组
 * @param {Function} fn 传递一个函数
 */
function each(arr, fn){
    for (var i = 0; i < arr.length; i++){
        fn(arr[i], i);
    }
}

/**
 * 获取一个对象里面第一层元素的数量，返回一个整数
 *
 * @param {Object} obj 传递一个对象
 * @return {number} count 返回对象第一层元素的数量
 */
function getObjectLength(obj){
    var count = 0;
    if (obj instanceof Object) {
        for (var i in obj) {
            count++;
        }
    }
    return count;
}

/**
 * 判断是否为邮箱地址
 *
 * @param {string} EmailStr 传递一个邮箱地址字符串
 * @return {boolean} 返回是否为邮箱地址的布尔值
 */
function isEmail(emailStr){
    var emReg = /^([a-zA-Z0-9\_\-\.])+@([a-zA-Z0-9\_\-\.])+([a-zA-Z0-9]){2,4}$/gi;
    return emReg.test(emailStr);
}

/**
 * 判断是否为手机号
 *
 * @param {string|Array} phone 传递一个手机号字符串或数字
 * @return {boolean} 返回是否为电话号码的布尔值
 */
function isMobilePhone(phone){
    if (phone instanceof Number) {
        phone = phone + "";
    }
    var phoneReg = /^\d{11}$/g;
    return phoneReg.test(phone);
}

/**
 * 为element增加一个样式名为newClassName的新样式
 *
 * @param {Object} element 传入一个DOM节点元素
 * @param {string} newClassName 传入新的样式名称
 * 
 * 这个方法有误，但是task0002基于它写的，所以不好改动，在其他用Util.js时已经更改
 */
function addClass(element, newClassName){
    try{
        element.setAttribute("class", newClassName);
    }
    catch( ex ) {
        element.className = "newClassName";
    }
}

//正确添加className的方法
// function addClass(element,value) {
//     //判断className属性是否为空
//     if(!element.className) {
//         element.className = value;
//     }
//     else {
//         //若不为空，把空格和新的class设置值追加到className属性上去
//         newClassName = element.className;
//         newClassName += " ";
//         newClassName += value;
//         element.className = newClassName;
//     }
// }


/**
 * 移除element中的样式oldClassName
 *
 * @param {Object} element 传入一个DOM节点元素
 * @param {string} oldClassName 传入需要删除的样式名称
 */
function removeClass(element, oldClassName){
    if (element.className == oldClassName) {
        try {
            element.removeAttribute("class");
        }
        catch (ex) {
            element.className = "";
        }
    }
}
// 摘自笔记
// function removeClass(el, cls) {
//   var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
//   el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g,"");
// }


/**
 * 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
 *
 * @param {Object} element 传入一个DOM节点元素
 * @param {Object} siblingNode 传入另一个可能同级的DOM节点元素
 * @return {boolean} 返回bool值，true为是同级节点，false为不是同级节点
 */
function isSiblingNode(element, siblingNode){
    var nodes = element.parentNode.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if ( nodes[i] === siblingNode ) {
            return true;
        }
    }
    return false;
}

/**
 * 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
 *
 * @param {Object} element 传入一个DOM节点元素
 * 
 * http://www.cnblogs.com/leejersey/p/4127714.html
 */
function getPosition(element){
    var posRect = element.getBoundingClientRect();
    var docTop = document.documentElement.clientTop;
    var docLeft = document.documentElement.clientLeft;

    return { x: posRect.top - docTop ,
             y: posRect.left - docLeft
           }
}

/**
 * 实现一个简单的$()选择器
 *
 * @param {string} selector 传入选择器字符串
 * @return {Object} 返回选择器对应节点
 */
function $(selector) {
    //将传入的选择器以空格符隔开生成数组
    var selItem = selector.split(" ");
    //如果数组长度为1，表示选择器只传入一个样式
    if (selItem.length === 1) {
        // 将数组转变成字符串
        var aitem = selItem.toString();
        // 通过switch取字符串第一个字符来判断选择器类型
        switch (aitem.substr(0, 1)) {
            //为id选择器
            case "#":
                return document.getElementById(aitem.substr(1));
                break;
            //为class选择器
            case ".":
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(aitem.substr(1))
                }
                else {
                    //获取全部元素
                    var nodes = document.getElementsByTagName("*");
                    var tar = [];
                    for(i = 0; i < nodes.length; i++) {
                        //遍历全部元素节点，若节点有传入的选择器属性则存入数组
                        if(hasClass(nodes[i],aitem.substr(1))){
                            tar.push(nodes[i])
                        }
                    }
                    return tar;
                }
                break;
            //为指定属性名选择器
            case "[":
                //检查[]是否完整
                if (aitem.charAt(aitem.length - 1) === "]") {
                    //取[]中间的字符串
                    var item = aitem.substring(1, aitem.length - 1);
                    var elements = document.getElementsByTagName("*");
                    //查找字符串中是否有=号
                    if (item.indexOf("=") != -1) {
                        //若有=号，将字符串以=号分隔成数组
                        var items = item.split("=");
                        //遍历所有元素
                        for (var j = 0; j < elements.length; j++) {
                            //判断是否有节点拥有传入的属性名，且属性值一致，若找到则返回该节点
                            if (elements[j].getAttribute( items[0] ) === items[1]) {
                                return elements[j];
                            }
                        }
                    }
                    //若字符串无=号
                    else {
                        for ( var i = 0; i < elements.length; i++ ) {
                            //返回匹配该属性名的第一个节点
                            if (elements[i].hasAttribute(item)) {
                                return elements[i];
                            }
                        }
                    }
                }
                // 如果[]不完整，则抛出错误
                else {
                    throw Error( "']' is missing !" );
                }
                break;
            //默认排除以上选择器，返回元素名选择器
            default :
                return document.getElementsByTagName(aitem);
        }
    }
    //若传入的字符串含有多个选择器
    //以下并没有考虑getElementsByClassName的兼容...
    else {
        for (var k = 1; k < selItem.length; i++) {
            
            if (selItem[0].substr(0, 1) == "#") {
                var itemId = document.getElementById(selItem[0].substr(1));
                switch (selItem[k].substr(0,1)) {
                    case ".":
                        return itemId.getElementsByClassName(selItem[k].substr(1))[0];
                        break;
                    default :
                        return itemId.getElementsByTagName(selItem[k]);
                }
            }
            else if (selItem[0].substr(0, 1) == ".") {
                var itemClass = document.getElementsByClassName(selItem[0].substr(1));
                switch (selItem[k].substr(0, 1)) {
                    case "#":
                        return itemClass.getElementById(selItem[k].substr(1));
                        break;
                    case ".":
                        return itemClass.getElementsByClassName(selItem[k].substr(1))[0];
                        break;
                    default :
                        return itemId.getElementsByTagName(selItem[k]);
                }
            }
        }
    }
}

/**
 * 判断class属性
 *
 * @param {Object} tagStr 传入目标DON元素节点
 * @param {string} classStr 传入节点可能匹配的className
 * @rerun {boolean} 返回是否匹配className的bool值
 */
function hasClass(tagStr, classStr){
    var arr = tagStr.className.split(/\s+/g); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == classStr) {
            return true ;
        }
    }
    return false ;
}

/**
 * 给一个element绑定一个针对event事件的响应，响应函数为listener
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string} event 传入事件字符串
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
 */
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }

}

/**
 * 移除element对象对于event事件发生时执行listener的响应，当listener为空时，移除所有响应函数
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string} event 传入事件字符串
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
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
 * @param {Object} element 传入DOM节点元素
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
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
 * @param {Object} element 传入DOM节点元素
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
 */
function addEnterEvent(element, listener) {
    var e = event ? event : window.event;
    var ele = element ? e.target : e.srcElement;
    var curKey = 0;
    curKey = e.keyCode || e.which || e.charCode; //支持IE、FF
    if ( curKey == 13 ) {
        listener();
    }
}

$.on = function(element, event, listener) {
    addEvent(element, event, listener)
};

$.un = function(element, event, listener) {
    removeEvent(element, event, listener)
};

$.click = function(element, listener) {
    addClickEvent(element, listener)
};

$.enter = function(element, listener) {
    addEnterEvent(element, listener)
};


/**
 * 遍历元素添加事件
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string} tag 传入子节点标签名
 * @param {string} eventName 传入事件名称
 * @param {string | Function} listener 传入函数名称或匿名函数
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

$.delegate = function(element, tag, eventName, listener) {
    delegateEvent(element, tag, eventName, listener);
};

/**
 * 判断是否为IE浏览器
 *
 * @return {string} 返回IE版本号或-1
 */
function isIE() {
    var ua = navigator.userAgent;
    if ( ua.indexOf("MSIE") > 0 ) {
        switch( true ) {
            case ua.indexOf("MSIE 6.0") != -1 :
                return "IE6";
                break;
            case ua.indexOf("MSIE 7.0") != -1 :
                return "IE7";
                break;
            case ua.indexOf("MSIE 8.0") != -1 :
                return "IE8";
                break;
            case ua.indexOf("MSIE 9.0") != -1 :
                return "IE9";
                break;
            case ua.indexOf("MSIE 10.0") != -1 :
                return "IE10";
                break;
            default :
                return -1;
        }
    }
}

/**
 * 设置cookie
 *
 * @param {string} cookieName 传入cookie名称
 * @param {string} cookieValue 传入cookie值
 * @param {Date} expiredays 传入时间
 */
function setCookie(cookieName, cookieValue, expiredays) {
    var cookieText = encodeURIComponent(cookieName) 
                    + "="
                    + encodeURIComponent(cookieValue);
    if (expiredays instanceof Date) {
        cookieText += "; expire=" + expiredays.toGMTString();
    }

    document.cookie = cookieText;
}

/**
 * 获取cookie值
 *
 * @param {string} cookieName 传入cookie名称
 * @param {String} coValue 返回对应cookie值
 */
function getCookie(cookieName) {
    var coName = encodeURIComponent(cookieName) + "=";
    var coStart = document.cookie.indexOf(coName);
    var coValue = null;

    if ( coStart > -1 ) {
        var coEnd = document.cookie.indexOf(";", coStart);
        if ( coEnd == -1) {
            coEnd = document.cookie.length;
        }
        coValue = decodeURIComponent(
                        document.cookie.subString( coStart + coName.length, coEnd )
                  );
    }
    return coValue;
}

/**
 * 封装Ajax方法
 *
 * @param {Object} options 可以包括的参数为：
 *                 type: post或者get，可以有一个默认值
 *                 data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
 *                 onsuccess: 成功时的调用函数
 *                 onfail: 失败时的调用函数
 *@param {Object} url 链接
 *
 */
function ajax(url, options) {

    //若type值为空，默认为GET方法
    var atype = options.type;
    if ( typeof atype == null ) {
        options.type = "GET";
    }

    options = {
        onsuccess: function( responseText, xhr ) {
            console.log( "Request was unsuccessful: " + xhr.status );
        },
        onfail: function( responseText, xhr ) {
            console.log( responseText );
        }
    };

    //XHR兼容
    function createXHR() {
        //一般浏览器
        if ( typeof XMLHttpRequest != "undefined" ) {
            return new XMLHttpRequest();
        }
        //兼容IE老版本
        else if ( typeof ActiveXObject != "undefined" ) {
            if ( typeof arguments.callee.activeXString != "string" ) {
                var versions = [ "MSXML2.XMLHttp.6.0", 
                                        "MSXML2.XMLHttp.3.0",
                                        "MSXML2.XMLHttp"
                                       ],
                                       i,
                                       len;
                for ( i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject( versions[i] );
                        arguments.callee.activeXString = versions[i];
                        break;
                    }
                    catch( ex ) {

                    }
                }
            }
            return new ActiveXObject( arguments.callee.activeXString );
        }
        else {
            throw new Error( "No XHR object available." );
        }
    }

    var xhr = createXHR();
    xhr.onreadystatechange = function() {
        if ( xhr.readyState == 4 ) {
            if ( ( xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                options.onfail( xhr.responseText, xhr );
            }
            else {
                options.onsuccess( xhr.responseText, xhr );
            }
        }
    };

    //定义发送的数据的格式
    function addURLParam( data ){
        var pair = [];
        if ( data instanceof String ) {
            data = encodeURIComponent( data );
        }
        else if ( data instanceof Object ) {
            for( var i = 0; i < data.length; i++) {
                if ( data.hasOwnProperty(i) ) {
                    pair.push( i + "=" + data[i].toString() );
                }
            }
            data = encodeURIComponent( pair.join("&") );
        }
        return data;
    }

    //当方法为GET时
    if( options.type = "GET" ) {
        if( options.data != null ) {
            url += addURLParam( options.data );
        }
        xhr.open( "get", url, false );
        xhr.send( null );
    }
    //当方法为POST时
    else if( options.type = "POST" ) {
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if( options.data != null ) {
            xhr.send(addURLParam(options.data));
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