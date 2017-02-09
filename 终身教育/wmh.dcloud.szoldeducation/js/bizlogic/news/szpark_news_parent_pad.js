/**
 * 描述 :学历教育父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-05-24 09:18:03
 */
define(function(require, exports, module) {
	"use strict"
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: '../news/szpark_news_pad_list.html',
			id: 'szpark_news_pad_list.html',
			styles: {
				top: '44px',
				bottom: '0px'
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
});