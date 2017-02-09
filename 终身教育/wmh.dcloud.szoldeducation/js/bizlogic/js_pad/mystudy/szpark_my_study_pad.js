/**
 * 描述 :我的学习子页面
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-08-01 09:12:00
 */
define(function(require, exports, module) {
	"use strict"
	//加载窗体模块
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var ToggleMenuUtil = require('bizlogic/common/common_initToggleMenu.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var title = '点播';
	var secretKey = '',
		type = 0;
	//var secretKey = config.secretKey
	var userId;
	var userName;
	CommonUtil.initReady(initData);

	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		//初始化下拉刷新
		initPullRefresh();
		//直播点播tab切换
		Zepto('.column').on('tap', 'span', function() {
			title = Zepto(this).text();
			if (title == '点播') {
				type = 0;
			} else if(title == '直播'){
				type = 1;
			};
			Zepto(this).addClass('items-active');
			Zepto(this).siblings().removeClass('items-active');
			pullToRefreshObject.refresh();
			//快速回滚到该区域顶部
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		});
		//ToggleMenuUtil.initToggleMenu("menu-btn");
	}
	/**
	 *我的学习菜单 
	 */
	Zepto(".study").on('tap', function() {
		var menuItem = Zepto(this).find("span")[0].innerText;
		switch(menuItem) {
			case "我的课程":
				//ToggleMenuUtil.menu_close();
				pullToRefreshObject.refresh();
				break;
			case "我的笔记":
				WindowUtil.createWin("szpark_my_note.html", "../../mystudy/szpark_my_note.html");
				break;
			case "我的活动":
				WindowUtil.createWin("szpark_my_activities_list.html", "../../mystudy/szpark_my_activities_list.html");
				break;
			case "播放记录":
				WindowUtil.createWin("szpark_playrecord_list.html", "../../mystudy/szpark_playrecord_list.html");
				break;
			case "积分记录":
				WindowUtil.createWin("szpark_integral_record_list.html", "../../mystudy/szpark_integral_record_list.html");
				break;
			case "我的视频":
				WindowUtil.createWin("szpark_my_video.html", "../../mystudy/szpark_my_video.html");
				break;
			case "学习计划":
				WindowUtil.createWin("szpark_study_planning_list.html", "../../mystudy/szpark_study_planning_list.html");
				break;
			case "学习排名":
				WindowUtil.createWin("szpark_learning_ranking_list.html", "../../mystudy/szpark_learning_ranking_list.html");
				break;
			case "学习档案":
				WindowUtil.createWin("szpark_learning_files.html", "../../mystudy/szpark_learning_files.html");
				break;
			case "兑换记录":
				WindowUtil.createWin("szpark_exchange_record_list.html", "../../mystudy/szpark_exchange_record_list.html");
				break;
			default:
				break;
		}
	});

	function initPullRefresh() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				userId: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			console.log("xxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				tempArray = response.data;
				totalNumCount = response.totalCount;
				if(title == '直播') {
					mui.each(tempArray, function(key, value) {
						if(value.image == '' || value.image == null) {
							value.image = '../../img/MobileFrame/img_error.jpg';
						} else {
							value.image = unescape(value.image);
						}
					});
				} else {
					mui.each(tempArray, function(key, value) {
						if(value.image == '' || value.image == null) {
							value.image = '../../img/MobileFrame/img_error.jpg';
						} else {
							value.image = unescape(value.image);
						};
					});
				}
			}
			return tempArray;
		};
		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '';
			//默认视频列表映射模板
			if(title == '点播') {
				litemplate = '<li id="{{id}}"><img data-img-localcache="{{image}}"/><span class="title-program mui-ellipsis">{{cName}}</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始学习</span></div><button type="button" class="mui-btn">删除</button></li>';
			} else if(title == '直播') {
				litemplate = '<li id="{{id}}"><span id="{{activityId}}"></span><img data-img-localcache="{{image}}"/><span class="title-program mui-ellipsis">{{cName}}</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">观看直播</span></div><button type="button" class="mui-btn">删除</button></li>';
			}
			return litemplate;
			//var litemplate = '<li><img src="../../../img/menubar/img-menubar.jpg"/><span class="title-program mui-ellipsis">冶金技术冶金技术冶金技术的发展</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></li>';
			//return litemplate
		};

		var getUrl = function() {
			var url = '';
			if(title == '点播') {
				//url = config.MockServerUrl + "mystudy/mycourse";
				url = config.JServerUrl + "mystudy/mycourse";
			} else if(title == '直播') {
				//url = config.MockServerUrl + "mystudy/mycourceBroadcast";
				url = config.JServerUrl + "mystudy/mycourceBroadcast";
			};
			//console.log("url"+url);
			return url;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			var itemsId = this.id;
			//console.log("xxxxxxxxxxxxxxxxxxxx"+itemsId);
			if(Zepto(e.target).text() == '删除'){
				UIUtil.confirm({
					content: '您确认要删除吗？',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						deleteCourse(itemsId);
					}
				});
			}else{
				if(title == '直播') {
				WindowUtil.createWin("resource_center_live_page_parent_pad.html", "../resourceCenter/resource_center_live_page_parent_pad.html", {
					itemId: itemsId,
					//activityId: Zepto(this).find('span').attr('id'),
					type: 1
				});
			} else if(title == '点播') {
				WindowUtil.createWin("../resourceCenter/resource_center_view_video_pad.html", "../resourceCenter/resource_center_view_video_pad.html", {
					itemsId: itemsId,
					type: 0
				});
			}
			};
		};

		/*
		 * @description 初始化下拉刷新控件
		 */
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				itemClickCallback: onItemClickCallbackFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc,
				ajaxSetting: {
					//默认的contentType
					contentType: "application/json",
					headers: {
						"X-SecretKey": secretKey
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		}, function(pullToRefresh) {
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};


	/**
	 * @description commonutil.ajax请求数据
	 */
	function deleteCourse(itemsId) {
		//var url = config.MockServerUrl + 'mystudy/mycourceDelete';
		var url = config.JServerUrl + 'mystudy/deletecourse';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			courseId: itemsId,
			type: type
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxxxx"+requestData);
		console.log("xxxxxxxxxxxxxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});