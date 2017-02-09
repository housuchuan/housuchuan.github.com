/**
 * 作者: hybo
 * 时间: 2016-07-15 
 * 描述: 下拉刷新默认实现 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');

	//config引入
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	//搜索值
	var searchValue = '';
	//最大数据量默认为0
	var totalCount = 0;
	var httppath = '';
	var UserPK = '';
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
			if(WindowTools.getExtraDataByKey('UserPK')) {
				UserPK = WindowTools.getExtraDataByKey('UserPK');
			}
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//获取token
			Config.GetToken(function(token) {
				initPullRefreshList(token);
			});
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}
	/**
	 * @description 页面间的刷新回调
	 */
	window.addEventListener('searchFunc', function(e) {
		if(e.detail && e.detail.searchvalue != null) {
			searchValue = e.detail.searchvalue;
			console.log('搜索:' + searchValue);
		}
		pullToRefreshObj.refresh();
	});
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
			window.parent.pushDetail(nextUrl);
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