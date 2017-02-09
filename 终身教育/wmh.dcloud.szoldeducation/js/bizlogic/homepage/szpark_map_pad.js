/**
 * 描述  地图页面
 * 作者 戴科
 * 时间 2016-04-07 08:49:58
 */
define(function(require, exports, module) {
	"use strict"

	var sparkmap = '';
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var DynamicTemplateUtil = require('core/MobileFrame/DynamicTemplateUtil');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	//缓存处理
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	//地图分类Guid
	var categoryguid = null;
	//地图分类名称
	var ChannelName = null;
	//初始化默认显示第一个分类信息Guid和Name
	var IndexChannelGuid = null;
	var IndexChannelName = null;
	CommonUtil.initReady(function() {
		//无网络状态下
		NoNetWorkTodoSomething();
		//初始化地图列表滚动
		mui('#scroll').scroll({
			indicators: true //是否显示滚动条
		});
		//获取地图分类（学习教育、医疗健康、公共服务等）
		getMapCategory();
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
			UIUtil.showWaiting();
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
	};
	//成功获取地图分类信息回调
	function successAjaxMapCategoryInfo(response) {
		UIUtil.closeWaiting();
		//console.log("分类" + unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsList) {
				var responseE = '#sliderSegmentedControl2';
				var responseEContent = '#mui-slider-item-content';
				var litemplate = '<a class="mui-control-item"href="#{{ChannelGuid}}"><img src="../../img/educate/img_activity.png"class="image_icon"/>{{ChannelName}}</a>';
				var litemplateContent = '<div id="{{ChannelGuid}}"class="mui-slider-item mui-control-content"></div>';
				var InfoArray = response.EpointDataBody.DATA.UserArea.MapsList;
				Zepto(responseE).html('');
				Zepto(responseEContent).html('');
				if (Array.isArray(InfoArray)) {
					//初始化，获取收个地图分类guid和分类name
					var IndexChannelGuid = InfoArray[0].ChannelGuid;
					Zepto(".suzhou_sectitle").text("全部分类>" + unescape(InfoArray[0].ChannelName));
					//默认获取第一个分类的地图点信息，进行展示
					getMapsLocationInfo(IndexChannelGuid);
					mui.each(InfoArray, function(key, value) {
						value.ChannelName = unescape(value.ChannelName);
						var output = Mustache.render(litemplate, value);
						Zepto(responseE).append(output);
						var output2 = Mustache.render(litemplateContent, value);
						Zepto(responseEContent).append(output2);
						Zepto('.mui-slider-item').first().addClass('mui-active');
					});
				} else {
					//初始化，获取收个地图分类guid和分类name
					var IndexChannelGuid = InfoArray.ChannelGuid;
					InfoArray.ChannelName = unescape(InfoArray.ChannelName);
					Zepto(".suzhou_sectitle").text("全部分类>" + InfoArray.ChannelName);
					var output = Mustache.render(litemplate, InfoArray);
					Zepto(responseE).append(output);
					//默认获取第一个分类的地图点信息，进行展示
					getMapsLocationInfo(IndexChannelGuid);
				}
			} else {
				//暂无地图点信息
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
		if (CommonUtil.IsNetWorkCanUse()) {
			UIUtil.showWaiting();
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
		} else {
			//console.log("没有网络使用缓存");
			//console.log("缓存数据" + StorageUtil.getStorageItem("KEY_MapLocation"));
			successAjaxMapLocation(StorageUtil.getStorageItem("KEY_MapLocation"))
		}
	};
	//请求地图点信息成功回调
	function successAjaxMapLocation(response) {
		UIUtil.closeWaiting();
		console.log("分类下地图点详情" + unescape(JSON.stringify(response)));
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (CommonUtil.IsNetWorkCanUse()) {
				//将结果存入缓存
				StorageUtil.OffLineAppCache.addOffLineCache("KEY_MapLocation", response);
				//console.log("是否存在离线缓存"+StorageUtil.OffLineAppCache.IsHasOffLineCache("KEY_MapLocation"));;
				//console.log("离线缓存数据为："+JSON.stringify(StorageUtil.getStorageItem("KEY_MapLocation")));
			}
			var responseE = '#mapslocationList';
			var litemplate = '<li class="spark_map_cell"id="{{LocationGuid}}"><div class="suzhou_content"><div class="map_title"><i class="iconA"></i>{{LocationName}}</div><div class="suzhou_grey">{{Address}}</div></div></li>';
			Zepto(responseE).html('');
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsLocationList) {
				//隐藏提示字样“暂无地图信息”
				Zepto(".noMapTis").hide();
				Zepto(".noMapTis").text("");
				var infoArray = response.EpointDataBody.DATA.UserArea.MapsLocationList;
				if (Array.isArray(infoArray)) {
					mui.each(infoArray, function(key, value) {
						//目前已经显示所有的地图点信息
						value.LocationName = unescape(value.LocationName);
						value.Address = unescape(value.Address);
						var output = Mustache.render(litemplate, value);
						//console.log(output);
						Zepto(responseE).append(output);
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
					infoArray.Address = unescape(infoArray.Address);
					var output = Mustache.render(litemplate, infoArray);
					Zepto(responseE).append(output);
					//null值，用“暂无”替换
					IsInfoEmpty(infoArray);
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
				Zepto(".noMapTis").show();
				Zepto(".noMapTis").text("暂无地图信息");
				initMapInstance();
			}
		}
	};
	//获取分类下地图点信息
	function getMapsLocationDetails(locationguid) {
		var url = config.ServerUrl + "locationdetails";
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			locationguid: locationguid
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		//console.log(requestData);
		UIUtil.showWaiting();
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UIUtil.closeWaiting();
				console.log("地图点详情" + unescape(JSON.stringify(response)));
				if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
					if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.MapsLocationDetails) {
						var MapDetails = response.EpointDataBody.DATA.UserArea.MapsLocationDetails;
						console.log(unescape(JSON.stringify(MapDetails)));
						//null值，用“暂无”替换
						IsInfoEmpty(MapDetails);
						addComplexInfoWindowToMarker({
							lnt: MapDetails.Longitude, //经度
							lat: MapDetails.Dimension, //纬度
							LocationName: unescape(MapDetails.LocationName),
							Address: unescape(MapDetails.Address),
							Tel: MapDetails.Tel,
							Intro: unescape(MapDetails.Intro),
							Link: MapDetails.Link,
							PostPic: MapDetails.PicUrl
						});
					}
				}
			},
			error: function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}
		});
	};
	//地图分类点击事件
	Zepto("#sliderSegmentedControl2").on('tap', 'a', function() {
		Zepto(this).addClass("mui-active1").siblings().removeClass("mui-active1");
		//添加地图覆盖物时，首先清空覆盖物，再去添加覆盖物,避免重复添加
		if (sparkmap) {
			sparkmap.clearOverlays();
			sparkmap = new BMap.Map("map");
		}
		var ChannelName = Zepto(this).text();
		Zepto(".suzhou_sectitle").text("全部分类>" + ChannelName);
		var categoryguid = this.href;
		var index = categoryguid.indexOf("#");
		categoryguid = categoryguid.substr(index + 1);
		getMapsLocationInfo(categoryguid);
	});

	Zepto("#mapslocationList").on('tap', 'li', function() {
		console.log("地图点" + this.id);
		if (CommonUtil.IsNetWorkCanUse()) {
			sparkmap.clearOverlays();
			sparkmap = new BMap.Map("map");
		}
		var locationguid = this.id;
		getMapsLocationDetails(locationguid);
	});
	//获取用户位置并且设置为地图中心
	function userLocation() {
		sparkmap.showUserLocation(true);
		sparkmap.getUserLocation(function(state, pos) {
			if (0 == state) {
				sparkmap.centerAndZoom(pos, 16);
			}
		});
	};
	//初始化地图信息
	function initMapInstance() {
		// 百度地图API功能
		var map = new BMap.Map("map");
		var point = new BMap.Point(120.589613, 31.3058);
		map.centerAndZoom(point, 12);
	}

	/***
	 * 非PLUS状态下，添加覆盖物
	 * @description 添加覆盖物
	 */
	function addComplexInfoWindowToMarker(MarkerJsonData) {
		if (CommonUtil.IsNetWorkCanUse()) {
			// 初始化地图,设置中心点坐标和地图级别
			var marker = new BMap.Marker(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat)); // 创建标注覆盖物
			sparkmap.centerAndZoom(new BMap.Point(MarkerJsonData.lnt, MarkerJsonData.lat), 12);
			sparkmap.addOverlay(marker); // 将标注添加到地图中
			//marker.disableDragging(); // 不可拖拽
			//设置标签
			setLableForMarker(marker, MarkerJsonData);
			//开启鼠标滚轮缩放
			sparkmap.enableScrollWheelZoom(true);
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
		var sContent = '<div class="mui-scroll-wrapper"style="margin-top: 10px;overflow-y:scroll;position:absolute;">' + '<div class="mui-scroll">'
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
	//判断无网络状态下
	function NoNetWorkTodoSomething() {
		if (!CommonUtil.IsNetWorkCanUse()) {
			Zepto("#map").text("没有网络！");;
			Zepto("#map").css("padding-top", "50%");
			Zepto("#map").css("text-align", "center");
			Zepto("#map").css("color", "#7f7f7f");
			Zepto("#map").css('font-weight', "800");
			Zepto(".suzhou_sectitle").hide();
		} else {
			//初始化覆盖物信息
			sparkmap = new BMap.Map("map");
		}
	}

});