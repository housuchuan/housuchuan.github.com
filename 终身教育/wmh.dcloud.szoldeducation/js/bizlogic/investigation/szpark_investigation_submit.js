/**
 * 作者：sunzl 
 * 时间：2016-04-07 10:06:43
 * 描述：  调查投票提交页面
 */
define(function(require, exports, module) {
	"use strict";
	//引入window操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var DynamicTemplateUtil = require('core/MobileFrame/DynamicTemplateUtil.js');
	var url = config.ServerUrl + "questionnairedetails";
	var submitUrl = config.ServerUrl + 'questionnaireadd';
	//容器1
	var responseE = "#content";
	//调查问卷ID
	var QuestionnaireID = null;
	//题目总数
	var TotalQuestionCount = 0;
	//剩余的题目
	var RemainQuestionCount = 0;
	//缓存处理答过的问卷的ID
	var QuestionnaireIDSession = [];
	//设备唯一标识
	var UUID = null;
	CommonUtil.initReady(function() {
		if (CommonUtil.os.plus) {
			CommonUtil.plusReady(function() {
				UUID = plus.device.uuid;
			});
		} else {
			//如果是手机浏览器则获取客户端IP地址作为唯一标识
			UUID = returnCitySN["cip"];
		}
		QuestionnaireID = WindowUtil.getExtraDataByKey("QuestionnaireID");
		var Title = WindowUtil.getExtraDataByKey("Title");
		Zepto(".title").text(Title);
		ajaxInfoData();
	});

	//提交信息
	Zepto('#btn-submit').on('tap', function() {
		//调查投票提交信息
		submitVoteInfo();
	});

	//提交信息方法
	function submitVoteInfo() {
		var subjectanswerlist = [];
		console.log("jhhhhhh");
		var radioArray = Zepto('.radio-class');
		//console.log("单选数量:" + radioArray.length);
		var SelectAnswerCount = 0;
		mui.each(radioArray, function() {
			if (Zepto(this).attr('checked') == true) {
				SelectAnswerCount++;
				var value = Zepto(this).attr('value');
				var subjectId = Zepto(this).parents('.subject').attr('id');
				subjectanswerlist.push({
					"SubjectID": subjectId,
					"SubjectAnswer": value
				});
			}
		});
		//console.log("数组:" + JSON.stringify(subjectanswerlist));
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		requestData.para = {
			questionnaireid: QuestionnaireID,
			subjectanswerlist: subjectanswerlist,
			uuid: UUID
		};
		requestData = JSON.stringify(requestData);
		//console.log(requestData);
		//console.log("总共" + TotalQuestionCount + "题");
		//console.log("选择了" + SelectAnswerCount);
		RemainQuestionCount = parseInt(TotalQuestionCount - SelectAnswerCount);
		if (SelectAnswerCount >= TotalQuestionCount) {
			mui.ajax(submitUrl, {
				data: requestData,
				dataType: "json",
				type: "POST",
				success: successRequestCallback,
				timeout: 9000,
				error: errorRequestCallback
			});
		} else {
			UIUtil.toast("您还有" + RemainQuestionCount + "道问卷题目未投票！", {
				isForceH5: true
			});
		}
	};
	/**
	 * @description 初始化调查投票信息
	 */
	function ajaxInfoData() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			questionnaireid: QuestionnaireID
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log("sout：" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestDetailCallback,
			error: errorRequestCallback
		});
	};

	function successRequestDetailCallback(response) {
		//console.log(unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.SubjectInfo) {
				var SubjectInfo = response.EpointDataBody.DATA.UserArea.SubjectInfo;
				if (Array.isArray(SubjectInfo)) {
					mui.each(SubjectInfo, function(key, value) {
						if (value.Options) {
							//console.log("选项存在的题目");
							TotalQuestionCount++;
						}
					});
				} else {
					if (SubjectInfo.Options) {
						//console.log("选项存在");
						TotalQuestionCount = 1;
					}
				}
				var html = DynamicTemplateUtil.generateInvestigationItems(SubjectInfo);
				//console.log("html:" + html);
				Zepto(responseE).html(html);
			}
		}
	};
	/**
	 * @description 调查投票成功回调
	 * @param {Object} response
	 */
	function successRequestCallback(response) {
		console.log("提交成功接口返回信息;" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			UIUtil.alert({
				content: response.EpointDataBody.DATA.UserArea,
				title: '提示',
				buttonValue: '我知道了'
			}, function() {
				//提交成功之后，不允许再次投票
				mui.back();
			});
		} else {
			UIUtil.toast("您的设备已投过票,请不要重复提交！", {
				isForceH5: true
			});
		}
	};
	/**
	 * @description 请求失败回调
	 */
	function errorRequestCallback() {
		UIUtil.closeWaiting();
		UIUtil.toast('网络连接超时！请检查网络...', {
			isForceH5: true
		});
	};
});