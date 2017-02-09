/**
 * 作者: dailc
 * 时间: 2016-06-07
 * 描述:  图片轮播工具类
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var StorageTools=require('StorageTools_Core');
	var UITools = require('UITools_Core');
	// initready 要在所有变量初始化做完毕后
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var InfoID = WindowTools.getExtraDataByKey('infoID');
	var imgSrc = WindowTools.getExtraDataByKey('imgSrc');
	//应用id和回调地址
	var clientId = '',
		redirectUrl = '',
		clientSecret = '',
		type = '';
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
			'js/core/sea.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mustache.min.js',
			'js/libs/epoint.moapi.v2.js',
			'js/libs/mui.zoom.js',
			'js/libs/mui.previewimage.js'
		], function() {
			clientId = WindowTools.getExtraDataByKey('extra');
			redirectUrl = WindowTools.getExtraDataByKey('redirect_uri');
			clientSecret = WindowTools.getExtraDataByKey('client_secret');
			type = WindowTools.getExtraDataByKey('type')||'';
			//console.log('======'+clientId);
			initListeners();
			mui.previewImage();
		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('.mui-scroll-wrapper').scroll({
			indicators: true, //是否显示滚动条
		});
		ajaxAppDetail();
	}
	/**
	 * @description app应用
	 */
	function ajaxAppDetail() {
		var url = config.serverUrl + 'GetInfoDetail';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			InfoID: InfoID,
			CateNum: '003001',
			IsNeedUrl: '0',
			isvideo: '1',
			imgwidth: '100'
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};

				var detail = document.getElementById('application-detail');
				var listTemplate = '<div class="application-head mui-clearfix"><div class="appli-img"><img src="' + imgSrc + '" /></div><div class="left-appli"><p class="appli-name">{{title}}</p></div><div class="right-use"><button type="button" class="mui-btn">立即使用</button></div></div><div class="infocontent">{{{infocontent}}}</div>'
				var output = '';
				var value = response.EpointDataBody.DATA.UserArea;
				value.title = unescape(value.title);
				value.infocontent = unescape(value.infocontent);
				output = Mustache.render(listTemplate, value);
				detail.innerHTML = output;
				Zepto('.mui-btn').on('tap', function() {
					var s = {
						client_id: clientId, //17cd23ab-d9e5-40f4-ab17-705574dd33b1//478fb3d5-d028-4cb6-af57-ed3ce472c765
						scope: 'user',
						response_type: 'code',
						redirect_uri: encodeURI(redirectUrl), //http%3a%2f%2fddpgweb.zje.net.cn%3a11134%2fEstarDX%2foauth_redirect.aspx//http://jsyx.zje.net.cn:8066/code/index
						display: 'mobile',
						state: '',
						defaultId: 'd30f7074-92c6-453d-a01b-facb9c6b5088',
						defaultUrl: encodeURI('http://space.zje.net.cn/wmh/html/bizlogic-transformPage/TransferPage.html')
					};
					var changeToUrl = 'http://oauth.zje.net.cn/OAuthAuthorizationServer/OAuth/Authorize?';
					changeToUrl += (('client_id=' + (s.defaultId)) + '&');
					changeToUrl += ('scope=user' + '&');
					changeToUrl += ('response_type=code' + '&');
					changeToUrl += ('redirect_uri=' + (s.defaultUrl) + '&');
					changeToUrl += ('display=mobile' + '&');
					changeToUrl += ('state=' + (s.client_id) + '|' + 'redirect_uri=' + (s.redirect_uri) + '|' + 'client_secret=' + clientSecret + '|' + 'type=' +type );
					//var ur='http://oauth.zje.net.cn/OAuthAuthorizationServer/OAuth/Authorize?'+'client_id='+ (s.defaultId) + '&' +'scope=user' + '&' + 'response_type=code' +'&' + 'redirect_uri='+ (s.defaultUrl) + '&' + 'display=mobile'+'&'+'state';
					//console.log("xxxxxxx" + changeToUrl);
					//console.log("xxx"+(encodeURI(redirectUrl)));
					//WindowTools.createWin('transformPage', changeToUrl);
					//http://app.epoint.com.cn/showcase.dcloud.rayapp/html/ejs/demo_ejs_api_v2.html
					//console.log("xxxxxxx"+changeToUrl);
					ejs.page.openPage(changeToUrl,'我的应用',{},{
						"requestCode":1101,
						"finishAfterOpen":'1',
						"nbRightText":"", 
						"nbRightImage":"", 
						"showBackButton":true, 
						"showLoadProgress":false, 
						"autoHideLoading":true, 
						"showNavigation":true,
						"showSearchBar":false,
						"isListenerNBBack":false,
						"isListenerSysBack":false,
						"orientation":'1',
						"hrefEnable":true,
						"customAPIPath":"com.epoint.JSbridgeCustom"
					});
				});
				
				Zepto('.infocontent').on('tap',function(){
					var ur = 'http://oauth.zje.net.cn/OAuthAuthorizationServer/Account/LogOff?redirect_uri=http%3A%2F%2Fdesktop.zje.net.cn%2FeCloudDeskTop%2Flogin.aspx';
					console.log("xxxxxxx" + ur);
					ejs.page.openPage(ur,'退出账户',{},{
						"requestCode":1101,
						"finishAfterOpen":'1',
						"nbRightText":"", 
						"nbRightImage":"", 
						"showBackButton":true, 
						"showLoadProgress":false, 
						"autoHideLoading":true, 
						"showNavigation":true,
						"showSearchBar":false,
						"isListenerNBBack":false,
						"isListenerSysBack":false,
						"orientation":'1',
						"hrefEnable":true,
						"customAPIPath":"com.epoint.JSbridgeCustom"
					});				
				});
				
//				Zepto('.appli-img img').on('tap',function(){
//					ejs.sql.getConfigValue('userSession',function(result, msg, detail) {
//					    //detail示例
//					    mui.toast(JSON.stringify(result.value));
//					});
//				});
//				
//				Zepto('.appli-name').on('tap',function(){
//					//value请尽量转为字符串
//					ejs.sql.setConfigValue('userSession','',function(result, msg, detail) {
//					   //清空数据库数据
//					});
//				});
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

});