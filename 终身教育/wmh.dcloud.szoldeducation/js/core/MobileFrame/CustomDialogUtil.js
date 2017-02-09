/**
 * 描述 :自定义制作通用动画面板对话框,该需求灵感来自园区app
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-08-31 13:42:56
 * 具体使用方法：
 * （1）可以通过为 showCustomDialog/hideCustomDialog,必须成对使用该方法。
 * （2）通用方法指定一个特效来动画显示/隐藏对话框。
 * （3）您必须为想使用的特效引用独立的特效文件common_animate.css
 */
define(function(require, exports, module) {
	/**
	 * @description 显示对话框
	 * @param {Object} panelId 面板ID,需要传一个面板的id(一般为div)
	 */
	exports.showCustomDialog = function(panelId) {
		document.getElementById("zhezhao-area").style.display = 'block';
		document.getElementById(panelId).style.display = 'block';
		if(Zepto('#' + panelId).hasClass('add-hide')) {
			Zepto('#' + panelId).removeClass('add-hide');
			Zepto('#' + panelId).addClass('add-show');
		} else {
			Zepto('#' + panelId).addClass('add-show');
		}
	};
	/**
	 * @description 隐藏对话框
	 * @param {Object} panelId 面板ID,需要传一个面板的id(一般为div)
	 */
	exports.hideCustomDialog = function(panelId) {
		if(Zepto('#' + panelId).hasClass('add-show')) {
			Zepto('#' + panelId).removeClass('add-show');
			Zepto('#' + panelId).addClass('add-hide');
		}
		document.getElementById("zhezhao-area").style.display = 'none';
	};
});