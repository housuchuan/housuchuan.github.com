/**
 * 描述 : 日志页面交互
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	//标题
	var title = "";
	//日志类型，类别：0：全部 1：公开 2：私密
	var logType = 1;
	var secretKey = "";
	var userId = "";

	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
		}
		initLogPullRefresh();
	});
	//tab切换
	Zepto('.log-style').on('tap', 'div', function() {
		Zepto(this).addClass('log-active').siblings().removeClass('log-active');
		title = this.innerText;
		switch(title) {
			case "公开日志":
				logType = 1;
				break;
			case "保密日志":
				logType = 2;
				break;
		}
		WindowUtil.firePageEvent("szpark_log_list.html", "refreshListPage");
	});

	//初始化日主下拉刷新
	function initLogPullRefresh() {
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
				userId: userId,
				kind: logType
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('日志请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == '1') {
				console.log("日志列表数据 ：\n" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					//去除富文本htm标签以及nbsp;
					value.title = unescape(value.title);
					value.content = unescape(value.content);
					value.content = StringUtil.removeHtmlTag(value.content);
				});
			}
			return tempArray;
		};

		//获取日志模板
		var getLitemplate = function() {
			var litemplate = '<li id="{{logId}}" class="mui-table-view-cell"><div class="mui-slider-right mui-disabled"><!--<a class="mui-btn mui-btn-yellow mui-icon top">置顶</a>--><a class="mui-btn mui-btn-red mui-icon delete ">删除</a></div><div class="mui-slider-handle clearfix"><!--<img src={{logImage}}}/>--><h4>{{title}}</h4><p class="mui-ellipsis-2 log-news">{{content}}</p></div></li>';
			return litemplate;
		};
		//请求接口地址
		var getUrl = function() {
				//var url = config.MockServerUrl + "mobile/space/log/logList";
				var url = config.JServerUrl + "mobile/space/log/logList";
				//console.log("接口地址：" + url);
				return url;
			}
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
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			//不知道为什么点击事件放在这里面不起作用，找不到class top delete,直接放到外面
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

	//置顶、删除
	Zepto("#listdata").on('tap', 'li', function(e) {
		var logId = this.id;
		if(Zepto(e.target).hasClass('delete')) {
			UIUtil.confirm({
				content: '您确认要删除吗？',
				title: '提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					//删除操作
					deleteLog(logId);
				}
			});

		} else {
			WindowUtil.createWin('szpark_log_display.html', 'szpark_log_display.html', {
				logId: logId,
				hideType: 1    //隐藏日志展示中
			});
		}
	})

	//新增日志
	Zepto('#add-log').on('tap', function() {
		WindowUtil.createWin('szpark_add_log.html', 'szpark_add_log.html', {
			userId: userId
		});
	});

	//删除操作
	function deleteLog(logId) {
		var url = config.JServerUrl + "mobile/space/log/delete";
		var requestData = {};
		var data = {
			noteList: logId
		};
		requestData = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("请求参数： " + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			//console.log(JSON.stringify(response));
			if(response.code == '1') {
				mui.alert(response.description);
				WindowUtil.firePageEvent("szpark_log_list.html", "refreshListPage");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	}

});