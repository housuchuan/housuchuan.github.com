/**
 * 描述 :我的消息 子页面嵌入 
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-08-13 11:42:49
 */
define(function(require, exports, module) {
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);

	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_message_center_list.html', //下拉刷新内容页面地址
			id: 'szpark_message_center_list.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
});