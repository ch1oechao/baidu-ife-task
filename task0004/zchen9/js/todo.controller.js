/**
* @file: ToDo Controller
* @author:zchen9(zhao.zchen9@gmail.com)
*
*/

define(["util", "data", "render"], function(_, data, render){

    /**
     * @namespace init 初始化变量
     */
    var init = {
        
        /* 清单视图 */
        //任务清单视图下的新增任务按钮<a>
        todoAddTask: _.$("#todo-add-task"),

        /* 分类视图 */
        //任务分类视图下新增分类按钮<a>
        todoCateBtn: _.$("#todo-add-category"),
        //任务分类视图显示所有任务块<p>
        todoCateAll: _.$(".todo-category-total")[0],

        /* 新增分类弹窗 */
        //新增分类名称<input>
        addCateName: _.$("#add-cate-name"),
        //新增分类取消按钮<span>
        addCateCancel: _.$("#add-cate-cancel"),
        //新增分类确定按钮<span>
        addCateCheck: _.$("#add-cate-check"),

        /* 移动端菜单按钮 */
        todoNav: [ _.$("#todo-nav-cates"), 
                   _.$("#todo-nav-inves"), 
                   _.$("#todo-nav-tasks")
                 ]
    };

    var start = function(){
        
        /*--------------初始化渲染默认视图--------------*/

        //适配移动端
        if(_.silder.init()){
            _.silder.renderDOM();
        }

        //添加所有已存在分类
        _.each(data.cates, render.addCate);
        //添加所有已存在列表
        _.each(data.lists, render.addList);
        
        //添加默认任务清单和内容
        render.addInventory(data.tasks[0]);
        render.addContent(data.tasks[0]);

        //初始化第一项默认被选中
        render.renderFirstItem();

        //初始化未完成任务总数
        render.renderCount();

        //初始化下拉框添加主分类选项
        _.each(data.cates, function(item){
            render.addCateOption(item.category);
        });


        /*--------------事件监听---------------*/

        //初始化切换样式点击事件
        //任务清单筛选项
        _.delegateClickEvent(render.todoInventory, render.classToggle);
        //更换样式
        _.delegateClickEvent(render.todoTaskItem, render.classToggle);

        //遍历删除图标点击事件监听
        _.delegateClickEvent(render.removeIcon, render.removeClick);
        //更新清单任务视图
        _.delegateClickEvent(render.todoTaskItem, render.taskItemClick);
        //菜单按钮点击事件
        _.each(init.todoNav, function(item){
            _.addClickEvent(item, render.silderGo);
        });

    };

    var listen = function(){
        /**
         * 新增分类点击事件
         */
        _.addClickEvent(init.todoCateBtn, function(){
            //显示新增分类弹窗
            render.addCatePanel("block");
            //新增分类确认按钮监听
            if (init.addCateCheck) {
                _.addClickEvent(init.addCateCheck, function(){
                    var mainCateName = render.addCateSelect.value;
                    var newCateName = init.addCateName.value;
                    //检查下拉框分类和新分类输入值
                    render.addCateList(mainCateName, newCateName);
                    //清空输入框内容
                    init.addCateName.value = "";
                    //关闭弹窗
                    render.addCatePanel("none");
                });
            }
            //新增分类取消按钮监听
            if (init.addCateCancel) {
                _.addClickEvent(init.addCateCancel, function(){
                    init.addCateName.value = "";
                    render.addCatePanel("none");
                });
            }
        });

        /*--------------分类视图-点击事件监听---------------*/

        /**
         * 所有任务块点击监听事件
         */
        _.addClickEvent(init.todoCateAll,function(){
            //移除所有任务项的点击样式
            _.each(render.todoTaskItem, function(item){
                _.removeClass(item, "todo-task-selected");
            });
            // 刷新分类视图
            render.refreshInventory(data.tasks, "all", "all");

            //移动端切换页面
            if (_.silder.init()) {
                _.silder.goIndex('1');
            }
        });

        /*--------------清单视图-新增任务--------------*/

        /**
         * 添加新任务点击事件
         */
        _.addClickEvent(init.todoAddTask, function(){
            //判断是否选中某一项任务列表
            var taskSelected = _.$(".todo-task-selected")[0];
            var cateList = {};
            if (taskSelected && taskSelected.nodeName === "LI") {
                var dataListId = taskSelected.getAttribute("data-list-id");
                //使用说明下默认不建立子任务
                if (dataListId === "使用说明") {
                    alert("【使用说明】不能新建子任务啦~");
                }
                else {
                    _.each(data.lists, function(item){
                        if (item.taskList === dataListId) {
                            if (confirm("将在【" + item.category + "】分类下的【" + dataListId + "】列表新增任务~")) {
                                //初始化编辑界面
                                render.renderEditChange("new");
                            }
                            cateList = { 
                                category: item.category, 
                                taskList: dataListId
                            };
                            //移动端切换页面
                            if(_.silder.init()){
                                _.silder.goIndex('2');
                            }
                        }
                    });
                }
                //编辑任务新建完成点击事件
                render.todoCheckEle.onclick = function(){
                    if (_.checkTask(render.todoEdit[0], render.todoEdit[1], render.todoEdit[2])) {
                        if (confirm("确认新建【" + render.todoEdit[0].value + "】任务吗？")) {
                            //新建任务
                            var newTask = _.checkTask(render.todoEdit[0], render.todoEdit[1], render.todoEdit[2]);
                            //新增任务对象
                            data.tasks.push(new data.TaskDetail({
                                                    cateList: cateList, 
                                                    title: newTask[0], 
                                                    time: newTask[1], 
                                                    content: newTask[2], 
                                                    isDone: false
                                                })
                                            );
                            //遍历对象id
                            _.each(data.tasks,function(item, i){
                                item.id = i;
                            });
                            //刷新本地数据
                            data.updateData(data.cates, data.lists, data.tasks);
                            //刷新分类视图
                            render.refreshCate(data.cates, data.lists);
                            //更新清单视图
                            render.refreshInventory(data.tasks,dataListId,"all");
                            //更新内容视图
                            render.renderEditChange("check");
                            _.each(data.tasks, function(item){
                                if (item.id === data.tasks.length - 1) {
                                    render.addContent(item);
                                }
                            });
                            //移动端切换页面
                            if(_.silder.init()){
                                _.silder.goIndex('1');
                            }
                        }
                    }
                };
            }
            else {
                alert("【新增任务】需要选中【目标分类】喔~╰(￣▽￣)╭");
            }
        });


        /**
         * 任务清单菜单选项点击更新内容视图事件
         */
        _.delegateClickEvent(render.todoInventory, function(e){

            e = e || window.event;
            var target = e.target || e.srcElement;

            _.stopBubble(e);

            var listSelected = _.$(".todo-task-selected")[0];
            if (listSelected) {
                var listId = listSelected.getAttribute("data-list-id");
            }
            else {
                listId = "all";
            }
            switch (target.getAttribute("id")) {
                case "todo-all":
                    render.refreshInventory(data.tasks, listId, "all");
                    break;
                case "todo-doing":
                    render.refreshInventory(data.tasks, listId, false);
                    break;
                case "todo-done":
                    render.refreshInventory(data.tasks, listId, true);
                    break;
            }

        });


        /*--------------内容视图---------------*/

        /**
         * 任务完成点击事件监听
         */
        _.addClickEvent(render.todoCheckIcon, function(){
            var taskId = render.todoDefault[0].getAttribute("data-task-id");
            //根据标题中的【data-task-id】属性确定对应任务对象
            for (var i = 0; i < data.tasks.length; i++) {
                if (data.tasks[i].id == taskId) {
                    //检查任务是否完成
                    if (data.tasks[i].isDone) {
                        alert("该任务已经完成啦！o(≧v≦)o~~");
                    }
                    else {
                        if (confirm("任务完成后不能修改啦~")) {
                            //确认任务完成
                            data.tasks[i].isDone = true;
                            //刷新本地数据
                            data.updateData(data.cates, data.lists, data.tasks);
                            //刷新分类视图
                            render.refreshCate(data.cates, data.lists);
                            //刷新任务清单视图
                            render.refreshInventory(data.tasks, data.tasks[i].cateList.taskList, "all");
                            //初始化第一项默认被选中
                            render.renderFirstItem();
                            //移动端切换页面
                            if(_.silder.init()){
                                _.silder.goIndex('1');
                            }
                        }
                    }
                }
            }
        });

        /**
         * 任务编辑点击事件监听
         */
        _.addClickEvent(render.todoEditIcon,function(){
            var taskId = render.todoDefault[0].getAttribute("data-task-id");
            //判断对象
            if (render.isTaskDefault(taskId)) {
                //获取对象
                var itemTask = render.isTaskDefault(taskId);
                if (itemTask.isDone) {
                    alert("该任务已完成，不能编辑喽(～￣▽￣)～");
                }
                else {
                    //编辑任务
                    if (confirm("确认编辑"+itemTask.title+"任务吗？")) {
                        //初始化编辑界面
                        render.renderEditChange("edit");
                    }
                }
                //回退图标点击事件监听
                _.addClickEvent(render.todoUndoEle,render.reback);
                //检查编辑后的任务内容
                render.todoCheckEle.onclick = function(){
                    //检查任务内容
                    if (_.checkTask(render.todoEdit[0],render.todoEdit[1],render.todoEdit[2])) {
                        if (confirm("任务编辑完成，确认提交吗？")) {
                            //修改任务
                            var editTask = _.checkTask(render.todoEdit[0],render.todoEdit[1],render.todoEdit[2]);
                            itemTask.title = editTask[0];
                            itemTask.time = editTask[1];
                            itemTask.content = editTask[2];
                            //刷新本地数据
                            data.updateData(data.cates, data.lists, data.tasks);
                            //更新清单视图
                            render.refreshInventory(data.tasks, itemTask.cateList.taskList, "all");
                            //刷新分类视图
                            render.refreshCate(data.cates, data.lists);
                            //更新未完成任务总数
                            render.renderCount();
                            //更新内容视图
                            render.renderEditChange("check");
                            render.addContent(itemTask);
                        }
                    }
                };
            }
        });
    };

    return {
        start: start,
        listen: listen
    }

});
