/**
 * 作者：dailc 
 * 时间：2016-04-07 10:25:38
 * 描述： 学历教育列表页面 
 */
define(function(require, exports, module) {
	"use strict";
	//列表映射模板
	var litemplate = '<li class="mui-table-view-cell mui-media list-item "id="{{InfoID}}"><a href="javascript:;"><div class="mui-media-body"><span class="li-title">{{Title}}</span><p class="li-content">发布时间：{{InfoDate}}</p></div></a></li>';
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//产品列表接口
	var url = config.ServerUrl + "getinfolist";
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	//离线相关
	var beginIndex = 0;
	var sessionKey = null;
	var CateNum = null;
	
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
			catenum: "007008",
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
					//多条数据
					mui.each(InfoArray, function(key, value) {
						value.Title = unescape(value.Title);
						value.infocontent = unescape(value.infocontent);
						tempArray.push(value);
					});
				} else {
					//单条数据时
					InfoArray.Title = unescape(InfoArray.Title);
					InfoArray.infocontent = unescape(InfoArray.infocontent).replace(/<[^>]+>/g, "");
					if (InfoArray.infocontent == "null") {
						InfoArray.infocontent = "";
					}
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
		//开始判断设备
		if (CommonUtil.os.plus) {
			if (UserAgentUtil.IOS_IPAD()) {
				//pad和ipad
				console.log("ipad版本");

			} else if (UserAgentUtil.ANDROID_PAD()) {
				console.log("apad版本");
				WindowUtil.firePageEvent("szpark_academicEducation_index_apad.html", 'CustomerefreshListPage', {
					InfoID: infoID
				});
			} else {
				//android手机和iPhone手机
				WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
					InfoID: infoID,
					CateNum: CateNum,
					Title: "公告通知"
				});
			}
		} else {
			//浏览器版
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: infoID,
				CateNum: CateNum,
				Title: "公告通知"
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

	//自定义监听事件
	window.addEventListener('CustomrefreshListPage', function(e) {
		CateNum = e.detail.CateNum;
		WindowUtil.firePageEvent("szpark_academicEducation_list.html", "refreshListPage");
	});
});