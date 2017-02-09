/**
 * 描述 :资源视频预览 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-10 14:48:07
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var upLoadTapActionUtil = require('bizlogic/resourceCenter/resource_center_view_video_Util.js');
	var CurrPage = 1;
	var PageSize = 1000;
	var pullToRefreshObject;
	var totalNumCount = 0;
	var uuId = '';
	var vuId = '';
	//var secretKey = config.secretKey;
	var secretKey = '';
	var userId = '';
	var userName = '';
	var id = '';
	var api;
	var IsSave = 0;
	var selectionsDocId;
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		id = WindowUtil.getExtraDataByKey('itemsId');
		//上传上传点击数据
		upLoadTapActionUtil.addCourceClickCounts(id);
		//视频区域滚动初始化
		mui(".mediaPlayer,.imgList-pad").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		mui(".content-wrapper").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		//点击监听
		initListener();
		//初始化点播简介
		//console.log("id" + id);
		getDianboIntro();
		//选集初始化
		videoPlaySelections();
	}

	//初始化点播实例
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

	//点击监听
	function initListener() {
		//点击tab切换
		Zepto('.tabChoice').on('tap', 'span', function() {
			//快速回滚到该区域顶部
			mui('.content-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			Zepto(this).css('color', '#0000FF').css('border-bottom', '1px solid #0000FF').siblings().css('color', '#000000').css('border-bottom', 'none');
			var index = Zepto(this).index();
			switch(index) {
				case 0:
					Zepto('p').css('display', 'block');
					Zepto('.list-container-selection').css('display', 'none');
					break;
				default:
					Zepto('p').css('display', 'none');
					Zepto('.list-container-selection').css('display', 'block');
					break;
			}
		});
	};

	//选集列表
	/**
	 * @description 选集ajax请求数据
	 */
	function videoPlaySelections() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsList';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsListright';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			pageIndex: CurrPage,
			pageSize: PageSize
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				var html = '';
				var litemplate = '<div id="{{id}}"class="selectionsList mui-table-view-cell"><span id="{{uuId}}"class="uuId"></span><span id="{{vuId}}"class="vuId"></span><span id="{{type}}"class="type"></span><div class="mui-clearfix"><span>{{key}}</span><span class="resouce">{{title}}</span><span>{{studyStatus}}</span></div></div>';
				var output = '';
				console.log("response" + JSON.stringify(tempInfo));
				if(Array.isArray(tempInfo)) {
					mui.each(tempInfo, function(key, value) {
						output = '';
						if(value.name == ''||tempInfo.name == null) {
							value.name = '视频(文档)资源';
						};
						html += '<li id="' + value.id + '" class="setItem"><div class="zhangjie">' + value.name + '</div>';
						if(Array.isArray(value.InfoList)) {
							mui.each((value.InfoList), function(key, value) {
								if(value.studyStatus == 1) {
									value.studyStatus = '学习完';
								} else {
									value.studyStatus = '未学完';
								};
								if(key < 9) {
									value.key = '0' + parseFloat(key+1);
								} else {
									value.key = key;
								};
								output += Mustache.render(litemplate, value);
							});
						} else {
							if(value.InfoList.studyStatus == 1) {
								value.InfoList.studyStatus = '学习完';
							} else {
								value.InfoList.studyStatus = '未学完';
							};
							output = '<div id="' + value.InfoList.id + '"class="selectionsList mui-table-view-cell"><span id="' + value.InfoList.uuId + '"class="uuId"></span><span id="' + value.InfoList.vuId + '"class="vuId"></span><span id="' + value.InfoList.type + '"class="type"></span><div class="mui-clearfix"><span>01</span><span class="resouce">' + value.InfoList.title + '</span><span>' + value.InfoList.studyStatus + '</span></div></div>';
						}
						html += output;
						html += '</li>';
					});
				} else {
					if(tempInfo.name == ''||tempInfo.name == null) {
						tempInfo.name = '视频(文档)资源';
					};
					html += '<li id="' + tempInfo.id + '" class="setItem"><div class="zhangjie">' + tempInfo.name + '</div>';
					if(Array.isArray(tempInfo.InfoList)) {
						mui.each((tempInfo.InfoList), function(key, value) {
							if(value.studyStatus == 1) {
								value.studyStatus = '学习完';
							} else {
								value.studyStatus = '未学完';
							};
							if(key < 9) {
								value.key = '0' + parseFloat(key+1);
							}else if(key == 9){
								value.key = 10;
							} else {
								value.key = key+1;
							};
							output += Mustache.render(litemplate, value);
						});
					} else {
						if(tempInfo.InfoList.studyStatus == 1) {
							tempInfo.InfoList.studyStatus = '学习完';
						} else {
							tempInfo.InfoList.studyStatus = '未学完';
						};
						output = '<div id="' + tempInfo.InfoList.id + '"class="selectionsList mui-table-view-cell"><span id="' + tempInfo.InfoList.uuId + '"class="uuId"></span><span id="' + tempInfo.InfoList.vuId + '"class="vuId"></span><span id="' + tempInfo.InfoList.type + '"class="type"></span><div class="mui-clearfix"><span>01</span><span class="resouce">' + tempInfo.InfoList.title + '</span><span>' + tempInfo.InfoList.studyStatus + '</span></div></div>';
					}
					html += output;
					html += '</li>';
				};
				Zepto('.list-container-selection').html('');
				Zepto('.list-container-selection').append(html);
				console.log(JSON.stringify(response.data));
				//判断是视频还是文档-----------------》资源类型.....视频 = 1,文档 = 2
				if(response.data) {
					var tempArray = response.data;
					response = tempArray;
					if(Array.isArray(tempArray) && tempArray[0]) {
						//视频 = 1,文档 = 2
						if((tempArray[0].InfoList)[0].type == 1) {
							Zepto('.mui-title').text('看视频');
							Zepto('#doc').css('display', 'none');
							uuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.uuId').attr('id');
							vuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.vuId').attr('id');
							if(uuId && vuId) {
								//初始化视频
								initVodPlay();
							};
						} else if((tempArray[0].InfoList)[0].type == 2) {
							Zepto('.mui-title').text('看文档');
							Zepto('#doc').css('display', 'block');
							selectionsDocId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
							//初始化看文档数据
							initWatchDoc();
						}
					}else{
						//视频 = 1,文档 = 2
						if((tempArray.InfoList)[0].type == 1) {
							Zepto('.mui-title').text('看视频');
							Zepto('#doc').css('display', 'none');
							uuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.uuId').attr('id');
							vuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.vuId').attr('id');
							if(uuId && vuId) {
								//初始化视频
								initVodPlay();
							};
						} else if((tempArray.InfoList)[0].type == 2) {
							Zepto('.mui-title').text('看文档');
							Zepto('#doc').css('display', 'block');
							selectionsDocId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
							//初始化看文档数据
							initWatchDoc();
						}
					}
				};

			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//选集点击操作样式变化
	Zepto('.list-container-selection').on('tap', '.mui-table-view-cell', function() {
		//console.log(Zepto(this).attr('id'));
		selectionsDocId = Zepto(this).attr('id');
		Zepto('.selectionsList').css('color', '#000000').css('background-color', '#f5f5f5');
		Zepto(this).css('color', '#ffffff').css('background-color', '#187bc2');
		var type = Zepto(this).find('.type').attr('id');
		//视频 = 1,文档 = 2
		if(type == 1) {
			uuId = Zepto(this).find('.uuId').attr('id');
			vuId = Zepto(this).find('.vuId').attr('id');
			if(uuId && vuId) {
				//初始化视频
				initVodPlay();
			} else {
				console.log('uuId或vuid不存在');
			}
		} else if(type == 2) {
			pullToRefreshObject.refresh();
			//快速回滚到该区域顶部
			mui('.imgList-pad').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶	
		}
	});

	/*
	 * 根据选集观看相应文档图片
	 */
	function initWatchDoc() {
		//看文档
		var getLitemplate = function() {
			var litemplate = "<img data-img-localcache='{{image}}' data-preview-src='{{image}}' />";
			return litemplate;
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			return url;
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			var data = {
				pageIndex: CurrPage,
				pageSize: 3,
				selectionsId: selectionsDocId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
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
						console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(Data));
						mui.each(Data, function(key, value) {
							if(value.image) {
								value.image = unescape(value.image);
							};
						});
						tempArray = Data;
					}
				}
				totalNumCount = response.totalCount;
			}
			return tempArray;
		}

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
			//预览照片
			mui.previewImage();
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

	/**
	 * @description 点播预览视频简介ajax请求数据
	 */
	function getDianboIntro() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: 0,
			id: id
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				console.log("tempinfo" + JSON.stringify(tempInfo));
				Zepto('p').html('');
				Zepto('p').append(tempInfo.introduction);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});