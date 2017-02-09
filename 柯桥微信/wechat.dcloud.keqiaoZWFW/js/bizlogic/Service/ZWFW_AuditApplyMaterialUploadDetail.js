/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述:  办件材料提交
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
	var Bathpath = '';
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
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			ProjectGuid = WindowTools.getExtraDataByKey('ProjectGuid');

			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getMaterialList();
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				console.log(bathpath);
				Bathpath = bathpath;
			})
			document.getElementById('submit').addEventListener('tap', function(e) {
				mui.openWindow({
					url: "../itemCheck/keqiao_serviceQuery.html?UserPK=" + OpenID
				});
			})
		});
	}
	/**
	 * 获取需要提交的材料列表
	 */
	function getMaterialList() {
		var url = config.serverUrl + "/AuditProject/getMaterialList";
		var requestData = {
			ValidateData: Token,
			paras: {
				ProjectGuid: ProjectGuid
			}
		};
		//console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
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

				var MaterialList = rtnData.UserArea.MaterialList;
				var strTaskHtml = "";

				if(MaterialList.length < 1) {
					strTaskHtml = " <div ><p>该申报事项无需申报材料</p></div>";

				} else {
					for(var i = 0; i < MaterialList.length; i++) {
						strTaskHtml = strTaskHtml + "<li class='mui-table-view-cell'> ";
						if(MaterialList[i].MaterialInfo.Necessity == "非必要") {
							strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].MaterialInfo.MaterialName + ";" + MaterialList[i].MaterialInfo.ClientGuid + "' class='mui-navigate-right mui-clearfix material-name'  > " + MaterialList[i].MaterialInfo.MaterialName + "<br><span id='" + MaterialList[i].MaterialInfo.MaterialName + ";" + MaterialList[i].MaterialInfo.ClientGuid + "' class='material-count' >已上传：" + MaterialList[i].MaterialInfo.AttachCount + "</span></a></li>";
						} else {
							strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].MaterialInfo.MaterialName + ";" + MaterialList[i].MaterialInfo.ClientGuid + "' class='mui-navigate-right mui-clearfix material-name' > " + MaterialList[i].MaterialInfo.MaterialName + "<span class='star'>(*)</span><br><span id='" + MaterialList[i].MaterialInfo.MaterialName + ";" + MaterialList[i].MaterialInfo.ClientGuid + "' class='material-count' >已上传：" + MaterialList[i].MaterialInfo.AttachCount + "</span></a></li>";
							//存在必填材料未上传
							if(MaterialList[i].MaterialInfo.AttachCount == "0") {
								Zepto("#is_submit").val("0");
							}
						}
						console.log(strTaskHtml);

					}
					/**
					 * 绑定事件点击事件
					 */
					document.getElementById('iteminfo').addEventListener('tap', function(e) {
						if(e.target.tagName === 'A') {
							var pars = e.target.id.split(';');
							mui.openWindow({
								url: "ZWFW_MaterialAttachDetail.html?projectguid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[1] + "&UserPK=" + OpenID
							});
						}
						if(e.target.tagName === 'SPAN') {
							var pars = e.target.id.split(';');

							mui.openWindow({
								url: "ZWFW_MaterialAttachDetail.html?projectguid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[1] + "&UserPK=" + OpenID
							});
						}

					});
				}
				$('#iteminfo').html(strTaskHtml);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};

});