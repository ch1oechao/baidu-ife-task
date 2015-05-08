/**
 * @file task0002.js
 * @author zchen9(zxcvbnm.pop@qq.com)
 */
window.onload = function(){
    var menu = $("#menu").children;
    var myframe = $("#myframe");

    for(var i=0;i<menu.length;i++){
        menu[i].onclick = function(){
            var index = this.innerHTML.substr(-1);
            myframe.setAttribute("src","task0002_"+index+".html");
        };

    }
};