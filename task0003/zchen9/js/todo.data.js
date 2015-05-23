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
        +"<i class='fa fa-flag fa-fw'></i>"+"[标题]：任务标题，不超过10个字"
        +"<br>"
        +"<i class='fa fa-calendar fa-fw'></i>"+"[时间]：格式为 [YYYY-MM-DD] ( 例：2015-01-01 )"
        +"<br>"
        +"<i class='fa fa-check-square-o fa-fw'></i>"+"[完成]：视为又有一个任务被KO啦"
        +"<br>"
        +"<i class='fa fa-pencil-square-o fa-fw'></i>"+"[编辑]：编辑任务标题、时间、内容"
        +"<br>"
        +"<i class='fa fa-undo fa-fw'></i>"+"[重置]：编辑状态时，可取消编辑，恢复原任务内容"
        +"<br>"
        +"<i class='fa fa-check fa-fw'></i>"+"[完成]：编辑状态时，为完成编辑"
        +"<br>"
        +"<i class='fa fa-plus fa-fw'></i>"+"[添加]：可以添加新分类或者添加新任务"
        +"<br>"
        +"<i class='fa fa-smile-o fa-fw'></i>"+"[笑脸]：标明该任务已完成 :)"
        +"<br>"
        +"<i class='fa fa-trash-o fa-fw'></i>"+"[删除]：删除选中的列表或分类，删除后不能恢复，请谨慎~",
    isDone: true
};

var defaultCate = Category.prototype;
var defaultList = TaskList.prototype;
var defaultDetail = TaskDetail.prototype;

var cate1 = new Category("百度IFE项目");
var list1 = new TaskList("百度IFE项目","task0001");
var list2 = new TaskList("百度IFE项目","task0002");
var detail1 = new TaskDetail(["百度IFE项目","task0001"],"todo1",new Date(2015,4,1),"123完成task0001作业",true);
var detail2 = new TaskDetail(["百度IFE项目","task0001"],"todo2",new Date(2015,4,20),"456重构task0001作业",false);
var detail3 = new TaskDetail(["百度IFE项目","task0001"],"todo3",new Date(2015,4,10),"789重构task0001作业",false);
var detail4 = new TaskDetail(["百度IFE项目","task0002"],"todo4",new Date(2015,4,18),"1234完成task0002作业",true);


var tasks = [defaultDetail,detail1,detail2,detail3,detail4];
var cates = [defaultCate,cate1];
var lists = [defaultList,list1,list2];

each(tasks,function(item,i){
   item.id = i;
});

//本地存储
var data = {
    tasks: localTodoData("tasks"),
    lists: localTodoData("lists"),
    cates: localTodoData("cates")
};

console.log(data.tasks);
console.log(data.lists);
console.log(data.cates);

//本地数据初始化
function localTodoData(arr){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            var localTask = [];
            var localList = [];
            var localCate = [];

            switch (arr){
                //所有任务
                case "tasks":
                    each(tasks,function(item,i){
                        storage.setItem(i,JSON.stringify(item));
                        localTask.push(JSON.parse(storage.getItem(i)));
                    });
                    return localTask;
                    break;
                //列表项
                case "lists":
                    each(lists,function(item){
                        storage.setItem(item[1],JSON.stringify(item));
                        localList.push(JSON.parse(storage.getItem(item[1])));
                    });
                    return localList;
                    break;
                //分类项
                case "cates":
                    each(cates,function(item){
                        storage.setItem(item.category,JSON.stringify(item));
                        localCate.push(JSON.parse(storage.getItem(item.category)));
                    });
                    return localCate;
                    break;
            }

        }
    }catch(e){
        console.log(e);
    }
}

//获取本地数据 输入key值
//console.log(getData("百度IFE项目"));

function getData(key){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            return JSON.parse(storage.getItem(key));
        }
    }catch(e){
        console.log(e);
    }
}

//添加本地数据 输入对象和类型

//addData(cates[0],"cates");
//addData(lists[0],"lists");
//addData(tasks[0],"tasks");

function addData(obj,type){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            switch (type){
                case "cates":
                    storage.setItem(obj.category,JSON.stringify(obj));
                    break;
                case "lists":
                    storage.setItem(obj[1],JSON.stringify(obj));
                    break;
                case "tasks":
                    storage.setItem(obj.id,JSON.stringify(obj));
            }
        }
    }catch(e){
        console.log(e);
    }
}

//移除本地数据 输入key值

function removedata(key){
    try{
        if(window.localStorage){
            var storage = window.localStorage;
            storage.removeItem(key);
        }
    }catch(e){
        console.log(e);
    }
}

//JSON转换
var task1Str = JSON.stringify(detail1);
var task1Obj = JSON.parse(task1Str);