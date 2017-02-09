/**
 * 作者: chenxuan
 * 时间: 2016-12-31
 * 描述:  统计界面
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var UITools = require('UITools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
			'js/core/sea.min.js',
			'js/libs/mustache.min.js',
			'js/libs/echarts-all.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			initListners();
			var data1 = [{
				name: '请假',
				value: 46,
			}, {
				name: '到校',
				value: 54,
			}];
			var data2 = [{
				name: '到校',
				value: 20,
			}, {
				name: '请假',
				value: 80,
			}];
			//初始化
			initEcharts('data-daoxiao', data1);
			initEcharts('data-rest', data2);
		});
	}

	function initListners() {
		mui.init();
		mui('.mui-scroll-wrapper').scroll({
			indicators: false //是否显示滚动条
		});
		var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
		var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
		var item2 = document.getElementById('item2mobile');
		var item3 = document.getElementById('item3mobile');
		document.getElementById('slider1').addEventListener('slide', function(e) {
			if(e.detail.slideNumber === 1) {
				if(item2.querySelector('.mui-loading')) {
					setTimeout(function() {
						item2.querySelector('.mui-scroll').innerHTML = html2;
					}, 500);
				}
			} else if(e.detail.slideNumber === 2) {
				if(item3.querySelector('.mui-loading')) {
					setTimeout(function() {
						item3.querySelector('.mui-scroll').innerHTML = html3;
					}, 500);
				}
			}
		});
	};

	//生成echarts
	var initEcharts = function(dom, data) {
		// 基于准备好的dom，初始化echarts实例
		var obj = echarts.init(document.getElementById(dom));
		var labelTop = {
			normal: {
				label: {
					show: false,
					position: 'center',
					formatter: '{b}',
					textStyle: {
						baseline: 'bottom',
						fontSize: 8
					}
				},
				labelLine: {
					show: false
				}
			}
		};
		var labelFromatter = {
			normal: {
				label: {
					formatter: function(params) {
						return 100 - params.value + '%'
					},
					textStyle: {
						baseline: 'center',
						fontSize: 15
					}
				}
			},
		}
		var labelBottom = {
			normal: {
				color: '#ccc',
				label: {
					show: true,
					position: 'center',
					fontSize: 8
				},
				labelLine: {
					show: false
				}
			},
			emphasis: {
				color: 'rgba(0,0,0,0)'
			}
		};
		var radius = [40, 25];
		mui.each(data, function(key, value) {
			if(key == 0) {
				value['itemStyle'] = labelBottom;
			} else if(key == 1) {
				value['itemStyle'] = labelTop;
			}
		});
		var option = {
			series: [{
				type: 'pie',
				center: ['50%', '50%'],
				radius: radius,
				x: '0', // for funnel
				itemStyle: labelFromatter,
				data: data
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		obj.setOption(option);
	};
});