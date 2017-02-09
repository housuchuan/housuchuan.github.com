/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var type = 0; //0表示点播，1表示直播，默认初始情况下为0
	CommonUtil.initReady(initData);

	function initData() {
		//子页面
		var Options = [{
			url: 'resource_center_dianbo_list.html',
			id: 'resource_center_dianbo_list.html',
			styles: {
				top: '130px',
				bottom: '52px'
			},
			extras: {
				type: type
			}
		}, {
			url: 'resource_center_qualification_certification.html',
			id: 'resource_center_qualification_certification.html',
			styles: {
				top: '44px',
				bottom: '52px'
			}
		}];
		WindowUtil.createSubWins(Options, true);
	}
	Zepto('.mui-tab-item').on('tap', function() {
		var title = Zepto(this).children('.mui-tab-label').text();
		Zepto('.mui-title').text('');
		if(title == '点播') {
			changePageShow("resource_center_dianbo_list.html");
			Zepto('.mui-title').text(title);
			type = 0;
			Zepto("#topDivBorder").show();
			Zepto("#beginSearch").show();
		}
		if(title == '直播') {
			changePageShow("resource_center_dianbo_list.html");
			Zepto('.mui-title').text(title);
			type = 1;
			Zepto("#topDivBorder").show();
			Zepto("#beginSearch").show();
		}
		if(title == '职业资格认证与培训') {
			changePageShow("resource_center_qualification_certification.html");
			Zepto('.mui-title').text(title);
			Zepto("#topDivBorder").hide();
			Zepto("#beginSearch").hide();
		}
		WindowUtil.firePageEvent('resource_center_dianbo_list.html', 'viewTypeListener', {
			type: type
		});
	});
	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['resource_center_dianbo_list.html', 'resource_center_qualification_certification.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i])
			}
		}
	};
	
	Zepto("#beginSearch").on("tap", function() {
		WindowUtil.createWin('resource_center_search.html', 'resource_center_search.html', {
			type: type
		});
	});
});