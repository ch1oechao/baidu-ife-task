/**
* @file: ToDo Controller
* @author:zchen9(zhao.zchen9@gmail.com)
*
*/

var control = (function(){

	/* 实例化滑动组件 */
	var slider = new Silder({
                    dom: $("section"),
                    wrap: $(".todo-container")[0]
                });

	/**
	 * 添加删除图标点击事件
	 */
	removeClick = function(e){
	    stopBubble(e);
	    e = e || window.event;
	    var target = e.target || e.srcElement;
	    if (target.parentNode.nodeName === "SPAN") {
	        var removeSpanClass = target.parentNode.getAttribute("class");
	        switch (removeSpanClass) {
	            //判断删除类型
	            case "remove-list":
	                control.removeList(target.parentNode);
	                break;
	            case "remove-cate":
	                control.removeCate(target.parentNode);
	                break;
	        }
	    }
	}

	/**
	 * 删除主分类
	 *
	 * @param {DOM} item 传递包含分类属性的节点
	 */
	removeCate = function(item){
	    if (item.parentNode.parentNode.nodeName === "LI") {
	        var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
	        if (confirm("是否删除主分类【" 
	                    + liCate 
	                    + "】和所有子列表任务？删除后不可恢复╮(╯▽╰)╭")
	            ) {
	            //删除分类对象
	            var removeItem = [];
	            each(data.cates, function(item){
	                if( item.category === liCate) {
	                    removeItem.push(item);
	                }
	            });
	            each(removeItem, function(item){
	                data.cates.remove(item);
	            });
	            //删除分类下相关列表
	            removeItem.length = 0;
	            each(data.lists, function(item, i){
	                if (item.category === liCate) {
	                    removeItem.push(item);
	                }
	            });
	            each(removeItem, function(item){
	                data.lists.remove(item);
	            });
	            //删除分类和列表相关任务
	            removeItem.length = 0;
	            each(data.tasks, function(item, i){
	                if (item.cateList.category === liCate) {
	                    removeItem.push(item);
	                }
	            });
	            each(removeItem, function(item){
	                data.tasks.remove(item);
	            });

	            //刷新本地数据
	            data.updateData(data.cates, data.lists, data.tasks);
	            //刷新分类视图
	            control.refreshCate(data.cates, data.lists);
	        }
	    }
	}

	/**
	 * 删除子列表
	 *
	 * @param {DOM} item 传递包含列表属性的节点
	 */
	removeList = function(item){
	    if (item.parentNode.nodeName === "LI" 
	        && hasClass(item.parentNode, "todo-task-selected")
	        ) {
	        var liList = item.parentNode.getAttribute("data-list-id");
	        if (confirm("是否删除列表【"
	                    + liList
	                    + "】和所有子任务？删除后不可恢复╮(╯▽╰)╭")
	            ) {
	            //删除列表对象
	            var removeItem = [];
	            each(data.lists, function(item,i){
	                if (item.taskList === liList) {
	                    removeItem.push(item);
	                }
	            });
	            each(removeItem, function(item){
	                data.lists.remove(item);
	            });
	            //删除列表相关任务
	            removeItem.length = 0;
	            each(data.tasks, function(item,i){
	                if (item.cateList.taskList === liList) {
	                    removeItem.push(item);
	                }
	            });
	            each(removeItem, function(item){
	                data.tasks.remove(item);
	            });

	            //刷新本地数据
	            data.updateData(data.cates, data.lists, data.tasks);
	            //刷新分类视图
	            control.refreshCate(data.cates, data.lists);
	        }
	    }
	    else {
	        alert("选中列表后才能删除~");
	    }
	}

	/**
	 * 刷新分类视图
	 *
	 * @param {Array} arr 传递分类对象数组
	 */
	refreshCate = function(cates, lists){
	    //初始化分类视图
	    render.initCate();
	    //初始化各子列表内容
	    render.initList();
	    //初始化下拉菜单项
	    render.initSelect();

	    //添加更新后的对象数组
	    each(cates, function(item){
	        //更新分类项
	        render.addCate(item);
	        //更新新增分类弹窗下拉框的分类选项
	        render.addCateOption(item.category);
	    });
	    //添加更新后的列表数组项
	    each(lists, function(item){
	        //更新列表项
	        render.addList(item);
	    });

	    //更新任务清单视图
	    control.refreshInventory(data.tasks, "all", "all");

	    //遍历删除图标点击事件监听
	    delegateClickEvent(render.removeIcon, control.removeClick);
	    //更换样式
	    delegateClickEvent(render.todoTaskItem, render.classToggle);
	    //更新清单任务视图
	    delegateClickEvent(render.todoTaskItem, control.taskItemClick);

	    //刷新未完成任务总数
	    render.renderCount();
	    //更新内容视图，默认任务内容
	    render.addContent(data.tasks[0]);
	}


	/**
	 * 检查输入内容插入新分类或新列表
	 *
	 * @param {String} main 主分类名称
	 * @param {String} name 子列表名称
	 */
	addCateList = function(main, name){
	    //判断输入名称长度
	    if (getByteVal(name, 20)) {
	        var cateName = checkXSS(getByteVal(name, 20));
	        //判断主分类
	        if (main === "null") {
	            if (confirm("确认创建新分类【" + cateName + "】吗？")) {
	                //新增分类对象
	                data.cates.push(new Category({category: cateName}));
	            }
	        }
	        else {
	            if(confirm("确认在【" + main + "】分类下创建新列表【" + cateName + "】吗？")) {
	                //新增列表对象
	                data.lists.push(new TaskList({category: main, taskList: cateName}));
	            }
	        }
	        //刷新本地数据
	        data.updateData(data.cates, data.lists, data.tasks);
	        //刷新分类视图
	        control.refreshCate(data.cates, data.lists);
	    }
	}

	/**
	 * 列表项点击刷新任务清单视图事件
	 */
	taskItemClick = function(e){
	    stopBubble(e);
	    e = e || window.event;
	    var target = e.target || e.srcElement;
	    if (target.nodeName === "LI") {
	        var listId = target.getAttribute("data-list-id");
	        control.refreshInventory(data.tasks, listId, "all");

	        //移动端切换页面
	        if(slider.init()){
	            slider.goIndex('1');
	        }
	    }
	}

	/**
	 * 刷新任务清单视图事件
	 *  
	 * @param {Array} arr 传入任务对象数组
	 * @param {String} list 传入列表名称
	 * @param {String} isDone 传入任务是否完成布尔值
	 */
	refreshInventory = function(arr, list, isDone){
	    render.initInventory();
	    //将任务内容按时间排序
	    arr.sort(compare("time"));
	    //检查筛选项
	    switch (typeof isDone) {
	        //默认所有
	        case "string":
	            //遍历所有对象的任务
	            if (list === "all") {
	                each(arr,function(item){
	                    render.addInventory(item);
	                });
	            }
	            //遍历指定id对象的任务
	            else{
	                each(arr,function(item){
	                    if (item.cateList.taskList === list) {
	                        render.addInventory(item);
	                    }
	                })
	            }
	            break;
	        case "boolean":
	            //已完成
	            if (isDone) {
	                //遍历所有对象已完成任务
	                if (list === "all") {
	                    each(arr,function(item){
	                        if (item.isDone) {
	                            render.addInventory(item);
	                        }
	                    });
	                }
	                //遍历指定id对象所有已完成任务
	                else{
	                    each(arr,function(item){
	                        if (item.isDone && item.cateList.taskList === list) {
	                            render.addInventory(item);
	                        }
	                    });
	                }
	            }
	            //未完成
	            else{
	                //遍历所有对象未完成任务
	                if (list === "all") {
	                    each(arr,function(item){
	                        if (!item.isDone) {
	                            render.addInventory(item);
	                        }
	                    });
	                }
	                //遍历指定id对象所有未完成任务
	                else {
	                    each(arr,function(item){
	                        if (!item.isDone && item.cateList.taskList === list) {
	                            render.addInventory(item);
	                        }
	                    });
	                }
	            }
	            break;
	    }

	    //更新清单任务项点击监听事件
    	delegateClickEvent(render.todoDetail, control.showTaskDetail);
	}

	/**
	 * 点击更新内容视图事件
	 *  
	 */
	showTaskDetail = function(e){
	    stopBubble(e);
	    e = e ||window.event;
	    var target = e.target || e.srcElement;
	    var taskId = target.getAttribute("data-task-id");
	    each(data.tasks,function(item){
	        if (item.id == taskId) {
	            render.addContent(item);
	            //移动端切换页面
	            if(slider.init()){
	                slider.goIndex('2');
	            }
	        }
	    });
	}

	/**
	 * 取消编辑事件
	 */
	reback = function(){
	    if (confirm("取消任务编辑吗？")) {
	        var taskId = render.todoDefault[0].getAttribute("data-task-id");
	        //更新内容视图
	        render.renderEditChange("check");
	        //更新任务内容
	        each(data.tasks,function(item){
	            if (item.id == taskId) {
	                render.addContent(item);
	            }
	        });
	    }
	}

	sliderGo = function(e){
	    e = e || window.event;
	    var tar = e.target || e.srcElement;
	    var tarId = "";

	    tar.nodeName === "LI" && (tarId = tar.id);
	    tar.parentNode.nodeName === "LI" && (tarId = tar.parentNode.id);
	    
	    switch (tarId) {
	        case "todo-nav-cates":
	            //第一页
	            if (slider.init()) {
	                slider.goIndex('0');
	            }
	            break;
	        case "todo-nav-inves":
	            //第二页
	            if (slider.init()) {
	                slider.goIndex('1');
	            }
	            break;
	        case "todo-nav-tasks":
	            //第三页
	            if (slider.init()) {
	                slider.goIndex('2');
	            }
	            break;
	    }
	}

	return {
		slider: slider,
		removeCate: removeCate,
		removeList: removeList,
		removeClick: removeClick,
		reback: reback,
		refreshInventory: refreshInventory,
		refreshCate: refreshCate,
		taskItemClick: taskItemClick,
		showTaskDetail: showTaskDetail,
		addCateList: addCateList,
		sliderGo: sliderGo
	}

})();
