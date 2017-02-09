/**
 * 描述 : 登录页面
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-08-02 17:10:36
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var CharsetUtil = require('core/MobileFrame/CharsetUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil=require('core/MobileFrame/UIUtil.js');
	var URL = '';
	CommonUtil.initReady();
	Zepto("#login").on('tap', function() {
		ajax();
	});
	/**
	 * @description 圈子分类列表
	 */
	function ajax() {
		var url = config.JServerUrl + 'circle/mobile/circle/CircleClassifyList';
		var requestData = {};
		requestData = JSON.stringify(requestData);
		console.log("请求参数：" + requestData);
		console.log("请求地址：" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("请求结果："+JSON.stringify(response));
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
			console.log("请求失败："+JSON.stringify(e));
		}, 1, config.secretKey);
	}

	/**
	 * @description 地址替换为mobile类型
	 */
	function replaceUrl(url) {
		var newUrl = url.replace('RelayState=pc', 'RelayState=mobile');
		return newUrl;
	}
});