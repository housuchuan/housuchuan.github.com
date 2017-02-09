/**
 * 作者：朱晓琪
 * 时间：2016-05-17
 * 描述：学员风采子页面 pad js
 */
define(function(require, exports, module) {
	"use strict"
	var url = config.ServerUrl + "olderpiclist";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//var litemplate = '<li class="mui-table-view-cell" id="{{ChannelGuid}}"><i class="Title" style="display:none">{{ChannelName}}</i><img data-img-localcache="{{IndexPic}}"/></li>';
	var litemplate = '<li class="mui-table-view-cell picCell"id="{{ChannelGuid}}"><i class="Title"style="display:none">{{ChannelName}}</i><div class="imgWrap w190"><div class="bg1"></div><div class="bg2"></div><div class="imgDiv"><div><img data-img-localcache="{{IndexPic}}"/><span style="float: right;z-index: 999;"class="PicCountPos">{{PicCount}}</span><span style="float: left;z-index: 1000;margin-bottom: 5px;"class="">{{ChannelName}}</span></div></div></div></li>';
	
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log(url);
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
				console.log(InfoArray);
				if (Array.isArray(InfoArray)) {
					//多条数据
					mui.each(InfoArray, function(key, value) {
						value.Title = unescape(value.Title);
						value.IndexPic = config.ServerUrl_Pic + value.IndexPic;
						//console.log(value.IndexPic);
						tempArray.push(value);
					});
				} else {
					//单条数据
					InfoArray.Title = unescape(InfoArray.Title);
					InfoArray.IndexPic = config.ServerUrl_Pic + InfoArray.IndexPic;
					//console.log(InfoArray.IndexPic);
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
		ImageLoaderFactory.lazyLoadAllImg();
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var channelguid = this.id;
		var Title = Zepto(".Title", this).text();
		WindowUtil.createWin('szpark_xyfc_detail_pad.html', 'szpark_xyfc_detail_pad.html', {
			ChannelGuid: channelguid,
			Title: Title
		});
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
		mGetDataOffLineFunc: null,
		ajaxSetting: {
			accepts: {
				json: "application/json;charset=utf-8"
			},
			contentType: "application/x-www-form-urlencoded"
		}
	});

});