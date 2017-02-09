/**
 * 描述 :个人中心(年鉴) 
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-07-26 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var Tools = require('bizlogic/menubar/szpark_yearbook_listUtil.js');
	var currpage = 1;
	var PageSize = 10;
	var TotalNumCount = 0;
	var secretKey = "";
	var userId = "";

	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		ajaxYearbookData();
	});
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//这个下拉刷新不需要请求接口
		mIsRequestFirst: false,
		IsRendLitemplateAuto: false,
		refreshCallback: function() {
			//下拉刷新 重新请求数据
			ajaxYearbookData();
		},
		pullUpLoadType: 'none',
	});
	/**
	 * @description 请求年鉴列表数据
	 */
	function ajaxYearbookData() {
		//var url = config.MockServerUrl + 'mobile/space/almanac/getYearBooksList';
		//var url = config.JServerUrl + 'mobile/space/almanac/getYearBooksList';
		var url = 'http://221.224.167.154:8099/szedu_v1.0.0/mobile/space/almanac/modelgetYearBooksList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			pageIndex: currpage,
			pageSize: PageSize
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("打印参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("年鉴列表数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			//console.log("年鉴列表数据：" + JSON.stringify(response));
			if(response.code == '1') {
				var tmpInfo = response.data;
				mui.each(tmpInfo,function(key,value){
					value.year = value.year + '年';
					if(value.monthList){
						mui.each(value.monthList,function(key,value){
							console.log("xxxx"+JSON.stringify(value));
							value.month = value.month + '月';
						});
					}
				});
				console.log("xxxxxxxxxxxxxxxx"+JSON.stringify(tmpInfo));
				var html = Tools.generateYearBookListHtml(tmpInfo);
				Zepto("#listdata").html('');
				Zepto("#listdata").append(html);
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});