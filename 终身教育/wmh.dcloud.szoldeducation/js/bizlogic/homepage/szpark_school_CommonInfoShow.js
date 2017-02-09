/**
 * 描述 :通用展示内容页面  如：学校简介 机构设置 交通信息
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 17:49:20
 */

define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var url = config.ServerUrl + "GetInfoDetailWithoutInfoID";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CateNum = "005001";
	CommonUtil.initReady(function() {
		//启动分类滑动条
		mui('#scroll').scroll({
			indicators: true, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		if (!WindowUtil.getExtraDataByKey("CateNum")) {
			CateNum = WindowUtil.getExtraDataByKey("CateNum");
		}
		ajaxDetailData();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: "0",
			pagesize: "1",
			CateNum: CateNum,
			isheadnews: "0",
			title: "",
			IsNeedUrl: "0",
			isvideo: "0",
			imgwidth: "100"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log("para" + requestData);
		//console.log("url" + url);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		UIUtil.closeWaiting();
		//console.log("学校概况："+CateNum + unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea) {
				var complexContent = unescape(response.EpointDataBody.DATA.UserArea.infocontent);
				//console.log("该导航信息展示： " + complexContent);
				Zepto("#content").html('');
				if(complexContent){
					Zepto("#content").append(complexContent);
					//HtmlUtil.appendComplexHtml(document.getElementById('content'), complexContent);
				}else if(complexContent==null&&!complexContent){
					Zepto("#content").append("本栏目暂无信息！");
				}
			}
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
	/**
	 * @description 自定义监听事件，刷新本页面
	 */
	window.addEventListener('refreshPage', function(e) {
		Zepto("#content").html('');
		//console.log("监听栏目编号"+e.detail.CateNum);
		if (e.detail.CateNum) {
			CateNum = e.detail.CateNum;
			ajaxDetailData();
		}
		//快速回滚到该区域顶部
		mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
	})

});