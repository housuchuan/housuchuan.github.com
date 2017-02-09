/*
 * 作者 : 孙尊路
 * 时间 : 2016-05-17
 * 描述 : 学历教育首页android pad
 */
define(function(require, exports, module) {
	"use strict";
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	//详情页面引入模块
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//在线报名部分
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var IDCardUtil = require('core/MobileFrame/IDCardUtil.js');
	var applyadd_url = config.ServerUrl + "applyadd";
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//列表详情接口
	var url_detail = config.ServerUrl + 'GetInfoDetail';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
	//公告通知列表模板
	var litemplate1 = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
	//咨询答疑列表映射模板
	var litemplate2 = '<li class="list-item" id="{{HistoryGuid}}"><i class="BoxGuid" style="display:none">{{BoxGuid}}</i><div class="ask-container"><span class="ask-title">咨询内容:</span><span class="ask-content">{{Content}}</span></div><div class="answer-container"><span class="answer-title">官方回复:</span><span class="answer-content">{{ReplyOpinion}}</span></div></li>';

	//每页显示条数
	var PageSize = 15;
	var totalNumCount = 0;
	//标题
	var TiTle = "学校概况";
	var catenum = "007001";
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//导航栏目列表页面滑动&详情页面滑动
		mui('#scrollTab').scroll();
		mui('#scrollDetail').scroll();
		Zepto(".listwrapper").css('width', "auto");
		Zepto(".szpark_newstitle_right").css('width', '86%');
		Zepto(".szpark_newstitle_right").css('float', 'none');
		Zepto(".szpark_newstitle_right").css('margin-left', '14%');
		ajaxDetailData(catenum);
	}

	/**
	 * @description 栏目点击切换样式
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		TiTle = Zepto(this).text();
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		//切换导航栏目，使得列表页面以及右侧详情页面内容快速回滚到该区域顶部
		mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		mui('#pullrefresh').scroll().scrollTo(0, 0, 100);
		if (this.innerText == "学校概况") {
			catenum = "007001";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto('#btn-askQuestion').hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			ajaxDetailData(catenum);
		} else if (this.innerText == "招生专业") {
			catenum = "007002";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto('#btn-askQuestion').hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			ajaxDetailData(catenum);
		} else if (this.innerText == "在线学习") {
			catenum = "007003";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			ajaxDetailData(catenum);
		} else if (this.innerText == "招生办法") {
			catenum = "007004";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			Zepto('#btn-askQuestion').hide();
			ajaxDetailData(catenum);
		} else if (this.innerText == "联系方式") {
			catenum = "007005";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			Zepto('#btn-askQuestion').hide();
			ajaxDetailData(catenum);
		} else if (this.innerText == "位置及交通") {
			catenum = "007006";
			Zepto('#content').html('');
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			Zepto('#btn-askQuestion').hide();
			ajaxDetailData(catenum);
		} else if (this.innerText == "在线报名") {
			catenum = "007007";
			Zepto('#content').html('');
			Zepto(".listwrapper").css('width', "auto");
			Zepto(".szpark_newstitle_right").css('width', '86%');
			Zepto(".szpark_newstitle_right").css('float', 'none');
			Zepto(".szpark_newstitle_right").css('margin-left', '14%');
			//background: url(../../img/homepage/img_baoming_bg1.jpg) no-repeat;
			//background-size:100% 100%;
			Zepto(".szpark_newstitle_right").addClass('backgroundurl');
			Zepto("#onlineLayer").css('display', 'block');
			Zepto("#onlineLayer").show();
			Zepto('#btn-askQuestion').hide();

		} else if (this.innerText == "公告通知") {
			catenum = "007008";
			Zepto('#content').html('');
			Zepto('#btn-askQuestion').hide();
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			pullToRefreshObject.refresh();
		} else {
			Zepto('#content').html('');
			Zepto('#btn-askQuestion').show();
			Zepto("#onlineLayer").hide();
			Zepto(".listwrapper").css('width', "30%");
			Zepto(".szpark_newstitle_right").css('width', '56%');
			Zepto(".szpark_newstitle_right").css('float', 'right');
			Zepto(".szpark_newstitle_right").removeClass('backgroundurl');
			pullToRefreshObject.refresh();
		}
	});

	/**
	 * @description     公告通知 接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = null;
		if (TiTle == "公告通知") {
			data = {
				currentpageindex: CurrPage,
				pagesize: PageSize,
				catenum: catenum,
				isheadnews: "0",
				title: ""
			};
		} else if (TiTle == "咨询答疑") {
			data = {
				pageindex: CurrPage,
				pagesize: PageSize,
				type: 1 //0:你问我答 1：咨询答疑 2：家长问答
			};
		}
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log('公告通知请求参数' + requestData + '\n url:' + url);
		return requestData;
	}

	//映射模板
	function getUrl() {
		var url = config.ServerUrl + 'getinfolist';
		if (TiTle == "公告通知") {
			//接口地址
			url = config.ServerUrl + 'getinfolist';
		} else if (TiTle == "咨询答疑") {
			url = config.ServerUrl + 'answerlist';
		}
		return url;
	}
	//映射模板
	function getLitempate() {
		if (TiTle == "公告通知") {
			litemplate = litemplate1;
		} else if (TiTle == "咨询答疑") {
			litemplate = litemplate2;
		}
		//console.log("模板litempate" + litemplate);
		return litemplate;
	}
	//配置不同初始页
	function getDefaultInitPageNum() {
		var defaultInitPageNum = 0;
		if (TiTle == "公告通知") {
			defaultInitPageNum = 0;
		} else if (TiTle == "咨询答疑") {
			defaultInitPageNum = 1;
		}
		console.error("服务器配置初始页" + defaultInitPageNum);
		return defaultInitPageNum;
	}
	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		console.log(TiTle + "改变数据 ：" + unescape(JSON.stringify(response)));
		//定义临时数组
		var tempArray = [];
		if (TiTle == "公告通知") {
			if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
				totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
				if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
					var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
					if (Array.isArray(InfoArray)) {
						//多条数据
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
						//单条数据时
						InfoArray.Title = unescape(InfoArray.Title);
						if (InfoArray.infocontent == "null") {
							InfoArray.infocontent = "";
						}
						//去除所有html标记以及&nbsp;
						InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/<[^>]+>/g, "");
						InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/&nbsp;/ig, "");
						tempArray.push(InfoArray);
					}
				}
			}
		} else if (TiTle == "咨询答疑") {
			if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
				if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
					totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
					var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
					if (Array.isArray(InfoArray)) {
						mui.each(InfoArray, function(key, value) {
							value.ReplyOpinion = unescape(value.ReplyOpinion);
							value.Content = unescape(value.Content);
							tempArray.push(value);
						});
					} else {
						InfoArray.ReplyOpinion = unescape(InfoArray.ReplyOpinion);
						InfoArray.Content = unescape(InfoArray.Content);
						tempArray.push(InfoArray);
					}
				}
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
		if (isPullDown) {
			//console.log("下拉刷新 ");
			if (response && Array.isArray(response)&&response.length>0) {
				if (TiTle == "公告通知") {
					var initFirstInfoID = response[0].InfoID;
					ajaxListDetailData(initFirstInfoID)
				} else if (TiTle == "咨询答疑") {
					var initFirstHistoryGuid = response[0].HistoryGuid;
					ajaxConsultDetailData(initFirstHistoryGuid);
				}
			}
		}
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		var HistoryGuid = this.id;
		console.log(infoID);
		//快速回滚到该区域顶部
		mui('#scrollDetail').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		if (TiTle == "公告通知") {
			ajaxListDetailData(infoID)
		} else if (TiTle == "咨询答疑") {
			console.log("请求咨询答疑详情" + HistoryGuid);
			ajaxConsultDetailData(HistoryGuid);
		}

	};
	PullToRefreshTools.initPullDownRefresh({
		isDebug: true,
		up: {
			auto: true
		},
		bizlogic: {
			defaultInitPageNum: 0,
			getLitemplate: getLitempate,
			getUrl: getUrl,
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
	});
	/**
	 * 请求详情（学校概况、招生专业等）
	 */
	function ajaxDetailData(catenum) {
		var url = config.ServerUrl + "GetInfoDetailWithoutInfoID";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: catenum,
			isheadnews: 0,
			title: "",
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("para" + requestData);
		//console.log("url" + url);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestListDetaiCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		UIUtil.closeWaiting();
		//console.log("学校概况："+catenum + unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var complexContent = unescape(response.EpointDataBody.DATA.UserArea.infocontent);
				console.log(complexContent);
				//console.log("该导航信息展示： " + complexContent);
				//				Zepto("#mainContent").html('');
				if (complexContent) {
					Zepto("#content").html('');
					//Zepto("#content").append(complexContent);
					HtmlUtil.appendComplexHtml(document.getElementById('content'), complexContent, function(hrefStr) {
						//console.log(hrefStr);
						WindowUtil.createWin("szpark_oldeducation_HotInfomationShow.html", 'szpark_oldeducation_HotInfomationShow.html', {
							HotInfoURL: hrefStr,
							Title: "在线学习"
						});
					});
				} else if (complexContent == null && !complexContent) {
					Zepto("#content").append("本栏目暂无信息！");
				}
			}
		}
		//映射模板数据
		ImageLoaderFactory.lazyLoadAllImg();
	};

	function ajaxListDetailData(infoID) {
		var url = config.ServerUrl + 'GetInfoDetail';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		//console.log("infoid"+infoID);
		//console.log("catenum"+catenum);
		var data = {
			InfoID: infoID,
			CateNum: catenum,
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log(url + "\nsss" + requestData);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestListDetaiCallback,
			error: errorRequestCallback
		});
	};

	function successRequestListDetaiCallback(response) {
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
				console.log("infocontent为：" + tmpInfo.infocontent);
				//因为通用详情展示与列表详情展示不一样；这里做判断
				if (TiTle == "公告通知" || TiTle == "咨询答疑") {
					var litemplate = '<div class="title">{{title}}</div><div class="time">【来源:<span>{{infoZhuanZai}}</span>】&nbsp;【作者:<span>{{infoAuthor}}</span>】&nbsp;【信息时间:<span>{{infodate}}</span>】</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				} else {
					var litemplate = '<div class="title">{{title}}</div><div id="txt"></div><div class="attaches"><ul id="attachListData"></ul></div>'
				}
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				//console.log(output);
				Zepto("#content").append(output);
				//1. 处理富文本内容
				console.log("富文本字符串" + tmpInfo.infocontent);
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
	/**
	 * @description 请求【咨询答疑】详情数据
	 */
	function ajaxConsultDetailData(historyGuid) {
		var url_consultdetail = config.ServerUrl + "answerdetails";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			historyguid: historyGuid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(requestData);
		UIUtil.showWaiting();
		mui.ajax(url_consultdetail, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestConsultDetailCallback,
			error: errorRequestCallback
		});
	};
	/**
	 * @description 成功请求答疑
	 * @param {Object} response
	 */
	function successRequestConsultDetailCallback(response) {
		UIUtil.closeWaiting();
		//console.log(JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var tmpInfo = response.EpointDataBody.DATA.UserArea.AnswerDetails;
				tmpInfo.PostContent = unescape(tmpInfo.PostContent);
				tmpInfo.ReplyContent = unescape(tmpInfo.ReplyContent);
				var litemplate = '<div class="ask-container2"><span class="ask-title">咨询内容:</span><span class="ask-content">{{PostContent}}</span></div><div class="answer-container2"><span class="answer-title">官方回复:</span><span class="answer-content">{{ReplyContent}}</span></div>'
				Zepto("#content").html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto("#content").append(output);
			}
		}
	};
	/**
	 * @description 在线报名
	 */
	Zepto("#btn-submit").on('tap', function() {
		submitOnlineJoin();
	});
	/**
	 * @description 在线学习报名
	 */
	function submitOnlineJoin() {
		var name = Zepto("#name").val();
		var phonenumber = Zepto("#phone").val();
		var idcard = Zepto("#idcard").val();
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			applyname: name,
			applytel: phonenumber,
			applyidcard: idcard,
			applytype: "3"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(JSON.stringify(data));
		//console.log(checkInputFormat(data));
		if (checkInputFormat(data)) {
			mui.ajax(applyadd_url, {
				data: requestData,
				dataType: "json",
				timeout: "15000", //超时时间设置为3秒；
				type: "POST",
				success: successRequestApplyaddCallback,
				error: errorRequestCallback
			});
		}
	};
	/**
	 * 校验输入
	 * @param {Object} data
	 */
	function checkInputFormat(data) {
		var flag = true;
		if (!data.applyname) {
			UIUtil.toast("姓名不能为空", {
				isForceH5: true
			});
			flag = false;
			return;
		}
		if (!data.applytel) {
			UIUtil.toast("请输入手机号码", {
				isForceH5: true
			});
			flag = false;
			return;
		} else {
			if (!StringUtil.isPhoneNumber(data.applytel)) {
				UIUtil.toast("手机号输入格式不正确", {
					isForceH5: true
				});
				flag = false;
				return;
			}
		}
		if (!data.applyidcard) {
			UIUtil.toast("请输入身份证号", {
				isForceH5: true
			});
			flag = false;
			return;
		} else {
			if (!IDCardUtil.validateUserIdendity(data.applyidcard, true)) {
				UIUtil.toast("身份证号不正确", {
					isForceH5: true
				});
				flag = false;
				return;
			}
		}
		return flag;

	}

	function successRequestApplyaddCallback(response) {
		//console.log(JSON.stringify(response));
		//console.log("提交成功接口返回信息;" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			UIUtil.alert({
				content: response.EpointDataBody.DATA.UserArea,
				title: '提示',
				buttonValue: '我知道了'
			}, function() {
				Zepto("#name").val("");
				Zepto("#phone").val("");
				Zepto("#idcard").val("");
			});
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
	/**
	 * 1:你问我答 2：咨询答疑 3：家长问答
	 * 1.你问我答【b59def25-3da4-4920-b81f-f6eab30f9eec】
	 * 2.咨询答疑【882c5330-19d8-4068-9616-1fcde57f0ff0】
	 * 3.家长问答【920e4e89-4e8c-442d-a703-56c7e1c7120b】
	 */
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_consultationAnswer_submit.html', 'szpark_consultationAnswer_submit.html', {
			BoxGuid: "882c5330-19d8-4068-9616-1fcde57f0ff0",
			Title: "咨询答疑"
		});
	});

});