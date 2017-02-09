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
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	var ApplyerType = '';
	var tasktype = '';
	var tasktypeqy = '';
	var OUGuid = '';
	var UserPK = '';
	//用来区分列表点击详情跳转的页面
	var specialUrl = '';
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
			if(WindowTools.getExtraDataByKey('ApplyerType')) {
				ApplyerType = WindowTools.getExtraDataByKey('ApplyerType');
			}
			if(WindowTools.getExtraDataByKey('tasktype')) {
				tasktype = decodeURIComponent(WindowTools.getExtraDataByKey('tasktype'));
			}
			if(WindowTools.getExtraDataByKey('tasktypeqy')) {
				tasktypeqy = decodeURIComponent(WindowTools.getExtraDataByKey('tasktypeqy'));
			}
			if(WindowTools.getExtraDataByKey('OUGuid')) {
				OUGuid = WindowTools.getExtraDataByKey('OUGuid');
			}
			if(WindowTools.getExtraDataByKey('specialUrl')) {
				specialUrl = WindowTools.getExtraDataByKey('specialUrl');
			}
			/*			console.log('ApplyerType:'+ApplyerType);
						console.log('tasktype:'+tasktype);
						console.log('tasktypeqy:'+tasktypeqy);
						console.log('OUGuid:'+OUGuid);*/
			//获取http根目录
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//获取token
			Config.GetToken(function(token) {
				ajaxTotal(token);
			});
			createSubWins();
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}
	/**
	 * @description 创建子页面,注意格式
	 */
	function createSubWins() {
		var PageArray = [{
			url: 'ZWFW_Common_list.html', //下拉刷新内容页面地址
			id: 'ZWFW_Common_list.html', //内容页面标志
			styles: {
				top: '38px', //内容页面顶部位置,需根据实际页面布局计算，若使用标准mui导航，顶部默认为48px；
				bottom: '0px' //其它参数定义
			},
			extras: {
				ApplyerType: ApplyerType,
				tasktype: tasktype,
				tasktypeqy: tasktypeqy,
				OUGuid: OUGuid,
				UserPK: UserPK,
				specialUrl: specialUrl
			}
		}];
		//生成子页面
		WindowTools.createSubWins(PageArray);
	}
	/**
	 * @description 请求通知通告五条数据
	 */
	function ajaxTotal(token) {
		var url = Config.serverUrl + '/AuditTask/GetTaskList';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			ApplyerType: ApplyerType,
			TASKCLASS_FORPERSION: tasktype,
			TASKCLASS_FORCOMPANY: tasktypeqy,
			OUGuid: OUGuid,
			CurrentPageIndex: 1,
			PageSize: 10
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
					var total = response.UserArea.TotalCount;
					Zepto('#totalnum').text(total);
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
	/*子页面跳转的方法*/
	window.pushDetail = function(url) {
		console.log('跳转路径：' + url);
		
	}

});