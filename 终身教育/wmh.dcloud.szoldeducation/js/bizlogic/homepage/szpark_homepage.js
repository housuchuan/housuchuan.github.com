/**
 * 描述  子页面首页 
 * 作者 sunzl
 * 版本 1.0
 * 时间 2016-04-06 08:49:58
 */
define(function(require, exports, module) {
	"use strict"
	//首页刷新
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	//UI初始化
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//引入公共类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	//引入字符串类
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	//引入页面窗体类
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//引入轮播工具类
	var WidgetUtil = require('core/MobileFrame/WidgetUtil.js');
	//引入缓存工具类
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var url = config.ServerUrl + "getinfolist";
	var map = "";
	//初始化默认显示第一个分类信息Guid和Name
	var IndexChannelGuid = null;
	var IndexChannelName = null;
	//默認轮播数据
	var GalleryData = [];
	CommonUtil.initReady(function() {
		NoNetWorkTodoSomething();
		//初始化图片轮播
		initGalleryImgs();
		//获取地图分类信息
		getMapCategory();
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
			getMapCategory();
		},
		pullUpLoadType: 'none',
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
	 * 
	 */
	function successRequestGalleryImgsCallback(response) {
		//console.log("图片轮播请求结果\n" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList.Info) {
				var infoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				if (Array.isArray(infoArray)) {
					//判断是否是数组
					mui.each(infoArray, function(key, value) {
						//如果轮播图片为空，则默认一张未上传图片
						if (value.HeadNewsAttachUrl == null || value.HeadNewsAttachUrl == "") {
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
					if (infoArray.HeadNewsAttachUrl == null || infoArray.HeadNewsAttachUrl == "") {
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
		if (CommonUtil.os.plus == true) {
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

	});
	document.getElementById("study_circle").addEventListener('tap', function() {
		//研习圈
		//WindowUtil.createWin('szpark_study_circle.html', '../studycircle/szpark_study_circle.html');
		WindowUtil.createWin('szpark_study_circle.html', '../studycircle/szpark_study_circle.html');
	});
	/**
	 *@description 推荐课程module
	 */
	Zepto("#morecourse").on('tap', function() {
		//跳转到更多推荐课程列表页面
		//console.log("正在跳转页面...");
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
		if (CommonUtil.IsNetWorkCanUse()) {
			map.clearOverlays();
			map = new BMap.Map("map");
		} else {
			console.log("没有网络！");
		}
		getMapsLocationInfo(categoryguid)

	});
	//获取信息类别mapscategory
	function getMapCategory() {
		var url = config.ServerUrl + 'mapscategory';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		if (CommonUtil.IsNetWorkCanUse()) {
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
		//console.log(unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (CommonUtil.IsNetWorkCanUse()) {
				//将结果存入缓存
				StorageUtil.OffLineAppCache.addOffLineCache("KEY_MapInfoSession2", response);
				//console.log("是否存在离线缓存"+StorageUtil.OffLineAppCache.IsHasOffLineCache("KEY_MapInfoSession1"));;
				//console.log("离线缓存数据为："+JSON.stringify(StorageUtil.getStorageItem("KEY_MapInfoSession1")));
			}
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsList) {
				//var responseE = '.wuzhou_map_tab';
				var responseE = '#sliderSegmentedControl1';
				var responseEContent = '#mui-slider-item-content';
				var litemplate = '<a class="mui-control-item"href="#{{ChannelGuid}}"><img src="../../img/educate/img_activity.png"class="image_icon"/>{{ChannelName}}</a>';
				var litemplateContent = '<div id="{{ChannelGuid}}"class="mui-slider-item mui-control-content"></div>';
				var InfoArray = response.EpointDataBody.DATA.UserArea.MapsList;
				Zepto(responseE).html('');
				Zepto(responseEContent).html('');
				if (Array.isArray(InfoArray)) {
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
		var url = config.ServerUrl + "mapslocation";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			pageindex: "0",//地图点分页初始页
			pagesize: "10",//地图点分页总页数
			categoryguid: categoryguid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		//console.log(requestData);
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
		//console.log("地图点信息" + JSON.stringify(response));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsLocationList) {
				var infoArray = response.EpointDataBody.DATA.UserArea.MapsLocationList;
				if (Array.isArray(infoArray)) {
					mui.each(infoArray, function(key, value) {
						//null值，用“暂无”替换
						IsInfoEmpty(value);
						//将类别里的所有的地图点信息添加到地图中去
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
		if (CommonUtil.IsNetWorkCanUse()) {
			// 初始化地图,设置中心点坐标和地图级别
			map.centerAndZoom(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat), 12);
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
			+ "<div>" + "<h5 id='LocationName' style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;font-size:16px;font-weight:800'>" + MarkerJsonData.LocationName + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'><span class='mui-icon mui-icon-location'></span>" + MarkerJsonData.Address + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'><span class='mui-icon mui-icon-phone' style='color:#4d4d4d;'></span>" + MarkerJsonData.Tel + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#4d4d4d;word-wrap: break-word;'>链接：" + "<a id='link' href='#'>" + MarkerJsonData.Link + "</a>" + "</h5>" + "<h5 style='margin:0 0 5px 0;padding:0.2em 0;color:#7f7f7f;word-wrap: break-word;'>简介：" + MarkerJsonData.Intro + "</h5>" + "<img style='' id='imgDemo' src='" + MarkerJsonData.PostPic + "' width='90' height='90'title=''/>" + "</div>" + "</div>" + "</div>";
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
		if (!data.LocationName) {
			data.LocationName = "暂无";
		}
		if (!data.Tel) {
			data.Tel = "暂无";
		}
		if (!data.Link) {
			data.Link = "暂无";
		}
		if (!data.Intro) {
			data.Intro = "暂无";
		}
	}
	//初始化地图信息
	function initMapInstance() {
		// 百度地图API功能
		var map = new BMap.Map("map");
		var point = new BMap.Point(120.589613, 31.3058);
		map.centerAndZoom(point, 12);
	}
	//初始化无网络状态下
	function NoNetWorkTodoSomething() {
		if (CommonUtil.IsNetWorkCanUse()) {
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
		if (!mui.isScrolling) {
			e.detail.gesture.preventDefault();
		}
	});
	//监听右滑事件，若侧滑菜单未显示，右滑要显示菜单；
	window.addEventListener("swiperight", function(e) {

		//默认滑动角度在-45度到45度之间，都会触发右滑菜单，为避免误操作，可自定义限制滑动角度；
		if (Math.abs(e.detail.angle) < 4) {
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
			console.log("resize");
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
			//iphone4s safari浏览器 分辨率 320*480    横屏宽度：480px  竖屏宽度：320px
			//我的华为手机qq浏览器： 360*598                            横屏宽度：598px  竖屏宽度：360px
			//iphone 6 plus 浏览器 414*          横屏宽度:736px  竖屏宽度：414px
			if (winWidth >= 480) {
				console.log("横屏");
				//alert("横屏"+winWidth);
				document.getElementById("gallerySlider").style.display='none';
			} else {
				console.log("竖屏");
				//alert("竖屏"+winWidth);
				document.getElementById("gallerySlider").style.display='block';
			}
		};
	})();
});