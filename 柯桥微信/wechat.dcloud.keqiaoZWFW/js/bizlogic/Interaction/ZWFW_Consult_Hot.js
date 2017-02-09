/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 热点咨询
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var count = 0;
	var maxPageIndex = 1;
	var jsondata = "";
	var searchValue = '';
	var Token = '';
	var pageSize = 10;
	var temple = '';
	var url = '';
	var types = 0;
	var totalcount = '';
	var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	//搜索值
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
			OpenID = WindowTools.getExtraDataByKey("UserPK")||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			Config.GetToken(function(token) {
				console.log(token);
				//通过openid获取用户信息
				Token = token;
				Config.getUserguidbyOpenID(token, OpenID, function(LoginID, UserGuid, tips) {
					if(LoginID || LoginID !== '') {
						userguid = UserGuid;
						initPullRefreshList();
						initListeners();
						change();
					} else {
						var specialUrl = encodeURIComponent('ZWFW_Consult_Hot.html?UserPK=' + OpenID);
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
	/*初始化监听*/
	function initListeners() {
		//搜索
		mui('.search').on('tap', '#input-searchName', function() {
			searchAction();
		});
		mui('.search').on('change', '#search', function() {
			searchAction();
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {
		searchValue = document.getElementById('search').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:" + searchValue);
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var getLitemplate = function(value) {
			if(value.ISANSWER == "0") {
				var temple =
					'<li class="mui-table-view-cell" id="{{RowGuid}}"><p class="appointment-matters" style="word-break: break-all;"  id="{{RowGuid}}">{{QUESTION}}</p><p class="mui-clearfix" id="{{RowGuid}}"><span class="appointment-date" id="{{RowGuid}}">{{ASKDATE}}</span><span class="cancel-reservation current1" id="{{RowGuid}}">未答复</span></p></li>';
			} else {
				var temple =
					'<li class="mui-table-view-cell" id="{{RowGuid}}"><p class="appointment-matters" style="word-break: break-all;"  id="{{RowGuid}}">{{QUESTION}}</p><p class="mui-clearfix" id="{{RowGuid}}"><span class="appointment-date" id="{{RowGuid}}">{{ASKDATE}}</span><span class="cancel-reservation current2" id="{{RowGuid}}">已答复</span></p></li>';
				//				console.log('111');
			}
			return temple;
		}
		var geturl = function() {
			if(types == 1) {
				url = Config.serverUrl + '/Consult/GetAuditConsultList';
			} else {
				url = Config.serverUrl + "/Consult/GetHotAuditConsultList";
			}
			console.log('列明无'+url);
			return url;
		}
		var getData = function(currPage) {
			var search = Zepto('#search').val();
			var requestData = {};
			if(types == 1) {
				//动态校验字段
				requestData.ValidateData = Token;
				var data = {
					ConsultType: "21",
					QUESTION: search,
					UserGuid: userguid,
					CurrentPageIndex: currPage,
					PageSize: pageSize
				};
				requestData.paras = data;
			} else {
				//动态校验字段
				requestData.ValidateData = Token;
				var data = {
					ConsultType: "21",
					QUESTION: search,
					CurrentPageIndex: currPage,
					PageSize: pageSize
				};
				requestData.paras = data;
			}
			//某一些接口是要求参数为字符串的
			console.log('列明无效请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {
			var id = e.target.id;
			console.log(id)
			mui.openWindow({
				url: "ZWFW_ComplaintDetail.html?RowGuid=" + id
			});
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response));
			if(response.ReturnInfo.Code == "0") {
				mui.toast(response.ReturnInfo.Description);
				return;
			}
			if(response.BusinessInfo.Code == "0") {
				mui.toast(response.BusinessInfo.Description);
				return;
			}
			var ConsultList = response.UserArea.ConsultList;
			var ConsultInfo = [];
			//			去掉多余层
			for(var i = 0; i < ConsultList.length; i++) {
				ConsultInfo.push(ConsultList[i].ConsultInfo);
			}
			totalcount = response.UserArea.TotalCount;
			Zepto('#totalnum').html(totalcount.toString());
			maxPageIndex = Math.ceil(totalcount / pageSize);
			return ConsultInfo;
			//			return response.UserArea.TotalCount
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
				getRequestDataCallback: getData,
				getUrl: geturl,
				getLitemplate: getLitemplate,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				successRequestCallback: successRequestCallback,
				changeToltalCountCallback: changeToltalCountCallback
			},
			//三种皮肤
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
	var change = function() {
		var hetconsult = Zepto('#hotconsult');
		hetconsult.on('tap', function(e) {
			types = 0;
			pullToRefreshObj.refresh();
			//				initListeners();
		});
		var myconsult = Zepto('#myconsult');
		myconsult.on('tap', function() {
			types = 1;
			pullToRefreshObj.refresh();
			//				initListeners();
		});
		var AddConsult = Zepto('#AddConsult');
		AddConsult.on('tap', function() {
			Config.getProjectBasePath(function(bathpath) {
				var bathpath = bathpath;
				console.log(bathpath)
				var openurl = 'html/Interaction/ZWFW_Consult_Add.html';
				var url = bathpath + openurl + '?UserPK=' + OpenID;
				console.log(openurl);
				WindowTools.createWin('detail2', url, OpenID);
			});
		});
	}

});