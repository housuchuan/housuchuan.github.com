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
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var beginIndex = 0;
	var currpage = 0;
	var secretKey = "";
	//var secretKey = config.secretKey
	var userId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		//加载基础信息
		var userSession = StorageUtil.getStorageItem("UserSession");
		secretKey = StorageUtil.getStorageItem("secretKey");
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		//刷新数据
		initPullRefreshList();
	});

	/**
	 * @description积分记录详情 
	 */
	function ajaxDetailData() {
		//var url = config.MockServerUrl + "mystudy/exchangeRecordInfo";
		var url = config.JServerUrl + "mystudy/exchangeRecordInfo";
		var requestData = {
			userId: userId
		};
		requestData = JSON.stringify(requestData);
		//console.log("xxxxxxxxxxxxxxxxxxxxx" + requestData);
		//console.log("xxxx" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("xxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				//console.log("xxxxxxxxxxxxxxxxxxxxxxxxx" + response);
				Zepto('.topLayer').html('');
				var litemplate = '<div class="topLayerItem"><h5>我的总积分</h5><h4>{{allIntegral}}</h4></div><div class="topLayerItem"><h5>剩余积分</h5><h4>{{restIntegral}}</h4></div>';
				var tmpInfo = response.data;
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.topLayer').append(output);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//刷新列表数据
	function initPullRefreshList() {
		//接口请求参数
		var getData = function(CurrPage) {
			currpage = CurrPage;
			beginIndex = CurrPage * PageSize;
			var requestData = {
				userId: userId,
				pageSize: PageSize,
				pageIndex: CurrPage
			};
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};

		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//console.log("改变数据 ：\n" + unescape(JSON.stringify(response)));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				tempArray = response.data;
				totalNumCount = response.totalCount;
				if(currpage == 1) {
					mui.each(tempArray, function(key, value) {
						if(key < 9) {
							console.log(" =========1");
							value.index = "0" + (key + 1);
						} else {
							value.index = (key + 1);
						}
					});
				} else {
					mui.each(tempArray, function(key, value) {
						if(key < 9) {
							value.index = (currpage - 1) * PageSize + (key + 1);
						} else {
							value.index = ((currpage - 1) * PageSize + key + 1);
						}
					});
				};
			}
			//console.log(tempArray.length);
			return tempArray;
		};

		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc = function() {
			console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + 'mystudy/integralRecordList';
			var url = config.JServerUrl + 'mystudy/integralRecordList';
			return url;
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell"><span>{{index}}</span><div class="part center_part"><span>{{name}}</span><p>{{time}}</p></div><div class="part afer_part">{{integral}}</div></li>';
			return litemplate
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			if(!response) {
				Zepto('#listdata').html("<div class='liubai'>暂无数据</div>");
			};
			//获取积分记录详情，该接口与交换积分公用一个接口
			ajaxDetailData();
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {

		};

		//初始化下拉刷新控件
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
		});
	};
});