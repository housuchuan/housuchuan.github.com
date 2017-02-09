/**
 * 描述 :我的活动详细设计
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-18 08:47:49
 */
define(function(require, exports, module) {
	"use strict";
	//引入窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var pullToRefreshObject;
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var title = null;
	var secretKey = '';
	var userId = "";
	var userName = "";
	//默认话题类型
	var topicKind = 0;

	CommonUtil.initReady(initData);

	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		};
		//初始化下拉刷新
		initPullToRefresh();
	}

	//导航切换
	Zepto('.column').on('tap', '.TA-common', function() {
		Zepto(this).addClass('items-active').siblings().removeClass('items-active');
		title = Zepto(this).text();
		switch(title) {
			case "发表的话题":
				topicKind = 0;
				break;
			case "回复的内容":
				topicKind = 1;
				break;
		}
		pullToRefreshObject.refresh();
	});

	//初始化下拉刷新
	function initPullToRefresh() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			var data = {
				ownerId: userId,
				type: topicKind, //type = 0:发表的; 1:评论的; 2:点赞的
				pageSize: PageSize,
				pageIndex: CurrPage
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//console.log("改变数据 ：\n" + StringUtil.formatJson(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				tempArray = response.data;
				mui.each(tempArray,function(key,value){
					value.topicName = unescape(value.topicName);
					value.from = unescape(value.from);
				});
				totalNumCount = response.totalCount;
			}
			return tempArray;
		};
		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li class="mui-table-view-cell theme-sec clearfix"id="{{topicId}}"><span>{{author}}</span><span class="theme-commom theme-publish-date">{{time}}</span><span class="theme-commom theme-publish-date">发布时间：</span><br/><span class="theme-issuer">{{topicName}}</span><br/><span class="theme-watch viewtext">【查看正文】</span><span class="theme-commom">{{from}}</span><span class="theme-commom theme-publish-date">来自：</span><span class="theme-commom theme-view-reply theme-watch"></span></li>';
			if(title == "发表的话题") {
				litemplate = '<li class="mui-table-view-cell theme-sec clearfix"id="{{topicId}}"><span>{{author}}</span><span class="theme-commom theme-publish-date">{{time}}</span><span class="theme-commom theme-publish-date">发布时间：</span><br/><span class="theme-issuer">{{topicName}}</span><br/><span class="theme-watch viewtext">【查看正文】</span><span class="theme-commom">{{from}}</span><span class="theme-commom theme-publish-date">来自：</span><span class="theme-commom theme-view-reply theme-watch"></span></li>';
			} else {
				litemplate = '<li class="mui-table-view-cell theme-sec clearfix"id="{{topicId}}"><span>{{author}}</span><span class="theme-commom theme-publish-date">{{time}}</span><span class="theme-commom theme-publish-date">发布时间：</span><br/><span class="theme-issuer">{{topicName}}</span><br/><span class="theme-watch viewtext">【查看正文】</span><span class="theme-commom">{{from}}</span><span class="theme-commom theme-publish-date">来自：</span><span class="theme-commom theme-view-reply theme-watch"></span></li>';
			}
			return litemplate
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + "mystudy/myActivityList";
			var url = config.JServerUrl + 'circle/mobile/person/moreTopic';
			return url;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//快速回滚到该区域顶部
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			//console.log("成功请求数据：" + JSON.stringify(response));
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			var topicId = this.id;
			//console.log("e.target"+e.target.innerHTML);
			if(Zepto(e.target).hasClass('viewtext')) {
				WindowUtil.createWin("szpark_circle_dynamics_details.html", "../studycircle/szpark_circle_dynamics_details.html", {
					topicId: topicId
				});
			}
		};

		/*
		 * @description 初始化下拉刷新控件
		 */
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				itemClickCallback: onItemClickCallbackFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc,
				ajaxSetting: {
					//默认的contentType
					contentType: "application/json",
					headers: {
						"X-SecretKey": secretKey
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		}, function(pullToRefresh) {
			pullToRefreshObject = pullToRefresh;
		});
	};
});