/**
 * 描述 :学校概况父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-12 08:42:41
 */
define(function(require, exports, module) {
	"use strict"
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var url = config.ServerUrl + 'getinfolist';
	//栏目编号
	var catenum = "005001";
	var title = "学校简介";
	//每页显示条数
	var PageSize = 15;
	var totalNumCount = 0;
	var pullToRefreshObject;
	CommonUtil.initReady(initData);

	function initData() {
		//导航栏目以及内容区设置为可以滚动
		mui('#scrollTab').scroll();
		mui('#scrollDetail').scroll();
		Zepto(".listwrapper").css('width', "auto");
		Zepto(".szpark_newstitle_right").css('width', '86%');
		Zepto(".szpark_newstitle_right").css('float', 'none');
		Zepto(".szpark_newstitle_right").css('margin-left', '14%');
		//默认显示学校简介详情
		ajaxDetailData();
	}
	/**
	 * 给tab绑定点击事件
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		title = Zepto(this).text();
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		//切换导航栏目，使得列表页面以及右侧详情页面内容快速回滚到该区域顶部
		mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		mui('#pullrefresh').scroll().scrollTo(0, 0, 100);
		if (title == '学校简介') {
			catenum = "005001";
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			ajaxDetailData();
		} else if (title == '机构设置') {
			catenum = "005002";
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			ajaxDetailData();
		} else if (title == '学校荣誉') {
			catenum = "005003"; //列表页面
			//Zepto("#content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
		} else if (title == '大事件') {
			catenum = "005004"; //列表页面
			//Zepto("#content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
		} else if (title == '校园风光') {
			catenum = "005005";
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			ajaxDetailData();
		} else if (title == '交通信息') {
			catenum = "005006";
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			ajaxDetailData();
		}
	});

	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: CurrPage,
			pagesize: PageSize,
			catenum: catenum,
			isheadnews: "0",
			title: ""
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		//console.log('请求参数' + requestData);
		return requestData;
	}
	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		console.log("改变数据 ：" + JSON.stringify(response));
		//定义临时数组
		var tempArray = [];
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if (Array.isArray(InfoArray)) {
					mui.each(InfoArray, function(key, value) {
						if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
							value.HeadNewsAttachUrl = "../../img/homepage/xyfc1.jpg";
						}
						value.Title = unescape(value.Title);
						//去除所有html标记以及&nbsp;
						value.infocontent = unescape(value.infocontent).replace(/<[^>]+>/g, "");
						value.infocontent = unescape(value.infocontent).replace(/&nbsp;/ig, "");
						if (value.infocontent == "null") {
							value.infocontent = "";
						}
						tempArray.push(value);
					});
				} else {
					if (InfoArray.HeadNewsAttachUrl == null || InfoArray.HeadNewsAttachUrl == "") {
						InfoArray.HeadNewsAttachUrl = "../../img/homepage/xyfc1.jpg";
					} else if (InfoArray.infocontent == "null") {
						InfoArray.infocontent = "";
					}
					InfoArray.Title = unescape(InfoArray.Title);
					//去除所有html标记以及&nbsp;
					InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/<[^>]+>/g, "");
					InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/&nbsp;/ig, "");
					tempArray.push(InfoArray);
				}
			}else{
				console.log("数据为null");
			}
		}
		return tempArray;
	}

	/**
	 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
	 */
	function changeToltalCountFunc() {
		//console.log("总记录数：" + totalNumCount);
		return totalNumCount;
	}

	/**
	 * @description 成功回调
	 * @param {Object} response
	 */
	function successCallbackFunc(response, isPullDown) {
		//console.log("成功请求数据：" + JSON.stringify(response));
		//console.log("数组的长度："+response.length);
		Zepto("#content").html('');
		//判断是否第一次下拉刷新
		if (isPullDown) {
			if (Array.isArray(response)&&response.length>0) {
				var initFirstInfoID = response[0].InfoID;
				ajaxListDetailData(initFirstInfoID);
			}
		}
	};
	//模板映射
	function getLitemplate() {
		var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
		if (title == "学校荣誉") {
			litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
		} else if (title == "大事件") {
			litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
		}
		return litemplate;
	}
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		//快速回滚到该区域顶部
		mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		ajaxListDetailData(infoID);
	}

	PullToRefreshTools.initPullDownRefresh({
		isDebug: true,
		up: {
			auto: true
		},
		bizlogic: {
			defaultInitPageNum: 0,
			getLitemplate: getLitemplate,
			getUrl: url,
			getRequestDataCallback: getData,
			changeResponseDataCallback: changeResponseDataFunc,
			itemClickCallback: onItemClickCallbackFunc,
			changeToltalCountCallback: changeToltalCountFunc,
			successRequestCallback: successCallbackFunc
		},
		//三种皮肤
		//default -默认人的mui下拉刷新,webview优化了的
		//type1 -自定义类别1的默认实现, 没有基于iscroll
		//type1_material1 -自定义类别1的第一种材质
		skin: 'type1'
	}, function(pullToRefresh) {
		//console.log("生成下拉刷新成功");
		pullToRefreshObject = pullToRefresh;
		pullToRefreshObject.refresh();
	});

	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var url = config.ServerUrl + "GetInfoDetailWithoutInfoID";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: catenum,
			isheadnews: "0",
			title: "",
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log("para" + requestData);
		//console.log("url" + url);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestListDetailCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		UIUtil.closeWaiting();
		//console.log(unescape(response.EpointDataBody.DATA.UserArea.infocontent));
		//console.log("学校概况："+CateNum + unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var complexContent = unescape(response.EpointDataBody.DATA.UserArea.infocontent);
				//console.log("该导航信息展示： " + complexContent);
				Zepto("#content").html('');
				if (complexContent) {
					Zepto("#content").append(complexContent);
					//HtmlUtil.appendComplexHtml(document.getElementById('content'), complexContent);
				} else if (complexContent == null && !complexContent) {
					Zepto("#content").append("本栏目暂无信息！");
				}
			}
		}
	};

	/**
	 * @description 请求列表详情数据
	 */
	function ajaxListDetailData(infoID) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			InfoID: infoID,
			CateNum: catenum,
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		var url = config.ServerUrl + 'GetInfoDetail';
		console.log(requestData);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestListDetailCallback,
			error: errorRequestCallback
		});
	};

	function successRequestListDetailCallback(response) {
		UIUtil.closeWaiting();
		//console.log(unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title)
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				if (tmpInfo.infocontent == "null") {
					tmpInfo.infocontent = "";
				}
				//console.log("infocontent为：" + tmpInfo.infocontent);
				if (title == "大事件" || title == "学校荣誉") {
					var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				} else {
					var litemplate = '<div class="title">{{title}}</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				}
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				//console.log(output);
				Zepto("#content").append(output);
				//1. 处理富文本内容
				//console.log("富文本字符串" + tmpInfo.infocontent);
				//判断手机浏览器还是其他，手机PLUS情况下
				if (CommonUtil.os.plus) {
					AppendComplexHtmlDownload(document.getElementById("txt"), tmpInfo.infocontent);
				} else {
					Zepto("#txt").append(tmpInfo.infocontent);
				}
				//2. 处理附件信息
				Zepto("#attachListData").html('');
				var attachFilesListHtml = '';
				if (tmpInfo.attachfiles) {
					//附件内容
					var attachfilesContent = tmpInfo.attachfiles.SingleFile;
					if (attachfilesContent && Array.isArray(attachfilesContent)) {
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
					if (CommonUtil.os.plus) {
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
		ImageLoaderFactory.lazyLoadAllImg();
	};

	/**
	 * @description 映射模板并
	 * @param {Object} targetDomStr
	 */
	function AppendComplexHtmlDownload(targetDomStr, complextContentStr) {
		HtmlUtil.appendComplexHtml(targetDomStr, complextContentStr, function(loadUrl) {
			if (loadUrl) {
				if (loadUrl.toUpperCase().indexOf('.XLSX') != -1 || loadUrl.toUpperCase().indexOf('.XLS') != -1 || loadUrl.toUpperCase().indexOf('.TXT') != -1 || loadUrl.toUpperCase().indexOf('.PPT') != -1 || loadUrl.toUpperCase().indexOf('.ZIP') != -1 || loadUrl.toUpperCase().indexOf('.PDF') != -1 || loadUrl.toUpperCase().indexOf('.DOC') != -1 || loadUrl.toUpperCase().indexOf('.DOCX') != -1 || loadUrl.toUpperCase().indexOf('.RAR') != -1 || loadUrl.toUpperCase().indexOf('.JPG') != -1 || loadUrl.toUpperCase().indexOf('.PNG') != -1 || loadUrl.toUpperCase().indexOf('.GIF') != -1) {
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