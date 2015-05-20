/**
 * Created by Chen on 2015-05-19.
 */

var Category = function(category){
    this.category = category;
};
Category.prototype = {
    category:"默认分类"
};

var TaskList = function(taskList){
    this.taskList = taskList;
};
TaskList.prototype = {
    taskList:"使用说明"
};

var TaskDetail = function(taskDetail){
    this.taskDetail = taskDetail;
};
TaskDetail.prototype = {
    taskDetail: ["Welcome to ToDo",
        new Date(2015,0,1),
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
        +"<i class='fa fa-smile-o fa-fw'></i>"+"[笑脸]：标明该任务已完成 :)"
    ]
};


var Task = function(category,taskList,taskDetail,isDone){
    this.id = 0;
    this.category = category;
    this.taskList = taskList;
    this.taskDetail = taskDetail;
    this.isDone = isDone;

    return {
        id:this.id,
        category: this.category,
        taskList: this.taskList,
        taskDetail:this.taskDetail,
        isDone:this.isDone
    };
};

Task.prototype = {
    id:0,
    category: Category.prototype.category,
    taskList: TaskList.prototype.taskList,
    taskDetail:TaskDetail.prototype.taskDetail,
    isDone:true
};

var defaultTask = Task.prototype;
var task1 = new Task("百度IFE项目","task1",["to-do 1",new Date(2015,3,15),"完成task0001"],true);
var task2 = new Task("百度IFE项目","task2",["to-do 2",new Date(2015,4,1),"完成task0002"],true);
var task3 = new Task("百度IFE项目","task3",["to-do 3",new Date(2015,4,25),"完成task0003"],false);
var task4 = new Task("百度IFE项目","task2",["to-do 2",new Date(2015,4,1),"完成task0002"],false);

var tasks = [defaultTask,task1,task2,task3];

for(var i= 0,t=0;i<tasks.length;i++){
	tasks[i].id += i;
}
console.log(tasks);

