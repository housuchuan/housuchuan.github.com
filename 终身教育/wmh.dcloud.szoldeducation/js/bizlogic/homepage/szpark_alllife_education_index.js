/**
 * 描述 : 终身教育研究所父页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-13 17:49:20
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var url = config.ServerUrl + "GetInfoDetailWithoutInfoID";
	//栏目编号
	var catenum = "010001"; //学校简介
	CommonUtil.initReady(function() {
		var Options = [{
			url: 'szpark_alllife_education_detail.html',
			id: 'szpark_alllife_education_detail.html',
			styles: {
				top: '85px',
				bottom: '0px'
			},
			extras: {
				CateNum: catenum
			}
		}, {
			url: 'szpark_alllife_education_list.html',
			id: 'szpark_alllife_education_list.html',
			styles: {
				top: '85px',
				bottom: '0px'
			}
		}]
		WindowUtil.createSubWins(Options, true);
		//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		Zepto(".mui-control-item").first().addClass('suzhou_school_active');
		Zepto("#sliderSegmentedControl2").css('width',100*5.5);
	});
	/**
	 * 给tab绑定点击事件
	 */
	Zepto('.mui-control-item').on('tap', function() {
		var title = Zepto(this).text();
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		if (title == '研究所简介') {
			catenum = "010001";
			changePageShow("szpark_alllife_education_detail.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_alllife_education_detail.html", 'refreshPage', {
				CateNum: catenum
			});
		}
		if (title == '科研动态') {
			catenum = "010002";
			changePageShow("szpark_alllife_education_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_alllife_education_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title:title
			});
		}
		if (title == '政策文献') {
			catenum = "010003";
			changePageShow("szpark_alllife_education_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_alllife_education_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title:title
			});
		}
		if (title == '科研讲坛') {
			catenum = "010004";
			changePageShow("szpark_alllife_education_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_alllife_education_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title:title
			});
		}
		if (title == '研究成果') {
			catenum = "010005";
			console.log(title);
			changePageShow("szpark_alllife_education_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_alllife_education_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title:title
			});
		}
	});

	function changePageShow(showPage) {
		var pageArray = ['szpark_alllife_education_detail.html', 'szpark_alllife_education_list.html'];
		var len = pageArray.length;
		for (var i = 0; i < len; i++) {
			if (showPage === pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i]);
			}
		}
	}

});