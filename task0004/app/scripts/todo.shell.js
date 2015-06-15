/**
* @file: ToDo shell
* @author:zchen9(zhao.zchen9@gmail.com)
*
*/
requirejs.config({
    paths: {
        "util": "todo.util",
        "data": "todo.data",
        "render": "todo.render",
        "control": "todo.controller"
    },
    shim: {
        "util": {
            exports: "_"
        },
        "data": {
            deps: ["util"],
            exports: "data"
        },
        "render": {
            deps: ["util", "data"],
            exports: "render"
        },
        "control": {
            deps: ["util", "data", "render"],
            exports: "control"
        }
    }

});

require(["control"], function(control){
    control.start();
    control.listen();
});
