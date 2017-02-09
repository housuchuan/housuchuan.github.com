/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 我的预约
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var Token = '';
	var searchValue = '';
	var count = 0;
	var maxPageIndex = 1;
	var url = "";
	var ValidateData = '';
	var pageSize = 10;
	var totalcount = '';
	var url = '';
	//区分我的预约和历史预约，我的预约yjyy
	var ShowType = 'yjyy';
	var UserGuid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
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
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			//获取token
			url = Config.serverUrl + "/AuditAppointment/getAppointmentList";
			OpenID = WindowTools.getExtraDataByKey("UserPK")||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				//通过openid获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					if(LoginID || LoginID !== '') {
						UserGuid = UserGuid;
						initPullRefreshList(UserGuid);
						change();
						AddAppointment();
					} else {
						var specialUrl = encodeURIComponent('ZWFW_MyAppointment.html?UserPK=' + OpenID);
						window.location.href = 'ZWFW_Binding.html?URL=' + specialUrl + '&UserPK=' + OpenID;
					}

				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});

	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(UserGuid) {
		//动态选择映射模板
		var getLitemplate = function(value) {
			var inputtype = Zepto('#inputtype').val()
			var temple = '';
			//		var url = "http://218.4.136.118:8086/mockjs/143/MyAppointmen";
			console.log(JSON.stringify(value));
			if(inputtype == "0") {
				var temple =
					'<li class="mui-table-view-cell"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red" id="{{AppointmentGuid}}">取消预约</a></div><div class="mui-slider-handle"><span class="appointment-date">预约事项:</span><p class="cancel-reservation"></p><p class="appointment-matters">{{TaskName}}</p><label>{{AppointmentTime}}</label></div></li>';
				console.log('00')
			} else {
				if(value.Status === "0") {
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{TaskName}}</p><p class="cancel-reservation current2">{{YuYueStatus}}</p><label>{{AppointmentTime}}</label></li>';
					console.log('111')
				} else {
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{TaskName}}</p><p class="cancel-reservation current1">{{YuYueStatus}}</p><label>{{AppointmentTime}}</label></li>';
				}
			}
			return temple;
		};
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				currentpageindex: currPage.toString(),
				pagesize: pageSize.toString(),
				tabType: 'tab1',
				searchValue: searchValue,
				ShowType: ShowType,
				UserGuid: UserGuid
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+url);
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {

		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.ReturnInfo.Code == "0") {
				mui.toast(response.ReturnInfo.Description);
				return;
			}
			if(response.BusinessInfo.Code == "0") {
				mui.toast(response.BusinessInfo.Description);
				return;
			}
			var AppointmentList = response.UserArea.AppointmentList;
			var AppointmentInfo = [];
			//去掉多余层
			for(var i = 0; i < AppointmentList.length; i++) {
				AppointmentInfo.push(AppointmentList[i].AppointmentInfo);
			}
			var totalcount = response.UserArea.TotalCount;
			Zepto('#totalnum').html(totalcount.toString());
			maxPageIndex = Math.ceil(totalcount / pageSize);
			return AppointmentInfo;
		};
		//mock完成后回调函数
		var successRequestCallback = function() {

		};
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				successRequestCallback: successRequestCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
			},
			skin: 'type1'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
	var change = function() {
		var inputtype = Zepto('#inputtype').val();
		Zepto('#myyy').on('tap', function(e) {
			Zepto('#inputtype').val("0");
			ShowType = 'yjyy';
			pullToRefreshObj.refresh();
		});
		Zepto('#lsyy').on('tap', function(e) {
			Zepto('#inputtype').val("1");
			ShowType = '';
			pullToRefreshObj.refresh();
		});
		var btnArray = ['确认', '取消'];
		Zepto('#listdata').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认删除该条预约？', '', btnArray, function(e) {
				if(e.index == 0) {
					var id = event.target.id;
					li.parentNode.removeChild(li);
					console.log(id)
					elem.parentNode.removeChild(elem);
					deleteappointment(event.target.id);
				};

			});
		});
	}

	function deleteappointment(s) {
		url = Config.serverUrl + "/AuditAppointment/deleteAppointment";
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			AppointmentGuid: s
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + JSON.stringify(requestData));
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				if(response.ReturnInfo.Code == "0") {
					alert(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					alert(response.BusinessInfo.Description);
					return false;
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	}
	var AddAppointment = function() {
		Zepto('#AddAppointment').on('tap', function() {
			Config.getProjectBasePath(function(bathpath) {
				var bathpath = bathpath;
				console.log(bathpath)
				var openurl = '/html/Service/ZWFW_CommonService.html';
				var value = WindowTools.getExtraDataByKey("UserPK")||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
				var url1 = bathpath + openurl + '?UserPK=' + value + '&URL=/html/Interaction/ZWFW_Appointment_Add.html&type=department';
				console.log(openurl);
				WindowTools.createWin('detail2', url1, value);
			});
		})
	}

});