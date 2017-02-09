/**
 * 作者: daike
 * 时间: 2016-09-01
 * 描述:  我的投诉
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefreshObj;
	var pageSize = '10';
	var OpenID = '';
	var userguid = '';
	var Token = '';
	var searchValue = '';
	var totalcount = '';
	var url = config.serverUrl + '/Consult/GetAuditConsultList';
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
			'js/libs/zepto.min.js',
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK")||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			searchValue = document.getElementById('TaskName').value;
			//获取token
			config.GetToken(function(token) {
				console.log(token);
				Token = token;
				//通过openid获取用户信息
				config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					if(LoginID || LoginID !== '') {
						userguid = UserGuid
						initPullRefreshList();
					} else {
						var specialUrl = encodeURIComponent('ZWFW_Mycompliant.html?UserPK=' + OpenID);
						window.location.href = 'ZWFW_Binding.html?URL=' + specialUrl + '&UserPK=' + OpenID;
					}
				}, function(response) {
					console.log(JSON.stringify(response));
				});
			}, function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
			});
			document.getElementById('addcomplain').addEventListener('tap', function() {
				self.location = 'ZWFW_addcomplain.html?UserPK=' + OpenID;
			});
			//搜索
			mui('#search').on('change', '#TaskName', function() {
				searchAction();
			});
			mui('#search').on('tap', '#input-searchName', function() {
				searchAction();
			});
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {

		searchValue = document.getElementById('TaskName').value;
		//刷新
		console.log("搜索:" + searchValue);
		pullToRefreshObj.refresh();

	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//动态选择映射模板
		var getLitemplate = function(value) {
			console
			var temple = '';
			if(value.ISANSWER == "0") {
				temple = "<li class='mui-table-view-cell' id='{{RowGuid}}'><p class='appointment-matters' style='word-break: break-all;' id='{{RowGuid}}' >{{QUESTION}}</p><p class='mui-clearfix' id='{{RowGuid}}'><span class='appointment-date' id='{{RowGuid}}'>{{ASKDATE}}</span><span class='cancel-reservation current1' id='{{RowGuid}}'>未答复</span></p></li>"
			} else {
				temple = "<li class='mui-table-view-cell' id='{{RowGuid}}'><p class='appointment-matters' style='word-break: break-all;'  id='{{RowGuid}}' >{{QUESTION}}</p><p class='mui-clearfix' id='{{RowGuid}}'><span class='appointment-date' id='{{RowGuid}}'>{{ASKDATE}}</span><span class='cancel-reservation current2' id='{{RowGuid}}'>已答复</span></p></li>"
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
				UserGuid: userguid,
				QUESTION: searchValue,
				ConsultType: '31'
					//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {
			var id = e.target.id;
			console.log(id)
			mui.openWindow({
				url: "ZWFW_ComplaintDetail.html?RowGuid=" + id
			});

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
			var ConsultList = response.UserArea.ConsultList;
			var projectlist = [];
			//去掉多余层
			for(var i = 0; i < ConsultList.length; i++) {
				projectlist.push(ConsultList[i].ConsultInfo);
			}
			totalcount = response.UserArea.TotalCount;

			return projectlist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		var successRequestCallback = function() {

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
				//请求成功,并且成功处理后会调用的成功回调方法,传入参数是成功处理后的数据
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
			}, 100);
		});

	}
});