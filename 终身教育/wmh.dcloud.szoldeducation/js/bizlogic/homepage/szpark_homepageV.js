/**
 * 描述  子页面首页 
 * 作者 sunzl
 * 版本 1.0
 * 时间 2016-04-06 08:49:58
 */
define(function(require, exports, module) {
	"use strict";
	//首页刷新
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//UI初始化
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	//引入公共类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	//引入字符串类
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//引入页面窗体类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//引入轮播工具类
	var WidgetUtil = require('core/MobileFrame/WidgetUtil.js');
	//引入缓存工具类
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var url = config.ServerUrl + "getinfolist";
	var map = "";
	var itemsId = '';
	var isSave = '';
	//初始化默认显示第一个分类信息Guid和Name
	var IndexChannelGuid = null;
	var IndexChannelName = null;
	//默認轮播数据
	var GalleryData = [];
	var secretKey = "";
	var userSession;
	var userId = '';
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
		NoNetWorkTodoSomething();
		//初始化图片轮播
		initGalleryImgs();
		//获取地图分类信息
		getMapCategory();
		//初始化研习圈模块
		initHotCircleList();
		//初始化推荐课程模块
		initRecommandCourselist();
		//当无地图点信息
		//initMapInstance();
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
			//2.刷新地图分类
			//获取地图分类信息
			//getMapCategory();
			//初始化研习圈模块
			initHotCircleList();
			//初始化推荐课程模块
			initRecommandCourselist();
		},
		pullUpLoadType: 'none',
	});
	//初始化研习圈模块
	function initHotCircleList() {
		if(StorageUtil.getStorageItem("secretKey")) {
			secretKey = StorageUtil.getStorageItem("secretKey");
		};
		//var url = config.PCServerUrl + 'MobileHotCircleList'; //MobileHotCircleList
		var url = config.JServerUrl + 'circle/mobile/circle/HotCircleList';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("首页研习圈参数：" + requestData);
		console.log("首页研习圈地址：" + url);
		//UIUtil.showWaiting();  
		CommonUtil.ajax(url, requestData, function(response) {
			//UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, 1);
			//			if(response.code == "401" || response.code == 401) {
			//				//处理未登录
			//				LoginUtil.handleNotloggedin(response);
			//			} else 
			if(response.code == "1" || response.code == 1) {
				//console.log("换一批圈子XXX：" + JSON.stringify(response));
				var litemplate = '<li class="mui-table-view-cell mui-media mui-col-xs-6"id="{{cricleId}}"><div><img class="mui-media-object yanxiquan_img "data-img-localcache="{{image}}"><div class="content_yanxinquan"><span class="fs12">{{cricleName}}</span><br/><span class="fs12 memberandtiezi"><span>{{member}}</span>成员<span class="fs12"><span>{{theme}}</span></span>帖子</span></div></div></li>';
				var output = '';
				Zepto("#circlelistdata").html('');
				mui.each(response.data, function(key, value) {
					if(!value.image) {
						value.image = '../../img/MobileFrame/img_default_noimage130-130.png';
					}else{
						value.image = unescape(value.image);
					};
					value.cricleName = unescape(value.cricleName);
					output += Mustache.render(litemplate, value);
				});
				Zepto("#circlelistdata").append(output);
				//手动强制启动h5浏览器方式加载图片
				ImageLoaderFactory.lazyLoadAllImg(true);
			}
		}, function() {
			//UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey);
	};

	//首页研习圈列表项点击 事件
	Zepto("#circlelistdata").on('tap', 'li', function() {
		var circleId = this.id;
		LoginUtil.ResetTARGET_URL('szpark_circle_dynamics.html', {
			circleId: circleId
		});
		if(LoginUtil.isLoginSystem()) {
			//查看圈子详情信息
			WindowUtil.createWin("szpark_circle_dynamics.html", "../studycircle/szpark_circle_dynamics.html", {
				circleId: circleId
			});
		} else {
			UIUtil.confirm({
				content: "您还没有登录，请先去登录！", //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
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
				var litemplate = '<li class="mui-table-view-cell mui-media mui-col-xs-6" style="" id="{{id}}"><span class="starNum" id="{{resourceStarNum}}"></span><div><img class="mui-media-object"data-img-localcache="{{image}}"><div class="content"><span class="fs12">{{title}}</span><span class="starList" style="display: block;"><span class="suzhou_stars_unsellect"></span><span class="suzhou_stars_unsellect"></span><span class="suzhou_stars_unsellect"></span><span class="suzhou_stars_unsellect"></span><span class="suzhou_stars_unsellect"></span></span></div></div></li>';
				var output = '';
				Zepto("#coursedata").html('');
				mui.each(response.data, function(key, value) {
					if(!value.image) {
						value.image = '../../img/MobileFrame/img_error.jpg';
					}else{
						value.image = unescape(value.image);
					};
					output += Mustache.render(litemplate, value);
				});
				Zepto("#coursedata").append(output);
				//console.log("xxxxxxxxxxuserId" + userId);
				//判断视频资源的个数
				var _this = Zepto('#coursedata li');
				for(var i = 0; i < _this.length; i++) {
					//console.log("xxxxxxxxxxxx"+_this[i]);
					var starNum = Zepto(_this[i]).find('.starNum').attr('id');
					var _thisR = Zepto(_this[i]);
					if(starNum) {
						if(starNum > 0) {
							for(var j = 0; j < starNum; j++) {
								_thisR.find('.starList span').eq(j).removeClass('suzhou_stars_unsellect').addClass('suzhou_stars_sellected');
							}
						}
					} else {
						for(var j = 0; j < 3; j++) {
							_thisR.find('.starList span').eq(j).removeClass('suzhou_stars_unsellect').addClass('suzhou_stars_sellected');
						}
					}

				}
				//手动强制启动h5浏览器方式加载图片
				ImageLoaderFactory.lazyLoadAllImg(true);
				//监听事件
				Zepto("#coursedata").on('tap', 'li', function() {
					itemsId = this.id;
					console.log("xxxxxxxxxxxxx"+itemsId);
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
		WindowUtil.createWin('resource_center_preview_video.html', '../resourceCenter/resource_center_preview_video.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
		});
	});
	Zepto("#play").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
		LoginUtil.ResetTARGET_URL('resource_center_view_video.html', {
			itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
			type: 0
		});
		//选择播放之前，须用户登录才可以浏览进行视频播放
		if(LoginUtil.isLoginSystem()) {
			//console.log("是否收藏"+IsSave);
			WindowUtil.createWin('resource_center_view_video.html', '../resourceCenter/resource_center_view_video.html', {
				itemsId: itemsId, //"f54b6c0a-74f4-4055-8d3e-d592efea7dd1",
				type: 0
			});
		} else {
			//console.log("请先登录！");
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});
	Zepto("#cancle").on("tap", function() {
		CustomDialogUtil.hideCustomDialog('alertWin'); //隐藏自定义对话框
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
			catenum: "002004",
			isheadnews: "1",
			title: ""
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		console.log("轮播图片参数：" + requestData);
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
	 * 
	 */
	function successRequestGalleryImgsCallback(response) {
		//console.log("图片轮播请求结果\n" + JSON.stringify(response));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList.Info) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if(Array.isArray(infoArray)) {
					//判断是否是数组
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
					//一条数据时
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
				addGallery(GalleryData);
			}
		}
	};

	/**
	 * @description 添加轮播图片工具方法
	 * @param {Object} GalleryData
	 * @param {Object} netStatus
	 */
	function addGallery(GalleryData) {
		//有网络在线请求
		var maxHeight = '150px';
		WidgetUtil.GalleryFactory.addGalleryLandscape('#gallerySlider', GalleryData, function(e, id) {
			//var index = parseInt(id.replace('galleryImg', ''), 10)
			//console.log('点击图片轮播,id:' + id);
			WindowUtil.createWin('szpark_news_detail.html', '../news/szpark_news_detail.html', {
				InfoID: id,
				CateNum: "002004",
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
	}

	/**
	 * @description 请求失败回调方法
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function errorRequestCallback(xhr, type, errorThrown) {
		UIUtil.toast("请求超时,请检查网络连接...");
		UIUtil.closeWaiting();
		//addGallery(GalleryData);
	}
	/**
	 * @description 九宫格方块8个模块
	 */
	document.getElementById("school_servey").addEventListener('tap', function() {
		//学校概况
		WindowUtil.createWin('szpark_school_summary.html', 'szpark_school_summary.html');
	});
	document.getElementById("news_bulletin").addEventListener('tap', function() {
		if(CommonUtil.os.plus == true) {
			mui.plusReady(function() {
				//新闻公告
				var main = plus.webview.getWebviewById(plus.runtime.appid);
				mui.fire(main, 'plusChangeTab');
			});
		} else {
			window.parent.h5ChangeTab();
		}
	});
	document.getElementById("community_education").addEventListener('tap', function() {
		//社区教育
		WindowUtil.createWin('szpark_comeducation.html', 'szpark_comeducation.html');
	});
	document.getElementById("academic_education").addEventListener('tap', function() {
		//学历教育
		WindowUtil.createWin("szpark_academicEducation_index.html", "szpark_academicEducation_index.html");

	});
	document.getElementById("oldage_education").addEventListener('tap', function() {
		//老年教育
		WindowUtil.createWin('szpark_oldeducation_home.html', 'szpark_oldeducation_home.html');
	});
	document.getElementById("lifelong_education").addEventListener('tap', function() {
		//终身教育
		WindowUtil.createWin('szpark_alllife_education_index.html', 'szpark_alllife_education_index.html');
	});
	document.getElementById("resource_center").addEventListener('tap', function() {
		//资源中心
		WindowUtil.createWin('resource_center_index.html', '../resourceCenter/resource_center_index.html');
	});
	document.getElementById("study_circle").addEventListener('tap', function() {
		//记录登录成功之后跳转的页面
		LoginUtil.ResetTARGET_URL('szpark_study_circle.html');
		//研习圈
		if(LoginUtil.isLoginSystem()) {
			WindowUtil.createWin('szpark_study_circle.html', '../studycircle/szpark_study_circle.html');
		} else {
			UIUtil.confirm({
				content: "您还没有登录，请先去登录！", //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		}
	});
	/**
	 *@description 推荐课程module
	 */
	Zepto("#morecourse").on('tap', function() {
		//跳转到更多推荐课程列表页面---资源中心首页面
		WindowUtil.createWin("resource_center_index.html", "../resourceCenter/resource_center_index.html");
	});
	/**
	 *@description 换一批热门圈子
	 * */
	Zepto(".change_listdata").on('tap', function() {
		//跳转到更多推荐课程列表页面
		initHotCircleList();
	});
	//更多按钮
	Zepto('#maps').on('tap', function() {
		//地图
		WindowUtil.createWin('spark_map.html', 'spark_map.html', {
			//初始化默认显示第一个分类信息Guid和Name
			categoryguid: IndexChannelGuid,
			ChannelName: IndexChannelName
		});
	});

	//地图分类点击事件
	Zepto("#sliderSegmentedControl1").on('tap', 'a', function() {
		Zepto(this).addClass("mui-active1").siblings().removeClass("mui-active1");
		//console.log("地图分类categoryguid: " + this.id);
		//console.log("地图分类名称ChannelName " + Zepto(this).text());
		var ChannelName = Zepto(this).text();
		var categoryguid = this.href;
		var index = categoryguid.indexOf("#");
		categoryguid = categoryguid.substr(index + 1);
		//获取位置之前，先清除覆盖物
		if(CommonUtil.IsNetWorkCanUse()) {
			map.clearOverlays();
			map = new BMap.Map("map");
		} else {
			console.log("没有网络！");
		}
		getMapsLocationInfo(categoryguid)

	});
	//获取信息类别mapscategory
	function getMapCategory() {
		//var url = config.ServerUrl + 'mapscategory';
		var url = "http://221.224.167.154/WebBuilderMobileService/appservice/mapscategory";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		if(CommonUtil.IsNetWorkCanUse()) {
			mui.ajax(url, {
				data: requestData,
				dataType: "json",
				timeout: "15000", //超时时间设置为3秒；
				type: "POST",
				success: successAjaxMapCategoryInfo,
				error: function() {
					UIUtil.toast('网络连接超时！请检查网络...');
				}
			});
		} else {
			//console.log("没有网络使用缓存");
			//console.log("缓存数据" + StorageUtil.getStorageItem("KEY_MapInfoSession2"));
			successAjaxMapCategoryInfo(StorageUtil.getStorageItem("KEY_MapInfoSession2"))
		}
	}
	//成功获取地图分类信息回调
	function successAjaxMapCategoryInfo(response) {
		console.log(unescape(JSON.stringify(response)));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(CommonUtil.IsNetWorkCanUse()) {
				//将结果存入缓存
				StorageUtil.OffLineAppCache.addOffLineCache("KEY_MapInfoSession2", response);
				//console.log("是否存在离线缓存"+StorageUtil.OffLineAppCache.IsHasOffLineCache("KEY_MapInfoSession1"));;
				//console.log("离线缓存数据为："+JSON.stringify(StorageUtil.getStorageItem("KEY_MapInfoSession1")));
			}
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsList) {
				//var responseE = '.wuzhou_map_tab';
				var responseE = '#sliderSegmentedControl1';
				var responseEContent = '#mui-slider-item-content';
				var litemplate = '<a class="mui-control-item"href="#{{ChannelGuid}}"><img src="../../img/educate/img_activity.png"class="image_icon"/>{{ChannelName}}</a>';
				var litemplateContent = '<div id="{{ChannelGuid}}"class="mui-slider-item mui-control-content"></div>';
				var InfoArray = response.EpointDataBody.DATA.UserArea.MapsList;
				Zepto(responseE).html('');
				Zepto(responseEContent).html('');
				if(Array.isArray(InfoArray)) {
					//初始化，获取收个地图分类guid和分类name
					IndexChannelGuid = InfoArray[0].ChannelGuid;
					IndexChannelName = unescape(InfoArray[0].ChannelName);
					//默认获取第一个分类的地图点信息，进行展示
					getMapsLocationInfo(IndexChannelGuid);
					//console.log("indexguid"+IndexChannelGuid);
					mui.each(InfoArray, function(key, value) {
						value.ChannelName = unescape(value.ChannelName);
						var output = Mustache.render(litemplate, value);
						Zepto(responseE).append(output);
						var output2 = Mustache.render(litemplateContent, value);
						Zepto(responseEContent).append(output2);
					});
					//动态设置sliderSegmentedControl1的宽度
					//console.log("分类个数计算总长度：" + InfoArray.length)
					Zepto("#sliderSegmentedControl1").css('width', 78 * (InfoArray.length + 0.5));
				} else {
					IndexChannelGuid = InfoArray.ChannelGuid;
					IndexChannelName = unescape(InfoArray.ChannelName);
					InfoArray.ChannelName = unescape(InfoArray.ChannelName);
					var output = Mustache.render(litemplate, InfoArray);
					Zepto(responseE).append(output);
					//默认获取第一个分类的地图点信息，进行展示
					getMapsLocationInfo(IndexChannelGuid);
				}
			}
		}
	};
	//获取分类下地图点信息
	function getMapsLocationInfo(categoryguid) {
		//var url = config.ServerUrl + "mapslocation";
		var url = "http://221.224.167.154/WebBuilderMobileService/appservice/mapslocation";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			pageindex: "0", //地图点分页初始页
			pagesize: "10", //地图点分页总页数
			categoryguid: categoryguid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		console.log("获取地图点：" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: successAjaxMapLocation,
			error: function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}
		});
	};
	//请求地图点信息成功回调
	function successAjaxMapLocation(response) {
		//initMapInstance();
		console.log("地图点信息" + JSON.stringify(response));
		if(response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.MapsLocationList) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.MapsLocationList;
				if(Array.isArray(infoArray)) {
					mui.each(infoArray, function(key, value) {
						//null值，用“暂无”替换
						IsInfoEmpty(value);
						//将类别里的所有的地图点信息添加到地图中去
						//console.log("正在加载地图数据(" + ((((key + 1) / (infoArray.length).toFixed(2) * 100))).toFixed(0) + "%)");
						//UIUtil.showWaiting("初始化数据(" + ((((key + 1) / (infoArray.length).toFixed(2) * 100))).toFixed(0) + "%)");
						//if(parseInt(key + 1) == parseInt(infoArray.length)) {
						//UIUtil.closeWaiting();
						//console.log("加载完毕！");
						//}
						addComplexInfoWindowToMarker({
							lnt: value.Longitude, //经度
							lat: value.Dimension, //纬度
							LocationName: unescape(value.LocationName),
							Address: unescape(value.Address),
							Tel: value.Tel,
							Intro: unescape(value.Intro),
							Link: value.Link,
							PostPic: value.PicUrl
						});
					});
				} else {
					infoArray.LocationName = unescape(infoArray.LocationName);
					//null值，用“暂无”替换
					IsInfoEmpty(infoArray);
					//将类别里的所有的地图点信息添加到地图中去
					addComplexInfoWindowToMarker({
						lnt: infoArray.Longitude, //经度
						lat: infoArray.Dimension, //纬度
						LocationName: unescape(infoArray.LocationName),
						Address: unescape(infoArray.Address),
						Tel: infoArray.Tel,
						Intro: unescape(infoArray.Intro),
						Link: infoArray.Link,
						PostPic: infoArray.PicUrl
					});
				}
			} else {
				console.log("UserArea数据域为空！");
				initMapInstance();
			}
		} else {
			console.error("获取数据状态为False");
		}
	}
	/***
	 * 非PLUS状态下，添加覆盖物
	 * @description 添加覆盖物
	 */
	function addComplexInfoWindowToMarker(MarkerJsonData) {
		if(CommonUtil.IsNetWorkCanUse()) {
			// 初始化地图,设置中心点坐标和地图级别
			if(!MarkerJsonData.lnt || !MarkerJsonData.lat) {
				//坐标不存在
				map.centerAndZoom(new BMap.Point(120.589613, 31.3058), 10);
			} else {
				//坐标存在
				map.centerAndZoom(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat), 12);
			}
			//map.centerAndZoom(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat), 12);
			//../../img/homepage/img_map_marker_icon.png
			var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
				// 指定定位位置。   
				// 当标注显示在地图上时，其所指向的地理位置距离图标左上    
				// 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
				// 图标中央下端的尖角位置。    
				offset: new BMap.Size(10, 25),
				// 设置图片偏移。   
				// 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
				// 需要指定大图的偏移位置，此做法与css sprites技术类似。    
				imageOffset: new BMap.Size(0, 0 - index * 25) // 设置图片偏移    
			});
			var marker = new BMap.Marker(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat)); // , {icon: myIcon}创建标注覆盖物
			map.addOverlay(marker); // 将标注添加到地图中
			//marker.disableDragging(); // 不可拖拽
			//设置标签
			setLableForMarker(marker, MarkerJsonData);
			//开启鼠标滚轮缩放
			map.enableScrollWheelZoom(true);
			addComplexInfoWindow(marker, MarkerJsonData);
		}
	};

	//给覆盖物设置标签
	function setLableForMarker(marker, MarkerJsonData) {
		var label = new BMap.Label(MarkerJsonData.LocationName, {
			offset: new BMap.Size(20, -10)
		});
		label.setStyle({ //给label设置样式，任意的CSS都是可以的
			color: "black",
			fontSize: "12px",
			//height: "20px",
			lineHeight: "20px",
			fontFamily: "微软雅黑"
		});
		marker.setLabel(label);
	};

	/*
	 * 添加复杂信息窗口	
	 */
	function addComplexInfoWindow(marker, MarkerJsonData) {
		// 拼接html字符串
		var sContent = '<div class="mui-scroll-wrapper"style="height:200px; overflow-y:scroll;position:absolute; margin-top: 10px;">' + '<div class="mui-scroll">'
			//<!--这里放置真实显示的DOM内容-->
			+
			"<div>" + "<h5 id='LocationName' style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;font-size:16px;font-weight:800'>" + MarkerJsonData.LocationName + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'><span class='mui-icon mui-icon-location'></span>" + MarkerJsonData.Address + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'><span class='mui-icon mui-icon-phone' style='color:#4d4d4d;'></span>" + MarkerJsonData.Tel + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'>链接：" + "<a id='link' href='#'>" + MarkerJsonData.Link + "</a>" + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#7f7f7f;word-wrap: break-word;'>简介：" + MarkerJsonData.Intro + "</h5>" + "<img style='' id='imgDemo' src='" + MarkerJsonData.PostPic + "' width='90' height='90'title=''/>" + "</div>" + "</div>" + "</div>";
		//添加弹出窗
		var opts = {
			width: 200, // 信息窗口宽度
			height: 200, // 信息窗口高度
			//title: MarkerJsonData.LocationName, // 信息窗口标题
			//enableMessage: false, //设置允许信息窗发送短息
			//message: "欢迎来到西安美林电子有限责任公司就职..." // 信息内容
		};
		var infoWindow = new BMap.InfoWindow(sContent, opts); //创建信息窗口对象

		marker.addEventListener("click", function() {
			// 调用了marker对象的openInfoWindow方法
			this.openInfoWindow(infoWindow);
			//图片加载完毕重绘infowindow
			document.getElementById('imgDemo').onload = function() {
				infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
			}
			document.getElementById('link').onclick = function() {
				//console.log(document.getElementById('link').innerText);
				var linkUrl = document.getElementById('link').innerText;
				var LocationName = document.getElementById('LocationName').innerText;
				WindowUtil.createWin("szpark_oldeducation_HotInfomationShow.html", 'szpark_oldeducation_HotInfomationShow.html', {
					HotInfoURL: linkUrl,
					Title: LocationName
				});
			};
		});
	}
	//判断地址信息是否为空
	function IsInfoEmpty(data) {
		if(!data.LocationName) {
			data.LocationName = "暂无";
		}
		if(!data.Tel) {
			data.Tel = "暂无";
		}
		if(!data.Link) {
			data.Link = "暂无";
		}
		if(!data.Intro) {
			data.Intro = "暂无";
		}
	}
	/**
	 * 获取登录信息后，刷新研习圈以及课程列表信息
	 */
	window.addEventListener('refreshCircleOrCourseInfoList', function(e) {
		if(e.detail.SecretKey) {
			secretKey = e.detail.SecretKey;
		}
		console.log("登录成功之后，刷新首页研习圈和推荐课程！");
		//WindowUtil.firePageEvent("szpark_homepageV.html", "refreshListPage");
		initHotCircleList();
		//初始化推荐课程模块
		//console.log("1111111111111111111111111111" + JSON.stringify(userSession));
		initRecommandCourselist();

	});
	//初始化地图信息
	function initMapInstance() {
		// 百度地图API功能
		var map = new BMap.Map("map");
		var point = new BMap.Point(120.589613, 31.3058);
		map.centerAndZoom(point, 12);
	}
	//初始化无网络状态下
	function NoNetWorkTodoSomething() {
		if(CommonUtil.IsNetWorkCanUse()) {
			//初始化覆盖物信息
			map = new BMap.Map("map");
		} else {
			console.error("无网络状态下，无法初始化地图！");
		}
	}

	//子页面处理侧滑菜单问题
	var index = null; //主页面
	function openMenu() {
		!index && (index = mui.currentWebview.parent());
		mui.fire(index, "menu:open");
	}
	//在android4.4.2中的swipe事件，需要preventDefault一下，否则触发不正常
	window.addEventListener('dragstart', function(e) {
		mui.gestures.touch.lockDirection = true; //锁定方向
		mui.gestures.touch.startDirection = e.detail.direction;
	});
	window.addEventListener('dragright', function(e) {
		if(!mui.isScrolling) {
			e.detail.gesture.preventDefault();
		}
	});
	//监听右滑事件，若侧滑菜单未显示，右滑要显示菜单；
	window.addEventListener("swiperight", function(e) {

		//默认滑动角度在-45度到45度之间，都会触发右滑菜单，为避免误操作，可自定义限制滑动角度；
		if(Math.abs(e.detail.angle) < 4) {
			openMenu();
		}
	});

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
			//console.log("resize");
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
			//iphone4s safari浏览器 分辨率 320*480    横屏宽度：480px  竖屏宽度：320px
			//我的华为手机qq浏览器： 360*598                            横屏宽度：598px  竖屏宽度：360px
			//iphone 6 plus 浏览器 414*          横屏宽度:736px  竖屏宽度：414px
			if(winWidth >= 480) {
				//console.log("横屏");
				//alert("横屏"+winWidth);
				document.getElementById("gallerySlider").style.display = 'none';
			} else {
				//console.log("竖屏");
				//alert("竖屏"+winWidth);
				document.getElementById("gallerySlider").style.display = 'block';
			}
		};
	})();
});