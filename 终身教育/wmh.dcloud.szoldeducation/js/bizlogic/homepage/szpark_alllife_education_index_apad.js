/*
 * 作者 : 孙尊路
 * 时间 : 2016-04-06 15:45:22
 * 描述 : 新闻公告子页面pad
 */
define(function(require, exports, module) {
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//详情接口【研究所简介详情】
	var url_detail = config.ServerUrl + "GetInfoDetailWithoutInfoID";
	//列表详情接口【列表】
	var url_listdetail = config.ServerUrl + 'GetInfoDetail';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
	//每页显示条数
	var PageSize = 15;
	//总记录数
	var totalNumCount = 0;
	//010001研究所简介010002科研动态010003政策文献010004科研讲坛010005研究成果
	var CateNum = "010001";
	var TiTle = "研究所简介";
	//刷新对象
	var pullToRefreshObject;

	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//plus.screen.lockOrientation('landscape-primary')
		//导航栏目列表页面滑动&详情页面滑动
		mui('#scrollTab').scroll();
		mui('#scrollDetail').scroll();
		Zepto(".listwrapper").css('width', "auto");
		Zepto(".szpark_newstitle_right").css('width', '86%');
		Zepto(".szpark_newstitle_right").css('float', 'none');
		Zepto(".szpark_newstitle_right").css('margin-left', '14%');

		//默认显示研究所简介
		ajaxDetailData();
	}
	/**
	 * @description 左边栏目点击切换点击事件
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		TiTle = Zepto(this).text();
		CateNum = this.id;
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		//切换栏目，清除右侧内容
		if (this.innerText == "研究所简介") {
			TiTle = "研究所简介";
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			//快速回滚到该区域顶部
			mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			//默认显示研究所简介
			ajaxDetailData();
			//document.getElementById ("pullrefresh").style.visibility  ="hidden";
			//document.getElementById ("pullrefresh").style.width  ="0%";
		} else if (this.innerText == "科研动态") {
			TiTle = "科研动态";
			//Zepto(".my-content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
		} else if (this.innerText == "政策文献") {
			TiTle = "政策文献";
			//Zepto(".my-content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
		} else if (this.innerText == "科研讲坛") {
			TiTle = "科研讲坛";
			//Zepto(".my-content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
		} else {
			TiTle = "研究成果";
			//Zepto(".my-content").html('');
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			pullToRefreshObject.refresh();
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
			totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if (Array.isArray(InfoArray)) {
					mui.each(InfoArray, function(key, value) {
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
					if (InfoArray.infocontent == "null") {
						InfoArray.infocontent = "";
					}
					InfoArray.Title = unescape(InfoArray.Title);
					//去除所有html标记以及&nbsp;
					InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/<[^>]+>/g, "");
					InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/&nbsp;/ig, "");
					tempArray.push(InfoArray);
				}

			}
		}
		return tempArray;
	}

	function geLitemplate() {
		litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
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
	 * @description 列表请求成功回调
	 */
	function successCallbackFunc(response,isPullDown) {
		console.log("请求数据成功" + JSON.stringify(response));
		if(isPullDown){
			if(response&&Array.isArray(response)&&response.length>0){
				var initFirstInfoID=response[0].InfoID;
				ajaxListDetailData(initFirstInfoID, CateNum);
			}
		}
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		//快速回滚到该区域顶部
		mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		var infoID = this.id;
		ajaxListDetailData(infoID, CateNum);
	}
	//刷新
	PullToRefreshTools.initPullDownRefresh({
		isDebug: true,
		up: {
			auto: true
		},
		bizlogic: {
			defaultInitPageNum: 0,
			getLitemplate: geLitemplate,
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
		console.log("生成下拉刷新成功");
		pullToRefreshObject = pullToRefresh;
		pullToRefreshObject.refresh();
	});

	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: CateNum,
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
		mui.ajax(url_detail, {
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
	function ajaxListDetailData(InfoID, CateNum) {
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
		console.log(url_listdetail + "\n" + requestData);
		UIUtil.showWaiting();
		mui.ajax(url_listdetail, {
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
				if (TiTle == "研究所简介") {
					var litemplate = '<div class="title">{{title}}</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				} else {
					var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				}
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				console.log(output);
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