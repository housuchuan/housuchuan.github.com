/**
 * 描述 :我的笔记（文档）详细设计
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-28 09:34:49
 */
define(function(require, exports, module) {
	"use strict";
	//引入窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	//var url = config.MockServerUrl + "mystudy/myVideoOrWordList";
	var url = config.JServerUrl + "mystudy/myVideoOrWordList";
	var title = null;
	var searchValue = '';
	var extraData = {};
	var columnId;
	var noteType = 0; //0代表视频，1代表文档
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
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
		}
		//下拉刷新列表
		pullRefreshList();
		//console.log("xxxxxxxxxxxxxxx=================="+url);
	};

	//导航栏切换
	Zepto('.column').on('tap', '.TA-common', function() {
		Zepto(this).addClass('items-active').siblings().removeClass('items-active');
		title = Zepto(this).text();
		switch(title) {
			case "视频":
				noteType = 0;
				pullToRefreshObject.refresh();
				break;
			case "文档":
				noteType = 1;
				pullToRefreshObject.refresh();
				break;
		}
		pullToRefreshObject.refresh();
	});

	//关键字搜索
	Zepto('input[type=search]').on('input', function() {
		pullToRefreshObject.refresh();
	});

	function pullRefreshList() {
		
		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell"><div class="mui-slider-handle clearfix"><img src="../../img/MobileFrame/img_error.jpg" /><h4>{{title}}</h4><span class="studyed studyed-common-sizecol">更新于</span><span class="studyed-common-sizecol">{{updateDate}}</span><br/><span class="studying studyed-common-sizecol">笔记总数：</span><span class="studyed-common-sizecol noteNum">{{noteTotalNum}}</span></div></li>';
			if(title == "视频") {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell"><div class="mui-slider-handle clearfix"><img src="../../img/MobileFrame/img_error.jpg" /><h4>{{title}}</h4><span class="studyed studyed-common-sizecol">更新于</span><span class="studyed-common-sizecol">{{updateDate}}</span><br/><span class="studying studyed-common-sizecol">笔记总数：</span><span class="studyed-common-sizecol noteNum">{{noteTotalNum}}</span></div></li>';
			} else if(title == "文档") {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell"><span>{{title}}</span><span>{{updateDate}}</span></li>';
			}
			return litemplate;
		};
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
				noteType: noteType,
				searchValue: Zepto('input[type=search]').val(),
				userId: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('url:' + url);
			console.log('我的笔记请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//console.log("改变数据 ：\n" + unescape(JSON.stringify(response)));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				//console.log("xxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
				tempArray = response.data;
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

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			var noteCount = Zepto('#' + this.id).find('.noteNum').text();
			columnId = this.id;
			//点击列表跳转到笔记详情
			extraData = {
				userId: userId,
				noteType: noteType,
				columnId: columnId,
				noteCount: noteCount
			}
			extraData = JSON.stringify(extraData);
			WindowUtil.createWin('szpark_my_note_detailInformation.html', 'szpark_my_note_detailInformation.html', {
				extraData: extraData
			});
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
				getUrl: url,
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
	});

});