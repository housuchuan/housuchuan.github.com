/**
 * 描述 :学校概况父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-12 08:42:41
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var url = 'http://221.224.167.154/WebBuilderMobileService/appservice/GetInfoDetailWithoutInfoID';
	var title = "培训项目介绍";
	//栏目编号
	CommonUtil.initReady(function() {
		//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		Zepto(".mui-control-item").first().addClass('suzhou_school_active');
		Zepto("#sliderSegmentedControl2").css('width', 100 * 6);
		//区域滚动
		mui(".mui-scroll-wrapper").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		//获取培训项目介绍信息
		ajaxDetailData("067001");
		ajaxDetailData2("067002");
	});
	/**
	 * 给tab绑定点击事件
	 */
	Zepto('.mui-control-item').on('tap', function() {
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		//console.log("标题："+Zepto(this).find('.title').text());
		title = Zepto(this).find('.title').text();
		if(title === "培训项目介绍") {
			ajaxDetailData("067001");
		} else if(title == "报名信息") {
			ajaxDetailData2("067002");
		}
	});
	//给tab绑定滑动事件
	//		document.getElementById('slider').addEventListener('slide', function(e) {
	//			Zepto("#traincontent").html('');
	//			Zepto("#BMinformation").html('');
	//			if(e.detail.slideNumber === 0) {
	//				title ="培训项目介绍"
	//				console.log("title"+title);
	//				//ajaxDetailData("067001");
	//			} else if(e.detail.slideNumber === 1) {
	//				title ="报名信息";
	//				//ajaxDetailData("067002");
	//			}
	//		});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData(CateNum) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: CateNum, //067001代表培训内容；067002代表报名信息，008003
			isheadnews: 0,
			title: "",
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("参数：\n" + requestData);
		//console.log("地址：\n" + url);
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

	function ajaxDetailData2(CateNum) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: CateNum, //067001代表培训内容；067002代表报名信息，008003
			isheadnews: 0,
			title: "",
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("参数：\n" + requestData);
		//console.log("地址：\n" + url);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestCallback2,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		UIUtil.closeWaiting();
		//console.log(unescape(JSON.stringify(response)));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title)
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				if(tmpInfo.infocontent == "null") {
					tmpInfo.infocontent = "";
				}
				console.log("infocontent为：" + tmpInfo.infocontent);
				var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				Zepto("#traincontent").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto("#traincontent").append(output);
				//1. 处理富文本内容
				//console.log("富文本字符串" + tmpInfo.infocontent);
				//判断手机浏览器还是其他，手机PLUS情况下
				if(CommonUtil.os.plus) {
					AppendComplexHtmlDownload(document.getElementById("txt"), tmpInfo.infocontent);
				} else {
					Zepto("#txt").append(tmpInfo.infocontent);
				}
				//2. 处理附件信息
				Zepto("#attachListData").html('');
				var attachFilesListHtml = '';
				if(tmpInfo.attachfiles) {
					//附件内容
					var attachfilesContent = tmpInfo.attachfiles.SingleFile;
					if(attachfilesContent && Array.isArray(attachfilesContent)) {
						//多个附件
						//console.log("多个附件");
						mui.each(attachfilesContent, function(key, value) {
							attachFilesListHtml += '<li><a href="' + value.url + '">' + unescape(value.AttFileName) + '</a></li>';
						});
					} else {
						//单个附件
						//console.log("单个附件" + attachfilesContent.url);
						attachFilesListHtml += '<li><a href="' + attachfilesContent.url + '">' + unescape(attachfilesContent.AttFileName) + '</a></li>';
					}
					//判断PLUS和非Plus,针对手机版和手机浏览器版
					if(CommonUtil.os.plus) {
						AppendComplexHtmlDownload(document.getElementById("attachListData"), attachFilesListHtml);
					} else {
						Zepto("#attachListData").append(attachFilesListHtml);
					}
				} else {
					//无附件
					//console.log("富文本中无附件...");
				}
			}
		} else {
			console.log("error");
		}
		//图片懒加载
		ImageLoaderFactory.lazyLoadAllImg();
	};

	function successRequestCallback2(response) {
		UIUtil.closeWaiting();
		//console.log(unescape(JSON.stringify(response)));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title)
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				if(tmpInfo.infocontent == "null") {
					tmpInfo.infocontent = "";
				}
				console.log("infocontent为：" + tmpInfo.infocontent);
				var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt2"></div><div class="attaches"><ul id="attachListData2"></ul></div>'
				Zepto("#BMinformation").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto("#BMinformation").append(output);
				//1. 处理富文本内容
				//console.log("富文本字符串" + tmpInfo.infocontent);
				//判断手机浏览器还是其他，手机PLUS情况下
				if(CommonUtil.os.plus) {
					AppendComplexHtmlDownload(document.getElementById("txt2"), tmpInfo.infocontent);
				} else {
					Zepto("#txt2").append(tmpInfo.infocontent);
				}
				//2. 处理附件信息
				Zepto("#attachListData2").html('');
				var attachFilesListHtml = '';
				if(tmpInfo.attachfiles) {
					//附件内容
					var attachfilesContent = tmpInfo.attachfiles.SingleFile;
					if(attachfilesContent && Array.isArray(attachfilesContent)) {
						//多个附件
						//console.log("多个附件");
						mui.each(attachfilesContent, function(key, value) {
							attachFilesListHtml += '<li><a href="' + value.url + '">' + unescape(value.AttFileName) + '</a></li>';
						});
					} else {
						//单个附件
						//console.log("单个附件" + attachfilesContent.url);
						attachFilesListHtml += '<li><a href="' + attachfilesContent.url + '">' + unescape(attachfilesContent.AttFileName) + '</a></li>';
					}
					//判断PLUS和非Plus,针对手机版和手机浏览器版
					if(CommonUtil.os.plus) {
						AppendComplexHtmlDownload(document.getElementById("attachListData2"), attachFilesListHtml);
					} else {
						Zepto("#attachListData2").append(attachFilesListHtml);
					}
				} else {
					//无附件
					//console.log("富文本中无附件...");
				}
			}
		} else {
			console.log("error");
		}
		//图片懒加载
		ImageLoaderFactory.lazyLoadAllImg();
	};
	/**
	 * @description 映射模板并
	 * @param {Object} targetDomStr
	 */
	function AppendComplexHtmlDownload(targetDomStr, complextContentStr) {
		HtmlUtil.appendComplexHtml(targetDomStr, complextContentStr, function(loadUrl) {
			if(loadUrl) {
				if(loadUrl.toUpperCase().indexOf('.XLSX') != -1 || loadUrl.toUpperCase().indexOf('.XLS') != -1 || loadUrl.toUpperCase().indexOf('.TXT') != -1 || loadUrl.toUpperCase().indexOf('.PPT') != -1 || loadUrl.toUpperCase().indexOf('.ZIP') != -1 || loadUrl.toUpperCase().indexOf('.PDF') != -1 || loadUrl.toUpperCase().indexOf('.DOC') != -1 || loadUrl.toUpperCase().indexOf('.DOCX') != -1 || loadUrl.toUpperCase().indexOf('.RAR') != -1 || loadUrl.toUpperCase().indexOf('.JPG') != -1 || loadUrl.toUpperCase().indexOf('.PNG') != -1 || loadUrl.toUpperCase().indexOf('.GIF') != -1) {
					DealComplexFileUtil.openAttachFileFromUrl(loadUrl, true, function() {
						plus.nativeUI.toast('该附件下载失败!');
					}, true);
				} else {
					//打开url
					plus.runtime.openURL(loadUrl);
				}
			}
		});
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
});