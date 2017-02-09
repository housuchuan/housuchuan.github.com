/**
 * 作者: daike
 * 时间: 2016-09-07
 * 描述: 回复材料查看
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
	var ClientGuid = '';
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
			//OpenID = WindowTools.getExtraDataByKey("UserPK");
			ClientGuid = WindowTools.getExtraDataByKey('ClientGuid');

			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getMaterialList();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
			//初始化按钮
			init();
		});
	}

	function init() {
		//查看附件
		document.getElementById('iteminfo').addEventListener('tap', function(e) {

			if(e.target.tagName === 'A') {
				var id = e.target.id;
				var pars = id.split(';');
				var extStart = pars[1].lastIndexOf(".");
				var ext = pars[1].substring(extStart, pars[1].length).toUpperCase();
				if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
					config.GetToken(function(token) {
						//console.log(token);
						Token = token;
						getattachurl(pars[0]);
					});

				} else {
					mui.openWindow({
						url: "ZWFW_Attach.html?AttachGuid=" + pars[0]
					});
				}
			}

		});
	}
	/**
	 * 获取材料列表
	 */
	function getMaterialList() {
		var url = config.serverUrl + "/Attach/GetAttachList";
		var requestData = {
			ValidateData: Token,
			paras: {
				ClientGuid: ClientGuid
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

				var AttachList = rtnData.UserArea.AttachList;
				var strTaskHtml = "";
				var totalcount = rtnData.UserArea.TotalCount;
				$('#totalnum').html(totalcount.toString());

				if(AttachList.length < 1) {

					strTaskHtml = " <div ><p>没有找到相应的数据</p></div>";

				} else {

					for(var i = 0; i < AttachList.length; i++) {
						strTaskHtml = strTaskHtml + "<li class='mui-table-view-cell'> ";
						strTaskHtml = strTaskHtml + "<a  id='" + AttachList[i].AttachInfo.AttachGuid + ";" + AttachList[i].AttachInfo.AttachFileName + "'>" + AttachList[i].AttachInfo.AttachFileName + "</a></li>";
					}
				}
				$('#iteminfo').html(strTaskHtml);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};
	/**
	 * 下载材料
	 */
	function getattachurl(AttachGuid) {
		var url = config.serverUrl + "/Attach/GetAttachURL";
		var requestData = {
			ValidateData: Token,
			paras: {
				AttachGuid: AttachGuid
			}
		};
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url);
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
				var AttachInfo = rtnData.UserArea.AttachURL;
				var strTaskHtml = "";
				if(AttachInfo.length < 1) {

				} else {

					mui.openWindow(AttachInfo);

				}

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}
});