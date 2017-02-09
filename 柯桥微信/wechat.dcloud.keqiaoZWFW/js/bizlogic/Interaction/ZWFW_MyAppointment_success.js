/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 预约成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var UserGuid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var AddAppointment = '';
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
			AddAppointment = Zepto('#AddAppointment');
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			Config.GetToken(function(token) {
				console.log(token);
				//通过openid获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					UserGuid = UserGuid;
					AddAppointment.on('tap', function() {
						Config.getProjectBasePath(function(bathpath) {
							bathpath = bathpath;
							console.log(bathpath)
							var openurl = 'html/Interaction/ZWFW_MyAppointment.html';
							var ram = Math.random();
							window.location.href = bathpath + openurl + '?UserPK=' + OpenID + '&ram=' + ram;;
						});
					})
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});
	};
});