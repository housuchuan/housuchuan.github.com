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
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var GenerateImagevierHtmlUtil = require('bizlogic/common/common_xyfc_imagevier.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var userSession;
	var secretKey = '';
	var userId = '';
	var itemsId = '';
	//默认热门资讯链接
	var HotInfoURL = "http://www.sipedu.org/";
	CommonUtil.initReady(function() {
		if(StorageUtil.getStorageItem("secretKey")) {
			secretKey = StorageUtil.getStorageItem("secretKey");
		};
		userSession = StorageUtil.getStorageItem('UserSession');
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
		};
		//请求热门资讯外网链接地址
		//ajaxHotinfoWebURL();
		initRecommandCourselist();
		//学员风采栏目
		ajaxStudentStyle();
	});
	//学校简介栏目
	Zepto("#schoolIntroduce").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008003",
			isheadnews: "0",
			Title: "学校简介"
		});

	});
	//办学理念栏目
	Zepto("#banxuelinian").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008004",
			isheadnews: "0",
			Title: "办学理念"
		});

	});
	//招生简章栏目
	Zepto("#zhaoshengjianzhang").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008005",
			isheadnews: "0",
			Title: "招生简章"
		});

	});
	//健康养生栏目
	Zepto("#healthy").on('tap', function() {
		console.log("apad");
		WindowUtil.createWin('szpark_oldeducation_index_apad.html', 'szpark_oldeducation_index_apad.html');
	});
	//使用帮助栏目
	Zepto("#help").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008006",
			isheadnews: "0",
			Title: "使用帮助"
		});
	});

	//热门资讯栏目
	Zepto("#HotInformation").on('tap', function() {
		ajaxHotinfoWebURL("热门资讯");
	});
	//招生联系栏目
	Zepto("#EnrollmentConnection").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008007001",
			isheadnews: "0",
			Title: "招生联系"
		});
	});
	//公交路线栏目
	Zepto("#BusRoute").on('tap', function() {
		WindowUtil.createWin('szpark_oldeducation_CommonInfoShow.html', 'szpark_oldeducation_CommonInfoShow.html', {
			CateNum: "008007002",
			isheadnews: "0",
			Title: "公交路线"
		});
	});
	//商业信息栏目
	Zepto("#BusinessInformation").on('tap', function() {
		ajaxHotinfoWebURL("商业信息");
	});
	//美食小吃栏目
	Zepto("#DeliciousFood").on('tap', function() {
		ajaxHotinfoWebURL("美食小吃");
	});
	//医疗救助栏目
	Zepto("#MedicineHelp").on('tap', function() {
		ajaxHotinfoWebURL("医疗救助");
	});
	//学员风采（点击更多按钮监听事件）
	Zepto('#szpark_xyfc').on('tap', function() {
		console.log("点击-学员风采--更多  按钮监听事件");
		WindowUtil.createWin('szpark_xyfc_pad.html', 'szpark_xyfc_pad.html');
	});
	//学员风采--相册点击事件【有点奇怪，这里只能给它click事件，才会有效，不知道为什么？】
	//	Zepto("#studentStyle").on('click', '.suzhou_oldeducation_course_show', function() {
	//		var ChannelGuid = this.id;
	//		var Title = Zepto(".title", this).text();
	//		WindowUtil.createWin("szpark_xyfc_detail_pad.html", "szpark_xyfc_detail_pad.html", {
	//			ChannelGuid: ChannelGuid,
	//			Title: Title
	//		});
	//	});
	/**
	 * @description 【便民查询模块】请求详情weburl,并打开链接页面
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

	//初始化推荐课程模块
	function initRecommandCourselist() {
		userSession = StorageUtil.getStorageItem('UserSession');
		if(StorageUtil.getStorageItem("secretKey")) {
			secretKey = StorageUtil.getStorageItem("secretKey");
		};
		//var url = 'http://221.224.167.154:8099/szedu_v1.0.0/resourceCenter/mobile/resourceCenter/RecommandCourseList';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/RecommandCourseList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("首页推荐课程参数：" + requestData);
		//console.log("首页推荐课程参数：" + url);
		//console.log("secretKey的值：" + secretKey);
		//UIUtil.showWaiting();  
		CommonUtil.ajax(url, requestData, function(response) {
			//UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, 1);
			//			if(response.code == "401" || response.code == 401) {
			//				//处理未登录
			//				LoginUtil.handleNotloggedin(response);
			//			} else 
			if(response.code == "1" || response.code == 1) {
				console.log("课程列表：" + JSON.stringify(response));
				var litemplate = '<div id="{{id}}" class="suzhou_oldeducation_course_show"><span class="starNum"id="{{resourceStarNum}}"></span><img class="suzhou_oldeducation_course_pic"data-img-localcache="{{image}}"><span class="title">{{title}}</span><ul class="suzhou_stars starList"><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li><li class="suzhou_stars_list suzhou_stars_unsellect"></li></ul></div>';
				var output = '';
				Zepto("#coursedata").html('');
				mui.each(response.data, function(key, value) {
					//console.log("xxxxxxxxxxxxxxxxxxxxx"+JSON.stringify(value));
					if(!value.image) {
						value.image = '../../img/MobileFrame/img_error.jpg';
					} else {
						value.image = unescape(value.image);
					};
					value.title = unescape(value.title);
					output += Mustache.render(litemplate, value);
				});
				Zepto("#coursedata").append(output);
				//console.log("xxxxxxxxxxuserId" + userId);
				//判断视频资源的个数
				var _this = Zepto('#coursedata div');
				for(var i = 0; i < _this.length; i++) {
					//console.log("xxxxxxxxxxxx"+_this[i]);
					var starNum = Zepto(_this[i]).find('.starNum').attr('id');
					var _thisR = Zepto(_this[i]);
					if(starNum) {
						if(starNum > 0) {
							for(var j = 0; j < starNum; j++) {
								_thisR.find('.starList li').eq(j).removeClass('suzhou_stars_unsellect').addClass('suzhou_stars_sellected');
							}
						}
					} else {
						for(var j = 0; j < 3; j++) {
							_thisR.find('.starList li').eq(j).removeClass('suzhou_stars_unsellect').addClass('suzhou_stars_sellected');
						}
					}

				}
				//手动强制启动h5浏览器方式加载图片
				ImageLoaderFactory.lazyLoadAllImg(true);
				//监听事件
				Zepto("#coursedata").on('tap', 'div', function() {
					itemsId = this.id;
					console.log("xxxxxxxxxxxxxx"+itemsId);
					//跳转到资源中心首页面
					CustomDialogUtil.showCustomDialog("alertWin"); //显示自定义对话框
				});
			}
		}, function() {
			//UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	};
	
	//监听点播事件
	Zepto("#preview").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		WindowUtil.createWin('resource_center_video_preview_pad.html', '../html_pad/resourceCenter/resource_center_video_preview_pad.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
		});
	});
	Zepto("#play").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		//选择播放之前，须用户登录才可以浏览进行视频播放
		if(LoginUtil.isLoginSystem()) {
			//console.log("是否收藏"+IsSave);
			WindowUtil.createWin('resource_center_view_video_pad.html', '../html_pad/resourceCenter/resource_center_view_video_pad.html', {
				itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
				type: 0
			});
		} else {
			LoginUtil.ResetTARGET_URL('resource_center_view_video_pad.html',{
				itemsId: itemsId,
				type: 0
			});
			//console.log("请先登录！");
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	Zepto("#cancle").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
	});
	
	//点击更多跳转到资源中心界面
	Zepto('#more').on('tap', function() {
		WindowUtil.createWin("resource_center_index_pad.html", "../html_pad/resourceCenter/resource_center_index_pad.html");
	});

	/**
	 * 学员风采栏目
	 * @description 映射学员风采模块数据
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
				console.log("相册数据 ：" + JSON.stringify(response));
				//定义临时数组
				var tempArray = [];
				if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
						var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
						var html = GenerateImagevierHtmlUtil.generateHtml_oldeducation_home_apad(InfoArray);
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
})