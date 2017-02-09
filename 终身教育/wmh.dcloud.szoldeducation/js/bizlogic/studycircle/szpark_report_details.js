/**
 * 描述 :举报管理详情父页面调用子页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	//引入窗口模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil=require('core/MobileFrame/StorageUtil.js');
	var contentId;
	var type;
	var userIdData;
	var secretKey = "";
	var userId = "";
	var ReportUserId = "";
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		var info = WindowUtil.getExtraDataByKey("info");
		var tmpInfo = JSON.parse(info);
		contentId = tmpInfo.contentId;
		type = tmpInfo.type;
		var userIdDataSession = JSON.parse(WindowUtil.getExtraDataByKey("userIdData"));
		ReportUserId = userIdDataSession.userId;
		if(type == "话题") {
			type = 1; //type=1话题 
		} else if(type == "评论") {
			type = 2; //type=2评论
		};
		ajaxDetail(tmpInfo);
	}

	function ajaxDetail(tmpInfo) {
		var litemplate = '<div><span>用&nbsp;&nbsp;户&nbsp;&nbsp;名</span><span class="name">{{nick}}</span></div><div><span>举报内容</span><span class="report-section">{{topicName}}</span></div><div><span>举报类型</span><span>{{type}}</span></div><div><span>举报理由</span><span class="report-section">{{reason}}</span></div><div><span>举报时间</span><span class="report-section">{{time}}</span></div><button type="button" class="del-btn mui-btn">屏蔽</button><button type="button" class="ignored-btn mui-btn">忽略</button>';
		tmpInfo.reason = unescape(tmpInfo.reason);
		var output = Mustache.render(litemplate, tmpInfo);
		Zepto("#content").html('');
		Zepto("#content").append(output);

		//屏蔽 按钮
		Zepto("#content .del-btn").on('tap', function() {
			//操作状态
			//1.什么都不做（数据库默认状态）
			//2：（屏蔽）删除对应的被举报信息 
			//3：忽略举报信息,对被举报信息不进行处理
			shieldAndignore(contentId, type, 2);

		});

		//忽略按钮
		Zepto("#content .ignored-btn").on('tap', function() {
			//console.log("xxxxxxxxxxxxxxxx举报人Id"+reportUserId);
			shieldAndignore(contentId, type, 3);
		});
	}
	/**
	 * @description 某个圈子的举报信息处理操作（被举报信息屏蔽、举报记录忽略）
	 * @param {Object} contentId 举报内容的ID
	 * @param {Object} type type=1代表被举报的是【话题】   type=2代表被举报的是【评论】
	 * @param {Object} reportStatus 1代表什么都不做  2 代表删除（屏蔽）  3代表（忽略） 
	 */
	function shieldAndignore(contentId, type, reportStatus) {
		//var url = config.MockServerUrl + "studycircle/CircleReportManage";
		//var url = config.PCServerUrl + 'CircleReportManage';
		var url = config.JServerUrl + 'circle/mobile/manager/reportManage';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: ReportUserId, //新增的举报人的ID
			contentId: contentId,
			type: type,
			reportStatus: reportStatus
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("举报参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//UIUtil.toast("xxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, "0");
			if(response.code == "1") {
				mui.alert(response.description, function() {
					WindowUtil.firePageEvent("szpark_report_management_list.html", "refreshList");
					mui.back();
				});
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	}
})