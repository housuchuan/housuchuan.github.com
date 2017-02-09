/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var loginUtil = require('bizlogic/common/LoginUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var secretKey = '';
	//var secretKey = config.secretKey;
	var userId = '';
	var userName = '';
	var type = null;
	var PageSize = 10;
	var totalNumCount = 0;
	var pullToRefreshObject;
	var searchValue = null;
	var videoSourceId = null;
	var ServerUrl = config.JServerUrl;
	var userSession;
	CommonUtil.initReady(function() {
		//获取点播或者直播类型    0：点播, 1:直播
		type = WindowUtil.getExtraDataByKey('type');
		//获取缓存信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		//初始化下拉刷新
		initPullrefresh();
	});

	//视频搜索点击事件
	Zepto("#searchButton").on("tap", function() {
		searchValue = Zepto('#search').val();
		pullToRefreshObject.refresh();
	});
	
	//判断搜索框是否为空
	Zepto('input').on('input',function(){
		if(Zepto('input').val() == ''){
			searchValue = '';
			pullToRefreshObject.refresh();
		}
	});

	//初始化下拉刷新组件
	function initPullrefresh() {
		function getLitemplate() {
			var litemplate = '';
			if(type == 0) {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img src="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle mui-ellipsis">{{title}}</div><div><span>{{number}}</span><span>人学过</span></div><div><span>积分:&nbsp;&nbsp;</span><span>{{marks}}</span></div></div></li>';
			} else if(type == 1) {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell zhiboItem"><span class="activityId" id="{{activityId}}"></span><div class="imgBorder"><img src="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle mui-ellipsis">{{title}}</div><div class="mui-ellipsis-2"><span>简介：</span>{{introduction}}</div></div></li>';
			}
			return litemplate;
		}

		function getUrl() {
			var url = '';
			if(type == 0) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
			} else if(type == 1) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
			}
			console.log("url" + url);
			return url;
		}

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		function getData(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {};
			if(type == 0) {
				data = {
					pageIndex: CurrPage,
					pageSize: PageSize,
					id: '020',
					courseType: 1,
					userId: userId,
					searchValue: searchValue
				};
			} else if(type == 1) {
				data = {
					pageIndex: CurrPage,
					pageSize: PageSize,
					id: '',
					courseType: 1,
					searchValue: searchValue
				};
			}
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('请求参数' + requestData);
			return requestData;
		}

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		function changeResponseDataFunc(response) {
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				//console.log("json数据" + JSON.stringify(tempArray));
				totalNumCount = response.totalCount;
				if(type == 1) {
					if(tempArray) {
						if(Array.isArray(tempArray)) {
							mui.each(tempArray, function(key, value) {
								var Status = value.status;
								switch(Status) {
									case 0:
										value.status = '未开播';
										break;
									case 1:
										value.status = '正在直播';
										break;
									case 2:
										value.status = '直播结束';
										break;
								};
								if(!value.image) {
									value.image = '../../img/MobileFrame/img_error.jpg';
								}else{
									value.image = unescape(value.image);
								};
							});
						} else {
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_error.jpg';
							}else{
								tempArray.image = unescape(tempArray.image);
							};
						}
					}

				};
				if(type == 0) {
					if(tempArray) {
						if(Array.isArray(tempArray)) {
							mui.each(tempArray, function(key, value) {
								if(!value.image) {
									value.image = '../../img/MobileFrame/img_error.jpg';
								}else{
									value.image = unescape(value.image);
								};
							});
						} else {
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_error.jpg';
							}else{
								tempArray.image = unescape(tempArray.image);
							};
						}
					}

				};
			}
			return tempArray;
		}

		/*
		 * @description 列表点击事件
		 */
		function onItemClickCallbackFunc(e) {
			//判断是点播还是进而播放视频
			videoSourceId = this.id;
			if(type == 0) {
				Zepto("#zhezhao-area").show();
				Zepto("#alertWin").show();
			} else if(type == 1) {
				WindowUtil.createWin('resource_center_view_zhibo_parent.html', 'resource_center_view_zhibo_parent.html', {
					videoId: videoSourceId,
//					activityId: Zepto(this).find('.activityId').attr('id')
				});
			}
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		function changeToltalCountFunc() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		function successCallbackFunc(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
		};

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
	

	//监听点播事件
	Zepto("#preview").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
		WindowUtil.createWin('resource_center_preview_video.html', 'resource_center_preview_video.html', {
			itemsId: videoSourceId
		});
	});
	Zepto("#play").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
		loginUtil.ResetTARGET_URL('resource_center_view_video.html', {
			itemsId: videoSourceId,
			type: type
		});
		if(loginUtil.isLoginSystem()) {
			//console.log("是否收藏"+IsSave);
			WindowUtil.createWin('resource_center_view_video.html', 'resource_center_view_video.html', {
				itemsId: videoSourceId,
				type: type
			});
		} else {
			//console.log("请先登录！");
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	Zepto("#cancle").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
	});
	
});