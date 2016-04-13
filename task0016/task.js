/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var $city = document.querySelector('#aqi-city-input'),
      $aqi = document.querySelector('#aqi-value-input'),
      city = util.trim($city.value),
      aqi = util.trim($aqi.value);

  var TIPS = {
    'city': '城市必须为中英文字，请检查格式',
    'aqi': '空气质量指数必须为整数，请检查格式'
  };

  var formatCity = function(city) {
    if (!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)) {
      alert(TIPS['city'] || '');
      return false;
    }
    return city;
  }

  var formatAqi = function(aqi) {
    if (!aqi.match(/^\d+$/)) {
      alert(TIPS['aqi'] || '');
      return false;
    }
    return aqi;
  }

  if (formatCity(city) && formatAqi(aqi)) {
    // 保存数据
    aqiData[city] = parseInt(aqi, 10);

    // 清空输入框
    $city.value = '';
    $aqi.value = '';
  }

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var $table = document.querySelector('#aqi-table');

  var genHeader = function() {
    return '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
  }

  var genDelBtn = function(key) {
    return '<td><button data-city=' + key + '>删除</button></td>';
  };

  var genDataDom = function(data) {
    var trList = [],
        tdList = [];

    if (data) {
      var keys = Object.keys(data);
      Array.prototype.map.call(keys, function(key) {
        tdList.length = 0;
        tdList.push('<td>' + key + '</td>');
        tdList.push('<td>' + data[key] + '</td>');
        tdList.push(genDelBtn(key));
        trList.push('<tr id=' + key + '>' + tdList.join('') + '</tr>');
      });
    }

    return trList;
  }

  if (Object.keys(aqiData).length) {
    $table.innerHTML = '';
    $table.innerHTML += genHeader();
    $table.innerHTML += genDataDom(aqiData).join('');  
  } else {
    $table.innerHTML = '';
  }

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  if (arguments[0]) {
    var city = arguments[0];
    delete aqiData[city];  
  }
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var $btn = document.querySelector('#add-btn');
  util.addEvent($btn, 'click', addBtnHandle);

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var $table = document.querySelector('#aqi-table');
  util.addEvent($table, 'click', function(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.tagName.toUpperCase() === 'BUTTON') {
      delBtnHandle.call(null, target.dataset.city);  
    }
  });
  
}

init();
