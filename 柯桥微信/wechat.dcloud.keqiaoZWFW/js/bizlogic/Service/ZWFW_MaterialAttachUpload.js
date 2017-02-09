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
	var OpenID = '';
	var ProjectGuid = '';
	var attachfiles = [];
	var attachnum = 0;
	var ClientGuid = '';
	var Token = '';
	var Mname = '';
	var IS_IOS = '';
	//最大上传数量
	var maxcount = '';
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
			if(CommonTools.os.ios) {
				IS_IOS = '1';
				console.log(IS_IOS)
			}
			maxcount = WindowTools.getExtraDataByKey("maxcount");
			console.log(maxcount);
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid");
			ClientGuid = WindowTools.getExtraDataByKey("ClientGuid");
			Mname = decodeURIComponent(WindowTools.getExtraDataByKey("Mname"));
			console.log(Mname)
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
			var oFile = document.getElementById("fileuploadbtn");
			oFile.addEventListener('change', function(evt) {
				console.log(oFile.files[0]);
				if(oFile.files) // upfile.files，一般来说这个对象也是由系统提供的，不可以自己生成
				{
					attachfiles = [{
						name: oFile.files[0].name,
						file: oFile.files[0]
					}];
					console.log(JSON.stringify(attachfiles))
					upload();
				}
			});
			attachdetail();
			document.getElementById('finish').addEventListener('tap', function(e) {
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID

				});

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

				if(maxcount == rtnData.UserArea.TotalCount) {
					Zepto('#uploader').hide();
				} else {
					Zepto('#uploader').show();
				}
				if(AttachList.length < 1) {
					//  strTaskHtml = " <div ><p>请点击右边按钮上传附件</p></div>";

				} else {
					strTaskHtml = '';
					for(var i = 0; i < AttachList.length; i++) {
						strTaskHtml += '<li class=" mui-table-view-cell doclist_cell mui-transitioning"id="' + AttachList[i].AttachInfo.AttachGuid + '"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red"style="transform: translate(0px, 0px);"id="' + AttachList[i].AttachInfo.AttachGuid + '">删除</a></div><div class="mui-slider-handle"style="transform: translate(0px, 0px);"id="' + AttachList[i].AttachInfo.AttachGuid + '">' + AttachList[i].AttachInfo.AttachFileName + '</div></li>';
					}
					Zepto('.doclist').html('');
					Zepto('.doclist').append(strTaskHtml);

				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}
	/*
	 * 上传
	 */
	function upload() {
		UITools.showWaiting();
		UploadH5Tools.upLoadFiles({
			url: config.serverUrl + '/Attach/AttachUpload',
			//url:'http://218.4.136.118:8086/mockjs/55/testUpload',
			//url:'http://115.29.151.25:8012/webUploaderServer/fileupload.php',
			data: {
				CliengGuid: ClientGuid,
				IS_IOS: IS_IOS
			},
			files: attachfiles,
			beforeUploadCallback: function() {
				console.log("准备上传");

			},
			successCallback: function(response, detail) {
				console.log("上传成功:" + JSON.stringify(response));
				console.log("detail:" + detail);
				Zepto('.doclist').html('');
				UITools.closeWaiting();
				GETlist();
			},
			errorCallback: function(msg, detail) {
				console.log("上传失败:" + msg);
				console.log("detail:" + detail);

			},
			uploadingCallback: function(percent, msg, speed) {
				console.log("上传中:" + percent + ',msg:' + msg + ',speed:' + speed);

			}
		});
	}

	function attachdetail() {
		//		Zepto('.mui-slider-handle').on('tap',function(){
		//			alert(1)
		//		})
		Zepto('#doclist').on('tap', '.mui-slider-handle', function(event) {
			var id = event.target.id;
			var extStart = this.innerText;
			console.log(extStart);

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

		var btnArray = ['确认', '取消'];
		//第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
		Zepto('#doclist').on('tap', '.mui-btn-red', function(event) {

			var id = event.target.id;
			var elem = this;
			var pnode = elem.parentNode;
			var linode = pnode.parentNode;
			mui.confirm('确认删除该附件？', '', btnArray, function(e) {
				if(e.index == 0) {
					deleteattach(id, linode);
				}
			});
		});
	}
	/**
	 * 删除附件
	 * @param {Object} s
	 */
	function deleteattach(s, $) {
		var url = config.serverUrl + "/Attach/AttachDelete";

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
				$.parentNode.removeChild($);
				GETlist();
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
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
				if(AttachInfo.length < 1) {} else {
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