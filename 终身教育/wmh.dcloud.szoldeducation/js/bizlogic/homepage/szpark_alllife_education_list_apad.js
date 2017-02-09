/*
 * 作者 : 朱晓琪
 * 时间 : 2016-04-06 15:45:22
 * 描述 : 终身教育list页面 pad
 */
define(function(require, exports, module) {
	"use strict";
	//引入下拉刷新模块
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//详情页面引入模块
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	//接口地址
	var url = config.ServerUrl + 'getinfolist';
	//列表模板
	var litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
	//每页显示条数
	var PageSize = 10;
	var totalNumCount = 0;
	//010001研究所简介010002科研动态010003政策文献010004科研讲坛010005研究成果
	var CateNum = null;
	var Title = "终身教育研究所";
	//刷新全局对象
	var pullToRefreshObject;
//	CommonUtil.initReady(function() {
//		initPullRefreshListWithDiv();
//	});
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
		return requestData;
	};
	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
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
					value.Title = unescape(value.Title);
					value.infocontent = unescape(value.infocontent);
					tempArray.push(value);
				});
			}
		}
		return tempArray;
	};

	function geLitemplate() {
		litemplate = '<li class="mui-table-view-cell" id="{{InfoID}}"><div class="notice-txt2"><span>{{Title}}</span><span>发布时间：{{InfoDate}}</span></div></li>';
		return litemplate;
	};
	/**
	 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
	 */
	function changeToltalCountFunc() {
		return totalNumCount;
	};

	/**
	 * @description 列表请求成功回调
	 */
	function successCallbackFunc(response) {
		//图片懒加载
		ImageLoaderFactory.lazyLoadAllImg();
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = this.id;
		WindowUtil.firePageEvent("szpark_alllife_education_index_apad.html", "refreshDetailsPage", {
			infoID: infoID
		});
	};
	//div安卓pad个性化刷新
//	function initPullRefreshListWithDiv() {
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
				successRequestCallback: successCallbackFunc
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1'
		}, function(pullToRefresh) {
			console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
//			pullToRefreshObject.refresh();
		});
//	};
	//点击栏目监听（刷新列表监听）
	window.addEventListener('CustomrefreshListPage', function(e) {
		console.log("刷新"+e.detail.CateNum);
		CateNum = e.detail.CateNum;
		console.log();
		pullToRefreshObject.refresh();
	});
});