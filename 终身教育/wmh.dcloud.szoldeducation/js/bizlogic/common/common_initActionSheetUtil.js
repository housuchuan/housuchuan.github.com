/**
 * 描述 :公共初始化选项H5模式actionsheet 
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-06-28 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	/**
	 *@description 初始化选项H5模式actionsheet 
	 * actionsheet一般从底部弹出，显示一系列可选择的操作按钮，供用户选择；
	 *@param selectStr 成功回调用户选择的选项(比如：拍照、相册)
	 */
	exports.initActionSheet = function(successCallback) {
		mui('body').on('shown', '.mui-popover', function(e) {
			//console.log('shown', e.detail.id); //detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
			//console.log('hidden', e.detail.id); //detail为当前popover元素
		});
		mui('body').on('tap', '.mui-popover-action li>a', function() {
			var a = this,
				parent;
			//根据点击按钮，反推当前是哪个actionsheet
			for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
				if (parent.classList.contains('mui-popover-action')) {
					break;
				}
			}
			if (successCallback && typeof(successCallback) == 'function') {
				var selectStr = a.innerHTML;
				successCallback(selectStr);
			}
			//关闭actionsheet
			mui('#' + parent.id).popover('toggle');
		});
	}

});