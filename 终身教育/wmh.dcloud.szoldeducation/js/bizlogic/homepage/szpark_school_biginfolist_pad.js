/**
 * 描述 : 大事件子页面
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 17:49:21
 */
define(function(require, exports, module) {
	"use strict"
	var url = config.ServerUrl + 'getinfolist';
	var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><h5 class="mui-ellipsis-2">{{infocontent}}</h5></div></div></li>';
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	//每页显示条数
	var PageSize = 15;
	var totalNumCount = 0;
	var CateNum = "005004";
	var pullToRefreshObject;
	CommonUtil.initReady(function() {
		if (UserAgentUtil.ANDROID_PAD()) {
			//div模式
			initPullRefreshListWithDiv();
		} else {
			//div模式
			initPullRefreshListWithDefault();
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
		//console.log('请求参数' + requestData);
		return requestData;
	}
	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		//console.log("改变数据 ：" + JSON.stringify(response));
		//定义临时数组
		var tempArray = [];
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
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
	function successCallbackFunc(response) {
		//console.log("成功请求数据：" + JSON.stringify(response));
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		//开始判断设备
		if (CommonUtil.os.plus) {
			if (UserAgentUtil.IOS_IPAD()) {
				//pad和ipad
				console.log("ipad版本");
				WindowUtil.firePageEvent("szpark_school_summary_pad.html", "refreshDetailData", {
					InfoID: infoID,
					CateNum: CateNum,
					Title: "学校荣誉"
				});
			} else if (UserAgentUtil.ANDROID_PAD()) {
				console.log("apad版本");
				WindowUtil.firePageEvent("szpark_school_summary_apad.html", "CustomerefreshListPage", {
					InfoID: infoID,
					CateNum: CateNum,
					Title: "学校荣誉"
				});
			} else {
				//android手机和iPhone手机
				WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
					InfoID: infoID,
					CateNum: CateNum,
					Title: "大事件"
				});
			}
		} else {
			//浏览器版
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: infoID,
				CateNum: CateNum,
				Title: "大事件"
			});
		}
	}

	/*
	 * @description 初始化下拉刷新控件
	 */
	function initPullRefreshListWithDefault() {
		PullrefreshUtil.initPullDownRefresh({
			//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
			IsDebug: true,
			//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			mDefaultInitPageNum: 0,
			mGetLitemplate: litemplate,
			mGetUrl: url,
			mGetRequestDataFunc: getData,
			mChangeResponseDataFunc: changeResponseDataFunc,
			mChangeToltalCountFunc: changeToltalCountFunc,
			mRequestSuccessCallbackFunc: successCallbackFunc,
			mOnItemClickCallbackFunc: onItemClickCallbackFunc,
			mGetDataOffLineFunc: null,
			ajaxSetting: {
				accepts: {
					json: "application/json;charset=utf-8"
				},
				contentType: "application/x-www-form-urlencoded"
			}
		});
	}
	/*
	 * @description 初始化下拉刷新控件(DIV安卓pad)
	 */
	function initPullRefreshListWithDiv() {
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				itemClickCallback: onItemClickCallbackFunc,
				changeToltalCountCallback: changeToltalCountFunc
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
	}

	//监听切换栏目刷新列表事件
	window.addEventListener('refreshListPageWithDiv', function() {
		console.log("刷新");
		pullToRefreshObject.refresh();
	});

});