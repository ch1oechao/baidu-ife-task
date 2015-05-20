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
				+"<br>"+"<br>"
				+"<i class='fa fa-flag'></i>"+"[标题]：不超过10个汉字"
				+"<br>"
				+"<i class='fa fa-calendar'></i>"+"[时间]：格式为 [YYYY-MM-DD] ( 例：2015-01-01 )"
				+"<br>"
				+"<i class='fa fa-pencil-square-o'></i>"+"[编辑]：可以编辑任务标题、时间、内容"
				+"<br>"
				+"<i class='fa fa-undo'></i>"+"[重置]：编辑状态时，点击可以重置任务"
				+"<br>"
				+"<i class='fa fa-check-square-o'></i>"+"[完成]：编辑状态时，点击为完成编辑；非编辑状态时，点击为完成任务"

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
