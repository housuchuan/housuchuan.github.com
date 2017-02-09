/**
 * 描述 :调用圈子动态子界面
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-13 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	//加载窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//获取圈子唯一circleId
		var circleId = WindowUtil.getExtraDataByKey("circleId");
		//子页面
		var PageArray = [{
			url: 'szpark_circle_dynamics_list.html', //下拉刷新内容页面地址
			id: 'szpark_circle_dynamics_list.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0', //其它参数定义
				left: '0',
				right: '0'
			},
			extras: {
				circleId: circleId //圈子id
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
});