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
	taskDetail: {
		title:"Welcome to ToDo",
		date: new Date(2015,0,1),
		content:"Nice to meet U !  欢迎使用 ToDo 应用 ~ (๑•̀ㅂ•́)و✧"
	}
};


var Task = function(id,category,taskList,taskDetail,isDone){
	this.id = id;
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
	constructor : Task,
	id:"default",
	category: Category.prototype.category,
	taskList: TaskList.prototype.taskList,
	taskDetail:TaskDetail.prototype.taskDetail,
	isDone:false
};

var defaultCate = Category.prototype;
var defaultList = TaskList.prototype;
var defaultDetail = TaskDetail.prototype;

var defaultTask = Task.prototype;
var defaultDone = new Task("default","默认分类","使用说明",["ToDo isDone",new Date(2015,0,1),"已完成任务"],true);
var task1 = new Task("baidu-ife","百度IFE项目","task1",["to-do 1",new Date(2015,3,15),"完成task0001"],true);
var task2 = new Task("baidu-ife","百度IFE项目","task2",["to-do 2",new Date(2015,4,1),"完成task0002"],true);
var task3 = new Task("baidu-ife","百度IFE项目","task3",["to-do 3",new Date(2015,4,25),"完成task0003"],false);
