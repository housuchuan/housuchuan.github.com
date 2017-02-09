/**
 * 作者: lb
 * 时间: 2016-08-26 
 * 描述: 中心新闻详情js
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	//var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//token值
	var Token = '';
	//下拉刷新对象
	//var pullToRefreshObj;
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
		var value = WindowTools.getExtraDataByKey('InfoID');
		var url = Config.serverUrl + '/CenterInformation/GetCategoryDetail';
		//var url =Config.serverUrl+ 'centernewsinfo';
		var litemplate =
			'<div class="details-hd"><h1 id="title">{{Title}}</h1><div class="publishing-unit mui-clearfix"><span class="unit-name" id="Author">{{Author}}</span><span class="publishing-time" id="InfoDate">{{InfoDate}}</span></div></div><div ><span id="InfoContent">{{{InfoContent}}}</span></div>';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			//每个列表的id
			InfoID: value
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		//某一些接口是要求参数为字符串的
		//requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		console.log('请求数据:' + JSON.stringify(requestData));

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
				Zepto('.mui-content').append(output);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});