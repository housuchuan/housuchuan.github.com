/**
 * 描述 :学习排名 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-30 11:08:31
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId = "";
	var userName = "";
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		};
		if(userSession.userName) {
			userName = userSession.userName;
		};
		//获取详情
		ajaxDetailData();
		//刷新列表
		initPullRefreshList();
	}
	/**
	 *@description学习排名详情 
	 */
	function ajaxDetailData() {
		//var url = config.MockServerUrl + "mystudy/learningRankingsInfo";
		var url = config.JServerUrl + "mystudy/learningRankingsInfo";
		var requestData = {
			userId: userId
		};
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var litemplate = '<div class="topLayerItem"><h5>我的排名</h5><h4>{{myRanking}}</h4></div><div class="topLayerItem"><h5>我的积分</h5><h4>{{myIntegral}}</h4></div>';
				var tmpInfo = response.data;
				Zepto('.topLayer').html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.topLayer').append(output);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	/**
	 * @description学习排名列表信息
	 */
	function initPullRefreshList() {
		var getLitemplate = function() {
			var litemplate = '<li id={{id}} class="mui-table-view-cell clearfix"><div><span>{{number}}</span><span>{{name}}</span></div><div>{{integral}}</div></li>';
			return litemplate;
		};
		var getURL = function() {
			//var url = config.MockServerUrl + "mystudy/learningRankingsList";
			var url = config.JServerUrl + "mystudy/learningRankingsList";
			return url;
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {
				pageIndex: CurrPage,
				pageSize: PageSize
			};
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url_list:' + url_list);
			//console.log('请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			//console.log("AAAA改变数据 ：" + JSON.stringify(response));
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == '1') {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(key < 9) {
						value.number = "0" + (key + 1);
					} else {
						value.number = (key + 1);
					}

				});
			}
			return tempArray;
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function(response) {
			//console.log(JSON.stringify(response));
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

		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getURL,
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
			skin: 'type0'
		}, function(pullToRefresh) {
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};
});