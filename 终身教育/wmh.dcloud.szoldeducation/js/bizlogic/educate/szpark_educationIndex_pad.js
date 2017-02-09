/*
 * 作者 : 黄赟博
 * 时间 : 2016-04-07 09:43:22
 * 描述 : 教育关工委主页面
 */
define(function(require, exports, module) {
	"use strict";
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	var WidgetUtil = require('core/MobileFrame/WidgetUtil');
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var DateUtil = require('core/MobileFrame/DateUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var StorageUtil=require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var MyDate = DateUtil.MyDate;
	//图片轮播工具封装类
	var YQ_Gallery = require('bizlogic/common/common_yqGallery');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var url = config.ServerUrl + "getinfolist";
	var secretKey = '';
	var itemsId = '';
	var userId = '';
	//轮播数据
	var GalleryData = [];
	CommonUtil.initReady(function() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll();
		initGalleryImgs();
		//学习课程
		AjaxStudyCourseList();
	});
	/**
	 * @description 学习课程ajax请求列表数据
	 */
	function AjaxStudyCourseList() {
		//var url = config.MockServerUrl + 'educationCommittee/resourceCenter/mobile/resourceCenter/studyCourseList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/studyCourseList';
		var requestData = {};
		var data = {
			userId: ""
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("关工委Urlxxxxxxxxxxxx"+requestData);
		console.log("关工委xxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log(JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			console.log(JSON.stringify(response));
			if(response.code == 1) {
				var tempInfo = response.data;
				//console.log("xxxxxxxxxxxx"+JSON.stringify(tempInfo));
				var output = '';
				var litemplate = '<div id="{{resourceId}}" class="course"><span class="starNum" id="{{resourceStarNum}}"></span><span class="isSave" id="{{isSave}}"></span><img class="course-pic" data-img-localcache="{{resourceImg}}"/><span class="title">{{resourceTitle}}</span><ul><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li><li class="suzhou_stars_unsellect"></li></ul></div>';
				if(tempInfo) {
					Zepto('.noData').css('display','none');
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
				}else{
					Zepto('.noData').css('display','block');
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	
	Zepto('.content').on('tap', 'div', function() {
		itemsId = Zepto(this).attr('id');
		CustomDialogUtil.showCustomDialog("alertWin"); //显示自定义对话框
	});

	//监听点播事件
	Zepto("#preview").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		WindowUtil.createWin('resource_center_preview_video_pad.html', '../html_pad/resourceCenter/resource_center_video_preview_pad.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1"
		});
	});
	Zepto("#play").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		LoginUtil.ResetTARGET_URL("resource_center_view_video.html", {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
		});
		if(LoginUtil.isLoginSystem()) {
			WindowUtil.createWin('resource_center_view_video_pad.html', '../html_pad/resourceCenter/resource_center_view_video_pad.html', {
				itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
				type: 0
			});
		} else {
			LoginUtil.ResetTARGET_URL('resource_center_view_video_pad.html',{
				itemsId: itemsId,
				type: 0
			});
			//未登录
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
	
	//请求轮播数据
	function initGalleryImgs() {
		//var imgGalleryUrl = 'http://www.nxzjxx.cn/NXWebService/appservice/GetInfoList';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: 0,
			pagesize: 8,
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
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList.Info) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				//处理轮播数据
				dealGalleyData(infoArray);
			}
		}
	};
	/**
	 * 处理轮播数据
	 */
	function dealGalleyData(infoArray) {
		//声明一个轮播数组
		var GalleryData = [];
		var temp1 = [];
		var temp2 = [];
		if(Array.isArray(infoArray)) {
			mui.each(infoArray, function(key, value) {
				if(value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
					//console.log(key+"null");
					value.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
				} else if(!value.infocontent) {
					value.infocontent = "";
				} else if(!value.Title) {
					value.Title = "";
				} else if(!value.Zhuanzai) {
					value.Zhuanzai = "";
				}
				//去除富文本htm标签以及nbsp;
				value.infocontent = unescape(value.infocontent).replace(/<[^>]+>/g, "");
				value.infocontent = unescape(value.infocontent).replace(/&nbsp;/ig, "");
				value.Zhuanzai = unescape(value.Zhuanzai);
				value.Title = unescape(value.Title);
				//将日期时间转换成日期类型
				value.InfoDate = (new MyDate(value.InfoDate + ":00")).toString('YYYY-MM-DD');
				if(key < 4) {
					temp1.push({
						"InfoID": value.InfoID,
						"HeadNewsAttachUrl": value.HeadNewsAttachUrl,
						"Zhuanzai": value.Zhuanzai,
						"InfoDate": value.InfoDate,
						"Title": value.Title,
						"infocontent": value.infocontent
					});
				}
				if(key > 3) {
					temp2.push({
						"InfoID": value.InfoID,
						"HeadNewsAttachUrl": value.HeadNewsAttachUrl,
						"Zhuanzai": value.Zhuanzai,
						"InfoDate": value.InfoDate,
						"Title": value.Title,
						"infocontent": value.infocontent
					});
				}
			});
		} else {
			if(infoArray.HeadNewsAttachUrl == null || infoArray.HeadNewsAttachUrl == "") {
				//console.log(key+"null");
				infoArray.HeadNewsAttachUrl = '../../img/MobileFrame/img_error.jpg';
			} else if(!infoArray.infocontent) {
				infoArray.infocontent = "";
			} else if(!infoArray.Title) {
				infoArray.Title = "";
			} else if(!infoArray.Zhuanzai) {
				infoArray.Zhuanzai = "";
			}
			//去除富文本htm标签以及nbsp;
			infoArray.infocontent = unescape(infoArray.infocontent).replace(/<[^>]+>/g, "");
			infoArray.infocontent = unescape(infoArray.infocontent).replace(/&nbsp;/ig, "");
			infoArray.Zhuanzai = unescape(infoArray.Zhuanzai);
			infoArray.Title = unescape(infoArray.Title);
			infoArray.InfoDate = (new MyDate(infoArray.InfoDate + ":00")).toString('YYYY-MM-DD');
			temp1.push({
				"InfoID": infoArray.InfoID,
				"HeadNewsAttachUrl": infoArray.HeadNewsAttachUrl,
				"Zhuanzai": infoArray.Zhuanzai,
				"InfoDate": infoArray.InfoDate,
				"Title": infoArray.Title,
				"infocontent": infoArray.infocontent
			});
		}
		GalleryData.push(temp1);
		GalleryData.push(temp2);

		var minImgHeight = '200px';
		YQ_Gallery.generateGallery('#gallerySlider', GalleryData, function(e, id) {
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: id,
				CateNum: "066001",
				Title: "图片新闻"
			});
		}, {
			isLoop: true,
			isAuto: true,
			autoTime: 5000,
			//图片的最大高度,可以不传
			minImgHeight: minImgHeight,
			//如果是每一个item有多张图,那么决定每一行显示几张图
			perLineItem: 2,
			//是否显示下面的Indicator
			isShowIndicator: true,
		});
	}
	/**
	 * 点击查看详情
	 */
	Zepto(".mui-table-view").on('tap', 'li', function() {
		var id = this.id;
		WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
			InfoID: id,
			CateNum: "066001",
			Title: "图片新闻"
		});
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

	/**
	 * @description 请求失败回调方法
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function errorRequestCallback(xhr, type, errorThrown) {
		UIUtil.toast("请求超时,请检查网络连接...");
		UIUtil.closeWaiting();
	}

});