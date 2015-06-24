/**
 * @file todo.js
 * @author zchen9(zhao.zchen9@gmail.com)
 */

define(["util", "data"], function(_, data) {

    //初始化节点
    var init = {
        //所有任务总数区域<span>
        todoTotal: _.$("#todo-total-count"),
        //主分类列表<ul>
        todoCateList: _.$(".todo-category-list")[0],
        //任务清单筛选菜单项<li>
        todoInventory: _.$(".todo-inventory-category")[0].children,
        //任务清单列表<dl>
        taskInventory: _.$(".todo-inventory-detail")[0],
        //任务内容编辑图标<i>
        todoEditIcon: _.$(".fa-pencil-square-o")[0],
        //任务内容完成图标<i>
        todoCheckIcon: _.$(".fa-check-square-o")[0],
        //任务编辑状态回撤图标<i>
        todoUndoEle: _.$(".fa-undo")[0],
        //任务编辑状态确认图标<i>
        todoCheckEle: _.$(".fa-check")[0],
        //各分类下的子列表<ul>
        todoTaskList: _.$(".todo-task-list"),
        //新增分类弹窗
        addCatePanel: _.$(".add-cate-panel")[0],
        //新增主分类下拉框<select>
        addCateSelect: _.$("#add-cate-main"),
        //任务清单视图单项任务<dd>
        todoDetail: (function() {
            var todoDetails = _.$("dd");
            var todoDetailItem = [];
            _.each(todoDetails, function(item) {
                todoDetailItem.push(item);
            });
            return todoDetailItem;
        })(),
        //返回所有删除图标项
        removeIcon: (function() {
            var removeListIcon = _.$(".fa-trash-o");
            var removeItem = [];
            _.each(removeListIcon, function(item) {
                removeItem.push(item);
            });
            return removeItem;
        })(),
        //任务分类视图下所有列表项<li>
        todoTaskItem: (function() {
            var todoTaskList = _.$(".todo-task-list");
            var listLen = todoTaskList.length;
            var todoItem = [];
            for (var j = 0; j < listLen; j++) {
                var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
                _.each(todoTaskItem, function(item) {
                    todoItem.push(item);
                });
            }
            return todoItem;
        })(),
        //任务内容视图，返回文本显示的内容 <任务标题、时间、内容>
        todoDefault: (function() {
            var taskTitle = _.$("#todo-default-title");
            var taskTime = _.$("#todo-default-time");
            var taskContent = _.$("#todo-default-content");

            return [taskTitle, taskTime, taskContent];
        })(),
        //任务内容视图，返回编辑显示的内容 <任务标题、时间、内容>
        todoEdit: (function() {
            var taskTitle = _.$("#todo-task-title");
            var taskTime = _.$("#todo-task-time");
            var taskContent = _.$("#todo-task-content");
            taskTitle.style.display = "none";
            taskTime.style.display = "none";
            taskContent.style.display = "none";
            return [taskTitle, taskTime, taskContent];
        })(),
    };

    //鼠标点击时更换样式
    var classToggle = function(e) {
        _.stopBubble(e);
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
                        _.removeClass(init.todoTaskItem[j], classname);
                    }
                    break;
            }
            _.delegateInitClass(target, classname);
        }
    };

    // 第一项默认选中渲染
    var renderFirstItem = function() {
        //初始化默认选中任务列表
        var listFirst = _.$(".todo-task-list")[0].getElementsByTagName("li")[0];
        if (listFirst) {
            _.addClass(listFirst, "todo-task-selected");
        }
        //初始化默认选中任务项
        var titleFirst = _.$("dd")[0];
        if (titleFirst) {
            _.addClass(titleFirst, "todo-detail-selected");
        }

        _.delegateInitClass(init.todoInventory[0], "todo-inventory-selected");
    };

    //任务总数渲染
    var renderCount = function() {
        //更新未完成任务总数
        init.todoTotal.innerHTML = "(" + todoCount("data.tasks", "all") + ")";
    };

    //分类视图渲染
    var initCate = function() {
        init.todoCateList.innerHTML = "";
    };

    //添加分类视图
    var addCate = function(obj) {
        if (obj.category) {
            //检查是否已存在对象的分类项
            var liCate = _.$("[data-cate-id=" + obj.category + "]");
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
                    _.addClass(removeSpan, "remove-cate");

                    var  removeItem = document.createElement("i");
                    _.addClass(removeItem, "fa fa-trash-o");

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

    var initList = function() {
        //初始化各子列表内容
        _.each(init.todoTaskList, function(item){
            item.innerHTML = "";
        });
    };

    var addList = function(obj) {
        //检查是否已存在对象的分类项
        var liCate = _.$("[data-cate-id=" + obj.category + "]");
        var doc = document;

        if (obj.taskList) {
            //检查分类项中是否存在子列表项
            if (!(liCate.getElementsByTagName("ul")[0])) {
                var ulTask = doc.createElement("ul");
                _.addClass(ulTask, "todo-task-list");
                liCate.appendChild(ulTask);
            }
            if (liCate.getElementsByTagName("ul")[0]) {
                ulTask = liCate.getElementsByTagName("ul")[0];
                if (ulTask.hasAttribute("class", "todo-task-list")) {
                    //设置列表项【data-list-id】 内容为列表名称
                    var liList = _.$("[data-list-id=" + obj.taskList + "]");
                    if (!liList || liList.nodeName.toUpperCase() !== "LI") {
                        var liTaskList = doc.createElement("li");
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
                            _.addClass(removeSpan,"remove-list");

                            var removeItem = document.createElement("i");
                            _.addClass(removeItem,"fa fa-trash-o");

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
    };

    var initInventory = function() {
        //初始化任务清单视图内容
        init.taskInventory.innerHTML = "";
    };

    //清单视图渲染
    var addInventory = function(obj) {
        if (obj.cateList) {
            //添加时间
            if (obj.time) {
                var dtTimeStr = new Date(obj.time) - 0;
                var dtTime = _.$("[data-list-time=" + dtTimeStr + "]");
                if (dtTime) {
                    addTitle(obj);
                }
                if (!dtTime) {
                    var dtTaskTime = document.createElement("dt");
                    dtTaskTime.setAttribute("data-list-time", dtTimeStr);
                    dtTaskTime.innerHTML = "<time>" + _.formatTime(obj) + "</time>";
                    init.taskInventory.appendChild(dtTaskTime);
                    addTitle(obj);
                }
            }
        }
    };

    //添加任务标题
    var addTitle = function(obj) {
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

    //内容视图渲染
    var addContent = function(obj) {
        if (obj) {
            init.todoDefault[1].innerHTML = _.formatTime(obj);
            init.todoDefault[0].setAttribute("data-task-id", obj.id);
            init.todoDefault[0].innerHTML = obj.title;
            init.todoDefault[2].innerHTML = obj.content;
        }
    };



    //渲染新增分类弹窗
    var initSelect = function() {
        init.addCateSelect.innerHTML = "";
        var defaultOption = document.createElement("option");
        defaultOption.setAttribute("value", "null");
        defaultOption.innerHTML = "新增主分类";
        init.addCateSelect.appendChild(defaultOption);
    };

    var addCatePanel = function(display) {
        if (init.addCatePanel) {
            var cWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var cHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var oWidth = init.addCatePanel.offsetWidth;
            var oHeight = init.addCatePanel.offsetHeight;
            init.addCatePanel.style.position = "absolute";
            if (cWidth > 768) {
                init.addCatePanel.style.left = Math.round((cWidth - oWidth) / 3.2) + "px"; 
            }
            else if (cWidth > 640 && cWidth <= 768) {
                init.addCatePanel.style.left = Math.round(cWidth / 4.5) + "px";
            }
            else if (cWidth > 400 && cWidth <= 640) {
                init.addCatePanel.style.left = Math.round(cWidth / 7.5) + "px";
            }
            else if (cWidth > 350 && cWidth <= 400) {
                init.addCatePanel.style.left = 20 + "px";
            }
            else {
                init.addCatePanel.style.left = 0 + "px";
            }
            init.addCatePanel.style.top = Math.round((cHeight - oHeight) / 3.2) + "px";
            init.addCatePanel.style.display = display;
        }
    };

    var addCateOption = function(cate) {
        var cateOption = document.createElement("option");
        cateOption.setAttribute("value", cate);
        cateOption.innerHTML = cate;
        init.addCateSelect.appendChild(cateOption);
    };

    var renderEditChange = function(status) {
        switch (status) {
            case "edit":
                //切换图标
                init.todoEditIcon.style.display = "none";
                init.todoCheckIcon.style.display = "none";
                init.todoUndoEle.style.display = "block";
                init.todoCheckEle.style.display = "block";
                //切换界面
                _.delegateEleEvent(init.todoDefault, function(ele) {
                    ele.style.display = "none";
                });
                _.delegateEleEvent(init.todoEdit, function(ele) {
                    ele.style.display = "inline-block";
                    for (var i = 0, len = init.todoEdit.length; i < len; i++) {
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
                _.delegateEleEvent(init.todoDefault, function(ele) {
                    ele.style.display = "inline";
                    init.todoDefault[init.todoDefault.length - 1].style.display = "block";
                });
                _.delegateEleEvent(init.todoEdit, function(ele) {
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
                _.delegateEleEvent(init.todoDefault, function(ele) {
                    ele.style.display = "none";
                });
                _.delegateEleEvent(init.todoEdit, function(ele) {
                    ele.style.display = "inline-block";
                    ele.value = "";
                });
                break;
        }
    };

    /**
     * 计算未完成任务
     * @param {string} arr 传递数据的数组名
     * @param {string} type 传递数据的类型值
     * @return {number} count 返回指定类型数组内未完成任务数
     */
    var todoCount = function(arr, type) {
        var count = 0;
        //判断数组类型
        switch (arr) {
            //所有任务数
            case "data.tasks":
                _.each(data.tasks, function(item) {
                    if (!item.isDone) {
                        count++;
                    }
                });
                return count;
                break;
            //列表下任务数
            case "data.lists":
                _.each(data.tasks, function(item) {
                    if (!item.isDone && item.cateList.taskList === type) {
                        count++;
                    }
                });
                return count;
                break;
            //分类下任务数
            case "data.cates":
                _.each(data.tasks, function(item) {
                    if (!item.isDone && item.cateList.category === type) {
                        count++;
                    }
                });
                return count;
                break;
        }
    };


    /**
     * 添加删除图标点击事件
     */
    var removeClick = function(e) {
        _.stopBubble(e);
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.parentNode.nodeName === "SPAN") {
            var removeSpanClass = target.parentNode.getAttribute("class");
            switch (removeSpanClass) {
                //判断删除类型
                case "remove-list":
                    removeList(target.parentNode);
                    break;
                case "remove-cate":
                    removeCate(target.parentNode);
                    break;
            }
        }
    };

    /**
     * 删除主分类
     *
     * @param {DOM} item 传递包含分类属性的节点
     */
    var removeCate = function(item) {
        if (item.parentNode.parentNode.nodeName === "LI") {
            var liCate = item.parentNode.parentNode.getAttribute("data-cate-id");
            if (confirm("是否删除主分类【" 
                        + liCate 
                        + "】和所有子列表任务？删除后不可恢复╮(╯▽╰)╭")
                ) {
                //删除分类对象
                var removeItem = [];
                _.each(data.cates, function(item) {
                    if (item.category === liCate) {
                        removeItem.push(item);
                    }
                });
                _.each(removeItem, function(item) {
                    data.cates.remove(item);
                });
                //删除分类下相关列表
                removeItem.length = 0;
                _.each(data.lists, function(item, i) {
                    if (item.category === liCate) {
                        removeItem.push(item);
                    }
                });
                _.each(removeItem, function(item) {
                    data.lists.remove(item);
                });
                //删除分类和列表相关任务
                removeItem.length = 0;
                _.each(data.tasks, function(item, i) {
                    if (item.cateList.category === liCate) {
                        removeItem.push(item);
                    }
                });
                _.each(removeItem, function(item) {
                    data.tasks.remove(item);
                });

                //刷新本地数据
                data.updateData(data.cates, data.lists, data.tasks);
                //刷新分类视图
                refreshCate(data.cates, data.lists);
            }
        }
    };

    /**
     * 删除子列表
     *
     * @param {DOM} item 传递包含列表属性的节点
     */
    var removeList = function(item) {
        if (item.parentNode.nodeName === "LI" 
            && _.hasClass(item.parentNode, "todo-task-selected")
            ) {
            var liList = item.parentNode.getAttribute("data-list-id");
            if (confirm("是否删除列表【"
                        + liList
                        + "】和所有子任务？删除后不可恢复╮(╯▽╰)╭")
                ) {
                //删除列表对象
                var removeItem = [];
                _.each(data.lists, function(item, i) {
                    if (item.taskList === liList) {
                        removeItem.push(item);
                    }
                });
                _.each(removeItem, function(item) {
                    data.lists.remove(item);
                });
                //删除列表相关任务
                removeItem.length = 0;
                _.each(data.tasks, function(item, i) {
                    if (item.cateList.taskList === liList) {
                        removeItem.push(item);
                    }
                });
                _.each(removeItem, function(item) {
                    data.tasks.remove(item);
                });

                //刷新本地数据
                data.updateData(data.cates, data.lists, data.tasks);
                //刷新分类视图
                refreshCate(data.cates, data.lists);
            }
        }
        else {
            alert("选中列表后才能删除~");
        }
    };

    /**
     * 刷新分类视图
     *
     * @param {Array} arr 传递分类对象数组
     */
    var refreshCate = function(cates, lists){
        //初始化分类视图
        initCate();
        //初始化各子列表内容
        initList();
        //初始化下拉菜单项
        initSelect();

        //添加更新后的对象数组
        _.each(cates, function(item) {
            //更新分类项
            addCate(item);
            //更新新增分类弹窗下拉框的分类选项
            addCateOption(item.category);
        });
        //添加更新后的列表数组项
        _.each(lists, function(item) {
            //更新列表项
            addList(item);
        });

        //更新任务清单视图
        refreshInventory(data.tasks, "all", "all");

        //遍历删除图标点击事件监听
        _.delegateClickEvent(init.removeIcon, removeClick);
        //更换样式
        _.delegateClickEvent(init.todoTaskItem, classToggle);
        //更新清单任务视图
        _.delegateClickEvent(init.todoTaskItem, taskItemClick);

        //刷新未完成任务总数
        renderCount();
        //更新内容视图，默认任务内容
        addContent(data.tasks[0]);
    };


    /**
     * 检查输入内容插入新分类或新列表
     *
     * @param {String} main 主分类名称
     * @param {String} name 子列表名称
     */
    var addCateList = function(main, name) {
        //判断输入名称长度
        if (_.getByteVal(name, 20)) {
            var cateName = _.checkXSS(_.getByteVal(name, 20));
            //判断主分类
            if (main === "null") {
                if (confirm("确认创建新分类【" + cateName + "】吗？")) {
                    //新增分类对象
                    data.cates.push(new data.Category({category: cateName}));
                }
            }
            else {
                if (confirm("确认在【" + main + "】分类下创建新列表【" + cateName + "】吗？")) {
                    //新增列表对象
                    data.lists.push(new data.TaskList({category: main, taskList: cateName}));
                }
            }
            //刷新本地数据
            data.updateData(data.cates, data.lists, data.tasks);
            //刷新分类视图
            refreshCate(data.cates, data.lists);
        }
    };

    /**
     * 列表项点击刷新任务清单视图事件
     */
    var taskItemClick = function(e) {
        _.stopBubble(e);
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toUpperCase() === "LI") {
            var listId = target.getAttribute("data-list-id");
            refreshInventory(data.tasks, listId, "all");

            //移动端切换页面
            if (_.silder.init()) {
                _.silder.goIndex('1');
            }
        }
    };

    /**
     * 刷新任务清单视图事件
     *  
     * @param {Array} arr 传入任务对象数组
     * @param {String} list 传入列表名称
     * @param {String} isDone 传入任务是否完成布尔值
     */
    var refreshInventory = function(arr, list, isDone) {
        initInventory();
        //将任务内容按时间排序
        arr.sort(_.compare("time"));
        //检查筛选项
        switch (typeof isDone) {
            //默认所有
            case "string":
                //遍历所有对象的任务
                if (list === "all") {
                    _.each(arr, function(item) {
                        addInventory(item);
                    });
                }
                //遍历指定id对象的任务
                else{
                    _.each(arr, function(item) {
                        if (item.cateList.taskList === list) {
                            addInventory(item);
                        }
                    })
                }
                break;
            case "boolean":
                //已完成
                if (isDone) {
                    //遍历所有对象已完成任务
                    if (list === "all") {
                        _.each(arr, function(item) {
                            if (item.isDone) {
                                addInventory(item);
                            }
                        });
                    }
                    //遍历指定id对象所有已完成任务
                    else {
                        _.each(arr, function(item) {
                            if (item.isDone && item.cateList.taskList === list) {
                                addInventory(item);
                            }
                        });
                    }
                }
                //未完成
                else {
                    //遍历所有对象未完成任务
                    if (list === "all") {
                        _.each(arr, function(item) {
                            if (!item.isDone) {
                                addInventory(item);
                            }
                        });
                    }
                    //遍历指定id对象所有未完成任务
                    else {
                        _.each(arr, function(item) {
                            if (!item.isDone && item.cateList.taskList === list) {
                                addInventory(item);
                            }
                        });
                    }
                }
                break;
        }

        //更新清单任务项点击监听事件
        _.delegateClickEvent(init.todoDetail, showTaskDetail);
    };

    /**
     * 点击更新内容视图事件
     *  
     */
    var showTaskDetail = function(e) {
        _.stopBubble(e);
        e = e || window.event;
        var target = e.target || e.srcElement;
        var taskId = target.getAttribute("data-task-id");
        _.each(data.tasks, function(item) {
            if (item.id == taskId) {
                addContent(item);
                //移动端切换页面
                if (_.silder.init()) {
                    _.silder.goIndex('2');
                }
            }
        });
    };

    /**
     * 取消编辑事件
     */
    var reback = function() {
        if (confirm("取消任务编辑吗？")) {
            var taskId = init.todoDefault[0].getAttribute("data-task-id");
            //更新内容视图
            renderEditChange("check");
            //更新任务内容
            _.each(data.tasks, function(item) {
                if (item.id == taskId) {
                    addContent(item);
                }
            });
        }
    };

    var silderGo = function(e) {
        e = e || window.event;
        var tar = e.target || e.srcElement;
        var tarId = "";

        tar.nodeName.toUpperCase() === "LI" && (tarId = tar.id);
        tar.parentNode.nodeName.toUpperCase() === "LI" && (tarId = tar.parentNode.id);
        
        switch (tarId) {
            case "todo-nav-cates":
                //第一页
                if (_.silder.init()) {
                    _.silder.goIndex('0');
                }
                break;
            case "todo-nav-inves":
                //第二页
                if (_.silder.init()) {
                    _.silder.goIndex('1');
                }
                break;
            case "todo-nav-tasks":
                //第三页
                if (_.silder.init()) {
                    _.silder.goIndex('2');
                }
                break;
        }
    };

    /**
     * 判断是否为默认任务
     *  
     * @param {number} i 传入任务对象id
     */
    var isTaskDefault = function(i) {
        var taskItem = "";
        if (i == 0) {
            alert("我是【使用说明】(～￣▽￣)～，不要调戏我~");
            return false;
        }
        else {
            //根据id查找该任务对象
            _.each(data.tasks, function(item) {
                if (item.id == i) {
                    taskItem = item;
                }
            });
            return taskItem;
        }
    };

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
        todoCount: todoCount,

        initCate: initCate,
        initList: initList,
        initInventory : initInventory,
        initSelect: initSelect,

        removeCate: removeCate,
        removeList: removeList,
        removeClick: removeClick,
        isTaskDefault: isTaskDefault,
        reback: reback,
        refreshInventory: refreshInventory,
        refreshCate: refreshCate,
        taskItemClick: taskItemClick,
        showTaskDetail: showTaskDetail,
        addCateList: addCateList,
        silderGo: silderGo
    }

 });
