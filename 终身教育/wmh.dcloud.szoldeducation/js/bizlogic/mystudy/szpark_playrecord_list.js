/**
 * 描述 :播放记录
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-29 21:26:07
 */
define(function(require, exports, module) {
	"use strict";
	//引入窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 15;
	//列表总记录数
	var totalNumCount = 0;
	//导航标题
	var title = "";
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId = "";
	var userName = "";
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		//刷新视频记录列表
		pullRefreshList();
		//刷新纪录列表
		//监听事件
		if(DeviceUtil.tablet()) {
			window.addEventListener('refreshPlayRecordPad', function() {
				pullToRefreshObject.refresh();
			});
		} else if(DeviceUtil.mobile()) {
			window.addEventListener('refreshPlayRecord', function() {
				pullToRefreshObject.refresh();
			});
		};
	}

	Zepto('input[type=search]').on('input', function() {
		pullToRefreshObject.refresh();
	})

	function pullRefreshList() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				searchValue: Zepto('input[type=search]').val(),
				userId: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("改变数据 ：\n" + unescape(JSON.stringify(response)));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				console.log("xxxxxxxxxx" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					if(value.image == '' || value.image == null) {
						value.image = '../../img/MobileFrame/img_error.jpg';
					} else {
						value.image = unescape(value.image);
					};
					//将返回的秒数转化为分钟
					if(!value.progress) {
						value.progress == '00:00:00';
					} else {
						value.timePoint = value.progress;
						var time = StringUtil.getTimeFromSeconds(value.progress);
						value.progress = time;
					}
				});
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

		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'mystudy/videoPlayRecordList';
			var url = config.JServerUrl + 'mystudy/videoPlayRecordList';
			console.log('url:' + url);
			return url;
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red mui-icon ">删除</a></div><div class="mui-slider-handle clearfix"><span class="courseGuid" id="{{courseGuid}}"></span><img src="{{image}}"/><h4>{{title}}</h4><span class="studyed studyed-common-sizecol">已学习</span><span class="timePoint" id="{{timePoint}}"></span><span class="studyed-common-sizecol">{{progress}}</span><br/><span class="studying studyed-common-sizecol">积分：</span><span class="studyed-common-sizecol">{{integral}}</span></div></li>';
			return litemplate;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			Zepto('.selection-items').on('tap', 'li .mui-btn-red', function() {
				var id = Zepto(this).parents('li').attr('id');
				resourceDelete(id);
			});
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			var courseGuid = Zepto(this).find('.courseGuid').attr('id');
			var playTime = Zepto(this).find('.timePoint').attr('id');
			var resourceId = this.id;
			console.log("xxxxxxxxxxxxx" + courseGuid);
			console.log("xxxxxxxxxxxxxxx" + playTime);
			if(DeviceUtil.tablet()) {
				WindowUtil.createWin("resource_center_view_video_pad.html", "../html_pad/resourceCenter/resource_center_view_video_pad.html", {
					itemsId: courseGuid,
					type: 0,
					playTime: playTime,
					resourceId: resourceId
				});
			} else if(DeviceUtil.mobile()) {
				WindowUtil.createWin("resource_center_view_video.html", "../resourceCenter/resource_center_view_video.html", {
					itemsId: courseGuid,
					type: 0,
					playTime: playTime,
					resourceId: resourceId
				});
			};
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
			//console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};

	Zepto('.mui-icon-clear').on('tap', function() {
		pullToRefreshObject.refresh();
		//快速回滚到该区域顶部
		mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
	});

	/**
	 * @description 删除播放记录
	 */
	var resourceDelete = function(resourceId) {
		//var url = config.MockServerUrl + 'mystudy/videoPlayRecordDelete';
		var url = config.JServerUrl + 'mystudy/videoPlayRecordDelete';
		var requestData = {};
		var data = {
			userId: userId,
			resourceId: resourceId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});