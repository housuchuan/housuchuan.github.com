/**
 * 作者: daike
 * 时间: 2016-09-01
 * 描述: 用户绑定
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	//下一个页面的url地址
	var URL = '';
	var UserName = '';
	var Password = '';
	var Token = '';
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
			OpenID = WindowTools.getExtraDataByKey("UserPK")||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			encodeURIComponent()
			URL = decodeURIComponent(WindowTools.getExtraDataByKey("URL"));
			console.log(URL);
			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token;
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			//点击绑定
			Zepto('#bind').on('tap', function() {
				UserName = document.getElementById("labLoginID").value;
				Password = document.getElementById("labPassword").value;
				if(UserName == '') {
					UITools.toast('用户名不能为空!');
					return;
				}
				if(Password == '') {
					UITools.toast('密码不能为空!');
					return;
				}
				config.GetToken(function(token) {
					//console.log(token);
					Token = token;
					initBJinfo();
				});
			});
			//点击注册
			Zepto('#register').on('tap', function() {
				mui.openWindow({
					url: 'ZWFW_register.html?UserPK=' + OpenID + '&URL=' + encodeURIComponent(URL)
				})
			});
		});
	}
	/**
	 * 绑定信息
	 */
	function initBJinfo() {
		//var url = config.serverUrl + "/User/userBind";
		var url = 'http://220.191.226.70:8080/kqzwwwapin/User/userBind';
		var requestData = {
			ValidateData: Token,
			paras: {
				UserName: UserName,
				Password: Password,
				OpenID: OpenID
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
				UITools.alert({
					content: '绑定成功'
				}, function() {
					//console.log(URL);
					//console.log(typeof(URL));
					if(URL == "undefined" || URL == '' || URL == "null") {

						mui.openWindow({
							url: 'ZWFW_mangermant.html?UserPK=' + OpenID
						})

					} else {
						mui.openWindow({
							url: URL
						})

					}
				});

			}
		});
	}
});