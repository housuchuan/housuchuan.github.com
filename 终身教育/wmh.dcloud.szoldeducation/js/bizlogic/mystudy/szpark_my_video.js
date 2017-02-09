/**
 * 描述 :我的视频 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-30 13:43:58
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var ImageLoaderFactory=require('core/MobileFrame/ImageLoaderFactory.js');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 8;
	//列表总记录数
	var totalNumCount = '';
	var title = null;
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var sourceType = 1;
	CommonUtil.initReady(function() {
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
		//初始化下拉刷新视频
		initPullrefresh();
	});
	//上传视频
	Zepto("#btnUpload").on('tap', function() {
		WindowUtil.createWin('szpark_native_file.html', "szpark_native_file.html");
	});

	//发表话题回复内容tab切换
	Zepto('.column').on('tap', '.TA-common', function() {
		Zepto(this).addClass('items-active').siblings().removeClass('items-active');
		title = Zepto(this).text();
		//console.log(title);
		switch(title) {
			//是否公开，0代表保密，1代表公开
			case "公开":
				sourceType = 1;
				break;
			case "保密":
				sourceType = 0;
				break;
		}
		pullToRefreshObject.refresh();
	});
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function initPullrefresh() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				pageSize: PageSize,
				pageIndex: CurrPage,
				sourceType: sourceType,
				searchValue: Zepto('input').val()
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
			//console.log("改变数据 ：\n" + unescape(JSON.stringify(response)));
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("xxxxxxxxxxxxxx" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					var videoStatus = value.status;
					value.title = unescape(value.title);
					switch(videoStatus) {
						case '1':
							value.status = '待审核';
							break;
						case '2':
							value.status = '审核通过';
							break;
						case '3':
							value.status = '审核不通过';
							break;
					};
					if(value.img == '' || value.img == null || value.img == 'img is not defined') {
						value.img = '../../img/MobileFrame/img_error.jpg';
					}else{
						value.img = unescape(value.img);
					}

				});
			}
			return tempArray;
		};
		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			return totalNumCount;
			//console.log("总记录数：" + totalNumCount);
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell mui-ellipsis"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red mui-icon ">删除</a></div><div class="videoList mui-slider-handle"><img data-img-localcache="{{img}}"/><div><h4 class="mui-ellipsis">{{title}}</h4><span>{{status}}</span><br/><span>{{time}}</span></div></div></li>';
			return litemplate
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + "mystudy/myMovieList";
			var url = config.JServerUrl + "mystudy/myMovieList";
			return url;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			ImageLoaderFactory.lazyLoadAllImg(true);
			//console.log("成功请求数据：" + JSON.stringify(response));
			Zepto('.mui-slider-right').on('tap', function() {
				var idList = Zepto(this).parents('li').attr('id');
				VideoDelete(idList);
			})
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {};

		/*
		 * @description 初始化下拉刷新控件
		 */
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			//下拉有关
			down: {
				height: 45
			},
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

	/**
	 * @description 视频删除Ajax
	 */
	function VideoDelete(noteList) {
		var url = config.JServerUrl + 'mystudy/myMovieDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			noteList: noteList
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//搜索框模糊查询
	Zepto('input').on('input', function() {
		pullToRefreshObject.refresh();
	});

	Zepto('.mui-icon-clear').on('tap', function() {
		pullToRefreshObject.refresh();
	});
});