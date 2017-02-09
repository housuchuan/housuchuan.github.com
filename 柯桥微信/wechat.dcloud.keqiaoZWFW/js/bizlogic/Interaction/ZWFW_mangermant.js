/**
 * 作者: daike
 * 时间: 2016-09-01
 * 描述:  用户管理
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
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

			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token

				//通过openid获取用户信息
				config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					if(LoginID == '') {
						UITools.alert({
							content: tips
						},function(){
							self.location = 'ZWFW_binding.html?UserPK=' + OpenID;
						})
					} else {
						Zepto("#labLoginID").val(LoginID);
					}

				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			Zepto('#JCBD').on('tap', function() {
				var btnArray = ['是', '否'];
				mui.confirm('你确定要解除微信绑定？', '', btnArray, function(e) {
					if(e.index == 0) {
						JCBD();
					} else {

					}
				})
			})

		});
	}
	/**
	 * 解除绑定
	 */
	function JCBD() {
		var url = config.serverUrl + "/User/userUnBind";
		var requestData = {
			ValidateData: Token,
			paras: {
				OpenID: OpenID
			}
		}
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				//console.log('解除绑定成功');
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
					content: '解除绑定成功'
				}, function() {
					self.location = 'ZWFW_binding.html?UserPK=' + OpenID;
				})
			}
		});
	}
});