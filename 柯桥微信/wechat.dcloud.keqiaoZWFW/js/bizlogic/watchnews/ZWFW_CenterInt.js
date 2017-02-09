/**
 * 作者: lb
 * 时间: 2016-08-26 
 * 描述: 中心简介js
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	//var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	//var pullToRefreshObj;
	//token值
	var Token = '';
	//搜索值
	var Affairs_TypeID = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			//初始化
			console.log("初始化");
			//获取token
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getData();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});

		});
	}
	var getData = function() {
		var url = Config.extraServerUrl + '/CenterInformation_KQ/GetZXJJDetail';
		//var url =Config.serverUrl+ 'centerint'
		var litemplate =
			'{{{InfoContent}}}';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			Affairs_TypeID: Affairs_TypeID
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		//某一些接口是要求参数为字符串的
		//requestData = JSON.stringify(requestData);
		console.log('url:' + url);
		console.log('请求数据:' + requestData);

		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				//console.log(JSON.stringify(response));
				var outdata = response.UserArea;
				console.log(JSON.stringify(outdata));
				var output = Mustache.render(litemplate, outdata);
				if(response.ReturnInfo.Code == "0") {
					alert(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					alert(response.BusinessInfo.Description);
					return false;
				}
				Zepto('.notice-info').append(output);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});