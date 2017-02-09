/**
 * 描述 : 直播父页面
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-11 13:43:55
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil=require('core/MobileFrame/StorageUtil.js');
	var loginUtilTool = require('bizlogic/common/LoginUtil.js');
	var UIUtil=require('core/MobileFrame/UIUtil.js');
	CommonUtil.initReady(initData);
	var id = '';
	var saveType = 0;
	var activityId = '';
	//用户信息
	var secretKey = '';
	//var secretKey = config.secretKey;
	//var secretKey = "";
	var userId = "";
	var userName = "";
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		id = WindowUtil.getExtraDataByKey('videoId');
		secretKey = StorageUtil.getStorageItem("secretKey");
		//console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxeeeeeeeeeeeeee"+secretKey);
		var userSession = StorageUtil.getStorageItem("UserSession");
		//子页面
		var PageArray = [{
			//说明一下：乐视推流以后，会生成一个http://t.cn/Rc6NBWS直播页面地址，该地址只能通过远程服务器静态页面加载，否则app打包后不能观看直播！
			url: 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/EpointMobile_szoldeducation/DeployMobileBrowser/wmh.dcloud.szoldeducation/html/resourceCenter/resource_center_view_zhibo.html', //远程服务器上直播页面的url
			//url: 'resource_center_view_zhibo.html',
			id: 'resource_center_view_zhibo.html', //远程服务器上直播页面的url
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			},
			extras: {
				videoId: id,
			}
		}];
		WindowUtil.createSubWins(PageArray);
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
			//console.log("登录了xxxxxxxxxxxxxxxxxxxxxxx登录了");
			validateIsSaveStatus();
		}else{
			//console.log("未登录xxxxxxxxxxxxxxxxxxxxxxx未登录");
		};
	};
	
	//直播视频收藏操作
	/**
	 * @description 直播视频收藏操作ajax请求数据
	 */
	function broadCastSaveOperation() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			type: 1,
			saveType: saveType,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("request" + requestData);
		//console.log("request" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				console.log("想嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻"+JSON.stringify(response));
				UIUtil.toast(response.description);
				//WindowUtil.firePageEvent('resource_center_course_info_pad.html', 'refreshChildrenPage');
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	
	Zepto('.saveVideo').on('tap', function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		if(loginUtilTool.isLoginSystem()) {
			var _this = Zepto(this);
			if(_this.hasClass('saveVideo-active')) {
				_this.removeClass('saveVideo-active');
				saveType = 0;
			} else {
				_this.addClass('saveVideo-active');
				saveType = 1;
			}
			console.log("进行点击操作");
			broadCastSaveOperation();
		} else {
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					loginUtilTool.ResetTARGET_URL('resource_center_view_zhibo_parent.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	
	/*
	 * ajax请求是否已经收藏了本视频
	 */
	function validateIsSaveStatus() {
		//var url = config.MockServerUrl +'resourceCenter/mobile/resourceCenter/getIsSaveStatus';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/getIsSaveStatus';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			guid: id,
			type: 1,
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("xxxxxxxxxxxxxxxx"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var IsSave = response.data.isSave;
				//console.log("xxxxxxxxxxxxxxxxxxxxtempInfo"+JSON.stringify(IsSave));
				if(IsSave == 0) {
					//什么都不做
					//console.log("0");
				} else if(IsSave == 1) {
					//console.log("1");
					Zepto('.saveVideo').addClass('saveVideo-active');
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});