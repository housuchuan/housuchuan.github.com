/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil=require('core/MobileFrame/WindowUtil.js');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var type = 0; //0表示点播，1表示直播，默认初始情况下为0
	CommonUtil.initReady(initData);

	function initData() {
		//子页面
		var Options = [{
			url: 'resource_center_dianbo_list_pad.html',
			id: 'resource_center_dianbo_list_pad.html',
			styles: {
				top: '44px',
				bottom: '72px'
			},
			extras: {
				type: type
			}
		}, {
			url: 'resource_center_qualification_certification_pad.html',
			id: 'resource_center_qualification_certification_pad.html',
			styles: {
				top: '44px',
				bottom: '72px'
			}
		}];
		WindowUtil.createSubWins(Options, true);
	};
	//点击导航，切换每一项
	Zepto('.mui-tab-item').on('tap', function() {
		var title = Zepto(this).children('.mui-tab-label').text();
		Zepto('.mui-title').text('');
		if(title == '点播') {
			console.log("点播");
			changePageShow('resource_center_dianbo_list_pad.html');
			Zepto('.mui-title').text(title);
			type = 0;
			WindowUtil.firePageEvent('resource_center_dianbo_list_pad.html', 'viewTypeListener', {
				type: type
			});
		}
		if(title == '直播') {
			console.log("直播");
			changePageShow('resource_center_dianbo_list_pad.html');
			Zepto('.mui-title').text(title);
			type = 1;
			WindowUtil.firePageEvent('resource_center_dianbo_list_pad.html', 'viewTypeListener', {
				type: type
			});
		}
		if(title == '职业资格认证与培训') {
			changePageShow('resource_center_qualification_certification_pad.html');
			Zepto('.mui-title').text(title);
			Zepto("#topDivBorder").hide();
			Zepto("#beginSearch").hide();
		}
	});

	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['resource_center_dianbo_list_pad.html', 'resource_center_qualification_certification_pad.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i])
			}
		}
	};
	
	//打开搜索页面
	Zepto("#beginSearch").on("tap", function() {
		WindowUtil.createWin('resource_center_search_pad.html', 'resource_center_search_pad.html', {
			type: type
		});
	});
});