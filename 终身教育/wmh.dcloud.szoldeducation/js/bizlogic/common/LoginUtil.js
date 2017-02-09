/**
 * 作者: sunzl
 * 时间: 2016-08-29
 * 描述: 处理未登录
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	/**
	 * @description 处理未登录
	 * @param {Object} response 返回信息
	 */
	exports.handleNotloggedin = function(response) {
		if(response.debugInfo) {
			//var testurl = "https://is.ecitizen-dev.sipac.gov.cn:443/samlsso?SAMLRequest=jZNNb5wwEIbv%2FRXId8CQJkXWQrTdKCpS2pJd0kMukWtmG0tgU4%2FZbPvra8OScohWuc7HO%2B88Hq%2Buj10bHMCg1ConSURJAEroRqpfOXmob8OMXBcfVsi7tmfrwT6rLfweAG2wRgRjXdtGKxw6MDswByngYXuXk2drexbHaZJFH6Pk4ipKkk8so1kW419ohqeDmxTRWEytJLjVRsAon5M9b9GFypucODclVhxRHuB%2FAnGAUqHlyuYkpclVSLMwyWqasvSC0cuI0stHElRGWy10%2B1mqaZ3BKKY5SmSKd4DMCrZbf71jaUTZz6kI2Ze6rsLq%2B64mwY8ZS%2BqxOFAK2QjivFR%2FmkuKE7bRsHm%2FAJ%2FJkmJJaxUv5Wbxb669vKl0K8WfYN22%2BmVjgFuHy5phIttxe36gj8gm3I%2BlrPdrowVlSbCrvP79wFu5l2ByUnpvJJ6nn44BmvHt3CVYONpgo7ueG4meHRy5sCcUbFm1ad2eW9gvuLwby9kywYSXdmF%2FOS%2FaNP4SQDiXteEKe23sxPJNP8XM%2Bc3dXrPLv1D8Aw%3D%3D&RelayState=mobile&selectedKeys=email,phone&ssoLoginPage=";
			if(response.debugInfo.url) {
				var returnUrl = response.debugInfo.url;
			} else {
				console.log("********接口返回URL为空！**********");
			}
			//将返回的url中的响应状态更改为RelayState=mobile
			var url = returnUrl.replace('RelayState=pc', 'RelayState=mobile');
			//打开登录页面
			console.log("******正在打开登录页...********\n" + url);
			UIUtil.confirm({
				content: response.description, //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					var trueURL = 'https://is.ecitizen-dev.sipac.gov.cn:443/samlsso?SAMLRequest=jZNNb9swDIbv%2BxWG7vHn0BlC7CJLUcxAt3mJu8MuhSozqwBZ8kQ5zfbrJ9lx60MRFNCJIl%2B%2BfEStr0%2BdDI5gUGhVkCSMSQCK61ao3wW5b25XObkuP6yRdbKnm8E%2BqR38GQBtsEEEY13ZViscOjB7MEfB4X53V5Ana3saRWmShx%2FDJLsKk%2BQTzeM8j%2FAftMPD0XUK44hPpSS41YbDKF%2BQA5PoQtVNQZybCmuGKI7weoE4QKXQMmULksbJ1SqJ3WnijGYZTbMwTrNfJKiNtppr%2BVmoaZzBKKoZCqSKdYDUcrrffL2jaRjTxykJ6ZemqVf1931Dgp8zltRjcaAU0hHEZan%2B3JeUZ2yjYfN%2BATaTJeWS1jpays3i31x5dVNrKfjfYCOlft4aYNbhsmaYyHbMXm7oI6JdHcZU2vux0YKyJNjXXv%2FHwKQ4CDAFqbw3Es3dz8sA7fh2bhMsnGyw1V3PjEDPDk6M2zMKuszaSjfnDg4LLu%2FGcjGNU%2B6lXdhvzrM2rd8E4M5lY5jCXhs7sXzTTzlzfnO2l9vlXyj%2FAw%3D%3D&RelayState=mobile&selectedKeys=email,phone&ssoLoginPage=';
					WindowUtil.createWin("login.html", url);
				}
			});
		}
	};
	/**
	 * @description 重置目标URL,并且重置参数
	 * @param {Object} pageId
	 * @param {Object} extras
	 */
	exports.ResetTARGET_URL = function(pageId, extras) {
		console.log("打印登录目标页：" + pageId);
		//重置目标页
		StorageUtil.removeStorageItem("TARGET_URL");
		StorageUtil.setStorageItem('TARGET_URL', pageId);
		//重置参数
		StorageUtil.removeStorageItem("EXTRAS_DATA");
		StorageUtil.setStorageItem('EXTRAS_DATA', extras);
	};
	/**
	 * @description 处理登录完后的重定向地址
	 * @param {Object} targetURL 
	 * @param {Object} extras
	 */
	exports.OpenWinByPageId = function(targetURL, extras) {
		//判断登录业务逻辑（就是说登录之后，转向app的某个页面）
		var extras_data = StorageUtil.getStorageItem("EXTRAS_DATA");
		console.log("额外参数：" + JSON.stringify(extras_data));
		switch(targetURL) {
			case "szpark_study_circle.html":
				//进入研习圈首页(手机版)
				WindowUtil.createWin(targetURL, "studycircle/szpark_study_circle.html");
				//刷新菜单栏登录信息
				WindowUtil.firePageEvent("szpark_homepageV.html", "refreshCircleOrCourseInfoList");
				break;
			case "szpark_study_circle_pad.html":
				//进入研习圈首页（pad版）
				WindowUtil.createWin(targetURL, "../html_pad/studycircle/szpark_study_circle_pad.html");
				//刷新菜单栏登录信息
				break;
			case "szpark_circle_dynamics.html":
				//进入圈子基本信息页面
				WindowUtil.createWin(targetURL, "studycircle/szpark_circle_dynamics.html", extras_data);
				break;
			case "resource_center_view_video.html":
				//进入点播页面
				WindowUtil.createWin(targetURL, "resourceCenter/resource_center_view_video.html", extras_data);
				//刷新首页热门课程、教育关工委学习课程以及老年教育课程
				WindowUtil.firePageEvent("szpark_educationIndex.html", "refreshCourseList");
				break;
			case "resource_center_view_video_pad.html":
				WindowUtil.createWin(targetURL, "../html_pad/resourceCenter/resource_center_view_video_pad.html", extras_data);
				break;
				//pad直播页面
			case "resource_center_live_page_parent_pad.html":
				//WindowUtil.createWin(targetURL, "../html_pad/resourceCenter/resource_center_live_page_parent_pad.html", extras_data);
				break;
				//手机直播页面
			case "resource_center_view_zhibo_parent.html":
				//WindowUtil.createWin(targetURL, "../html_pad/resourceCenter/resource_center_live_page_parent_pad.html", extras_data);
				break;
				//手机我的学习界面
			case "szpark_my_study.html":
				WindowUtil.createWin(targetURL, "mystudy/szpark_my_study.html", extras_data);
				break;
				//我的学习pad
			case "szpark_my_study_pad.html":
				WindowUtil.createWin(targetURL, "../html_pad/mystudy/szpark_my_study_pad.html", extras_data);
				break;
				//个人空间pad版本
			case "szpark_personal_space_pad.html":
				WindowUtil.createWin("szpark_personal_space_pad.html", "../html_pad/menubar/szpark_personal_space_pad.html",extras_data);
				break;
				//个人空间手机版本
			case "szpark_personal_space.html":
				WindowUtil.createWin("szpark_personal_space.html", "menubar/szpark_personal_space.html",extras_data);
				break;
				//原创展示原创视频播放页面
			case "szpark_original_display_videoPlayer.html":
				WindowUtil.firePageEvent("szpark_original_display_videoPlayer.html", 'refreshVideoCommentsList');
				WindowUtil.createWin("szpark_original_display_videoPlayer.html", "szpark_original_display_videoPlayer.html",extras_data);
				//原创展示原创日志页面
			case "szpark_log_display.html":
				WindowUtil.firePageEvent("szpark_log_display.html", 'refreshLogCommentsList');
				WindowUtil.createWin("szpark_log_display.html", "szpark_log_display.html",extras_data);
			case "szpark_original_display_videoPlayer_pad.html":
				WindowUtil.firePageEvent("szpark_original_display_videoPlayer_pad.html", 'refreshVideoCommentsListPad');
				WindowUtil.createWin("szpark_original_display_videoPlayer_pad.html", "szpark_original_display_videoPlayer_pad.html",extras_data);
			case "szpark_message_center.html":
				WindowUtil.createWin("szpark_message_center.html", "szpark_message_center.html",extras_data);
			default:
				break;
		}
		//侧边栏用户信息刷新，所有登录后都要执行的代码；
		WindowUtil.firePageEvent("index-menu-padV.html", "refreshLogininfo");
		WindowUtil.firePageEvent("index-menuV.html", "refreshLogininfo");
		//		if(!DeviceUtil.tablet) {
		//			console.log("平板");
		//			WindowUtil.firePageEvent("index-menu-padV.html", "refreshLogininfo");
		//		} else {
		//			console.log("手机");
		//			WindowUtil.firePageEvent("index-menuV.html", "refreshLogininfo");
		//		}
	};
	/**
	 * @description 判断是否登录
	 */
	exports.isLoginSystem = function() {
		var flag = false; //代表未登录
		var secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			flag = true; //已在登录状态
		} else {
			flag = false; //不在登录状态
		}
		return flag;
	};
	//動態
	exports.loginUrl= function(){
		return StorageUtil.getStorageItem("LoginUrl");
	}
});