/**
 * 作者：sunzl 
 * 时间：2016-04-11 09:06:43
 * 描述： 你问我答列表页 
 */
define(function(require, exports, module) {
	"use strict";
	//列表映射模板
	var litemplate = '<li class="mui-table-view-cell" id={{InfoID}}><i class="infotype" style="display:none">{{infotype}}</i><i class="urlLink" style="display:none">{{url}}</i><span>{{Title}}</span></li>';
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//引入缓存模块
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//机构列表接口
	var url = config.ServerUrl + "getinfolist";
	//每页显示条数
	var PageSize = 15;
	var totalNumCount = 0;
	//离线相关
	var beginIndex = 0;
	var sessionKey = null;
	//搜索内容
	var searchContent = "";
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
			catenum: "003",
			isheadnews: "0",
			title: searchContent
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
		console.log("改变数据 ：\n" + unescape(JSON.stringify(response)));
		//定义临时数组
		var tempArray = [];
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if (Array.isArray(InfoArray)) {
					mui.each(InfoArray, function(key, value) {
						//						if ("Link" == value.infotype) {
						value.Title = unescape(value.Title);
						tempArray.push(value);
						//						}
					});
				} else {
					InfoArray.Title = unescape(InfoArray.Title);
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
	 * @description 获取离线数据
	 */
	function getDataOffLineFunc(url, data) {
		//console.log(url + data);
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
		//StorageUtil.OffLineAppCache.addListDataCache(sessionKey, response, beginIndex);
		//console.log("获取离线数据：" + JSON.stringify(StorageUtil.OffLineAppCache.getOffLineCache(sessionKey)));
	};
	/**
	 * @description 事项item点击回调
	 * @param {Event} e
	 */
	function onItemClickCallbackFunc(e) {
		var InfoID = this.id;
		var urlLink = Zepto(this).find(".urlLink").text();
		var infotype = Zepto(this).find(".infotype").text();
		var Title = Zepto(this).find("span").text();
		console.log("类型：                          " + infotype);
		if (infotype == "Link") {
			//链接时（Link），全部打开链接地址
			WindowUtil.createWin("szpark_institution_detail.html", 'szpark_institution_detail.html', {
				URL: urlLink,
				Title: Title
			});
		} else {
			//非链接时（Attach、News）全部跳入详情页面
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: InfoID,
				CateNum: "003",
				Title: Title
			});
		}
	}
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
		mGetDataOffLineFunc: null,
		ajaxSetting: {
			accepts: {
				json: "application/json;charset=utf-8"
			},
			contentType: "application/x-www-form-urlencoded"
		}
	});

	//搜索框监听事件
	window.addEventListener('searchEventName', function(e) {
		searchContent = e.detail.searchContent;
		console.log("搜索关键字：" + searchContent);
		if (!searchContent) {
			searchContent = "";
		}
		WindowUtil.firePageEvent("szpark_institution_list.html", 'refreshListPage');
	});

});