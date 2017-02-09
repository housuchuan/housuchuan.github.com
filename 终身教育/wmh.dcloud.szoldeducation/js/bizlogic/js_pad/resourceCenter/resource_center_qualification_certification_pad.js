/**
 * 描述 :学历教育父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-05-24 09:18:03
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//详情地址
	var url = 'http://221.224.167.154/WebBuilderMobileService/appservice/GetInfoDetailWithoutInfoID';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
	//每页显示条数
	var PageSize = 15;
	var totalNumCount = 0;
	//标题
	var TiTle = "学习新闻";
	////067001代表培训内容；067002代表报名信息，
	var CateNum = "067001";
	//是否设置标题图片，“1”代表 是；“0”代表 否
	var isheadnews = "0";
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		ajaxDetailData(CateNum);
		//设置详情部分滚动
		mui("#scrollDetail").scroll();
		Zepto("#content").html('');
	}

	/**
	 * @description 栏目点击切换样式
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		CateNum = this.id;
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		if(this.innerText == "培训项目介绍") {
			TiTle = "培训项目介绍";
			ajaxDetailData("067001");
		} else if(this.innerText == "报名信息") {
			TiTle = "报名信息";
			ajaxDetailData("067002");
		}
	});
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
		console.log("地址：\n" + url);
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
		//console.log(unescape(JSON.stringify(response)));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title)
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				if(tmpInfo.infocontent == "null") {
					tmpInfo.infocontent = "";
				}
				//console.log("infocontent为：" + tmpInfo.infocontent);
				var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				//console.log(output);
				Zepto("#content").append(output);
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
					console.log("富文本中无附件...");
				}

			}
		} else {
			console.log("error");
		}
		//图片懒加载
		ImageLoaderFactory.lazyLoadAllImg(true);
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
	}

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
});