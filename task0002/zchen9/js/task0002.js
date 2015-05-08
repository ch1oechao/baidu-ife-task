/**
 * Created by Chen on 2015-05-08.
 */
window.onload = function(){
	var menu = $("#menu").children;
	var myframe = $("#myframe");


	for(var i=0;i<menu.length;i++){
		menu[i].onclick = function(){
			var index = this.innerHTML.substr(-1);
			console.log(this.innerHTML.substr(-1));
			myframe.setAttribute("src","task0002_"+index+".html");
		};

	}

	console.log(myframe.getAttribute("src"));

};