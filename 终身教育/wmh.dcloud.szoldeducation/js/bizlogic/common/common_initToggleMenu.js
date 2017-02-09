/**
 * 描述 :由于多出用到这种弹出下拉菜单样式，这种效果全部封装在这个工具类当中 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-14 09:25:58
 */

define(function(require, exports, module) {
	//声明变量
	var busying = false;
	var menuWrapper = null;
	var menu = null;
	var menuWrapperClassList = null;
	var backdrop = null;
	/**
	 * @description 初始化下拉菜单样式
	 * @param show-menu-btn 显示菜单样式按钮，DOM
	 */

	exports.initToggleMenu = function(showMenuBtn) {
		//菜单包裹层
		menuWrapper = document.getElementById("menu-wrapper");
		//具体菜单
		menu = document.getElementById("menu");
		//获取包裹层下的所有类class节点
		menuWrapperClassList = menuWrapper.classList;
		//点击该Dom,隐藏菜单显示，一般认为这是遮罩层，并且给遮罩层设置监听
		backdrop = document.getElementById("menu-backdrop");
		backdrop.addEventListener('tap', toggleMenu);
		//用来显示下拉菜单样式的外部监听事件。只需传入对应的id即可。
		document.getElementById(showMenuBtn).addEventListener('tap', toggleMenu);
	};
	/**
	 * @description 初始化下拉菜单样式
	 * @param 无
	 */
	function toggleMenu() {
		if (busying) {
			return;
		}
		busying = true;
		if (menuWrapperClassList.contains('mui-active')) {
			console.log("关闭");
			exports.menu_close();
		} else {
			console.log("打开");
			exports.menu_open();
		}
		setTimeout(function() {
			busying = false;
		}, 500);
	};
	//打开
	exports.menu_open = function() {
		document.body.classList.add('menu-open');
		menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
		menu.className = 'menu bounce-in-down animated';
		backdrop.style.opacity = 1;
	};
	//关闭
	exports.menu_close = function() {
		document.body.classList.remove('menu-open');
		menuWrapper.className = 'menu-wrapper fade-out-up animated';
		menu.className = 'menu bounce-out-up animated';
		setTimeout(function() {
			backdrop.style.opacity = 0;
			menuWrapper.classList.add('hidden');
		}, 500);
	};

	//监听打开
	window.addEventListener('menu-open', exports.menu_open);
	//监听关闭
	window.addEventListener('menu-open', exports.menu_close);
	//TODO 结束标记

});