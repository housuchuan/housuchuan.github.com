/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 预约时间
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var ValidateData = '';
	var Token = '';
	var TaskGuid = '';
	var TaskName = '';
	var OUName = '';
	var Name = '';
	var SFZ = '';
	var PHONE = '';
	var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'css/libs/mui.picker.min.css',
			'css/libs/mui.poppicker.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.picker.min.js',
			'js/libs/mui.poppicker.js',
		], function() {
			TaskGuid = WindowTools.getExtraDataByKey("taskGuid");
			TaskName = WindowTools.getExtraDataByKey('TaskName');
			OUName = WindowTools.getExtraDataByKey('OUName');
			Name = WindowTools.getExtraDataByKey('Name');
			SFZ = WindowTools.getExtraDataByKey('SFZ');
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			PHONE = WindowTools.getExtraDataByKey('PHONE');
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				ready();
				//通过OpenID获取用户信息
				
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});
	};
	var ready = function() {
		var OUName = WindowTools.getExtraDataByKey("OUName");
		var TaskName = WindowTools.getExtraDataByKey("TaskName");
		Zepto("#spanouname").text(unescape(OUName));
		Zepto("#spantaskname").text(unescape(TaskName));
		//设置日期切换
		var requestData = {};
		var url = Config.serverUrl + "/AuditAppointment/GetYuYueDateList";
		//var url = "http://218.4.136.118:8086/mockjs/143/Appointment_Time";
		requestData.ValidateData = Token;
		var data = {
			TaskGuid: TaskGuid,
			ShowDays: "5"
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		//console.log('请求数据:' + JSON.stringify(requestData));
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				if(response.ReturnInfo.Code == "0") {
					mui.toast(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					mui.toast(response.BusinessInfo.Description);
					return false;
				}
				console.log('请求数据:' + JSON.stringify(response));
				var YuYueDateList = response.UserArea.YuYueDateList;
				var option = [];
				if(YuYueDateList.length < 1) {} else {
					for(var i = 0; i < YuYueDateList.length; i++) {
						var value = YuYueDateList[i].YuYueDateInfo.Date;
						var text = YuYueDateList[i].YuYueDateInfo.Date;
						var jsonText = {
							value: value,
							text: text
						}
						option.push(jsonText);
					}
					if(i == 0) {}
					Zepto('#selectdate').val(YuYueDateList[0].YuYueDateInfo.Date);
					YuYueTimeList(YuYueDateList[0].YuYueDateInfo.Date);
					console.log(JSON.stringify(option));
					Zepto("#selectbut").on('tap', function() {
						UITools.showPopPicker(option, function(text, value, item) {
							Zepto('#selectdate').val(text);
							Zepto('#select').val(value);
							YuYueTimeList(Zepto('#selectdate').val());
						});
					})
				}
			}
		})
	};
	var YuYueTimeList = function(s) {
		//var url = Config.serverUrl + "/AuditAppointment/GetYuYueTimeList";
		var url = Config.extraServerUrl + '/AuditAppointment_KQ/GetYuYueTimeList';
		//var url = "http://218.4.136.118:8086/mockjs/143/Appointment_Time";
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {
			TaskGuid: WindowTools.getExtraDataByKey("taskGuid"),
			YuYueDate: s
		};
		var litemplate = '';
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxx"+url);
		console.log('请求数据:' +requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				console.log(JSON.stringify(response));
				if(response.ReturnInfo.Code == "0") {
					mui.toast(response.ReturnInfo.Description);
					return false;
				};
				if(response.BusinessInfo.Code == "0") {
					mui.toast(response.BusinessInfo.Description);
					return false;
				};
				var YuYueTimeList = response.UserArea.YuYueTimeList;
				var YuYueTimeInfoNew = [];
				//去掉多余层
				for(var i = 0; i < YuYueTimeList.length; i++) {
					YuYueTimeInfoNew.push(YuYueTimeList[i].YuYueTimeInfo);
				};
				getLitemplate(YuYueTimeInfoNew);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
		return JSON.stringify(requestData);
	};
	//动态选择映射模板
	var getLitemplate = function(value) {
		//alert(JSON.stringify(value));
		var temple = '';
		Zepto('#spantimelist').empty();
		if(value.length < 1) {
			//如果是空数据的话先添加一条测试用
//			temple = '<li class="mui-table-view-cell clickconfirm" _start="10:00" _end="11:00" ><span class="appointment-time">09：00~12：00</span><span class="appointment-number">剩余：<span>' + 5 + '</span>人</span></li>';
//			Zepto('#spantimelist').append(temple);
		} else {
			console.log(JSON.stringify(value))
			for(var i = 0; i < value.length; i++) {
				if((value[i].YuYueSum - value[i].YiYuYueSum) == 0 || (value[i].YuYueSum - value[i].YiYuYueSum) < 0) {
					temple = '<li class="mui-table-view-cell"><span class="appointment-time">{{YuYueTimeStart}}~{{YuYueTimeEnd}}</span><span class="appointment-number">预约人数已满</span></li>';
					var output = Mustache.render(temple, value[i]);
					Zepto('#spantimelist').append(output);
				} else {
					var person = parseInt(value[i].YuYueSum) - parseInt(value[i].YiYuYueSum);
					temple = '<li class="mui-table-view-cell clickconfirm" _start="{{YuYueTimeStart}}" _end="{{YuYueTimeEnd}}" ><span class="appointment-time">{{YuYueTimeStart}}~{{YuYueTimeEnd}}</span><span class="appointment-number">剩余：<span>' + person + '</span>人</span></li>';
					var output = Mustache.render(temple, value[i]);
					Zepto('#spantimelist').append(output);
				}
			}
		};
		confirm();
		return temple;
	}

	//设置每个li的点击事件
	var confirm = function() {
		Zepto(".mui-table-view").on('tap', '.clickconfirm', function() {
			var data = {
				UserPK: OpenID,
				taskguid: TaskGuid,
				TaskName: escape(TaskName),
				OUName: escape(OUName),
				YuYueDate: Zepto("#selectdate").val(),
				YuYueTimeStart: Zepto(this).attr('_start'),
				YuYueTimeEnd: Zepto(this).attr('_end'),
				Name: Name,
				SFZ: SFZ,
				PHONE: PHONE
			};
			WindowTools.createWin('test', 'ZWFW_Appointment_Add.html', data);
		})
	}
});