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
	todoTotal : $("#todo-total-count")
};


//初始化
if(defaultTask){
	(function(){
		var todoCateList = datainit.todoCateList;
		var liCateDefault = document.createElement("li");
		liCateDefault.setAttribute("data-cate-id",defaultTask.category);
		var spanCateDefault = document.createElement("span");
		spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
									+defaultTask.category
									+" ("+todoCount(defaultTask)+")";
		liCateDefault.appendChild(spanCateDefault);
		if(defaultTask.taskList){
			var ulTaskList = document.createElement("ul");
			addClass(ulTaskList,"todo-task-list");
			var liTaskList = document.createElement("li");
			liTaskList.setAttribute("data-list-id",defaultTask.taskList);
			liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>" + defaultTask.taskList;
			ulTaskList.appendChild(liTaskList);
			liCateDefault.appendChild(ulTaskList);
		}
		todoCateList.appendChild(liCateDefault);
		var defaultTaskList = $(".todo-task-list")[0].getElementsByTagName("li")[0];
		addClass(defaultTaskList,"todo-task-selected");
		if(defaultTask.taskDetail){
			var taskDetail = defaultTask.taskDetail;
			if(taskDetail[1]){
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.setAttribute("data-list-time",defaultTask.taskDetail[1]-0);
				dtTaskTime.innerHTML = "<time>"+formatTime(defaultTask)+"</time>";
				datainit.taskInventory.appendChild(dtTaskTime);
				datainit.todoDefault[1].innerHTML = formatTime(defaultTask);
			}
			if(taskDetail[0]){
				var ddTaskTitle = document.createElement("dd");
				if(defaultTask.isDone){
					ddTaskTitle.setAttribute("data-task-done","1");
					ddTaskTitle.innerHTML = taskDetail[0]+"<i class='fa fa-smile-o'></i>";
				}else{
					ddTaskTitle.setAttribute("data-task-done","0");
					ddTaskTitle.innerHTML = taskDetail[0];
				}
				ddTaskTitle.setAttribute("data-task-id",defaultTask.id);
				datainit.taskInventory.appendChild(ddTaskTitle);
				datainit.todoDefault[0].setAttribute("data-task-id",defaultTask.id);
				datainit.todoDefault[0].innerHTML = taskDetail[0];
				var defaultTaskTitle = $("dd")[0];
				addClass(defaultTaskTitle,"todo-detail-selected");
			}
			if(taskDetail[2]){
				datainit.todoDefault[2].innerHTML = taskDetail[2];
			}
		}
	})();
}

function addTask(obj){
	addCate(obj);
	addList(obj);
	//addInventory(obj);
}

//addTask(task1);
//addTask(task2);
//addTask(task3);
//addTask(task4);

function todoCount(obj){
	for(var i=0;i<obj.length;i++){
		if(!obj[i].isDone){
			t++;
		}
	}
	return t;
}


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


delegateClickEvent(datainit.todoDetail,function(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	var taskId = target.getAttribute("data-task-id");
	addContent(tasks[taskId]);
});

function formatTime(obj){
	var taskDetail = obj.taskDetail;
	if(taskDetail[1]){
		var year = taskDetail[1].getFullYear();
		var month = taskDetail[1].getMonth()+1;
		var date = taskDetail[1].getDate();
		if(month<10){
			month = "0"+month;
		}
		if(date<10){
			date = "0"+date;
		}
	}
	return [year,month,date].join("-");
}


function addCate(obj){
	if(obj){
		var liCate = $("[data-cate-id="+obj.category+"]");
		if(!liCate){
			liCate = document.createElement("li");
			liCate.setAttribute("data-cate-id",obj.category);
			var spanCateDefault = document.createElement("span");
			spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
										+ obj.category
										+" ("+todoCount(obj)+")"
										+"<i class='fa fa-remove fa-fw'></i>";
			liCate.appendChild(spanCateDefault);
			datainit.todoCateList.appendChild(liCate);
		}
	}
}

function addList(obj){
	var liCate = $("[data-cate-id="+obj.category+"]");
	if(obj.taskList){
		if(!(liCate.getElementsByTagName("ul")[0])){
			var ulTask = document.createElement("ul");
			addClass(ulTask,"todo-task-list");
			liCate.appendChild(ulTask);
		}
		if(liCate.getElementsByTagName("ul")[0]){
			ulTask = liCate.getElementsByTagName("ul")[0];
			if(ulTask.hasAttribute("class","todo-task-list")){
				var liList = $("[data-list-id="+obj.taskList+"]");
				if(!liList){
					var liTaskList = document.createElement("li");
					liTaskList.setAttribute("data-list-id",obj.taskList);
					liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
					+ obj.taskList
					+"<i class='fa fa-remove fa-fw'></i>";
					ulTask.appendChild(liTaskList);
				}
			}
		}

	}
}

function addInventory(obj){
	if(obj.taskDetail){
		var taskDetail = obj.taskDetail;
		var taskInventory = $(".todo-inventory-detail")[0];
		if(taskDetail[1]) {
			var dtTimeStr = taskDetail[1] - 0;
			var dtTime = $("[data-list-time=" + dtTimeStr + "]");
			if (dtTime) {
				addTitle(taskDetail);
			}
			if(!dtTime){
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.innerHTML = "<time>"+formatTime(obj)+"</time>";
				taskInventory.appendChild(dtTaskTime);
				addTitle(taskDetail);
			}
		}
		function addTitle(taskDetail){
			if (taskDetail[0]) {
				var ddTaskTitle = document.createElement("dd");
				if(obj.isDone){
					ddTaskTitle.setAttribute("data-task-done","1");
					ddTaskTitle.innerHTML = taskDetail[0]+"<i class='fa fa-smile-o'></i>";
				}else{
					ddTaskTitle.setAttribute("data-task-done","0");
					ddTaskTitle.innerHTML = taskDetail[0];
				}
				ddTaskTitle.setAttribute("data-task-id",obj.id);
				taskInventory.appendChild(ddTaskTitle);
			}
		}
	}
}

function addContent(obj){
	if(obj.taskDetail){
		datainit.todoDefault[1].innerHTML = formatTime(obj);
		datainit.todoDefault[0].setAttribute("data-task-id",obj.id);
		datainit.todoDefault[0].innerHTML = obj.taskDetail[0];
		datainit.todoDefault[2].innerHTML = obj.taskDetail[2];
	}
}

