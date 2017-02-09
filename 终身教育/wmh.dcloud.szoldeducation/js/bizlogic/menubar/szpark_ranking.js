/**
 * 描述 :积分排行交互子页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-27 11:42:49
 */

define(function(require, exports, module) {
	"use strict"
	//引入窗口模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);

	function initData() {
		//获取当前时间,NEW对象
		var date = new Date();
		//子页面
		var PageArray = [{
			url: 'szpark_ranking_list.html', //下拉刷新内容页面地址
			id: 'szpark_ranking_list.html', //内容页面标志
			styles: {
				top: '95px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			},
			extras: {
				year: date.getFullYear(),
				month: date.getMonth()+1
			}
		}];
		WindowUtil.createSubWins(PageArray);
		
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		document.getElementById('now-date').innerHTML = (year+'年'+month+'月');
	};
});