/**
 * 描述 : 积分排行
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-10-26 12:34:48
 */

define(function(require, exports, module) {
	"use strict";
	//引入相应工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var secretKey = '';
	var dateTime = '';
	var PageSize = 10;
	var beginIndex = 0;
	var currpage = 0;
	var totalNumCount = 0;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//获取相应信息
		secretKey = StorageUtil.getStorageItem('secretKey');
		var year = WindowUtil.getExtraDataByKey('year');
		var month = WindowUtil.getExtraDataByKey('month');
		if(month <= 9) {
			month = '0' + month;
			dateTime = (year + '-' + month);
		} else {
			dateTime = (year + '-' + month);
		}
		//初始化积分列表
		initPullRefreshIntegralList();
	};

	//定义积分排行下拉刷新函数
	function initPullRefreshIntegralList() {
		var getLitemplate = function() {
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell clearfix"><div><span>{{index}}</span><span>{{name}}</span></div><div>{{integral}}</div></li>';
			return litemplate;
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + 'menubar/integralRankingsList';
			var url = config.JServerUrl + 'menubar/integralRankingsList';
			console.log('url:' + url);
			return url;
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			beginIndex = CurrPage * PageSize;
			currpage = CurrPage;
			var requestData = {};
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				dateTime: dateTime
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
		function changeResponseDataFunc(response) {
			console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				if(currpage == 1) {
					mui.each(tempArray, function(key, value) {
						if(key < 9) {
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
				totalNumCount = response.totalCount;
			}
			return tempArray;
		}

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		function changeToltalCountFunc() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		function successCallbackFunc(response) {
			console.log("成功请求数据：" + JSON.stringify(response));
		};

		/*
		 * @description 列表点击事件
		 */
		function onItemClickCallbackFunc(e) {

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
});