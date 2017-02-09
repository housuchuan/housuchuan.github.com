/**
 * 描述 :你问我答pad版父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-05-24 09:18:03
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_askandanswer_list.html', //下拉刷新内容页面地址
			id: 'szpark_askandanswer_list.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}
	/**
	 * 1:你问我答 2：咨询答疑 3：家长问答
	 * 1.你问我答【b59def25-3da4-4920-b81f-f6eab30f9eec】
	 * 2.咨询答疑【882c5330-19d8-4068-9616-1fcde57f0ff0】
	 * 3.家长问答【920e4e89-4e8c-442d-a703-56c7e1c7120b】
	 */
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_askandanswer_submit.html', '../askandanswer/szpark_askandanswer_submit.html', {
			BoxGuid: "b59def25-3da4-4920-b81f-f6eab30f9eec",
			Title: "你问我答"
		});
	});
});