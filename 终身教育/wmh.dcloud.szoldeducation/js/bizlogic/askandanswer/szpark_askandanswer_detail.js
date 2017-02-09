/**
 * 描述 :你问我答详情页 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-11 16:16:53
 */
define(function(require, exports, module) {
	"use strict";
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var url = config.ServerUrl + "answerdetails";

	var HistoryGuid = null;
	var BoxGuid = null;
	//初始化页面
	CommonUtil.initReady(function() {
		HistoryGuid = WindowUtil.getExtraDataByKey("HistoryGuid");
		BoxGuid = WindowUtil.getExtraDataByKey("BoxGuid");
		//console.log("HistoryGuid:   " + HistoryGuid);
		//console.log("BoxGuid:    " + BoxGuid);
		ajaxDetailData();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			historyguid: HistoryGuid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		//console.log(JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea.AnswerDetails;
				tmpInfo.PostContent = unescape(tmpInfo.PostContent);
				tmpInfo.ReplyContent = unescape(tmpInfo.ReplyContent);
				var litemplate = '<div class="ask-container"><span class="ask-title">咨询内容:</span><span class="ask-content">{{PostContent}}</span></div><div class="answer-container"><span class="answer-title">官方回复:</span><span class="answer-content">{{ReplyContent}}</span></div>'
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto("#content").append(output);
			}
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
	Zepto('#btn-askQuestion').on('tap', function() {
		WindowUtil.createWin('szpark_askandanswer_submit.html', 'szpark_askandanswer_submit.html', {
			BoxGuid: BoxGuid
		});
	});
});