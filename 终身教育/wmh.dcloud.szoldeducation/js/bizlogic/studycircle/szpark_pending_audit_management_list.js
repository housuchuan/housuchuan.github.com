/*
 * 作者：圈主待审核
 * 时间：2016/7/15
 * 描述：圈主待审核页面交互
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PageSize = 15;
	var totalNumCount = 0;
	var type = null;
	var circleId = "";
	var secretKey = "";
	var userId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		circleId = WindowUtil.getExtraDataByKey("circleId");
		secretKey = StorageUtil.getStorageItem("secretKey");
		console.log("secretKey" + secretKey);
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//初始化下拉刷新
		initPullRefreshList()
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
			console.log("待审核数据 ：\n" + unescape(JSON.stringify(response)));
			var response = CommonUtil.handleStandardResponse(response, "1")
				//console.log("框架处理返回的数据：" + JSON.stringify(response.data));
				//定义临时数组
			var tempArray = [];
			if(response.code == "1") {
				totalNumCount = response.totalCount;
				//console.log("totalNumCount" + totalNumCount);
				tempArray = response.data;
				mui.each(tempArray,function(key,value){
					value.reason = unescape(value.reason);
				});
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
		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'studycircle/pendingAudit';
			//var url = config.PCServerUrl + 'CircleApplyMemberList';
			var url = config.JServerUrl + 'circle/mobile/manager/auditing';
			return url;
		};
		//获取映射模板
		var getLitempate = function() {
				var litemplate = '<li id="{{userId}}"><div class="mui-tip clearfix"><div class="propose"><span class="applyer">申请人：</span><span class="applyer applyer-name">{{nick}}</span></div><div class="proposeReason mui-clearfix"><span class="apply-reason">申请理由：</span><span class="apply-reason want-join">{{reason}}</span></div><div class="btn"><button class="agree">同意</button><button class="refuse">拒绝</button></div></div></li>';
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
			var userId = this.id;
			if(Zepto(e.target).hasClass('agree')) {
				console.log("同意");
				type = 1;
				CircleMemberManage(type, userId);
			} else if(Zepto(e.target).hasClass('refuse')) {
				console.log("拒绝");
				type = 3;
				CircleMemberManage(type, userId);
			}
			//		if(Zepto(e.target).text() == '同意') {
			//			type = 1;
			//			CircleMemberManage(type,userId);
			//		} else if(Zepto(e.target).text() == '拒绝') {
			//			type = 3;
			//			CircleMemberManage(type,userId);
			//		}
		}

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
			mTargetListItemClickStr: "li",
			mGetDataOffLineFunc: null,
			ajaxSetting: {
				accepts: {
					json: "application/json;charset=utf-8"
				},
				contentType: "application/json",
				//头部heads，用于过滤头部信息，判断请求之前是否需要验证规则（比如登录）
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
	function CircleMemberManage(type, userId) {
		//var url = config.MockServerUrl + 'studycircle/pendingAuditOperation';
		//var url = config.PCServerUrl + 'CircleMemberManage';
		var url = config.JServerUrl + 'circle/mobile/circle/CircleMemberManage';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: userId,
			type: type
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				UIUtil.toast(response.description);
				WindowUtil.firePageEvent('szpark_pending_audit_management_list.html', 'refreshListPage');
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};

});