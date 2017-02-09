/**
 * 描述 :个人主页js交互 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-09-20 11:13:00
 */

define(function(require, exports, module) {
	"use strict"
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);
	var userId = "";
	var userName = "";
	var image = "../../img/MobileFrame/img_head_logo190-190.png";
	//secretKey默认登录成功之后，拿到的key
	var secretKey = "";
	//圈子种类,0:审核; 1:创建; 2:加入
	var circleKind = "0";
	//话题种类  0 代表“TA发表的”，1 代表“TA回复的”，2 代表“TA赞的”
	var topicKind = "0";
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
			Zepto(".nick").text(userName);
		}
		if(userSession.image) {
			image = userSession.image;
			Zepto("#headImg").attr("src", image);
		}
		//子页面
		var PageArray = [{
			url: 'szpark_personal_page_list_pad.html', //下拉刷新内容页面地址
			id: 'szpark_personal_page_list_pad.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px', //其它参数定义
				left: '16%',
				right: 0
			}
		}];
		WindowUtil.createSubWins(PageArray);
	};
	//圈子tab导航切换
	Zepto(".circle").on('tap', '.tab-item-common', function() {
		Zepto(this).addClass("tab-item-style").siblings().removeClass("tab-item-style");
		console.log(this.innerText);
		if("审核中" === this.innerText) {
			circleKind = "0";
		} else if("我加入的" === this.innerText) {
			circleKind = "2";
		} else if("我创建的" === this.innerText) {
			circleKind = "1";
		}
		WindowUtil.firePageEvent("szpark_personal_page_list_pad.html", "refreshCircleList", {
			circleKind: circleKind,
			title:this.innerText
		});
	});
	//话题tab导航切换
	Zepto(".topic").on('tap', '.tab-item-common', function() {
		Zepto(this).addClass("tab-item-style").siblings().removeClass("tab-item-style");
		if("我发表的" === this.innerText) {
			topicKind = '0';
		} else if("我回复的" === this.innerText) {
			topicKind = '1';
		} else if("我赞的" === this.innerText) {
			topicKind = '2';
		}
		WindowUtil.firePageEvent("szpark_personal_page_list_pad.html", "refreshTopicList", {
			topicKind: topicKind
		});
	});
});