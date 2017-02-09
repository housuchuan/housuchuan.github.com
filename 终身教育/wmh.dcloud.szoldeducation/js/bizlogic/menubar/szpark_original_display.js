/**
 * 描述 : 负责对原创展示界面的操作
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	//加载窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var pullToRefreshObject;
	//导航标题
	var title = "视频";
	//列表总记录数
	var totalNumCount = 0;
	//每页显示条数
	var PageSize = 10;
	var secretKey = "";
	var userId = "";
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		};
		Zepto('.zhezhao').css('display', 'block');
		//初始化下拉刷新
		initPullRefreshList();
	});
	//发表话题回复内容tab切换
	Zepto('.column').on('tap', '.TA-common', function() {
		Zepto(this).addClass('items-active').siblings().removeClass('items-active');
		title = Zepto(this).text();
		Zepto('.zhezhao').css('display', 'block');
		UIUtil.showWaiting();
		switch(title) {
			case "视频":
				break;
			case "日志":
				break;
		};
		pullToRefreshObject.refresh();
	});

	//定义下拉刷新函数
	function initPullRefreshList() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				tempArray = response.data;
				if(title == "视频") {
					mui.each(tempArray, function(key, value) {
						value.image = unescape(value.image);
						value.videoName = unescape(value.videoName);
					});
				} else if(title == "日志") {
					mui.each(tempArray, function(key, value) {
						value.title = unescape(value.title);
					});
				}
				totalNumCount = response.totalCount;
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
		/*
		 * @description 列表点击事件
		 */

		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'menubar/orginalDiplay/getVedioList';
			var url = config.JServerUrl + 'menubar/orginalDiplay/getVedioList';
			if(title == "视频") {
				//url = config.MockServerUrl + 'menubar/orginalDiplay/getVedioList';
				var url = config.JServerUrl + 'menubar/orginalDiplay/getVedioList';
			} else if(title == "日志") {
				//url = config.MockServerUrl + 'menubar/orginalDiplay/logList';
				var url = config.JServerUrl + 'menubar/orginalDiplay/logList';
			}
			return url;
		};

		//映射模板
		var getLitemplate = function() {
			var litemplate = '<li id="{{id}}"class="mui-table-view-cell"><span class="uuId" id="{{uuId}}"></span><span class="vuId"id="{{vuId}}"></span><div class="mui-slider-handle clearfix"><img data-img-localcache="{{image}}"/><h4 class="mui-ellipsis-2">{{videoName}}</h4></div></li>';
			if(title == "视频") {
				litemplate = '<li id="{{id}}"class="mui-table-view-cell"><span class="uuId" id="{{uuId}}"></span><span class="vuId"id="{{vuId}}"></span><div class="mui-slider-handle clearfix"><img data-img-localcache="{{image}}"/><h4 class="mui-ellipsis-2">{{videoName}}</h4></div></li>';
			} else if(title == "日志") {
				litemplate = '<li class="mui-table-view-cell" id="{{logId}}"><span>{{title}}</span><span>{{date}}</span></li>';
			}
			return litemplate;
		};

		var onItemClickCallbackFunc = function(e) {
			var id = this.id;
			if(title == "视频") {
				var uuId = Zepto(this).find('.uuId').attr('id');
				var vuId = Zepto(this).find('.vuId').attr('id');
				WindowUtil.createWin("szpark_original_display_videoPlayer.html", "szpark_original_display_videoPlayer.html", {
					//页面跳转传参
					resourceId: id,
					uuId: uuId,
					vuId: vuId
				});
			} else if(title == "日志") {
				WindowUtil.createWin("szpark_log_display.html", "szpark_log_display.html", {
					//页面跳转传参
					logId: id
				});
			}
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			Zepto('.zhezhao').css('display', 'none');
			UIUtil.closeWaiting();
			if(title == "视频") {
				ImageLoaderFactory.lazyLoadAllImg(true);
			};
		};

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
			//console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};
})