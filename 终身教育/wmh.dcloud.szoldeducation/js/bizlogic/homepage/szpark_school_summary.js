/**
 * 描述 :学校概况父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-12 08:42:41
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var urlList = config.ServerUrl + "getinfolist";
	var url = config.ServerUrl + "GetInfoDetailWithoutInfoID";
	//栏目编号
	var catenum = "005001";
	CommonUtil.initReady(function() {
			var Options = [{
				url: 'szpark_school_CommonInfoShow.html',
				id: 'szpark_school_CommonInfoShow.html',
				styles: {
					top: '85px',
					bottom: '0px'
				},
				extras: {
					CateNum: catenum
				}
			}, {
				url: 'szpark_school_honorlist.html',
				id: 'szpark_school_honorlist.html',
				styles: {
					top: '85px',
					bottom: '0px'
				}
			}, {
				url: 'szpark_school_biginfolist.html',
				id: 'szpark_school_biginfolist.html',
				styles: {
					top: '85px',
					bottom: '0px'
				}
			}]
			WindowUtil.createSubWins(Options, true);
			//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		    Zepto(".mui-control-item").first().addClass('suzhou_school_active');
			Zepto("#sliderSegmentedControl2").css('width',100*6)	
	});
		/**
		 * 给tab绑定点击事件
		 */
	Zepto('.mui-control-item').on('tap', function() {
		var title = Zepto(this).text();
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		if (title == '学校简介') {
			catenum = "005001";
			changePageShow("szpark_school_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_school_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum
			});
		}
		if (title == '机构设置') {
			catenum = "005002";
			changePageShow("szpark_school_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_school_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum
			});
		}
		if (title == '学校荣誉') {
			catenum = "005003"; //列表页面
			changePageShow("szpark_school_honorlist.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_school_honorlist.html", 'refreshListPage');
		}
		if (title == '大事件') {
			catenum = "005004"; //列表页面
			Zepto('.suzhou_normal_content').hide();
			changePageShow("szpark_school_biginfolist.html");
			WindowUtil.firePageEvent("szpark_school_biginfolist.html", 'refreshListPage');
		}
		if (title == '校园风光') {
			catenum = "005005";
			changePageShow("szpark_school_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_school_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum
			});
		}
		if (title == '交通信息') {
			catenum = "005006";
			changePageShow("szpark_school_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_school_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum
			});
		}
	});
	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['szpark_school_CommonInfoShow.html', 'szpark_school_honorlist.html', 'szpark_school_biginfolist.html'];
		var length = pageArray.length;
		for (var i = 0; i < length; i++) {
			if (showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i])
			}
		}
	}
});