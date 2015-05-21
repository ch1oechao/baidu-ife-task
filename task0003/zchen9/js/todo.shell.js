/**
 * Created by Chen on 2015-05-17.
 */

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
    todoCateList:$(".todo-category-list")[0].getElementsByTagName("li"),
    todoDetail : (function(){
	    var ddTitle = $("dd");
	    var ddTitles = [];
	    for(var i=0;i<ddTitle.length;i++){
		    ddTitles.push(ddTitle[i]);
	    }
	    return ddTitles;
    })(),
    todoInventory : $(".todo-inventory-category")[0].children,
    todoRemoveIcon : $(".fa-remove"),
    todoFormName : $("#todo-form").getAttribute("name"),

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

	delegateClickEvent(init.todoInventory,init.classToggle);

