/**
 * 作者: housc
 * 时间: 2017-01-04
 * 描述: 首页数据交互
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var UITools = require('UITools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var ImageLoaderTools = require('ImageLoaderTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefresh1;
	var pageSize = 200;
	var TotalCount = 0;
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/core/sea.min.js',
			'js/libs/jquery-1.8.3.min.js',
			'js/libs/epoint.moapi.v2.js',
			'js/libs/jquery.flipster.js', //3d轮播图
			'js/libs/marqueescroll.min.js' //热点新闻滚动
		], function() {
			//请求app应用
			ajaxAppList();
			//智慧校园数据初始化下拉刷新
			setTimeout(function(){
				//图片轮播请求数据
				ajaxPhototAutoPlay();
			},3000);
			initListners();
		});
	}
	var picStart = function() {
		jQuery("#flipster").flipster({
			itemContainer: 'ul', // Container for the flippin' items.
			itemSelector: 'li', // Selector for children of itemContainer to flip
			style: 'carousel', // Switch between 'coverflow' or 'carousel' display styles
			start: 0, // Starting item. Set to 0 to start at the first, 'center' to start in the middle or the index of the item you want to start with.

			enableKeyboard: true, // Enable left/right arrow navigation
			enableMousewheel: true, // Enable scrollwheel navigation (up = left, down = right)
			enableTouch: true, // Enable swipe navigation for touch devices

			enableNav: true, // If true, flipster will insert an unordered list of the slides
			enableNavButtons: true, // If true, flipster will insert Previous / Next buttons

			onItemSwitch: function() {}, // Callback function when items are switches
		});
	};

	//左右栏目切换app
	var sliderApp = function() {
		var slider = document.getElementById('Gallery');
		var group = slider.querySelector('.mui-slider-group');
		var items = mui('.mui-slider-item', group);
		//克隆第一个节点
		var first = items[0].cloneNode(true);
		first.classList.add('mui-slider-item-duplicate');
		//克隆最后一个节点
		var last = items[items.length - 1].cloneNode(true);
		last.classList.add('mui-slider-item-duplicate');
		//处理是否循环逻辑，若支持循环，需支持两点：
		//1、在.mui-slider-group节点上增加.mui-slider-loop类
		//2、重复增加2个循环节点，图片顺序变为：N、1、2...N、1
		var sliderApi = mui(slider).slider();

		function toggleLoop(loop) {
			if(loop) {
				group.classList.add('mui-slider-loop');
				group.insertBefore(last, group.firstChild);
				group.appendChild(first);
				sliderApi.refresh();
				sliderApi.gotoItem(0);
			} else {
				group.classList.remove('mui-slider-loop');
				group.removeChild(first);
				group.removeChild(last);
				sliderApi.refresh();
				sliderApi.gotoItem(0);
			}
		}
		toggleLoop(true);
	};

	//初始化监听
	function initListners() {
		//懒加载  调用的时候会自动检查一遍
		//之后每当窗口滚动时检查
		ImageLoaderTools.lazyLoadAllImg();
		mui.init();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: false, //是否显示滚动条
			deceleration: deceleration
		});

		//应用点击
		mui('#Gallery').on('tap', '.application', function() {
			var src = jQuery(this).find('span').css('backgroundImage'),
				len = src.length,
				realSrc = src.substring(5, len - 2);
			var extra = jQuery(this).find('.extra').attr('id');
			var jsonObj = {
				infoID: this.id,
				ImgSrc: realSrc,
				extra: extra
			};
			//console.log("xxx"+extra);
			ejs.page.openPage("html/bizlogic-application/application-detail.html", "应用详情", jsonObj, {});
		});

		//热点新闻主栏目点击
		jQuery('#hotNews').on('tap', function() {
			ejs.page.openPage("html/bizlogic-homepage/info-list.html", "热点新闻", {
				cateNum: '002001'
			});
		});

		//热点新闻点击
		jQuery('.marqueelist').on('tap', 'p', function() {
			var id = this.id;
			ejs.page.openPage("html/bizlogic-homepage/info-detail.html", "详情", {
				infoId: id,
				cateNum: '002001'
			});
		});

		//教育资讯主栏目点击
		jQuery('.education-hd h5').on('tap', function() {
			ejs.page.openPage("html/bizlogic-homepage/info-list.html", "教育资讯", {
				cateNum: '002002'
			});
		});

		//教育资讯点击
		jQuery('#listdata1').on('tap', 'li', function() {
			var id = this.id;
			var cateNum = jQuery(this).find('.CateNum').attr('id');
			ejs.page.openPage("html/bizlogic-homepage/info-detail.html", "详情", {
				infoId: id,
				cateNum: '002002'
			});
		});
	};

	//请求轮播图数据
	/**
	 * @description 请求图片轮播数据
	 */
	function ajaxPhototAutoPlay() {
		var url = config.serverUrl + 'GetInfoListWithImageGuid';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			currentpageindex: 0,
			pagesize: 100,
			catenum: '002003',
			isheadnews: 1,
			title: '',
			bigimgwidth: 200,
			bigimgheight: 150,
			smallimgwidth: 200,
			smallimgheight: 150
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log("" + url + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				//console.log("xxxxxxxxxxxx"+JSON.stringify(response));
				$('.flip-items').html('');
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				var litemplate = '<li id="Coverflow-1"title="Cricket"data-flip-category="Fun Sports"><span id="{{InfoID}}"class="InfoID"></span><span id="{{"HeadNewsAttachGuid}}" class=""HeadNewsAttachGuid"></span><img data-img-localcache="{{BigImgUrl}}"><div>{{Title}}</div></li>';
				var output = '';
				if(response.EpointDataBody.DATA.UserArea.InfoList) {
					if(Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
						mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
							value.Title = unescape(value.Title);
							output += Mustache.render(litemplate, value);
						});
					} else {
						response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
						output += Mustache.render(litemplate, response.EpointDataBody.DATA.UserArea.InfoList.Info);
					}
				};
				$('.flip-items').append(output);
				//初始化图片轮播
				picStart();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	/**
	 * @description app应用
	 */
	var ajaxAppList = function() {
		var url = config.serverUrl + 'getinfolistepic'; //getinfolistepic?GetInfoListWithImageGuid
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			currentpageindex: 0,
			pagesize: 100,
			catenum: '003001',
			isheadnews: 1,
			title: '',
			fieldname: '来源',
			typename: '应用辅助信息',
			bigimgwidth: 100,
			bigimgheight: 100,
			smallimgwidth: 100,
			smallimgheight: 100
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//console.log("xxxxxxxx" + url + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				var clickMore = '<li class="more mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#"><span class="mui-icon application9"></span><div class="mui-media-body">更多</div></a></li>';
				console.log("app应用列表返回数据" + JSON.stringify(response));
				//style="background-image:url()"
				var litemplate = '<li id="{{InfoID}}" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 application"><span class="extra" id="{{extra}}"></span><a href="#"><span class="mui-icon application1 img-localcache-background" data-img-localcache="{{BigImgUrl}}"></span><div class="mui-media-body">{{Title}}</div></a></li>';
				var output = '';
				$('.mui-slider-group').html('');
				if(response.EpointDataBody.DATA.ReturnInfo.Status == 'False') {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				var totalCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
				if(totalCount > 7) {
					var html = '';
					var output = '';
					var array = response.EpointDataBody.DATA.UserArea.InfoList.Info;
					mui.each(array, function(key, value) {
						if(value.extend) {
							value['extra'] = unescape(value.extend.fieldvalue);
						} else {
							value['extra'] = '';
						};
					});
					//最多显示两个tab，即15个
					if(array.length > 15) {
						var newArray = [];
						for(var i = 0; i < 15; i++) {
							newArray.push(array[i]);
						};
						array = newArray;
					};
					for(var i = 0; i < parseInt(totalCount / 8); i++) {
						html += '<div class="mui-slider-item"><ul class="mui-table-view mui-grid-view mui-grid-9">';
						for(var j = 0; j < 8; j++) {
							var num = i * 8 + j;
							array[num].Title = unescape(array[num].Title);
							output += Mustache.render(litemplate, array[num]);
						}
						html += output;
						html += '</ul></div>';
					}
					var restCount = totalCount - (parseInt(totalCount / 8) * 8);
					if(restCount > 0) {
						var output1 = '';
						for(var i = (parseInt(totalCount / 8) * 8); i < totalCount; i++) {
							array[i].Title = unescape(array[i].Title);
							output1 += Mustache.render(litemplate, array[i]);
						}
						html += '<div class="mui-slider-item"><ul class="mui-table-view mui-grid-view mui-grid-9">';
						html += output1;
						html += clickMore;
						html += '</ul></div>';
					} else {
						html += '<div class="mui-slider-item"><ul class="mui-table-view mui-grid-view mui-grid-9">';
						html += clickMore;
						html += '</ul></div>';
					};
					$('.mui-slider-group').append(html);
					if(restCount >= 0) {
						var radiusSize = parseInt(totalCount / 8) + 1;
						var radiusHtml = '';
						for(var i = 0; i < radiusSize; i++) {
							radiusHtml += '<div class="mui-indicator"></div>';
						};
						$('.radius').html(radiusHtml);
						$('.radius').children('div').eq(0).addClass('mui-active');
					}
				} else {
					var html = '';
					if(response.EpointDataBody.DATA.UserArea.InfoList) {
						if(Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
							mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
								if(value.extend) {
									value['extra'] = unescape(value.extend.fieldvalue);
								} else {
									value['extra'] = '';
								};
								//console.log("xxxxx"+JSON.stringify(value));
								value.Title = unescape(value.Title);
								output += Mustache.render(litemplate, value);
							});
							html = '<div class="mui-slider-item"><ul class="mui-table-view mui-grid-view mui-grid-9">';
							html += output;
							html += '</ul></div>';
						} else {
							response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
							if (response.EpointDataBody.DATA.UserArea.InfoList.Info.extend) {
								response.EpointDataBody.DATA.UserArea.InfoList.Info.extra = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.extend.fieldvalue);
							};
							output = Mustache.render(litemplate, response.EpointDataBody.DATA.UserArea.InfoList.Info);
							html = '<div class="mui-slider-item"><ul class="mui-table-view mui-grid-view mui-grid-9">';
							html += output;
							html += '</ul></div>';
						};
						$('.mui-slider-group').append(html);
						$('.mui-slider-group .mui-table-view').append(clickMore);
						$('.radius').html('<div class="mui-indicator"></div>');
						$('.radius').children('div').eq(0).addClass('mui-active');
					};
				}
				//初始化app左右栏目切换
				if(totalCount > 0) {
					sliderApp();
				}
				//点击更多跳转全部应用
				$('.more').on('click', function() {
					ejs.page.openPage("html/bizlogic-application/application-index.html", "全部应用", '');
				});
				//加载热点新闻数据
				ajaxHotNewAutoPlay();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//热点新闻轮播
	function ajaxHotNewAutoPlay() {
		var url = config.serverUrl + 'GetInfoList';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			currentpageindex: 0,
			pagesize: 10,
			catenum: '002001',
			isheadnews: 0,
			title: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		//		console.log(url);
		//		console.log(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				//console.log("xxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
				$('.marqueelist').html('');
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				var output = '';
				var litemplate = '<p id="{{InfoID}}" class="mui-ellipsis">{{Title}}</p>';
				if(response.EpointDataBody.DATA.UserArea.InfoList) {
					if(Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
						mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
							value.Title = unescape(value.Title);
							output += Mustache.render(litemplate, value);
						});
					} else {
						response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
						output = Mustache.render(litemplate, response.EpointDataBody.DATA.UserArea.InfoList.Info);
					};
					$('.marqueelist').append(output);
				};
				//图片伦播初始化
				new Marquee('marquee', 0, 1, '', 23, 50, 2000, 2000, 23);
				//教育资讯新闻列表初始化
				ajaxEduInfo();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//教育资讯
	var ajaxEduInfo = function() {
		var url = config.serverUrl + 'GetInfoList';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			currentpageindex: 0,
			pagesize: 10,
			catenum: '002002',
			isheadnews: 0,
			title: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				$('#listdata1').html('');
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				var output = '';
				//console.log("xxxxxxx" + JSON.stringify(response));
				//教育咨询列表请求数据
				var litemplateEdu = '<li id="{{InfoID}}"class="mui-table-view-cell"><span id="{{CateNum}}" class="CateNum"></span><p class="mui-ellipsis title">{{Title}}</p><p><span class="sourse">来源：<span class="blue">{{infotype}}</span></span><span class="time">{{InfoDate}}</span></p></li>';
				if(response.EpointDataBody.DATA.UserArea.InfoList) {
					if(Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
						mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
							if(key < 3) {
								value.Title = unescape(value.Title);
								output += Mustache.render(litemplateEdu, value);
							};
						});
					} else {
						response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
						output = Mustache.render(litemplateEdu, response.EpointDataBody.DATA.UserArea.InfoList.Info);
					}
					$('#listdata1').append(output);
				};
				setTimeout(function(){
					//加载只会校园数据
					initPullRefreshList();
				},4000);
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	/**
	 * @description 智慧校园初始化下拉刷新
	 */
	function initPullRefreshList() {
		//默认为公用url和模板
		var getUrl = function() {
			var url = config.serverUrl + 'GetInfoListWithImageGuid';
			//console.log('url:' + url);
			return url;
		};

		var getLitemplate = function() {
			var litemplate = '<li id="{{InfoID}}" class="mui-table-view-cell"><div class="image"><img data-img-localcache="{{BigImgUrl}}"></div><p class="mui-ellipsis-2 name">{{Title}}</p></li>';
			return litemplate;
		};

		//获得请求参数的回调-党员
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = config.token;
			var data = {
				currentpageindex: 0,
				pagesize: pageSize,
				catenum: '002003',
				isheadnews: 1,
				title: '',
				bigimgwidth: 200,
				bigimgheight: 150,
				smallimgwidth: 200,
				smallimgheight: 150
			};
			requestData.para = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			//console.log('请求数据:' + requestData);
			return requestData;
		};

		//点击回调
		var onClickCallback = function(e) {
			var id = this.id;
			var schoolName = jQuery(this).find('.name').text();
			var jsonObj = {
				infoID: id,
				cateNum: '002003'
			};
			//页面需要传递的额外参数
			var options = {
				"showSearchBar": false
			}
			ejs.page.openPage("html/bizlogic-homepage/middle-school.html", schoolName, jsonObj, options);
		};

		var changeToltalCountCallback = function() {
			return TotalCount;
		};

		var changeResponseDataCallback = function(response) {
			console.log("xxxxxxxxxxx" + JSON.stringify(response));
			var tempArray = [];
			if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
				UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
				return;
			};
			TotalCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
			if(response.EpointDataBody.DATA.UserArea.InfoList) {
				if(Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
					mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
						value.Title = unescape(value.Title);
					});
					tempArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				} else {
					response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
					tempArray.push(response.EpointDataBody.DATA.UserArea.InfoList.Info);
				}
			};
			return tempArray;
		};

		var successRequestCallback = function() {
			$('.campus-hd .blue').text(TotalCount);
			$('#listdata2 .loading').remove();
		};

		//初始化下拉刷新是异步进行的,回调后才代表下拉刷新可以使用
		//因为用了sea.js中的require.async
		//第二个
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata2',
				pullrefreshId: 'pullrefresh',
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1_material1'
		}, function(pullToRefresh) {
			pullToRefresh1 = pullToRefresh;
		});
	}

});