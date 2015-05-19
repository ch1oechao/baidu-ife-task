/**
 * Created by Chen on 2015-05-17.
 */
window.onload = function(){

    var init = {
	    todoTaskItem : (function(){
		    var todoTaskList = $(".todo-task-list");
		    var todoItem = [];
		    for(var j=0;j<todoTaskList.length;j++){
			    var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
			    for(var i=0;i<todoTaskItem.length;i++){
				    todoItem.push(todoTaskItem[i]);
			    }
		    }
		    return todoItem;
	    })(),
	    todoDetail : $("dd"),
	    todoInventory : $(".todo-inventory-category")[0].children,

	    todoDefault: (function(){
		    var taskTitle = $("#todo-default-title");
		    var taskTime = $("#todo-default-time");
		    var taskContent = $("#todo-default-content");
		    return [taskTitle,taskTime,taskContent];
	    })(),

	    todoEdit: (function(){
		    var taskTitle = $("#todo-task-title");
		    var taskTime = $("#todo-task-time");
		    var taskContent = $("#todo-task-content");
		    taskTitle.style.display = "none";
		    taskTime.style.display = "none";
		    taskContent.style.display = "none";
		    return [taskTitle,taskTime,taskContent];
	    })(),

		todoSpecEdit : $(".todo-spec-edit")[0],
	    todoEditIcon : $(".fa-pencil-square-o")[0],
	    todoCheckIcon : $(".fa-check-square-o")[0],
	    todoUndoEle : (function(){
		    var undoIcon = document.createElement("i");
		    addClass(undoIcon,"fa fa-undo fa-2x");
		    undoIcon.setAttribute("onclick","javascript:document.taskForm.reset()");
		    return undoIcon;
	    })(),
	    todoFormName : $("#todo-form").getAttribute("name"),
	    todoAddTask : $("#todo-add-task"),

	    classToggle : function(e){
		    e = e||window.event;
		    var target = e.target||e.srcElement;
		    stopBubble(e);
		    var classname = "";
		    if(target.parentNode!=null){
			    switch(target.parentNode.className){
				    case "todo-inventory-detail":
					    classname="todo-detail-selected";
					    break;
				    case "todo-inventory-category":
					    classname="todo-inventory-selected";
					    break;
				    case "todo-task-list":
					    classname="todo-task-selected";
					    for(var j=0;j<init.todoTaskItem.length;j++){
						    removeClass(init.todoTaskItem[j],classname);
					    }
					    break;
			    }
			    delegateInitClass(target,classname);
		    }
	    }
    };

	delegateClickEvent(init.todoTaskItem,init.classToggle);
	delegateClickEvent(init.todoDetail,init.classToggle);
	delegateClickEvent(init.todoInventory,init.classToggle);

	addClickEvent(init.todoEditIcon,function(e){
		e = e || window.event;
		var target = e.target|| e.srcElement;
		target.style.display = "none";
		init.todoSpecEdit.insertBefore(init.todoUndoEle,init.todoCheckIcon);
		init.todoUndoEle.style.display = "block";
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "none";
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "inline-block";
		});
	});

	addClickEvent(init.todoAddTask,function(){
		init.todoEditIcon.style.display = "none";
		init.todoSpecEdit.insertBefore(init.todoUndoEle,init.todoCheckIcon);
		init.todoUndoEle.style.display = "block";
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "none";
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "inline-block";
		});
	});

	addClickEvent(init.todoCheckIcon,function(){
		init.todoEditIcon.style.display = "block";
		init.todoUndoEle.style.display = "none";
		delegateEleEvent(init.todoDefault,function(ele){
			ele.style.display = "inline";
			init.todoDefault[init.todoDefault.length-1].style.display = "block";
		});
		delegateEleEvent(init.todoEdit,function(ele){
			ele.style.display = "none";
		});
	});
};
