// slider组件
function Silder(options){
    this.dom = options.dom;
    this.wrap = options.wrap;

    if(this.init()){
        this.renderDOM();
        this.bindDom();
    }
}

Silder.prototype.init = function(){
    this.idx = 0;
    this.innerW = window.innerWidth;

    if(this.innerW <= 768){
        return true;
    }
    return false;
}

Silder.prototype.renderDOM = function(){
    var innerW = this.innerW;
    var sections = this.dom;
    var wrap = this.wrap;

    if(innerW <= 768){

        wrap.style.width = innerW + "px";

        each(sections,function(item,i) {
            item.style.width = innerW + "px";
            item.style.display = "inline-block";
            item.style.position = "absolute";
            item.style.webkitTransform = "translate3d(" + innerW * i + "px,0,0)";
        });
    }
}

Silder.prototype.goIndex = function(n){
    var idx = this.idx;
    var dom = this.dom;
    var len = this.dom.length;
    var curIdx = 0;

    if(typeof n === "number"){
        curIdx = n;
    }
    else if(typeof n === "string"){
        curIdx = idx + n * 1;
    }

    if(curIdx > len -1){
        curIdx = len - 1;
    }
    else if(curIdx < 0){
        curIdx = 0;
    }

    this.idx = curIdx;

    dom[curIdx].style.webkitTransition = "-webkit-transform .3s ease-out";
    dom[curIdx - 1] && (dom[curIdx - 1].style.webkitTransition = "-webkit-transform .3s ease-out");
    dom[curIdx + 1] && (dom[curIdx + 1].style.webkitTransition = "-webkit-transform .3s ease-out");

    dom[curIdx].style.webkitTransform = "translate3d(0, 0, 0)";

    for(var i = 0; i < curIdx; i++){
        dom[i] && (dom[i].style.webkitTransform = "translate3d(-"
                                                                + this.innerW 
                                                                + "px, 0, 0)"
                    );
    }
    for (var ii = curIdx + 1; ii < len; ii++) {
        dom[ii] && (dom[ii].style.webkitTransform = "translate3d("
                                                                + this.innerW 
                                                                + "px, 0, 0)"
                    );
    };


    //for todo-nav

    var todoNav = $(".todo-nav")[0];
    var todoNavUl = todoNav.getElementsByTagName("ul")[0];
    switch (curIdx) {
        case 0:
            todoNavUl.style.borderTop = "2px solid #7690B4";
        break;
        case 1:
            todoNavUl.style.borderTop = "2px solid #EBB74C";
        break;
        case 2:
            todoNavUl.style.borderTop = "2px solid #E8919F";
        break;

    }

}

Silder.prototype.bindDom = function(){
    var self = this;
    var innerW = self.innerW;
    var wrap = self.wrap;

    var startHandler = function(e){

        stopBubble(e);

        e = e || window.event;
        var target = e.target || e.srcElement;

        self.startTime = new Date() * 1;

        self.startX = e.touches[0].pageX;
        self.startY = e.touches[0].pageY;

        if(target.nodeName == "SECTION"){
            self.target = target;
        }
    };

    var moveHandler = function(e){

        stopBubble(e);

        self.offsetX = e.targetTouches[0].pageX - self.startX;
        self.offsetY = e.targetTouches[0].pageY - self.startY;

        if(self.offsetY < 50 && Math.abs(self.offsetX) > 15){
            stopDefault(e);
        }

        var dom = self.dom;
        var i = self.idx - 1;
        var len = dom.length;

        for(i; i < len ; i++){
            dom[i] 
            && (dom[i].style.webkitTransition = "-webkit-transform 0s ease-out");
            dom[i] 
            && (dom[i].style.webkitTransform = "translate3d("
                                                + ((i - self.idx) * innerW + self.offsetX)
                                                +"px, 0, 0)");
        }
    };

    var endHandler = function(e){

        stopBubble(e);

        var boundary = innerW / 12;
        var endTime = new Date() * 1;

        if(endTime - self.startTime > 150){
            if(self.offsetX >= boundary){
                self.goIndex("-1");
            }
            else if(self.offsetX < 0 && self.offsetX < -boundary){
                self.goIndex("+1");
            }
            else{
                self.goIndex("0");
            }
        }
        else {
            if(self.startX < 10){
                self.goIndex("-1");
            }
            else if (self.startX > innerW - 10){
                self.goIndex("+1");
            }
            else {
                self.goIndex(self.idx);
            }
        }
    };

    addEvent(wrap, "touchstart", startHandler);
    addEvent(wrap, "touchmove", moveHandler);
    addEvent(wrap, "touchend", endHandler);

}
