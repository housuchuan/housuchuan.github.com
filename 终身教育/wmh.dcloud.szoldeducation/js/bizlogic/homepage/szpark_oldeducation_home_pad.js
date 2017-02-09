/**
 * 描述  老年教育
 * 作者 戴科
 * 时间 2016-04-07 08:49:58
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var UserAgentUtil=require('core/MobileFrame/UserAgentUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//默认热门资讯链接
	var HotInfoURL = "http://www.sipedu.org/";
	CommonUtil.initReady(function() {
		//请求热门资讯外网链接地址
		//ajaxHotinfoWebURL();
		//学员风采栏目
		ajaxStudentStyle();
	});

	Zepto('.suzhou_oldeducation_course_view_cell').on('tap', function() {
		Zepto(this).addClass('suzhou_active').siblings().removeClass('suzhou_active');
	});
	Zepto('#szpark_xyfc').on('tap', function() {
		WindowUtil.createWin('szpark_xyfc_pad.html', 'szpark_xyfc_pad.html');
	});
	Zepto("#suzhou_oldeducation_nav11").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_index.html', 'szpark_oldeducation_index.html');
	});
	//学校简介
	Zepto("#schoolIntroduce").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008003",
			isheadnews: "0",
			Title: "学校简介"
		});

	});
	//办学理念
	Zepto("#banxuelinian").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008004",
			isheadnews: "0",
			Title: "办学理念"
		});

	});
	//招生简章
	Zepto("#zhaoshengjianzhang").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008005",
			isheadnews: "0",
			Title: "招生简章"
		});

	});
	//健康养生
	Zepto("#healthy").on('tap', function() {
		if(UserAgentUtil.ANDROID_PAD()){
			console.log("apad");
		WindowUtil.createWin('szpark_oldeducation_index_apad.html', 'szpark_oldeducation_index_apad.html');
		}else{
			console.log("ipad");
			WindowUtil.createWin('szpark_oldeducation_index_pad.html', 'szpark_oldeducation_index_pad.html');
		}
	});
	//使用帮助
	Zepto("#help").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008006",
			isheadnews: "0",
			Title: "使用帮助"
		});
	});

	//热门资讯
	Zepto("#HotInformation").on('tap', function() {
		ajaxHotinfoWebURL("热门资讯");
	});
	//商业信息
	Zepto("#BusinessInformation").on('tap', function() {
		ajaxHotinfoWebURL("商业信息");
	});
	//美食小吃
	Zepto("#DeliciousFood").on('tap', function() {
		ajaxHotinfoWebURL("美食小吃");
	});
	//医疗救助
	Zepto("#MedicineHelp").on('tap', function() {
		ajaxHotinfoWebURL("医疗救助");
	});
	//招生联系
	Zepto("#EnrollmentConnection").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008007001",
			isheadnews: "0",
			Title: "招生联系"
		});
	});
	//公交路线
	Zepto("#BusRoute").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008007002",
			isheadnews: "0",
			Title: "公交路线"
		});
	});

	/**
	 * @description 请求详情数据
	 */
	function ajaxHotinfoWebURL(type) {
		var url = config.ServerUrl + "GetOldBMFW";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			type: type
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				//console.log(JSON.stringify(response));
				if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if (response.EpointDataBody.DATA.UserArea) {
						HotInfoURL = response.EpointDataBody.DATA.UserArea.URL;
						WindowUtil.createWin("szpark_oldeducation_HotInfomationShow.html", 'szpark_oldeducation_HotInfomationShow.html', {
							HotInfoURL: HotInfoURL,
							Title: type
						});
					}
				}
			},
			error: function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//学员风采栏目
	/**
	 * @description 请求详情数据
	 */
	function ajaxStudentStyle() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll();
		var url = config.ServerUrl + "olderpiclist";
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log(url);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				//console.log("学员风采数据 ：" + JSON.stringify(response));
				//定义临时数组
				var tempArray = [];
				if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
						var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
						mui.each(InfoArray, function(key, value) {
							value.Title = unescape(value.Title);
							value.IndexPic = config.ServerUrl_Pic + value.IndexPic;
							tempArray.push(value);
						});
						//学员风采 相册模板
						var template = '<div class="suzhou_oldeducation_course_show student_list_item"id="{{ChannelGuid}}"><img class="suzhou_oldeducation_course_pic"src="{{IndexPic}}"><span class="title">{{ChannelName}}</span><i class="ChannelGuid"style="display:none">{{ChannelGuid}}</i></div>';
						var responseE = "#studentStyle";
						Zepto(responseE).html('');
						mui.each(tempArray, function(key, value) {
							if (key < 5) {
								var output = Mustache.render(template, value);
							}
							Zepto(responseE).append(output);
						});
					}
				}
			},
			error: function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//学员风采--相册点击事件
	Zepto("#studentStyle").on('tap', '.suzhou_oldeducation_course_show', function() {
		var ChannelGuid =this.id;
		var Title = Zepto(".title", this).text();
		WindowUtil.createWin("szpark_xyfc_detail_pad.html", "szpark_xyfc_detail_pad.html", {
			ChannelGuid: ChannelGuid,
			Title: Title
		});
	});

})