/**
 * 作者：孙尊路
 * 时间：2016-04-05
 * 描述：框架页面
 */
define(function(require, exports, module) {
	"use strict"
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var CharsetUtil = require('core/MobileFrame/CharsetUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	var UpdateUtil = require('core/MobileFrame/UpdateUtil.js');
	var updateUrl = config.UpdateFileUrl;
	//你问我答邮箱Guid
	var BoxGuid = null;
	//获取当前窗口的WebviewObject对象
	var main = null;
	//预加载菜单的对象
	var menu = null;
	//菜单的状态，打开关闭true or false
	var showMenu = false;
	var isInTransition = false;
	//侧滑展示比例（pad 为30%）（android ios 为70%）
	var width = "70%";
	var secretKey = "";
	//设置更新地址,这个是必须的,否则地址为''
	UpdateUtil.setOptions({
		UpdateUrl: updateUrl
	});
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
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
		} else {
			//接收浏览器传过来的值
			secretKey = WindowUtil.getExtraDataByKey("secretKey");
			//mui.toast("secretKey的值："+secretKey);
			StorageUtil.setStorageItem("secretKey", secretKey);
			ajaxLogin(secretKey);
		}

		//创建子页面参数，phone,iPhoney以及手机浏览器共用
		var Options = [{
			url: 'homepage/szpark_homepageV.html',
			id: 'szpark_homepageV.html',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		}, {
			url: 'news/szpark_news_list.html',
			id: 'szpark_news_list.html',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		}, {
			url: 'askandanswer/szpark_askandanswer_list.html',
			id: 'szpark_askandanswer_list.html',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		}, {
			url: 'investigation/szpark_investigation_list.html',
			id: 'szpark_investigation_list.html',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		}, {
			url: 'educate/szpark_educationIndex.html',
			id: 'szpark_educationIndex.html',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		}];
		WindowUtil.createSubWins(Options, true);
		//更新资源
		UpdateUtil.initUpdateWithDefaultType(0);

		//iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
		if(mui.os.ios && window.plus) { //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
			plus.webview.currentWebview().addEventListener('hide', function() {
				var opened = webview.opened();
				if(opened) {
					for(var i = 0, len = opened.length; i < len; i++) {
						var openedWebview = opened[i];
						openedWebview.hide("none");
					}
				}
			});
		}
	}
	//tab导航切换
	Zepto('.mui-tab-item').on('tap', function() {
		var title = Zepto(this).children('.mui-tab-label').text();
		Zepto('.mui-title').text('');
		if(title == '首页') {
			Zepto('.mui-title').text(title);
			Zepto(".mui-icon-bars").show();
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_homepageV.html');
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
	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['szpark_homepageV.html', 'szpark_news_list.html', 'szpark_askandanswer_list.html', 'szpark_investigation_list.html', 'szpark_educationIndex.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i]);
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
	//监听接收BoxGuid
	window.addEventListener('getBoxGuideEvent', function(e) {
		if(e.detail.BoxGuid) {
			BoxGuid = e.detail.BoxGuid;
		}
	});
	//新增你问我答
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_askandanswer_submit.html', 'askandanswer/szpark_askandanswer_submit.html', {
			BoxGuid: "b59def25-3da4-4920-b81f-f6eab30f9eec",
			Title: "你问我答"
		});
	});

	mui.plusReady(function() {
		//console.log("手机版本控制旋转" + "正在竖屏......................");
		plus.screen.lockOrientation("portrait-primary");
		//plus.screen.lockOrientation("portrait-primary");
		main = plus.webview.currentWebview();
		main.addEventListener('maskClick', closeMenu);
		//处理侧滑导航，为了避免和子页面初始化等竞争资源，延迟加载侧滑页面；
		setTimeout(function() {
			menu = mui.preload({
				id: 'index-menuV.html',
				url: 'index-menuV.html',
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
	var isInTransition = false;
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
	//点击左上角侧滑图标，打开侧滑菜单；
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
	 * @description 监听回调，本页面通过CustomEvent事件接收获取secretKey
	 */
	window.addEventListener('CustomEvent', function(e) {
		if(e.detail.secretKey) {
			mui.toast("登录成功！");
			console.log("登录成功！");
			console.log("secretKey" + e.detail.secretKey);
			var secretKey = e.detail.secretKey;
			StorageUtil.setStorageItem("secretKey", secretKey);
			//获取secretKey成功之后，应该调用登录接口，获取用户信息
			ajaxLogin(secretKey);
			//应该刷新子页面里面的研习圈内容以及课程类表内容
			//			setTimeout(function() {
			//				WindowUtil.firePageEvent("szpark_homepageV.html", "refreshCircleOrCourseInfoList");
			//			}, 300);
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
		console.log("登录SecretKey参数：" + secretKey);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("登录接口返回数据"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 2);
			console.log("XXXX"+StringUtil.formatJson(response));
			if(response.code == "401" || response.code == 401) {
				//处理未登录
				//LoginUtil.handleNotloggedin(response);
				StorageUtil.removeStorageItem('LoginUrl');
				var LoginUrl = (response.debugInfo.url).replace('RelayState=pc', 'RelayState=mobile');
				StorageUtil.setStorageItem('LoginUrl',LoginUrl);
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
					//重启应用
					if(CommonUtil.os.plus) {
						//手机plus下
//						CommonUtil.plusReady(function() {
//							plus.runtime.restart();
//						});
						//现在通过这一个闸口，判断各种入口
						var TARGET_URL = StorageUtil.getStorageItem("TARGET_URL");
						LoginUtil.OpenWinByPageId(TARGET_URL,null);
					} else {
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
					//StorageUtil.removeStorageItem("secretKey");
					//StorageUtil.removeStorageItem("UserSession");
					plus.runtime.quit();
				}
			}
		}
	};
});