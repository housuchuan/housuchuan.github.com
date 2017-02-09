/**
 * 描述 :子页面交互 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict";
	//加载窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools2 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	//每页显示条数
	var PageSize = 10;
	var PageSize2 = 10;
	//列表总记录数
	var totalNumCount = 0;
	var totalNumCount2 = 0;
	var pullToRefreshObject;
	var pullToRefreshObject2;
	//圈子种类,0:审核; 1:创建; 2:加入
	var circleKind = 1;
	var title = '我创建的';
	//话题种类  0 代表“TA发表的”，1 代表“TA回复的”，2 代表“TA赞的”
	var topicKind = 0;
	//登录信息userSession
	var userSession;
	var userId = "",
		circleId = '';
	var userName = "";
	var image = "../../img/MobileFrame/img_head_logo190-190.png";
	//secretKey默认登录成功之后，拿到的key
	var secretKey = "";
	//TA点击操作
	CommonUtil.initReady(initData);

	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
			Zepto("#userName").text(userName);
		}
		if(userSession.image) {
			image = userSession.image;
			Zepto("#HeadImage").attr("src", image);
		}
		//初始化下拉列表
		initPullRefreshList();
		//区域滚动
		var height = Zepto('.space-wrapper').height();
		//		console.log("xxxxxxxxx" + height);
		height = (height + 156) + 'px';
		//		console.log("xxxxxxxxx" + height);
		Zepto('.needWrapper').css('height', height);
		mui(".space-wrapper").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	};

	//点击TA样式变化
	Zepto('.TA-addevent').on('tap', function() {
		var _this = Zepto(this);
		_this.addClass('TA-active').siblings().removeClass('TA-active');
	});
	//圈子TAB切换
	Zepto('.TA-eve').on('tap', function() {
		title = Zepto(this).text();
		//对点击的圈子按钮进行相应的判断
		//0:审核; 1:创建; 2:加入
		switch(title) {
			case "TA创建的":
				circleKind = 1;
				break;
			case "TA加入的":
				circleKind = 2;
				break;
			case "我创建的":
				circleKind = 1;
				break;
			case "我加入的":
				circleKind = 2;
				break;
			case "审核中":
				circleKind = 0;
				break;
		};
		//刷新列表
		pullToRefreshObject.refresh();
	});

	//话题TAB切换
	Zepto('.selectTopic').on('tap', function() {
		var title = Zepto(this).text();
		//对点击的话题按钮进行相应的判断
		switch(title) {
			case "TA发表的":
				topicKind = '0';
				break;
			case "TA回复的":
				topicKind = '1';
				break;
			case "TA赞的":
				topicKind = '2';
				break;
			case "我发表的":
				topicKind = '0';
				break;
			case "我回复的":
				topicKind = '1';
				break;
			case "我赞的":
				topicKind = '2';
				break;
		}
		//刷新列表
		pullToRefreshObject2.refresh();
	});
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//******************第一个下拉刷新**********************************
		var getData = function(CurrPage) {
			var requestData = {};
			requestData.ValidateData = 'mobilevalidatedata';
			var data = {
				ownerId: userId, //圈子空间所属用户Id
				userId: userId, //当前登录用户Id
				pageSize: PageSize,
				pageIndex: CurrPage,
				type: circleKind //0:审核; 1:创建; 2:加入
			};
			requestData.para = data;
			requestData = JSON.stringify(requestData.para);
			console.log('圈子请求参数' + requestData);
			return requestData;
		};
		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + "personalPage/getcircleList";
			//var url = config.PCServerUrl + 'UserCircleList';
			var url = config.JServerUrl + 'circle/mobile/index/UserCircleList';
			console.log(url);
			return url;
		};

		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//console.log("原始返回数据1" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == 1) {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				console.log("个人主页处理后的数据" + JSON.stringify(tempArray));
				mui.each(tempArray, function(key, value) {
					if(!value.image) {
						value.image = '../../img/MobileFrame/img_default_noimage130-130.png';
					} else {
						value.image = unescape(value.image);
					};
					if(value.status == '审核拒绝') {
						value.btn = '删除';
					} else {
						value.btn = '管理';
					}
					value.title = unescape(value.title);
					value.auditInfo = unescape(value.auditInfo);
				});
			}
			return tempArray;
		};
		//模板
		var getLitemplate = function() {
			var litempate = '<li id="{{id}}" class="mui-table-view-cell meCreate"><span class="circleRefuse" style="display:none">{{auditInfo}}</span><div class="circle-sec-inner clearfix"><img src="{{image}}"/><div class="circle-sec"><span>{{title}}</span><br/><span class="TA-common circle-check">[{{status}}]</span><br/><span class="TA-common circle-common-col">{{member}}</span><span class="TA-common">成员</span><span class="TA-common circle-common-col circle-theme">{{topic}}</span><span class="TA-common">话题</span></div></div><button type="button" class="mui-btn mui-btn-blue mui-btn-outlined">{{btn}}</button></li>';
			return litempate;
		};
		//成功回调
		var successCallbackFunc = function(response) {
			//console.log(JSON.stringify(response));
			if(title == '我创建的') {
				Zepto('li').find('.mui-btn-outlined').show();
				var _this = Zepto('#listdata li');
				for(var i = 0; i < _this.length; i++) {
					if(Zepto(_this[i]).find('.circle-check').text() == '[审核中]') {
						Zepto(_this[i]).find('.mui-btn-outlined').css('display', 'none');
					};
				}
			} else if(title == '我加入的' || title == '审核中') {
				Zepto('li').find('.mui-btn-outlined').hide();
			};

		};
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc = function() {
			//console.log("圈子总数：" + totalNumCount);
			return totalNumCount;
		};
		//圈子点击事件
		var onItemClickCallbackFunc = function(e) {
			circleId = this.id;
			//			console.log("xxxxxxxx"+Zepto(e.target).html());
			if(Zepto(e.target).hasClass('mui-btn-outlined') && Zepto(e.target).html() == '管理') {
				//圈主管理
				WindowUtil.createWin("szpark_master_management.html", "../studycircle/szpark_master_management.html", {
					circleId: circleId
				});
				return;
			} else if(Zepto(e.target).hasClass('mui-btn-outlined') && Zepto(e.target).html() == '删除') {
				//请求删除接口
				UIUtil.confirm({
					content: '是否要删除该圈子',
					title: '温馨提示 ',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//执行删除新建的圈子函数
						refuseCircleDelete();
					}
				});
			} else if(Zepto(e.target).hasClass('circle-check') && Zepto(e.target).html() == '[审核拒绝]') {
				if(Zepto(this).find('.circleRefuse').text()){
					UIUtil.confirm({
						content: Zepto(this).find('.circleRefuse').text(),
						title: '审核拒绝理由:',
						buttonValue: ['确定', '取消']
					}, function(index) {
						//不进行任何操作
					});
				}else{
					UIUtil.confirm({
						content: '无拒绝理由',
						title: '审核不通过理由:',
						buttonValue: ['确定', '取消']
					}, function(index) {
						//不进行任何操作
					});
				};
			} else {
				//查看圈子详情信息
				WindowUtil.createWin("szpark_circle_dynamics.html", "../studycircle/szpark_circle_dynamics.html", {
					circleId: circleId
				});
			};
		};
		// 初始化下拉刷新控件
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 20
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc,
				itemClickCallback: onItemClickCallbackFunc,
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

		//******************第二个下拉刷新**********************************
		var getData2 = function(CurrPage) {
			var requestData = {};
			requestData.ValidateData = 'mobilevalidateData';
			var data = {
				ownerId: userId,
				type: topicKind, //type = 0:发表的; 1:评论的; 2:点赞的
				pageSize: PageSize2,
				pageIndex: CurrPage
			};
			requestData.para = data;
			requestData = JSON.stringify(requestData.para);
			console.log('话题请求参数' + requestData);
			return requestData;
		};
		//获取地址
		var getUrl2 = function() {
			//var url2 = config.MockServerUrl + "personalPage/topicList";
			//var url2 = config.PCServerUrl + 'UserMoreTopicList';
			var url2 = config.JServerUrl + 'circle/mobile/person/moreTopic';
			return url2;
		};
		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc2 = function(response) {
			console.log("用户话题数据" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1)
			if(response.code == 1) {
				totalNumCount2 = response.totalCount;
				console.log("XXXXXX" + totalNumCount2);
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(!value.from) {
						value.from = "undefined";
					} else {
						value.from = unescape(value.from);
					};
					value.topicName = unescape(value.topicName);
				});
			}
			return tempArray;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc2 = function(response) {};

		var getLitemplate2 = function() {
			var litempate = '<li class="mui-table-view-cell theme-sec clearfix"id="{{topicId}}"><span>{{author}}</span><span class="theme-commom theme-publish-date">{{time}}</span><span class="theme-commom theme-publish-date">发布时间：</span><br/><span class="theme-issuer">{{topicName}}</span><br/><span class="theme-watch viewtext">【查看正文】</span><span class="theme-commom circlename">{{from}}</span><span class="theme-commom theme-publish-date">来自：</span></li>';
			return litempate;
		};
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc2 = function() {
			console.log("话题总数：" + totalNumCount2);
			return totalNumCount2;
		};

		var onItemClickCallbackFunc2 = function(e) {
			var topicId = this.id;
			//console.log("e.target"+e.target.innerHTML);
			if(Zepto(e.target).hasClass('viewtext')) {
				//console.log("查看正文");
				WindowUtil.createWin("szpark_circle_dynamics_details.html", "szpark_circle_dynamics_details.html", {
					topicId: topicId
				});
			} else if(Zepto(e.target).hasClass('theme-view-reply')) {
				//console.log("查看回复");
			}
		};
		//初始化下拉刷新控件
		PullToRefreshTools2.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 20
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate2,
				getUrl: getUrl2,
				listdataId: 'listdata2',
				pullrefreshId: 'pullrefresh2',
				getRequestDataCallback: getData2,
				changeResponseDataCallback: changeResponseDataFunc2,
				changeToltalCountCallback: changeToltalCountFunc2,
				successRequestCallback: successCallbackFunc2,
				itemClickCallback: onItemClickCallbackFunc2,
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
			pullToRefreshObject2 = pullToRefresh;
		});
	};

	//删除审核不通过的圈子
	var refuseCircleDelete = function() {
		//var url = config.MockServerUrl + 'personalSpace/circleDelete';
		var url = config.JServerUrl + 'circle/mobile/circle/delete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			circleId: circleId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxx" + requestData);
		console.log("xxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxx"+JSON.stringify(response));
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
});