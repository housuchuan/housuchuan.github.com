/**
 * 作者: housc
 * 时间: 2017-01-17
 * 描述: 窗口切换模块
 */
define(function(require,exports,module){
    "use strict";
	var CommonTools = require('CommonTools_Core');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'css/libs/mui.previewimage.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.zoom.js',
			'js/libs/mui.previewimage.js'
		], function() {
			//给图片绑定预览功能
			mui.previewImage();
		});

	}
});