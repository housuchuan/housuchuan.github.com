/**
 * 
 * 作者：戴科
 * 时间：2016-04-05
 * 描述：社区教育父页面
 */
define(function(require, exports, module) {
	"use strict"
	var UserAgentUtil = require('core/MobileFrame/UserAgentUtil');
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var catenum = "006";
	CommonUtil.initReady(function() {
		var Options_PAD = [{
			url: 'szpark_comeducationlist_pad.html',
			id: 'szpark_comeducationlist_pad.html',
			styles: {
				top: '44px',
				bottom: '0px'
			},
			extras: {
				CateNum: catenum
			}
		}];
		WindowUtil.createSubWins(Options_PAD, true);
	})
});