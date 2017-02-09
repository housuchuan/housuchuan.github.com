/**
 * 描述 : 评论列表
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-11 13:43:55
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil=require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = '';
	var userId = '';
	var userName = '';
	var id = '';
	var IsPraise = [];
	var pullToRefreshObject;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//初始化个人信息数据
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//监听父页面视频id
		id = WindowUtil.getExtraDataByKey('id');
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
	}

	/*
	 * 评论
	 */
	function getLitemplate() {
		var litemplate = '<li id="{{id}}" class="clearfix"><img src="{{image}}"/><div class="user-review-newlyInfo"><div class="mui-ellipsis clearfix"><span class="user-name">{{nick}}</span><span class="user-praise">{{praise}}赞</span><div class="praise-icon"></div></div><span class="time-records">{{date}}</span><div>{{comment}}</div></div></li>';
		return litemplate;
	}

	function getUrl() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
		//console.log("url" + url);
		return url;
	}

	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		//动态校验字段
		var data = {
			pageIndex: CurrPage,
			pageSize: PageSize,
			id: id,
			userId: userId
		};
		requestData = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		//console.log('评价请求参数' + requestData);
		return requestData;
	}

	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		//console.log("评价改变数据 ：" + JSON.stringify(response));
		//定义临时数组
		var tempArray = [];
		var response = CommonUtil.handleStandardResponse(response, '1');
		if(response.code == 1) {
			console.log("response00000000000" + JSON.stringify(response));
			tempArray = response.data;
			totalNumCount = response.totalCount;
			mui.each(tempArray, function(key, value) {
				if(value.isPraise == 0) {
					//什么都不做
				} else if(value.isPraise == 1) {
					//console.log("key"+key);
					IsPraise.push(key);
					//Zepto('.zanBorder').addClass('zanBorder-active');
				}
			})
		}
		return tempArray;
	}

	/**
	 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
	 */
	function changeToltalCountFunc() {
		//console.log("总记录数：" + totalNumCount);
		return totalNumCount;
	}

	/**
	 * @description 成功回调
	 * @param {Object} response
	 */
	function successCallbackFunc(response) {
		//console.log("成功请求数据：" + JSON.stringify(response));
		//console.log("已经点赞的Li的index" + IsPraise);
		for(var i = 0; i < IsPraise.length; i++) {
			Zepto('.review-notes-content li').eq(IsPraise[i]).find('.praise-icon').addClass('praise-icon-active');
		};
	};

	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var type = 0; //取消点赞为0，点赞为1
		var commentId = this.id;
		//点赞
		if(Zepto(e.target).hasClass('user-praise') || Zepto(e.target).hasClass('praise-icon')) {
			var text = Zepto(this).find('.user-praise').text();
			var number = parseInt(text.substr(0,text.length-1));
			console.log("number"+number);
			var _this = Zepto(this).find('.praise-icon');
			if(_this.hasClass('praise-icon-active')) {
				_this.removeClass('praise-icon-active');
				type = 0;
				var currentNum = number - 1;
				//console.log(currentNum);
				Zepto(this).find('.user-praise').text(currentNum+'赞');
				ajaxPraiseSubmit(commentId, type);
			} else {
				var currentNum = number + 1;
				_this.addClass('praise-icon-active');
				type = 1;
				//console.log(currentNum);
				Zepto(this).find('.user-praise').text(currentNum+'赞');
				ajaxPraiseSubmit(commentId, type);
			}
		}
	};

	/**
	 * @description 点赞数据提交
	 */
	function ajaxPraiseSubmit(commentId, type) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: commentId,
			type: type,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//console.log("1");
				//console.log("赞的响应参数" + JSON.stringify(response));
				//UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 获取视频评论列表数据
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		down: {
			height: 45
		},
		indicators: false, //是否显示滚动条
		//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
		mDefaultInitPageNum: 1,
		mGetLitemplate: getLitemplate,
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
	
});