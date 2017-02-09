/**
 * 描述 :学习计划 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-30 13:32:27
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var noteList = [];
	//var url = config.MockServerUrl + "mystudy/studyPlanningList";
	var url = config.JServerUrl + "mystudy/studyPlanningList";
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession")||{};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		};
		//初始化下拉刷新
		initPullRefrsh();
	};
	
	Zepto('input[type=search]').on('input',function(){
		pullToRefreshObject.refresh();
	});

	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function initPullRefrsh() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				searchValue: Zepto('input[type=search]').val(),
				pageSize: PageSize,
				pageIndex: CurrPage
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {

			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			console.log("改变数据 ：\n" + JSON.stringify(response));
			if(response.code == '1') {
				tempArray = response.data;
				console.log("xxxxxxxxxxx"+JSON.stringify(tempArray));
				mui.each(tempArray,function(key,value){
					value.name = unescape(value.name);
				});
				totalNumCount = response.totalCount;

			}
			return tempArray;
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + JSON.stringify(response));
			return totalNumCount;
		};

		var getLitemplate = function() {
			//默认视频列表映射模板
			var litemplate = '<li id={{planId}} class="mui-table-view-cell"><span class="pitch pitch-on"></span><span class="content mui-ellipsis-2"><span>【学习计划】</span><span>{{name}}</span></span></li>';
			return litemplate;
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
			noteList = [];
			var planId = this.id;
			if(Zepto(e.target).hasClass('pitch')) {
				//什么都不做
				//console.log("11111111111");
				if(Zepto(e.target).hasClass('pitch-active')) {
					Zepto(Zepto(e.target)).parents('li').find('.pitch').removeClass('pitch-active').addClass('pitch-on');
				} else {
					Zepto(Zepto(e.target)).parents('li').find('.pitch').addClass('pitch-active');
				};
				var _this = Zepto('.pitch');
				mui.each(_this, function(key, value) {
					if(Zepto(value).hasClass('pitch-active')) {
						noteList.push(Zepto(value).parent('li').attr('id'));
					}
				});
			} else {
				WindowUtil.createWin("szpark_study_planning_detailInfo.html", "szpark_study_planning_detailInfo.html", {
					planId: planId
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
			down: {
				height: 90
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
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};
	
	Zepto('.mui-icon-clear').on('tap',function(){
		pullToRefreshObject.refresh();
	});

	//我的计划按钮选择
	Zepto('#icon-close').on('tap', function() {
		var _this = Zepto(this);
		var BtnState = _this.parents().find('.pitch').css('display');
		if(BtnState == 'none') {
			_this.parents().find('.pitch').css('display', 'block');
			Zepto('.mui-btn-block').css('display','block');
		} else {
			_this.parents().find('.pitch').css('display', 'none');
			Zepto('.mui-btn-block').css('display','none');
			_this.parents().find('.pitch').removeClass('pitch-active');
		}
	});
	//添加我的学习计划
	Zepto('#icon-plus').on('tap', function() {
		WindowUtil.createWin('szpark_add_study_planning.html', 'szpark_add_study_planning.html');
	});
	//删除我的学习计划
	Zepto('.mui-btn-block').on('tap', function() {
		var selectedGuid = "";
		mui.each(noteList, function(key, value) {
			selectedGuid += value + ";";
		});
		var _this = Zepto('.pitch');
		mui.each(_this,function(key,value){
			if(Zepto(value).hasClass('pitch-active')){
				DeletePlan(selectedGuid);
			};
		})
	});

	/**
	 * @description 删除计划
	 */
	function DeletePlan(selectedGuid) {
		var url = config.JServerUrl + 'mystudy/studyPlanningDelete';
		var requestData = {
			noteList: selectedGuid,
		};
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, 0);
			if(response.code == 1) {
				UIUtil.closeWaiting();
				UIUtil.toast(response.description);
				pullToRefreshObject.refresh();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	
	window.addEventListener('refreshList',function(){
		pullToRefreshObject.refresh();		
	});
});