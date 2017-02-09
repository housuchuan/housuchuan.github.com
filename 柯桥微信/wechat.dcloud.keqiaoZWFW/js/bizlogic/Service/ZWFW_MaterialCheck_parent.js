/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项搜索父页面 
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
	var TaskGuid = '';
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
			if(WindowTools.getExtraDataByKey('TaskGuid')) {
				TaskGuid = WindowTools.getExtraDataByKey('TaskGuid');
			}
			//获取http根目录
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//获取token
			Config.GetToken(function(token) {
				ajaxTotal(token);
			});
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}

	/**
	 * @description 请求材料条数
	 */
	function ajaxTotal(token) {
		var url = Config.serverUrl + '/AuditTask/GetTaskDetail';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			TaskGuid: TaskGuid
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(url + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("success");
				console.log(JSON.stringify(response));
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1) {
					if(Array.isArray(response.UserArea.MatericalList)) {
						var total = response.UserArea.MatericalList.length;
						var outData = [];
						for(var i = 0; i < response.UserArea.MatericalList.length; i++) {
							outData[i] = response.UserArea.MatericalList[i].MatericalInfo;
						}
						var litemplate =
							'<li class="mui-table-view-cell"id="{{MaterialGuid}}"><a class="mui-navigate-right">{{MatericalName}}</a></li>';
						Zepto("#listdata").html('');
						var html = ''
							//遍历数组
						mui.each(outData, function(key, value) {
							if(value) {
								html += Mustache.render(litemplate, value);
							}
						});
						if(html) {
							Zepto("#listdata").append(html);
						}
					}
					Zepto('#totalnum').text(total);
				} else {
					UITools.toast('请求事项出错');
				}
			},
			error: function(error) {
				console.log("error");
				console.log(JSON.stringify(error));
				UITools.toast('请求事项出错');
			}
		});
	}
});