/**
 * 描述 :举报管理--列表页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-21 17:11:49
 */

define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//每页显示条数
	var PageSize = 10;
	var userId = '';
	var userIdData;
	//列表总记录数
	var totalNumCount = 0;
	var circleId;
	var secretKey = "";
	var repoterId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		circleId = WindowUtil.getExtraDataByKey("circleId");
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//初始化下拉刷新
		initPullRefreshList();
	});
	//初始化下拉刷新
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
				circleid: circleId, //举报内容圈子id
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
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1)
			if(response.code == "1") {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+JSON.stringify(tempArray));
				//console.log(JSON.stringify(tempArray));
				mui.each(tempArray,function(key,value){
					value.reason = unescape(value.reason);
					value.content = unescape(value.content);
					value.type = unescape(value.type);
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
			}
			/**
			 * @description 成功回调
			 * @param {Object} response
			 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
		};
		//接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'studycircle/tip';
			//var url = config.PCServerUrl + 'CircleReportList';
			var url = config.JServerUrl + 'circle/mobile/manager/tip';
			return url;
		};
		//映射模板
		var getLitempate = function() {
			var litemplate = '<li id="{{contentId}}"><span class="userId" id="{{userId}}"></span><div class="mui-tip mui-ellipsis clearfix"><span style="display:none" class="reason">{{reason}}</span><span class="reporter">{{nick}}</span><span class="topicName">{{content}}</span><br/><span class="section-type">内容类型：</span><span class="section-type type">{{type}}</span><br/><span class="section-report">举报时间：</span><span class="section-report time">{{time}}</span><button type="button" class="mui-btn ignore">忽略</button><button type="button" class="mui-btn shield">屏蔽</button></div></li>';
			return litemplate;
		};
		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			var contentId = this.id; //举报内容ID
			repoterId = Zepto(this).find('.userId').attr('id');
			//console.log(contentId);
			var type = Zepto(this).find(".type").text(); //举报内容类型
			if(type == "话题") {
				type = 1; //type=1话题 
			} else if(type == "评论") {
				type = 2; //type=2评论
			}
			if(Zepto(e.target).hasClass("shield")) {
				//操作状态
				//1.什么都不做（数据库默认状态）
				//2：（屏蔽）删除对应的被举报信息 
				//3：忽略举报信息,对被举报信息不进行处理
				Zepto(this).remove('li');
				shieldAndignore(contentId, type, 2);
			} else if(Zepto(e.target).hasClass("ignore")) {
				Zepto(this).remove('li');
				shieldAndignore(contentId, type, 3)
			} else {
				var info = {
					contentId: contentId,
					nick: Zepto(this).find('.reporter').text(),
					topicName: Zepto(this).find('.topicName').text(),
					type: Zepto(this).find('.type').text(),
					time: Zepto(this).find('.time').text(),
					reason: Zepto(this).find('.reason').text()
				};
				var userIdData = {
					userId: repoterId
				};
				//console.log(""+info.topicId);
				var objectString = JSON.stringify(info);
				var userIdData = JSON.stringify(userIdData);
				WindowUtil.createWin("szpark_report_details.html", "szpark_report_details.html", {
					info: objectString,
					userIdData: userIdData
				});
			}
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
			mGetDataOffLineFunc: null,
			ajaxSetting: {
				contentType: "application/json",
				headers: {
					"X-SecretKey": secretKey
				}
			}
		});
	};

	//监听刷新列表
	window.addEventListener('refreshList', function() {
		WindowUtil.firePageEvent("szpark_report_management_list.html", "refreshListPage");
	});
	/**
	 * @description 某个圈子的举报信息处理操作（被举报信息屏蔽、举报记录忽略）
	 * @param {Object} contentId 举报内容的ID
	 * @param {Object} type type=1代表被举报的是【话题】   type=2代表被举报的是【评论】
	 * @param {Object} reportStatus 1代表什么都不做  2 代表删除（屏蔽）  3代表（忽略） 
	 */
	function shieldAndignore(contentId, type, reportStatus) {
		//var url = config.MockServerUrl + "studycircle/CircleReportManage";
		//var url = config.PCServerUrl + 'CircleReportManage';
		var url = config.JServerUrl + 'circle/mobile/manager/reportManage';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			userId: repoterId, //新增的举报人的ID
			contentId: contentId,
			type: type,
			reportStatus: reportStatus
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("屏蔽或忽略参数：" + requestData);
		console.log("屏蔽或忽略参数"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("XXXX" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, "0")
				//console.log("XXXX" + JSON.stringify(response));
			if(response.code == "1") {
				mui.alert(response.description);
				//WindowUtil.firePageEvent("szpark_report_management_list.html", "refreshListPage");
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	}

});