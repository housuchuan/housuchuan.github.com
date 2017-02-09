/**
 * 作者：dailc 
 * 时间：2016-04-08 14:28:10
 * 描述：  学历教育 在线报名
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var IDCardUtil = require('core/MobileFrame/IDCardUtil.js');
	var url = config.ServerUrl + "applyadd";
	Zepto("#btn-submit").on('tap', function() {
		submitOnlineJoin();
	});
	/**
	 * @description 在线学习报名
	 */
	function submitOnlineJoin() {
		var name = Zepto("#name").val();
		var phonenumber = Zepto("#phone").val();
		var idcard = Zepto("#idcard").val();
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			applyname: name,
			applytel: phonenumber,
			applyidcard: idcard,
			applytype: "3"
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(JSON.stringify(data));
		//console.log(checkInputFormat(data));
		if (checkInputFormat(data)) {
			mui.ajax(url, {
				data: requestData,
				dataType: "json",
				timeout: "15000", //超时时间设置为3秒；
				type: "POST",
				success: successRequestCallback,
				error: errorRequestCallback
			});
		}
	};
	/**
	 * 校验输入
	 * @param {Object} data
	 */
	function checkInputFormat(data) {
		var flag = true;
		if (!data.applyname) {
			UIUtil.toast("姓名不能为空", {
				isForceH5: true
			});
			flag = false;
			return;
		}
		if (!data.applytel) {
			UIUtil.toast("请输入手机号码", {
				isForceH5: true
			});
			flag = false;
			return;
		} else {
			if (!StringUtil.isPhoneNumber(data.applytel)) {
				UIUtil.toast("手机号输入格式不正确", {
					isForceH5: true
				});
				flag = false;
				return;
			}
		}
		if (!data.applyidcard) {
			UIUtil.toast("请输入身份证号", {
				isForceH5: true
			});
			flag = false;
			return;
		} else {
			if (!IDCardUtil.validateUserIdendity(data.applyidcard, true)) {
				UIUtil.toast("身份证号不正确", {
					isForceH5: true
				});
				flag = false;
				return;
			}
		}
		return flag;

	}

	function successRequestCallback(response) {
		//console.log(JSON.stringify(response));
		//console.log("提交成功接口返回信息;" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			UIUtil.alert({
				content: response.EpointDataBody.DATA.UserArea,
				title: '提示',
				buttonValue: '我知道了'
			}, function() {
				Zepto("#name").val("");
				Zepto("#phone").val("");
				Zepto("#idcard").val("");
			});
		}
	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...', {
			isForceH5: true
		});
	};

});