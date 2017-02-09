/**
 * 作者：dailc 
 * 时间：2016-04-07 10:25:38
 * 描述： 家长问答父页面 
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var BoxGuid = null;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_parentAskAnswer_list.html', //下拉刷新内容页面地址
			id: 'szpark_parentAskAnswer_list.html', //内容页面标志
			styles: {
				top: '44px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
	}

	//plus状态下，自定义监听事件刷新回调传过来的BoxGuid
	window.addEventListener('getBoxGuidEvent', function(e) {
		if (e.detail.BoxGuid) {
			BoxGuid = e.detail.BoxGuid;
		}
	});
	//浏览器触发子页面刷新回调传过来的BoxGuid
	window.getBoxGuidCB=function(msg){
		//console.log("家长问答     BoxGuid"+msg.BoxGuid);
		BoxGuid=msg.BoxGuid
	}
	
	//添加家长问答
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_askandanswer_submit.html', '../askandanswer/szpark_askandanswer_submit.html', {
			BoxGuid: "920e4e89-4e8c-442d-a703-56c7e1c7120b",
			Title:"家长问答"
		});
	});
});