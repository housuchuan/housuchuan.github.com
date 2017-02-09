/**
 * 作者: daike
 * 时间: 2016-08-31
 * 描述:  提交成功
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	var OpenID = '';
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
			'js/libs/mui.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			//初始化
			document.getElementById('back').addEventListener('click', function(e) {

				mui.openWindow({
					url: "../Interaction/ZWFW_MyProject.html?UserPK=" + OpenID

				});

			});

		});
	}

});