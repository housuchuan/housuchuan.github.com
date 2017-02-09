/**
 * 作者: 
 * 时间: 
 * 描述:  
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
			console.log("初始化");
			//获取token
			config.GetToken(function(token) {
				console.log(token);
				//通过openid获取用户信息
				config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					userguid = UserGuid
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				console.log(bathpath);
			})

		});
	}

});