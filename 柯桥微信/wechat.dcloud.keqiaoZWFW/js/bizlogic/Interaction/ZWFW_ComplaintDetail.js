/**
 * 作者: 
 * 时间: 
 * 描述:  
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	var OpenID = '';
	var Token = '';
	var RowGuid = '';
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			RowGuid = WindowTools.getExtraDataByKey("RowGuid");
			//获取token
			config.GetToken(function(token) {
				console.log(token);
				//通过openid获取用户信息
				Token = token;
				getdetail();
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});

		});
	}

	function getdetail() {
		var url = config.serverUrl + "/Consult/GetAuditConsultDetail";
		var requestData = {
			ValidateData: Token,
			paras: {
				RowGuid: RowGuid
			}
		}
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				console.log('初始化办件请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.ReturnInfo.Code == "0") {
					mui.toast(rtnData.ReturnInfo.Description);
					return;
				}
				if(rtnData.BusinessInfo.Code == "0") {
					mui.toast(rtnData.BusinessInfo.Description);
					return;
				}
				Zepto("#QUESTION").html(rtnData.UserArea.QUESTION);

				Zepto("#ANSWER").html(rtnData.UserArea.ANSWER);

			}
		});
	}
});