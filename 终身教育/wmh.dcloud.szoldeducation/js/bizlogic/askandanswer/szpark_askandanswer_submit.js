/**
 * 作者：dailc 
 * 时间：2016-04-06 10:06:43
 * 描述：  你问我答提交页面 包含图形验证码
 */
define(function(require, exports, module) {
	"use strict";
	var url = config.ServerUrl + 'answeradd';
	var VerifyCodeUtil = require('core/MobileFrame/VerifyCodeUtil');
	var verfyContainer = document.getElementById("imgVerifyCode");
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var BoxGuid = null;
	//验证码对象
	var code = null;
	//页面初始化
	CommonUtil.initReady(function() {
		BoxGuid = WindowUtil.getExtraDataByKey("BoxGuid");
		var Title = WindowUtil.getExtraDataByKey("Title");
		Zepto(".mui-title").text(Title);
		console.log("BoxGuid:    " + BoxGuid);
		updateVerifyCode();
	});

	//提交
	Zepto('#btn-submit').on('tap', function() {
		//防止按钮重复点击
		document.getElementById('btn-submit').disabled = true; /////true禁用，false可用
		var verifyCodeValue = document.getElementById("verifyCode").value;
		var yzmStatus = code.verify(document.getElementById("verifyCode").value);
		var content = Zepto("#content").attr("value");
		if (content) {
			if (verifyCodeValue) {
				//console.log(yzmStatus);
				if (yzmStatus == true) {
					var yzmCode = "1"; //“1”代表验证码正确；“0”代表输入不正确
					ajaxAddAnswer(content, yzmCode);
				} else {
					UIUtil.toast("验证码输入不正确", {
						isForceH5: true
					});
					document.getElementById('btn-submit').disabled = false; /////true禁用，false可用
				}
			} else {
				UIUtil.toast("请输入验证码", {
					isForceH5: true
				});
				document.getElementById('btn-submit').disabled = false; /////true禁用，false可用
			}
		} else {
			UIUtil.toast("请输入提问内容", {
				isForceH5: true
			});
			document.getElementById('btn-submit').disabled = false; /////true禁用，false可用
		}

	});
	/**
	 * @description 你问我答提交
	 */
	function ajaxAddAnswer(content, yzmCode) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			boxguid: BoxGuid,
			yzm: yzmCode,
			content: content
		}
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successRequestCallback,
			error: errorRequestCallback
		});
	};

	function successRequestCallback(response) {
		console.log("提交成功接口返回信息;" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			UIUtil.alert({
				content: response.EpointDataBody.DATA.UserArea,
				title: '提示',
				buttonValue: '我知道了'
			}, function() {
				document.getElementById('btn-submit').disabled = false; /////true禁用，false可用
				//清空操作
				Zepto("#content").val("");
				Zepto("#verifyCode").val("");
				//释放对应的验证码对象
				code.dispose();
				updateVerifyCode();
			});
		}

	};

	function errorRequestCallback() {
		UIUtil.toast('网络连接超时！请检查网络...');
	};
	//取消
	Zepto('#btn-cancel').on('tap', function() {
		//提交成功，退出当前页面
		mui.back();
	});
	/**
	 *@description 自动更新验证码方法 
	 */
	function updateVerifyCode() {
		code = VerifyCodeUtil.generateVerifyCode(verfyContainer, {
			len: 4,
			bgColor: "#444444",
			colors: [
				"#DDDDDD",
				"#DDFF77",
				"#77DDFF",
				"#99BBFF",
				//"#7700BB",
				"#EEEE00"
			],
			fontSizeMin: 18,
			fontSizeMax: 36,
			sizeWeight: 40
		});
	}
});