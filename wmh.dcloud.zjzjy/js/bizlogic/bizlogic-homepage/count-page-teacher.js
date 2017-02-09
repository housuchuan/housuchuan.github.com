/**
 * 作者: housc
 * 时间: 2016-12-31
 * 描述:  教师统计界面
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
			'js/libs/epoint.moapi.v2.js'
		], function() {
			initListners();
		});
	}

	function initListners() {
		mui.init();
		mui('.mui-scroll-wrapper').scroll({
			indicators: false //是否显示滚动条
		});
		var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
		var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
		var item2 = document.getElementById('item5mobile');
		var item3 = document.getElementById('item6mobile');
		document.getElementById('slider2').addEventListener('slide', function(e) {
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
});