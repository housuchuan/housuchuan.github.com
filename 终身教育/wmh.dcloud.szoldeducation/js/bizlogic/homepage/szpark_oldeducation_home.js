/**
 * 描述  老年教育
 * 作者 戴科
 * 时间 2016-04-07 08:49:58
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	//学员风采预览封装
	var GenerateImagevierHtmlUtil = require('bizlogic/common/common_xyfc_imagevier.js');
	//默认热门资讯链接
	var HotInfoURL = "http://www.sipedu.org/";
	var secretKey = '';
	var itemsId = '';
	var userId = '';
	//var secretKey = config.secretKey;
	CommonUtil.initReady(function() {
		var userSession = StorageUtil.getStorageItem('UserSession');
		if(StorageUtil.getStorageItem("secretKey")) {
			secretKey = StorageUtil.getStorageItem("secretKey");
		};
		//请求热门资讯外网链接地址
		//ajaxHotinfoWebURL();
		//学员风采栏目
		ajaxStudentStyle();
		//资源分类数据
		videoClassifyList();
	});

	Zepto('.suzhou_oldeducation_course_view_cell').on('tap', function() {
		Zepto(this).addClass('suzhou_active').siblings().removeClass('suzhou_active');
	});
	Zepto('#szpark_xyfc').on('tap', function() {
		WindowUtil.createWin('szpark_xyfc.html', 'szpark_xyfc.html');
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
		WindowUtil.createWin('szpark_oldeducation_index.html', 'szpark_oldeducation_index.html');

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
		console.log(url);
		console.log(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log(JSON.stringify(response));
				if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if(response.EpointDataBody.DATA.UserArea) {
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
		//var url = config.ServerUrl + "olderpiclist";
		var url = config.ServerUrl + "OlderPicAll";
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log(url);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UIUtil.closeWaiting();
				//console.log("学员风采数据 ：" + JSON.stringify(response));
				//定义临时数组
				var tempArray = [];
				if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
						var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
						var html = GenerateImagevierHtmlUtil.generateHtml_oldeducation_home(InfoArray);
						Zepto("#studentStyle").html('');
						Zepto("#studentStyle").append(html);
						mui.previewImage();
					}
				}
			},
			error: function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//资源分类数据
	/**
	 * @description 资源分类请求数据
	 */
	function videoClassifyList() {
		//var url = config.MockServerUrl + 'oldEducation/resourceCenter/mobile/resourceCenter/videoClassifyList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/videoClassifyList';
		var requestData = {};
		var data = {};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("ss" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				console.log("老年资源类别" + JSON.stringify(tempInfo));
				var output = '';
				var litemplate = '<li id="{{columnId}}" class="suzhou_oldeducation_course_view_cell">{{columnTitle}}</li>';
				if(tempInfo) {
					if(Array.isArray(tempInfo)) {
						mui.each(tempInfo, function(key, value) {
							output += Mustache.render(litemplate, value);
						})
					} else {
						output = Mustache.render(litemplate, tempInfo);
					}
					Zepto('.suzhou_oldeducation_course_viewList').html();
					Zepto('.suzhou_oldeducation_course_viewList').append(output);
					Zepto('.suzhou_oldeducation_course_viewList').append('<li class="suzhou_oldeducation_course_more"id="suzhou_intemore"><span class="">更多</span><i class="suzhou_more"></i></li>');
					Zepto('.suzhou_oldeducation_course_viewList').children('li:first-child').addClass('suzhou_active');
					var id = Zepto('.suzhou_oldeducation_course_viewList li:first-child').attr('id');
					//资源分类下的tab切换
					Zepto('.suzhou_oldeducation_course_viewList').on('tap', '.suzhou_oldeducation_course_view_cell', function() {
						id = Zepto(this).attr('id');
						Zepto(this).addClass('suzhou_active').siblings().removeClass('suzhou_active');
						//分类tab切换刷新相应视频列表
						interfixVideoAjaxList(id);
					});
					//点击更多跳转到资源中心界面
					Zepto('#suzhou_intemore').on('tap', function() {
						WindowUtil.createWin("resource_center_index.html", "../resourceCenter/resource_center_index.html");
					});
					//初始化视频分类下的视频数据
					interfixVideoAjaxList(id);
				};
			};
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 分类下视频列表ajax请求数据
	 */
	function interfixVideoAjaxList(classifyId) {
		//var url = config.MockServerUrl + 'oldEducation/resourceCenter/mobile/resourceCenter/interfixVideoList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/interfixVideoList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: "",
			classifyId: classifyId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("课程Urlxxxxxxxxxxxxxxxx"+url)
		//console.log("课程xxxxxxxxxxxxxxxx"+requestData)
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				var tempInfo = response.data;
				//console.log("xxxxxxxxxxxx"+JSON.stringify(tempInfo));
				var output = '';
				var litemplate = '<div id="{{resourceId}}" class="suzhou_oldeducation_course_show"><span class="starNum" id="{{resourceStarNum}}"></span><img class="suzhou_oldeducation_course_pic" src="{{resourceImg}}"><span class="title">{{resourceTitle}}</span><ul class="suzhou_stars"><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li></ul></div>';
				if(tempInfo) {
					if(Array.isArray(tempInfo)) {
						mui.each(tempInfo, function(key, value) {
							if(!value.resourceImg) {
								value.resourceImg = "../../img/MobileFrame/img_error.jpg";
							}else{
								value.resourceImg = unescape(value.resourceImg);
							};
							value.resourceTitle = unescape(value.resourceTitle);
							output += Mustache.render(litemplate, value);
						});
						//console.log("xxxxxxxxxxxx"+JSON.stringify(tempInfo));
					} else {
						output = Mustache.render(litemplate, tempInfo);
					};
					Zepto('.suzhou_oldeducation_courseList').html('');
					Zepto('.suzhou_oldeducation_courseList').append(output);
					//判断视频资源的个数
					var _this = Zepto('.suzhou_oldeducation_courseList div');
					for(var i = 0; i < _this.length; i++) {
						//console.log("xxxxxxxxxxxx"+_this[i]);
						var starNum = Zepto(_this[i]).find('.starNum').attr('id');
						var _thisR = Zepto(_this[i]);
						if(starNum > 0) {
							for(var j = 0; j < starNum; j++) {
								_thisR.find('ul li').eq(j).removeClass('suzhou_stars_unsellect').addClass('suzhou_stars_sellected');
							}
						}
					}
				}
			};
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	Zepto('.suzhou_oldeducation_courseList').on('tap', 'div', function() {
		itemsId = Zepto(this).attr('id');
		CustomDialogUtil.showCustomDialog("alertWin"); //显示自定义对话框
	});

	//监听点播事件
	Zepto("#preview").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		WindowUtil.createWin('resource_center_preview_video.html', '../resourceCenter/resource_center_preview_video.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1"
		});
	});
	Zepto("#play").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		LoginUtil.ResetTARGET_URL('resource_center_view_video.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
			type: 0
		});
		if(LoginUtil.isLoginSystem()) {
			WindowUtil.createWin('resource_center_view_video.html', '../resourceCenter/resource_center_view_video.html', {
				itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
				type: 0
			});
		} else {
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	Zepto("#cancle").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
	});

})