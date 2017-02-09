/**
 * 描述 :研习圈pad版本交互 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-08 10:21:30
 */

define(function(require, exports, module) {
	"use strict";
	//引入工具类
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PageSize = 10;
	var totalNumCount = 0;
	var circleId = null;
	var typeId = null;
	var pullToRefreshObject;
	var secretKey = "";
	var userId = "";
	var userName = "";
	var beginIndex = 0;

	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//		initListener();
		appendCircleTypeList();
		initJoinCircleListener();
	};
	/**
	 * @description 加入圈子操作
	 * @param {Object} circleId
	 */
	function initJoinCircleListener() {
		//取消和关闭弹出菜单
		Zepto(".cancel-btn,.mui-icon-closeempty").on('tap', function() {
			CustomDialogUtil.hideCustomDialog('join-circle'); //隐藏自定义对话框
			document.getElementById("reason").value = "";
		});
		//点击加入圈子事件
		Zepto(".confirm-btn").on('tap', function() {
			//用户加入某个圈子
			var reason = document.getElementById("reason").value;
			if(!reason) {
				UIUtil.toast("亲，请填写加入理由！");
			} else {
				console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
				joinCircleFunc(reason);
			}
		});
	};

	/**
	 * @description 加入圈子
	 */
	function joinCircleFunc(reason) {
		//var url = config.MockServerUrl + 'cricleJoin';
		//var url = config.PCServerUrl + 'CircleApply';
		var url = config.JServerUrl + 'circle/mobile/detail/cricleJoin';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: userId,
			userName: userName,
			reason: reason
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		CustomDialogUtil.hideCustomDialog('join-circle'); //隐藏自定义对话框
		console.log("申请加入的请求参数：" + requestData);
		console.log("xxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, "0")
				console.log("接口返回数据：" + JSON.stringify(response));
			if(response.code == "1") {
				//置空操作
				UIUtil.toast(response.description);
				document.getElementById("reason").value = "";
				pullToRefreshObject.refresh();
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	};

	//下拉菜单选项
	Zepto('.study').on('tap', function() {
		var itemTitle = Zepto(this).find('span').text();
		console.log(itemTitle);
		switch(itemTitle) {
			case '个人主页':
				//WindowUtil.createWin('szpark_personal_page.html', '../../studycircle/szpark_personal_page.html');
				WindowUtil.createWin('szpark_personal_page_pad.html', 'szpark_personal_page_pad.html');
				break;
			case '管理的圈子':
				WindowUtil.createWin('szpark_management_circle.html', '../../studycircle/szpark_management_circle.html');
				break;
			case '圈主管理':
				WindowUtil.createWin('szpark_master_management.html', '../../studycircle/szpark_master_management.html');
				break;
			case '创建圈子':
				WindowUtil.createWin('szpark_create_circle.html', '../../studycircle/szpark_create_circle.html');
				break;
		}
	});

	/**
	 * @description 圈子分类列表
	 */
	function appendCircleTypeList() {
		//var url = config.MockServerUrl + 'studycircle/getCircleTypeList';
		//var url = config.PCServerUrl + 'CircleClassifyList';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleClassifyList';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("请求参数：" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			//console.log(JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 1);
			var tmpInfo = [];
			if(response.code == "401" || response.code == 401) {
				//处理未登录
				LoginUtil.handleNotloggedin(response);
			} else if(response.code == "1" || response.code == 1) {
				tmpInfo = response.data;
				var litemplate = '<li id="{{typeId}}" class="topic-choice section-left-active"><div class="mui-navigate-right">{{typeName}}</div></li>';
				var output = '';
				if(Array.isArray(tmpInfo) && tmpInfo.length > 0) {
					mui.each(tmpInfo, function(key, value) {
						value.typeName = unescape(value.typeName);
						output += Mustache.render(litemplate, value);
					});
				} else {
					output += Mustache.render(litemplate, tmpInfo);
				}

				Zepto(".tab-list").html('');
				Zepto(".tab-list").append(output);
				Zepto(".tab-list").find('li').first().addClass('section-left-active').siblings().removeClass('section-left-active');
				typeId = Zepto(".tab-list").find('li').first().attr("id");
				initPullDownRefresh();
				//区域滚动
				mui(".mui-scroll-wrapper").scroll();
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	};

	//研习圈--tab导航栏目点击事件
	Zepto('.tab-list').on('tap', 'li', function(e) {
		Zepto(this).addClass('section-left-active').siblings().removeClass('section-left-active');
		typeId = Zepto(this).attr("id");
		pullToRefreshObject.refresh();
		//快速回滚到该区域顶部
		mui('#pullrefresh').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
	});

	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		beginIndex = CurrPage * PageSize;
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			pageSize: PageSize,
			pageIndex: CurrPage,
			classifyId: typeId,
			keyword: '',
			userId: userId
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData.para);
		//console.log('url:' + url);
		//console.log('请求参数' + requestData);
		return requestData;
	};

	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		console.log("框架处理返回的数据：" + JSON.stringify(response));
		var response = CommonUtil.handleStandardResponse(response, 1)
			//定义临时数组
		var tempArray = [];
		if(response.code == "1") {
			tempArray = response.data;
			totalNumCount = response.totalCount;
			tempArray = response.data;
			mui.each(tempArray, function(key, value) {
				if(!value.image || value.image == "") {
					value.image = '../../../img/MobileFrame/img_default_noimage240-240.png';
				}else{
					value.image = unescape(value.image);
				};
				value.title = unescape(value.title);
				value.index = (beginIndex - PageSize) + key;
				//console.log(value.index);
				//（isManager  0/1/2/3/4:申请加入/已加入/圈主/待审核/审核不通过） 
				//console.log("isManager" + value.isManager);
				if(value.isManager == 0) {
					//申请加入
					value.isManager = "申请加入";
				} else if(value.isManager == 1) {
					//已加入
					value.isManager = "已加入";
				} else if(value.isManager == 2) {
					//圈主
					value.isManager = "已是圈主";
				} else if(value.isManager == 3) {
					//待审核
					value.isManager = "待审核";
				} else if(value.isManager == 4) {
					// 被删除的和被拒绝的”，页面上不显示状态。一律属于审核不通过 
					value.isManager = "审核不通过";
				}
			});
		}
		return tempArray;
	};
	//映射模板
	function getlitemplate() {
		var litemplate = '<div class="mui-clearfix" id="{{id}}"><img src="{{image}}"/><span class="title-program mui-ellipsis">{{title}}</span><div class="m-btn mui-clearfix"  id="{{index}}"><a id="icon-plus" class="icon-join"><span class="mui-icon mui-icon-plus attend-in"></span></a><span class="video-show">{{isManager}}</span></div></div>';
		return litemplate;
	};
	//请求接口地址
	function getUrl() {
		//var url = config.PCServerUrl + 'CircleSearchList';
		//var url = config.PCServerUrl + 'CircleSearchListByClassify';
		var url = config.JServerUrl + 'circle/mobile/search/circleSearchListByClassify';
		console.log(url);
		return url;
	};
	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		circleId = Zepto(this).attr('id');
		var text = Zepto(this).find('.video-show').text();
		if(Zepto(e.target).hasClass('m-btn') || Zepto(e.target).parents('.m-btn').html() != null) {
			if(text == "申请加入") {
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
			}
		} else {
			//查看圈子详情信息
			WindowUtil.createWin("szpark_circle_dynamics_pad.html", "szpark_circle_dynamics_pad.html", {
				circleId: circleId
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
		mui.each(response, function(key, value) {
			//自动更新索引值
			var index = (beginIndex - PageSize + key);
			//（isManager  0/1/2/3/4:申请加入/已加入/圈主/待审核/审核不通过） 
			if(value.isManager == "申请加入") {
				//申请加入

			} else if(value.isManager == "已加入") {
				//已加入
				Zepto("#" + index).css('background-color', 'gray');
			} else if(value.isManager == "已是圈主") {
				//圈主
				Zepto("#" + index).css('visibility','hidden');
				Zepto("#" + index).css('background-color', 'gray');
			} else if(value.isManager == "待审核") {
				Zepto("#" + index).css('visibility','hidden');
				//待审核
				Zepto("#" + index).css('background-color', 'gray');
			} else if(value.isManager == "审核不通过") {
				Zepto("#" + index).css('visibility','hidden');
				// 被删除的和被拒绝的”，页面上不显示状态。
				Zepto("#" + index).css('background-color', 'gray');
			}
		});
	};

	function initPullDownRefresh() {
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getlitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				//否则为给标签监听
				targetListItemClickStr: 'div',
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
	
	//监听圈子动态申请刷新头部申请状态数据
	window.addEventListener("initCirclePadStatus",function(e){
		pullToRefreshObject.refresh();
	});
	
	//监听退出该圈子状态数据
	window.addEventListener("pauseCirclePad",function(e){
		pullToRefreshObject.refresh();
	});
});