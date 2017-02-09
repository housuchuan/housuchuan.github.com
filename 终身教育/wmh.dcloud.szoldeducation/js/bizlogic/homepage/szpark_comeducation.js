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
		var Options = [{
			url: 'szpark_comeducationlist.html',
			id: 'szpark_comeducationlist.html',
			styles: {
				top: '44px',
				bottom: '0px'
			},
			extras: {
				CateNum: catenum
			}
		}];
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
		//开始判断设备
		if (CommonUtil.os.plus) {
			if (UserAgentUtil.ANDROID_PAD() || UserAgentUtil.IOS_IPAD()) {
				//pad和ipad
				console.log("pad版本");
				//plus.screen.lockOrientation("landscape-primary");
				WindowUtil.createSubWins(Options_PAD, true);
			} else {
				//android手机和iPhone手机
				WindowUtil.createSubWins(Options, true);
			}
		} else {
			//非plus,针对手机浏览器
			WindowUtil.createSubWins(Options, true);
		}
	})
});