/**
 * 
 * 作者：孙尊路
 * 时间：2016-04-05
 * 描述：学员风采子页面
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//学员风采预览封装
	var GenerateImagevierHtmlUtil = require('bizlogic/common/common_xyfc_imagevier.js');
	CommonUtil.initReady(function() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll();
		ajaxDetailData();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		//var url = config.ServerUrl + "olderpiclist";
		var url = config.ServerUrl + "OlderPicAll";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
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
		UIUtil.closeWaiting();
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				//console.log(StringUtil.formatJson(InfoArray));
				var html = GenerateImagevierHtmlUtil.generateHtml_szpark_xyfclist(InfoArray);
				Zepto("#listdata").html('');
				Zepto("#listdata").append(html);
				//预览图片
				mui.previewImage();
			}
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
});