/**
 * 描述   个人中心页面
 * 作者 sunzl
 * 版本 1.0
 * 时间 2016-04-07 09:12:21
 */
define(function(require, exports, module) {
	"use strict"
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	CommonUtil.initReady(initData);
	
	//console.log("初始化菜单页面");
	function initData() {

	}
	Zepto("#originalDisplay").on('tap', function() {
		//原创展示
		//WindowUtil.createWin("", "");
	});
	Zepto("#institution").on('tap', function() {
		//认证机构
		//close();
		WindowUtil.createWin("szpark_institution_parent.html", "side/szpark_institution_parent.html");
	});
	Zepto("#rank").on('tap', function() {
		//积分排行
		//WindowUtil.createWin("", "");
	});
	Zepto("#personSpace").on('tap', function() {
		//个人空间
		//WindowUtil.createWin("", "");
		WindowUtil.createWin("szpark_personal_space.html", "menubar/szpark_personal_space.html");
	});
	Zepto("#myStudy").on('tap', function() {
		//我的学习
		//WindowUtil.createWin("", "");
	});
	Zepto("#myNews").on('tap', function() {
		//我的消息
		//WindowUtil.createWin("", "");
	});
	Zepto("#moreApp").on('tap', function() {
		//更多应用
		//WindowUtil.createWin("", "");
	});
	//升级应用
	Zepto(".setting").on('tap',function(){
		WindowUtil.createWin("setting.html", "setting.html");
	});

	/***
	 * @description 处理侧滑Code
	 */
	var aniShow = "slide-in-right";
	//关于backbutton和menubutton两个按键的说明，在iOS平台不存在，故需隐藏
	if (!mui.os.android) {
		var span = document.getElementById("android-only")
		if (span) {
			span.style.display = "none";
		}
		aniShow = "pop-in";
	}
	var subWebview = null,
		template = null,
		index = null;
	/**
	 * 关闭侧滑菜单
	 */
	function close() {
		WindowUtil.firePageEvent(plus.runtime.appid, "menu:close");
	}

	//在android4.4.2中的swipe事件，需要preventDefault一下，否则触发不正常
	window.addEventListener('dragstart', function(e) {
		mui.gestures.touch.lockDirection = true; //锁定方向
		mui.gestures.touch.startDirection = e.detail.direction;
	});
	window.addEventListener('dragleft', function(e) {
		if (!mui.isScrolling) {
			e.detail.gesture.preventDefault();
		}
	});
	//监听左滑事件，若菜单已展开，左滑要关闭菜单；
	window.addEventListener("swipeleft", function(e) {
		if (Math.abs(e.detail.angle) > 170) {
			close();
		}
	});
});