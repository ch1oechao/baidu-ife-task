/**
 * Created by Chen on 2015-05-19.
 */

var datainit = {
	todoCateList : $(".todo-category-list")[0]
};

console.log(defaultDone);

if(defaultTask){
	(function(){
		var todoCateList = $(".todo-category-list")[0];
		var liCateDefault = document.createElement("li");
		liCateDefault.setAttribute("data-cate-id",defaultTask.id);
		var spanCateDefault = document.createElement("span");
		spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"+defaultTask.category;
		liCateDefault.appendChild(spanCateDefault);
		if(defaultTask.taskList){
			var ulTaskList = document.createElement("ul");
			addClass(ulTaskList,"todo-task-list");
			var liTaskList = document.createElement("li");
			liTaskList.setAttribute("data-list-id",defaultTask.taskList);
			liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>" + defaultTask.taskList;
			ulTaskList.appendChild(liTaskList);
			liCateDefault.appendChild(ulTaskList);
		}
		todoCateList.appendChild(liCateDefault);
		var defaultTaskList = $(".todo-task-list")[0].getElementsByTagName("li")[0];
		addClass(defaultTaskList,"todo-task-selected");
		if(defaultTask.taskDetail){
			var taskDetail = defaultTask.taskDetail;
			var taskInventory = $(".todo-inventory-detail")[0];
			if(taskDetail.date){
				var year = taskDetail.date.getFullYear();
				var month = taskDetail.date.getMonth()+1;
				var date = taskDetail.date.getDate();
				if(month<10){
					month = "0"+month;
				}
				if(date<10){
					date = "0"+date;
				}
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.setAttribute("data-list-time",defaultTask.taskDetail.date-0);
				dtTaskTime.innerHTML = "<time>"+[year,month,date].join("-")+"</time>";
				taskInventory.appendChild(dtTaskTime);
				var spanTaskTime = $("#todo-default-time");
				spanTaskTime.innerHTML = [year,month,date].join("-");
			}
			if(taskDetail.title){
				var ddTaskTitle = document.createElement("dd");
				if(defaultTask.isDone){
					ddTaskTitle.setAttribute("data-task-done","1");
				}else{
					ddTaskTitle.setAttribute("data-task-done","0");
				}
				ddTaskTitle.innerHTML = taskDetail.title;
				taskInventory.appendChild(ddTaskTitle);
				var spanTaskTitle = $("#todo-default-title");
				spanTaskTitle.innerHTML = taskDetail.title;
				var defaultTaskTitle = $("dd")[0];
				addClass(defaultTaskTitle,"todo-detail-selected");
			}
			if(taskDetail.content){
				var pTaskContent = $("#todo-default-content");
				pTaskContent.innerHTML = taskDetail.content;
			}
		}
	})();
}

function addTask(obj){
	addCate(obj);
	addList(obj);
	addInventory(obj);
}

addTask(defaultDone);
//addTask(task1);
//addTask(task2);
//addTask(task3);


function addCate(obj){
	if(obj){
		var liCate = $("[data-cate-id="+obj.id+"]");
		if(!liCate){
			liCate = document.createElement("li");
			liCate.setAttribute("data-cate-id",obj.id);
			var spanCateDefault = document.createElement("span");
			spanCateDefault.innerHTML = "<i class='fa fa-folder-open fa-fw'></i>"
										+ obj.category
										+"<i class='fa fa-remove fa-fw'></i>";
			liCate.appendChild(spanCateDefault);
			datainit.todoCateList.appendChild(liCate);
		}
	}
}

function addList(obj){
	var liCate = $("[data-cate-id="+obj.id+"]");
	if(obj.taskList){
		if(!(liCate.getElementsByTagName("ul")[0])){
			var ulTask = document.createElement("ul");
			addClass(ulTask,"todo-task-list");
			liCate.appendChild(ulTask);
		}
		if(liCate.getElementsByTagName("ul")[0]){
			ulTask = liCate.getElementsByTagName("ul")[0];
			if(ulTask.hasAttribute("class","todo-task-list")){
				var liList = $("[data-list-id="+obj.taskList+"]");
				if(!liList){
					var liTaskList = document.createElement("li");
					liTaskList.setAttribute("data-list-id",obj.taskList);
					liTaskList.innerHTML = "<i class='fa fa-file-o fa-fw'></i>"
					+ obj.taskList
					+"<i class='fa fa-remove fa-fw'></i>";
					ulTask.appendChild(liTaskList);
				}
			}
		}

	}
}

function addInventory(obj){
	if(obj.taskDetail){
		var taskDetail = obj.taskDetail;
		var taskInventory = $(".todo-inventory-detail")[0];
		if(taskDetail[1]) {
			var year = taskDetail[1].getFullYear();
			var month = taskDetail[1].getMonth() + 1;
			var date = taskDetail[1].getDate();
			if (month < 10) {
				month = "0" + month;
			}
			if (date < 10) {
				date = "0" + date;
			}
			var dtTimeStr = taskDetail[1] - 0;
			var dtTime = $("[data-list-time=" + dtTimeStr + "]");
			if (dtTime) {
				addTitle(taskDetail);
			}
			if(!dtTime){
				var dtTaskTime = document.createElement("dt");
				dtTaskTime.innerHTML = "<time>"+[year,month,date].join("-")+"</time>";
				taskInventory.appendChild(dtTaskTime);
				addTitle(taskDetail);
			}
		}
		function addTitle(taskDetail){
			if (taskDetail[0]) {
				var ddTaskTitle = document.createElement("dd");
				if(obj.isDone){
					ddTaskTitle.setAttribute("data-task-done","1");
					ddTaskTitle.innerHTML = taskDetail[0]+"<i class='fa fa-smile-o'></i>";
				}else{
					ddTaskTitle.setAttribute("data-task-done","0");
					ddTaskTitle.innerHTML = taskDetail[0];
				}
				taskInventory.appendChild(ddTaskTitle);
			}
		}
		//if(taskDetail.content){
		//	var pTaskContent = $("#todo-default-content");
		//	pTaskContent.innerHTML = taskDetail.content;
		//}
	}
}

