/**
 * 描述 :练习题  
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-10-27 10:06:48
 */

define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var Tools = require('bizlogic/resourceCenter/resource_center_view_video_Util.js')
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PageSize = 10;
	var totalNumCount = 0;
	var resourceId = '',
		courseGuid = '',
		type = '',
		userId = '',
		userName = ''; //0视频1文档
	var secretKey = '';
	var answerIddArray = '',
		idArray = '',
		answerArray = [];
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//获取缓存信息;
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		//区域滚动
		resourceId = WindowUtil.getExtraDataByKey('resourceId');
		courseGuid = WindowUtil.getExtraDataByKey('courseGuid');
		initQuestionList();
	};

	/**
	 * @description 初始化问题列表
	 */
	function initQuestionList() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/edu/questionsList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/questionsList';
		var requestData = {};
		var data = {
			resourceId: resourceId,
			pageIndex: 1,
			pageSize: 1000
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				var tempInfo = response.data;
				//var litemplate = '<li id="{{id}}"><div class="problem"><span>{{index}}、</span><span>{{title}}</span><span class="frame">(&nbsp;&nbsp;&nbsp;<span class="number"></span>&nbsp;&nbsp;&nbsp;)</span></div><div class="choice"></div></li>';
				var litemplateInner = '<div id="{{id}}" class="rowGuid"><span id="choice">{{choice}}</span><span>{{choiceSection}}</span></div>';
				var output = '';
				mui.each(tempInfo, function(key, value) {
					output += '<li id="' + value.id + '"><div class="problem"><span>' + (key + 1) + '、</span><span>' + value.title + '</span><span class="frame">(&nbsp;&nbsp;&nbsp;<span class="number"></span>&nbsp;&nbsp;&nbsp;)</span></div><div class="choice">';
					var tempInfoInner = value.choiceList;
					var output2 = '';
					mui.each(tempInfoInner, function(key, value) {
						output2 += Mustache.render(litemplateInner, value);
					});
					output += output2;
					output += '</div></li>';
				});
				Zepto('.mui-table-view').html('');
				Zepto('.mui-table-view').append(output);
			};
			//区域滚动
			mui(".mui-scroll-wrapper").scroll({
				indicators: false, //是否显示滚动条
				deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			//选择答案
			Zepto('.mui-table-view li .choice').on('tap', 'div', function() {
				var _this = Zepto(this);
				var choice = _this.children('span:first-child').text();
				_this.parents('li').find('.number').text(choice);
				_this.find('span:first-child').css('background-color', '#187bc2');
				_this.siblings().find('span:first-child').css('background-color', '#b3b3b3');
			});
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 提交答案
	 */
	function submitAnswer() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/edu/answerApply';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/answerApply';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			questionGuid: idArray,
			answerArray: answerIddArray,
			resourceId: resourceId,
			userId: userId,
			userName: userName,
			courseGuid: courseGuid
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxxxx" + url);
		console.log("xxxxxxxxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			console.log("xxxxxxxxxxxx"+JSON.stringify(response));
			if(response.code == 1) {
				//全部正确才是1 否则都是0
				if(response.data) {
					//UIUtil.toast(response.data.description);
					if(response.data.isAllRight) {
						if(response.data.isAllRight == 1) {
							Tools.ajaxAddIntegral({
								userId: userId,
								userName: userName,
								resourceId: resourceId,
								courseGuid: courseGuid
							});
						} else {
							UIUtil.toast('答案错误，请重新答题');
							//什么都不做，如果有错题，让后台提示有错重新答题
						};
					}
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//获取答案数组
	function popAnswerList() {
		answerArray = [];
		var answerList = Zepto('.mui-table-view li');
		mui.each(answerList, function(key, value) {
			var answer = Zepto(value).find('.number').text();
			if(!answer) {
				//不存在答案，则返回0
				answerArray.push(0);
			} else {
				var _this = Zepto(value).find('.rowGuid');
				for(var i = 0; i < _this.length; i++) {
					if(Zepto(_this[i]).find('#choice').text() == answer) {
						var answerId = Zepto(_this[i]).attr('id');
						answerArray.push(answerId);
					}
				}
			};
		});
		return answerArray;
	};

	Zepto('.mui-btn-block').on('tap', function() {
		idArray = '';
		answerIddArray = '';
		var restAnswerList = [];
		answerArray = popAnswerList();
		for(var i = 0; i < answerArray.length; i++) {
			answerIddArray += answerArray[i] + ',';
		};
		mui.each(answerArray, function(key, value) {
			if(!value) {
				//将未填的题目放到数组中进行判断
				restAnswerList.push(key);
			};
		});
		//判断是否漏题
		if(restAnswerList.length > 0) {
			mui.alert('您还有' + (restAnswerList.length) + '题没写，请填写完成后提交');
		} else {
			var idList = Zepto('.mui-table-view li');
			mui.each(idList, function(key, value) {
				idArray += Zepto(value).attr('id') + ',';
			});
			//提交答案
			submitAnswer();
		}
	});
});