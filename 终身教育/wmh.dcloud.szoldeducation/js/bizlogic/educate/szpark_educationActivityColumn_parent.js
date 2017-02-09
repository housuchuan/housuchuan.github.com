 /*
 * 作者 :孙尊路
 * 时间 : 2016-04-06 11:30:22
 * 描述 : 活动专栏父页面
 */
define(function(require, exports, module) {
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_educationActivityColumn_list.html', //下拉刷新内容页面地址
			id: 'szpark_educationActivityColumn_list.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
});