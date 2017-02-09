/**
 * 描述 :个人资料子页面 交互
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-23 11:42:49
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil=require('core/MobileFrame/WindowUtil.js');
	var initActionSheetUtil = require('bizlogic/common/common_initActionSheetUtil.js');
	var StringUtil=require('core/MobileFrame/StringUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var beginTime = '';
	var endTime = '';
	CommonUtil.initReady(function() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//ajaxViewData();
		//计划开始时间
		Zepto("#planStartSelector").on('tap', function() {
			var picker = new mui.DtPicker({
				"type": "date"
			});
			picker.show(function(rs) {
				console.log(JSON.stringify(rs));
				Zepto(".birthdayLable").text(rs.text);
				Zepto(".birthday").val(rs.value);
				picker.dispose();
			});
		});
		//计划结束时间
		Zepto("#planEndSelector").on('tap', function() {
			var picker = new mui.DtPicker({
				"type": "date"
			});
			picker.show(function(rs) {
				console.log(JSON.stringify(rs));
				Zepto(".birthdayLable1").text(rs.text);
				Zepto(".birthday1").val(rs.value);
				picker.dispose();
			});
		});
		//初始化当前时间
		Zepto('.birthdayLable').text((new Date).getFullYear()+'-'+(parseInt((new Date).getMonth())+1)+'-'+(new Date).getDate());
		Zepto('.birthdayLable1').text((new Date).getFullYear()+'-'+(parseInt((new Date).getMonth())+1)+'-'+(new Date).getDate());
	});

	//验证信息是否填写完成
	function validateInfo() {
		var startTime = new Date(Zepto('.birthdayLable').text());
		var endTime = new Date(Zepto('.birthdayLable1').text());
		if(Zepto('.birthdayLable').text() == '' || Zepto('.birthdayLable1').text() == '' || Zepto('#planName').val() == '' || Zepto('#planSection').val() == '') {
			//信息填写不完成的处理
			UIUtil.toast('信息填写不完整，请填写完整');
		}else if(StringUtil.getByteLen(Zepto('#planName').val()) > 100){
			UIUtil.toast('计划名称不允许超过50字，请重新填写');
		}else if(endTime.getTime() < startTime.getTime()){
			mui.toast('计划结束时间应大于开始时间，请重新填写！');
		} else {
			/**
			 * @description 保存信息ajax数据
			 */
			//var url = config.MockServerUrl + 'mystudy/studyPlanningAdd';
			var url = config.JServerUrl + 'mystudy/studyPlanningAdd';
			var requestData = {};
			//requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				userName: userName,
				beginTime: Zepto('.birthdayLable').text(),
				endTime: Zepto('.birthdayLable1').text(),
				planTitle: Zepto('#planName').val(),
				planContent: Zepto('#planSection').val()
			};
			//获取参数,所有的input里的内容,然后拼接参数
			//		var inputs = Zepto("input");
			//		Zepto.each(inputs, function(key, value) {
			//			var id = Zepto(this).attr("id");
			//			var val = Zepto(this).val();
			//			eval("data." + id + "='" + val + "'");
			//		});
			requestData = data;
			requestData = JSON.stringify(requestData);
			UIUtil.showWaiting();
			//console.log("xxxxxxxxxxxxxxxxxxx" + requestData);
			CommonUtil.ajax(url, requestData, function(response) {
				UIUtil.closeWaiting();
				var response = CommonUtil.handleStandardResponse(response, '0');
				if(response.code == 1) {
					UIUtil.toast(response.description);
					mui.back();
				}
				//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
			}, function() {
				UIUtil.closeWaiting();
				UIUtil.toast('网络连接超时！请检查网络...');
			}, 1, secretKey, false);
		}
	}

	//保存信息
	Zepto("#btnSave").on('tap', function() {
		validateInfo();
		WindowUtil.firePageEvent('szpark_study_planning_list.html', 'refreshList');
	});
});