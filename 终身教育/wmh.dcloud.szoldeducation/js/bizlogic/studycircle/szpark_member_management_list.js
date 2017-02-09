/**
 * 描述 :成员管理 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-15 14:17:30
 */

define(function(require, exports, module) {
	"use strict"
	//使用工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PageSize = 10;
	var totalNumCount = 0;
	var circleId = "";
	var secretKey = "";
	var userId = "";
	var userName = "";
	//初始化
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		circleId = WindowUtil.getExtraDataByKey("circleId");
		//初始化刷新列表
		initPullRefreshList();
	});

	function initPullRefreshList() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = 'validatedata';
			var data = {
				circleId: circleId,
				pageSize: PageSize,
				pageIndex: CurrPage
			};
			requestData.para = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData.para);
			//console.log('请求参数' + requestData);
			return requestData;
		}

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("" + JSON.stringify(response));
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, "1")
			if(response.code == "1") {
				totalNumCount = response.totalCount;
				//console.log("totalNumCount" + totalNumCount);
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(value.speak == "允许") {
						value.btnText = "禁言";
					} else if(value.speak == "禁言") {
						value.btnText = "解除禁言";
					}
				});
				//console.log(JSON.stringify(tempArray));
			}
			return tempArray;

		}

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		}

		//接口地址
		var getUrl = function() {
				//var url = config.MockServerUrl + 'studycircle/membermanagement';
				var url = config.JServerUrl + "circle/mobile/detail/circleMemberList";
				//var url = config.PCServerUrl + 'CircleMemberList';
				//console.log(url);
				return url;
			}
			//映射模板
		var getLitempate = function() {
				var litemplate = '<div class="mui-tip mui-ellipsis clearfix" id="{{userId}}"><span>{{nick}}</span><span class="topic">{{topic}}话题</span><span>{{report}}回复</span><br/><span class="join-time">加入时间：</span><span class="join-time">{{enterTime}}</span><br/><span class="last-recall last-recall-act">最后发言：</span><span class="last-recall">{{lastTime}}</span><br/><span class="gag">是否禁言：</span><span class="gag">{{speak}}</span><button class="ignore">踢出</button><button class="shield">{{btnText}}</button></div>';
				return litemplate;
			}
			/**
			 * @description 成功回调
			 * @param {Object} response
			 */
		var successCallbackFunc = function(response) {
			console.log("成功请求数据：" + JSON.stringify(response));
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			//（0（剔除）删除1已加入(同意)2待加入 3.拒绝 4.禁言）
			var memberID = this.id;
			var type;
			if(Zepto(e.target).hasClass('shield')) {
				if(Zepto(this).find(".shield").text() == "禁言") {
					//console.log("禁言");
					type = 4;
				} else if(Zepto(this).find(".shield").text() == "解除禁言") {
					//console.log("解除禁言");
					type = 1;
				}
			} else if(Zepto(e.target).hasClass('ignore')) {
				//console.log("踢出");
				type = 0;
			}
			//操作处理
			CircleMemberManage(type, memberID);
		};
		/*
		 * @description 初始化下拉刷新控件
		 */
		PullrefreshUtil.initPullDownRefresh({
			//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
			IsDebug: true,
			//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			mDefaultInitPageNum: 1,
			mGetLitemplate: getLitempate,
			mGetUrl: getUrl,
			mGetRequestDataFunc: getData,
			mChangeResponseDataFunc: changeResponseDataFunc,
			mChangeToltalCountFunc: changeToltalCountFunc,
			mRequestSuccessCallbackFunc: successCallbackFunc,
			mOnItemClickCallbackFunc: onItemClickCallbackFunc,
			mTargetListItemClickStr: "div",
			ajaxSetting: {
				accepts: {
					json: "application/json;charset=utf-8"
				},
				contentType: "application/json",
				//头部heads,用于过滤头部信息，判断请求之前是否需要验证规则（比如登录）
				headers: {
					"X-SecretKey": secretKey
				}
			}
		});
	}

	/**
	 * @description  管理圈子成员
	 * @param {Object} type （0（剔除）删除1已加入(同意)2待加入 3.拒绝 4.禁言）
	 */
	function CircleMemberManage(type, memberID) {
		//var url = config.MockServerUrl + 'studycircle/pendingAuditOperation';
		//var url = config.PCServerUrl + 'CircleMemberManage';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleMemberManage';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: memberID,
			type: type
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("成员管理参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				UIUtil.toast(response.description);
				WindowUtil.firePageEvent('szpark_member_management_list.html', 'refreshListPage');
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
});