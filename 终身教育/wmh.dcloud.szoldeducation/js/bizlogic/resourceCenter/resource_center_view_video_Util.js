/**
 * 作者: sunzl
 * 时间: 2016-08-29
 * 描述: 处理未登录
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil=require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil=require('core/MobileFrame/StorageUtil.js');
	var DeviceUtil=require('core/MobileFrame/DeviceUtil.js');
	var secretKey = "";
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
	});
	/**
	 * @description 处理：手机+平板+浏览器  课程的点击量(课程的点播点击量+1);因为涉及的页面比较多
	 * @param {Object} course_guid 视频资源课程的唯一标识
	 */
	exports.addCourceClickCounts = function(course_guid) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/upLoadTapNum';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/upLoadTapNum';
		var requestData = {};
		var data = {
			guid: course_guid
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("记录点击播放次数" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				//只是为了让后台计算次数无需返回什么数据
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, "", false);
	};
	/**
	 * @description 获取积分
	 * @param  获取积分参数包括：
	 * @param userId: userId,
	 * @paramu serName: userName,
	 * @param resourceId: selectionsId
	 */
	exports.ajaxAddIntegral = function(data_paras) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/addIntegral';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/addIntegral';
		var requestData = {};
		requestData = JSON.stringify(data_paras);
		console.log("获取积分参数" + requestData);
		console.log("xxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("结果："+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			//console.log("结果2："+JSON.stringify(response));
			if(response.code == 1) {
				UIUtil.toast(response.description);
				if (DeviceUtil.mobile()) {
					WindowUtil.firePageEvent('resource_center_view_video.html', 'refreshChoiceList');
				} else if(DeviceUtil.tablet()){
					WindowUtil.firePageEvent('resource_center_view_video_pad.html', 'refreshChoiceListPad');	
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});