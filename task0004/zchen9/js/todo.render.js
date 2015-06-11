/**
 * @file todo.render.js
 * @author zchen9(zhao.zchen9@gmail.com)
 */

var render = (function () {

	//初始化节点
	var init = {
		//所有任务总数区域<span>
    	todoTotal: $("#todo-total-count"),
		//主分类列表<ul>
    	todoCateList: $(".todo-category-list")[0],
    	//任务清单筛选菜单项<li>
    	todoInventory: $(".todo-inventory-category")[0].children,
    	//任务清单列表<dl>
    	taskInventory: $(".todo-inventory-detail")[0],
   		//任务内容编辑图标<i>
	    todoEditIcon: $(".fa-pencil-square-o")[0],
	    //任务内容完成图标<i>
	    todoCheckIcon: $(".fa-check-square-o")[0],
	    //任务编辑状态回撤图标<i>
	    todoUndoEle: $(".fa-undo")[0],
	    //任务编辑状态确认图标<i>
	    todoCheckEle: $(".fa-check")[0],
	     //各分类下的子列表<ul>
    	todoTaskList: $(".todo-task-list"),
    	//新增分类弹窗
    	addCatePanel: $(".add-cate-panel")[0],
    	//新增主分类下拉框<select>
    	addCateSelect: $("#add-cate-main"),
	    //任务清单视图单项任务<dd>
   		todoDetail: (function(){
   			var todoDetails = $("dd");
   			var todoDetailItem = [];
   			each(todoDetails, function(item){
   				todoDetailItem.push(item);
   			});
   			return todoDetailItem;
   		})(),
		//返回所有删除图标项
	    removeIcon: (function(){
	        var removeListIcon = $(".fa-trash-o");
	        var removeItem =[];
	        each(removeListIcon,function(item){
	            removeItem.push(item);
	        });
	        return removeItem;
	    })(),
	    //任务分类视图下所有列表项<li>
	    todoTaskItem: (function(){
	        var todoTaskList = $(".todo-task-list");
	        var todoItem = [];
	        for (var j = 0,len = todoTaskList.length; j < len; j++) {
	            var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
	            each(todoTaskItem,function(item){
	                todoItem.push(item);
	            });
	        }
	        return todoItem;
	    })(),
	    //任务内容视图，返回文本显示的内容 <任务标题、时间、内容>
	    todoDefault: (function(){
	        var taskTitle = $("#todo-default-title");
	        var taskTime = $("#todo-default-time");
	        var taskContent = $("#todo-default-content");

	        return [taskTitle, taskTime, taskContent];
	    })(),
	    //任务内容视图，返回编辑显示的内容 <任务标题、时间、内容>
	    todoEdit: (function(){
	        var taskTitle = $("#todo-task-title");
	        var taskTime = $("#todo-task-time");
	        var taskContent = $("#todo-task-content");
	        taskTitle.style.display = "none";
	        taskTime.style.display = "none";
	        taskContent.style.display = "none";
	        return [taskTitle, taskTime, taskContent];
	    })(),
	}

	//鼠标点击时更换样式
	classToggle = function(e){
	    stopBubble(e);
	    e = e || window.event;
	    var target = e.target || e.srcElement;
	    var classname = "";
	    if (target.parentNode) {
	        switch (target.parentNode.className) {
	            //任务清单视图任务项
	            case "todo-inventory-detail":
	                classname = "todo-detail-selected";
	                break;
	            //任务清单视图筛选菜单项
	            case "todo-inventory-category":
	                classname = "todo-inventory-selected";
	                break;
	            //任务列表视图列表项
	            case "todo-task-list":
	                classname = "todo-task-selected";
	                for (var j = 0, len = init.todoTaskItem.length; j < len; j++) {
	                    removeClass(init.todoTaskItem[j], classname);
	                }
	                break;
	        }
	        delegateInitClass(target, classname);
	    }
	}

	// 第一项默认选中渲染
	renderFirstItem = function(){
		//初始化默认选中任务列表
	    var listFirst = $(".todo-task-list")[0].getElementsByTagName("li")[0];
	    if (listFirst) {
	        addClass(listFirst, "todo-task-selected");
	    }
	    //初始化默认选中任务项
	    var titleFirst = $("dd")[0];
	    if (titleFirst) {
	        addClass(titleFirst, "todo-detail-selected");
	    }

	    delegateInitClass(init.todoInventory[0],"todo-inventory-selected");
	}

	//任务总数渲染
	renderCount = function(){
		//更新未完成任务总数
        init.todoTotal.innerHTML = "(" + todoCount("data.tasks","all") + ")";
	}

	//分类视图渲染
	initCate = function(){
		init.todoCateList.innerHTML = "";
	}

	//添加分类视图
	addCate = function(obj){
	    if (obj.category) {
	        //检查是否已存在对象的分类项
	        var liCate = $("[data-cate-id=" + obj.category + "]");
	        if (!liCate) {
	            //增加新分类项
	            liCate = document.createElement("li");
	            //设置主分类项【data-cate-id】内容为主分类名称
	            liCate.setAttribute("data-cate-id", obj.category);
	            var spanCateDefault = document.createElement("span");
	            //默认分类默认不能删除
	            if (obj.category === "默认分类") {
	                spanCateDefault.innerHTML = '<i class="fa fa-folder-open fa-fw"></i>'
	                                            + obj.category
	                                            + '(' 
	                                            + todoCount("data.cates", obj.category) 
	                                            + ')';
	            }
	            else {
	                spanCateDefault.innerHTML = '<i class="fa fa-folder-open fa-fw"></i>'
	                                            + obj.category
	                                            + '(' 
	                                            + todoCount("data.cates", obj.category)
	                                            + ')';

	                var removeSpan = document.createElement("span");
	                addClass(removeSpan, "remove-cate");
	                var  removeItem = document.createElement("i");
	                addClass(removeItem, "fa fa-trash-o");
	                removeSpan.appendChild(removeItem);
	                spanCateDefault.appendChild(removeSpan);
	                //更新删除图标
	       			init.removeIcon.push(removeItem);

	            }
	            liCate.appendChild(spanCateDefault);
	            //添加分类项
	            init.todoCateList.appendChild(liCate);
	        }
	    }
	};

	initList = function(){
		//初始化各子列表内容
	    each(init.todoTaskList, function(item){
	        item.innerHTML = "";
	    });
	}

	addList = function(obj){
	    //检查是否已存在对象的分类项
	    var liCate = $("[data-cate-id=" + obj.category + "]");
	    if (obj.taskList) {
	        //检查分类项中是否存在子列表项
	        if (!(liCate.getElementsByTagName("ul")[0])) {
	            var ulTask = document.createElement("ul");
	            addClass(ulTask, "todo-task-list");
	            liCate.appendChild(ulTask);
	        }
	        if (liCate.getElementsByTagName("ul")[0]) {
	            ulTask = liCate.getElementsByTagName("ul")[0];
	            if (ulTask.hasAttribute("class", "todo-task-list")) {
	                //设置列表项【data-list-id】 内容为列表名称
	                var liList = $("[data-list-id=" + obj.taskList + "]");
	                if (!liList || liList.nodeName !== "LI") {
	                    var liTaskList = document.createElement("li");
	                    liTaskList.setAttribute("data-list-id", obj.taskList);
	                    //默认任务<使用说明>不能删除
	                    if (obj.taskList === "使用说明") {
	                        liTaskList.innerHTML = '<i class="fa fa-file-o fa-fw"></i>'
	                                               + obj.taskList
	                                               + '('
	                                               + todoCount("data.lists", obj.taskList)
	                                               + ')';
	                    }
	                    else{
	                        liTaskList.innerHTML = '<i class="fa fa-file-o fa-fw"></i>'
	                                               + obj.taskList
	                                               + '('
	                                               + todoCount("data.lists", obj.taskList)
	                                               + ')';

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
	    }
	}

	initInventory = function(){
		//初始化任务清单视图内容
    	init.taskInventory.innerHTML = "";
	}

	//清单视图渲染
	addInventory = function(obj){
	    if (obj.cateList) {
	        //添加时间
	        if (obj.time) {
	            var dtTimeStr = new Date(obj.time) - 0;
	            var dtTime = $("[data-list-time=" + dtTimeStr + "]");
	            if (dtTime) {
	                addTitle(obj);
	            }
	            if (!dtTime) {
	                var dtTaskTime = document.createElement("dt");
	                dtTaskTime.setAttribute("data-list-time", dtTimeStr);
	                dtTaskTime.innerHTML = "<time>" + formatTime(obj) + "</time>";
	                init.taskInventory.appendChild(dtTaskTime);
	                addTitle(obj);
	            }
	        }
	        //添加任务标题
	        function addTitle(obj){
	            if (obj.title) {
	                var ddTaskTitle = document.createElement("dd");
	                if (obj.isDone) {
	                    ddTaskTitle.setAttribute("data-task-done", "1");
	                    ddTaskTitle.innerHTML = obj.title + '<i class="fa fa-smile-o"></i>';
	                }
	                else {
	                    ddTaskTitle.setAttribute("data-task-done", "0");
	                    ddTaskTitle.innerHTML = obj.title;
	                }
	                ddTaskTitle.setAttribute("data-list-id", obj.cateList.taskList);
	                ddTaskTitle.setAttribute("data-task-id", obj.id);
	                init.taskInventory.appendChild(ddTaskTitle);
	                //更新清单项
	                init.todoDetail.push(ddTaskTitle);
	            }
	        }
	    }
	}

	//内容视图渲染
	addContent = function(obj){
	    if(obj){
	        init.todoDefault[1].innerHTML = formatTime(obj);
	        init.todoDefault[0].setAttribute("data-task-id",obj.id);
	        init.todoDefault[0].innerHTML = obj.title;
	        init.todoDefault[2].innerHTML = obj.content;
	    }
	}



	//渲染新增分类弹窗
	initSelect = function(){
	    init.addCateSelect.innerHTML = "";
	    var defaultOption = document.createElement("option");
	    defaultOption.setAttribute("value","null");
	    defaultOption.innerHTML = "新增主分类";
	    init.addCateSelect.appendChild(defaultOption);
	}

	addCatePanel = function(display){
	    if (init.addCatePanel) {
	        var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
	        var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
	        var oWidth = init.addCatePanel.offsetWidth;
	        var oHeight = init.addCatePanel.offsetHeight;
	        init.addCatePanel.style.position = "absolute";
	        if(cWidth > 768){
	            init.addCatePanel.style.left = Math.round((cWidth - oWidth) / 3.2) + "px"; 
	        }
	        else if (cWidth > 640 && cWidth <= 768){
	            init.addCatePanel.style.left = Math.round(cWidth / 4.5) + "px";
	        }
	        else if(cWidth > 400 && cWidth <= 640){
	            init.addCatePanel.style.left = Math.round(cWidth / 7.5) + "px";
	        }
	        else if(cWidth > 350 && cWidth <=400){
	            init.addCatePanel.style.left = 20 + "px";
	        }else{
	            init.addCatePanel.style.left = 0 + "px";
	        }
	        init.addCatePanel.style.top = Math.round((cHeight - oHeight) / 3.2) + "px";
	        init.addCatePanel.style.display = display;
	    }
	}

	addCateOption = function(cate){
	    var cateOption = document.createElement("option");
	    cateOption.setAttribute("value", cate);
	    cateOption.innerHTML = cate;
	    init.addCateSelect.appendChild(cateOption);
	}

	renderEditChange = function(status){
		switch (status) {
	        case "edit":
	        	//切换图标
	        	init.todoEditIcon.style.display = "none";
	            init.todoCheckIcon.style.display = "none";
	            init.todoUndoEle.style.display = "block";
	            init.todoCheckEle.style.display = "block";
	            //切换界面
	            delegateEleEvent(init.todoDefault,function(ele){
                    ele.style.display = "none";
                });
                delegateEleEvent(init.todoEdit,function(ele){
                    ele.style.display = "inline-block";
                    for (var i = 0; i < init.todoEdit.length; i++) {
                        init.todoEdit[i].value = init.todoDefault[i].innerHTML;
                    }
                });
	            break;
	        case "check":
	        	//切换图标
	        	init.todoEditIcon.style.display = "block";
	            init.todoCheckIcon.style.display = "block";
	            init.todoUndoEle.style.display = "none";
	            init.todoCheckEle.style.display = "none";
	            //切换界面
	            delegateEleEvent(init.todoDefault,function(ele){
                    ele.style.display = "inline";
                    init.todoDefault[init.todoDefault.length-1].style.display = "block";
                });
                delegateEleEvent(init.todoEdit,function(ele){
                    ele.style.display = "none";
                });
	            break;
	        case "new":
	        	//切换图标
	        	init.todoEditIcon.style.display = "none";
	            init.todoCheckIcon.style.display = "none";
	            init.todoUndoEle.style.display = "block";
	            init.todoCheckEle.style.display = "block";
	            //切换界面
	        	delegateEleEvent(init.todoDefault, function(ele){
                    ele.style.display = "none";
                });
                delegateEleEvent(init.todoEdit, function(ele){
                    ele.style.display = "inline-block";
                    ele.value = "";
                });
                break;
	    }
	}

	return {

		//节点

		todoCateList: init.todoCateList,
		removeIcon: init.removeIcon,
		todoTaskItem: init.todoTaskItem,

		todoInventory: init.todoInventory,
		taskInventory: init.taskInventory,

		todoEditIcon: init.todoEditIcon,
		todoCheckIcon: init.todoCheckIcon,
		todoUndoEle: init.todoUndoEle,
		todoCheckEle: init.todoCheckEle,

		todoDefault: init.todoDefault,
		todoDetail: init.todoDetail,

		todoEdit: init.todoEdit,

		addCateSelect: init.addCateSelect,

		//方法

		classToggle: classToggle,
		
		addCate: addCate,
		addList: addList,
		addInventory: addInventory,
		addContent: addContent,
		addCatePanel: addCatePanel,
		addCateOption: addCateOption,

		renderEditChange: renderEditChange,
		renderCount: renderCount,
		renderFirstItem: renderFirstItem,

		initCate: initCate,
		initList: initList,
		initInventory : initInventory,
		initSelect: initSelect
	}

})();
