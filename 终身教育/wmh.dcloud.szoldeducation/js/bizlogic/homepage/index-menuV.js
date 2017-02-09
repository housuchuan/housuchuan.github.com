/**
 * 描述   个人中心页面
 * 作者 sunzl
 * 版本 1.0
 * 时间 2016-04-07 09:12:21
 */
define(function(require, exports, module) {
	"use strict";
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var UIUtil=require('core/MobileFrame/UIUtil.js');
	var secretKey = '';
	var userId = "";
	var userName = "";
	var image = "";
	CommonUtil.initReady(initData);
	//console.log("初始化菜单页面");
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
			Zepto("#userName").text(userName);
		}
		if(userSession.image) {
			image = userSession.image;
			Zepto("#head-img").attr("src", image);
		}
	}
	Zepto("#originalDisplay").on('tap', function() {
		//原创展示
		WindowUtil.createWin("szpark_original_display.html", "menubar/szpark_original_display.html");
	});
	Zepto("#institution").on('tap', function() {
		//认证机构
		//close();
		WindowUtil.createWin("szpark_institution_parent.html", "side/szpark_institution_parent.html");
	});
	Zepto("#rank").on('tap', function() {
		//积分排行
		WindowUtil.createWin("szpark_ranking.html", "menubar/szpark_ranking.html");
	});
	Zepto("#personSpace").on('tap', function() {
		//个人空间
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin("szpark_personal_space.html", "menubar/szpark_personal_space.html");
		}else{
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					LoginUtil.ResetTARGET_URL('szpark_personal_space.html',null);
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	Zepto("#myStudy").on('tap', function() {
		//我的学习
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin("szpark_my_study.html", "mystudy/szpark_my_study.html");
		}else{
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					LoginUtil.ResetTARGET_URL('szpark_my_study.html',null);
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	Zepto("#myNews").on('tap', function() {
		//我的消息
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin("szpark_message_center.html", "menubar/szpark_message_center.html");
		}else{
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					LoginUtil.ResetTARGET_URL('szpark_message_center.html',null);
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	Zepto("#moreApp").on('tap', function() {
		//更多应用
		//WindowUtil.createWin("", "");
	});
	//升级应用
	Zepto(".setting").on('tap', function() {
		WindowUtil.createWin("setting.html", "setting.html");
	});
	//反馈
	Zepto(".comment").on('tap', function() {
		WindowUtil.createWin("feedback.html", "feedback.html");
	});
	//点击头像用户信息区域，手动登录
	Zepto(".login_area").on('tap', function() {
		LoginUtil.ResetTARGET_URL();
		var status = Zepto(this).find(".LoginName").text();
		if("请先登录" == status) {
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	//监听刷新菜单栏用户信息
	window.addEventListener('refreshLogininfo', function() {
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		if(userSession.userName) {
			Zepto("#userName").text(userSession.userName);
		}
		if(userSession.image) {
			Zepto("#head-img").attr("src", userSession.image);
		}
	});

	/***
	 * @description 处理侧滑Code
	 */
	var aniShow = "slide-in-right";
	//关于backbutton和menubutton两个按键的说明，在iOS平台不存在，故需隐藏
	if(!mui.os.android) {
		var span = document.getElementById("android-only")
		if(span) {
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
		if(!mui.isScrolling) {
			e.detail.gesture.preventDefault();
		}
	});
	//监听左滑事件，若菜单已展开，左滑要关闭菜单；
	window.addEventListener("swipeleft", function(e) {
		if(Math.abs(e.detail.angle) > 170) {
			close();
		}
	});
});