/**
 * 描述 :机构详情页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-11 16:16:53
 */
define(function(require, exports, module) {
	"use strict"
	var url = config.ServerUrl;
	//加载窗体模块
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//信息唯一GUID
	var InfoID = null;
	//信息栏目编号
	var CateNum = null;
	var URL = null;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		URL = WindowUtil.getExtraDataByKey("URL");
		if (URL.indexOf("http") < 0) {
			URL = "http://" + URL;
		}
		var Title = WindowUtil.getExtraDataByKey("Title");
		Zepto(".mui-title").text(Title);
		//子页面
		var PageArray = [{
			url: URL, //下拉刷新内容页面地址
			id: URL, //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}

});