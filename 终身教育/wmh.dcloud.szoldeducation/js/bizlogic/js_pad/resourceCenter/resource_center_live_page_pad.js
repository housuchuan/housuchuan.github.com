/**
 * 描述 :研习圈直播页面pad版本 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-10 18:40:30
 */

define(function(require, exports, module) {
	"use strict";
	//引入工具类
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var upLoadTapActionUtil = require('bizlogic/resourceCenter/resource_center_view_video_Util.js');
	var loginUtilTool = require('bizlogic/common/LoginUtil.js');
	var totalNumCount = 0;
	var PageSize = 1000;
	var id = '';
	var secretKey = '';
	//var secretKey =config.secretKey;
	var userId = '';
	var userName = '';
	var saveType = 0; //0：未收藏（取消收藏）    1：收藏
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll({
			indicators: true, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		id = WindowUtil.getExtraDataByKey('itemId');
		//上传上传点击数据
		upLoadTapActionUtil.addCourceClickCounts(id);
		secretKey = StorageUtil.getStorageItem("secretKey");
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxeeeeeeeeeeeeee" + secretKey);
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
			console.log("登录了xxxxxxxxxxxxxxxxxxxxxxx登录了");
			validateIsSaveStatus();
		} else {
			console.log("未登录xxxxxxxxxxxxxxxxxxxxxxx未登录");
		};
		//选集初始化
		videoPlaySelections();
		//初始化直播简介
		getBroadCastIntro();
	}

	//初始化直播
	function initLeBroadcast(activityId) {
		var player1 = new CloudLivePlayer();
		var playerConf = {
			activityId: activityId, //activityId 请换成自己设置的获得id,可播放的id:A2016010500713
			autoplay: 1,
			//ark: "106",
			//playsinline: "1", //Ios 设备Web view下默认不全屏播放（1：启动，0：不启动）
			//gpcflag: 1,
			callbackJs: "TTVideoInit"
		};
		player1.init(playerConf, "player"); //创建播放器的实例
		//console.log("activityId"+activityId);
	};
	/**
	 * @description  playerConf 会传入 callbackJs。此时对应的 js 函数会收到播放器的回调。
	 * @param {Object} type 表示播放器当前回调类型
	 * @param {Object} data：表示回调的值。
	 */
	window.TTVideoInit = function(type, data) {
		var myDate = new Date();
		var info = "（调试）当前时间：" + myDate.toLocaleTimeString() + "" + "===>" + "type:" + type + ";----data:" + JSON.stringify(data);
		console.error(info);
	};
	//选集列表
	/**
	 * @description 选集ajax请求数据
	 */
	function videoPlaySelections() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/mobileLivingLessonsList';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/mobileLivingLessonsList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			pageIndex: 1,
			pageSize: PageSize
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("response" + JSON.stringify(response));
				var tempInfo = response.data;
				var litemplate = '<div id="{{id}}"><span id="{{activityId}}" class="activityId"></span><span class="index">{{index}}</span></div>';
				var output = '';
				mui.each(tempInfo, function(key, value) {
					value.index = (key + 1);
					output += Mustache.render(litemplate, value);
				})
				Zepto('.selections-items').html('');
				Zepto('.selections-items').append(output);
				//console.log(Zepto('.selections-items').html());
				var selectionsFirId = Zepto('.selections-items div:first-child').find(".activityId").attr('id');
				//console.log("xxxxxxxxxxxxxxxxx"+selectionsFirId);
				initLeBroadcast(selectionsFirId);
				//选集点击操作样式变化
				Zepto('.selections-items').on('tap', 'div', function() {
					var selectionsId = Zepto(this).find('.activityId').attr('id');
					Zepto(this).css('color', '#ffffff').css('background-color', '#187bc2').siblings().css('color', '#666666').css('background-color', '#eeeeee');
					console.error("切换直播活动到:【" + selectionsId + "】");
					initLeBroadcast(selectionsId);
				});
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description commonutil.ajax请求数据
	 */
	function getBroadCastIntro() {
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			type: 1
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("返回数据：" + JSON.stringify(response));
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var tempInfo = response.data;
				Zepto('.introduction-content p').text(tempInfo.introduction);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
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
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	Zepto('.save-praise').on('tap', '.save', function() {
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
			var _this = Zepto(this).find('.save-praise-common');
			if(_this.hasClass('save-icon-active')) {
				_this.removeClass('save-icon-active');
				saveType = 0;
			} else {
				_this.addClass('save-icon-active');
				saveType = 1;
			}
			console.log("进行点击操作");
			broadCastSaveOperation();
		} else {
			loginUtilTool.ResetTARGET_URL('resource_center_live_page_parent_pad.html', {
				itemId: id
			});
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", loginUtilTool.loginUrl());
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
				//console.log("xxxxxxxxxxxxxxxx"+IsSave);
				if(IsSave == 0) {
					//什么都不做
				} else if(IsSave == 1) {
					Zepto('.save-icon').addClass('save-icon-active');
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});