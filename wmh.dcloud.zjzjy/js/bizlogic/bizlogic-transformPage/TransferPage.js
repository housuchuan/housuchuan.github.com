/**
 * 描述 :中转页面 
 * 作者 :housc
 * 版本 :1.0
 * 时间 :2016-09-16 08:29:45
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var Md5Tools = require('Md5Tools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//声明变量
	var code = '',
		clientId = '',
		redirectUrl = '',
		clientSecret = '',
		data = '',
		Type = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/md5.js',
			'js/core/sea.min.js',
			'js/libs/zepto.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			code = WindowTools.getExtraDataByKey('code') || '';
			data = WindowTools.getExtraDataByKey('State') || '';
			var daArray = decodeURI(data).split('|');
			clientId = daArray[0];
			redirectUrl = daArray[1];
			clientSecret = daArray[2];
			Type = daArray[3];
			if((Type.split('='))[1] == 'weixin') {
				Zepto('.szedu-submit').text('请选择你的科目！！！');
				Zepto('.szedu-tip').html('');
				Zepto('#list-icon').css('display', 'block');
			} else {
				Zepto('.szedu-submit').text('恭喜您，正在进入第三方应用！');
				Zepto('.szedu-tip').html('跳转中......');
			};
			//初始化获取用户数据
			ajaxDetailData();
		});
	}
	/**
	 * @description 微信课表点击操作
	 */
	function initListeners(data) {
		Zepto('#list-icon').on('tap', 'div', function() {
			var index = Zepto(this).index();
			ajaxWeixinData(data, index);
		});
	};

	/**
	 * @description 获取token
	 */
	function ajaxDetailData() {
		var url = 'http://space.zje.net.cn/ZJEduFrontMobile/WebService/XXTAppService.asmx/TokenGetData';
		var paras = {
			Code: code
		};
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		requestData.paras = JSON.stringify(paras);
		console.log("xxxx" + url);
		console.log("xxx" + JSON.stringify(requestData));
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("xxxxxxx" + JSON.stringify(response));
				var userData = {
					uid: response.uid,
					uName: response.DispName
				};
				if((Type.split('='))[1] == 'weixin') {
					//监听操作
					initListeners(userData);
				} else {
					//初始化身份验证
					ajaxValidata(userData);
				};
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//身份验证通过再次跳转
	var ajaxValidata = function(userData) {
		//value请尽量转为字符串
		ejs.sql.setConfigValue('userSession', userData, function(result, msg, detail) {});
		var changeToUrl = 'http://oauth.zje.net.cn/OAuthAuthorizationServer/OAuth/Authorize?';
		changeToUrl += (clientId + '&');
		changeToUrl += ('scope=user' + '&');
		changeToUrl += ('response_type=code' + '&');
		changeToUrl += (decodeURI(redirectUrl) + '&');
		changeToUrl += ('display=mobile' + '&');
		changeToUrl += ('state=');
		WindowTools.createWin('joininPage', changeToUrl);
	};

	//微信页面接口跳转
	function ajaxWeixinData(data, index) {
		var date = new Date();
		var month = '',
			fullYear = '';
		if(date.getMonth() + 1 < 10) {
			month = '0' + (date.getMonth() + 1);
		} else {
			month = date.getMonth() + 1;
		};
		fullYear = date.getFullYear() + '-' + month + '-' + date.getDate();
		var url = 'http://wx.wxy100.com/Interface/Page/AuthorizeServlet.aspx?UserID=' + (data.uid) + '&' + 'Agency=BZ' + '&' + 'Day=' + fullYear + '&' + 'SubjectId=' + index + '&' + 'IsFee=0' + '&' + 'IsSimple=1' + '&';
		var checkCode = '';
		checkCode += ('Agency=BZ' + '+');
		checkCode += ('Day=' + fullYear + '+');
		checkCode += ('UserID=' + (data.uid) + '+');
		checkCode += ('SubjectId=' + index + '+');
		checkCode += ('IsFee=0' + '+');
		checkCode += ('IsSimple=1' + '+');
		checkCode += ('2D1F256B7CF1948C');
		url = url + 'CheckCode=' + hex_md5(checkCode);
		WindowTools.createWin('', url);
	};
});