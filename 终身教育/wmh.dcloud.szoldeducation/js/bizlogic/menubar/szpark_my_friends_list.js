/**
 * 描述 :好友模块子页面  
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-08-08 15:08:45
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var device = require('core/MobileFrame/DeviceUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var friendType = 1;
	var totalNumCount = 0;
	var pageSize = 10;
	var title = "好友申请";
	var secretKey = "";
	var userId = "",
		friendsLen = 0;
	CommonUtil.initReady(initData);

	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
		};
		//初始化好友列表
		initFriendList();
	};
	//好友列表和好友申请tab切换
	Zepto('.friends-tabBar').on('tap', 'span', function() {
		title = Zepto(this).text();
		Zepto(this).addClass('friends-tabActive').siblings().removeClass('friends-tabActive');
		if(title == "好友列表") {
			friendType = 0;
		} else if(title == "好友申请") {
			friendType = 1;
		}
		if(device.tablet()) {
			//console.log("是平板");
			WindowUtil.firePageEvent("szpark_my_friends_list_pad.html", "refreshListPage");
		} else {
			//console.log("是手机");
			WindowUtil.firePageEvent("szpark_my_friends_list.html", "refreshListPage");
		}
	});

	//初始化好有列表
	function initFriendList() {
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
				pageSize: pageSize,
				userId: userId,
				friendType: friendType
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
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				console.error(JSON.stringify(tempArray));
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					if(!value.friendImg){
						value.friendImg = '../../img/MobileFrame/img_head_logo102-102.png';
					};
					value.nick = unescape(value.nick);
					value.content = unescape(value.content);
					if(title == '好友列表'){
						value.content = '已是好友';
					};
				});
				if(title == '好友申请') {
					if(tempArray) {
						if(!tempArray.length) {
							friendsLen = 0;
						} else {
							friendsLen = tempArray.length;
						}
					} else {
						friendsLen = 0;
					}
				};
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
			console.log("成功请求数据：" + JSON.stringify(response));
			if(title == '好友申请') {
				if(CommonUtil.os.plus) {
					//平板和手机触发不同的父页面，所以用此方法判断。
					if(device.tablet()) {
						//console.log("是平板");
						//触发平板个人空间首页（功能：改变好友数目导航上标的值）
					} else {
						//触发手机个人空间首页
						WindowUtil.firePageEvent("szpark_personal_space.html", "refreshFriendCounts", {
							friendCounts: friendsLen //好友申请的数目
						});
					}
				} else {
					window.parent.refreshFriendCounts(friendsLen); //好友申请的数目
				}
			}
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			//console.log(e.target.innerHTML);
			var friendId = this.id;
			//console.log("好友ID" + friendId);
			var buttonText = e.target.innerHTML;
			//console.log("操作按钮" + buttonText);
			var buttonType = null;
			//好友列表及好友申请：操作类型：0:删除, 1:待处理, 2:通过, 3:拒绝
			if(buttonText == '删除') {
				buttonType = 0;
				UIUtil.confirm({
					content: '您确认要删除吗？',
					title: '提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//this.remove();
						friendsOperation(friendId, buttonType);
					}
				});
			} else if(buttonText == '同意') {
				buttonType = 2;
				UIUtil.confirm({
					content: '是否允许添加成为你好友？',
					title: '提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						friendsOperation(friendId, buttonType);
						if(device.tablet()) {
						}else{
							//触发手机个人空间首页
							WindowUtil.firePageEvent("szpark_personal_space.html", "refreshFriendCounts", {
								friendCounts: friendsLen //好友申请的数目
							});
						}
					}
				});
			} else if(buttonText == '忽略') {
				buttonType = 3;
				UIUtil.confirm({
					content: '您确认要忽略这条信息吗？',
					title: '提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//this.remove();
						friendsOperation(friendId, buttonType);
						if(device.tablet()) {
						}else{
							//触发手机个人空间首页
							WindowUtil.firePageEvent("szpark_personal_space.html", "refreshFriendCounts", {
								friendCounts: friendsLen //好友申请的数目
							});
						}
					}
				});
			}else if(Zepto(e.target).hasClass('mui-ellipsis')){
		        UIUtil.confirm({
		            content: Zepto(e.target).html(),
		            title: '申请详情',
		            buttonValue: ['确定', '取消']
		        }, function(index) {
		            
		        });   
			}
		};

		/**
		 * @description 对好友进行操作（删除、同意）
		 */
		function friendsOperation(friendId, buttonType) {
			//var url = config.MockServerUrl + 'mobile/space/friends/friendsOperation';
			var url = config.JServerUrl + "mobile/space/friends/friendsOperation";
			var requestData = {};
			requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				friendId: friendId,
				buttonType: buttonType
			};
			requestData.para = data;
			requestData = JSON.stringify(requestData.para);
			console.log("好友操作地址：" + url);
			console.log("好友操作参数：" + requestData);
			CommonUtil.ajax(url, requestData, function(response) {
				var response = CommonUtil.handleStandardResponse(response, '0');
				//console.log("好友操作结果：" + JSON.stringify(response));
				if(response.code == 1) {
					UIUtil.toast(response.description);
					console.log("1111111122222222222222222");
					if(device.tablet()) {
						//是平板
						WindowUtil.firePageEvent("szpark_my_friends_list_pad.html", "refreshListPage");
					} else {
						//是手机
						WindowUtil.firePageEvent("szpark_my_friends_list.html", "refreshListPage");
					}
				}
			}, function(e) {
				UIUtil.toast('网络连接超时！请检查网络...');
			}, 1, secretKey, false);
		};

		//获取模板
		var getlitemplate = function() {
			var litemplate = '<li id="{{friendId}}" class="mui-table-view-cell mui-media"><a href="javascript:;"><img class="mui-media-object mui-pull-left" src="{{friendImg}}"/><div class="mui-media-body"><span>{{nick}}</span><p class="mui-ellipsis">{{content}}</p></div><div class="friends-operation"><button type="button" id="delete" class="mui-btn mui-btn-block">删除</button></div></a></li>';
			if(title == '好友列表') {
				litemplate = '<li id="{{friendId}}" class="mui-table-view-cell mui-media"><a href="javascript:;"><img class="mui-media-object mui-pull-left" src="{{friendImg}}"/><div class="mui-media-body"><span>{{nick}}</span><p class="mui-ellipsis">{{content}}</p></div><div class="friends-operation"><button type="button" id="delete" class="mui-btn mui-btn-block">删除</button></div></a></li>';
			} else if(title == '好友申请') {
				litemplate = '<li id="{{friendId}}" class="mui-table-view-cell mui-media"><a href="javascript:;"><img class="mui-media-object mui-pull-left" src="{{friendImg}}"/><div class="mui-media-body"><span>{{nick}}</span><p class="mui-ellipsis">{{content}}</p></div><div class="friends-operation"><button type="button" class="mui-btn mui-btn-block">同意</button><button type="button" class="mui-btn mui-btn-block">忽略</button></div></a></li>';
			}
			return litemplate;
		};
		//接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'mobile/space/friends/friendsList';
			var url = config.JServerUrl + 'mobile/space/friends/friendsList';
			console.log(url);
			return url;
		};
		/*
		 * @description 初始化下拉刷新控件
		 */
		PullrefreshUtil.initPullDownRefresh({
			//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
			IsDebug: true,
			//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			mDefaultInitPageNum: 1,
			mGetLitemplate: getlitemplate,
			mGetUrl: getUrl,
			mGetRequestDataFunc: getData,
			mChangeResponseDataFunc: changeResponseDataFunc,
			mChangeToltalCountFunc: changeToltalCountFunc,
			mRequestSuccessCallbackFunc: successCallbackFunc,
			mOnItemClickCallbackFunc: onItemClickCallbackFunc,
			mGetDataOffLineFunc: null,
			ajaxSetting: {
				//默认的contentType
				contentType: "application/json",
				headers: {
					"X-SecretKey": secretKey
				}
			}
		});
	};

});