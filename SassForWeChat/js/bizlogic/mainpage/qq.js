/**
 * 作者: housc
 * 时间: 2016-12-27
 * 描述: 仿知乎
 */

define(function(require, exports, module) {
		"use strict";
		//每一个页面都要引入的工具类
		var CommonTools = require('CommonTools_Core');
		var WindowTools = require('WindowTools_Core');
		//config引入-这里示例引入方式
		var Config = require('config_Bizlogic');
		var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
		//声明下拉刷新变量
		var pullToRefreshObj;
		//声明信息列表总数
		var totalNumCount = 0;
		//热门or我的
		var index = 0;    //0:热门       1:我的
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
				//设置一个监听并初始化
				initListener();
				//下拉刷新数据
				initPullRefreshList();
			});
		}

		var initListener = function() {
			//实现ios平台原生侧滑关闭页面；
			if(mui.os.plus && mui.os.ios) {
				mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
					plus.webview.currentWebview().setStyle({
						'popGesture': 'none'
					});
				});
			};
			//主界面和侧滑菜单界面均支持区域滚动；
			mui('.asideBar').scroll();
			mui('#offCanvasContentScroll').scroll();
			//点击热门或者我的
			Zepto('.mui-title').on('tap', 'div', function() {
				index = Zepto(this).index();
				Zepto(this).css('opacity', '.5').siblings().css('opacity', '1');
				if(index == 1) {
					pullToRefreshObj.refresh();
				} else {
					pullToRefreshObj.refresh();
				}
			});
			//侧边栏选项栏目点击事件
			Zepto('.asideBar .mui-table-view-chevron').on('tap', 'li', function() {
				 //侧滑容器父节点
				var offCanvasWrapper = mui('#offCanvasWrapper');
				Zepto(this).children('a').css('background-color', '#e0e0e0').parent().siblings().find('a').css('background-color', '#fff');
				var text = Zepto(this).children('a').find('span:last-child').text();
				switch (text){
					case '首页':
						offCanvasWrapper.offCanvas('close');
						break;
					case '发现':
						WindowTools.createWin('discovery.html', '../discovery/discovery.html');
						break;
				}
			});
		};

		/**
		 * @description 初始化下拉刷新
		 */
		function initPullRefreshList() {
			var url = Config.serverUrl + 'mainpage/hotEventList';

			var litemplate = '<li id="{{id}}"class="mui-table-view-cell"><div class="mui-clearfix"><span class="mui-hotTitle mui-pull-left">热门回答</span><span class="mui-pull-right"><img src="{{img}}"/></span></div><div class="mui-liTitle">{{title}}</div><div class="mui-info"><div><span class="mui-pull-left">{{price}}</span></div><div class="mui-Content">{{content}}</div></div></li>';

			var pageSize = 10;
			var getData = function(currPage) {
				var requestData = {};
				//动态校验字段
				requestData.ValidateData = ''; //'EpointBidInfo';
				var data = {
					CurrentPageIndex: currPage.toString(),
					PageSize: pageSize.toString(),
					Type: index
				};
				requestData.paras = data;
				//某一些接口是要求参数为字符串的
				requestData = JSON.stringify(requestData);
				console.log('url:' + url);
				console.log('请求数据:' + requestData);
				return requestData;
			};

			var onClickCallback = function(e) {
				mui.toast(Zepto(this).index());	
			};

			/**
			 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
			 * @param {Object} response Json数组
			 */
			var changeResponseDataFunc = function(response) {
				console.log("xxxxxxxxxxxxxxxxxxxxxxx"+JSON.stringify(response.UserArea.EventList));
				var tempArray = [];
				if(response.ReturnInfo.Code == 0) {
					//显示toast
					mui.toast(response.ReturnInfo.Description);
					return;
				};
				if(response.BusinessInfo.Code == 0) {
					//显示toast
					mui.toast(response.BusinessInfo.Description);
					return;
				};
				mui.each(response.UserArea.EventList,function(key,value){
					if (parseInt(value.EventInfo.price)>1000) {
						value.EventInfo.price = parseFloat((parseInt(value.EventInfo.price)/1000).toFixed(2))+'k';
					};
					tempArray.push(value.EventInfo);
				});
				totalNumCount = response.UserArea.TotalCount;
				return tempArray;
			};

			/**
			 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
			 */
			var changeToltalCountFunc = function() {
				//console.log("总记录数：" + totalNumCount);
				return totalNumCount;
			};

			/**
			 * @description 成功回调
			 * @param {Object} response
			 */
			var successCallbackFunc = function(response) {

			};

			PullToRefreshTools.initPullDownRefresh({
				isDebug: true,
				bizlogic: {
					defaultInitPageNum: 1,
					getLitemplate: litemplate,
					getUrl: url,
					getRequestDataCallback: getData,
					//requestTimeOut:3000,
					itemClickCallback: onClickCallback,
					changeResponseDataCallback: changeResponseDataFunc,
					changeToltalCountCallback: changeToltalCountFunc,
					successRequestCallback: successCallbackFunc,
					ajaxSetting: {
						//默认的contentType
						contentType: "application/json"
					}
				},
				//三种皮肤
				//default -默认人的mui下拉刷新,webview优化了的
				//type1 -自定义类别1的默认实现, 没有基于iscroll
				//type1_material1 -自定义类别1的第一种材质
				skin: 'type1_material1'
			}, function(pullToRefresh) {
				//console.log("生成下拉刷新成功");
				pullToRefreshObj = pullToRefresh;
				setTimeout(function() {
					//console.log("刷新");
					pullToRefreshObj.refresh();
				}, 1000);
			});

		};
});