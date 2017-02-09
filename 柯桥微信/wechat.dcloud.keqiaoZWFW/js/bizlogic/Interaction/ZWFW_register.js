/**
 * 作者: daike
 * 时间: 2016-09-01
 * 描述: 注册
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var OpenID = 'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
	//下一个页面的url地址
	var URL = '';
	var UserName = '';
	var Password = '';
	var secPassword = '';
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
			//OpenID = WindowTools.getExtraDataByKey("UserPK");
			URL = WindowTools.getExtraDataByKey("URL");
			console.log(decodeURIComponent(URL))
				//获取token
			config.GetToken(function(token) {
				//console.log(token);
				Token = token;
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			//点击绑定
			Zepto('#register').on('tap', function() {

				UserName = document.getElementById("labLoginID").value;
				Password = document.getElementById("labPassword").value;
				secPassword = document.getElementById("labPassword2").value;
				if(UserName == '') {
					UITools.toast('用户名不能为空!');
					return;
				}
				if(Password == '') {
					UITools.toast('密码不能为空!');
					return;
				}
				if(UserName.length < 3 || UserName.length > 20) {
					UITools.toast('用户名长度不能少于3位或者大于20位！');
					return;
				}
				if(Password != secPassword) {
					UITools.toast('两次输入密码不一致!');
					return;
				}
				if(Password.length < 6) {
					UITools.toast('密码长度不能少于6位!');
					return;
				}
				config.GetToken(function(token) {
					//console.log(token);
					Token = token;
					register();
				});

			});

		});
	}
	/**
	 * 注册
	 */
	function register() {
		//var url = config.serverUrl + "/User/userRegister";
		var url = "http://220.191.226.70:8080/kqzwwwapin/User/userRegister";
		var requestData = {
				ValidateData: Token,
				paras: {
					UserName: UserName,
					Password: Password
				}
			}
			console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				console.log('初始化办件请求成功');
				console.error(JSON.stringify(rtnData));
				if(rtnData.ReturnInfo.Code == "0") {
					mui.toast(rtnData.ReturnInfo.Description);
					return;
				}
				if(rtnData.BusinessInfo.Code == "0") {
					mui.toast(rtnData.BusinessInfo.Description);
					return;
				}
				UITools.alert({
					content: '注册成功'
				}, function() {
					mui.openWindow({
						url: 'ZWFW_binding.html?UserPK=' + OpenID + '&URL=' + encodeURIComponent(URL)
					})
				});
			}
		});
	}
});