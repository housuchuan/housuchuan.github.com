/**
 * 作者：孙尊路
 * 时间：2016-05-17
 * 描述：学员风采子页面 pad js  第二种图片预览方式
 */
define(function(require, exports, module) {
	"use strict"
	//原来的列表接口
	//	var url = config.ServerUrl + "olderpiclist";
	var url = config.ServerUrl + "OlderPicAll";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//学员风采预览封装
	var GenerateImagevierHtmlUtil = require('bizlogic/common/common_xyfc_imagevier.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll();
		ajaxPhotoData();
	}
	/**
	 * @description 请求详情数据
	 */
	function ajaxPhotoData() {
		var url = config.ServerUrl + "OlderPicAll";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("传参：" + requestData);
		console.log("url：" + url);
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
		//console.log("相册数据："+JSON.stringify(response));
		UIUtil.closeWaiting();
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				console.log("相册数据：" + JSON.stringify(InfoArray));
				//测试数据
				var InfoArrayTestData = {
					ChannelGuid: "b724199a-c23f-4dfb-9c13-38b4989888d4",
					ChannelName: "测试闪退问题",
					IndexPic: "/WebBuilderMobileService/fileattach/OlderPic/b724199a-c23f-4dfb-9c13-38b4989888d4/6e5c01ebgw1eng9obregvj205p07l0sp.jpg",
					PicCount: "1",
					PicList: {
						ImgUrl: null
					}
				};
				var html = GenerateImagevierHtmlUtil.generateHtml_oldeducation_xyfclist_padV(InfoArray);
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