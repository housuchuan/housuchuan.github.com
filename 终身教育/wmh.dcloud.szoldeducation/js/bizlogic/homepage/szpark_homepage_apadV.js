/**
 * 描述  子页面首页 
 * 作者 戴科
 * 版本 1.0
 * 时间 2016-04-06 08:49:58
 */
define(function(require, exports, module) {
	mui.init();
	"use strict";
	//UI初始化
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//日期工具类
	var DateUtil = require('core/MobileFrame/DateUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var MyDate = DateUtil.MyDate;
	//图片轮播工具封装类
	var YQ_Gallery = require('bizlogic/common/common_yqGallery');
	//升级资源工具
	var UpdateUtil = require('core/MobileFrame/UpdateUtil.js');
	//var updateUrl = config.UpdateFileUrl;
	var updateUrl = config.UpdateFileUrlPad;
	//引入公共类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	//引入字符串类
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//引入页面窗体类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//引入轮播工具类
	var WidgetUtil = require('core/MobileFrame/WidgetUtil.js');
	var url = config.ServerUrl + "getinfolist";
	var secretKey = "";
	//获取当前窗口的WebviewObject对象
	var main = null;
	//预加载菜单的对象
	var menu = null;
	//菜单的状态，打开关闭true or false
	var showMenu = false;
	var isInTransition = false;
	//侧滑展示比例（pad 为30%）（android ios 为70%）
	var width = "30%";
	//设置更新地址,这个是必须的,否则地址为''
	UpdateUtil.setOptions({
		UpdateUrl: updateUrl
	});
	//动态初始化轮播
	CommonUtil.initReady(function() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll({
			indicators: true, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		if(CommonUtil.os.plus) {
			if(CommonUtil.os.android) {
				//android pad打包需要控制一下横屏问题
				plus.screen.lockOrientation("landscape-primary");
			} else {
				//让ios人员打包，不用手动添加代码控制屏幕旋转   只需要要ios打包人员控制即可！
				plus.screen.lockOrientation("landscape");
			}
		}
		//初始化轮播
		initGalleryImgs();
		//更新应用
		UpdateUtil.initUpdateWithDefaultType(0);
		//初始化登录信息
		if(CommonUtil.os.plus) {
			//获取缓存值
			secretKey = StorageUtil.getStorageItem("secretKey");
			var userSession = StorageUtil.getStorageItem("UserSession");
			if(!userSession) {
				ajaxLogin(secretKey);
			} else {
				//userSession存在
				console.log("用户信息已存在！");
			}
		}
	});

	//pad首页刷新
	PullToRefreshTools.initPullDownRefresh({
		isDebug: false,
		up: null,
		bizlogic: {
			//这个下拉刷新不需要请求接口
			mIsRequestFirst: false,
			IsRendLitemplateAuto: false,

			refreshCallback: function() {
				//下拉刷新 重新请求数据
				initGalleryImgs(); //初始化轮播
			}
		},
		//三种皮肤
		//default -默认人的mui下拉刷新,webview优化了的
		//type1 -自定义类别1的默认实现, 没有基于iscroll
		//type1_material1 -自定义类别1的第一种材质
		skin: 'type0'
	}, function(pullToRefresh) {

	});

	//请求轮播数据
	function initGalleryImgs() {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: 0,
			pagesize: 8,
			catenum: "002004",
			isheadnews: "1",
			title: ""
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log("轮播图片参数：" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: successRequestGalleryImgsCallback,
			timeout: 9000,
			error: errorRequestCallback
		});
	};
	/**
	 * @description 图片轮播请求成功回调方法
	 * @param {Object} response
	 */
	function successRequestGalleryImgsCallback(response) {
		//、console.log("图片轮播请求结果\n" + unescape(JSON.stringify(response)));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList.Info) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				//console.log("info" + unescape(JSON.stringify(infoArray)));
				//处理轮播数据
				dealGalleyData(infoArray);
			}
		}
	};

	/**
	 * 处理轮播数据
	 */
	function dealGalleyData(infoArray) {
		//声明一个轮播数组
		var GalleryData = [];
		var temp1 = [];
		var temp2 = [];
		if(Array.isArray(infoArray)) {
			mui.each(infoArray, function(key, value) {
				if(value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
					//console.log(key+"null");
					value.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
				} else if(!value.infocontent) {
					value.infocontent = "";
				} else if(!value.Title) {
					value.Title = "";
				} else if(!value.Zhuanzai) {
					value.Zhuanzai = "";
				}
				//去除富文本htm标签以及nbsp;
				value.infocontent = unescape(value.infocontent).replace(/<[^>]+>/g, "");
				value.infocontent = unescape(value.infocontent).replace(/&nbsp;/ig, "");
				value.Zhuanzai = unescape(value.Zhuanzai);
				value.Title = unescape(value.Title);
				//将日期时间转换成日期类型
				value.InfoDate = (new MyDate(value.InfoDate + ":00")).toString('YYYY-MM-DD');
				if(key < 4) {
					temp1.push({
						"InfoID": value.InfoID,
						"HeadNewsAttachUrl": value.HeadNewsAttachUrl,
						"Zhuanzai": value.Zhuanzai,
						"InfoDate": value.InfoDate,
						"Title": value.Title,
						"infocontent": value.infocontent
					});
				}
				if(key > 3) {
					temp2.push({
						"InfoID": value.InfoID,
						"HeadNewsAttachUrl": value.HeadNewsAttachUrl,
						"Zhuanzai": value.Zhuanzai,
						"InfoDate": value.InfoDate,
						"Title": value.Title,
						"infocontent": value.infocontent
					});
				}
			});
		} else {
			if(infoArray.HeadNewsAttachUrl == null || infoArray.HeadNewsAttachUrl == "") {
				//console.log(key+"null");
				infoArray.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
			} else if(!infoArray.infocontent) {
				infoArray.infocontent = "";
			} else if(!infoArray.Title) {
				infoArray.Title = "";
			} else if(!infoArray.Zhuanzai) {
				infoArray.Zhuanzai = "";
			}
			//去除富文本htm标签以及nbsp;
			infoArray.infocontent = unescape(infoArray.infocontent).replace(/<[^>]+>/g, "");
			infoArray.infocontent = unescape(infoArray.infocontent).replace(/&nbsp;/ig, "");
			infoArray.Zhuanzai = unescape(infoArray.Zhuanzai);
			infoArray.Title = unescape(infoArray.Title);
			infoArray.InfoDate = (new MyDate(infoArray.InfoDate + ":00")).toString('YYYY-MM-DD');
			temp1.push({
				"InfoID": infoArray.InfoID,
				"HeadNewsAttachUrl": infoArray.HeadNewsAttachUrl,
				"Zhuanzai": infoArray.Zhuanzai,
				"InfoDate": infoArray.InfoDate,
				"Title": infoArray.Title,
				"infocontent": infoArray.infocontent
			});
		}
		GalleryData.push(temp1);
		GalleryData.push(temp2);

		var minImgHeight = '200px';
		YQ_Gallery.generateGallery('#gallerySlider', GalleryData, function(e, id) {
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: id,
				CateNum: "002004",
				Title: "图片新闻"
			});
		}, {
			isLoop: true,
			isAuto: true,
			autoTime: 5000,
			//图片的最大高度,可以不传
			minImgHeight: minImgHeight,
			//如果是每一个item有多张图,那么决定每一行显示几张图
			perLineItem: 2,
			//是否显示下面的Indicator
			isShowIndicator: true,
		});
	}
	/**
	 * @description 请求失败回调方法
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function errorRequestCallback(xhr, type, errorThrown) {
		UIUtil.toast("请求超时,请检查网络连接...", {
			isForceH5: true
		});
	}
	/**
	 * @description 九宫格方块14个模块
	 */
	document.getElementById("school_servey").addEventListener('tap', function() {
		//学校概况
		console.log("apad");
		WindowUtil.createWin('szpark_school_summary_apad.html', 'szpark_school_summary_apad.html');
	});
	document.getElementById("news_bulletin").addEventListener('tap', function() {
		//新闻公告
		WindowUtil.createWin("szpark_news_parent_apad.html", "../news/szpark_news_parent_apad.html");
	});
	document.getElementById("community_education").addEventListener('tap', function() {
		//社区教育
		WindowUtil.createWin('szpark_comeducation_pad.html', 'szpark_comeducation_pad.html');
	});
	document.getElementById("academic_education").addEventListener('tap', function() {
		//学历教育
		WindowUtil.createWin("szpark_academicEducation_index_apad.html", "szpark_academicEducation_index_apad.html");
	});
	document.getElementById("mystudy").addEventListener('tap', function() {
		//我的学习
		LoginUtil.ResetTARGET_URL('szpark_my_study_pad.html');
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin("szpark_my_study_pad.html", "../html_pad/mystudy/szpark_my_study_pad.html");
		}else{
			UIUtil.confirm({
				content: "您还没有登录，请先去登录！", //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	document.getElementById("personSpace").addEventListener('tap', function() {
		//个人空间
		console.log("个人空间");
		LoginUtil.ResetTARGET_URL('szpark_personal_space_pad.html');
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin("szpark_personal_space_pad.html", "../html_pad/menubar/szpark_personal_space_pad.html");
		}else{
			UIUtil.confirm({
				content: "您还没有登录，请先去登录！", //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	document.getElementById("educationCommuication").addEventListener('tap', function() {
		//教育关工委
		WindowUtil.createWin('szpark_educationIndex_pad.html', '../educate/szpark_educationIndex_pad.html');
	});
	document.getElementById("oldage_education").addEventListener('tap', function() {
		//老年教育
		WindowUtil.createWin('szpark_oldeducation_home_apad.html', 'szpark_oldeducation_home_apad.html');
	});
	document.getElementById("lifelong_education").addEventListener('tap', function() {
		//终身教育研究所
		WindowUtil.createWin('szpark_alllife_education_index_apad.html', 'szpark_alllife_education_index_apad.html');
	});
	document.getElementById("resource_center").addEventListener('tap', function() {
		//资源中心
		console.log("资源中心");
		WindowUtil.createWin('resource_center_index_pad.html', '../html_pad/resourceCenter/resource_center_index_pad.html');
	});
	document.getElementById("study_circle").addEventListener('tap', function() {
		//研习圈
		LoginUtil.ResetTARGET_URL('szpark_study_circle_pad.html');
		if(LoginUtil.isLoginSystem()){
			WindowUtil.createWin('szpark_study_circle_pad.html', '../html_pad/studycircle/szpark_study_circle_pad.html');
		}else{
			UIUtil.confirm({
				content: "您还没有登录，请先去登录！", //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	document.getElementById("maps").addEventListener('tap', function() {
		//地图
		WindowUtil.createWin('spark_map_pad.html', 'spark_map_pad.html');
	});
	document.getElementById("askAnswer").addEventListener('tap', function() {
		//你问我答
		WindowUtil.createWin('szpark_askandanswer_parent_pad.html', '../askandanswer/szpark_askandanswer_parent_pad.html');
	});
	document.getElementById("invest_questionare").addEventListener('tap', function() {
		//调查问卷
		WindowUtil.createWin("szpark_investigation_parent_pad.html", "../investigation/szpark_investigation_parent_pad.html");
	});
	/**
	 *@description 推荐课程module
	 */
	Zepto("#morecourse").on('tap', function() {
		//跳转到更多推荐课程列表页面
		console.log("正在跳转页面...");
	});

	//主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作
	window.addEventListener("swiperight", function() {
		//WindowUtil.firePageEvent(plus.runtime.appid, "menu:open");
	});

	//初始化侧滑加载页面
	mui.plusReady(function() {
		main = plus.webview.currentWebview();
		main.addEventListener('maskClick', closeMenu);
		//处理侧滑导航，为了避免和子页面初始化等竞争资源，延迟加载侧滑页面；
		setTimeout(function() {
			menu = mui.preload({
				id: 'index-menu-padV.html',
				url: '../index-menu-padV.html',
				styles: {
					left: 0,
					width: width,
					zindex: -1
				},
				show: {
					aniShow: 'none'
				}
			});
		}, 200);
	});
	/**
	 * @description 侧滑实现代码方式(点击左上角侧滑图标，打开侧滑菜单；)
	 */
	document.querySelector('.mui-icon-bars').addEventListener('tap', function(e) {
		if(showMenu) {
			closeMenu();
		} else {
			openMenu();
		}
	});
	//敲击顶部导航，内容区回到顶部
	document.querySelector('header').addEventListener('doubletap', function() {
		main.children()[0].evalJS('mui.scrollTo(0, 100)');
	});
	//主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作
	window.addEventListener("swiperight", openMenu);
	//主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
	window.addEventListener("swipeleft", closeMenu);
	//侧滑菜单触发关闭菜单命令
	window.addEventListener("menu:close", closeMenu);
	window.addEventListener("menu:open", openMenu);
	//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
	mui.menu = function() {
		if(showMenu) {
			closeMenu();
		} else {
			openMenu();
		}
	};
	/**
	 * 显示侧滑菜单
	 */
	function openMenu() {
		if(isInTransition) {
			return;
		}
		if(!showMenu) { //侧滑菜单处于隐藏状态，则立即显示出来；
			isInTransition = true;
			menu.setStyle({
				mask: 'rgba(0,0,0,0)'
			}); //menu设置透明遮罩防止点击
			menu.show('none', 0, function() {
				//主窗体开始侧滑并显示遮罩
				main.setStyle({
					mask: 'rgba(0,0,0,0.4)',
					left: width,
					transition: {
						duration: 150
					}
				});
				mui.later(function() {
					isInTransition = false;
					menu.setStyle({
						mask: "none"
					}); //移除menu的mask
				}, 160);
				showMenu = true;
			});
		}
	};

	/**
	 * 关闭菜单
	 */
	function closeMenu() {
		if(isInTransition) {
			return;
		}
		if(showMenu) {
			//关闭遮罩；
			//主窗体开始侧滑；
			isInTransition = true;
			main.setStyle({
				mask: 'none',
				left: '0',
				transition: {
					duration: 200
				}
			});
			showMenu = false;
			//等动画结束后，隐藏菜单webview，节省资源；
			mui.later(function() {
				isInTransition = false;
				menu.hide();
			}, 300);
		}
	};
	/**
	 * @description 监听回调，本页面通过CustomEvent事件接收获取secretKey
	 */
	window.addEventListener('CustomEvent', function(e) {
		if(e.detail.secretKey) {
			mui.toast("登录成功！");
			console.log("secretKey" + e.detail.secretKey);
			var secretKey = e.detail.secretKey;
			StorageUtil.setStorageItem("secretKey", secretKey);
			//获取secretKey成功之后，应该调用登录接口，获取用户信息
			ajaxLogin(secretKey);
		}
	});
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
		console.log("获取secretKey：" + secretKey);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, 2);
			if(response.code == "401" || response.code == 401) {
				//处理未登录
				//LoginUtil.handleNotloggedin(response);
				StorageUtil.removeStorageItem('LoginUrl');
				var LoginUrl = (response.debugInfo.url).replace('RelayState=pc', 'RelayState=mobile');
				StorageUtil.setStorageItem('LoginUrl',LoginUrl);
			} else if(response.code == "1" || response.code == 1) {
				//console.log("登录接口返回用户信息：" + StringUtil.formatJson(response.data));
				if(response.data) {
					var userSessionData1 = {
						userId: response.data.userId,
						userName: response.data.userName,
						image: response.data.image
					};
					var userSession = JSON.stringify(userSessionData1);
					StorageUtil.setStorageItem("UserSession", userSession);
					console.log("打印缓存信息：" + StorageUtil.getStorageItem("UserSession"));
					//刷新菜单栏账户信息
					//重启应用
					if(CommonUtil.os.plus) {
						//手机plus下
						//CommonUtil.plusReady(function() {
						//	plus.runtime.restart();
						//});
						//现在通过这一个闸口，判断各种入口
						var TARGET_URL = StorageUtil.getStorageItem("TARGET_URL");
						LoginUtil.OpenWinByPageId(TARGET_URL);
					}
					//WindowUtil.firePageEvent(id, "refreshEventName");
				}
			}
		}, function(e) {
			console.log('网络连接超时！请检查网络...' + JSON.stringify(e));
		}, 1, secretKey);
	};
	//首页返回键处理;处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		if(showMenu) {
			closeMenu();
		} else {
			//首次按键，提示‘再按一次退出应用’.p
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

});