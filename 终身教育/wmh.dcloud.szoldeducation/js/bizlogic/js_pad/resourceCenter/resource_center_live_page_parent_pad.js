/**
 * 描述 :研习圈直播页面pad版本 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-10 18:40:30
 */

define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/EpointMobile_szoldeducation/DeployMobileBrowser/wmh.dcloud.szoldeducation/html/html_pad/resourceCenter/resource_center_live_pageShow_pad.html', //下拉刷新内容页面地址
//			url: 'resource_center_live_pageShow_pad.html',
			id: 'resource_center_live_pageShow_pad.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			},
			extras: {
				itemId: WindowUtil.getExtraDataByKey('itemId')
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
});