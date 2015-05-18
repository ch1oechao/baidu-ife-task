/**
 * Created by Chen on 2015-05-17.
 */
window.onload = function(){

    var init = {
        todoCategoryList : $(".todo-category-list")[0].children,
        taskHide: function(){
            var taskList = $(".todo-task-list");
            for(var i = 0;i < taskList.length;i++){
                taskList[i].style.display= "none";
            }
        }

    };


    for(var i=0;i<init.todoCategoryList.length;i++){
        init.taskHide();
        addClickEvent(init.todoCategoryList[i],taskListToggle);
    }

    var todoTaskList = $(".todo-task-list");
    for(var j=0;j<todoTaskList.length;j++){
        var todoTaskItem = todoTaskList[j].getElementsByTagName("li");
        for(var r= 0;r<todoTaskItem.length;r++){
            //addClickEvent(todoTaskItem[r],taskItemSelected);

            todoTaskItem[r].onclick = function(){
                stopBubble(this);
                for(var jj = 0;jj<todoTaskList.length;jj++){
                    todoTaskItem = todoTaskList[jj].getElementsByTagName("li");
                    for(var rr = 0;rr<todoTaskItem.length;rr++){
                        removeClass(todoTaskItem[rr], "todo-task-selected");
                    }
                }
                if(!hasClass(this,"todo-task-selected")){
                    addClass(this, "todo-task-selected");
                }else{
                    removeClass(this, "todo-task-selected");
                }
            };

        }
    }

    var todoDetail = $("dd");
    for(var s=0;s<todoDetail.length;s++){
        todoDetail[s].onclick = function(){
            for(var ss=0;ss<todoDetail.length;ss++){
                removeClass(todoDetail[ss],'todo-detail-selected');
            }
            addClass(this,"todo-detail-selected");
        };
    } 

    var todoInventory = $(".todo-inventory-category")[0].children;
    for(var t=0;t<todoInventory.length;t++){
        todoInventory[t].onclick = function(){
            for (var tt=0;tt<todoInventory.length;tt++) {
                if(hasClass(todoInventory[tt],"todo-inventory-selected")){
                    removeClass(todoInventory[tt],"todo-inventory-selected");
                }
            }
            addClass(this,"todo-inventory-selected");
        };
    }

    //function taskItemSelected(){
    //    stopBubble(this);
    //    if(!hasClass(this,"todo-task-selected")) {
    //        addClass(this, "todo-task-selected");
    //    }else{
    //        removeClass(this, "todo-task-selected");
    //    }
    //}

    function taskListToggle(){
        if(this.childNodes.length!=0){
            var taskList = this.getElementsByTagName("ul")[0];
            var listDisplay = taskList.style.display;
            if(listDisplay === "none"){
                taskList.style.display = "block";
            }else{
                taskList.style.display = "none";
            }

        }
    }

};
