/**
 * 作者: daike
 * 时间: 2016-08-29
 * 描述: 自助申报查看
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var Token = '';
	var ProjectGuid = ''; //6a7204e2-ffea-452e-99f7-8d4ef1adedb8
	var Bathpath = '';
	var OpenID = ''; //oegp-juHNw3zwjIAQm3T4OPYAKHk
	var EditM = '0';
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
			EditM = WindowTools.getExtraDataByKey("EditM");
			if(EditM == '1') {
				$('#btnnext').html("补正材料");
			} else {
				$('#btnnext').html("查看材料");
			}
			//获取token
			config.GetToken(function(token) {
				//console.log(token);
				Token = token;
				initBJinfo();
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				Bathpath = bathpath;
				//console.log(Bathpath)
			});

			init();
		});
	}

	function init() {
		Zepto('#btnnext').on('tap', function() {
			if(EditM == '1') {
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
				});
			} else {
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUploadDetail.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
				});
			}
		});
		document.getElementById('divspjg').addEventListener('tap', function(e) {
			if(e.target.id === 'xgfj') {
				mui.openWindow({
					url: "ZWFW_AttachList.html?ClientGuid=" + ProjectGuid
				});

			}

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
					//  strTaskHtml = " ";
				} else {
					if(CSHInfo.ApplyerTypeText == '个人') {
						$('#spxm').html("申请人");
						$('#spsfz').text("身份证号");
					} else {
						$('#spxm').html("企业名称");
						$('#spsfz').text("组织机构代码证");
					}
					$('#xm').text(CSHInfo.ApplyerName);
					$('#sfz').text(CSHInfo.CertNum);
					$('#lxr').text(CSHInfo.ContactPerson);
					$('#lxsj').text(CSHInfo.ContactPhone);
					$('#lxdz').text(CSHInfo.Address);
					$('#sqrq').text(CSHInfo.ApplyDate);
					if(CSHInfo.Status == "正常办结") {

						if(CSHInfo.ProjectResult == "50") {
							$('#bljd').text("正常办结(不予许可)");
						} else {
							$('#bljd').text("正常办结(准予许可)");
						}
					} else {
						$('#bljd').text(CSHInfo.Status);
					}
					$('#taskname').text(CSHInfo.TaskName);
					$('#flowsn').text(CSHInfo.FLOWSN);
					if(CSHInfo.ResultAttachCount == "0") {
						//document.getElementById("divspjg").style.display = none;
						Zepto('#divspjg').css('display','none');
					} else {
						document.getElementById("divspjg").style.display = "";
					}

					$('#sprq').text(CSHInfo.BanwanDate);
					$('#spjg').text(CSHInfo.ResultName);
					$('#xgfj').text("共有" + CSHInfo.ResultAttachCount + "个附件");

				}
			}
		});
	}

});