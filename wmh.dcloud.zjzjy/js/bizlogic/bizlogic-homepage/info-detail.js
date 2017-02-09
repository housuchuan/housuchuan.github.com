/**
 * 作者: dailc
 * 时间: 2016-06-07
 * 描述:  图片轮播工具类
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//声明变量
	var InfoID = '',
		CateNum = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/core/sea.min.js',
			'js/libs/zepto.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			InfoID =  WindowTools.getExtraDataByKey('infoId');
			CateNum =  WindowTools.getExtraDataByKey('cateNum');
			initListeners();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('.mui-scroll-wrapper').scroll({
			indicators: true, //是否显示滚动条
		});
		//初始化详情数据
		ajaxDetailInfo();
	};
	
	/**
	 * @description 请求信息详情数据
	 */
	var ajaxDetailInfo = function() {
		var url = config.serverUrl + 'GetInfoDetail';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			InfoID: InfoID,
			CateNum: CateNum,
			IsNeedUrl: '0',
			isvideo: '0',
			imgwidth: '200',
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxx"+url);
		console.log("xxxxxxxx"+requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("-----------"+JSON.stringify(response));
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				console.log("xxxxxxxxxxxxxx"+unescape(response.EpointDataBody.DATA.UserArea.infocontent));
				Zepto('.detail-hd h4').text(unescape(response.EpointDataBody.DATA.UserArea.title));
				Zepto('.detail-hd p').text(unescape(response.EpointDataBody.DATA.UserArea.infodate));
				Zepto('.detail-content').html('');
				Zepto('.detail-content').append(unescape(response.EpointDataBody.DATA.UserArea.infocontent));
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};
	
	
	
});