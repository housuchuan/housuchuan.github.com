/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项搜索父页面 
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
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	//最大数据量默认为0
	var totalCount = 0;
	var pullToRefreshObj;
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	//openid
	var UserPK = '';
	var token = token;
	var searchValue = document.getElementById('searchvalue').value;
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
			if(Zepto('#searchvalue').val() != '') {
				Zepto('#divhottask').hide();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
			//事项搜索入口页面
			UserPK = WindowTools.getExtraDataByKey('UserPK')||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			//获取http根目录
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//获取token
			Config.GetToken(function(token) {
				token = token;
				initPullRefreshList(token);
				ajaxHotItem(token);

			});
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {
		mui('#search').on('tap', '#check', function() {
			searchValue = Zepto('#searchvalue').val();
			if(searchValue != '') {
				Zepto('#divhottask').hide();
				pullToRefreshObj.refresh();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
		});
		mui('#search').on('change', '#searchvalue', function() {
			searchValue = Zepto('#searchvalue').val();
			if(searchValue != '') {
				Zepto('#divhottask').hide();
				pullToRefreshObj.refresh();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
		});
	}

	/**
	 * @description 请求通知通告五条数据
	 */
	function ajaxHotItem(token) {
		var url = Config.serverUrl + '/AuditTask/GetHotTaskNoType';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {

		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(url + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("success");
				console.log(JSON.stringify(response));
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1) {
					if(response.UserArea && response.UserArea.HotTaskList) {
						var tmpInfo = response.UserArea.HotTaskList;
						var lastInfo = [];
						for(var i = 0; i < tmpInfo.length; i++) {
							lastInfo[i] = tmpInfo[i].TaskInfo;
						}
						console.log(JSON.stringify(lastInfo));
						//映射模板
						var litemplate = '<li class="mui-table-view-cell hot"id="{{TaskGuid}}"><a class="mui-navigate-right">{{TaskName}}</a></li>';
						Zepto("#hotlist").html('');
						var html = ''
							//遍历数组
						mui.each(lastInfo, function(key, value) {
							if(value) {
								html += Mustache.render(litemplate, value);
							}
						});
						if(html) {
							Zepto("#hotlist").append(html);
						}
						Zepto('.hot').on('tap', function() {
							var taskGuid = Zepto(this).attr('id');
							window.location.href = httppath + '/html/Service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK;
						});
					}
				} else {
					UITools.toast('请求事项出错');
				}
			},
			error: function(error) {
				console.log("error");
				console.log(JSON.stringify(error));
				UITools.toast('请求事项出错');
			}
		});
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(token) {
		var url = Config.serverUrl + '/AuditTask/GetTaskList';
		var litemplate =
			'<li class="mui-table-view-cell"id="{{TaskGuid}}"><a class="mui-navigate-right">{{TaskName}}</a></li>';
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = token;
			var data = {
				ItemValue: "",
				TaskName: searchValue,
				OUGuid: "",
				currentpageindex: currPage.toString(),
				pagesize: pageSize.toString(),
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求数据:' + requestData);
			return requestData;
		};
		//成功回调
		var successRequestCallback = function(response) {
			//console.log("请求成功-最终映射数据:" + JSON.stringify(response));
		};
		//改变接口返回的数据
		var changeResponseDataCallback = function(response) {
			var outData = null;
			//console.log("默认数据：" + JSON.stringify(response));
			if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1) {
				if(Array.isArray(response.UserArea.TaskList)) {
					if(response.UserArea.TotalCount) {
						totalCount = response.UserArea.TotalCount;
					} else {
						totalCount = 0;
					}
					outData = [];
					for(var i = 0; i < response.UserArea.TaskList.length; i++) {
						outData[i] = response.UserArea.TaskList[i].TaskInfo;
					}
				}
			}

			return outData;
		};
		//改变最大数据量
		var changeToltalCountCallback = function(response) {
			console.log(totalCount);
			return totalCount;
		};
		var onClickCallback = function(e) {
			var taskGuid = Zepto(this).attr('id');
			console.log(" 事项id：" + taskGuid);
			var nextUrl = httppath + '/html/Service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK;
			window.location.href = nextUrl;
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback,
				//requestTimeOut:3000,
				itemClickCallback: onClickCallback

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
				//pullToRefreshObj.refresh();
			}, 1000)
		});
	}

});