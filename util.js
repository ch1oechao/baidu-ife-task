(function(global){

  function Util() {

    this.trim = function(text) {
      return text.replace(/^\s*|\s+|\s*$/g, '');
    }

    this.addEvent = function(elem, event, listener) {
      if (elem.addEventListener) {
        elem.addEventListener(event, listener, false);
      } else if (elem.attachEvent) {
        elem.attachEvent('on' + event, listener);
      } else {
        elem['on' + event] = listener;
      }
    };

    this.delegate = function(elem, tag, event, listener) {
      var self = this;
      if (elem && elem.children) {
        var $children = elem.children;
        Array.prototype.map.call($children, function(elem) {
          if (elem.tagName.toUpperCase() === tag.toUpperCase()) {
            self.addEvent(elem, event, listener);
          }
        });
      }
    };

    this.halt = function(ev) {
      ev = ev || window.event;

      if (ev.preventDefault) {
        ev.preventDefault();
      } else {
        ev.returnValue = false;
      }

      if (ev.stopPropagation) {
        ev.stopPropagation();
      } else {
        ev.cancelBubble = true;
      }

      return ev;
    };

  }

  global.util = new Util();

})(window);
