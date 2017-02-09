/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述:  选择文件
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UploadH5Tools = require('UpLoadH5Tools_Core');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var OpenID = ''; //oegp-juHNw3zwjIAQm3T4OPYAKHk
	var ProjectGuid = ''; //019ca242-d7bc-4d1a-a88e-ef04d5018dbf
	var attachfiles = [];
	var attachnum = 0;
	var ClientGuid = ''; //C86B0C70-FE5F-4C32-8185-3AB7F2BF3563
	var Token = '';
	var Mname = '';
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
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid");
			ClientGuid = WindowTools.getExtraDataByKey("ClientGuid");
			Mname = decodeURIComponent(WindowTools.getExtraDataByKey("Mname"));
			//console.log(Mname)
			document.getElementById('Mname').innerHTML = Mname;
			//获取token
			config.GetToken(function(token) {
				//console.log(token);
				Token = token;
				GETlist();
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				//console.log(bathpath);
			})

			attachdetail();
			document.getElementById('finish').addEventListener('tap', function(e) {
				mui.back();

			});
		});
	}

	function GETlist() {
		var url = config.serverUrl + "/Attach/GetAttachList";
		var requestData = {
			ValidateData: Token,
			paras: {
				ClientGuid: ClientGuid
			}
		};
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url);
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				//console.log('请求成功');
				//console.log(JSON.stringify(rtnData));
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

				if(AttachList.length < 1) {
					//  strTaskHtml = " <div ><p>请点击右边按钮上传附件</p></div>";

				} else {
					strTaskHtml = '';
					for(var i = 0; i < AttachList.length; i++) {
						strTaskHtml += '<li class=" mui-table-view-cell doclist_cell "id="' + AttachList[i].AttachInfo.AttachGuid + '">' + AttachList[i].AttachInfo.AttachFileName + '</li>';
					}

					Zepto('.doclist').append(strTaskHtml);

				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	function attachdetail() {
		//		Zepto('.mui-slider-handle').on('tap',function(){
		//			alert(1)
		//		})
		mui('#doclist').on('tap', '.doclist_cell', function() {
			var id = this.getAttribute("id");
			var extStart = this.innerText;
			//console.log(extStart);

			var ext = extStart.substring(extStart, extStart.length).toUpperCase();
			if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
				config.GetToken(function(token) {
					//console.log(token);
					Token = token;
					getattachurl(id);
				});

			} else {
				mui.openWindow({
					url: "ZWFW_Attach.html?AttachGuid=" + id
				});
			}
		});

	}

	/**
	 * 获取附件下载地址
	 */
	function getattachurl(s) {
		var url = config.serverUrl + "/Attach/GetAttachURL";

		var requestData = {
			ValidateData: Token,
			paras: {
				AttachGuid: s
			}
		}
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				//console.log('请求成功');
				//console.log(JSON.stringify(rtnData));
				if(rtnData.ReturnInfo.Code == "0") {
					mui.toast(rtnData.ReturnInfo.Description);
					return;
				}
				if(rtnData.BusinessInfo.Code == "0") {
					mui.toast(rtnData.BusinessInfo.Description);
					return;
				}
				var AttachInfo = rtnData.UserArea.AttachURL;
				//console.log(AttachInfo);
				var strTaskHtml = "";
				if(AttachInfo.length < 1) {} else {
					mui.openWindow({
						url: AttachInfo
					});
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}
});