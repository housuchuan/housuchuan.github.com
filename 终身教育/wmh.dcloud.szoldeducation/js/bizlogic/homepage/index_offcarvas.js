/**
 * 作者：戴科
 * 时间：2016-04-05
 * 描述：框架页面
 */
define(function(require, exports, module) {
	"use strict";
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var BoxGuid = null;
	var secretKey = "";
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//浏览器版本直接接收secretKey；
		secretKey = WindowUtil.getExtraDataByKey("secretKey");
		StorageUtil.setStorageItem("secretKey", secretKey);
		console.log("初始化手机浏览器获取secretKey:\n" + secretKey);
		//一开始进来，判断是否存在secretKey，如果存在，则不跳转到登录页面，不存在就跳转
		ajaxLogin(secretKey);
		var styleData = {
			top: '44px',
			bottom: '50px',
			zindex: 2
		};
		//创建子页面参数
		var Options = [{
			url: 'homepage/szpark_homepageV.html',
			id: 'szpark_homepageV.html',
			styles: styleData
		}, {
			url: 'news/szpark_news_list.html',
			id: 'szpark_news_list.html',
			styles: styleData
		}, {
			url: 'askandanswer/szpark_askandanswer_list.html',
			id: 'szpark_askandanswer_list.html',
			styles: styleData
		}, {
			url: 'investigation/szpark_investigation_list.html',
			id: 'szpark_investigation_list.html',
			styles: styleData
		}, {
			url: 'educate/szpark_educationIndex.html',
			id: 'szpark_educationIndex.html',
			styles: styleData
		}];
		WindowUtil.createSubWins(Options, true, '.mui-inner-wrap');
	}

	Zepto('.mui-tab-item').on('tap', function() {
		var title = Zepto(this).children('.mui-tab-label').text();
		Zepto('.mui-title').text('');
		if(title == '首页') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").show();
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_homepage.html');
		}
		if(title == '新闻公告') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").hide();
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_news_list.html');
		}
		if(title == '你问我答') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").hide();
			Zepto("#btn-askQuestion").show();
			changePageShow('szpark_askandanswer_list.html');
			WindowUtil.firePageEvent("szpark_askandanswer_list.html", 'refreshListPage');
		}
		if(title == '调查问卷') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").hide();
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_investigation_list.html');
		}
		if(title == '教育关工委') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").hide();
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_educationIndex.html');
		}
	});

	function changePageShow(showPage) {
		var pageArray = ['szpark_homepage.html', 'szpark_news_list.html', 'szpark_askandanswer_list.html', 'szpark_investigation_list.html', 'szpark_educationIndex.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i])
			}
		}
	}
	//homepage新闻公告触发的自定义事件
	window.addEventListener("plusChangeTab", function(event) {
		Zepto('.mui-title').text('新闻公告');
		Zepto(".mui-icon-bars").hide();
		Zepto('.mui-tab-item').eq(1).addClass('mui-active').siblings().removeClass('mui-active');
		changePageShow('szpark_news_list.html');
	});
	window.h5ChangeTab = function() {
		Zepto('.mui-title').text('新闻公告');
		Zepto(".mui-icon-bars").hide();
		Zepto('.mui-tab-item').eq(1).addClass('mui-active').siblings().removeClass('mui-active');
		changePageShow('szpark_news_list.html');
	};
	//浏览器触发子页面刷新回调传过来的BoxGuid
	window.getBoxGuidCB = function(msg) {
		console.log('首页面BoxGuid:' + msg.BoxGuid);
		BoxGuid = msg.BoxGuid;
	};
	//新增咨询答疑
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_askandanswer_submit.html', 'askandanswer/szpark_askandanswer_submit.html', {
			BoxGuid: BoxGuid,
			Title: "你问我答"

		});
	});

	Zepto("#originalDisplay").on('tap', function() {
		//原创展示
		WindowUtil.createWin("szpark_original_display.html", "menubar/szpark_original_display.html");
	});
	Zepto("#institution").on('tap', function() {
		//认证机构
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
		var vv = 'https://is.ecitizen-dev.sipac.gov.cn:443/samlsso?SAMLRequest=jZNNb9QwEIbv%2FIrI93wuLcHapFq2qohUIOymHLgg48xSS44dPM52y6%2FHTjaQQ7XqdT7eeefxeH1z6mRwBINCq4KkUUICUFy3Qv0qyENzF%2BbkpnyzRtbJnm4G%2B6h28HsAtMEGEYx1bVutcOjA7MEcBYeH3X1BHq3taRxnaR69jdLVdZSm72ie5HmMf6AdfhzdpCiJ%2BdRKgjttOIzyBTkwiS5U3RbEuamwZojiCP8TiANUCi1TtiBZkl6HaRIm75tkRbMVvXLSV%2Bl3EtRGW821%2FCDUtM5gFNUMBVLFOkBqOd1vPt3TLEroz6kI6cemqcP6y74hwbcZS%2BaxOFAK6QjislR%2FnkvKM7bRsHm9AJvJknJJax0v5Wbxz669uq21FPw52Eipn7YGmHW4rBkmsh2zlwf6iGjDw1hKe782WlCWBPva638dmBQHAaYglfdG4nn6%2BRigHd%2FOXYKFkw22uuuZEejZwYlxe0ZBl1Vb6fbcwWHB5dVYLpZxyr20C%2FvLedKm9ZcA3LlsDFPYa2Mnli%2F6KWfOL%2B72L7v8C%2BVf&RelayState=mobile&selectedKeys=email,phone&ssoLoginPage=';
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
		console.log("encodeurl\n" + encodeURIComponent(vv));
	});
	//设置
	Zepto(".setting").on('tap', function() {
		WindowUtil.createWin("setting.html", "setting.html");
	});
	/**
	 * @description 该部分用于处理侧滑菜单功能
	 * @function 实现首页点击侧滑
	 */
	if(CommonUtil.os.plus == true) {} else {
		//非Plus情况下
		//侧滑容器父节点
		var offCanvasWrapper = mui('#offCanvasWrapper');
		//主界面容器
		var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
		//菜单容器
		var offCanvasSide = document.getElementById("offCanvasSide");
		//主界面和侧滑菜单界面均支持区域滚动；
		mui('#offCanvasSideScroll').scroll();
		mui('#offCanvasContentScroll').scroll();
		//实现ios平台原生侧滑关闭页面；
		if(mui.os.plus && mui.os.ios) {
			mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
				plus.webview.currentWebview().setStyle({
					'popGesture': 'none'
				});
			});
		}
	}

	//首页返回键处理;处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		if(showMenu) {
			closeMenu();
		} else {
			//首次按键，提示‘再按一次退出应用’
			if(!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if(new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		}
	};
	/***
	 * @description 请求登录接口获取用户信息
	 * @param {Object} secretKey 根据该值获取用户信息
	 */
	function ajaxLogin(secretKey) {
		var url = config.JServerUrl + 'circle/mobile/circle/userLogin';
		var data = {};
		var requestData = JSON.stringify(data);
		console.log("登录请求参数：" + requestData);
		console.log("登录请求地址：" + url);
		console.log("登录SecretKey参数：" + secretKey);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, 2);
			//console.log("XXXX"+StringUtil.formatJson(response));
			if(response.code == "401" || response.code == 401) {
				//处理未登录
				LoginUtil.handleNotloggedin(response);
			} else if(response.code == "1" || response.code == 1) {
				console.log("登录接口返回用户信息：" + JSON.stringify(response.data));
				if(response.data) {
					var userSessionData = {
						userId: response.data.userId,
						userName: response.data.userName,
						image: response.data.image
					};
					var userSession = JSON.stringify(userSessionData);
					StorageUtil.setStorageItem("UserSession", userSession);
					//设置菜单栏登录信息,判断头像和用户名是否存在
					if(response.data.image && response.data.userName) {
						Zepto("#head-img").attr('src', response.data.image);
						Zepto(".LoginName").text(response.data.userName);
					}
					//浏览器下刷新页面
					if(!CommonUtil.os.plus) {
						//手机浏览器下，应该刷新子页面里面的研习圈内容以及课程类表内容
						setTimeout(function() {
							WindowUtil.firePageEvent("szpark_homepageV.html", "refreshCircleOrCourseInfoList");
						}, 300);
					}
				}
			}
		}, function(e) {
			console.log('网络连接超时！请检查网络...' + JSON.stringify(e));
		}, 1, secretKey);
	};
	/**
	 * 点击头像用户信息区域，手动登录
	 */
	Zepto(".login_area").on('tap', function() {
		var status = Zepto(this).find(".LoginName").text();
		if("请先登录" == status) {
			ajaxLogin(secretKey);
		}
	});
});