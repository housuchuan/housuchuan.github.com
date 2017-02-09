/**
 * 描述 :原创展示ipad版本页面功能交互 
 * 作者 :housc
 * 版本 :1.0
 * 时间 :2016-07-06 15:17:49
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var category = "001";
	var PageSize = 10;
	var totalNumCount = 0;
	var secretKey = '',
		userId = '';
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		};
		//初始化
		initListener();
	}

	//设置监听
	function initListener() {
		//初始化原创展示资源
		initPullRefreshOriginal();
		//初始化区域滚动
		mui(".tab-content-wrapper").scroll({
			indicators: true, //是否显示滚动条
		});
	}

	//tab切换
	Zepto('.tab-content').on('tap', 'div', function() {
		Zepto(this).addClass('tab-item-style').siblings().removeClass('tab-item-style');
		var titleText = Zepto(this).text();
		//console.log(titleText);
		switch(titleText) {
			case '视频':
				category = "001";
				pullToRefreshObject.refresh();
				//Zepto('#listdata').append('<div><img src="../../img/menubar/img-menubar.jpg" /><span class="title-program mui-ellipsis">初三数学</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></div>');
				break;
			case '文档':
				category = "002";
				pullToRefreshObject.refresh();
				//Zepto('.message-block').html('<div><img src="../../img/menubar/img-menubar.jpg" /><span class="title-program mui-ellipsis">初三数学、语文、外语、物理、化学</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></div>');
				break;
		}
	});

	//初始化原创展示
	function initPullRefreshOriginal() {
		var getUrl = function() {
			var url = config.JServerUrl + 'menubar/orginalDiplay/getVedioList';
			if(category == "001") {
				url = config.JServerUrl + 'menubar/orginalDiplay/getVedioList';
			} else if(category == "002") {
				url = config.JServerUrl + 'menubar/orginalDiplay/logList';
			};
			console.log("xxxxxxxxxxxxxx" + url);
			return url;
		};

		//下拉刷新
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//			console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					value.image = unescape(value.image);
					if(category == "001") {
						value.videoName = unescape(value.videoName);
					}
				});
				totalNumCount = response.totalCount;
			};
			return tempArray;
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			var id = this.id;
			if(category == "001") {
				var uuId = Zepto(this).find('.uuId').attr('id');
				var vuId = Zepto(this).find('.vuId').attr('id');
				WindowUtil.createWin("szpark_original_display_videoPlayer_pad.html", "szpark_original_display_videoPlayer_pad.html", {
					//页面跳转传参
					resourceId: id,
					uuId: uuId,
					vuId: vuId
				});
			} else if(category == "002") {
				WindowUtil.createWin("szpark_log_display.html", "../../menubar/szpark_log_display.html", {
					//页面跳转传参
					logId: id
				});
			}
		};

		var getLitemplate = function() {
			var litemplate = '<div id="{{id}}"><span class="uuId" id="{{uuId}}"></span><span class="vuId"id="{{vuId}}"></span><img data-img-localcache="{{image}}"/><span class="title-program mui-ellipsis">{{videoName}}</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></div>';
			if(category == "001") {
				litemplate = '<div id="{{id}}"><span class="uuId" id="{{uuId}}"></span><span class="vuId"id="{{vuId}}"></span><img data-img-localcache="{{image}}"/><span class="title-program mui-ellipsis">{{videoName}}</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></div>';
			} else if(category == "002") {
				litemplate = '<div id="{{logId}}"><img data-img-localcache="{{image}}"/><span class="title-program mui-ellipsis">{{date}}</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">开始观看</span></div></div>';
			}
			return litemplate;
		};

		/*
		 * @description 初始化下拉刷新控件（有皮肤）
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
				targetListItemClickStr: 'div',
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
			skin: 'type1'
		}, function(pullToRefresh) {
			console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};

});