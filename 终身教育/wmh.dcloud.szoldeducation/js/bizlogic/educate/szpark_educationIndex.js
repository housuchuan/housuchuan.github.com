/*
 * 作者 : 黄赟博
 * 时间 : 2016-04-07 09:43:22
 * 描述 : 教育关工委主页面
 */
define(function(require, exports, module) {
	"use strict"
	//首页刷新
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var WidgetUtil = require('core/MobileFrame/WidgetUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var url = config.ServerUrl + "getinfolist";
	var secretKey = '';
	var itemsId = '';
	var userId = '';
	//var secretKey = config.secretKey;
	//轮播数据
	var GalleryData = [];
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem('secretKey');
		if(secretKey) {
			secretKey = secretKey;
		};
		var userSession = StorageUtil.getStorageItem('UserSession');
		//请求轮播数据
		initGalleryImgs();
		//请求学习课程数据
		AjaxStudyCourseList();
		//判断是否有网络
		//		if(CommonUtil.IsNetWorkCanUse()) {
		//			
		//		} else {
		//			//未登录
		//			Zepto('.content').html('');
		//			var noData = '<span class="noData">暂无数据(未登录，请先登录)</span>';
		//			Zepto('.content').append(noData);
		//		}
	});
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//这个下拉刷新不需要请求接口
		mIsRequestFirst: false,
		IsRendLitemplateAuto: false,
		refreshCallback: function() {
			//下拉刷新 重新请求数据
			//1.清空默认轮播图片
			GalleryData = [];
			initGalleryImgs();
			AjaxStudyCourseList();
		},
		pullUpLoadType: 'none',
	});
	/**
	 * @description 通知公告点击
	 */
	Zepto('#notice').on('tap', function() {
		WindowUtil.createWin('szpark_educationNotice_parent.html', 'szpark_educationNotice_parent.html');
	});
	/**
	 * @description 家长问答
	 */
	Zepto('#parentaskanswer').on('tap', function() {
		WindowUtil.createWin('szpark_parentAskAnswer_parent.html', 'szpark_parentAskAnswer_parent.html');
	});

	/**
	 * @description 活动专栏
	 */
	Zepto('#activitycolumn').on('tap', function() {
		WindowUtil.createWin('szpark_educationActivityColumn_parent.html', 'szpark_educationActivityColumn_parent.html');
	});

	//请求轮播数据
	function initGalleryImgs() {
		//var imgGalleryUrl = 'http://www.nxzjxx.cn/NXWebService/appservice/GetInfoList';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: 0,
			pagesize: 5,
			catenum: "066001",
			isheadnews: "1",
			title: ""
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log("轮播图片参数：" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: successRequestGalleryImgsCallback,
			timeout: 9000,
			error: errorRequestCallback
		});
	};
	/**
	 * @description 图片轮播请求成功回调方法
	 * @param {Object} response
	 */
	function successRequestGalleryImgsCallback(response) {
		//console.log("图片轮播请求结果\n" + JSON.stringify(response));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if(Array.isArray(infoArray)) {
					mui.each(infoArray, function(key, value) {
						//如果轮播图片为空，则默认一张未上传图片
						if(value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
							value.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
						}
						GalleryData.push({
							id: value.InfoID,
							title: unescape(value.Title),
							url: value.HeadNewsAttachUrl,
							CateNum: value.CateNum
						});
					});
				} else {
					//如果轮播图片为空，则默认一张未上传图片
					if(infoArray.HeadNewsAttachUrl == null || infoArray.HeadNewsAttachUrl == "") {
						infoArray.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
					}
					GalleryData.push({
						id: infoArray.InfoID,
						title: unescape(infoArray.Title),
						url: infoArray.HeadNewsAttachUrl,
						CateNum: infoArray.CateNum
					});
				}
				//添加轮播
				addGallery(GalleryData, "true");
			}
		}
	};

	/**
	 * @description 添加轮播图片工具方法
	 * @param {Object} GalleryData
	 * @param {Object} netStatus
	 */
	function addGallery(GalleryData, netStatus) {
		//有网络在线请求
		if(netStatus == true) {
			GalleryData = GalleryData;
		}
		var maxHeight = '150px';
		WidgetUtil.GalleryFactory.addGalleryLandscape('#gallerySlider', GalleryData, function(e, id) {
			var index = parseInt(id.replace('galleryImg', ''), 10)
			console.log('点击图片轮播,id:' + id + ',index:' + index);
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: id,
				CateNum: "066001",
				Title: "图片新闻"
			});
		}, {
			isLoop: true,
			isAuto: true,
			autoTime: 3000,
			maxImgHeight: maxHeight,
			//是否显示下面的Indicator
			isShowIndicator: true,
			//是否显示下面的翻页Indicator
			isShowPageIndicator: false
		});
	};

	/**
	 * @description 学习课程ajax请求列表数据
	 */
	function AjaxStudyCourseList() {
		//var url = config.MockServerUrl + 'educationCommittee/resourceCenter/mobile/resourceCenter/studyCourseList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/studyCourseList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: ""
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("关工委Urlxxxxxxxxxxxx"+requestData);
		//console.log("关工委xxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			//console.log("xxxxxxxxxxxxxxxxxixi"+JSON.stringify(response));
			if(response.code == 1) {
				var tempInfo = response.data;
				//console.log("xxxxxxxxxxxx"+JSON.stringify(tempInfo));
				var output = '';
				var litemplate = '<div id="{{resourceId}}" class="course"><span class="starNum" id="{{resourceStarNum}}"></span><img class="course-pic" data-img-localcache="{{resourceImg}}"/><span class="title">{{resourceTitle}}</span><ul><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li></ul></div>';
				if(tempInfo) {
					if(Array.isArray(tempInfo)) {
						mui.each(tempInfo, function(key, value) {
							if(!value.resourceImg) {
								value.resourceImg = '../../img/MobileFrame/img_error.jpg';
							}else{
								value.resourceImg = unescape(value.resourceImg);
							};
							value.resourceTitle = unescape(value.resourceTitle);
							output += Mustache.render(litemplate, value);
						});

					} else {
						output = Mustache.render(litemplate, tempInfo);
					};
					Zepto('.content').html('');
					Zepto('.content').append(output);
					//手动强制启动h5浏览器方式加载图片
					ImageLoaderFactory.lazyLoadAllImg(true);
					//判断视频资源的个数
					var _this = Zepto('.content .course');
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
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//点击更多跳转到资源中心界面
	Zepto('#more').on('tap', function() {
		WindowUtil.createWin("resource_center_index.html", "../resourceCenter/resource_center_index.html");
	});

	Zepto('.content').on('tap', 'div', function() {
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
		LoginUtil.ResetTARGET_URL("resource_center_view_video.html", {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
			type: 0
		});
		if(LoginUtil.isLoginSystem()) {
			//console.log("是否收藏"+IsSave);
			WindowUtil.createWin('resource_center_view_video.html', '../resourceCenter/resource_center_view_video.html', {
				itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
				type: 0
			});
		} else {
			//未登录
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	Zepto("#cancle").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
	});
	//登录成功之后应刷新教育关工委
	window.addEventListener('refreshCourseList', function() {
		//刷新学习课程列
		AjaxStudyCourseList();
	});

	/**
	 * @description 请求失败回调方法
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function errorRequestCallback(xhr, type, errorThrown) {
		UIUtil.toast("请求超时,请检查网络连接...");
		UIUtil.closeWaiting();
		//addGallery(GalleryData, false);
	};
	/**
	 * @description 重写resize
	 * @define onresize 事件会在窗口或框架被调整大小时发生。
	 * 由于iframe使用了fixed布局,所以本身就是自适应的,没必要重新计算了
	 * 
	 */
	(function() {
		//监听resize事件,动态改变宽和高
		var oldResize = window.onresize;

		window.onresize = function() {
			oldResize && oldResize();
			console.log("resize");
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
			//iphone4s safari浏览器 分辨率 320*480    横屏宽度：480px  竖屏宽度：320px
			//我的华为手机qq浏览器： 360*598                            横屏宽度：598px  竖屏宽度：360px
			//iphone 6 plus 浏览器 414*          横屏宽度:736px  竖屏宽度：414px
			if(winWidth >= 480) {
				console.log("横屏");
				//alert("横屏"+winWidth);
				document.getElementById("gallerySlider").style.display = 'none';
			} else {
				console.log("竖屏");
				//alert("竖屏"+winWidth);
				document.getElementById("gallerySlider").style.display = 'block';
			}
		};
	})();

});