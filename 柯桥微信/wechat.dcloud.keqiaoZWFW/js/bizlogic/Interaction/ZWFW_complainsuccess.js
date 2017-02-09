/**
 * 作者: daike
 * 时间: 2016年09-01
 * 描述: 投诉成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
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
			ConsultList();

		});

	}
	var ConsultList = function() {
		//非本地

		var ConsultList = Zepto('#ConsultList');
		ConsultList.on('tap', function() {

			var value = WindowTools.getExtraDataByKey("UserPK");
			var ram = Math.random();
			mui.openWindow({
				url: 'ZWFW_Mycompliant.html?UserPK=' + value + '&ram=' + ram
			})

		})
	}

});