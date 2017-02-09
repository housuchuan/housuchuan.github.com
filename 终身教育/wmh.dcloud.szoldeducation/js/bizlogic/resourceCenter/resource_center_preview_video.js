/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools4 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var VideoUtil = require('bizlogic/resourceCenter/resource_center_commonVideo_util.js')
	var LoginUtil = require('bizlogic/common/LoginUtil.js')
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var Tools = require('bizlogic/resourceCenter/resource_center_view_video_Util.js')
	var id = null;
	var buildSubPage = 0;
	var PageSize = 100;
	var pullToRefreshObject;
	var totalNumCount = 0;
	var pullToRefreshObject4;
	var totalNumCount4 = 0;
	var secretKey = '';
	var uuId = '';
	var vuId = '';
	var selectionsDocId;
	//var secretKey = config.secretKey;
	var userId = '';
	var userName = '';
	var IsSave = 0;
	var reFreshType = '';
	var api; //全局点播API定义
	var ServerUrl = config.JServerUrl;
	var userSession;
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		id = WindowUtil.getExtraDataByKey('itemsId');
		IsSave = WindowUtil.getExtraDataByKey('IsSave');
		reFreshType = WindowUtil.getExtraDataByKey('reFreshType');
		//区域滚动
		mui(".mui-scroll-wrapper").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		getVideoIntroData();
		//初始化监听下拉刷新
		initPullRefresh();
		//初始化监听是否收藏了本视频资源
		//initIsSaveVideo();
		//调用课程访问量方法
		Tools.addCourceClickCounts(id);
	});

	//暂停视频(可能会出现暂停广告).
	Zepto(".pauseVideo").on("tap", function() {
		api.pauseVideo();
	});
	//恢复视频
	Zepto(".resumeVideo").on("tap", function() {
		api.resumeVideo();
	});

	//初始化乐视云视频
	function initVodPlay() {
		//配置视频播放参数
		var playerConf = getUrlParams();
		//实例化视频
		var p = new CloudVodPlayer();
		//初始化播放
		p.init(playerConf, "player");
		api = p.sdk;
	};

	/**
	 * @description 获取参数配置信息
	 * @param {Object} uu 点播的 uu，用户唯一标识 
	 * @param {Object} vu 点播的 vu，视频唯一标识 
	 */
	function getUrlParams() {
		var flashVars = {
			uu: uuId, //cbedbf1ce4
			vu: vuId, // d8d281dd99;c85107fcda目前这两个视频都可以播放
			autoplay: 1,
			controls: 1,
			skinnable: 1,
			ark: "106",
			playsinline: "1", //Ios 设备Web view下默认不全屏播放（1：启动，0：不启动）
			gpcflag: 1,
			callbackJs: "TTVideoInit"
		};
		return flashVars;
	};

	/**
	 * @description  playerConf 会传入 callbackJs。此时对应的 js 函数会收到播放器的回调。
	 * @param {Object} type 表示播放器当前回调类型
	 * @param {Object} data：表示回调的值。
	 */
	window.TTVideoInit = function(type, data) {
		var myDate = new Date();
		var info = "（调试）当前时间：" + myDate.toLocaleTimeString() + "" + "===>" + "type:" + type + ";----data:" + JSON.stringify(data);
		console.error(info);
	};

	/**
	 * @description 获取视频简介数据
	 */
	function getVideoIntroData() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			type: 0
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("简介请求参数" + requestData);
		//console.log("url" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("预览简介数据" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				//console.log("预览简介数据" + JSON.stringify(response));
				var tempInfo = response.data;
				Zepto('#shortIntroduce').text(tempInfo.introduction);
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 获取视频选集数据
	 */
	function initPullRefresh() {
		//获取选集模板
		var getLitemplate = function() {
			var litemplate = '<li id="{{id}}" class="setItem"><div class="zhangjieId">{{name}}</div></li>';
			return litemplate;
		};

		//获取选集接口
		var getUrl = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsList';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsListright';
			return url;
		};

		/**
		 * @description     选集接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: id,
				userId: userId
			}
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('选集请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			//console.error("选集列表数据" + JSON.stringify(response));
			if(response.code == 1) {
				if(response) {
					if(response.data) {
						totalNumCount = response.totalCount;
						if(Array.isArray(response.data)) {
							mui.each(response.data, function(key, value) {
								if(value.name == '' || value.name == null) {
									value.name = '视频(文档资源)';
								}
							});
							tempArray = response.data;
						} else {
							if(response.data.name == '' || response.data.name == null) {
								response.data.name = '视频(文档资源)';

							}
							tempArray.push(response.data);
						}
					}
				}
			}
			return tempArray;
		};

		/*
		 * @description 列表点击事件（笔记点赞）
		 */
		var onItemClickCallbackFunc = function(e) {
			var type = Zepto(this).find('.type').attr('id');
			Zepto('.setItemName').css('color', '#000000');
			Zepto(Zepto(e.target).parents('.resourceList')).find('.setItemName').css('color', '#7F8386');
			selectionsDocId = Zepto(Zepto(e.target).parents('.resourceList')).attr('id');
			//视频 = 1,文档 = 2
			if(type == 1) {
				uuId = Zepto(Zepto(e.target).parents('.resourceList')).find('span:first-child').attr('id');
				vuId = Zepto(Zepto(e.target).parents('.resourceList')).find('span:nth-child(2)').attr('id');
				initVodPlay();
			} else if(type == 2) {
				//在这个里面不做任何处理
				pullToRefreshObject4.refresh();
				//快速回滚到该区域顶部
				mui('.imgList-wapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			}
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			var litemplate1 = '<div id="{{id}} "class="resourceList mui-table-view-cell"><span id="{{uuId}}"></span><span id="{{vuId}}"></span><span id="{{type}}"class="type"></span><div class="numIndex">{{key}}</div><div class="setItemIcon"></div><div class="setItemName">{{title}}</div><div class="studyStatus">{{studyStatus}}</div></div>';
			var output = '';
			console.error("成功请求数据successCallbackFunc：" + JSON.stringify(response));
			if(Array.isArray(response)) {
				mui.each(response, function(key, value) {
					output = '';
					if(Array.isArray(value.InfoList)) {
						mui.each(value.InfoList, function(key, value) {
							if(value.studyStatus == 1) {
								value.studyStatus = '学习完';
							} else {
								value.studyStatus = '未学完';
							};
							if(key < 9) {
								value.key = '0' + parseFloat(key + 1);
							} else if(key == 9) {
								value.key = 10;
							} else {
								value.key = key + 1;
							};
							output += Mustache.render(litemplate1, value);
						});
					} else {
						if(value.InfoList.studyStatus == 1) {
							value.InfoList.studyStatus = '学习完';
						} else {
							value.InfoList.studyStatus = '未学完';
						};
						value.InfoList.key = '01';
						output = Mustache.render(litemplate1, value.InfoList);
					}
					Zepto('.list-container').children('li').eq(key).append(output);
				});

				//初始化视频播放以及文档播放
				if(response[0]) {
					//视频 = 1,文档 = 2
					if(response[0].InfoList[0].type == 1) {
						Zepto('.mui-title').text('看视频');
						Zepto('#doc').css('display', 'none');
						uuId = Zepto('.list-container').children('li:first-child').children('div:nth-child(2)').find('span:nth-child(1)').attr('id');
						vuId = Zepto('.list-container').children('li:first-child').children('div:nth-child(2)').find('span:nth-child(2)').attr('id');
						initVodPlay();
					} else if(response[0].InfoList[0].type == 2) {
						Zepto('.mui-title').text('看文档');
						Zepto('#doc').css('display', 'block');
						selectionsDocId = Zepto('.list-container').find('li:first-child').children('div:nth-child(2)').attr('id');
						//初始化看文档数据
						initWatchDoc();
					}
				};
			};
			if(!userId) {
				Zepto('.studyStatus').css('display', 'none');
			} else {
				//遍历选集改变选集中学习状态的颜色
				for(var i = 0; i < Zepto('.list-container-selection').children('li').length; i++) {
					for(var j = 0; j < Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList').length; j++) {
						if(Zepto(Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList')[j]).find('.studyStatus') == '未学完') {
							Zepto(Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList')[j]).find('.studyStatus').css('color', 'blue');
						}
					}
				};
			}
		};

		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			//下拉有关
			down: {
				height: 45
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				itemClickCallback: onItemClickCallbackFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc,
				ajaxSetting: {
					//默认的contentType
					contentType: "application/json",
					headers: {
						"X-SecretKey": secretKey
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};

	/*
	 * 根据选集观看相应文档图片
	 */
	function initWatchDoc() {
		//看文档
		var getLitemplate4 = function() {
			var litemplate = "<img data-img-localcache='{{image}}' data-preview-src='{{image}}' />";
			return litemplate;
		};

		var getUrl4 = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			//var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsList';
			return url;
			console.error("url"+url);
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData4 = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			var data = {
				pageIndex: CurrPage,
				pageSize: 3,
				//id: id
				selectionsId: selectionsDocId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('选集请求参数xxxxxxxxxxxxxx' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc4 = function(response) {
			console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(tempArray));
				if(tempArray) {
					if(Array.isArray(tempArray)) {
						var Data = tempArray[0].DocImageList;
						//console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(Data));
						mui.each(Data, function(key, value) {
							if(value.image) {
								console.error(value.image);
								value.image = unescape(value.image);
								value.image = (value.image).replace(/\s+/g,"");
							};
						});
						tempArray = Data;
					}
				}
				totalNumCount4 = response.totalCount;
			}
			return tempArray;
		}

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc4 = function(e) {};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc4 = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount4;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc4 = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
			//预览照片
			mui.previewImage();
		};

		PullToRefreshTools4.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			//下拉有关
			down: {
				height: 45
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate4,
				getUrl: getUrl4,
				listdataId: 'listdata4',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh4',
				getRequestDataCallback: getData4,
				changeResponseDataCallback: changeResponseDataFunc4,
				itemClickCallback: onItemClickCallbackFunc4,
				changeToltalCountCallback: changeToltalCountFunc4,
				successRequestCallback: successCallbackFunc4,
				ajaxSetting: {
					//默认的contentType
					contentType: "application/json",
					headers: {
						"X-SecretKey": secretKey
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObject4 = pullToRefresh;
			pullToRefreshObject4.refresh();
		});
	};

});