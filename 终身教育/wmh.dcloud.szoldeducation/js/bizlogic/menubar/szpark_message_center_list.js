/**
 * 描述 :我的消息-子页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-20 09:25:58
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//下拉刷新工具类
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	//每页显示条数
	var PageSize = 15;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = "",
		userId = '',
		newsId = '';

	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
		};
		//初始化消息列表数据
		initNewsList();
	});

	function initNewsList() {
		//currPage 列表模版界面传进来的当前页参数
		var getData = function(CurrPage) {
				var requestData = {};
				var data = {
					userId: 19,
					pageIndex: CurrPage,
					pageSize: PageSize
				};
				requestData = data;
				//某一些接口是要求参数为字符串的 
				requestData = JSON.stringify(requestData);
				//console.log('url:' + url);
				console.log('请求参数' + requestData);
				return requestData;
			}
			/**
			 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
			 * @param {Object} response Json数组
			 */
		var changeResponseDataFunc = function(response) {
				//定义临时数组
				var tempArray = [];
				var response = CommonUtil.handleStandardResponse(response, 1);
				if(response.code == 1) {
					console.log("改变数据 ：" + JSON.stringify(response));
					tempArray = response.data;
					totalNumCount = response.totalCount;
					mui.each(tempArray, function(key, value) {
						value.msgType = unescape(value.msgType);
						if(value.msgType == 1) {
							value.msgType = '我的话题';
						} else {
							value.msgType = '我的计划';
						}
						value.title = unescape(value.title);
						value.topicName = unescape(value.topicName);
					});
					console.log("消息列表数据" + JSON.stringify(tempArray));
				}
				return tempArray;
			}
			/**
			 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
			 */
		var changeToltalCountFunc = function() {
				//console.log("总记录数：" + totalNumCount);
				return totalNumCount;
			}
			/**
			 * @description 成功回调
			 * @param {Object} response
			 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			//消息id
			var planId = Zepto(this).find('.relationId').attr('id');
			var MsgText = Zepto(this).find('.msgType').text();
			console.log("xxxxxxxxxxxxxxxxxx" + MsgText);
			if(MsgText == '【我的计划】') {
				WindowUtil.createWin("szpark_study_planning_detailInfo.html", "../mystudy/szpark_study_planning_detailInfo.html", {
					planId: planId
				});
			} else if(MsgText == '【我的话题】') {
				WindowUtil.createWin("szpark_circle_dynamics_details.html", "../studycircle/szpark_circle_dynamics_details.html", {
					topicId: planId,
					topicName: Zepto(this).find('.topicName').text(),
					circleId: Zepto(this).find('.circleId').attr('id')
				});
			};
		};

		//映射模板
		var getLitemplate = function() {
			var litemplate = '<li class="mui-table-view-cell mui-media"id="{{id}}"><span class="circleId" id="{{circleId}}"></span><span class="topicName" style="display:none">{{topicName}}</span><span class="relationId" id="{{relationId}}"></span><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red mui-icon ">删除</a></div><div class="mui-slider-handle clearfix"><div class="mui-media-body"><h5 class="mui-ellipsis"><span class="msgType">【{{msgType}}】</span>{{title}}</h5></div></div></li>';
			return litemplate;
		};
		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + "menubar/getMsgList";
			var url = config.JServerUrl + 'menubar/getMsgList';
			return url;
		};
		/*
		 * @description 初始化下拉刷新控件
		 */
		PullrefreshUtil.initPullDownRefresh({
			//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
			IsDebug: true,
			//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			mDefaultInitPageNum: 1,
			mGetLitemplate: getLitemplate,
			mGetUrl: getUrl,
			mGetRequestDataFunc: getData,
			mChangeResponseDataFunc: changeResponseDataFunc,
			mChangeToltalCountFunc: changeToltalCountFunc,
			mRequestSuccessCallbackFunc: successCallbackFunc,
			mOnItemClickCallbackFunc: onItemClickCallbackFunc,
			mGetDataOffLineFunc: null,
			ajaxSetting: {
				accepts: {
					json: "application/json;charset=utf-8"
				},
				contentType: "application/json",
				headers: {
					"X-SecretKey": secretKey
				}
			}
		});
	};

	//删除消息点击操作
	Zepto('.mui-table-view').on('tap', 'li .mui-btn-red', function() {
		newsId = Zepto(this).parents('li').attr('id');
		deleteMyInfo();
	});

	//删除相应的消息
	/**
	 * @description 删除我的消息
	 */
	function deleteMyInfo() {
		//var url = config.MockServerUrl + 'menubar/msgDelete';
		var url = config.JServerUrl + 'menubar/msgDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			newsId: newsId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("删除消息请求参数" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				WindowUtil.firePageEvent("szpark_message_center_list.html", "refreshListPage");
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});