/**
 * 描述 : 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict";
	//引入窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var EchartsUtil = require('core/MobileFrame/EchartsUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	/**图表的填充数据，工具类约束的必须是json数组，特殊情况下，与接口人员约定返回的图表数据形式*/
	var chartData = [];
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var yearData;
	//初始化echarts图表
	CommonUtil.initReady(function() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		var date = new Date();
		yearData = date.getFullYear()+'年';
		Zepto('#showUserPicker').text(yearData);
		ajaxDetailData();
	});

	//选择获取积分日期
	Zepto(".year-date").on('tap', function() {
		var userPicker = new mui.PopPicker();
		var relData = [];
		var yearJson = {};
		var s1 = parseInt(new Date().getFullYear());
		//封装的话动态传一个i进去
		for (var i = 0; i <20; i++) {
			yearJson = {};
			yearJson["value"] = s1-i;
			yearJson["text"] = (s1-i)+'年';
			relData.push(yearJson);
		};
		//模拟数据
		userPicker.setData(relData);
		userPicker.show(function(items) {
			//console.log("" + JSON.stringify(items[0]));
			//if(items[0].value == "2010") {
			yearData = items[0].value;
			document.getElementById("showUserPicker").innerText = items[0].text;
			ajaxDetailData();
		});
	});

	/**
	 *@description学习档案详细信息
	 */
	function ajaxDetailData() {
		//var url = config.MockServerUrl + "mystudy/studyFilesInfo";
		var url = config.JServerUrl + "mystudy/studyFilesInfo";
		var requestData = {
			userId: userId,
			yearData: parseInt(yearData)   //年份
		};
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxx"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log(JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var litemplate = '<div class="topLayerItem"><h5>在线学习时长</h5><h4>{{studyTime}}时</h4></div><div class="topLayerItem"><h5>获得学习积分</h5><h4>{{myIntegral}}</h4></div>';
				var tmpInfo = response.data;
				//图表数据
				chartData = tmpInfo.chartData;
				console.error('echarts数据为'+JSON.stringify(chartData))
				//循环遍历；加"月"
				mui.each(chartData, function(key, value) {
					value.name = (key + 1) + '月';
					if(!value.value){
						value.value = 0;
					};
					if (!value.time) {
						value.time = 0;
					}
				});
				//判断学习时长和我的积分
				if(!tmpInfo.studyTime) {
					tmpInfo.studyTime = 0;
				} else if(!tmpInfo.myIntegral) {
					tmpInfo.myIntegral = 0;
				}
				Zepto('.topLayer').html('');
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.topLayer').append(output);
				//映射图表
				//初始化生成柱状图表
				var options = {
					dom: 'barChart',
					chartType: 'bar',
					chartData: chartData,
					theme: null
				};
				EchartsUtil.setOption(options);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});