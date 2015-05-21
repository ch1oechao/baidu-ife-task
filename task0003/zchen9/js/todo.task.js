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
	todoInventory : $(".todo-inventory-category")[0].children

};

//初始化
if(defaultDetail){
	(function(){
		addCate(defaultCate);
		addList(defaultList);
		addInventory(defaultDetail);
		addContent(defaultDetail);
		var listFirst = $(".todo-task-list")[0].getElementsByTagName("li")[0];
		if(listFirst){
			addClass(listFirst,"todo-task-selected");
		}
		var titleFirst = $("dd")[0];
		if(titleFirst){
			addClass(titleFirst,"todo-detail-selected");
		}
	})();
}

//function addTask(obj){
//	addCate(obj);
//	addList(obj);
//	addInventory(obj);
//}
//
//for(var i= 0 ;i<tasks.length;i++){
//	addTask(tasks[i]);
//}

//function todoCount(obj){
//	for(var i=0;i<obj.length;i++){
//		if(!obj[i].isDone){
//			t++;
//		}
//	}
//	return t;
//}

//console.log(formatTime(task1));

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


addCate(cate1);

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
					+ obj.category
					+"<i class='fa fa-remove fa-fw'></i>";
			}
			liCate.appendChild(spanCateDefault);
			datainit.todoCateList.appendChild(liCate);
		}
	}
}

addList(list1);

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
						+ obj[1]
						+"<i class='fa fa-remove fa-fw'></i>";
					ulTask.appendChild(liTaskList);
				}
			}
		}

	}
}

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
			}
		}
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

//点击事件

addClickEvent(datainit.todoEditIcon,function(e){
	e = e || window.event;
	var target = e.target|| e.srcElement;
	target.style.display = "none";
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
});

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
	});
});

addClickEvent(datainit.todoCheckEle,function(){
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
});



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

delegateClickEvent(todoTaskItem,function(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	var listId = target.getAttribute("data-list-id");
	listInventory(tasks,listId,"all");
	datainit.todoDetail = $("dd");
	delegateClickEvent(datainit.todoDetail,function(e){
		e = e||window.event;
		var target = e.target|| e.srcElement;
		var taskId = target.getAttribute("data-task-id");
		addContent(tasks[taskId]);
	});
});

function listInventory(arr,list,isDone){
	var taskInventory = $(".todo-inventory-detail")[0];
	taskInventory.innerHTML = "";
	arr.sort(compare("time"));
	if(typeof isDone === "string"){
		for(var i=0;i<arr.length;i++){
			if(arr[i].cateList[1] === list){
				addInventory(arr[i]);
			}
			if(list === "all"){
				addInventory(arr[i]);
			}
		}
	}
	else if(typeof isDone === "boolean"){
		if(isDone){
			for(var ii=0;ii<arr.length;ii++){
				if(arr[ii].isDone&&arr[ii].cateList[1] === list){
					addInventory(arr[ii]);
				}
				if(list === "all"){
					addInventory(arr[i]);
				}
			}
		}else{
			for(var iii=0;iii<arr.length;iii++){
				if(!arr[iii].isDone&&arr[iii].cateList[1] === list){
					addInventory(arr[iii]);
				}
				if(list === "all"){
					addInventory(arr[i]);
				}
			}
		}
	}
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


