/**
 * 描述 :我的计划详情界面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-08-12 17:13:41
 */

define(function(require, exports, module) {
	"use strict";
	//引入相应工具类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var planId;
	var secretKey = '',
		userId = '',
		userName = '';
	//var secretKey = config.secretKey;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem('secretKey');
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		};
		if(userSession.userName) {
			userName = userSession.userName;
		};
		planId = WindowUtil.getExtraDataByKey("planId");
		//获取计划详情信息
		getDetailInfo();
	}

	Zepto('button[type=button]').on('tap', function() {
		delstePlan();
	});

	/**
	 * @description 获取计划详情数据
	 */
	function getDetailInfo() {
		//var url = config.MockServerUrl + 'mystudy/detailInfo';
		var url = config.JServerUrl + 'mystudy/detailInfo';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			studyPlanningId: planId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		console.log("xxxxxxxxxxxxxxxxx"+url);
		console.log("xxxxxxxxxxxxxxxxxxxxx"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				var tempInfo = response.data;
				Zepto('h4').text(unescape(tempInfo.studyPlanningTitle));
				Zepto('p').text(unescape(tempInfo.studyPlanningContent));
				Zepto('.startTime').text(timeTransForm(unescape(tempInfo.startTime)));
				Zepto('.endTime').text(timeTransForm(unescape(tempInfo.endTime)));
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	
	//将时间转化为年月日形式
	function timeTransForm(time){
		var newDate = '';
		var data = new Date(time);
		var seconds = data.getTime();
		var date2 = new Date(seconds);
		var year = date2.getFullYear(),
		month = date2.getMonth(),
		day = date2.getDate();
		if(parseInt(month) < 10){
			month = '0'+parseFloat(month);
		}else if(parseInt(day) < 10){
			day = '0'+parseFloat(day);
		};
		newDate = year+'/'+month+'/'+day;
		return newDate;
	};

	/**
	 * @description commonutil.ajax请求数据
	 */
	function delstePlan() {
		var url = config.JServerUrl + 'mystudy/studyPlanningDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			noteList: planId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxx" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			//console.log("xxxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			if(response.code == 1) {
				UIUtil.closeWaiting();
				UIUtil.toast(response.description);
				WindowUtil.firePageEvent('szpark_study_planning_list.html', 'refreshList');
				mui.back();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});