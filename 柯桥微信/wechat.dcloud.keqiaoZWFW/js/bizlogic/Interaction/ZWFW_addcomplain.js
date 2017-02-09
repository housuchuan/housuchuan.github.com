/**
 * 作者: ykx
 * 时间: 2016年8月30日
 * 描述: 新增咨询
 */
define(function(require, exports, moddive) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//token值
	var Token = '';
	var userguid = '';
	var loginid = '';
	var taskGuid = WindowTools.getExtraDataByKey("taskGuid");
	var OpenId = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
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
			OpenId = WindowTools.getExtraDataByKey("UserPK");
			//初始化
			console.log("初始化");
			//获取token与其他id
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				Config.getUserguidbyOpenID(Token, OpenId, function(LoginID, UserGuid, tips) {
					userguid = UserGuid;
					loginid = LoginID;
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			Zepto('#tijiao').on('tap', function() {
				var content = Zepto('#textarea').val();
				if(content == "") {
					mui.toast("所填内容不能为空！");
				} else {
					Config.GetToken(function(token) {
						//console.log(token);
						Token = token;
						submitcont(content);
					});

				}
			})

		});

	};
	var submitcont = function(content) {
		var url = Config.serverUrl + '/Consult/ConsultSubmit';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			ConsultType: "31",
			Question: content,
			AskerLoginId: loginid,
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
					UserPK: OpenId
				}
				Config.getProjectBasePath(function(bathpath) {
					var bathpath = bathpath;
					console.log(bathpath)
					var openurl = 'html/Interaction/ZWFW_complainsuccess.html';
					var url = bathpath + openurl + '?UserPK=' + OpenId;
					console.log(openurl);
					WindowTools.createWin('detail2', url, OpenId);
				});
				//					WindowTools.createWin('test', '', data);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});