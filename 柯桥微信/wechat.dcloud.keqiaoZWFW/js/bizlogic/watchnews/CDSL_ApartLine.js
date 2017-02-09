/**
 * 作者: ykx
 * 时间: 2016年8月12日
 * 描述: 列表
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	//搜索值
	var searchValue = '';
	var Token = '';
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
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getData();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			next1();
			submit();
		});

	}
	var getData = function() {
		var url = Config.serverUrl + '/Queue/GetWaitCountbyLobby';
		var litemplate =
			'<li class="mui-table-view-cell content-list" id="{{LobbyType}}" name="{{LobbyName}}"><img src="{{img}}" /><span class="tittle">{{LobbyName}}</span><div class="content-right"><span class="number">{{WaitCount}}</span><span>人</span></div></li>';
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {

		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData)
		console.log('请求数据:' + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				console.log(JSON.stringify(response));
				if(response.ReturnInfo.Code == "0") {
					mui.toast(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					mui.toast(response.BusinessInfo.Description);
					return false;
				}
				var outdata = response.UserArea.LobbyList;
				for(var i = 0; i < outdata.length; i++) {
					outdata[i].LobbyInfo.img = '../../img/watchnews/IMG_tit2.png';
					var output = Mustache.render(litemplate, outdata[i].LobbyInfo);
					Zepto('#listdata').append(output);
				};
				console.log(output);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
		return requestData;
	};
	var submit = function() {
		var btn = Zepto('#tijiao');
		btn.on('tap', function() {
			Zepto('#listdata').empty();
			getData();
		})
	}

	var next1 = function() {
		Zepto('#listdata').on('tap', '.content-list', function() {
			console.log(Zepto(this).attr('name'));
			var name = Zepto(this).attr('name')
			var url = 'CDSL_LineDetail.html?LobbyType=' + this.id + '&name=' + name;
			mui.openWindow({
				url: url
			})
		})
	}
});