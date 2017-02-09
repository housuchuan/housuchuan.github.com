/**
 * 描述 :个人主页（pad版页面）
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-09-14 19:07:29
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var userId = "";
	var userName = "";
	var secretKey = "",
		circleId = '';
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var totalNumCount2 = 0;
	var pullToRefreshObject;
	var pullToRefreshObject2;
	//圈子种类,0:审核; 1:创建; 2:加入
	var circleKind = "0";
	var title = "审核中";
	//话题种类  0 代表“TA发表的”，1 代表“TA回复的”，2 代表“TA赞的”
	var topicKind = "0";
	//初始化
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		initPullRefreshListWithCircle();
		initPullRefreshListWithTopic();
	});
	//初始化圈子管理列表（审核中、我加入的以及我创建的）
	function initPullRefreshListWithCircle() {
		//******************第一个下拉刷新**********************************
		var getData = function(CurrPage) {
			var requestData = {
				ownerId: userId, //圈子空间所属用户Id
				userId: userId, //当前登录用户Id
				pageSize: PageSize,
				pageIndex: CurrPage,
				type: circleKind //0:审核; 1:创建; 2:加入
			};
			requestData = JSON.stringify(requestData);
			console.log('圈子请求参数' + requestData);
			return requestData;
		};
		//获取接口地址
		var getUrl = function() {
			var url = config.JServerUrl + 'circle/mobile/index/UserCircleList';
			return url;
		};

		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//console.log("原始返回数据1" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			//console.log("处理后的数据" + JSON.stringify(response));
			if(response.code == 1) {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(!value.image) {
						value.image = '../../../img/MobileFrame/img_default_noimage130-130.png';
					}else{
						value.image = unescape(value.image);
					};
					value.title = unescape(value.title);
					value.status = unescape(value.status);
				});
			}
			return tempArray;
		};
		//模板
		var getLitemplate = function() {
			var litempate = '<li class="mui-clearfix"id="{{id}}"><span class="circleRefuse" style="display:none">{{circleRefuseReason}}</span><img src="{{image}}"/><div class="manage">管理</div><div class="check-status"><div>{{title}}</div><div class="validate">{{status}}</div><div><span>{{member}}</span><span>成员</span></div></div><div class="topic-content"><span>{{topic}}</span><span>话题</span></div></li>';
			return litempate;
		};
		//成功回调
		var successCallbackFunc = function(response) {
			//console.log(JSON.stringify(response));
			if(title == '我创建的') {
				//Zepto('li').find('.manage').show();
				var _this = Zepto('#listdata li');
				for(var i = 0; i < _this.length; i++) {
					if(Zepto(_this[i]).find('.validate').text() == '审核中') {
						Zepto(_this[i]).find('.manage').hide();
					}else if(Zepto(_this[i]).find('.validate').text() == '审核拒绝'){
						Zepto(_this[i]).find('.manage').text('删除');
					};
				}
			} else if(title == '我加入的') {
				Zepto('li').find('.manage').hide();
			} else {
				Zepto('li').find('.manage').hide();
			}
		};
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc = function() {
			//console.log("圈子总数：" + totalNumCount);
			return totalNumCount;
		};
		//圈子点击事件
		var onItemClickCallbackFunc = function(e) {
			circleId = this.id;
			if(Zepto(e.target).hasClass('manage')&&Zepto(e.target).html() == '管理') {
				//圈主管理
				WindowUtil.createWin("szpark_master_management.html", "../../studycircle/szpark_master_management.html", {
					circleId: circleId
				});
				return;
			}else if(Zepto(e.target).hasClass('manage')&&Zepto(e.target).html() == '删除'){
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
			}else if(Zepto(e.target).hasClass('validate') && Zepto(e.target).html() == '审核拒绝') {
				if(Zepto(this).find('.circleRefuse').text()){
					UIUtil.confirm({
						content: Zepto(this).find('.circleRefuse').text(),
						title: '审核不通过理由:',
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
			} else{
				//查看圈子详情信息
				WindowUtil.createWin("szpark_circle_dynamics_pad.html", "szpark_circle_dynamics_pad.html", {
					circleId: circleId
				});
			}
		};
		// 初始化下拉刷新控件
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 45
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
	};

	//初始化话题列表（我回复的，我发表的以及我赞的）
	function initPullRefreshListWithTopic() {
		var getData2 = function(CurrPage) {
			var requestData = {};
			requestData.ValidateData = 'mobilevalidateData';
			var data = {
				ownerId: userId,
				type: topicKind, //type = 0:发表的; 1:评论的; 2:点赞的
				pageSize: PageSize,
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
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(!value.from) {
						value.from = "undefined";
					}else{
						console.log("xxxxxxxxxxxx"+value.from);
						value.from = unescape(value.from);
						console.log("xxxxxxxxxxxx"+value.from);
					};
					value.topicName = unescape(value.topicName);
					value.text = unescape(value.text);
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
			var litempate = '<li class="mui-table-view-cell"id="{{topicId}}"><div class="pubishContentAreaList mui-clearfix"><img src="../../../img/MobileFrame/img_head_logo102-102.png"/><div class="personalInfo"><div class="name">{{author}}</div><div><span>发布时间：</span><span>{{time}}</span></div></div><div class="fromArea"><span>来自：</span><span>{{from}}</span></div></div><p>{{topicName}}</p></li>';
			return litempate;
		};
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc2 = function() {
			//console.log("话题总数：" + totalNumCount2);
			return totalNumCount2;
		};

		var onItemClickCallbackFunc2 = function(e) {
			var topicId = this.id;
			WindowUtil.createWin("szpark_circle_dynamics_details.html", "../../studycircle/szpark_circle_dynamics_details.html", {
				topicId: topicId
			});
		};
		//初始化下拉刷新控件
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 45
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

	//监听切换圈子类型（0:审核; 1:创建; 2:加入）
	window.addEventListener('refreshCircleList', function(e) {
		console.log(e.detail.circleKind);
		if(e.detail.circleKind) {
			circleKind = e.detail.circleKind;
			title = e.detail.title;
			console.log("circleKind" + circleKind + title);
			pullToRefreshObject.refresh();
		}
	});
	//监听切换话题类型（）
	window.addEventListener('refreshTopicList', function(e) {
		if(e.detail.topicKind) {
			topicKind = e.detail.topicKind;
			pullToRefreshObject2.refresh();
			//快速回滚到该区域顶部
			mui('.publishConten-area').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
		}
	});
	
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
});