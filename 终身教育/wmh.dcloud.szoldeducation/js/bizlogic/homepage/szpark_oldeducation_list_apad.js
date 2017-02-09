/**
 * 作者：朱晓琪
 * 时间：2016-05-16
 * 描述： 老年教育list页面 js pad  
 */
define(function(require, exports, module) {
	"use strict";
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入离线缓存模块
	var StorageUtil = require('core/MobileFrame/StorageUtil');
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
	var litemplate = '<li class="mui-table-view-cell mui-media"id="{{InfoID}}"><img class="mui-media-object mui-pull-left"data-img-localcache="{{HeadNewsAttachUrl}}"/><div class="mui-media-body"><h4 class="mui-ellipsis">{{Title}}</h4><p class="mui-h6 mui-ellipsis">发布时间：{{InfoDate}}</p></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	var guid = '';
	var sessionKey = null;
	var beginIndex = 0;
	//标题
	var TiTle = "养生餐饮";
	//008001   养生餐饮        008002   养生时讯
	var CateNum = "008001";
	var pullToRefreshObject;
	CommonUtil.initReady(function() {
		if (UserAgentUtil.ANDROID_PAD()) {
			//div模式
			initPullRefreshListWithDiv();
			//initPullRefreshListWithDefault();
		} else {
			//div模式
			
			initPullRefreshListWithDiv();
		}
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
		//console.log('请求参数' + requestData);
		return requestData;
	}
	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		console.log(response);
		//console.log("改变数据 ：" + JSON.stringify(response));
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
		if (CateNum == "008001") {
			litemplate = '<li class="mui-table-view-cell mui-media"id="{{InfoID}}"><img class="mui-media-object mui-pull-left"data-img-localcache="{{HeadNewsAttachUrl}}"/><div class="mui-media-body"><h4 class="mui-ellipsis">{{Title}}</h4><p class="mui-h6 mui-ellipsis">发布时间：{{InfoDate}}</p></div></li>';
		} else {
			litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><p class="mui-h6 mui-ellipsis">{{InfoDate}}</p></div></div></li>';
		}
		return litemplate;
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
	 * @description 列表请求成功回调
	 */
	function successCallbackFunc(response) {
		//console.log("请求数据成功" + JSON.stringify(response));
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
		WindowUtil.firePageEvent("szpark_oldeducation_index_apad.html", "CustomerefreshListPage", {
			infoID: infoID
		});
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
	};

	function initPullRefreshListWithDiv() {
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
				successRequestCallback:successCallbackFunc
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
	};
	
	window.addEventListener('CustomrefreshListPage', function(e) {
		console.log(e.detail.CateNum);
		CateNum = e.detail.CateNum;
		WindowUtil.firePageEvent("szpark_oldeducation_list_apad.html", "refreshListPage");
	});
});