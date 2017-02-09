/**
 * 作者: daike
 * 时间: 2016-08-31
 * 描述:  
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var Token = '';
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var ProjectGuid = '';
	var OpenID = '';
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
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid");
			//初始化
			console.log("初始化");
			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token;
				initBJinfo();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				console.log(bathpath);
			})
			init();
		});
	}
	/**
	 * 初始化申报信息
	 */
	function initBJinfo() {
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
				console.log('初始化办件请求成功');
				console.log(JSON.stringify(rtnData));
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
							applyertype = "INDIVIDUAL";
						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("10") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("20") <= -1) {

							Zepto('#spxm').html("企业名称");
							Zepto('#spsfz').val("组织机构代码证");
							Zepto('#ApplerType').val("10");
							applyertype = "COMPANY";
						} else if(CSHInfo.TaskAPPLYERTYPE.indexOf("20") > -1 && CSHInfo.TaskAPPLYERTYPE.indexOf("10") <= -1) {

							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");
							Zepto('#ApplerType').val("20");
							applyertype = "INDIVIDUAL";
						}

						//申请人初始化
						getApplerList(applyertype);
					} else {

						if(CSHInfo.ApplyerTypeText == '个人') {
							Zepto('#spxm').html("申请人");
							Zepto('#spsfz').val("身份证");

						} else {
							Zepto('#spxm').html("企业名称");
							Zepto('#spsfz').val("组织机构代码证");

						}
						Zepto('#xm').val(CSHInfo.ApplyerName);
						Zepto('#sfz').val(CSHInfo.CertNum);
						Zepto('#lxr').val(CSHInfo.ContactPerson);
						Zepto('#lxsj').val(CSHInfo.ContactPhone);
						Zepto('#lxdz').val(CSHInfo.Address);
					}
				}
			}
		});
	}

	function init() {
		Zepto('#selecttype').on('tap', function() {
			var options = [{
				value: '10',
				text: '企业办事'
			}, {
				value: '20',
				text: '个人办事'
			}]
			UITools.showPopPicker(options, function(text, value, item) {
				//console.log(text + ';' + value + ';' + item);
				Zepto('#selecttype').val(text);
				Zepto('.ApplerType').val(value);
				if(document.getElementById("selecttype").value == "个人办事") {
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
		Zepto('#btnnext').on('tap', function() {
			var data = getInputData();
			if(checkInput(data) == true) {
				console.log("发布:" + JSON.stringify(data));
				publish(data);
			}
		});
	}
});