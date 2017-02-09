/**
 * 描述 :我的笔记列表 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-11 13:43:55
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil=require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var secretKey = '';
	var userId = '';
	var userName = '';
	var id = '';
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
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
	//我的笔记和最新笔记切换(暂时先不要)
	//Zepto('.newly-note').on('tap', 'span', function() {
	//Zepto(this).addClass('newly-review-span-active').siblings().removeClass('newly-review-span-active');
	//});
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */

	//获取笔记模板
	function getLitemplate() {
		//var litemplate = '<li id="{{id}}" class="mui-table-view-cell myNoteItem"><div class="myNoteItemDiv"><img class="timeIcon" src="../../img/studyCircle/img_public_service.png" width="12px" height="12px" /><div class="NoteNoteTime"><span class="sanjiaoxin"></span><span class="NoteNoteTimeText">{{playRecordTime}}</span></div><div class="NoteNoteUserName"></div><div class="NoteNoteContent">{{content}}</div><div class="NoteNoteDateZan"><div class="NoteNoteDate">{{createNoteTime}}</div></div></div></li>';
		var litemplate = '<li id="{{id}}" class="clearfix"><div class="mui-clearfix"><span class="clock-icon"></span><span class="comment-time">{{playRecordTime}}</span></div><div class="note-content">{{content}}</div><div class="clearfix"><span class="note-year">{{createNoteTime}}</span></div></li>';
		return litemplate;
	}

	//获取笔记接口
	function getUrl() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
		return url;
	}

	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		var data = {
			pageIndex: CurrPage,
			pageSize: PageSize,
			id: id,
			userId: userId
		}
		requestData = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		//console.log('请求参数' + requestData);
		return requestData;
	}

	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		//console.log("改变数据 ：" + JSON.stringify(response));
		//定义临时数组
		var tempArray = [];
		var response = CommonUtil.handleStandardResponse(response, '1');
		if(response.code == 1) {
			tempArray = response.data;
			//console.log("笔记的相应参数" + JSON.stringify(tempArray));
			totalNumCount = response.totalCount;
		}
		return tempArray;
	}

	/*
	 * @description 列表点击事件（笔记点赞）
	 */
	function onItemClickCallbackFunc(e) {

	};

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
	};

	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
		IsDebug: true,
		//下拉有关
		down: {
			height: 30
		},
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