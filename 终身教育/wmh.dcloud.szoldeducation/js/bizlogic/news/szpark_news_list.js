/*
 * 作者 : 黄赟博
 * 时间 : 2016-04-06 15:45:22
 * 描述 : 新闻公告子页面
 */
define(function(require, exports, module) {
	"use strict";
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入离线缓存模块
	var StorageUtil = require('core/MobileFrame/StorageUtil');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell"id="{{InfoID}}"><div class="mui-table"><div class="mui-table-cell mui-col-xs-10"><h4 class="mui-ellipsis">{{Title}}</h4><p class="mui-h6 mui-ellipsis">{{InfoDate}}</p></div></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	var guid = '';
	var sessionKey = null;
	var beginIndex = 0;
	//标题
	var TiTle = "学习新闻";
	//新闻公告--栏目编号--CateNum002：新闻公告;002001：学习新闻;002002区域动态;002003：公告新闻;002004：图片新闻
	var CateNum = "002001";
	//是否设置标题图片，“1”代表 是；“0”代表 否
	var isheadnews = "0";
	CommonUtil.initReady(function() {
		//快速回滚到该区域顶部
		//mui('#pullrefresh').scroll().scrollTo(0, 300, 100); //100毫秒滚动到顶
		//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		Zepto(".mui-control-item").first().addClass('suzhou_school_active');
		Zepto("#sliderSegmentedControl2").css('width', 100 * 4);
		//判断android、ios以及手机浏览器列表显示兼容问题
		if (CommonUtil.os.plus) {
			//IOS
			if (CommonUtil.os.ios) {
				Zepto("#pullrefresh").css('margin-top', '40px');
				Zepto(".mui-pull-top-pocket").css('top', '40px');
			} else {
				//Android 什么都不做

			}
		} else {
			//手机浏览器
			Zepto("#pullrefresh").css('top', '40px');
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
			isheadnews: isheadnews,
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
						if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
							value.HeadNewsAttachUrl = "../../img/MobileFrame/img_error.jpg";
						}
						//value.HeadNewsAttachUrl = "https://img.alicdn.com/imgextra/i4/698360784/TB21UhfdVXXXXczXXXXXXXXXXXX_!!698360784.jpg";
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
					//单条数据
					if (InfoArray.HeadNewsAttachUrl == null || InfoArray.HeadNewsAttachUrl == "") {
						InfoArray.HeadNewsAttachUrl = "../../img/MobileFrame/img_error.jpg";
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

	function geLitemplate() {
		if (CateNum == "002004") {
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
		//手动强制启动h5浏览器方式加载图片
		ImageLoaderFactory.lazyLoadAllImg(true);
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		WindowUtil.createWin('szpark_news_detail.html', 'szpark_news_detail.html', {
			InfoID: infoID,
			CateNum: CateNum,
			Title: TiTle
		});
	}
	/**
	 * @description 栏目点击切换样式
	 */
	Zepto('.mui-control-item').on('tap', function(e) {
		CateNum = this.id;
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		if (this.innerText == "学习新闻") {
			TiTle = "学习新闻";
			isheadnews = "0";
			//console.log("是否为标题图片："+isheadnews);
		} else if (this.innerText == "区域动态") {
			TiTle = "区域动态";
			isheadnews = "0";
			//console.log("是否为标题图片："+isheadnews);
		} else if (this.innerText == "公告消息") {
			TiTle = "公告消息";
			isheadnews = "0";
			//console.log("是否为标题图片："+isheadnews);
		} else {
			TiTle = "图片新闻";
			isheadnews = "1";
			//console.log("是否为标题图片："+isheadnews);
		}
		WindowUtil.firePageEvent('szpark_news_list.html', 'refreshListPage');
		//快速回滚到该区域顶部
		if (CommonUtil.os.plus) {
			//IOS
			if (CommonUtil.os.ios) {
				Zepto("#pullrefresh").css('margin-top', '40px');
			} else {
				//Android 什么都不做
			}
		} else {
			//手机浏览器
			//mui('#pullrefresh').scroll().scrollTo(0, 45, 100); //100毫秒滚动到顶
		}
	});

	/*
	 * @description 初始化下拉刷新控件
	 */
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
});