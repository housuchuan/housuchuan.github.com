/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 新增预约
 */
define(function(require, exports, moddive) {
	"use strict";
	//token值
	var Token = '';
	var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var WindowTools = require('WindowTools_Core');
	var YuYueDate = ''
	var YuYueTimeStart = '';
	var YuYueTimeEnd = '';
	var taskGuid = '';
	var UserPK = '';
	var Name = '';
	var SFZ = '';
	var PHONE = '';
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//文字编译
	var StringTools = require('StringTools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);

	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			PHONE = WindowTools.getExtraDataByKey('PHONE');
			SFZ = WindowTools.getExtraDataByKey('SFZ');
			Name = WindowTools.getExtraDataByKey('Name');
			YuYueTimeEnd = WindowTools.getExtraDataByKey('YuYueTimeEnd');
			YuYueTimeStart = WindowTools.getExtraDataByKey('YuYueTimeStart');
			YuYueDate = WindowTools.getExtraDataByKey('YuYueDate');
			taskGuid = WindowTools.getExtraDataByKey('taskGuid');
			UserPK = WindowTools.getExtraDataByKey('UserPK');
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				//通过OpenID获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					userguid = UserGuid;
					getTaskDetail();
					getYuYueDetail();
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			yuyuetimeclick();
			appointmentadd();
		});

	};

	//首先请求将预约部门和办理事项填充完毕
	var getTaskDetail = function() {
		var url = Config.serverUrl + '/AuditTask/GetTaskDetail';
		//var url = 'http://218.4.136.118:8086/mockjs/143/Appointment_Add';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			TaskGuid: taskGuid
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + JSON.stringify(requestData));
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				console.log(JSON.stringify(response));
				var outdata = response.UserArea;

				if(response.ReturnInfo.Code == "0") {
					alert(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					alert(response.BusinessInfo.Description);
					return false;
				}
				Zepto('#spanouname').text(outdata.OUName);
				Zepto('#spantaskname').text(outdata.TaskName);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
		return requestData;
	};

	//获取该列表中的其他项信息
	var getYuYueDetail = function() {
		if(YuYueDate != "" && YuYueDate != null) {
			Zepto("#yuyuetime").val(YuYueDate + " " + YuYueTimeStart + "~" + YuYueTimeEnd);
			Zepto("#name").val(unescape(Name));
			Zepto("#id-number").val(unescape(SFZ));
			Zepto("#phone").val(unescape(PHONE));
		} else {
			//初始化人员信息获取默认申请人
			var url = Config.serverUrl + '/Appler/getDefaultAppler';
			//var url = 'http://218.4.136.118:8086/mockjs/143/Appointment_Add2';
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				UserGuid: userguid
			};
			requestData.paras = data;
			requestData = JSON.stringify(requestData);
			console.log("xxxxxxxxxxxxxurl"+url);
			console.log('请求数据:' + requestData);
			mui.ajax(url, {
				data: requestData,
				dataType: "json",
				type: "POST",
				success: function(response) {
					var outdata = response.UserArea.individual.defaultINDIVIDUAL;
					console.log('========================='+JSON.stringify(outdata));
					if(response.ReturnInfo.Code == "0") {
						alert(response.ReturnInfo.Description);
					}
					if(response.BusinessInfo.Code == "0") {
						alert(response.BusinessInfo.Description);
						return false;
					}
					Zepto("#name").val(outdata.ClientName);
					Zepto("#id-number").val(outdata.IDNUMBER);
					Zepto("#phone").val(outdata.CONTACTPHONE);
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response))
				}
			});
			return requestData;
		}
	};
	//设置预约时间点击事件
	var yuyuetimeclick = function() {
		Zepto("#yuyuetimeselect").on('tap', function() {
			var data = {
				UserPK: UserPK,
				taskguid: taskGuid,
				TaskName: escape(Zepto("#spantaskname").text()),
				OUName: escape(Zepto("#spanouname").text()),
				Name: escape(Zepto("#name").val()),
				SFZ: escape(Zepto("#id-number").val()),
				PHONE: escape(Zepto("#phone").val())
			};
			WindowTools.createWin('', 'ZWFW_Appointment_Time.html', data);
		})
	}

	var appointmentadd = function() {

		Zepto('#appointmentadd').on('tap', function() {
			if(Zepto("#yuyuetime").val() == "") {
				mui.toast("请选择您要预约的时间段！");
				return;
			}
			if(Zepto("#name").val() == "") {
				mui.toast("请输入您的姓名！");
				return;
			}
			if(Zepto("#id-number").val() == "") {
				mui.toast("请输入您的身份证！");
				return;
			}
			if(Zepto("#phone").val() == "") {
				mui.toast("您输入的手机号为空或者不正确！");
				return;
			}
			if(StringTools.validateUserIdendity(Zepto("#id-number").val()) == false) {
				mui.toast("您输入的身份证不正确！");
				return;
			}
			var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
			if(Zepto("#phone").val().match(regPhone) == null) {
				mui.toast("您输入的手机号不正确！");
				return;
			}
			//将信息发送给后台
			//var url = Config.serverUrl + '/AuditAppointment/GetYuYueQNO';
			var url = Config.extraServerUrl + '/AuditAppointment_KQ/GetYuYueQNO';
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				TaskGuid: taskGuid, //b3b8f1dc-d473-452f-9c43-92f4de6a68e3
				UserGuid: userguid,
				UserName: Zepto("#name").val(),
				IdentityCardID: Zepto("#id-number").val(),
				Mobile: Zepto("#phone").val(),
				YuYueTimeStart: YuYueTimeStart,
				YuYueTimeEnd: YuYueTimeEnd,
				YuYueDate: YuYueDate
			};
			requestData.paras = data;
			requestData = JSON.stringify(requestData);
			//mock完成后回调函数
			Config.GetToken(function(token) {
				var successRequestCallback = function() {}
				console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx"+url);
				console.log('请求数据:' + requestData);
				mui.ajax(url, {
					data: requestData,
					dataType: "json",
					type: "POST",
					success: function(response) {
						console.log("预约之后的响应数据xxxxxxx"+JSON.stringify(response));
						if(response.ReturnInfo.Code == "0") {
							mui.toast(response.ReturnInfo.Description);
							return;
						}
						if(response.BusinessInfo.Code == "0") {
							mui.toast(response.BusinessInfo.Description);
							return;
						}
						var data = {
							UserPK: UserPK
						}
						WindowTools.createWin('', 'ZWFW_MyAppointment_success.html', data);
					},
					error: function(response) {
						console.log('请求失败');
						console.log(JSON.stringify(response));
					}
				});
				return requestData;
			});
		})
	}

});