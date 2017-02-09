/**
 * 作者: daike
 * 时间: 2016-08-29
 * 描述: 自助申报 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var StringTools = require('StringTools_Core');
	var Token = '';
	var userguid = '';
	var ProjectGuid = '99c71282-d36f-4a8a-9c6d-b7fd2612a95d'; //8a9bfa76-e46c-46c8-9738-d8461399db2f
	var Bathpath = '';
	var OpenID = 'oegp-jlrnLOzYaGkMe0HyQm9B_qQ'; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'css/libs/mui.picker.min.css',
			'css/libs/mui.poppicker.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.picker.min.js',
			'js/libs/mui.poppicker.js'
		], function() {
			//OpenID = WindowTools.getExtraDataByKey("UserPK");
			//ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid");

			//获取token
			config.GetToken(function(token) {
				//console.log(token);
				Token = token;
				config.getUserguidbyOpenID(Token, OpenID, function(LoginID, UserGuid, tips) {
					userguid = UserGuid;
				}, function(response) {
					//console.log('请求失败');
					//console.log(JSON.stringify(response));
				});
				initBJinfo();
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				Bathpath = bathpath;
				//console.log(Bathpath)
			});
			Zepto('#btnnext').on('tap', function() {
				var data = getInputData();
				if(checkInput(data) == true) {
					console.log("发布:" + JSON.stringify(data));
					config.GetToken(function(token) {
						//console.log(token);
						Token = token;
						publish(data);
					});

				}
			});

		});
	}

	function init() {
		Zepto('#selecttype').on('tap', function() {
			var options = [{
				value: '10',
				text: '企业'
			}, {
				value: '20',
				text: '个人'
			}]
			UITools.showPopPicker(options, function(text, value, item) {
				//console.log(text + ';' + value + ';' + item);
				Zepto('#selecttype').val(text);
				Zepto('#ApplerType').val(value);
				if(document.getElementById("selecttype").value == "个人") {
					Zepto('#spxm').html("申请人");
					Zepto('#spsfz').val("身份证");
					getApplerList("INDIVIDUAL");
				} else {
					Zepto('#spxm').html("企业名称");
					Zepto('#spsfz').val("组织机构代码证");
					getApplerList("COMPANY");
				}

			});
		});

	}
	/**
	 * 初始化申报信息
	 */
	function initBJinfo() {
		UITools.showWaiting();
		//办件详情
		var url = config.serverUrl + "/AuditProject/getProjectDetail";

		var requestData = {
				ValidateData: Token,
				paras: {
					ProjectGuid: ProjectGuid
				}
			}
			//console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				//console.log('初始化办件请求成功');
				//console.log(JSON.stringify(rtnData));

				if(rtnData.ReturnInfo.Code == "0") {
					mui.toast(rtnData.ReturnInfo.Description);
					return;
				}
				if(rtnData.BusinessInfo.Code == "0") {
					mui.toast(rtnData.BusinessInfo.Description);
					return;
				}

				var CSHInfo = rtnData.UserArea;
				var strTaskHtml = "";

				if(CSHInfo.length < 1) {

				} else {

					if(CSHInfo.ProjectStatus == "8") //办件初始化
					{
						var applyertype = "INDIVIDUAL";

						if(CSHInfo.TaskAPPLYERTYPE.indexOf("20") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("10") > -1) {

							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							Zepto('#selecttype').val('个人');
							init();
							getApplerList("INDIVIDUAL");
						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("10") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("20") <= -1) {

							Zepto('#spxm').html("企业名称");
							Zepto('#spsfz').val("组织机构代码证");
							Zepto('#ApplerType').val("10");
							Zepto('#selecttype').val('企业');
							getApplerList("COMPANY");
						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("20") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("10") <= -1) {

							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							Zepto('#selecttype').val('个人');
							getApplerList("INDIVIDUAL");

						}

					} else {
						var applyertype = "INDIVIDUAL";

						if(CSHInfo.TaskAPPLYERTYPE.indexOf("20") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("10") > -1) {

							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							Zepto('#selecttype').val('个人');
							init();
						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("10") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("20") <= -1) {

							Zepto('#spxm').html("企业名称");
							Zepto('#spsfz').val("组织机构代码证");
							Zepto('#ApplerType').val("10");
							Zepto('#selecttype').val('企业');
							init();

						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("20") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("10") <= -1) {

							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							Zepto('#selecttype').val('个人');
							init();
						}

						if(CSHInfo.ApplyerTypeText == '个人') {
							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							Zepto('#selecttype').val('个人');
						} else {
							Zepto('#spxm').html("企业名称");
							Zepto('#spsfz').val("组织机构代码证");
							Zepto('#ApplerType').val("10");
							Zepto('#selecttype').val('企业');
						}
						Zepto('#ApplerName').val(CSHInfo.ApplyerName);
						Zepto('#CertNum').val(CSHInfo.CertNum);
						Zepto('#ContactPerson').val(CSHInfo.ContactPerson);
						Zepto('#ContactPhone').val(CSHInfo.ContactPhone);
						Zepto('#Address').val(CSHInfo.Address);
						UITools.closeWaiting();
					}
				}
			}
		});
	}

	function getApplerList(applyertype) {
		config.GetToken(function(token) {
			//console.log(token);
			Token = token;
			var url = config.serverUrl + "/Appler/getApplerName";
			var requestData = {
				ValidateData: Token,
				paras: {
					UserGuid: userguid,
					Type: applyertype
				}
			};
			console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
			mui.ajax(url, {
				data: JSON.stringify(requestData),
				dataType: "json",
				type: "POST",
				success: function(rtnData) {
					console.log('请求成功');
					console.log(JSON.stringify(rtnData));
					if(rtnData.ReturnInfo.Code == "0") {
						mui.toast(rtnData.ReturnInfo.Description);
						return;
					}
					if(rtnData.BusinessInfo.Code == "0") {
						mui.toast(rtnData.BusinessInfo.Description);
						return;
					}

					var ApplyerList = rtnData.UserArea.ApplyerList;

					if(ApplyerList.length < 1) {
						UITools.closeWaiting();
					} else {

						getApplerDetail(ApplyerList[0].ApplyerInfo.RowGuid, ApplyerList[0].ApplyerInfo.Type);

					}
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response));
				}
			});

		});
	};

	function getApplerDetail(RowGuid, Type) {
		config.GetToken(function(token) {
			//console.log(token);
			Token = token;
			var url = "";
			if(Type == "INDIVIDUAL") {
				url = config.serverUrl + "/Appler/GetGRApplerDetail";
			} else {
				url = config.serverUrl + "/Appler/GetQYApplerDetail";
			}
			var requestData = {
				ValidateData: Token,
				paras: {
					RowGuid: RowGuid
				}
			}
			mui.ajax(url, {
				data: JSON.stringify(requestData),
				dataType: "json",
				type: "POST",
				success: function(rtnData) {
					console.log(JSON.stringify(rtnData))
					if(rtnData.ReturnInfo.Code == "0") {
						mui.toast(rtnData.ReturnInfo.Description);
						return;
					}
					if(rtnData.BusinessInfo.Code == "0") {
						mui.toast(rtnData.BusinessInfo.Description);
						return;
					}
					if(Type == "INDIVIDUAL") {
						Zepto('#ApplerName').val(rtnData.UserArea.ClientName);
						Zepto('#CertNum').val(rtnData.UserArea.IDNUMBER);
						Zepto('#ContactPerson').val(rtnData.UserArea.CONTACTPERSON);
						Zepto('#ContactPhone').val(rtnData.UserArea.CONTACTPHONE);
						Zepto('#Address').val(rtnData.UserArea.DEPTADDRESS);

					} else {
						Zepto('#ApplerName').val(rtnData.UserArea.ORGANNAME);
						Zepto('#CertNum').val(rtnData.UserArea.ORGANCODE);
						Zepto('ContactPerson').val(rtnData.UserArea.CONTACTPERSON);
						Zepto('#ContactPhone').val(rtnData.UserArea.CONTACTPHONE);
						Zepto('#Address').val(rtnData.UserArea.DEPTADDRESS);
					}
					Zepto('#ApplerUserGuid').val(rtnData.UserArea.RowGuid);
					UITools.closeWaiting();
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response));
				}
			});

		});
	};

	/**
	 * @description 获取文本框的值
	 */
	function getInputData() {
		var data = {};
		var inputs = Zepto("input");
		Zepto.each(inputs, function(key, value) {
			var id = Zepto(this).attr('id');
			var val = Zepto(this).val();
			if(id != null && id != '') {
				eval("data." + id + "='" + val + "'");
			}
		});
		data.UserGuid = userguid;
		data.ProjectGuid = ProjectGuid;
		delete data.selecttype;
		delete data.spsfz;
		delete data.zjlx;
		console.log(JSON.stringify(data))
		return data;
	}
	/**
	 * @description 判断文本框是否为空以及格式
	 * @param {Json} data
	 */
	function checkInput(data) {
		var flag = true;
		var err = '';
		if(data.ApplerName == '') {
			err += "\n名称不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.CertNum == '') {
			err += "\n证件号不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.ContactPerson == '') {
			err += "\n联系人不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.ContactPhone == '') {
			err += "\n联系手机不能为空或您输入的手机号不正确!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.Address == '') {
			err += "\n联系地址不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(!StringTools.isPhoneNumber(data.ContactPhone)) {
			err += "\n手机号码不正确!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(Zepto('#spsfz').val() == "身份证") {
			if(StringTools.validateUserIdendity(data.CertNum)) {

			} else {
				err += "\n身份证号不正确!";
				flag = false;
				UITools.toast(err);
				return flag;
			}
		}

		return flag;

	}

	/**
	 * 下一步并发布数据
	 * @param {Object} data
	 */
	function publish(data) {
		var url = config.serverUrl + '/AuditProject/BeforeSubmitProject';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		requestData.paras = data;
		//某一些接口是要求参数为字符串的
		requestData = JSON.stringify(requestData);
		console.log(requestData + '请求地址' + url)
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				console.log('发布成功')
				console.log(JSON.stringify(response));
				if(response.ReturnInfo.Code == "0") {
					mui.toast(response.ReturnInfo.Description);
					return;
				}
				if(response.BusinessInfo.Code == "0") {
					mui.toast(response.BusinessInfo.Description);
					return;
				}
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
				});
			},
			timeout: 9000,
			error: function(response) {
				console.log('发布失败')
				console.log(JSON.stringify(response));
				UITools.alert({
					content: '发布失败'
				})
			}
		});
	}
});