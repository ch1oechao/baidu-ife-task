/**
 * @file task0002_1.js
 * @author zchen9(zxcvbnm.pop@qq.com)
 */
window.onload = function () {

	var hobbit = $("#hobbit");
	var btn = $("#btn");
	//添加输入框输入检查事件
	addEvent(hobbit , "keyup" , checkItem);
	//添加按钮点击事件
	addEvent(btn , "click" , btnHandle);


	/**
	 * 检查输入框的内容
	 *
	 * @class
	 */
	function checkItem() {
		var hobbit = $("#hobbit"); 
		var hobbits = splitInput( hobbit.value ); 
		var text = $("#hobbit-text"); 

		text.innerHTML = ""; 

		var tips = $("#tip");
		if (hobbits.length > 10) {
			tips.innerHTML = "输入的爱好应当不超过十项！"; 
		}
        else if (hobbits.length == 0) {
			tips.innerHTML = "请填写您的爱好！"; 
		}
        else {
			tips.innerHTML = "";
		}
	}

	/**
	 * 按钮点击后判断输入框的内容，内容确认后添加信息
	 *
	 * @class
	 */
	function btnHandle() {
		var hobbit = $("#hobbit");
		var hobbits = splitInput(hobbit.value);

		if (hobbits.length<1 || hobbits.length>10) { 
			checkItem();
		} 
        else {
			addCheck(hobbits);
		}

	}

	/**
	 * 解析输入的内容，用分隔符分开后保存到一个数组。
	 * 过滤掉空的、重复的爱好，返回新数组。
	 *
	 * @class
	 */
	function splitInput(item){
		var splitReg = /[\n\u3000\s，；,;、]+/g;
		var arr = item.split(splitReg).sort(),
			temp = [];

		for(var i=0;i<arr.length;i++){
			arr[i] = trim(arr[i]);
			if((arr[i] != "")&&(arr[i] !== arr[i+1])){
				temp.push(arr[i]);
			}
		}
		return temp;
	}

	/**
	 * 添加处理后的信息
	 *
	 * @class
	 */
	function addCheck(arr) {
		var text = $("#hobbit-text");
		text.innerHTML = "";

		for (var i=0; i < arr.length; i++) {
			var checkLabel = document.createElement("label");
			var checkItem = document.createElement("input");

			checkItem.type = "checkbox";
			checkItem.name = "hobbit";
			checkItem.check = "check";

			checkItem.value = arr[i];

			checkLabel.appendChild( checkItem );
			checkLabel.appendChild( document.createTextNode(arr[i]) );

			text.appendChild( checkLabel );
		}
	}
};
