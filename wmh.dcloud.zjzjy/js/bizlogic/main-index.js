/**
 * 作者: dailc
 * 时间: 2016-05-24
 * 描述: 首页 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//window操作
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
		], function() {
			//加载子页面
			loadSubPage();
			//初始化监听
			initListners();
		});
	});

	//加载子页面
	function loadSubPage() {
		var style_data = {
			top: '0px', //内容页面顶部位置,需根据实际页面布局计算
			bottom: '51px' //其它参数定义
		};
		//子页面
		var PageArray = [{
			url: 'bizlogic-homepage/homepage.html', //下拉刷新内容页面地址
			id: 'homepage.html', //首页
			styles: style_data
		}, {
			url: 'bizlogic-application/application-index.html', //下拉刷新内容页面地址
			id: 'application-index.html', //应用
			styles: style_data
		}, {
			url: 'bizlogic-microclass/microclass-index.html', //下拉刷新内容页面地址
			id: 'microclass-index.html', //微课
			styles: style_data
		}, {
			url: 'bizlogic-activity/activity-index.html', //下拉刷新内容页面地址
			id: 'activity-index.html', //活动
			styles: style_data
		}, {
			url: 'bizlogic-download/download-index.html', //下拉刷新内容页面地址
			id: 'download-index.html', //下载
			styles: style_data
		}];
		var PageArray1 = [{
			url: 'bizlogic-homepage/homepage.html', //下拉刷新内容页面地址
			id: 'homepage.html', //首页
			styles: style_data
		}];
		WindowTools.createSubWins(PageArray1);
	};
	//初始化监听
	function initListners() {
		var style_data = {
			top: '0px', //内容页面顶部位置,需根据实际页面布局计算
			bottom: '51px' //其它参数定义
		};
		var PageArray2 = [{
			url: 'bizlogic-application/application-index.html', //下拉刷新内容页面地址
			id: 'application-index.html', //应用
			styles: style_data
		}];
		var PageArray3 = [{
			url: 'bizlogic-microclass/microclass-index.html', //下拉刷新内容页面地址
			id: 'microclass-index.html', //微课
			styles: style_data
		}];
		var PageArray4 = [{
			url: 'bizlogic-activity/activity-index.html', //下拉刷新内容页面地址
			id: 'activity-index.html', //活动
			styles: style_data
		}];
		var PageArray5 = [{
			url: 'bizlogic-download/download-index.html', //下拉刷新内容页面地址
			id: 'download-index.html', //下载
			styles: style_data
		}];
		Zepto('.mui-bar-tab').on('tap', '.mui-tab-item', function() {
			var title = Zepto(this).text().trim();
			var data = this.getAttribute("data-id");
			switch(title) {
				case "首页":
					changePageShow('homepage.html');
					break;
				case "应用":
				if(data == 0) {
					WindowTools.createSubWins(PageArray2);
				}
					this.setAttribute("data-id", "1");
					changePageShow('application-index.html');
					break;
				case "微课":
				if(data == 0) {
					WindowTools.createSubWins(PageArray3);
				}
					this.setAttribute("data-id", "1");
					changePageShow('microclass-index.html');
					break;
				case "活动":
				if(data == 0) {
					WindowTools.createSubWins(PageArray4);
				}
					this.setAttribute("data-id", "1");
					changePageShow('activity-index.html');
					break;
				case "下载":
				if(data == 0) {
					WindowTools.createSubWins(PageArray5);
				}
					this.setAttribute("data-id", "1");
					changePageShow('download-index.html');
					break;
				default:
					break;
			}
		});
	};

	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['homepage.html', 'application-index.html', 'microclass-index.html', 'activity-index.html', 'download-index.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			var show = Zepto('.mui-bar-tab').children().eq(i).attr('data-id');
			if(showPage == pageArray[i]) {
				WindowTools.showSubPage(showPage);
			} else {
				if(show == 1) {
					WindowTools.hideSubPage(pageArray[i]);
				}
			}
		}
	}
});