/**
 * @file: ToDo init data
 * @author:zchen9(zhao.zchen9@gmail.com)
 * 
 */


/**
 * 创建分类对象
 *
 * @param {Object} category 传递分类的值
 * @return {Object} category 将传递的值设置为分类对象返回
 */
var Category = function(obj){
    this.category = obj.category;

    return {category: this.category};
};
/**
 * 定义分类对象原型为默认分类
 */
Category.prototype = {
    category : "默认分类"
};

/**
 * 创建列表对象
 *
 * @param {Object} category 传递分类的值
 * @param {Object} taskList 传递列表的值
 * @return {Array} category,taskList 返回匿名对象：分类对象和列表对象 
 */
var TaskList = function(obj){
    this.category = obj.category;
    this.taskList = obj.taskList;

    return {category: this.category, taskList: this.taskList};
};
/**
 * 定义列表对象原型为数组：分类为“默认分类”，列表为“使用说明”
 */
TaskList.prototype = {
    category : Category.prototype.category,
    taskList : "使用说明"
};

/**
 * 创建任务对象
 *
 * @param {Object} cateList 传递列表对象值
 * @param {Object} title    传递任务标题值
 * @param {Object} time     传递任务时间值
 * @param {Object} content  传递任务内容值
 * @param {Boolean} isDone  传递任务是否完成布尔值
 * @return {Object} 返回任务对象 
 */
var TaskDetail = function(obj){
    this.id = 0;
    this.cateList = obj.cateList;
    this.title = obj.title;
    this.time = obj.time;
    this.content = obj.content;
    this.isDone = obj.isDone;
    
    return {
        id: this.id,
        cateList: this.cateList,
        title: this.title,
        time: this.time,
        content: this.content,
        isDone: this.isDone
    };
};
/**
 * 定义任务对象原型：id为0，分类为“默认分类”，列表为“使用说明”
 *                   标题为“Welcome to ToDo”，时间为“2015-01-01”，
 *                   内容为初始化内容使用说明，任务是否完成布尔值默认为true，已完成
 */
TaskDetail.prototype = {
    id: 0,
    cateList: TaskList.prototype,
    title: "Welcome to ToDo",
    time: new Date(2015,0,1),
    content: ''
        + 'Nice to meet U !  欢迎使用 ToDo 应用 ~ (๑•̀ㅂ•́)و✧'
        + '<br>'
        + '<br>'
        + '<i class="fa fa-flag fa-fw"></i> [标题]：任务标题，不超过10个字'
        + '<br>'
        + '<i class="fa fa-calendar fa-fw"></i> [时间]：格式为 [YYYY-MM-DD] ( 例：2015-01-01 )'
        + '<br>'
        + '<i class="fa fa-check-square-o fa-fw"></i> [完成]：视为又有一个任务被KO啦'
        + '<br>'
        + '<i class="fa fa-pencil-square-o fa-fw"></i> [编辑]：编辑任务标题、时间、内容'
        + '<br>'
        + '<i class="fa fa-undo fa-fw"></i> [重置]：编辑状态时，可取消编辑，恢复原任务内容'
        + '<br>'
        + '<i class="fa fa-check fa-fw"></i> [完成]：编辑状态时，为完成编辑'
        + '<br>'
        + '<i class="fa fa-plus fa-fw"></i> [添加]：可以添加新分类或者添加新任务'
        + '<br>'
        + '<i class="fa fa-smile-o fa-fw"></i> [笑脸]：标明该任务已完成 :)'
        + '<br>'
        + '<i class="fa fa-trash-o fa-fw"></i> [删除]：删除选中的列表或分类，删除后不能恢复，请谨慎~',
    isDone: true
};

/**
 * 设置原始数据
 *
 * @return {Array} tasks 返回数据初始化后的tasks数组
 * @return {Array} lists 返回数据初始化后的lists数组
 * @return {Array} cates 返回数据初始化后的cates数组
 */

var initData = (function(){

    //创建默认分类、默认列表、默认任务对象
    var defaultCate = Category.prototype;
    var defaultList = TaskList.prototype;
    var defaultDetail = TaskDetail.prototype;

    //创建新分类对象
    var cate1 = new Category({category: "百度IFE项目"});
    //创建新列表对象
    var list1 = new TaskList({
                        category: cate1.category, 
                        taskList: "task0001"
                    });
    var list2 = new TaskList({
                        category: cate1.category, 
                        taskList: "task0002"
                    });
    var list3 = new TaskList({
                        category: cate1.category, 
                        taskList: "task0003"
                    });
    //创建新任务对象
    var detail1 = new TaskDetail({
                        cateList: list1,
                        title: "todo1",
                        time: new Date(2015,3,1),
                        content: "完成task0001作业",
                        isDone: true
                    });
    var detail2 = new TaskDetail({
                        cateList: list1,
                        title: "todo2",
                        time: new Date(2015,3,20),
                        content: "重构task0001作业",
                        isDone: false
                    });
    var detail3 = new TaskDetail({
                        cateList: list2,
                        title: "todo3",
                        time: new Date(2015,3,25),
                        content: "完成task0002作业",
                        isDone: true
                    });
    var detail4 = new TaskDetail({
                        cateList: list2,
                        title: "todo4",
                        time: new Date(2015,4,5),
                        content: "重构task0002作业",
                        isDone: false
                    });
    var detail5 = new TaskDetail({
                        cateList: list3,
                        title: "todo5",
                        time: new Date(2015,4,25),
                        content: "完成task0003作业",
                        isDone: true
                    });

    //初始数据，将对象分类分别存入数组
    var cates = [defaultCate, cate1];
    var lists = [defaultList, list1, list2, list3];
    var tasks = [defaultDetail, detail1, detail2, detail3, detail4, detail5];

    //为任务数组里的每个对象设置id
    each(tasks,function(item,i){
       item.id = i;
    });

    return {
        tasks: tasks,
        lists: lists,
        cates: cates
    };

})();

/**
 * 操作LocalStorage数据
 *
 * @param {Function} getData 获取本地数据
 * @param {Function} setData 添加或修改本地数据
 *
 * @return {Function} 返回getData方法
 * @return {Function} 返回setData方法
 * @return {Array} tasks 返回LocalStorage中的tasks对象数组
 * @return {Array} lists 返回LocalStorage中的lists对象数组
 * @return {Array} cates 返回LocalStorage中的cates对象数组
 */
var data = (function(){

    getData = function(key){
                try{
                    //监测浏览器是否支持localStorage
                    if(window.localStorage){
                        var storage = window.localStorage;
                        //若浏览器之前没有储存key值，则将初始化对象数组存入localStorage，再返回该key值
                        if(!storage.getItem(key)){
                            switch (key){
                                case "cates":
                                    storage.setItem("cates",JSON.stringify(initData.cates));
                                    return JSON.parse(storage.getItem("cates"));
                                    break;
                                case "lists":
                                    storage.setItem("lists",JSON.stringify(initData.lists));
                                    return JSON.parse(storage.getItem("lists"));
                                    break;
                                case "tasks":
                                    storage.setItem("tasks",JSON.stringify(initData.tasks));
                                    return JSON.parse(storage.getItem("tasks"));
                            }
                        }
                        //若浏览器里已存在传递的key值，则直接返回key值对象
                        return JSON.parse(storage.getItem(key));
                    }
                }
                catch (e) {
                    console.log(e);
                }
            };
    setData = function(key,val){
                try{
                    if(window.localStorage){
                        var storage = window.localStorage;
                        if(storage.getItem(key)){
                            switch (key){
                                case "cates":
                                    storage.setItem("cates",JSON.stringify(val));
                                    break;
                                case "lists":
                                    storage.setItem("lists",JSON.stringify(val));
                                    break;
                                case "tasks":
                                    storage.setItem("tasks",JSON.stringify(val));
                            }
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            };

    return {
        tasks: this.getData("tasks"),
        lists: this.getData("lists"),
        cates: this.getData("cates"),
        getData: getData,
        setData: setData
    };

})();
