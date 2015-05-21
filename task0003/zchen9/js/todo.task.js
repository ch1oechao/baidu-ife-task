/**
* Created by Chen on 2015-05-19.
*/

var datainit = {
	todoCateList : $(".todo-category-list")[0],
	taskInventory : $(".todo-inventory-detail")[0],
	todoDetail : $("dd"),
	todoDefault: (function(){
		var taskTitle = $("#todo-default-title");
		var taskTime = $("#todo-default-time");
		var taskContent = $("#todo-default-content");
		return [taskTitle,taskTime,taskContent];
	})(),
	todoEdit: (function(){
		var taskTitle = $("#todo-task-title");
		var taskTime = $("#todo-task-time");
		var taskContent = $("#todo-task-content");
		taskTitle.style.display = "none";
		taskTime.style.display = "none";
		taskContent.style.display = "none";
		return [taskTitle,taskTime,taskContent];
	})(),

	todoSpecEdit : $(".todo-spec-edit")[0],
	todoEditIcon : $(".fa-pencil-square-o")[0],
	todoCheckIcon : $(".fa-check-square-o")[0],
	todoUndoEle : (function(){
		var undoIcon = document.createElement("i");
		addClass(undoIcon,"fa fa-undo fa-2x");
		undoIcon.setAttribute("onclick","javascript:document.taskForm.reset()");
		return undoIcon;
	})(),
	todoCheckEle : (function(){
		var checkIcon = document.createElement("i");
		addClass(checkIcon,"fa fa-check fa-2x");
		return checkIcon;
	})(),
	todoAddTask : $("#todo-add-task"),
	todoTotal : $("#todo-total-count"),
	todoInventory : $(".todo-inventory-category")[0].children,
	todoCateBtn :$("#todo-add-category"),
	todoCateAll:$(".todo-category-total")[0],

	addCateSelect : $("#add-cate-main"),
	addCateName : $("#add-cate-name"),
	addCateCancel : $("#add-cate-cancel"),
	addCateCheck : $("#add-cate-check")
};

//初始化
(function(){
	for(var i = 0;i<cates.length;i++){
		addCate(cates[i]);
	}
	for(var ii = 0;ii<lists.length;ii++){
		addList(lists[ii]);
	}
	addInventory(tasks[0]);
	addContent(tasks[0]);

	var listFirst = $(".todo-task-list")[0].getElementsByTagName("li")[0];
	if(listFirst){
		addClass(listFirst,"todo-task-selected");
	}
	var titleFirst = $("dd")[0];
	if(titleFirst){
		addClass(titleFirst,"todo-detail-selected");
	}

})();


function formatTime(obj){
	var taskTime = obj.time;
	if(taskTime){
		var year = taskTime.getFullYear();
		var month = taskTime.getMonth()+1;
		var date = taskTime.getDate();
		if(month<10){
			month = "0"+month;
		}
		if(date<10){
			date = "0"+date;
		}
	}
	return [year,month,date].join("-");
}
//添加主分类
function addCate(obj){
	if(obj.category){
		var liCate = $("[data-cate-id="+obj.category+"]");
		if(!liCate){
			liCate = document.createElement("li");
			liCate.setAttribute("data-cate-id",obj.category);
			var spanCateDefault = document.createElement("span");
			if(obj.category === "默认分类"){
				spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
					+ obj.category;
			}else{
				spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
					+ obj.category;
			}
			liCate.appendChild(spanCateDefault);
			datainit.todoCateList.appendChild(liCate);
		}
	}
}
//添加子列表
function addList(obj){
	var liCate = $("[data-cate-id="+obj[0]+"]");
	if(obj[1]){
		if(!(liCate.getElementsByTagName("ul")[0])){
			var ulTask = document.createElement("ul");
			addClass(ulTask,"todo-task-list");
			liCate.appendChild(ulTask);
		}
		if(liCate.getElementsByTagName("ul")[0]){
			ulTask = liCate.getElementsByTagName("ul")[0];
			if(ulTask.hasAttribute("class","todo-task-list")){
				var liList = $("[data-list-id="+obj[1]+"]");
				if(!liList){
					var liTaskList = document.createElement("li");
					liTaskList.setAttribute("data-list-id",obj[1]);
					liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
						+ obj[1];
					ulTask.appendChild(liTaskList);
					init.todoTaskItem.push(liTaskList);
				}
			}
		}
		delegateClickEvent(init.todoTaskItem,init.classToggle);
	}
}
//添加子任务视图
function addInventory(obj){
	if(obj.cateList){
		var taskInventory = $(".todo-inventory-detail")[0];
		if(obj.time) {
			var dtTimeStr = obj.time - 0;
			var dtTime = $("[data-list-time=" + dtTimeStr + "]");
			if (dtTime) {
				addTitle(obj);
			}
			if(!dtTime){
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.innerHTML = "<time>"+formatTime(obj)+"</time>";
				taskInventory.appendChild(dtTaskTime);
				addTitle(obj);
			}
		}
		function addTitle(obj){
			if (obj.title) {
				var ddTaskTitle = document.createElement("dd");
				if(obj.isDone){
					ddTaskTitle.setAttribute("data-task-done","1");
					ddTaskTitle.innerHTML = obj.title+"<i class='fa fa-smile-o'></i>";
				}else{
					ddTaskTitle.setAttribute("data-task-done","0");
					ddTaskTitle.innerHTML = obj.title;
				}
				ddTaskTitle.setAttribute("data-list-id",obj.cateList[1]);
				ddTaskTitle.setAttribute("data-task-id",obj.id);
				taskInventory.appendChild(ddTaskTitle);
				init.todoDetail.push(ddTaskTitle);
			}
		}
		delegateClickEvent(init.todoDetail,init.classToggle);
	}
}

//点击事件

addClickEvent(datainit.todoCheckIcon,function(){
	var taskId = datainit.todoDefault[0].getAttribute("data-task-id");
	for(var i=0;i<tasks.length;i++){
		if(tasks[i].id == taskId){
			if(tasks[i].isDone){
				alert("该任务已完成！o(≧v≦)o~~");
			}else{
				if(confirm("又有一个任务完成了是吗~")){
					tasks[i].isDone = true;
					listInventory(tasks,tasks[i].cateList[1],"all");
					alert("该任务已完成！o(≧v≦)o~~");
				}
			}
		}
	}
});

addClickEvent(datainit.todoEditIcon,function(){

	var taskId = datainit.todoDefault[0].getAttribute("data-task-id");
		if(isTaskDefault(taskId)){
			for(var i=0;i<tasks.length;i++){
				if(tasks[i].id == taskId){
				if(tasks[i].isDone){
					if(confirm("该任务已完成！需要重置，进行编辑吗？")){
						tasks[i].isDone = false;
						listInventory(tasks,tasks[i].cateList[1],"all");
						taskEdit();
					}
				}else{
					taskEdit();
				}
			}
		}
	}
});

//判断是否为默认文本
function isTaskDefault(i){
	if(i==0){
		alert("我是【使用说明】(～￣▽￣)～，不要动我喔~");
		return false;
	}
	return true;
}

function taskEdit(){
	var taskId = datainit.todoDefault[0].getAttribute("data-task-id");
	if(isTaskDefault(taskId)){
		datainit.todoEditIcon.style.display = "none";
		datainit.todoCheckIcon.style.display = "none";
		datainit.todoSpecEdit.insertBefore(datainit.todoUndoEle,datainit.todoEditIcon);
		datainit.todoSpecEdit.insertBefore(datainit.todoCheckEle,datainit.todoUndoEle);
		datainit.todoUndoEle.style.display = "block";
		datainit.todoCheckEle.style.display = "block";
		delegateEleEvent(datainit.todoDefault,function(ele){
			ele.style.display = "none";
		});
		delegateEleEvent(datainit.todoEdit,function(ele){
			ele.style.display = "inline-block";
			for(var i=0;i<datainit.todoEdit.length;i++){
				datainit.todoEdit[i].value = datainit.todoDefault[i].innerHTML;
			}
		});
	}
}

addClickEvent(datainit.todoAddTask,function(){
	datainit.todoEditIcon.style.display = "none";
	datainit.todoCheckIcon.style.display = "none";
	datainit.todoSpecEdit.insertBefore(datainit.todoUndoEle,datainit.todoEditIcon);
	datainit.todoSpecEdit.insertBefore(datainit.todoCheckEle,datainit.todoUndoEle);
	datainit.todoUndoEle.style.display = "block";
	datainit.todoCheckEle.style.display = "block";
	delegateEleEvent(datainit.todoDefault,function(ele){
		ele.style.display = "none";
	});
	delegateEleEvent(datainit.todoEdit,function(ele){
		ele.style.display = "inline-block";
		for(var i=0;i<datainit.todoEdit.length;i++){
			datainit.todoEdit[i].value = "";
		}

	});
});

addClickEvent(datainit.todoCheckEle,function(){
	if(checkNewTask(datainit.todoEdit[0],datainit.todoEdit[1],datainit.todoEdit[2])){
		datainit.todoEditIcon.style.display = "block";
		datainit.todoCheckIcon.style.display = "block";
		datainit.todoUndoEle.style.display = "none";
		datainit.todoCheckEle.style.display = "none";
		delegateEleEvent(datainit.todoDefault,function(ele){
			ele.style.display = "inline";
			datainit.todoDefault[datainit.todoDefault.length-1].style.display = "block";
			for(var i=0;i<datainit.todoDefault.length;i++){
				datainit.todoDefault[i].innerHTML = datainit.todoEdit[i].value;
			}
		});
		delegateEleEvent(datainit.todoEdit,function(ele){
			ele.style.display = "none";
		});
	}

});

function checkNewTask(title,time,content){
	if(title.value == ""||time.value == ""||content.value == ""){
		alert("请仔细检查任务，查看是否填写完整~");
		return false;
	}
	else{
		console.log("任务OK");
		return true;
	}
}



var todoTaskList =  $(".todo-task-list");
var todoTaskItem = (function(){
	var todoItem = [];
	for(var j=0;j<todoTaskList.length;j++){
		var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
		for(var i=0;i<todoTaskItem.length;i++){
			todoItem.push(todoTaskItem[i]);
		}
	}
	return todoItem;
})();

addClickEvent(datainit.todoCateAll,function(){
	listInventory(tasks,"all","all");
});

delegateClickEvent(todoTaskItem,function(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	var listId = target.getAttribute("data-list-id");
	listInventory(tasks,listId,"all");
});

function listInventory(arr,list,isDone){
	var taskInventory = $(".todo-inventory-detail")[0];
	taskInventory.innerHTML = "";
	arr.sort(compare("time"));
	if(typeof isDone === "string"){
		for(var i=0;i<arr.length;i++){
			if(list === "all"){
				addInventory(arr[i]);
			}
			else if(arr[i].cateList[1] === list){
				addInventory(arr[i]);
			}
		}
	}
	else if(typeof isDone === "boolean"){
		if(isDone){
			for(var ii=0;ii<arr.length;ii++){
				if(list === "all"){
					addInventory(arr[ii]);
				}
				else if(arr[ii].isDone&&arr[ii].cateList[1] === list){
					addInventory(arr[ii]);
				}
			}
		}else{
			for(var iii=0;iii<arr.length;iii++){
				if(list === "all"){
					addInventory(arr[iii]);
				}
				else if(!arr[iii].isDone&&arr[iii].cateList[1] === list){
					addInventory(arr[iii]);
				}
			}
		}
	}
	datainit.todoDetail = $("dd");
	delegateClickEvent(datainit.todoDetail,function(e){
		e = e||window.event;
		var target = e.target|| e.srcElement;
		var taskId = target.getAttribute("data-task-id");
		for(var i=0;i<tasks.length;i++){
			if(tasks[i].id == taskId){
				addContent(tasks[i]);
			}
		}
	});

}


delegateClickEvent(datainit.todoInventory,function(e){
	e =e || window.event;
	var target = e.target|| e.srcElement;
	var listSelected = $(".todo-task-selected")[0];
	if(listSelected){
		var listId = listSelected.getAttribute("data-list-id");
	}else{
		listId = "all";
	}
	switch (target.getAttribute("id")){
		case "todo-all":
			listInventory(tasks,listId,"all");
			break;
		case "todo-doing":
			listInventory(tasks,listId,false);
			break;
		case "todo-done":
			listInventory(tasks,listId,true);
			break;
	}
});


//时间排序
function compare(properyName){
	return function(obj1,obj2){
		var val1 = obj1[properyName];
		var val2 = obj2[properyName];
		if(val1<val2){
			return -1;
		}else if(val1>val2){
			return 1;
		}else{
			return 0;
		}
	}
}

addClickEvent(datainit.todoCateBtn,function(){
	addCatePanel("block");
	if(datainit.addCateCancel){
		addClickEvent(datainit.addCateCancel,function(){
			addCatePanel("none");
		});
	}
	if(datainit.addCateCheck){
		addClickEvent(datainit.addCateCheck,function(){
			var mainCateName = datainit.addCateSelect.value;
			var newCateName = datainit.addCateName.value;
			addCateCheck(mainCateName,newCateName);
		});
	}
});

//检查输入内容插入新分类或新列表
function addCateCheck(main,name){
	if(getByteVal(name,20)){
		var cateName = getByteVal(name,20);
		if(main === "null"){
			if(confirm("确认创建新分类【"+cateName+"】吗？")){
				cates.push(new Category(cateName));
				addCate(cates[cates.length-1]);
				addCateOption(cates[cates.length-1].category);
				datainit.addCateName.value = "";
			}
			addCatePanel("none");
		}
		else{
			if(confirm("确认在【"+main+"】分类下创建新列表【"+cateName+"】吗？")){
				lists.push(new TaskList(main,cateName));
				addList(lists[lists.length-1]);
				delegateClickEvent(init.todoTaskItem,init.classToggle);
				datainit.addCateName.value = "";
			}
			addCatePanel("none");
		}
	}
}

//http://www.cnblogs.com/gossip/archive/2010/10/13/1849896.html
//返回val在规定字节长度max内的值
function getByteVal(val, max) {
	var returnValue = '';
	var byteValLen = 0;
	for (var i = 0; i < val.length; i++) {
		if (val[i].match(/[^\x00-\xff]/ig) != null){
			byteValLen += 2;
		}
		else{
			byteValLen += 1;
		}
		if (byteValLen > max){
			alert("分类名不能超过十位汉字！请重新想个简短的名字吧~");
			datainit.addCateName.value = "";
			return false;
		}
		returnValue += val[i];
	}
	return returnValue;
}

//下拉框添加主分类选项
for(var i=0;i<cates.length;i++){
	addCateOption(cates[i].category);
}
function addCateOption(cate){
	var cateOption = document.createElement("option");
	cateOption.setAttribute("value",cate);
	cateOption.innerHTML = cate;
	datainit.addCateSelect.appendChild(cateOption);
}

function addCatePanel(display){
	var addCatePanel = $(".add-cate-panel")[0];
	if(addCatePanel){
		var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
		var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
		var oWidth = addCatePanel.offsetWidth;
		var oHeight = addCatePanel.offsetHeight;
		addCatePanel.style.position = "absolute";
		addCatePanel.style.left = (cWidth-oWidth)/3 +"px";
		addCatePanel.style.top = (cHeight-oHeight)/3 +"px";
		addCatePanel.style.display = display;
	}
}

function addContent(obj){
	if(obj){
		datainit.todoDefault[1].innerHTML = formatTime(obj);
		datainit.todoDefault[0].setAttribute("data-task-id",obj.id);
		datainit.todoDefault[0].innerHTML = obj.title;
		datainit.todoDefault[2].innerHTML = obj.content;
	}
}