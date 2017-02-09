/**
 * 描述 :积分记录页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-21 17:11:49
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
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
		}
		if(userSession.userName) {
			userName = userSession.userName;
		};
		//获取详情信息
		ajaxDetailData();
		//初始化下拉刷新
		initPullRefreshList();
	}

	/**
	 * @description兑换记录详情 
	 */
	function ajaxDetailData() {
		//var url = config.MockServerUrl + "mystudy/exchangeRecordInfo";
		var url = config.JServerUrl + "mystudy/exchangeRecordInfo";
		var requestData = {
			userId: userId
		};
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log(JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var litemplate = '<div class="topLayerItem"><h5>我的总积分</h5><h4>{{allIntegral}}</h4></div><div class="topLayerItem"><h5>剩余积分</h5><h4>{{restIntegral}}</h4></div>';
				var tmpInfo = response.data;
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.topLayer').html('');
				Zepto('.topLayer').append(output);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	/**
	 * 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var getLitemplate = function() {
			var litemplate = '<li id={{id}} class="mui-table-view-cell"><span>{{listIndex}}</span><div class="part center_part"><span>{{exchangeArticlesName}}</span><p>{{time}}</p></div><div class="part afer_part">{{wasteIntegral}}</div></li>';
			return litemplate;
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			//动态校验字段
			var requestData = {
				userId: userId,
				pageIndex: CurrPage,
				pageSize: PageSize
			};
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
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == '1') {
				tempArray = response.data;
				if(tempArray) {
					mui.each(tempArray, function(key, value) {
						if(key < 9) {
							value.listIndex = '0' + (key + 1);
						} else {
							value.listIndex = (key + 1);
						}
					})
				};
				totalNumCount = response.TotalNumCount;
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
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var getURL = function() {
			//var url = config.MockServerUrl + 'mystudy/exchangeRecordList';
			var url = config.JServerUrl + "mystudy/exchangeRecordList";
			return url;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			if(!response) {
				Zepto('#listdata').html("<div class='liubai'>暂无数据</div>");
			}
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
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		}, function(pullToRefresh) {
			pullToRefreshObject = pullToRefresh;
		});
	};
});