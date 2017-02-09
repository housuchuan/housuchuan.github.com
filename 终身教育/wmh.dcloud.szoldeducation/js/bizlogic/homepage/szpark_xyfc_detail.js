/**
 * 描述 :老年教育学员风采 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 17:49:20
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var WidgetUtil = require('core/MobileFrame/WidgetUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var url = config.ServerUrl + "olderpicdetails";
	var myGallery = null;
	var ChannelGuid = null;
	var myGalleryData = [];
	CommonUtil.initReady(function() {

		ChannelGuid = WindowUtil.getExtraDataByKey("ChannelGuid");
		var Title = WindowUtil.getExtraDataByKey("Title");
		Zepto(".mui-title").text(Title);
		//相册初始化
		initGalleryImgs();
	});

	//请求相册数据
	function initGalleryImgs() {
		//var imgGalleryUrl = 'http://www.nxzjxx.cn/NXWebService/appservice/GetInfoList';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			channelguid: ChannelGuid
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log("相册参数：" + requestData);
		//console.log("url"+url);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: successRequestGalleryImgsCallback,
			timeout: 9000,
			error: errorRequestCallback
		});
	};
	/**
	 * @description 图片轮播请求成功回调方法
	 * @param {Object} response
	 */
	function successRequestGalleryImgsCallback(response) {
		//console.log("图片相册请求结果\n" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.Content) {
				var infoArray = response.EpointDataBody.DATA.UserArea.Content;
				if (Array.isArray(infoArray)) {
					mui.each(infoArray, function(key, value) {
						//console.log(config.ServerUrl_Pic + value.ImgUrl);
						myGalleryData.push({
							FileContent: config.ServerUrl_Pic + value.ImgUrl
						});

					});
				} else {
					myGalleryData.push({
						FileContent: config.ServerUrl_Pic + infoArray.ImgUrl

					});
				}
				/**
				 * 所有的图片数据-这里是测试数据
				 * 正式时可以是自己的图片数据
				 * __DEFAULT为默认的分组名.  open()不传入分组默认为获取默认组的数据
				 */
				var allImgsData = {
					'__DEFAULT': myGalleryData
				};

				//初始化图片预览,传入关闭回调和图片数据
				var imgPreview = mui.previewImage({
					closeCallback: closeCallback,
					allImgsData: allImgsData
				});
				//打开图片预览
				imgPreview.open();

				var height = window.innerHeight;
				var marginTopHeight = (height - 300) / 2-44 + 'px';
				console.log('winHeight:'+height);
				console.log('顶部:' + marginTopHeight);
				Zepto('.mui-zoom-scroller').css('height', '300px');
				Zepto('.mui-zoom-scroller').css('padding-top', marginTopHeight);
				//console.log('height:' + Zepto('.mui-zoom-scroller').css('height'));
				//console.log('margin-top:' + Zepto('.mui-zoom-scroller').css('margin-top'));
			}
		}
	};

	function closeCallback() {
		plus.webview.currentWebview().close();
	};

	/**
	 * @description 请求失败回调方法
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function errorRequestCallback(xhr, type, errorThrown) {
		UIUtil.toast("请求超时,请检查网络连接...");
		UIUtil.closeWaiting();
	}
});