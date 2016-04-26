(function() { 
  var $buttonContainer = document.querySelector('.button-container'),
      $list = document.querySelector('#numDisplay'),
      arr = [];

  util.addEvent($buttonContainer, 'click', function(ev) {
    ev = util.halt(ev);
    var target = ev.target || ev.srcElement;

    if (target.tagName.toLowerCase() !== 'button') return;

    var id = target.id,
        val = getInputVal();

    switch(id) {
      case 'rightIn':
        if (!!val) arr.push(val);
      break;
      case 'rightOut':
        if (arr.length !== 0) alert('将要删除: ' + arr.pop());
      break;
      case 'leftIn':
        if (!!val) arr.unshift(val);
      break;
      case 'leftOut':
        if (arr.length !== 0) alert('将要删除: ' + arr.shift());
      break;
    }

    renderNum(arr);
    clearInputVal();

  });

  util.addEvent($list, 'click', function(ev) {
    ev = util.halt(ev);
    var target = ev.target || ev.srcElement;
    if (target.tagName.toLowerCase() === 'li') {
      var idx = target.dataset.idx;
      arr.splice(idx, 1);
    }
    renderNum(arr);
  });

  function getInputVal() {
    var $input = document.querySelector('#numInput'),
        num = Number(util.trim($input.value) || '');
    return num;
  }

  function clearInputVal() {
    var $input = document.querySelector('#numInput');
    $input.value = null;
  }

  function renderNum(arr) {
    var $container = document.querySelector('#numDisplay'),
        list = [];
    arr.map(function(val, idx) {
      list.push('<li data-idx=' + idx + '>' + val + '</li>');
    });

    $container.innerHTML = list.join('');
  }

})();
 