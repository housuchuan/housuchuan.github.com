/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项查看详情页 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	var taskGuid = '';
	var UserPK = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var ProjectGuid = '';
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
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			taskGuid = WindowTools.getExtraDataByKey('TaskGuid')||'';
			UserPK = WindowTools.getExtraDataByKey('UserPK')||'';
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//token验证
			Config.GetToken(function(token) {
				consult(token);
				yuYue(token);
				ajaxData(token);
			});
			console.log('接收：' + taskGuid);
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}
	//咨询
	function consult(token) {
		Zepto('#consult').on('tap', function() {
			Config.getUserguidbyOpenID(token, UserPK, function(LoginID, UserGuid, tips) {
				if(LoginID && LoginID != '') {
					window.location.href = httppath + '/html/Interaction/ZWFW_Consult_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid;
				} else {
					var specialUrl = encodeURIComponent('ZWFW_Consult_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid);
					window.location.href = httppath + '/html/Interaction/ZWFW_Binding.html?URL=' + specialUrl + '&UserPK=' + UserPK;
				}
			});
		});
	}
	//预约
	function yuYue(token) {
		Zepto('#appointment').on('tap', function() {
			Config.getUserguidbyOpenID(token, UserPK, function(LoginID, UserGuid, tips) {
				if(LoginID && LoginID != '') {
					window.location.href = httppath + '/html/Interaction/ZWFW_Appointment_Add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid;
				} else {
					var specialUrl = encodeURIComponent('ZWFW_Appointment_Add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid);
					window.location.href = httppath + '/html/Interaction/ZWFW_Binding.html?URL=' + specialUrl + '&UserPK=' + UserPK;
				}
			});
		});
	}
	//判断是否可以外网申报
	function webSB(token, canSB) {
		Zepto('#apply').on('tap', function() {
			if(canSB == '0') {
				UITools.toast('该事项暂不支持外网申报！');
			} else {
				//判断用户是否绑定
				Config.getUserguidbyOpenID(token, UserPK, function(LoginID, UserGuid, tips) {
					getProjectGuid(token, LoginID);
				});

			}
		});
	}
	/**
	 * @description 初始化数据
	 */
	function ajaxData(token) {
		var url = Config.serverUrl + '/AuditTask/GetTaskDetail';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			TaskGuid: taskGuid
		}
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UITools.closeWaiting();
				console.log("事项详情success");
				console.log('申报详情数据'+JSON.stringify(response));
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
					var matericalLength = '';
					if(Array.isArray(response.UserArea.MatericalList)) {
						matericalLength = response.UserArea.MatericalList.length;
					}
					var tmp = response.UserArea;
					tmp.matericalLength = matericalLength;
					//判断是否可以外网申报
					var canSB = tmp.WEBAPPLYTYPE;
					if(tmp.TaskOutImgAttachGuid && tmp.TaskOutImgAttachGuid != '') {
						tmp.picLength = 1;
					} else {
						tmp.picLength = 0;
					}
					var moban = "<li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项名称</label><span>{{TaskName}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项编码</label><span>{{Item_ID}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>办理部门</label><span>{{OUName}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项性质</label><span>{{TYPE}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>承诺期限</label><span class='current'>{{PROMISE_DAY}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>收费情况</label><span class='current1'>{{CHARGE_FLAG}}</span></a></li><li class='mui-table-view-cell'><a href='tel:{{LINK_TEL}}'class='mui-navigate-right current  mui-clearfix'><label>窗口电话</label><span class='current'>{{LINK_TEL}}</span></a></li><li class='mui-table-view-cell'><a href='tel:{{SUPERVISE_TEL}}'class='mui-navigate-right current  mui-clearfix'><label>监督电话</label><span class='current'>{{SUPERVISE_TEL}}</span></a></li><li class='mui-table-view-divider'></li><li class='mui-table-view-cell' id='cailiao'><a class='mui-navigate-right mui-clearfix'><label>所需材料</label><span id='materials'>材料列表({{matericalLength}})</span></a></li><li class='mui-table-view-cell' id='pic' href='{{TaskOutImgAttachGuid}}'><a class='mui-navigate-right mui-clearfix'><label>办理流程</label><span>流程图片({{picLength}})</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current mui-clearfix'><label>受理条件</label><span>{{CONDITION}}</span></a></li>";
					var output = Mustache.render(moban, tmp);
					Zepto('#content').html('');
					Zepto('#content').append(output);
					Zepto('#cailiao').on('tap', function() {
						window.location.href = httppath + '/html/Service/ZWFW_MaterialCheck_parent.html?TaskGuid=' + taskGuid;
					});
					Zepto('#pic').on('tap', function() {
						var picGuid = Zepto(this).attr('href');
						if(picGuid != '') {
							window.location.href = httppath + '/html/Service/ZWFW_PicCheck.html?AttachGuid=' + picGuid;
						}
					});
					//token验证
					Config.GetToken(function(token) {
						webSB(token, canSB);
					});

				} else {
					UITools.toast('请求数据失败');
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
	/**
	 * @description 通过taskguid生成projectguid
	 */
	function getProjectGuid(token, LoginID) {
		var url = Config.serverUrl + '/AuditProject/CreateProject';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			TaskGuid: taskGuid
		}
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UITools.closeWaiting();
				console.log("事项详情success");
				console.log(JSON.stringify(response));
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
					ProjectGuid = response.UserArea.ProjectGuid;
					console.log("ProjectGuid:" + ProjectGuid);
					if(LoginID && LoginID != '') {
						window.location.href = httppath + '/html/Service/ZWFW_AuditApply.html?ProjectGuid=' + ProjectGuid + '&UserPK=' + UserPK;
					} else {
						var specialUrl = encodeURIComponent('../Service/ZWFW_AuditApply.html?UserPK=' + UserPK + '&ProjectGuid=' + ProjectGuid);
						console.log(specialUrl)
						window.location.href = httppath + '/html/Interaction/ZWFW_Binding.html?URL=' + specialUrl + '&UserPK=' + UserPK;
					}
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				//UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}

});