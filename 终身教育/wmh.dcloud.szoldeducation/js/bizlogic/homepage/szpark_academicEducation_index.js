/**
 * 作者：dailc 
 * 时间：2016-04-08 08:28:10
 * 描述： 学历教育首页 
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
	var BoxGuid = null;
	//栏目编号
	var catenum = "007001";
	CommonUtil.initReady(function() {
		var Options = [{
			//学历教育-通用信息展示页面
			url: 'szpark_academicEducation_CommonInfoShow.html',
			id: 'szpark_academicEducation_CommonInfoShow.html',
			styles: {
				top: '85px',
				bottom: '0px'
			},
			extras: {
				CateNum: catenum,
				isheadnews: "0"
			}
		}, {
			//在线报名
			url: 'szpark_academicEducation_onlineRegistration.html',
			id: 'szpark_academicEducation_onlineRegistration.html',
			styles: {
				top: '85px',
				bottom: '0px'
			}
		}, {
			//公告通知
			url: 'szpark_academicEducation_list.html',
			id: 'szpark_academicEducation_list.html',
			styles: {
				top: '85px',
				bottom: '0px'
			}
		}, {
			//咨询答疑
			url: 'szpark_consultationAnswer_list.html',
			id: 'szpark_consultationAnswer_list.html',
			styles: {
				top: '85px',
				bottom: '0px'
			}
		}]
		WindowUtil.createSubWins(Options, true);
		//ajaxDetailData();
		//初始化栏目显示样式，放在此处，避免初始化时，加载页面闪幌
		Zepto(".mui-control-item").first().addClass('suzhou_school_active');
		Zepto("#sliderSegmentedControl2").css('width',100*9.5);
	});
	/**
	 * 给tab绑定点击事件
	 */
	Zepto('.mui-control-item').on('tap', function() {
		var title = Zepto(this).text();
		Zepto(this).addClass('suzhou_school_active').siblings().removeClass('suzhou_school_active');
		if (title == '学校概况') {
			catenum = "007001";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '招生专业') {
			catenum = "007002";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '在线学习') {
			catenum = "007003";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '招生办法') {
			catenum = "007004";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '联系方式') {
			catenum = "007005";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '位置及交通') {
			catenum = "007006";
			changePageShow("szpark_academicEducation_CommonInfoShow.html");
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			WindowUtil.firePageEvent("szpark_academicEducation_CommonInfoShow.html", 'refreshPage', {
				CateNum: catenum,
				isheadnews: "0",
				Title:title
			});
		} else if (title == '在线报名') {
			catenum = "007007";
			Zepto("#btn-askQuestion").hide();
			changePageShow('szpark_academicEducation_onlineRegistration.html');
		} else if (title == '公告通知') {
			catenum = "007008";
			Zepto('.suzhou_normal_content').hide();
			Zepto("#btn-askQuestion").hide();
			changePageShow("szpark_academicEducation_list.html");
			WindowUtil.firePageEvent("szpark_academicEducation_list.html", "CustomrefreshListPage", {
				CateNum: catenum
			});
		} else if (title == '咨询答疑') {
			catenum = "007009";
			Zepto('.suzhou_normal_content').hide();
			//点击该项显示学历教育首页右上角加号+
			Zepto("#btn-askQuestion").show();
			changePageShow('szpark_consultationAnswer_list.html');
			WindowUtil.firePageEvent("szpark_consultationAnswer_list.html", "CustomrefreshListPage", {
				CateNum: catenum
			});
		}
	});

	function changePageShow(showPage) {
		var pageArray = ['szpark_academicEducation_CommonInfoShow.html', 'szpark_academicEducation_list.html', 'szpark_academicEducation_onlineRegistration.html', 'szpark_consultationAnswer_list.html'];
		var len = pageArray.length;
		for (var i = 0; i < len; i++) {
			if (showPage === pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i]);
			}
		}
	}
	//PLUS状态下，监听接收BoxGuid
	window.addEventListener('getBoxGuideEvent', function(e) {
		if (e.detail.BoxGuid) {
			BoxGuid = e.detail.BoxGuid;
		}
	});
	//浏览器触发子页面刷新回调传过来的BoxGuid
	window.getBoxGuidCB = function(msg) {
		//console.log('学历教育页面:BoxGuid' + msg.BoxGuid);
		BoxGuid = msg.BoxGuid;
	};
	//新增咨询答疑
	Zepto("#btn-askQuestion").on('tap', function() {
		WindowUtil.createWin('szpark_consultationAnswer_submit.html', 'szpark_consultationAnswer_submit.html', {
			BoxGuid: "882c5330-19d8-4068-9616-1fcde57f0ff0",
			Title: "咨询答疑"
		});
	});
});