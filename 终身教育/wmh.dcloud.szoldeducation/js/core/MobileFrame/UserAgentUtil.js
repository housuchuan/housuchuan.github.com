/**
 * 描述 :网站在适配时通过User  Agent(用户代理，以下简称UA)
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-16 17:49:20
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var ua=navigator.userAgent;
	exports.ANDROID_PAD = function() {
		//console.log("ua"+ua);
		//默认android手机pad类型true;
		var ANDROID_PAD = false;
		if (CommonUtil.os.android) {
			if (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1) {
				ANDROID_PAD = false;
			} else {
				ANDROID_PAD = true;
			}
		}
		return ANDROID_PAD;
	};
	
	exports.IOS_IPAD=function(){
		//console.log("ua"+ua);
		//默认ios手机类型false
		var IOS_IPAD=false;
		if(CommonUtil.os.ios){
			if(ua.indexOf('iPad') > -1){
				IOS_IPAD=true;
			}else{
				IOS_IPAD=false;
			}
		}
		return  IOS_IPAD;
	}
});