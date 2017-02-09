/**
 * 作者：dailc 
 * 时间：2016-04-07 10:25:38
 * 描述： 家长问答详情 
 */
define(function(require, exports, module) {
	"use strict";
	var url = config.ServerUrl + "answerdetails";
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var HistoryGuid = null;
	var BoxGuid = null;
	CommonUtil.initReady(function() {
		HistoryGuid = WindowUtil.getExtraDataByKey("HistoryGuid");
		BoxGuid = WindowUtil.getExtraDataByKey("BoxGuid");
		console.log("HistoryGuid:   " + HistoryGuid);
		console.log("BoxGuid:    " + BoxGuid);
		ajaxDetailData();
	});
	Zepto('#btn-askQuestion').on('tap', function() {
		WindowUtil.createWin('szpark_parentAskAnswer_submit.html', 'szpark_parentAskAnswer_submit.html', {
			BoxGuid: BoxGuid
		});
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			historyguid: HistoryGuid
		}
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
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
		console.log(JSON.stringify(response));
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
});