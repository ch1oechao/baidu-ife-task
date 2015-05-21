/**
 * Created by Chen on 2015-05-19.
 */

var Category = function(category){
    this.category = category;
    return {category:this.category};
};
Category.prototype = {category:"默认分类"};

var TaskList = function(category,taskList){
    this.category = category;
    this.taskList = taskList;

    return [this.category, this.taskList];
};
TaskList.prototype = ["默认分类", "使用说明"];

var TaskDetail = function(taskList,title,time,content,isDone){
    this.id = 0;
    this.taskList = taskList;
    this.title = title;
    this.time = time;
    this.content = content;
    this.isDone = isDone;
    return {
        id:this.id,
        cateList:this.taskList,
        title:this.title,
        time:this.time,
        content:this.content,
        isDone:this.isDone
    };
};
TaskDetail.prototype = {
    id:0,
    cateList:["默认分类", "使用说明"],
    title: "Welcome to ToDo",
    time: new Date(2015,0,1),
    content:
        "Nice to meet U !  欢迎使用 ToDo 应用 ~ (๑•̀ㅂ•́)و✧"
        +"<br>"+"<br>"
        +"<i class='fa fa-flag fa-fw'></i>"+"[标题]：不超过10个汉字"
        +"<br>"
        +"<i class='fa fa-calendar fa-fw'></i>"+"[时间]：格式为 [YYYY-MM-DD] ( 例：2015-01-01 )"
        +"<br>"
        +"<i class='fa fa-check-square-o fa-fw'></i>"+"[完成]：点击视为完成任务"
        +"<br>"
        +"<i class='fa fa-pencil-square-o fa-fw'></i>"+"[编辑]：点击可以编辑任务标题、时间、内容"
        +"<br>"
        +"<i class='fa fa-undo fa-fw'></i>"+"[重置]：编辑状态时，点击可以重置任务"
        +"<br>"
        +"<i class='fa fa-check fa-fw'></i>"+"[完成]：编辑状态时，点击为完成编辑"
        +"<br>"
        +"<i class='fa fa-plus fa-fw'></i>"+"[添加]：可以添加新分类或者添加新任务"
        +"<br>"
        +"<i class='fa fa-smile-o fa-fw'></i>"+"[笑脸]：标明该任务已完成 :)",
    isDone: true
};


//var Task = function(taskDetail){
//    this.id = 0;
//    this.taskDetail = taskDetail;
//    return {
//        id:this.id,
//        task:this.taskDetail
//    };
//};
//
//Task.prototype = {
//    id:0,
//    task:TaskDetail.prototype
//};


var defaultCate = Category.prototype;
var defaultList = TaskList.prototype;
var defaultDetail = TaskDetail.prototype;

var cate1 = new Category("百度IFE项目");
var list1 = new TaskList("百度IFE项目","task0001");
var detail1 = new TaskDetail(["百度IFE项目","task0001"],"todo1",new Date(2015,4,1),"完成task0001作业",true);
var detail2 = new TaskDetail(["百度IFE项目","task0001"],"todo2",new Date(2015,4,20),"重构task0001作业",false);
var detail3 = new TaskDetail(["百度IFE项目","task0001"],"todo3",new Date(2015,4,10),"重构task0001作业",false);

//var defaultTask = Task.prototype;
//var task1 = new Task(detail1);
//var task2 = new Task(detail2);

//JSON转换
var task1Str = JSON.stringify(detail1);
var task1Obj = JSON.parse(task1Str);
//console.log(task1Str,task1Obj);

var tasks = [defaultDetail,detail1,detail2,detail3];
var cates = [cate1];
var lists = [list1];

for(var i= 0,t=0;i<tasks.length;i++){
	tasks[i].id += i;
}
console.log(tasks);
//console.log(detail1,defaultDetail);
//console.log(list1[0],list1[1]);

