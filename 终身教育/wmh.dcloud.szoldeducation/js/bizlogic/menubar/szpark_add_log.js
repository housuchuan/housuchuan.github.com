/**
 * 描述 :新增相册 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-25 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//新增日志权限，默认‘1’公开，‘0’保密
	var authority = "2";
	var userId = "";
	var secretKey = "";
	var userId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//获取页面传递参数
		userId = WindowUtil.getExtraDataByKey('userId') || "";
	});
	//权限设置
	Zepto('.whether-public').on('tap', 'div', function() {
		Zepto(this).addClass('choice-active').siblings().removeClass('choice-active');
		if(Zepto(this).find('i').text() == "公开") {
			authority = "1"; //状态：1：公开 2:私密
		} else {
			authority = "2"; //状态：1：公开 2:私密
		}
	});
	//发表日志
	Zepto("#publish").on('tap', function() {
		var title = Zepto("#title").val();
		var content = Zepto("#content").val();
		if(title == "" || title == null) {
			UIUtil.toast('亲，请输入标题!');
			return;
		} else if(content == "" || content == null) {
			UIUtil.toast('写点什么吧!');
			return;
		}
		//对接接口
		addLog(title, content);
	});
	/**
	 *新增日志 
	 */
	function addLog(title, content) {
		//接口地址
		//var url = config.MockServerUrl + "mobile/space/log/addLog";
		var url = config.JServerUrl + "mobile/space/log/addLog";
		var requestData = {};
		var data = {
			userId: userId,
			userName: userName,
			status: authority,
			content: content,
			title: title
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("请求参数： " + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				mui.alert('发表日志成功！！');
				Zepto("#title").val('');
				Zepto("#content").val('');
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	}
});