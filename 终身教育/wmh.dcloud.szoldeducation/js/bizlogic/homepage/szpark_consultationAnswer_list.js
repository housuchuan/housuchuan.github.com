/**
 * 作者：dailc 
 * 时间：2016-04-07 10:25:38
 * 描述： 咨询答疑列表 
 */
define(function(require, exports, module) {
	"use strict";
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	//列表映射模板
	var litemplate = '<li class="list-item" id="{{HistoryGuid}}"><i class="BoxGuid" style="display:none">{{BoxGuid}}</i><div class="ask-container"><span class="ask-title">咨询内容:</span><span class="ask-content">{{Content}}</span></div><div class="answer-container"><span class="answer-title">官方回复:</span><span class="answer-content">{{ReplyOpinion}}</span></div></li>';
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//下拉刷新
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');

	//产品列表接口
	var url = config.ServerUrl + 'answerlist';
	//每页显示条数
	var PageSize = 10;
	//离线相关
	var beginIndex = 0;
	var sessionKey = null;
	var CateNum = null;
	var totalNumCount = 0;
	var BoxGuid = null;
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		sessionKey = "KEY_ConsultationAnswer";
		beginIndex = CurrPage * PageSize;
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			pageindex: CurrPage,
			pagesize: PageSize,
			type: 1 //0:你问我答 1：咨询答疑 2：家长问答
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
				BoxGuid = response.EpointDataBody.DATA.UserArea.InfoList.BoxGuid
					//console.log("BoxGuid" + BoxGuid);
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
		//StorageUtil.OffLineAppCache.addListDataCache(sessionKey, response, beginIndex);
		if (CommonUtil.os.plus) {
			//plus状态下
			CommonUtil.plusReady(function() {
				WindowUtil.firePageEvent("szpark_academicEducation_index.html", "getBoxGuideEvent", {
					BoxGuid: BoxGuid
				});
			});
		} else {
			//非plus状态下
			window.parent.getBoxGuidCB({
				BoxGuid: BoxGuid
			});
		}
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var HistoryGuid = this.id;
		var BoxGuid = Zepto(".BoxGuid", this).text();
		//开始判断设备
		if (CommonUtil.os.plus) {
			if (UserAgentUtil.IOS_IPAD()) {
				//pad和ipad
				console.log("ipad版本");

			} else if (UserAgentUtil.ANDROID_PAD()) {
				console.log("apad版本");
				WindowUtil.firePageEvent("szpark_academicEducation_index_apad.html", "CustomerefreshListPage_apad", {
					HistoryGuid: HistoryGuid,
					BoxGuid: BoxGuid
				});
			} else {
				//android手机和iPhone手机
				WindowUtil.createWin('szpark_consultationAnswer_detail.html', 'szpark_consultationAnswer_detail.html', {
					HistoryGuid: HistoryGuid,
					BoxGuid: BoxGuid
				});
			}
		} else {
			//浏览器版
			WindowUtil.createWin('szpark_consultationAnswer_detail.html', 'szpark_consultationAnswer_detail.html', {
				HistoryGuid: HistoryGuid,
				BoxGuid: BoxGuid
			});
		}
	};
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
	//自定义监听事件
	window.addEventListener('CustomrefreshListPage', function(e) {
		CateNum = e.detail.CateNum;
		//console.log("XXXXXXXXXXXXXX" + CateNum);
		WindowUtil.firePageEvent("szpark_consultationAnswer_list.html", "refreshListPage");
	});
});