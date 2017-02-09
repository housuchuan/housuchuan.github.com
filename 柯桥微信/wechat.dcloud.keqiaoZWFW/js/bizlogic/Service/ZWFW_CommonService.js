/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 个人办事、企业办事、部门服务共用 
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
	//区分个人企业和部门
	var type = '';
	//openid
	var UserPK = '';
	var url = '';
	//我要预约进去也是部门办事，事项搜索进去需要区分
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
			if(WindowTools.getExtraDataByKey('type')) {
				type = WindowTools.getExtraDataByKey('type');
			}else{
				type = 'department';
			}
			//办事入口
			UserPK = WindowTools.getExtraDataByKey('UserPK')||'oegp-jlrnLOzYaGkMe0HyQm9B_qQ';
			//部门办事列表打开页面
			if(WindowTools.getExtraDataByKey('URL')) {
				specialUrl = WindowTools.getExtraDataByKey('URL');
			}
			if(type == 'person') {
				document.title = '个人办事';
			} else if(type == 'business') {
				document.title = '企业办事';
			} else if(type == 'department') {
				document.title = '部门服务';
			}
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//token验证
			Config.GetToken(function(token) {
				ajaxData(token);
			});
			initListeners();
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {
		if(type == 'person' || type == 'business') {
			url = Config.serverUrl + '/TaskKind/GetTaskKindsByCodeName';
		} else if(type == 'department') {
			url = Config.serverUrl + '/TaskKind/GetTaskKindOU';
		}else{
			url = Config.serverUrl + '/TaskKind/GetTaskKindsByCodeName';
		}
	}
	/*通用点击*/
	function onClick() {
		Zepto('.affairs-item').on('tap', function() {
			var nextUrl = '';
			var id = Zepto(this).attr('id');
			if(type == 'person') {
				nextUrl = httppath + '/html/Service/ZWFW_Common_list.html?ApplyerType=20&tasktype=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			} else if(type == 'business') {
				nextUrl = httppath + '/html/Service/ZWFW_Common_list.html?ApplyerType=10&tasktypeqy=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			} else if(type = 'department') {
				nextUrl = httppath + '/html/Service/ZWFW_Common_list.html?OUGuid=' + id + '&UserPK=' + UserPK + '&specialUrl=' + specialUrl;
			}
			window.location.href = nextUrl;
		});
	}
	/**
	 * @description 获取服务
	 */
	function ajaxData(token) {
		var requestData = {};
		requestData.ValidateData = token;
		var data = {};
		if(type == 'person') {
			data = {
				CodeName: '针对个人的事项主题分类'
			};
		} else if(type == 'business') {
			data = {
				CodeName: '针对企业的事项主题分类'
			};
		} else if(type == 'department') {
			data = {};
		}
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxx"+url);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UITools.closeWaiting();
				console.log("success");
				console.log('xxxxxxxxxxxxxxxxxxxxx返回数据'+JSON.stringify(response));
				if(type == 'person' || type == 'business') {
					dealItemList(response);
				} else if(type == 'department') {
					dealOUList(response);
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
	/*个人办事、企业办事通用处理response*/
	function dealItemList(response) {
		if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
			var tmpInfo = response.UserArea.ItemList;
			var lastInfo = [];
			for(var i = 0; i < tmpInfo.length; i++) {
				lastInfo[i] = tmpInfo[i].ItmeInfo;
			}
			var litemplate = "<li class='affairs-item' id='{{ItemValue}}'><a class='affairs-item-icon'style='background: url({{ItemUrl}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{ItemText}}</a></li>";
			Zepto("#iteminfo").html('');
			var html = ''
				//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo").append(html);
			}
			onClick();
		}
	}
	/*部门处理response*/
	function dealOUList(response) {
		if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
			var tmpInfo = response.UserArea.OUList;
			var lastInfo = [];
			for(var i = 0; i < tmpInfo.length; i++) {
				lastInfo[i] = tmpInfo[i].OUInfo;
			}
			var litemplate = "<li class='affairs-item' id='{{OUGuid}}'><a   class='affairs-item-icon' style='background: url({{OUUrl}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{OUName}}</a></li>";
			Zepto("#iteminfo").html('');
			var html = ''
				//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo").append(html);
			}
			onClick();
		}
	}
});