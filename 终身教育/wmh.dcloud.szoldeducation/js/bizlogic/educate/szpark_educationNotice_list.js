/**
 * 描述 :通知公告子页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 16:51:38
 */
define(function(require, exports, module) {
	"use strict"
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入离线缓存模块
	var StorageUtil = require('core/MobileFrame/StorageUtil');
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell" id={{InfoID}}><i class="catenum" style="display:none;">{{CateNum}}</i><div class="notice-txt2"><span>{{Title}}</span><span>发布日期：{{InfoDate}}</span></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	//离线相关
	var beginIndex = 0;
	var sessionKey = null;
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
			catenum: "066002",
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
					//多条数据时
					mui.each(InfoArray, function(key, value) {
						if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
							value.HeadNewsAttachUrl = "../../img/educate/img_noticepic.png";
						}
						value.Title = unescape(value.Title);
						value.infocontent = unescape(value.infocontent);
						tempArray.push(value);
					});
				} else {
					//单条数据时
					if (InfoArray.HeadNewsAttachUrl == null || InfoArray.HeadNewsAttachUrl == "") {
						InfoArray.HeadNewsAttachUrl = "../../img/educate/img_noticepic.png";
					}
					InfoArray.Title = unescape(InfoArray.Title);
					InfoArray.infocontent = unescape(InfoArray.infocontent);
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
	 * @description 成功回调
	 * @param {Object} response
	 */
	function successCallbackFunc(response) {
		//console.log("成功请求数据：" + JSON.stringify(response));
		StorageUtil.OffLineAppCache.addListDataCache(sessionKey, response, beginIndex);
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		var CateNum = Zepto(this).find(".catenum").text();
		WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
			InfoID: infoID,
			CateNum: CateNum,
			Title: "通知公告"
		});
	};
	/**
	 * @description 页面间的刷新回调
	 */
	window.addEventListener('refreshFunc', function() {
		refreshSelf();
	});

	function refreshSelf() {
		WindowUtil.firePageEvent('suzhou_basicInfoQuery_list.html', 'refreshListPage');
	};
	/*
	 * @description 初始化下拉刷新控件
	 */
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
		mGetDataOffLineFunc: getDataOffLineFunc,
		ajaxSetting: {
			accepts: {
				json: "application/json;charset=utf-8"
			},
			contentType: "application/x-www-form-urlencoded"
		}
	});

});