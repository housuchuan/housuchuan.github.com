/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 我的办件
 */
define(function(require, exports, module) {
	"use strict";
	var count = 0;
	var maxPageIndex = 1;
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var url = '';
	var pageSize = 10;
	//搜索值
	var Token = '';
	var ulpull = '';
	var SearchValue = '';
	var ValidateData = '';
	var UserGuid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var TotalCount = '';
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
			url = Config.serverUrl + "/AuditProject/getProjectList"
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				//通过openid获取用户信息
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, userguid, tips) {
					UserGuid = userguid;
					initPullRefreshList();
					initListeners();
					del();
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});

	}
	/*初始化监听*/
	function initListeners() {
		//搜索
		mui('#search').on('tap', '#input-searchName', function() {
			searchAction();
		});
		mui('#search').on('change', '#TaskName', function() {
			searchAction();
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {
		SearchValue = document.getElementById('TaskName').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:" + SearchValue);
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//动态选择映射模板
		var getLitemplate = function(value) {
			var temple = '';
			console.log(JSON.stringify(value));
			if(value.Status == '外网申报未提交') {
				temple = '<li id="{{ProjectGuid}}" _task="{{Status}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-right mui-disabled"><a id="{{ProjectGuid}}" class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{ProjectGuid}}" _task="{{Status}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{FLOWSN}}</span><span class="state"><label>状态：</label>{{Status}}</span></p><p id="{{ProjectGuid}}" _task="{{Status}}" class="requirement">{{TaskName}}</p><p id="{{ProjectGuid}}" _task="{{Status}}"  class="unit"><label>办理部门：</label>{{OUName}}</p></div></div></li>';
			} else {
				temple = '<li id="{{ProjectGuid}}" _task="{{Status}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{ProjectGuid}}" _task="{{Status}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{FLOWSN}}</span><span class="state"><label>状态：</label>{{Status}}</span></p><p id="{{ProjectGuid}}" _task="{{Status}}" class="requirement">{{TaskName}}</p><p id="{{ProjectGuid}}" _task="{{Status}}"  class="unit"><label>办理部门：</label>{{OUName}}</p></div></div></li>';
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
				UserGuid: UserGuid,
				TaskName: SearchValue,
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {

		};
		//动态处理数据
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.ReturnInfo.Code == "0") {
				mui.toast(response.ReturnInfo.Description);
				return;
			};
			if(response.BusinessInfo.Code == "0") {
				mui.toast(response.BusinessInfo.Description);
				return;
			}
			var tasklist = response.UserArea.ProjectList;
			var projectlist = [];
			//去掉多余层
			for(var i = 0; i < tasklist.length; i++) {
				projectlist.push(tasklist[i].ProjectInfo);
			}
			TotalCount = response.UserArea.TotalCount;
			Zepto('#totalnum').html(TotalCount.toString());
			maxPageIndex = Math.ceil(TotalCount / pageSize);
			return projectlist;
		}
		var successRequestCallback = function() {
			document.getElementsByTagName('ul')[0].addEventListener('tap', function(e) {
					var id = e.target.id;
					var pars = id;
					var task = Zepto("#" + pars).attr('_task');
					if(e.target.tagName === 'li') {
						if(task == '外网申报未提交') {
							mui.openWindow({
								url: "../Service/ZWFW_AuditApply.html?ProjectGuid=" + pars + "&UserPK=" + OpenID
							});
						} else if(task == '待补办') {
							mui.openWindow({
								url: "../Service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=1"
							});
						} else {
							mui.openWindow({
								url: "../Service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=0"
							});
						}
					}
					if(e.target.tagName === 'P') {
						if(task == '外网申报未提交') {
							mui.openWindow({
								url: "../Service/ZWFW_AuditApply.html?ProjectGuid=" + pars + "&UserPK=" + OpenID

							});
						} else if(task == '待补办') {
							mui.openWindow({
								url: "../Service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=1"

							});
						} else {
							mui.openWindow({
								url: "../Service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=0"

							});
						}
					}
				}

			);
		}
		var changeToltalCountCallback = function() {
			return TotalCount;
		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});

	}

	function del() {
		Zepto('#listdata').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认删除该条记录？', '', btnArray, function(e) {
				if(e.index == 0) {
					li.parentNode.removeChild(li);
					var id = event.target.id;
					console.log(id)
					elem.parentNode.removeChild(elem);
				} else {
					setTimeout(function() {
						Zepto.swipeoutClose(li);
					}, 0);
				};
				deleteProject(id);
			});
		});
		var btnArray = ['确认', '取消'];
	}

	function deleteProject(s) {
		url = Config.serverUrl + "/AuditProject/deleteProject";
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			ProjectGuid: s
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
});