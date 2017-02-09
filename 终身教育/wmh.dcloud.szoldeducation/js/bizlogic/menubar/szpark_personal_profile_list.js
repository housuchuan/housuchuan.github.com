/**
 * 描述 :个人资料子页面 交互
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-23 11:42:49
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var initActionSheetUtil = require('bizlogic/common/common_initActionSheetUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var secretKey = "";
	//var secretKey = config.secretKey;
	var userId = "";
	var userName = "";
	var SMSInform = 0; //短信通知
	var emailTell = 0; //邮件通知
	var message = 0; //站内信
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession){
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		//映射修改模板信息
		ajaxViewData();
	});

	/**
	 * @description 请求详情数据
	 */
	function ajaxViewData() {
		//var url = config.MockServerUrl + 'mobile/space/person/detail';
		var url = config.JServerUrl + 'mobile/space/person/detail';
		var requestData = {};
		var data = {
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("个人资料请求参数" + requestData);
		console.log("个人资料请求数据Url" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, 2);
			if(response.code == 1) {
				var tmpInfo = response.data;
				console.error("个人信息资料" + JSON.stringify(tmpInfo));
				if(tmpInfo) {
					if(!tmpInfo.image || tmpInfo.image == 'img is not define') {
						tmpInfo.image = '../../img/MobileFrame/img_head_logo190-190.png';
					}else{
						tmpInfo.image = unescape(tmpInfo.image);
					};
					alert(tmpInfo.image);
					tmpInfo.username = unescape(tmpInfo.username);
					tmpInfo.hobby = unescape(tmpInfo.hobby);
					tmpInfo.signature = unescape(tmpInfo.signature);
					tmpInfo.specialty = unescape(tmpInfo.specialty);
					tmpInfo.birthday = unescape(tmpInfo.birthday);
					tmpInfo.email = unescape(tmpInfo.email);
					Zepto('#headImage').attr('src',tmpInfo.image);
					Zepto('#username').val(tmpInfo.username);
					Zepto('#birthdayLable').text(tmpInfo.birthday);
					Zepto('#birthday').val(tmpInfo.birthday);
					Zepto('#bloodLable').text(tmpInfo.blood);
					Zepto('#blood').val(tmpInfo.blood);
					Zepto('#email').val(tmpInfo.email);
					Zepto('#signature').val(tmpInfo.signature);
					Zepto('#interest').val(tmpInfo.hobby);
					Zepto('#forte').val(tmpInfo.forte);
					//判断短信通知、邮件通知以及站内信
					if(tmpInfo.SMSInform == 1 || tmpInfo.SMSInform == "1") {
						Zepto("#newsTell").attr('checked', 'checked');
					} else {

					}
					if(tmpInfo.emailInform == 1 || tmpInfo.emailInform == "1") {
						Zepto("#emailTell").attr('checked', 'checked');
					} else {}
					if(tmpInfo.mailInform == 1 || tmpInfo.mailInform == "1") {
						Zepto("#message").attr('checked', 'checked');
					} else {}
					//初始化监听
					initListener();
				} else {
					//什么都不做
					console.log("Info节点数据为空！！");
				}
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//初始化监听
	function initListener() {
		//头像点击操作
		initActionSheetUtil.initActionSheet(function(selectStr) {
			if(selectStr == "拍照或录像") {
				ImageUtil.ImgSelectFactory.SelectImgFromCamera(function(path) {
					//console.log("path" + path);
				}, function() {

				}, null)
			} else if(selectStr == "选取现有的") {

			}
		});
		//头像点击操作回调
		//setFilesSelect();
		//选择生日
		Zepto("#birthdaySelector").on('tap', function() {
			var picker = new mui.DtPicker({
				"type": "date"
			});
			picker.show(function(rs) {
				//console.log(JSON.stringify(rs));
				Zepto("#birthdayLable").text(rs.text);
				Zepto("#birthday").val(rs.value);
				picker.dispose();
			});
		});
		//选择血型
		Zepto("#bloodSelector").on('tap', function() {
			var userPicker = new mui.PopPicker();
			userPicker.setData([{
				value: 'A',
				text: 'A'
			}, {
				value: 'B',
				text: 'B'
			}, {
				value: 'AB',
				text: 'AB'
			}, {
				value: 'O',
				text: 'O'
			}]);
			userPicker.show(function(rs) {
				//console.log(JSON.stringify(rs));
				Zepto("#bloodLable").text(rs[0].text);
				Zepto("#blood").val(rs[0].value);
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		});
	}
	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		var imgArray = [];
		//设置文件选择为图片选择
		FileUtil.setSelectImgsFromDisks('#chooseImgFromGalleryFile', function(b64, file) {
			//添加图片，设置图片大小在8K以内。
			if(parseInt(file.size / 1024) > 3) {
				mui.alert("上传LOGO图片大小必须在2K以内！");
			} else {
				//添加图片
				imgArray.push({
					name: 'fileImage' + imgArray.length,
					file: file
				});
				//console.log("选择:" + b64);
				//添加预览
				Zepto("#headImage").attr('src', b64);
			}
		}, {
			isMulti: false
		});
	}
	//保存信息
	Zepto("#btnSave").on('tap', function() {
		//var url = config.MockServerUrl + 'mobilespace/person/change';
		var blood = Zepto("#blood").val();;
		var email = Zepto("#email").val();
		var forte = Zepto("#forte").val();
		var interest = Zepto("#interest").val();
		var signature = Zepto("#signature").val();
		var SMSInformStatus = Zepto("#newsTell").attr('checked');
		var emailTellStatus = Zepto("#emailTell").attr('checked');
		var messageStatus = Zepto("#message").attr('checked');
		console.log("SMSInformStatus" + SMSInformStatus);
		console.log("emailTellStatus" + emailTellStatus);
		console.log("messageStatus" + messageStatus);
		if(SMSInformStatus == "checked" || SMSInformStatus == true) {
			SMSInform = 1;
		} else {
			SMSInform = 0;
		}
		if(emailTellStatus == "checked" || emailTellStatus == true) {
			emailTell = 1;
		} else {
			emailTell = 0;
		}
		if(messageStatus == "checked" || messageStatus == true) {
			message = 1;
		} else {
			message = 0;
		}
		var url = config.JServerUrl + 'mobile/space/person/change';
		var requestData = {};
		var data = {
			blood: blood,
			email: email,
			forte: forte,
			interest: interest,
			signature: signature,
			userId: userId,
			smsInform: SMSInform,
			emailInform: emailTell,
			mailInform: message
		};
		//获取参数,所有的input里的内容,然后拼接参数
		//var inputs = Zepto('#content').find('input');
		//		Zepto.each(inputs, function(key, value) {
		//			var id = Zepto(this).attr("id");
		//			var val = Zepto(this).val();
		//			eval("data." + id + "='" + val + "'");
		//		});
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("请求参数：" + requestData);
		//console.log("请求URL：" + url);
		//if(checkInputValidate(data) == true) {
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log(JSON.stringify(response));
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, "0")
			if(response.code == "1") {
				ajaxViewData(userId);
				mui.alert(response.description);
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	});
});