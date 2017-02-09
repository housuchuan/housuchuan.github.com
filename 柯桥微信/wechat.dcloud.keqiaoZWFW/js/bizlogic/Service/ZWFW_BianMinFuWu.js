/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项查看详情页 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	var UserPK = '';
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
			'js/libs/zepto.min.js',
		], function() {
			if(WindowTools.getExtraDataByKey('UserPK')) {
				UserPK = WindowTools.getExtraDataByKey('UserPK');
			}
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//token验证
			Config.GetToken(function(token) {
				console.log('token:' + token);
				ajaxData(token);
			});
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}
	/**
	 * @description 获取服务
	 */
	function ajaxData(token) {
		var url = Config.serverUrl + '/TaskKind/GetTaskKindsByCodeName';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			CodeName: '便民服务'
		}
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("便民服务url"+url);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UITools.closeWaiting();
				console.log("success");
				console.log('便民服务返回数据：'+JSON.stringify(response));
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
					var tmpInfo = response.UserArea.ItemList;
					var lastInfo = [];
					for(var i = 0; i < tmpInfo.length; i++) {
						lastInfo[i] = tmpInfo[i].ItmeInfo;
					}
					var litemplate = "<li class='affairs-item'><a href='{{ItemValue}}'class='affairs-item-icon'style='background: url({{ItemUrl}});background-size: 50px 50px;'></a><a href='{{ItemValue}}'class='affairs-item-name'>{{ItemText}}</a></li>";
					Zepto("#iteminfo").html('');
					var html = ''
						//遍历数组
					mui.each(lastInfo, function(key, value) {
						if(value) {
							html += Mustache.render(litemplate, value);
						}
					});
					if(html) {
						Zepto("#iteminfo").append(html);
					}
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
});