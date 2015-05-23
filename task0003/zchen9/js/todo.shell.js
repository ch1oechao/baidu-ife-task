/***
* @author:zchen9(zhao.zchen9@gmail.com)
*/
/*--------------初始化变量、默认视图--------------*/

//初始化变量
var init = {
	//主分类列表<ul>
	todoCateList : $(".todo-category-list")[0],
	//任务清单列表<dl>
	taskInventory : $(".todo-inventory-detail")[0],
	//任务清单视图单项任务<dd>
	todoDetail : $("dd"),
	//任务内容视图，返回文本显示的内容 <任务标题、时间、内容>
	todoDefault: (function(){
		var taskTitle = $("#todo-default-title");
		var taskTime = $("#todo-default-time");
		var taskContent = $("#todo-default-content");
		return [taskTitle,taskTime,taskContent];
	})(),
	//任务内容视图，返回编辑显示的内容 <任务标题、时间、内容>
	todoEdit: (function(){
		var taskTitle = $("#todo-task-title");
		var taskTime = $("#todo-task-time");
		var taskContent = $("#todo-task-content");
		taskTitle.style.display = "none";
		taskTime.style.display = "none";
		taskContent.style.display = "none";
		return [taskTitle,taskTime,taskContent];
	})(),
	//任务内容视图，编辑文本按钮区域<span>
	todoSpecEdit : $(".todo-spec-edit")[0],
	//任务内容编辑图标<i>
	todoEditIcon : $(".fa-pencil-square-o")[0],
	//任务内容完成图标<i>
	todoCheckIcon : $(".fa-check-square-o")[0],
	//任务编辑状态回撤图标<i>
	todoUndoEle : $(".fa-undo")[0],
	//任务编辑状态确认图标<i>
	todoCheckEle : $(".fa-check")[0],
	//任务清单视图下的新增任务按钮<a>
	todoAddTask : $("#todo-add-task"),
	//所有任务总数区域<span>
	todoTotal : $("#todo-total-count"),
	//任务清单筛选菜单项<li>
	todoInventory : $(".todo-inventory-category")[0].children,
	//任务分类视图下新增分类按钮<a>
	todoCateBtn :$("#todo-add-category"),
	//任务分类视图显示所有任务块<p>
	todoCateAll:$(".todo-category-total")[0],
	//任务清单视图的所有菜单项
	todoAllBtn: $("#todo-all"),

	//新增分类弹窗块
	//新增主分类下拉框<select>
	addCateSelect : $("#add-cate-main"),
	//新增分类名称<input>
	addCateName : $("#add-cate-name"),
	//新增分类取消按钮<span>
	addCateCancel : $("#add-cate-cancel"),
	//新增分类确定按钮<span>
	addCateCheck : $("#add-cate-check"),

	//任务分类视图下所有列表项<li>
	todoTaskItem : (function(){
		var todoTaskList = $(".todo-task-list");
		var todoItem = [];
		for(var j=0;j<todoTaskList.length;j++){
			var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
			each(todoTaskItem,function(item){
				todoItem.push(item);
			});
		}
		return todoItem;
	})(),
	//返回所有删除图标项
	removeIcon : (function(){
		var removeListIcon = $(".fa-trash-o");
		var removeItem =[];
		each(removeListIcon,function(item){
			removeItem.push(item);
		});
		return removeItem;
	})(),
	//各分类下的子列表<ul>
	todoTaskList : $(".todo-task-list"),

	//鼠标点击时更换样式
	classToggle : function(e){
		e = e||window.event;
		var target = e.target||e.srcElement;
		stopBubble(e);
		var classname = "";
		if(target.parentNode!=null){
			switch(target.parentNode.className){
				//任务清单视图任务项
				case "todo-inventory-detail":
					classname="todo-detail-selected";
					break;
				//任务清单视图筛选菜单项
				case "todo-inventory-category":
					classname="todo-inventory-selected";
					break;
				//任务列表视图列表项
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


//初始化显示内容
(function(){
	//添加所有已存在分类
	each(data.cates,addCate);
	//添加所有已存在列表
	each(data.lists,addList);
	//添加默认任务清单和内容
	addInventory(data.tasks[0]);
	addContent(data.tasks[0]);
	//初始化默认选中任务列表
	var listFirst = $(".todo-task-list")[0].getElementsByTagName("li")[0];
	if(listFirst){
		addClass(listFirst,"todo-task-selected");
	}
	//初始化默认选中任务项
	var titleFirst = $("dd")[0];
	if(titleFirst){
		addClass(titleFirst,"todo-detail-selected");
	}
	//初始化未完成任务总数
	init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";

	//初始化切换样式点击事件
	//任务清单筛选项
	delegateClickEvent(init.todoInventory,init.classToggle);
	//任务列表项
	delegateClickEvent(init.todoTaskItem,init.classToggle);
	//任务清单项
	delegateClickEvent(init.todoDetail,init.classToggle);

})();


/*--------------分类视图---------------*/

//计算未完成任务
function todoCount(arr,type){
	var count = 0;
	//判断数组类型
	switch (arr){
		//所有任务数
		case "data.tasks":
			each(data.tasks,function(item){
				if(!item.isDone){
					count++;
				}
			});
			return count;
			break;
		//列表下任务数
		case "data.lists":
			each(data.tasks,function(item){
				if(!item.isDone&&item.cateList[1]==type){
					count++;
				}
			});
			return count;
			break;
		//分类下任务数
		case "data.cates":
			each(data.tasks,function(item){
				if(!item.isDone&&item.cateList[0]==type){
					count++;
				}
			});
			return count;
			break;
	}
}

//添加主分类
function addCate(obj){
	if(obj.category){
		//检查是否已存在对象的分类项
		var liCate = $("[data-cate-id="+obj.category+"]");
		if(!liCate){
			//增加新分类项
			liCate = document.createElement("li");
			//设置主分类项【data-cate-id】内容为主分类名称
			liCate.setAttribute("data-cate-id",obj.category);
			var spanCateDefault = document.createElement("span");
			//默认分类默认不能删除
			if(obj.category === "默认分类"){
				spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
					+ obj.category
					+"("+todoCount("data.cates",obj.category)+")";
			}else{
				spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
					+ obj.category
					+"("+todoCount("data.cates",obj.category)+")";
				var removeSpan = document.createElement("span");
				addClass(removeSpan,"remove-cate");
				var  removeItem = document.createElement("i");
				addClass(removeItem,"fa fa-trash-o");
				removeSpan.appendChild(removeItem);
				spanCateDefault.appendChild(removeSpan);
				//更新删除图标
				init.removeIcon.push(removeItem);

			}
			liCate.appendChild(spanCateDefault);
			//添加分类项
			init.todoCateList.appendChild(liCate);
		}
		//遍历删除图标点击事件监听
		delegateClickEvent(init.removeIcon,removeClick);
	}
}
//添加子列表
function addList(obj){
	//检查是否已存在对象的分类项
	var liCate = $("[data-cate-id="+obj[0]+"]");
	if(obj[1]){
		//检查分类项中是否存在子列表项
		if(!(liCate.getElementsByTagName("ul")[0])){
			var ulTask = document.createElement("ul");
			addClass(ulTask,"todo-task-list");
			liCate.appendChild(ulTask);
		}
		if(liCate.getElementsByTagName("ul")[0]){
			ulTask = liCate.getElementsByTagName("ul")[0];
			if(ulTask.hasAttribute("class","todo-task-list")){
				//设置列表项【data-list-id】 内容为列表名称
				var liList = $("[data-list-id="+obj[1]+"]");
				if(!liList||liList.nodeName!="LI"){
					var liTaskList = document.createElement("li");
					liTaskList.setAttribute("data-list-id",obj[1]);
					//默认任务<使用说明>不能删除
					if(obj[1]=="使用说明"){
						liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
							+ obj[1]
							+"("+todoCount("data.lists",obj[1])+")";
					}else{
						liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
							+ obj[1]
							+"("+todoCount("data.lists",obj[1])+")";
						var removeSpan = document.createElement("span");
						addClass(removeSpan,"remove-list");
						var  removeItem = document.createElement("i");
						addClass(removeItem,"fa fa-trash-o");
						removeSpan.appendChild(removeItem);
						liTaskList.appendChild(removeSpan);
						//更新删除图标
						init.removeIcon.push(removeItem);
					}
					ulTask.appendChild(liTaskList);
					//更新列表项
					init.todoTaskItem.push(liTaskList);
				}
			}
		}
		//鼠标点击列表事件监听
		//更换样式
		delegateClickEvent(init.todoTaskItem,init.classToggle);
		//更新清单任务视图
		delegateClickEvent(init.todoTaskItem,taskItemClick);
		//遍历删除图标点击事件监听
		delegateClickEvent(init.removeIcon,removeClick);
	}
}

//添加删除图标点击事件
function removeClick(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	if(target.parentNode.nodeName==="SPAN"){
		var removeSpanClass = target.parentNode.getAttribute("class");
		switch (removeSpanClass){
			//判断删除类型
			case "remove-list":
				removeList(target.parentNode);
				break;
			case "remove-cate":
				removeCate(target.parentNode);
				break;
		}
	}
}

//删除主分类
function removeCate(item){
	if(item.parentNode.parentNode.nodeName === "LI"){
		var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
		if(confirm("是否删除主分类【"+liCate+"】和所有子列表任务？删除后不可恢复╮(╯▽╰)╭")){
			//删除分类对象
			var removeItem = [];
			each(data.cates,function(item){
				if(item.category == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				data.cates.remove(item);
			});
			//删除分类下相关列表
			removeItem = [];
			each(data.lists,function(item,i){
				if(item[0] == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				data.lists.remove(item);
			});
			//删除分类和列表相关任务
			removeItem = [];
			each(data.tasks,function(item,i){
				if(item.cateList[0] == liCate){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				data.tasks.remove(item);
			});


			//刷新分类视图下分类项
			listCates(data.cates);
			//刷新分类视图下列表项
			listLists(data.lists);
		}
	}
}
//删除子列表
function removeList(item){
	if(item.parentNode.nodeName === "LI"&&hasClass(item.parentNode,"todo-task-selected")){
		var liList = item.parentNode.getAttribute("data-list-id");
		if(confirm("是否删除列表【"+liList+"】和所有子任务？删除后不可恢复╮(╯▽╰)╭")){
			//删除列表对象
			var removeItem = [];
			each(data.lists,function(item,i){
				if(item[1] == liList){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				data.lists.remove(item);
			});
			//删除列表相关任务
			removeItem = [];
			each(data.tasks,function(item,i){
				if(item.cateList[1] == liList){
					removeItem.push(item);
				}
			});
			each(removeItem,function(item){
				data.tasks.remove(item);
			});

			//刷新分类视图
			listCates(data.cates);
			//刷新列表视图
			listLists(data.lists);
		}
	}else{
		alert("选中列表后才能删除~");
	}
}

//刷新分类视图
function listCates(arr){
	//初始化分类视图
	init.todoCateList.innerHTML = "";
	//初始化新增分类弹窗下的下拉菜单内容
	initSelect();

	//添加更新后的对象数组
	each(arr,function(item){
		//更新分类项
		addCate(item);
		//更新新增分类弹窗下拉框的分类选项
		addCateOption(item.category);
	});

	//更新删除图标监听事件
	delegateClickEvent(init.removeIcon,removeClick);
	//更新任务清单视图
	listInventory(data.tasks,"all","all");
	//更新任务项点击事件监听
	delegateClickEvent(init.todoTaskItem,taskItemClick);
	//刷新未完成任务总数
	init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";
	//更新内容视图，默认任务内容
	addContent(data.tasks[0]);
}

//刷新子列表视图
function listLists(arr){
	//初始化各子列表内容
	each(init.todoTaskList,function(item){
		item.innerHTML = "";
	});
	//添加更新后的列表数组项
	each(arr,function(item){
		addList(item);
	});

	//更新删除图标监听事件
	delegateClickEvent(init.removeIcon,removeClick);
	//更新任务清单视图
	listInventory(data.tasks,"all","all");
	//更新任务项点击更新清单视图事件
	delegateClickEvent(init.todoTaskItem,taskItemClick);
	//更新任务项点击切换样式事件
	delegateClickEvent(init.todoTaskItem,init.classToggle);
	//刷新未完成任务总数
	init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";
	//更新内容视图，默认任务内容
	addContent(data.tasks[0]);

}

/*--------------分类视图-新增分类弹窗---------------*/

//新增分类点击事件
addClickEvent(init.todoCateBtn,function(){
	//显示新增分类弹窗
	addCatePanel("block");
	//新增分类确认按钮监听
	if(init.addCateCheck){
		addClickEvent(init.addCateCheck,function(){
			var mainCateName = init.addCateSelect.value;
			var newCateName = init.addCateName.value;
			//检查下拉框分类和新分类输入值
			addCateCheck(mainCateName,newCateName);
		});
	}
	//新增分类取消按钮监听
	if(init.addCateCancel){
		addClickEvent(init.addCateCancel,function(){
			init.addCateName.value = "";
			addCatePanel("none");
		});
	}
});

//初始化下拉框添加主分类选项
each(data.cates,function(item){
	addCateOption(item.category);
});
function addCateOption(cate){
	var cateOption = document.createElement("option");
	cateOption.setAttribute("value",cate);
	cateOption.innerHTML = cate;
	init.addCateSelect.appendChild(cateOption);
}

//检查输入内容插入新分类或新列表
function addCateCheck(main,name){
	//判断输入名称长度
	if(getByteVal(name,20)){
		var cateName = getByteVal(name,20);
		//判断主分类
		if(main === "null"){
			if(confirm("确认创建新分类【"+cateName+"】吗？")){
				//新增分类对象
				data.cates.push(new Category(cateName));
				//更新本地数据
				setData(data.cates,"cates");
				//刷新分类视图
				listCates(data.cates);
				//刷新列表视图
				listLists(data.lists);
			}
		}
		else{
			if(confirm("确认在【"+main+"】分类下创建新列表【"+cateName+"】吗？")){
				//新增列表对象
				data.lists.push(new TaskList(main,cateName));
				//更新本地数据
				setData(data.lists,"lists");
				//刷新分类视图
				listCates(data.cates);
				//刷新列表视图
				listLists(data.lists);
			}
		}
		//清空输入框内容
		init.addCateName.value = "";
		//关闭弹窗
		addCatePanel("none");
	}
}

/*--------------分类视图-点击事件监听---------------*/

//所有任务块点击监听事件
addClickEvent(init.todoCateAll,function(){
	each(init.todoTaskItem,function(item){
		removeClass(item,"todo-task-selected");
	});
	listInventory(data.tasks,"all","all");
});


//列表项点击刷新任务清单视图事件
delegateClickEvent(init.todoTaskItem,taskItemClick);
function taskItemClick(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	if(target.nodeName.toLowerCase()=="li"){
		var listId = target.getAttribute("data-list-id");
		listInventory(data.tasks,listId,"all");
	}
}

/*--------------清单视图---------------*/

//添加清单子项
function addInventory(obj){
	if(obj.cateList){
		//添加时间
		if(obj.time) {
			var dtTimeStr = new Date(obj.time) - 0;
			var dtTime = $("[data-list-time=" + dtTimeStr + "]");
			if (dtTime) {
				addTitle(obj);
			}
			if(!dtTime){
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.setAttribute("data-list-time",dtTimeStr);
				dtTaskTime.innerHTML = "<time>"+formatTime(obj)+"</time>";
				init.taskInventory.appendChild(dtTaskTime);
				addTitle(obj);
			}
		}
		//添加任务标题
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
				init.taskInventory.appendChild(ddTaskTitle);
				//更新清单项
				init.todoDetail = $("dd");
			}
		}
		//清单项点击事件监听
		delegateClickEvent(init.todoDetail,init.classToggle);
	}
}

/*--------------清单视图-新增任务--------------*/

//添加新任务点击事件
addClickEvent(init.todoAddTask,function(){
	//判断是否选中某一项任务列表
	var taskSelected = $(".todo-task-selected")[0];
	var cateList = [];
	if(taskSelected&&taskSelected.nodeName=="LI"){
		var dataListId = taskSelected.getAttribute("data-list-id");
		//使用说明下默认不建立子任务
		if(dataListId == "使用说明"){
			alert("【使用说明】不能新建子任务啦~");
		}else{
			each(data.lists,function(item){
				if(item[1] == dataListId){
					if(confirm("将在【"+item[0]+"】分类下的【"+dataListId+"】列表新增任务~")){
						//初始化编辑界面
						editIcon("edit");
						delegateEleEvent(init.todoDefault,function(ele){
							ele.style.display = "none";
						});
						delegateEleEvent(init.todoEdit,function(ele){
							ele.style.display = "inline-block";
							ele.value = "";
						});
					}
					cateList = [item[0],dataListId];
				}
			});
		}
		//编辑任务新建完成点击事件
		init.todoCheckEle.onclick = function(){
			if(checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2])){
				if(confirm("确认新建【"+init.todoEdit[0].value+"】任务吗？")){
					//新建任务
					var newTask = checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2]);
					//新增任务对象
					data.tasks.push(new TaskDetail(cateList,newTask[0],newTask[1],newTask[2],false));
					//遍历对象id
					each(data.tasks,function(item,i){
						item.id = i;
					});
					//更新本地数据
					setData(data.tasks,"tasks");
					//更新未完成任务总数
					init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";
					//刷新分类视图
					listCates(data.cates);
					//刷新列表视图
					listLists(data.lists);
					//更新清单视图
					listInventory(data.tasks,dataListId,"all");
					//更新内容视图
					editIcon("check");
					delegateEleEvent(init.todoDefault,function(ele){
						ele.style.display = "inline";
						init.todoDefault[init.todoDefault.length-1].style.display = "block";
						each(data.tasks,function(item){
							if(item.id == data.tasks.length-1){
								addContent(item);
							}
						});
					});
					delegateEleEvent(init.todoEdit,function(ele){
						ele.style.display = "none";
					});
				}
			}
		};
	}else{
		alert("【新增任务】需要选中【目标分类】喔~╰(￣▽￣)╭");
	}
});

//刷新任务清单视图事件
function listInventory(arr,list,isDone){
	//初始化任务清单视图内容
	init.taskInventory.innerHTML = "";
	//将任务内容按时间排序
	arr.sort(compare("time"));
	//检查筛选项
	switch (typeof isDone){
		//默认所有
		case "string":
			//遍历所有对象的任务
			if(list === "all"){
				each(arr,function(item){
					addInventory(item);
				});
			}
			//遍历指定id对象的任务
			else{
				each(arr,function(item){
					if(item.cateList[1] === list){
						addInventory(item);
					}
				})
			}
			break;
		case "boolean":
			//已完成
			if(isDone){
				//遍历所有对象已完成任务
				if(list === "all"){
					each(arr,function(item){
						if(item.isDone){
							addInventory(item);
						}
					});
				}
				//遍历指定id对象所有已完成任务
				else{
					each(arr,function(item){
						if(item.isDone&&item.cateList[1] === list){
							addInventory(item);
						}
					});
				}
			}
			//未完成
			else{
				//遍历所有对象未完成任务
				if(list === "all"){
					each(arr,function(item){
						if(!item.isDone){
							addInventory(item);
						}
					});
				}
				//遍历指定id对象所有未完成任务
				else{
					each(arr,function(item){
						if(!item.isDone&&item.cateList[1] === list){
							addInventory(item);
						}
					});
				}
			}
			break;
	}
	//更新任务清单项
	init.todoDetail = $("dd");
	//更新清单任务项点击监听事件
	delegateClickEvent(init.todoDetail,showTaskDetail);
}

//点击更新内容视图事件
function showTaskDetail(e){
	e = e||window.event;
	var target = e.target|| e.srcElement;
	var taskId = target.getAttribute("data-task-id");
	each(data.tasks,function(item){
		if(item.id == taskId){
			addContent(item);
		}
	});
}

//任务清单菜单筛选项点击更新视图内容事件
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
			listInventory(data.tasks,listId,"all");
			break;
		case "todo-doing":
			listInventory(data.tasks,listId,false);
			break;
		case "todo-done":
			listInventory(data.tasks,listId,true);
			break;
	}
});


/*--------------内容视图---------------*/

//更新任务详细内容
function addContent(obj){
	if(obj){
		init.todoDefault[1].innerHTML = formatTime(obj);
		init.todoDefault[0].setAttribute("data-task-id",obj.id);
		init.todoDefault[0].innerHTML = obj.title;
		init.todoDefault[2].innerHTML = obj.content;
	}
}

//任务完成点击事件监听
addClickEvent(init.todoCheckIcon,function(){
	var taskId = init.todoDefault[0].getAttribute("data-task-id");
	//根据标题中的【data-task-id】属性确定对应任务对象
	for(var i=0;i<data.tasks.length;i++){
		if(data.tasks[i].id == taskId){
			//检查任务是否完成
			if(data.tasks[i].isDone){
				alert("该任务已经完成啦！o(≧v≦)o~~");
			}else{
				if(confirm("任务完成后不能修改啦~")){
					//确认任务完成
					data.tasks[i].isDone = true;
					//刷新任务清单视图
					listInventory(data.tasks,data.tasks[i].cateList[1],"all");
					//刷新未完成任务总数
					init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";
					//刷新分类视图
					listCates(data.cates);
					//刷新列表视图
					listLists(data.lists);
					//初始化清单筛选项
					delegateInitClass(init.todoAllBtn,"todo-inventory-selected");
				}
			}
		}
	}
});

//任务编辑点击事件监听
addClickEvent(init.todoEditIcon,function(){
	var taskId = init.todoDefault[0].getAttribute("data-task-id");
	//判断对象
	if(isTaskDefault(taskId)){
		//获取对象
		var itemTask = isTaskDefault(taskId);
		if(itemTask.isDone){
			alert("该任务已完成，不能编辑喽(～￣▽￣)～");
		}else{
			////编辑任务
			if(confirm("确认编辑"+itemTask.title+"任务吗？")){
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
		init.todoCheckEle.onclick = function(){
			//检查任务内容
			if(checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2])){
				if(confirm("任务编辑完成，确认提交吗？")){
					//修改任务
					var editTask = checkTask(init.todoEdit[0],init.todoEdit[1],init.todoEdit[2]);
					itemTask.title = editTask[0];
					itemTask.time = editTask[1];
					itemTask.content = editTask[2];
					//更新清单视图
					listInventory(data.tasks,itemTask.cateList[1],"all");
					//更新未完成任务总数
					init.todoTotal.innerHTML = "("+todoCount("data.tasks","all")+")";
					//刷新分类视图
					listCates(data.cates);
					//刷新列表视图
					listLists(data.lists);
					//更新内容视图
					editIcon("check");
					delegateEleEvent(init.todoDefault,function(ele){
						ele.style.display = "inline";
						init.todoDefault[init.todoDefault.length-1].style.display = "block";
						addContent(itemTask);
					});
					delegateEleEvent(init.todoEdit,function(ele){
						ele.style.display = "none";
					});
				}
			}
		};
	}
});

//判断是否为默认任务
function isTaskDefault(i){
	var taskItem = "";
	if(i==0){
		alert("我是【使用说明】(～￣▽￣)～，不要调戏我~");
		return false;
	}else{
		//根据id查找该任务对象
		each(data.tasks,function(item){
			if(item.id == i){
				taskItem = item;
			}
		});
		return taskItem;
	}
}

//回退图标点击事件监听
addClickEvent(init.todoUndoEle,reback);
//取消编辑事件
function reback(){
	if(confirm("取消任务编辑吗？")){
		var taskId = init.todoDefault[0].getAttribute("data-task-id");
		//更新内容视图
		editIcon("check");
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "inline";
			init.todoDefault[init.todoDefault.length-1].style.display = "block";
			//更新任务内容
			each(data.tasks,function(item){
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

/*--------------一些方法---------------*/

//格式化输出对象中的时间
function formatTime(obj) {
	var taskTime = new Date(obj.time);
	if (taskTime) {
		var year = taskTime.getFullYear();
		var month = taskTime.getMonth() + 1;
		var date = taskTime.getDate();
		if (month < 10) {
			month = "0" + month;
		}
		if (date < 10) {
			date = "0" + date;
		}

		return [year, month, date].join("-");
	}
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

//时间排序
function compare(properyName){
	return function(obj1,obj2) {
		var val1 = obj1[properyName];
		var val2 = obj2[properyName];
		if (val1 < val2) {
			return -1;
		} else if (val1 > val2) {
			return 1;
		} else {
			return 0;
		}
	}
}


//检查编辑任务内容
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
	//返回检查正确的内容<标题、时间、内容>
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

//编辑任务图标切换
function editIcon(status){
	switch (status){
		case "edit":
			init.todoEditIcon.style.display = "none";
			init.todoCheckIcon.style.display = "none";
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
//初始化下拉框选项
function initSelect(){
	init.addCateSelect.innerHTML = "";
	var defaultOption = document.createElement("option");
	defaultOption.setAttribute("value","null");
	defaultOption.innerHTML = "新增主分类";
	init.addCateSelect.appendChild(defaultOption);
}