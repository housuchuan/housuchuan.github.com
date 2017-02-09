/**
 * 作者: ykx
 * 时间: 2016年8月12日
 * 描述: 排队详情
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
	var InfoID = '';
	var searchValue = '';
	var Token = '';
	var flag = 1;
	//排队号
	var QNO = '';
	//
	var LobbyType = '';
	var name='';
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
			LobbyType = WindowTools.getExtraDataByKey('LobbyType');
			name = WindowTools.getExtraDataByKey('name');
			Zepto('#template').text(name);
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getData();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});

			submit();
			//搜索
			mui('#search').on('change', '#TaskName', function() {
				searchAction();
			});
			mui('#search').on('tap', '#input-searchName', function() {
				searchAction();
			});
		});

	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {
		Zepto('#litemplate').html('');
		QNO = document.getElementById('TaskName').value;
		//刷新QNO
		console.log("搜索:" + QNO);
		getData();

	}
	var getData = function() {
		var url = Config.serverUrl + '/Queue/GetWindowListByLobby';
		var litemplate =
			'<li class="status_view"><p class="tit-blue">{{WindowNO}}</p><p class="tit-black">{{WindowName}}</p><div class="realstatus"><span class="state">当前</span><span class="line-red">{{HandleNO}}</span></div><div class="realstatusright"><span class="state">等待</span><span class="line-red">{{WindowWaitNum}}</span></div></li>';
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {
			LobbyType: LobbyType,
			QNO: QNO
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData)
			//mock完成后回调函数
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
				Zepto('#litemplate').empty();
				var outdata = response.UserArea.WindowList;
				for(var i = 0; i < outdata.length; i++) {
					var output = Mustache.render(litemplate, outdata[i].WindowInfo);
					Zepto('#litemplate').append(output);
				};

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

			getData();
		})
	}
});