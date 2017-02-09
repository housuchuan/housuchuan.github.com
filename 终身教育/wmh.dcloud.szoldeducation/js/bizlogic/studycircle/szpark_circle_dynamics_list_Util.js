/**
 * 描述 :圈子动态列表工具类
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-08-02 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	var secretKey = '';
	var userId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
	});
	/**
	 * 初始化页面事件监听
	 */
	exports.initComponents = function() {
		//1.点击发表动态按钮
		Zepto('.footer-btn').on('tap', function() {
			mui('#picture').popover('toggle');
		});
		//关闭弹窗
		mui('body').on('shown', '.mui-popover', function(e) {
			//console.log('shown', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
			//console.log('hidden', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('tap', '.cancel', function() {
			var a = this,
				parent;
			//根据点击按钮，反推当前是哪个actionsheet
			for(parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
				if(parent.classList.contains('mui-popover-action')) {
					break;
				}
			}
			//关闭actionsheet
			mui('#' + parent.id).popover('toggle');
			//置空操作
			exports.resetData();

		});

		//取消和关闭弹出菜单 
		Zepto(".cancel-btn,.mui-icon-closeempty").on('tap', function() {
			CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
			//pad版隐藏
			CustomDialogUtil.hideCustomDialog('publish-list'); //显示自定义对话框
		});
	};

	/**
	 * @description 给话题（点赞）操作
	 */
	exports.praise = function(data, isRefresh,successCallback) {
		//var url = config.PCServerUrl + "TopicPraiseManage";
		var url = config.JServerUrl + "circle/mobile/circle/TopicPraiseManage";
		var requestData = {};
		requestData.ValidateData = 'mobilevalidatedata';
		var data = data;
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("点赞参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("点赞结果" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 0);
			if(response.code == 1) {
				//console.log(response.description);
				//成功回调
				if(successCallback && typeof(successCallback) == 'function') {
					successCallback(response.description);
				}
				//赞和取消赞都要刷新话题列表，isRefresh代表是否刷新话题列表，true代表是，false代表否
				if(isRefresh) {
					WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "refreshListPage");
				} else {
					//console.log("在话题列表中点赞，不需要刷新列表！");
				}
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
	/**
	 * @description （举报）话题操作
	 */
	exports.report = function(data) {
		//var url = config.PCServerUrl + 'CircleReportInsert';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleReportInsert';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = data;
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("举报参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("举报结果" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 0);
			if(response.code == 1) {
				//置空操作
				mui.toast(response.description);
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
				document.getElementById("reason").value = "";
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
	
	/*
	 * Description  删除话题操作
	 */
	 exports.deleteTopic = function(data){
		var url = config.JServerUrl + 'circle/mobile/topic/topicDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = data;
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxx"+requestData);
		console.log("xxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				mui.toast(response.description);
				if(DeviceUtil.mobile()){
					WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", 'refreshListPage');
				}else if(DeviceUtil.tablet()){
					pullToRefreshObject.refresh();
				};
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 加入圈子
	 */
	exports.joinCircleFunc = function(circleId, reason) {
		//var url = config.MockServerUrl + 'cricleJoin';
		//var url = config.PCServerUrl + 'CircleApply';
		var url = config.JServerUrl + 'circle/mobile/detail/cricleJoin';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: userId,
			userName: userName,
			reason: reason
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("加入圈子请求参数：" + requestData);
		CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
		document.getElementById("reason").value = "";
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, "0");
			//console.log("接口返回数据：" + JSON.stringify(response));
			if(response.code == "1") {
				//置空操作
				UIUtil.toast(response.description);
				if(DeviceUtil.mobile()){
					WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "initCircleInfo");
					WindowUtil.firePageEvent("szpark_study_circle.html", "initCircleStatus");
				}else if(DeviceUtil.tablet()){
					WindowUtil.firePageEvent("szpark_circle_dynamics_pad.html", "initCirclePadInfo");
					WindowUtil.firePageEvent("szpark_study_circle_pad.html", "initCirclePadStatus");
				};
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};

	/**
	 * @description 圈子列表页面 加一个 接口 ，圈子点击数量+1， 一进入这个页面，就调用
	 */
	exports.CircleClickCountAdd = function(circleId) {
		var url = config.JServerUrl + 'circle/mobile/circle/CircleClickCountAdd';
		var requestData = {};
		var data = {
			circleId: circleId
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("圈子点击量请求参数：" + requestData);
		//console.log("圈子点击量请求URL：" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, "0");
			if(response.code == "1" || response.code == 1) {
				console.log(response.description);
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
	/**
	 * 置空操作(发表话题清空操作)
	 */
	exports.resetData = function() {
		Zepto('textarea').val(''); //清空内容
		Zepto('#title').val(''); //清空标题
		Zepto("#tupian").html(''); //清空图片
	};

	/**
	 * @description 发表新话题输入校验
	 * @param {Object} data
	 */
	exports.checkInputValidate = function(data) {
		var inputStr = '';
		if(!data.topicName) {
			inputStr = '请输入标题';
			mui.toast(inputStr);
			return false;
		} else if(StringUtil.getByteLen(data.topicName) > 100) {
			inputStr = '标题长度不允许超过50个字哦！';
			mui.toast(inputStr);
			return false;
		} else if(!data.content) {
			inputStr = '亲，写点什么吧';
			mui.toast(inputStr);
			return false;
		} else if(StringUtil.getByteLen(data.content) > 500) {
			inputStr = '亲，内容不允许超过250个字哦！';
			mui.toast(inputStr);
			return false;
		}
		return true;
	};
});