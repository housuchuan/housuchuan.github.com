/**
 * 描述 :事项服务页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-11-23
 */
define(function(require, exports, module) {
	"use strict"
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/core/sea.min.js'
		], function() {
			//区域滚动
			//区域滚动
			mui(".mui-scroll-wrapper").scroll({
				indicators: false, //是否显示滚动条
				deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			//机动车违法
			logInit('invaildPlay', '#e53e30', 'HOT');
			//诊疗挂号
			logInit('medicine', '#e53e30', 'NEW');
			//将监听事件绑定window对象上
			window.initListenter = initListenter;
		});
	};

	/*
	 * @description bgcolor:绘制图形背景填充颜色
	 * @description text:绘制图形内部填充文字
	 */
	var logInit = function(Dom, bgcolor, text) {
		var canvasDom = document.getElementById(Dom);
		var canvasObj = canvasDom.getContext('2d');
		canvasObj.beginPath();
		canvasObj.moveTo(0, 0);
		canvasObj.lineTo(35, 0);
		canvasObj.lineTo(0, 35);
		canvasObj.lineTo(0, 0);
		canvasObj.fillStyle = bgcolor;
		canvasObj.fill();
		canvasObj.fillStyle = '#fff';
		canvasObj.strokeStyle = bgcolor;
		canvasObj.stroke();
		canvasObj.font = '16px';
		canvasObj.fillText(text, 2, 12);
	};

	var initListenter = function(url) {
		ejs.page.openPage(url, '便民服务', {}, {
			"requestCode": 1101,
			"finishAfterOpen": '1',
			"nbRightText": "",
			"nbRightImage": "",
			"showBackButton": true,
			"showLoadProgress": false,
			"autoHideLoading": true,
			"showNavigation": false,
			"showSearchBar": false,
			"isListenerNBBack": false,
			"isListenerSysBack": false,
			"orientation": '1',
			"hrefEnable": true,
			"customAPIPath": "com.epoint.JSbridgeCustom"
		});
	};

});