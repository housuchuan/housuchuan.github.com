/**
 * 描述 :教育关工委-通知公告detail
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 16:51:38
 */
define(function(require, exports, module) {
	"use strict"
	var url = config.ServerUrl + "GetInfoDetail";
	//引入窗体模块
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var HtmlUtil=require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//新闻公告信息唯一GUID
	var InfoID = null;
	//信息栏目编号
	var CateNum = null;
	CommonUtil.initReady(function() {
		InfoID = WindowUtil.getExtraDataByKey("InfoID");
		CateNum = WindowUtil.getExtraDataByKey("CateNum");
		var Title=WindowUtil.getExtraDataByKey("Title");
		//console.log("Ttile"+Title);alert(Title);
		Zepto(".mui-title").text(Title);
		
		ajaxDetailData();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			InfoID: InfoID,
			CateNum: CateNum,
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		}
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
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title);
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				var litemplate = '<div class="title">{{title}}</div><div class="time"><span>{{infodate}}</span>&nbsp;|&nbsp;来源:<span>{{infoZhuanZai}}</span></div><div id="txt">{{infocontent}}</div>';
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto("#content").append(output);
				Zepto("#txt").text('');
				Zepto("#txt").append(tmpInfo.infocontent);
			}
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
});