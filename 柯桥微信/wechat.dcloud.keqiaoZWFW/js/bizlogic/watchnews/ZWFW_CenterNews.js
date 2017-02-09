/**
 * 作者: lb
 * 时间: 2016-08-26 
 * 描述: 中心新闻-含下拉刷新
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	//token值
	var Token = '';
	var CategoryNum = '';
	var totalcount = '';
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
			//初始化
			console.log("初始化");
			//获取token
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				initPullRefreshList();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});

		});

	}

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var url = Config.serverUrl + '/CenterInformation/GetCategoryList';
		//var url =Config.serverUrl+ 'centernewslist';
		var litemplate =
			"<li class='news-item mui-clearfix' id='{{InfoID}}'><div class='news-pic' id='{{InfoID}}'><img src='{{HeadNewsPic}}' id='{{InfoID}}'/> </div><div class='news-info' id='{{InfoID}}'><span class='news-title' id='{{InfoID}}'>{{Title}}</span><div class='news-tagging mui-clearfix' id='{{InfoID}}'><span class='tagging-name' id='{{InfoID}}'>{{Author}}</span><span class='tagging-time' id='{{InfoID}}'>{{InfoDate}}</span></div></div></li>";
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				CurrentPageIndex: currPage.toString(),
				PageSize: pageSize.toString(),
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
				CategoryNum: "002001"
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			console.log('中心新闻url:' + url);
			console.log('中心新闻请求参数:' + JSON.stringify(requestData));

			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {
			var InfoID = this.id;
			console.log("点击:" + InfoID);
			var data = {
				InfoID: InfoID
			};
			WindowTools.createWin('test', 'ZWFW_CenterNewsinfo.html', data);
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.ReturnInfo.Code == "0") {
				alert(response.ReturnInfo.Description);
				return false;
			}
			if(response.BusinessInfo.Code == "0") {
				alert(response.BusinessInfo.Description);
				return false;
			}
			totalcount = response.UserArea.TotalCount;
			//return response.UserArea.CategoryList;
			var cglist = response.UserArea.CategoryList

			var categorylist = [];
			//去掉多余层
			for(var i = 0; i < cglist.length; i++) {
				categorylist.push(cglist[i].CategoryInfo);
			}
			return categorylist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				//requestTimeOut:3000,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback
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
});