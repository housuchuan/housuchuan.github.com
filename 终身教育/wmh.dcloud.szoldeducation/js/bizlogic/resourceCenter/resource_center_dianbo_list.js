/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var Tools = require('bizlogic/resourceCenter/resource_center_common_util.js');
	var PageSize = 10000;
	var type = null;
	var CurrPage = 1;
	//用户信息
	//var secretKey = config.secretKey;
	var secretKey = "";
	var userId = "";
	var userName = "";
	var ServerUrl = config.JServerUrl;
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
		type = WindowUtil.getExtraDataByKey('type');
		getBcloudOrBliveTypeList(type);
	});

	/**
	 * 监听点播按钮
	 */
	window.addEventListener('viewTypeListener', function(e) {
		type = e.detail.type;
		getBcloudOrBliveTypeList(type);
	});

	/**
	 * @description 分类列表请求数据
	 */
	function getBcloudOrBliveTypeList(type) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/columnCourceList';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/columnCourceList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: type,
			pageIndex: CurrPage,
			pageSize: PageSize
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		//console.log(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			//console.log("获取首页数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				var html = Tools.generateBcloudHtml(tempInfo);
				Zepto('.list-container').html('');
				Zepto('.list-container').append(html);
				mui.each(tempInfo, function(key, value) {
					if(value.column) {
						//console.log("key"+key);
						Zepto('.list-container li').eq(key).find('.courseName').css('margin-top', '-30px');
					}
				});
				//console.log("xxxxxxxxxxxx"+JSON.stringify(tempInfo));
				//随机颜色
				var courseNameIcon = Zepto('#listdata').find('li').find('.courseNameIcon');
				mui.each(courseNameIcon, function(key, value) {
					var randColorArr = ['#fa678a', '#a677ee', '#187bc2'];
					var index = Math.floor((Math.random() * randColorArr.length));
					Zepto(value).css('background-color', randColorArr[index]);
					//console.log("获取每一行颜色" + Zepto(value).attr('background-color'));
				});
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.closeWaiting();
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey, false);
	};

	function getHexBgColor() {
		var str = [];
		var rgb = document.getElementById('color').style.backgroundColor.split('(');
		for(var k = 0; k < 3; k++) {
			str[k] = parseInt(rgb[1].split(',')[k]).toString(16);
		}
		str = '#' + str[0] + str[1] + str[2];
		//console.log("获取背景颜色：" + str);
	}
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//这个下拉刷新不需要请求接口
		mIsRequestFirst: false,
		IsRendLitemplateAuto: false,
		refreshCallback: function() {
			//下拉刷新 重新请求数据
			getBcloudOrBliveTypeList(type);
		},
		pullUpLoadType: 'none',
		ajaxSetting: {
			//默认的contentType
			contentType: "application/json",
			headers: {
				"X-SecretKey": secretKey
			}
		}
	});

	//点击一级类别，跳转类别基本信息页面
	Zepto("#listdata").on('tap', 'li,li span', function(e) {
		var ClassifyId = this.id;
		var ClassifyIdText = Zepto(this).text();
		//console.log("ClassifyId1" + ClassifyIdText);
		var data = {
			ClassifyId: ClassifyId,
			secondLevelText: ClassifyIdText,
			type: type,
			bgColor: Zepto(Zepto(e.target)).parents('li').find('.courseNameIcon').css('background-color')
		};
		//console.log(Zepto(e.target));
		//console.log(ClassifyId+''+Zepto(Zepto(e.target)).parents('li').find('.courseNameIcon').css('background-color'));
		//console.log('父页面'+JSON.stringify(data));
		WindowUtil.createWin('resource_center_course_info.html', 'resource_center_course_info.html', {
			data: JSON.stringify(data)
		});
	});

});