/**
 * 作者：朱晓琪
 * 时间：2016-05-16
 * 描述： 老年教育首页  
 */
define(function(require, exports, module) {
	"use strict";
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入离线缓存模块
	var StorageUtil = require('core/MobileFrame/StorageUtil');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//详情页面引入模块
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//列表详情接口
	var url_detail = config.ServerUrl + 'GetInfoDetail';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	var guid = '';
	var sessionKey = null;
	var beginIndex = 0;
	//标题
	var TiTle = "学习新闻";
	//008001   养生餐饮        008002   养生时讯
	var CateNum = "008001"
	CommonUtil.initReady(function() {
		UIUtil.tabbar(300);
		//导航栏目列表页面滑动
		mui('#scrollTab').scroll({
			indicators: true //是否显示滚动条
		});
		//详情页面滑动
		mui('#scrollDetail').scroll({
			indicators: true //是否显示滚动条
		});
	});
	
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		sessionKey = "getAskAndAnswerListKey";
		beginIndex = CurrPage * PageSize;
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: CurrPage,
			pagesize: PageSize,
			catenum: CateNum,
			isheadnews: "0",
			title: ""
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		console.log('请求参数' + requestData);
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
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				mui.each(InfoArray, function(key, value) {
					if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
						value.HeadNewsAttachUrl = "../../img/MobileFrame/img_error.jpg";
					}
					//					value.HeadNewsAttachUrl = "https://img.alicdn.com/imgextra/i4/698360784/TB21UhfdVXXXXczXXXXXXXXXXXX_!!698360784.jpg";
					value.Title = unescape(value.Title);
					value.infocontent = unescape(value.infocontent);
					tempArray.push(value);
				});
			}
		}
		return tempArray;
	}

	function geLitemplate() {
		if (CateNum == "002004") {
			litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><img data-img-localcache="{{HeadNewsAttachUrl}}"/><div class="notice-txt"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
		} else {
			litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
		}
		return litemplate;
	}
	/**
	 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
	 */
	function changeToltalCountFunc() {
		console.log("总记录数：" + totalNumCount);
		return totalNumCount;
	}
	/**
	 * @description 获取列表的离线数据
	 */
	function getDataOffLineFunc(url, data) {
		if (typeof(data) == 'string') {
			data = JSON.parse(data);
		}
		if (data != null) {
			data = data.para;
		}
		var offlineListCache = StorageUtil.OffLineAppCache.getListDataCache(sessionKey, data.currentpageindex, data.pagesize);
		return offlineListCache;
	};

	/**
	 * @description 列表请求成功回调
	 */
	function successCallbackFunc(response) {
		console.log("请求数据成功" + JSON.stringify(response));
		//添加到缓存
		StorageUtil.OffLineAppCache.addListDataCache(sessionKey, response, beginIndex);
		//console.log("获取离线缓存数据：" + JSON.stringify(StorageUtil.OffLineAppCache.getOffLineCache(sessionKey)));
		ImageLoaderFactory.lazyLoadAllImg();
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		console.log(infoID);
		ajaxDetailData(infoID,CateNum);
//		WindowUtil.createWin('szpark_news_detail.html', 'szpark_news_detail.html', {
//			InfoID: infoID,
//			CateNum: CateNum,
//			Title: TiTle
//		});

	}
	/**
	 * @description 栏目点击切换样式
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		CateNum = this.id;
		Zepto("#content").html('');
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		if (this.innerText == "养生餐饮") {
			TiTle = "养生餐饮";
		} else if (this.innerText == "养生时讯") {
			TiTle = "养生时讯";
		} 
		WindowUtil.firePageEvent('szpark_oldeducation_index_pad.html', 'refreshListPage');
	});

	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
		mDefaultInitPageNum: 0,
		mGetLitemplate: geLitemplate,
		mGetUrl: url,
		mGetRequestDataFunc: getData,
		mChangeResponseDataFunc: changeResponseDataFunc,
		mChangeToltalCountFunc: changeToltalCountFunc,
		mRequestSuccessCallbackFunc: successCallbackFunc,
		mOnItemClickCallbackFunc: onItemClickCallbackFunc,
		mGetDataOffLineFunc: getDataOffLineFunc,
		ajaxSetting: {
			accepts: {
				json: "application/json;charset=utf-8"
			},
			contentType: "application/x-www-form-urlencoded"
		}
	});
	
	//详情页面代码
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData(InfoID,CateNum) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			InfoID: InfoID,
			CateNum: CateNum,
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log(url_detail + "\n" + requestData);
		mui.ajax(url_detail, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		console.log(unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea;
				tmpInfo.title = unescape(tmpInfo.title)
				tmpInfo.infocontent = unescape(tmpInfo.infocontent);
				if (tmpInfo.infocontent == "null") {
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
				if (loadUrl.toUpperCase().indexOf('.XLSX') != -1 ||loadUrl.toUpperCase().indexOf('.XLS') != -1 ||loadUrl.toUpperCase().indexOf('.TXT') != -1 ||loadUrl.toUpperCase().indexOf('.PPT') != -1 ||loadUrl.toUpperCase().indexOf('.ZIP') != -1 ||loadUrl.toUpperCase().indexOf('.PDF') != -1 || loadUrl.toUpperCase().indexOf('.DOC') != -1 || loadUrl.toUpperCase().indexOf('.DOCX') != -1 || loadUrl.toUpperCase().indexOf('.RAR') != -1 || loadUrl.toUpperCase().indexOf('.JPG') != -1 || loadUrl.toUpperCase().indexOf('.PNG') != -1 || loadUrl.toUpperCase().indexOf('.GIF') != -1) {
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