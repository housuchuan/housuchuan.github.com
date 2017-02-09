/**
 * 描述 :创建圈子主页面调用子页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-21 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	//引入窗口模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var userId = "";
	var userName = "";
	var secretKey = "";
	var tmpCircleTypeData = [];
	var userPicker;
	//初始化
	CommonUtil.initReady(function() {
		//初始化获取圈子分类
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//实例化选择对象
		userPicker = new mui.PopPicker();
		//初始化圈子分类信息
		appendCircleTypeList();
	});

	/***
	 * 提交创建圈子信息
	 */
	Zepto("#btnSubmit").on('tap', function() {
		//创建圈子
		createCircle();
	});
	Zepto("#circleChoose").on('tap', function() {
		//弹出选择
		userPicker.show(function(obj) {
			//console.log(JSON.stringify(obj));
			Zepto(".choose").text(obj[0].text);
			Zepto("#type").val(obj[0].value);
			if(!!Zepto(".choose").text(obj[0].text)) {
				Zepto(".choose").css('color', '#000000');
			}
		});
	});

	//创建圈子请求函数
	function createCircle() {
		//var url = config.MockServerUrl + 'create/createCircle';
		//var url = config.PCServerUrl + 'CreateCircle';
		var url = config.JServerUrl + 'circle/mobile/create/createCricle';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			userName: userName,
			typeName: Zepto(".choose").text()
		};
		//获取参数,所有的input里的内容,然后拼接参数
		var inputs = Zepto("input");
		Zepto.each(inputs, function(key, value) {
			var id = Zepto(this).attr("id");
			var val = Zepto(this).val();
			eval("data." + id + "='" + val + "'");
		});
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("请求参数：" + requestData);
		if(checkInputValidate(data) == true) {
			UIUtil.showWaiting();
			CommonUtil.ajax(url, requestData, function(response) {
				//console.log("XXX " + JSON.stringify(response));
				UIUtil.closeWaiting();
				var response = CommonUtil.handleStandardResponse(response, "0")
				if(response.code == "1") {
					UIUtil.toast(response.description);
					//置空
					resetData();
				}
			}, function(e) {
				UIUtil.closeWaiting();
				UIUtil.toast("网络连接超时！请检查网络...");
			}, 1, secretKey);
		}
	}
	/**
	 * 获取圈子类别
	 */
	function appendCircleTypeList() {
		//var url = config.MockServerUrl + 'studycircle/getCircleTypeList';
		//var url = config.PCServerUrl + 'CircleClassifyList';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleClassifyList';
		var requestData = {};
		var data = {};
		requestData.ValidateData = 'validatedata';
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("请求参数：" + config.SecretKey);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, "1")
				//console.log("圈子分类接口返回数据：" + JSON.stringify(response));
			if(response.code == "1") {
				var tempData = [];
				mui.each(response.data, function(key, value) {
					tempData.push({
						value: value.typeId,
						text: value.typeName
					})
				});
				//填充用户选择数据
				userPicker.setData(tempData);
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	}
	/**
	 * 校验输入合法性
	 */
	function checkInputValidate(data) {
		//		console.log(JSON.stringify(data));
		var resultStr = '';
		if(!data.type) {
			resultStr = "亲，请根据圈子的主题类型，选择适当的分类！";
			showTips(resultStr);
			//mui.alert(resultStr);
			return false;
		} else if(!(data.circleName.length > 3 && data.circleName.length < 12)) {
			resultStr = "圈子名称规定使用4-12个字符，确定后不可修改！";
			showTips(resultStr);
			//mui.alert(resultStr);
			return false;
		} else if(!(data.instruct.length > 0 && data.instruct.length < 256)) {
			resultStr = "对您建立的圈子进行简单的文字介绍，创建后，圈主可做修改，字数不超过255字。";
			showTips(resultStr);
			//mui.alert(resultStr);
			return false;
		} else if(!data.pag) {
			resultStr = "建立圈子标签有利于全局搜索查找您的圈子，多个标签请用中文“，”分离";
			showTips(resultStr);
			//mui.alert(resultStr);
			return false;
		} else if(!data.reason.length > 0 && data.reason.length < 256) {
			resultStr = "请填写您创建圈子的理由，创建后，圈主可做修改，字数不超过255字。";
			showTips(resultStr);
			//mui.alert(resultStr);
			return false;
		}
		Zepto(".vol-tips").css('display', 'none');
		return true;
	}
	/**
	 * 清空页面输入
	 */
	function resetData() {
		//获取所有的input,对input里面的值进行遍历清空
		Zepto(".choose").text('请选择');
		Zepto(".choose").css('color', '#a9a9a9');
		var inputs = Zepto("input");
		Zepto.each(inputs, function(key, value) {
			Zepto(this).val("");
		});
	}
	//信息提示关闭
	function showTips(tips) {
		var headerTips = '温馨提示：'
		Zepto(".vol-tips").css('display', 'block');
		Zepto(".tips-txt").text(headerTips + tips);
	}
	//点击关闭按钮的单击事件。
	Zepto(".vol-close").on('tap', function() {
		Zepto(".vol-tips").css('display', 'none');
	});
});