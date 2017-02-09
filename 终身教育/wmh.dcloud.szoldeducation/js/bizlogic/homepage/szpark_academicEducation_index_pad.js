/*
 * 作者 : 朱晓琪
 * 时间 : 2016-05-17
 * 描述 : 学历教育首页pad js
 */
define(function(require, exports, module) {
	"use strict";
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//详情页面引入模块
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//列表详情接口
	var url_detail = config.ServerUrl + 'GetInfoDetail';
	var url_consultdetail = config.ServerUrl + "answerdetails";
	//公告通知列表模板
	var litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
	var litemplate1 = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
	//咨询答疑列表映射模板
	var litemplate2 = '<li class="list-item" id="{{HistoryGuid}}"><i class="BoxGuid" style="display:none">{{BoxGuid}}</i><div class="ask-container"><span class="ask-title">咨询内容:</span><span class="ask-content">{{Content}}</span></div><div class="answer-container"><span class="answer-title">官方回复:</span><span class="answer-content">{{ReplyOpinion}}</span></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	//标题
	var TiTle = "学校概况";
	var CateNum = "010001"
	CommonUtil.initReady(function() {
		//第一个页面
		var Options = [{
			//学历教育-通用信息展示页面
			url: 'szpark_academicEducation_CommonInfoShow.html',
			id: 'szpark_academicEducation_CommonInfoShow.html',
			styles: {
				top: '44px',
				left: '134px',
				bottom: '0px',
				right: '10px'
			},
			extras: {
				CateNum: CateNum,
				isheadnews: "0"
			}
		}, {
			//在线报名
			url: 'szpark_academicEducation_onlineRegistration_pad.html',
			id: 'szpark_academicEducation_onlineRegistration_pad.html',
			styles: {
				top: '44px',
				left: '124px',
				bottom: '0px'
			},
		}]
		WindowUtil.createSubWins(Options, true);
		Zepto('.mui-iframe-wrapper').css({
			'left': '124px'
		});
		Zepto('#pullrefresh').css('display', 'none');
		Zepto('#scrollDetail').css('display', 'none');
		//导航栏目列表页面滑动&详情页面滑动
		mui('#scrollTab').scroll();
		mui('#scrollDetail').scroll();
	});
	/**
	 * @description 栏目点击切换样式
	 */
	Zepto('.szpark_newstitle_left_cell').on('tap', function() {
		CateNum = this.id;
		//切换栏目信息时，清除右侧信息内容
		Zepto("#content").html('');
		Zepto(this).addClass("szpark_active").siblings().removeClass("szpark_active");
		if (this.innerText == "学校概况") {
			CateNum = "007001";
			TiTle = "学校概况";
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			Zepto('#btn-askQuestion').hide();
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "招生专业") {
			CateNum = "007002";
			TiTle = "招生专业";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "在线学习") {
			CateNum = "007003";
			TiTle = "在线学习";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "招生办法") {
			CateNum = "007004";
			TiTle = "招生办法";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "联系方式") {
			CateNum = "007005";
			TiTle = "联系方式";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "位置及交通") {
			CateNum = "007006";
			TiTle = "位置及交通";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.showSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: CateNum,
				isheadnews: "0"
			});
		} else if (this.innerText == "在线报名") {
			CateNum = "007007";
			TiTle = "在线报名";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'none');
			Zepto('#scrollDetail').css('display', 'none');
			WindowUtil.hideSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.showSubPage("szpark_academicEducation_onlineRegistration_pad.html");
		} else if (this.innerText == "公告通知") {
			TiTle = "公告通知";
			CateNum = "007008";
			Zepto('#btn-askQuestion').hide();
			Zepto('#pullrefresh').css('display', 'block');
			Zepto('#scrollDetail').css('display', 'block');
			WindowUtil.hideSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.firePageEvent('szpark_academicEducation_index_pad.html', 'refreshListPage');
		} else {
			TiTle = "咨询答疑";
			Zepto('#btn-askQuestion').show();
			Zepto('#pullrefresh').css('display', 'block');
			Zepto('#scrollDetail').css('display', 'block');
			WindowUtil.hideSubPage("szpark_academicEducation_CommonInfoShow.html");
			WindowUtil.hideSubPage("szpark_academicEducation_onlineRegistration_pad.html");
			WindowUtil.firePageEvent('szpark_academicEducation_index_pad.html', 'refreshListPage');
		}
	});
	/*
	 * @description 通知公告和咨询答疑下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
		mDefaultInitPageNum: getDefaultInitPageNum,
		mGetLitemplate: getLitempate,
		mGetUrl: getUrl,
		mGetRequestDataFunc: getData,
		mChangeResponseDataFunc: changeResponseDataFunc,
		mChangeToltalCountFunc: changeToltalCountFunc,
		mRequestSuccessCallbackFunc: successCallbackFunc,
		mOnItemClickCallbackFunc: onItemClickCallbackFunc,
		ajaxSetting: {
			accepts: {
				json: "application/json;charset=utf-8"
			},
			contentType: "application/x-www-form-urlencoded"
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
				catenum: CateNum,
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
		console.log("模板litempate" + litemplate);
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
				if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
					totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
					var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
					mui.each(InfoArray, function(key, value) {
						if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
							value.HeadNewsAttachUrl = "../../img/MobileFrame/img_error.jpg";
						}
						value.Title = unescape(value.Title);
						value.infocontent = unescape(value.infocontent);
						tempArray.push(value);
					});
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
		console.log("总记录数：" + totalNumCount);
		return totalNumCount;
	}
	/**
	 * @description 列表请求成功回调
	 */
	function successCallbackFunc(response) {
		console.log("请求数据成功" + unescape(JSON.stringify(response)));
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		var HistoryGuid = this.id;
		console.log(infoID);
		if (TiTle == "公告通知") {
			ajaxDetailData(infoID, CateNum);
		} else if (TiTle == "咨询答疑") {
			console.log("请求咨询答疑详情" + HistoryGuid);
			ajaxConsultDetailData(HistoryGuid);
		}

	}

	//详情页面代码
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData(InfoID, CateNum) {
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
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			historyguid: historyGuid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(requestData);
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