/**
* Created by Chen on 2015-05-19.
*/

var init = {
	todoCateList : $(".todo-category-list")[0],

	taskInventory : $(".todo-inventory-detail")[0],
	//todoDetail : $("dd"),
	todoDetail : (function(){
		var ddTitle = $("dd");
		var ddTitles = [];
		for(var i=0;i<ddTitle.length;i++){
			ddTitles.push(ddTitle[i]);
		}
		return ddTitles;
	})(),
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
	todoAllBtn: $("#todo-all"),

	addCateSelect : $("#add-cate-main"),
	addCateName : $("#add-cate-name"),
	addCateCancel : $("#add-cate-cancel"),
	addCateCheck : $("#add-cate-check"),

	todoTaskItem : (function(){
	    var todoTaskList = $(".todo-task-list");
	    var todoItem = [];
	    for(var j=0;j<todoTaskList.length;j++){
		    var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
		    for(var i=0;i<todoTaskItem.length;i++){
			    todoItem.push(todoTaskItem[i]);
		    }
	    }
	    return todoItem;
    })(),
    todoTaskList : $(".todo-task-list"),
    classToggle : function(e){
	    e = e||window.event;
	    var target = e.target||e.srcElement;
	    stopBubble(e);
	    var classname = "";
	    if(target.parentNode!=null){
		    switch(target.parentNode.className){
			    case "todo-inventory-detail":
				    classname="todo-detail-selected";
				    break;
			    case "todo-inventory-category":
				    classname="todo-inventory-selected";
				    break;
			    case "todo-task-list":
				    classname="todo-task-selected";
				    for(var j=0;j<init.todoTaskItem.length;j++){
					    removeClass(init.todoTaskItem[j],classname);
				    }
				    break;
		    }
		    delegateInitClass(target,classname);
	    }
    }
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
					+ obj.category
					+"<span class='remove-cate'><i class='fa fa-trash-o'></i></span>";
			}
			liCate.appendChild(spanCateDefault);
			init.todoCateList.appendChild(liCate);
		}
		delegateClickEvent(init.todoTaskItem,init.classToggle);
		delegateClickEvent(init.todoTaskItem,taskItemClick);
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
				if(!liList||liList.nodeName!="LI"){
					var liTaskList = document.createElement("li");
					liTaskList.setAttribute("data-list-id",obj[1]);
					if(obj[1]=="使用说明"){
						liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
							+ obj[1];
					}else{
						liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
							+ obj[1];
						var removeSpan = document.createElement("span");
						addClass(removeSpan,"remove-list");
						var removeIcon = document.createElement("i");
						addClass(removeIcon,"fa fa-trash-o");
						removeSpan.appendChild(removeIcon);
						liTaskList.appendChild(removeSpan);
						//removeItem.push(removeIcon);
					}
					ulTask.appendChild(liTaskList);
					init.todoTaskItem.push(liTaskList);
				}
			}
		}
		delegateClickEvent(init.todoTaskItem,init.classToggle);
		delegateClickEvent(init.todoTaskItem,taskItemClick);
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
//删除分类
function removeCate(item){
	if(item.parentNode.parentNode.nodeName === "LI"){
		var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
		if(confirm("是否删除分类【"+liCate+"】和所有子分类任务？删除后不可恢复╮(╯▽╰)╭")){
			var removeItem = [];
			each(cates,function(item){
				if(item.category == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				cates.remove(item);
			});
			removeItem = [];
			each(lists,function(item,i){
				if(item[0] == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				lists.remove(item);
			});
			removeItem = [];
			each(tasks,function(item,i){
				if(item.cateList[0] == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				tasks.remove(item);
			});
			init.addCateSelect.innerHTML = "";
			listCates(cates);
			listLists(lists);
		}
	}
}
//删除列表
function removeList(item){
	if(item.parentNode.nodeName === "LI"&&hasClass(item.parentNode,"todo-task-selected")){
		var liList = item.parentNode.getAttribute("data-list-id");
		if(confirm("是否删除列表【"+liList+"】和所有子任务？删除后不可恢复╮(╯▽╰)╭")){
			var removeItem = [];
			each(lists,function(item,i){
				if(item[1] == liList){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				lists.remove(item);
			});
			removeItem = [];
			each(tasks,function(item,i){
				if(item.cateList[1] == liList){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				tasks.remove(item);
			});
			listLists(lists);
		}
	}else{
		alert("选中列表后才能删除~");
	}
}
//刷新分类视图
function listCates(arr){
	init.todoCateList.innerHTML = "";
	each(arr,function(item){
		addCate(item);
		addCateOption(item.category);
	});
	delegateClickEvent(removeIcon(),removeClick);
	listInventory(tasks,"all","all");
	delegateClickEvent(init.todoTaskItem,taskItemClick);
}
//刷新子列表视图
function listLists(arr){
	each(init.todoTaskList,function(item){
		item.innerHTML = "";
	});
	each(arr,function(item){
		addList(item);
	});
	delegateClickEvent(removeIcon(),removeClick);
	listInventory(tasks,"all","all");
	delegateClickEvent(init.todoTaskItem,taskItemClick);
}

//删除点击事件
function removeIcon(){
	var removeListIcon = $(".fa-trash-o");
	var removeItem =[];
	for(var ii=0;ii<removeListIcon.length;ii++){
		removeItem.push(removeListIcon[ii]);
	}
	return removeItem;
}
function removeClick(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	if(target.parentNode.nodeName==="SPAN"){
		var removeSpanClass = target.parentNode.getAttribute("class");
		switch (removeSpanClass){
			case "remove-list":
				removeList(target.parentNode);
				break;
			case "remove-cate":
				removeCate(target.parentNode);
				break;
		}
	}
}
delegateClickEvent(removeIcon(),removeClick);

//任务完成点击事件
addClickEvent(init.todoCheckIcon,function(){
	var taskId = init.todoDefault[0].getAttribute("data-task-id");
	for(var i=0;i<tasks.length;i++){
		if(tasks[i].id == taskId){
			if(tasks[i].isDone){
				alert("该任务已完成！o(≧v≦)o~~");
			}else{
				if(confirm("又有一个任务完成了是吗~【完成后不能再改喽~】")){
					tasks[i].isDone = true;
					listInventory(tasks,tasks[i].cateList[1],"all");
					delegateInitClass(init.todoAllBtn,"todo-inventory-selected");
					alert("该任务已完成！o(≧v≦)o~~");
				}
			}
		}
	}
});

//任务编辑点击事件
addClickEvent(init.todoEditIcon,function(){
	var taskId = init.todoDefault[0].getAttribute("data-task-id");
		if(isTaskDefault(taskId)){
			var itemTask = isTaskDefault(taskId);
			if(itemTask.isDone){
				alert("该任务已完成，不能编辑喽(～￣▽￣)～");
			}else{
				taskEdit(itemTask);
			}
		}
});

//判断是否为默认文本
function isTaskDefault(i){
	var taskItem = "";
	if(i==0){
		alert("我是【使用说明】(～￣▽￣)～，不要调戏我~");
		return false;
	}else{
		each(tasks,function(item){
			if(item.id == i){
				taskItem = item;
			}
		});
		return taskItem;
	}
}
//任务编辑事件
function taskEdit(item){
	if(confirm("确认编辑"+item.title+"任务吗？")){
		//初始化编辑界面
		editIcon("edit");
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "none";
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "inline-block";
			for(var i=0;i<init.todoEdit.length;i++){
				init.todoEdit[i].value = init.todoDefault[i].innerHTML;
			}
		});
	}
}

//检查编辑后的任务内容
//addClickEvent(init.todoCheckEle,console.log("a"));

function editOldTask(item){
	//检查任务是否为空
	if(checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2])){
		//修改任务
		var editTask = checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2]);
		item.title = editTask[0];
		item.time = editTask[1];
		item.content = editTask[2];
		console.log(item);
		console.log(tasks);
		//更新清单视图
		listInventory(tasks,item.id,"all");
		//更新内容视图
		editIcon("check");
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "inline";
			init.todoDefault[init.todoDefault.length-1].style.display = "block";
			for(var i=0;i<init.todoDefault.length;i++){
				init.todoDefault[i].innerHTML = init.todoEdit[i].value;
			}
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "none";
		});
	}
}


//编辑任务时图标切换
function editIcon(status){
	switch (status){
		case "edit":
			init.todoEditIcon.style.display = "none";
			init.todoCheckIcon.style.display = "none";
			init.todoSpecEdit.insertBefore(init.todoUndoEle,init.todoEditIcon);
			init.todoSpecEdit.insertBefore(init.todoCheckEle,init.todoUndoEle);
			init.todoUndoEle.style.display = "block";
			init.todoCheckEle.style.display = "block";
			break;
		case "check":
			init.todoEditIcon.style.display = "block";
			init.todoCheckIcon.style.display = "block";
			init.todoUndoEle.style.display = "none";
			init.todoCheckEle.style.display = "none";
			break;
	}
}

//添加新任务点击事件
addClickEvent(init.todoAddTask,function(){
	//判断是否选中某一项任务列表
	var taskSelected = $(".todo-task-selected")[0];
	if(taskSelected&&taskSelected.nodeName=="LI"){
		var dataListId = taskSelected.getAttribute("data-list-id");
		each(lists,function(item){
			if(item[1] == dataListId){
				if(confirm("将在【"+item[0]+"】分类下的【"+dataListId+"】列表新增任务~")){
					editIcon("edit");
					delegateEleEvent(init.todoDefault,function(ele){
						ele.style.display = "none";
					});
					delegateEleEvent(init.todoEdit,function(ele){
						ele.style.display = "inline-block";
						ele.value = "";
					});
					//编辑任务新建完成点击事件
					addClickEvent(init.todoCheckEle,addNewTask);
				}
			}
		});
	}else{
		alert("【新增任务】需要选中【目标分类】喔~╰(￣▽￣)╭");
	}
});


addClickEvent(init.todoUndoEle,reback);

//取消编辑
function reback(){
	if(confirm("取消任务编辑吗？")){
		var taskId = init.todoDefault[0].getAttribute("data-task-id");
		//更新内容视图
		editIcon("check");
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "inline";
			init.todoDefault[init.todoDefault.length-1].style.display = "block";
			//更新任务显示
			each(tasks,function(item){
				if(item.id == taskId){
					addContent(item);
				}
			});
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "none";
		});
	}
}

function addNewTask(){
	var cateList = [];
	var taskSelected = $(".todo-task-selected")[0];
	if(taskSelected&&taskSelected.nodeName=="LI"){
		var dataListId = taskSelected.getAttribute("data-list-id");
		each(lists,function(item) {
			if (item[1] == dataListId) {
				cateList = [item[0],dataListId];
			}
		});
	}
	//检查任务是否为空
	if(checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2])){
		//新建任务
		var newTask = checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2]);
		tasks.push(new TaskDetail(cateList,newTask[0],newTask[1],newTask[2],false));
		each(tasks,function(item,i){
			item.id = i;
		});
		//更新清单视图
		listInventory(tasks,dataListId,"all");
		//更新内容视图
		editIcon("check");
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "inline";
			init.todoDefault[init.todoDefault.length-1].style.display = "block";
			for(var i=0;i<init.todoDefault.length;i++){
				init.todoDefault[i].innerHTML = init.todoEdit[i].value;
			}
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "none";
		});
	}
}

//检查新建任务内容
function checkTask(title,time,content){
	var timeRex = /^(\d{4})\-(\d{2})\-(\d{2})$/;
	if(title.value == ""||time.value == ""||content.value == ""){
		alert("请仔细检查任务，查看是否填写完整~");
		return false;
	}
	if(getByteVal(title.value,20)){
		var taskTitle = getByteVal(title.value,20);
	}else{
		return false;
	}
	if(timeRex.test(time.value)&&checkTime(time.value)){
		var taskTime = checkTime(time.value);
	}else{
		return false;
	}
	return [taskTitle,taskTime,content.value];
}
//检查时间
function checkTime(time){
	var dates = time.split("-");
	var year = parseInt(dates[0]);
	var month = parseInt(dates[1]-1);
	var day = parseInt(dates[2]);
	var curDate = new Date();
	var taskDate = new Date(year,month,day);
	if(curDate > taskDate){
		alert("任务完成日期太超前啦");
		return false;
	}
	else{
		return taskDate;
	}
}

//点击查看所有任务事件
addClickEvent(init.todoCateAll,function(){
	each(init.todoTaskItem,function(item){
		removeClass(item,"todo-task-selected");
	});
	listInventory(tasks,"all","all");
});
//点击查看单项任务事件
delegateClickEvent(init.todoTaskItem,taskItemClick);

function taskItemClick(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	if(target.nodeName.toLowerCase()=="li"){
		var listId = target.getAttribute("data-list-id");
		listInventory(tasks,listId,"all");
	}
}
//刷新任务清单视图事件
function listInventory(arr,list,isDone){
	var taskInventory = $(".todo-inventory-detail")[0];
	taskInventory.innerHTML = "";
	arr.sort(compare("time"));
	switch (typeof isDone){
		case "string":
			if(list === "all"){
				each(arr,function(item){
					addInventory(item);
				});
			}else{
				for(var i=0;i<arr.length;i++){
					if(arr[i].cateList[1] === list){
						addInventory(arr[i]);
					}
				}
			}
			break;
		case "boolean":
			if(isDone){
				if(list === "all"){
					each(arr,function(item){
						if(item.isDone){
							addInventory(item);
						}
					});
				}
				else{
					for(var ii=0;ii<arr.length;ii++){
						if(arr[ii].isDone&&arr[ii].cateList[1] === list){
							addInventory(arr[ii]);
						}
					}
				}
			}else{
				if(list === "all"){
					each(arr,function(item){
						if(!item.isDone){
							addInventory(item);
						}
					});
				}else{
					for(var iii=0;iii<arr.length;iii++){
						if(!arr[iii].isDone&&arr[iii].cateList[1] === list){
							addInventory(arr[iii]);
						}
					}
				}
			}
			break;
	}
	init.todoDetail = $("dd");
	delegateClickEvent(init.todoDetail,function(e){
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

delegateClickEvent(init.todoInventory,init.classToggle);
//任务清单菜单选项点击事件
delegateClickEvent(init.todoInventory,function(e){
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
//新增分类点击事件
addClickEvent(init.todoCateBtn,function(){
	addCatePanel("block");
	if(init.addCateCancel){
		addClickEvent(init.addCateCancel,function(){
			init.addCateName.value = "";
			addCatePanel("none");
		});
	}
	if(init.addCateCheck){
		addClickEvent(init.addCateCheck,function(){
			var mainCateName = init.addCateSelect.value;
			var newCateName = init.addCateName.value;
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
				delegateClickEvent(removeIcon(),removeClick);
				init.addCateName.value = "";
			}
			addCatePanel("none");
		}
		else{
			if(confirm("确认在【"+main+"】分类下创建新列表【"+cateName+"】吗？")){
				lists.push(new TaskList(main,cateName));
				addList(lists[lists.length-1]);
				delegateClickEvent(init.todoTaskItem,init.classToggle);
				delegateClickEvent(removeIcon(),removeClick);
				init.addCateName.value = "";
			}
			addCatePanel("none");
		}
	}
}

//http://www.cnblogs.com/gossip/archive/2010/10/13/1849896.html
//返回val在规定字节长度max内的值
function getByteVal(val, max){
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
			alert("名称不能超过十位汉字！请重新想个简短的名字吧~");
			init.addCateName.value = "";
			return false;
		}
		if(byteValLen == 0){
			alert("名称不能为空！快起个名字吧~");
			init.addCateName.value = "";
			return false;
		}
		returnValue += val[i];
	}
	return returnValue;
}

//下拉框添加主分类选项
each(cates,function(item){
	addCateOption(item.category);
});
function addCateOption(cate){
	var cateOption = document.createElement("option");
	cateOption.setAttribute("value",cate);
	cateOption.innerHTML = cate;
	init.addCateSelect.appendChild(cateOption);
}
//添加新增分类选框
function addCatePanel(display){
	var addCatePanel = $(".add-cate-panel")[0];
	if(addCatePanel){
		var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
		var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
		var oWidth = addCatePanel.offsetWidth;
		var oHeight = addCatePanel.offsetHeight;
		addCatePanel.style.position = "absolute";
		addCatePanel.style.left = Math.round((cWidth-oWidth)/3.2) +"px";
		addCatePanel.style.top = Math.round((cHeight-oHeight)/3.2) +"px";
		addCatePanel.style.display = display;
	}
}
//更新任务详细内容
function addContent(obj){
	if(obj){
		init.todoDefault[1].innerHTML = formatTime(obj);
		init.todoDefault[0].setAttribute("data-task-id",obj.id);
		init.todoDefault[0].innerHTML = obj.title;
		init.todoDefault[2].innerHTML = obj.content;
	}
}