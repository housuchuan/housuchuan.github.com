/**
 * 作者：dailc 
 * 时间：2016-04-07 10:06:43
 * 描述： 调查列表页面 
 */
define(function(require, exports, module) {
	"use strict";
	//列表映射模板
	var litemplate = '<li class="list-item" id="{{QuestionnaireID}}"><span class="li-title">{{QuestionnaireName}}</span><span class="li-time">{{EndDate}}</span></li>';
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//产品列表接口
	var url = config.ServerUrl + "questionnairelist";
	//每页显示条数
	var PageSize = 10;
	//缓存相关
	var sessionKey = null;
	var beginIndex = 0;
	var totalNumCount = 0;
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		sessionKey = "getInvestigationListKey";
		beginIndex = CurrPage * PageSize;
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			pageindex: CurrPage,
			pagesize: PageSize,
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
						value.QuestionnaireName = unescape(value.QuestionnaireName);
						tempArray.push(value);
					});
				} else {
					InfoArray.QuestionnaireName = unescape(InfoArray.QuestionnaireName);
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
	/**
	 * @description 事项item点击回调
	 * @param {Event} e
	 */
	function onItemClickCallbackFunc(e) {
		var QuestionnaireID = this.id;
		var title = Zepto(".li-title", this).text();
		WindowUtil.createWin("szpark_investigation_submit.html", 'szpark_investigation_submit.html', {
			QuestionnaireID: QuestionnaireID,
			Title: title
		});
	}
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
		mDefaultInitPageNum: 1,
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