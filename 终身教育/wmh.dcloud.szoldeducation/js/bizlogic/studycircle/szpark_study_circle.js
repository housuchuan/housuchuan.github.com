/**
 * 描述 : 负责调用研习圈的子页面
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:50
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CharsetUtil = require('core/MobileFrame/CharsetUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var ToggoleMenuUtil = require('bizlogic/common/common_initToggleMenu.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');

	var PageSize = 10;
	var totalNumCount = 0;
	var pullToRefreshObject;
	//圈子类别(种类)
	var typeId = '';
	//搜索关键字
	var searchValue = '';
	var secretKey = "";
	//圈子id
	var circleId;
	var userId = "";
	var userName = "";
	var beginIndex = 0;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//接收浏览器传过来的值
		if(CommonUtil.os.plus) {
			//获取缓存值
			secretKey = StorageUtil.getStorageItem("secretKey");
			var userSession = StorageUtil.getStorageItem("UserSession") || {};
			//console.log("用户信息：" + JSON.stringify(userSession));
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		} else {
			//获取缓存值
			secretKey = StorageUtil.getStorageItem("secretKey");
			var userSession = StorageUtil.getStorageItem("UserSession") || {};
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		}
		//初始化显示菜单,点击右上角+号
		ToggoleMenuUtil.initToggleMenu("menu-btn");
		initJoinCircleListener();
		appendCircleTypeList();
	};
	/**
	 *@description 研习圈菜单项--个人主页监听事件
	 */
	Zepto(".study-choose").on('tap', '.study', function() {
		var title = Zepto('span', this)[0].innerText;
		switch(title) {
			case "个人主页":
				WindowUtil.createWin("szpark_personal_page.html", "../studycircle/szpark_personal_page.html");
				break;
			case "管理的圈子":
				WindowUtil.createWin("szpark_management_circle.html", "../studycircle/szpark_management_circle.html");
				break;
			case "圈主管理":
				WindowUtil.createWin("szpark_master_management.html", "../studycircle/szpark_master_management.html");
				break;
			case "创建圈子":
				WindowUtil.createWin("szpark_create_circle.html", "../studycircle/szpark_create_circle.html");
				break;
			default:
				break;
		}
		//关闭之前刷新一下列表页面，解决页面返回异常的问题
		pullToRefreshObject.refresh();

		//最后全部关闭toggle
		ToggoleMenuUtil.menu_close();
	});
	/**
	 * @description 圈子分类列表
	 */
	function appendCircleTypeList() {
		//var url = config.MockServerUrl + 'studycircle/getCircleTypeList';
		//var url = config.PCServerUrl + 'CircleClassifyList';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleClassifyList';
		var requestData = {};
		//requestData.ValidateData = 'mobilevalidatedata';
		var data = {};
		//requestData.para = data;
		requestData = JSON.stringify(data);
		//console.log("请求参数：" + requestData);
		//console.log("请求地址：" + url);
		//console.log("secretKey：" + secretKey);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == "401" || response.code == 401) {
				//处理未登录
				//LoginUtil.handleNotloggedin(response);
			} else if(response.code == 1) {
				//console.log("登录后请求数据" + JSON.stringify(response));
				var tmpInfo = [];
				if(response.code == 1) {
					tmpInfo = response.data;
					var litemplate = '<li class="mui-table-view-cell topic-choice"id="{{typeId}}"><div class="mui-navigate-right">{{typeName}}</div></li>';
					var output = '';
					if(Array.isArray(tmpInfo) && tmpInfo.length > 0) {
						mui.each(tmpInfo, function(key, value) {
							value.typeName = unescape(value.typeName);
							output += Mustache.render(litemplate, value);
						});
					} else {
						output += Mustache.render(litemplate, tmpInfo);
					}

					Zepto("#circleTypeList").html('');
					Zepto("#circleTypeList").append(output);
					Zepto("#circleTypeList").find('li').find('div').first().addClass('section-left-active').parent().siblings().find('div').removeClass('section-left-active');
					typeId = Zepto("#circleTypeList").find('li').first().attr("id");
					initPullRefreshCircleList();
					//区域滚动
					mui(".mui-scroll-wrapper").scroll();
				}
			}
		}, function() {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	}
	//研习圈--tab导航栏目点击事件
	Zepto('.mui-table-view').on('tap', 'li', function(e) {
		Zepto(this).find('div').addClass('section-left-active').parent().siblings().find('div').removeClass('section-left-active');
		typeId = Zepto(this).attr("id");
		//console.log("typeId:\n" + typeId);
		pullToRefreshObject.refresh();
	});

	/***
	 * @description 搜索框监听事件
	 */
	Zepto("#searchValue").on('input', function() {
		searchValue = Zepto("#searchValue").val();
		pullToRefreshObject.refresh();
	});
	/**
	 * @description  初始化圈子列表
	 */
	function initPullRefreshCircleList() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			beginIndex = CurrPage * PageSize;
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'mobilevalidatedata';
			var data = {
				keyword: searchValue,
				pageSize: PageSize,
				pageIndex: CurrPage,
				classifyId: typeId,
				userId: userId
			};
			//requestData.para = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(data);
			//console.log('url:' + url);
			console.log('研习圈首页请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("圈子列表数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 1);
			//console.log("列表数据2" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			if(response.code == 1) {
				tempArray = response.data;
				console.log("处理" + JSON.stringify(response.data));
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					if(!value.image) {
						value.image = '../../img/MobileFrame/img_default_noimage130-130.png';
					}else{
						value.image = unescape(value.image);
					};
					value.title = unescape(value.title);
					value.time = unescape(value.time);
					value.introduction = unescape(value.introduction);
					value.isManager = unescape(value.isManager);
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
					};
					console.log("xxxxxxxxxxxxxxxxxx"+JSON.stringify(value));
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

		var getLitempate = function() {
			var litemplate = '<li class="mui-table-view-cell"id="{{id}}"><div class="section-right section-right-fir clearfix"><img data-img-localcache="{{image}}"/><span class="section-right-theme">{{title}}</span><br/><span class="section-right-number section-right-fontSize">{{member}}</span><span class="section-right-member section-right-fontSize">成员</span><span class="section-right-aNumber section-right-fontSize">{{topicCount}}</span><span class="section-right-answer section-right-fontSize">帖子</span><button type="button"class="mui-btn mui-btn-blue mui-btn-block join"id="{{index}}">{{isManager}}</button></div></li>';
			return litemplate;
		};

		//接口地址
		var getUrl = function() {
			//var url = config.PCServerUrl + 'CircleSearchList';
			//var url = config.PCServerUrl + 'CircleSearchListByClassify';
			var url = config.JServerUrl + 'circle/mobile/search/circleSearchListByClassify';
			console.log(url);
			return url;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response 
		 */
		var successCallbackFunc = function(response) {
			//手动强制启动h5浏览器方式加载图片
			ImageLoaderFactory.lazyLoadAllImg(true);
			mui.each(response, function(key, value) {
				//自动更新索引值
				var index = (beginIndex - PageSize + key);
				//（isManager  0/1/2/3/4:申请加入/已加入/圈主/待审核/审核不通过） 
				if(value.isManager == "申请加入") {
					//申请加入

				} else if(value.isManager == "已加入") {
					//已加入
					showStatus(index);
				} else if(value.isManager == "已是圈主") {
					//圈主
					hideStatus(index);
				} else if(value.isManager == "待审核") {
					//待审核
					hideStatus(index);
				} else if(value.isManager == "审核不通过") {
					// 被删除的和被拒绝的”，页面上不显示状态。
					hideStatus(index);
				}
			});
		};
		/**
		 * @description 列表项点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			circleId = Zepto(this).attr('id');
			//如果是选择了加入，触发加入按钮
			if(Zepto(e.target).hasClass('join')) {
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				return;
			}
			//查看圈子详情信息
			WindowUtil.createWin("szpark_circle_dynamics.html", "../studycircle/szpark_circle_dynamics.html", {
				circleId: circleId
			});
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitempate,
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
		});
	}
	/**
	 * @description 加入圈子操作
	 * @param {Object} circleId
	 */
	function initJoinCircleListener() {
		//取消和关闭弹出菜单
		Zepto(".cancel-btn,.mui-icon-closeempty").on('tap', function() {
			CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
			document.getElementById("reason").value = "";
		});
		//点击加入圈子事件
		Zepto(".confirm-btn").on('tap', function() {
			//用户加入某个圈子
			var reason = document.getElementById("reason").value;
			if(!reason) {
				mui.alert("亲，请填写加入理由！");
			} else {
				joinCircleFunc(reason);
			}
		});
	}
	/**
	 * @description 显示改变状态 ，动态去改变圈子状态按钮的颜色显示
	 * @para 参数
	 */
	function showStatus(index) {
		Zepto("#" + index).show();
		Zepto("#" + index).attr('disabled', 'disabled');
		Zepto("#" + index).css('background', 'gray');
		Zepto("#" + index).css('border-color', 'gray');
	}
	/**
	 * @description 隐藏改变状态 ，动态去改变圈子状态按钮的颜色显示
	 * @para 参数 
	 */
	function hideStatus(index) {
		Zepto("#" + index).hide();
		Zepto("#" + index).attr('disabled', 'disabled');
		Zepto("#" + index).css('background', 'gray');
		Zepto("#" + index).css('border-color', 'gray');
	}
	//监听刷新事件
	window.addEventListener('refreshListPage', function() {
		pullToRefreshObject.refresh();
	});

	/**
	 * @description 加入圈子
	 */
	function joinCircleFunc(reason) {
		//var url = config.MockServerUrl + 'cricleJoin';
		//var url = config.PCServerUrl + 'CircleApply';
		var url = config.JServerUrl + 'circle/mobile/detail/cricleJoin';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: userId,
			userName: userName,
			reason: reason
		};
		//requestData.para = data;
		requestData = JSON.stringify(data);
		CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
		document.getElementById("reason").value = "";
		//console.log("请求地址：\n" + url + "\n");
		//console.log("请求参数：\n" + requestData + "\n");
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("接口返回数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 0);
			//console.log("接口返回数据：" + JSON.stringify(response));
			if(response.code == "1") {
				//置空操作
				UIUtil.toast(response.description);
				//刷新列表
				pullToRefreshObject.refresh();
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	};
	
	//监听圈子详情申请加入刷新研习圈首页数据
	window.addEventListener('initCircleStatus',function(e){
		pullToRefreshObject.refresh();
	});
	
	window.addEventListener('dropCircle', function(e) {
		pullToRefreshObject.refresh();
	});
});