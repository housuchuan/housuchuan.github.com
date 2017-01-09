/**
 * 描述 :发现 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-12-29 12:34:48
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			//初始化首页轮播
			var slider = mui("#slider.slider-imgSlider");
			slider.slider({
				interval: 5000
			});

		});
	}
});