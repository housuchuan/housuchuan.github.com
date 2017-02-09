/**
 * 描述 :调查问卷父页面[用于pad版页面] 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-05-24 09:18:03
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_investigation_list.html', //下拉刷新内容页面地址
			id: 'szpark_investigation_list.html_pad', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	};
});