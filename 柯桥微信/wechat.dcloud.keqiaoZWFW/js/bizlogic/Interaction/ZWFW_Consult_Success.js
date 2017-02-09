/**
 * 作者: ykx
 * 时间: 2016年9月5日
 * 描述: 咨询成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	var Config = require('config_Bizlogic');
	var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var Token = '';
	var ConsultList = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);

	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			ConsultList = Zepto('#ConsultList');
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			Config.GetToken(function(token) {
				console.log(token);
				//通过openid获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					userguid = UserGuid;
					ConsultList.on('tap', function() {
						Config.getProjectBasePath(function(bathpath) {
							bathpath = bathpath;
							console.log(bathpath)
							var openurl = 'html/Interaction/ZWFW_Consult_Hot.html';
							var ram = Math.random();
							window.location.href = bathpath + openurl + '?UserPK=' + OpenID + '&ram=' + ram;
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
	}
});