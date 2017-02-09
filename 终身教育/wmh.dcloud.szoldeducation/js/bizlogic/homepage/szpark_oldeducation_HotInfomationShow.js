/**
 * 描述 :热门资讯 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 17:49:20
 */
define(function(require, exports, module) {
	"use strict"
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var HotInfoURL = "http://www.sipedu.org";
	CommonUtil.initReady(function() {
		var Title = WindowUtil.getExtraDataByKey("Title");
		Zepto(".mui-title").text(Title);
		HotInfoURL = WindowUtil.getExtraDataByKey("HotInfoURL");
		//判断返回的链接是不是包含http头部，如果有，直接打开，没有加上前面协议名称
		if(HotInfoURL&&HotInfoURL.indexOf("http")<0){
			HotInfoURL="http://"+HotInfoURL;
		}
		var Options = [{
			url: HotInfoURL,
			id: "HotInfoURL",
			styles: {
				top: '40px',
				bottom: '0px'
			}
		}]
		WindowUtil.createSubWins(Options, true);
	});

});