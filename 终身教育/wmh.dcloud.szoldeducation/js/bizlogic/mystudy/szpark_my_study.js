/**
 * 描述 :我的学习子页面
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:50
 */
define(function(require, exports, module) {
	"use strict";
	//加载窗体模块
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var ToggleMenuUtil = require('bizlogic/common/common_initToggleMenu.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var pullToRefreshObject;
	//每页显示条数
	var PageSize = 10;
	var title = '点播';
	var playType = 0;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = '',
	    type = 0;
	//var secretKey = config.secretKey
	var userId;
	var userName;
	CommonUtil.initReady(initData);

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
		ToggleMenuUtil.initToggleMenu("menu-btn");
		//直播点播tab切换
		Zepto('.column').on('tap', 'span', function() {
			title = Zepto(this).text();
			if (title == '点播') {
				type = 0;
			} else if(title == '直播'){
				type = 1;
			};
			Zepto(this).addClass('items-active');
			Zepto(this).siblings().removeClass('items-active');
			pullToRefreshObject.refresh();
			//快速回滚到该区域顶部
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		});
		pullRefreshList();
	}
	/**
	 *我的学习菜单 
	 */
	Zepto(".study").on('tap', function() {
		var menuItem = Zepto(this).find("span")[0].innerText;
		switch(menuItem) {
			case "我的课程":
				ToggleMenuUtil.menu_close();
				break;
			case "我的笔记":
				WindowUtil.createWin("szpark_my_note.html", "szpark_my_note.html");
				break;
			case "我的活动":
				WindowUtil.createWin("szpark_my_activities_list.html", "szpark_my_activities_list.html");
				break;
			case "播放记录":
				WindowUtil.createWin("szpark_playrecord_list.html", "szpark_playrecord_list.html");
				break;
			case "积分记录":
				WindowUtil.createWin("szpark_integral_record_list.html", "szpark_integral_record_list.html");
				break;
			case "我的视频":
				WindowUtil.createWin("szpark_my_video.html", "szpark_my_video.html");
				break;
			case "学习计划":
				WindowUtil.createWin("szpark_study_planning_list.html", "szpark_study_planning_list.html");
				break;
			case "学习排名":
				WindowUtil.createWin("szpark_learning_ranking_list.html", "szpark_learning_ranking_list.html");
				break;
			case "学习档案":
				WindowUtil.createWin("szpark_learning_files.html", "szpark_learning_files.html");
				break;
			case "兑换记录":
				WindowUtil.createWin("szpark_exchange_record_list.html", "szpark_exchange_record_list.html");
				break;
			default:
				break;
		}
	});
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function pullRefreshList() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				userId: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('点播或直播请求参数' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
				//定义临时数组
				var tempArray = [];
				var response = CommonUtil.handleStandardResponse(response, 1);
				if(response.code == 1) {
					console.log("xxxxxxxxxtempArray学习学习嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻" + JSON.stringify(response));
					tempArray = response.data;
					totalNumCount = response.totalCount;
					if(title == '直播') {
						mui.each(tempArray, function(key, value) {
							var introduction = value.introduction;
							if(value.image == '' || value.image == null) {
								value.image = '../../img/MobileFrame/img_error.jpg';
							} else {
								value.image = unescape(value.image);
							};
							if(!value.introduction){
								value.introduction = '这是一个虚拟的直播简介，只是为了展示效果，只是为了展示效果，只是为了展示效果'
							}
						});
					} else {
						mui.each(tempArray, function(key, value) {
							var status = value.status;
							switch(status) {
								case '0':
									value.status = '未学习';
									break;
								case '1':
									value.status = '学习中';
									break;
								case '2':
									value.status = '学习完';
									break;
								default:
									value.status = '未学习';
									break;
							};
							if(value.image == '' || value.image == null) {
								value.image = '../../img/MobileFrame/img_error.jpg';
							} else {
								value.image = unescape(value.image);
							};
						});
					}
				}
				return tempArray;
			}
			/**
			 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
			 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var getUrl = function() {
			var url = '';
			if(title == '点播') {
				//url = config.MockServerUrl + "mystudy/mycourse";
				url = config.JServerUrl + "mystudy/mycourse";
			} else if(title == '直播') {
				//url = config.MockServerUrl + "mystudy/mycourceBroadcast";
				url = config.JServerUrl + "mystudy/mycourceBroadcast";
			}
			console.log('点播或直播url:' + url);
			return url;
		};

		var getLitemplate = function() {
			var litemplate = '';
			//默认视频列表映射模板
			if(title == '点播') {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red mui-icon ">删除</a></div><div class="mui-slider-handle clearfix"><img data-img-localcache="{{image}}"/><h4>{{cName}}</h4><div class="mui-ellipsis"><span class="studying studying-active">[{{status}}]</span><span class="studyed studyed-common-sizecol">已学习</span><span class="number studyed-common-sizecol">{{studyNum}}</span><span class="studyed-common-sizecol">节课</span><br/></div><span class="studying studyed-common-sizecol">积分：</span><span class="studyed-common-sizecol">{{marks}}</span></div></li>';
			} else if(title == '直播') {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell"><span id="{{activityId}}"></span><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red mui-icon ">删除</a></div><div class="mui-slider-handle clearfix"><img data-img-localcache="{{image}}"/><h4>{{cName}}</h4><div class="mui-ellipsis-2" style="font-size:14px;margin-left:100px"><span style="color:red">简介：</span>{{introduction}}</div></div></li>';
			}
			return litemplate
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(false);
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			var itemsId = this.id;
			//console.log("xxxxxxxxxxxxxxxxxxxx"+itemsId);
			if(title == '直播') {
				WindowUtil.createWin("resource_center_view_zhibo_parent.html", "../resourceCenter/resource_center_view_zhibo_parent.html", {
					videoId: itemsId,
					//activityId: Zepto(this).find('span').attr('id'),
					type: 1
				});
			} else if(title == '点播') {
				WindowUtil.createWin("../resourceCenter/resource_center_view_video.html", "../resourceCenter/resource_center_view_video.html", {
					itemsId: itemsId,
					type: 0
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
			pullToRefreshObject.refresh();
		});
	};

	Zepto('#listdata').on('tap', 'li .mui-btn-red', function() {
		var itemsId = Zepto(this).parents('li').attr('id');
		UIUtil.confirm({
			content: '您确认要删除吗？',
			title: '温馨提示',
			buttonValue: ['确定', '取消']
		}, function(index) {
			if(index == 0){
				deleteCourse(itemsId);
			}
		});
	});

	/**
	 * @description commonutil.ajax请求数据
	 */
	function deleteCourse(itemsId) {
		//var url = config.MockServerUrl + 'mystudy/mycourceDelete';
		var url = config.JServerUrl + 'mystudy/deletecourse';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			courseId: itemsId,
			type: type
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log('删除xxxxxxx'+requestData);
		console.log('删除xxxxxxx'+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});