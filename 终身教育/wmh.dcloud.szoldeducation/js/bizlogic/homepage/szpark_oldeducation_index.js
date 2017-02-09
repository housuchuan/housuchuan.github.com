/**
 * 描述 : 老年教育首页  
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
	var catenum = "008001"; //学校简介
	//是否设置标题图片
	var isheadnews = "1";
	CommonUtil.initReady(function() {
		Zepto('#yangshencanyin').show();
		var Options = [{
			url: 'szpark_oldeducation_list.html',
			id: 'szpark_oldeducation_list.html',
			styles: {
				top: '85px',
				bottom: '0px'
			},
			extras: {
				CateNum: catenum,
				isheadnews: isheadnews
			}
		}]
		WindowUtil.createSubWins(Options, true);
		//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		Zepto(".mui-control-item").first().addClass('suzhou_school_active');
		Zepto("#sliderSegmentedControl2").css('width', 100 * 2);
	});
	/**
	 * 给tab绑定点击事件
	 */
	Zepto('.mui-control-item').on('tap', function() {
		var title = Zepto(this).text();
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		if (title == '养生餐饮') {
			catenum = "008001";
			isheadnews = "1";
			WindowUtil.showSubPage("szpark_oldeducation_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_oldeducation_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title: title,
				isheadnews: isheadnews
			});
		}
		if (title == '养生时讯') {
			catenum = "008002";
			isheadnews = "0";
			WindowUtil.showSubPage("szpark_oldeducation_list.html");
			Zepto('.suzhou_normal_content').hide();
			WindowUtil.firePageEvent("szpark_oldeducation_list.html", "CustomrefreshListPage", {
				CateNum: catenum,
				Title: title,
				isheadnews: isheadnews
			});
		}
	});
});