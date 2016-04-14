/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var curState = arguments[0],
      curCityData = aqiSourceData[curState.nowSelectCity] || {},
      count = 0,
      itemW;

  function filterData(period, totalData) {
    var filterData = {};
    period = parseInt(period, 10);

    Object.keys(totalData).map(function(item, idx) {
      count += parseInt(totalData[item], 10);
      if ((idx + 1) % period === 0) {
        var average = parseInt(count / period, 10),
            curDay = new Date(item),
            foreDay = new Date(curDay.setDate(curDay.getDate() - period));
        filterData[getDateStr(foreDay) + ' ~ ' + item] = average;
        count = 0;
      }
    });

    return filterData;
  }

  switch(curState.nowGraTime) {
    case 'week':
      itemW = 30;
      chartData = filterData(7, curCityData);
    break;
    case 'month':
      itemW = 50;
      chartData = filterData(30, curCityData);
    break;
    case 'day':
    default:
      itemW = 10;
      chartData = curCityData;
    break;
  }

  if (!chartData) return;

  var $chart = document.querySelector('.aqi-chart-wrap'),
      colors = ['#3EC9A7', '#2B879E', '#F25C5E'],
      grade;

  $chart.innerHTML = '';

  Object.keys(chartData).map(function(item) {

    if (chartData[item] < 75) {
      grade = 0;
    } else {
      grade = chartData[item] > 150 ? 2 : 1;
    }

    var $item = document.createElement('div');
    $item.style.height = chartData[item] + 'px';
    $item.style.width = itemW + 'px';
    $item.style.marginRight = 2 + 'px';
    $item.style.float = 'left';
    $item.style.background = colors[grade];
    $item.title = item + ': ' + chartData[item];

    $chart.appendChild($item);

  });

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  // 设置对应数据
  if (arguments[0]) {
    pageState.nowGraTime = arguments[0];
  }

  // 调用图表渲染函数
  renderChart.call(null, pageState);
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
  // 设置对应数据
  if (arguments[0]) {
    pageState.nowSelectCity = arguments[0];
  }
  // 调用图表渲染函数
  renderChart.call(null, pageState);
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var $fieldset = document.querySelector('#form-gra-time');
  util.addEvent($fieldset, 'click', function(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.tagName.toLowerCase() === 'input') {
      graTimeChange.call(null, target.value);
    }
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cityList = Object.keys(aqiSourceData),
      $select = document.querySelector('#city-select'),
      options = [];

  Array.prototype.map.call(cityList, function(city) {
    options.push('<option>' + city + '</option>');
  });

  $select.innerHTML = options.join('');

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  util.addEvent($select, 'change', function(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    citySelectChange.call(null, target.value);
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  pageState.nowSelectCity = Object.keys(aqiSourceData)[0];
  // 处理好的数据存到 chartData 中
  renderChart.call(null, pageState);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
