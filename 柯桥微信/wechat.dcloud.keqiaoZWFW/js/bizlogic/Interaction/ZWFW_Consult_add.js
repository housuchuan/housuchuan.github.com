/**
 * 作者: ykx
 * 时间: 2016年8月30日
 * 描述: 新增咨询
 */
define(function(require, exports, moddive) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//token值
	var Token = '';
	var userguid = '';
	var loginid = '';
	var textareaval = '';
	var taskGuid = '';
	var OpenID = '';
	var url = '';
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
			taskGuid = WindowTools.getExtraDataByKey("taskGuid");
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				//通过OpenID获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					userguid = UserGuid;
					loginid = LoginID;
					Zepto('#tijiao').on('tap', function() {
						textareaval = Zepto('#textarea').val();
						if(textareaval == "") {
							mui.toast("所填内容不能为空！");
						} else {
							submitcont(textareaval);
						}
					})
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});

	};
	var submitcont = function(textareaval) {
		Config.GetToken(function(token) {
			Token = token;
			url = Config.serverUrl + '/Consult/ConsultSubmit';
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				ConsultType: "21",
				Question: textareaval,
				AskerLoginId: loginid,
				TaskGuid: taskGuid,
				AskerUserGuid: userguid
			};
			requestData.paras = data;
			requestData = JSON.stringify(requestData);
			console.log('请求数据:' + JSON.stringify(requestData));
			mui.ajax(url, {
				data: requestData,
				dataType: "json",
				type: "POST",
				success: function(response) {
					if(response.ReturnInfo.Code == "0") {
						alert(response.ReturnInfo.Description);
						return false;
					}
					if(response.BusinessInfo.Code == "0") {
						alert(response.BusinessInfo.Description);
						return false;
					}
					var data = {
						UserPK: OpenID
					}
					Config.getProjectBasePath(function(bathpath) {
						var bathpath = bathpath;
						console.log(bathpath)
						var openurl = 'html/Interaction/ZWFW_Consult_Success.html';
						var url = bathpath + openurl + '?UserPK=' + OpenID;
						console.log(openurl);
						WindowTools.createWin('detail2', url, OpenID);
					});
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response))
				}
			});
		});
	};
});