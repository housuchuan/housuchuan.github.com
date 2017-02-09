/**
 * 描述 :设置页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-26 19:03:46
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UpdateUtil = require('core/MobileFrame/UpdateUtil.js');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var updateUrl = null;
	var secretKey = "";
	CommonUtil.initReady(function() {
		//初始化登录信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		//屏蔽IOS升级栏目
		if(CommonUtil.os.ios) {
			//隐藏升级版本栏目
			Zepto("#checkUpdate").hide();
		}
		//设置当前应用版本号
		UpdateUtil.getCurrentResourceVersion(function(wgtinfo) {
			Zepto("#ResourceversionNum").text("V " + wgtinfo.version);
		});
	});
	//升级版本
	Zepto("#checkUpdate").on('tap', function() {
		//UIUtil.toast("正在检查更新...");
		//console.log("更新文件地址：" + updateUrl);
		//默认类别0  直接用waitingDialog
		if(UserAgentUtil.ANDROID_PAD() || UserAgentUtil.IOS_IPAD()) {
			updateUrl = config.UpdateFileUrlPad;
			console.log("升级pad" + "\n升级地址" + updateUrl);
			//设置更新地址,这个是必须的,否则地址为''
			UpdateUtil.setOptions({
				UpdateUrl: updateUrl
			});
		} else {
			updateUrl = config.UpdateFileUrl;
			console.log("升级phone" + "\n升级地址" + updateUrl);
			//设置更新地址,这个是必须的,否则地址为''
			UpdateUtil.setOptions({
				UpdateUrl: updateUrl
			});
		}
		UpdateUtil.initUpdateWithDefaultType(0);
		//默认类别1 android用通知栏,ios直接toast提示
		//UpdateUtil.initUpdateWithDefaultType(1);
		//自定义样式的更新-相当于重写回调效果
	});

	//清除缓存
	Zepto(".clearSession").on('tap', function() {
		UIUtil.toast('清除缓存成功！');
		//StorageUtil.removeStorageItem("secretKey");
		//StorageUtil.removeStorageItem("UserSession");
	});
	//注销登录（退出系统）
	Zepto('#LogOut').on('click', function() {
		console.log("单点注销");
		if(CommonUtil.os.plus) {
			//第一步：先带着secretkey注销,然后在清空缓存
			logout();
		}
	});

	/**
	 * @description 居民通注销登录接口
	 */
	function logout() {
		var url = config.JServerUrl + 'logout?pds_logout=true';
		//console.log("接口地址：\n" + url);
		var data = {};
		data = JSON.stringify(data);
		CommonUtil.ajax(url, data, function(response) {
			console.log("注销接口调用成功！！！");
			StorageUtil.removeStorageItem("secretKey");
			StorageUtil.removeStorageItem("UserSession");
			plus.runtime.restart();
		}, function(e) {
			//UIUtil.toast('网络连接超时！请检查网络...');
			//console.log("请求失败：" + JSON.stringify(e));
			console.log("注销成功！！！！");
			//第二步：清缓存
			StorageUtil.removeStorageItem("secretKey");
			StorageUtil.removeStorageItem("UserSession");
			plus.runtime.restart();
		}, 1, secretKey);
	}

});