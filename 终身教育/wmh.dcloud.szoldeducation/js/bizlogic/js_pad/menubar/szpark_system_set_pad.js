/**
 * 描述 :pad版本设置页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-09-14 19:07:29
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UpdateUtil = require('core/MobileFrame/UpdateUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var updateUrl = null;
	CommonUtil.initReady(function() {
		//屏蔽IOS升级栏目
		if(CommonUtil.os.ios) {
			//隐藏升级版本栏目
			Zepto("#updateVersion").hide();
		}
		//设置当前应用版本号
		UpdateUtil.getCurrentResourceVersion(function(wgtinfo) {
			Zepto("#ResourceversionNum").text("(V " + wgtinfo.version + ")");
		});
	});
	//清除缓存
	Zepto("#clearStorage").on('tap', function() {
		UIUtil.toast("清除成功!");
	});
	//版本更新
	Zepto("#updateVersion").on('tap', function() {

	});
	//帮助
	Zepto("#help").on('tap', function() {

	});
	//关于
	Zepto("#about").on('tap', function() {

	});
});