/**
 * 描述 :相册选择列表 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-28 17:11:49
 */
define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//列表点击事件
	Zepto(".mui-table-view-cell").on('tap', function() {
		var photoName = Zepto(this).find(".photo-info").find('span')[0].innerHTML;
		WindowUtil.createWin("szpark_upload_photo.html", "szpark_upload_photo.html", {
			photoName: photoName
		});
	});

});