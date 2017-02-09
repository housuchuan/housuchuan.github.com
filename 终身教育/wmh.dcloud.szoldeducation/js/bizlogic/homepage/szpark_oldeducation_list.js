/**
 * 作者：dailc 
 * 时间：2016-04-07 10:25:38
 * 描述： 学历教育列表页面 
 */
define(function(require, exports, module) {
	"use strict";
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	var litemplate = '<li class="mui-table-view-cell mui-media list-item "id="{{InfoID}}"><a href="javascript:;"><img class="mui-media-object mui-pull-left"data-img-localcache="{{HeadNewsAttachUrl}}"><div class="mui-media-body"><span class="li-title">{{Title}}</span><p class="li-content">发布时间：{{InfoDate}}</p></div></a></li>';
	//产品列表接口
	var url = config.ServerUrl + "getinfolist";
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	//离线相关
	var beginIndex = 0;
	var sessionKey = null;
	//栏目
	var CateNum = null;
	//是否设置图片标题
	var isheadnews = "1";
	var Title = "养生餐饮";
	CommonUtil.initReady(function() {
		CateNum = WindowUtil.getExtraDataByKey("CateNum");
		isheadnews = WindowUtil.getExtraDataByKey("isheadnews");
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
			isheadnews: isheadnews,
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
							value.HeadNewsAttachUrl = "../../img/educate/img_project1.png";
						}
						value.Title = unescape(value.Title);
						value.infocontent = unescape(value.infocontent);
						tempArray.push(value);
					});
				} else {
					if (InfoArray.HeadNewsAttachUrl == null || InfoArray.HeadNewsAttachUrl == "") {
						InfoArray.HeadNewsAttachUrl = "../../img/educate/img_project1.png";
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
		ImageLoaderFactory.lazyLoadAllImg(true);
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
			InfoID: infoID,
			CateNum: CateNum,
			Title: Title
		});
	};
	//选择模板
	function getLitemplate() {
		//console.log('模板:'+litemplate);
		//列表映射模板
		if (CateNum == "008001") {
			//养生餐饮
			litemplate = '<li class="mui-table-view-cell mui-media list-item "id="{{InfoID}}"><a href="javascript:;"><img class="mui-media-object mui-pull-left"data-img-localcache="{{HeadNewsAttachUrl}}"><div class="mui-media-body"><span class="li-title">{{Title}}</span><p class="li-content">发布时间：{{InfoDate}}</p></div></a></li>';
		} else {
			//养生时讯
			litemplate = '<li class="mui-table-view-cell mui-media list-item "id="{{InfoID}}"><a href="javascript:;"><div class="mui-media-body"><span class="li-title">{{Title}}</span><p class="li-content">发布时间：{{InfoDate}}</p></div></a></li>';
		}
		return litemplate;
	}
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
		mDefaultInitPageNum: 0,
		mGetLitemplate: getLitemplate,
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
	//自定义刷新事件
	window.addEventListener('CustomrefreshListPage', function(e) {
		CateNum = e.detail.CateNum;
		Title = e.detail.Title;
		isheadnews = e.detail.isheadnews;
		WindowUtil.firePageEvent("szpark_oldeducation_list.html", "refreshListPage");
		//快速回滚到该区域顶部
		//mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
	});
});