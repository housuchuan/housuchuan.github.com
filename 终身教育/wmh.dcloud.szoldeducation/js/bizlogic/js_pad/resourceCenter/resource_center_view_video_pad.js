/**
 * 描述 :示例视频选择页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-08 16:44:07
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools2 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools4 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var Tools = require('bizlogic/resourceCenter/resource_center_view_video_Util.js');
	var CurrPage = 1;
	var PageSize = 10;
	var totalNumCount = 0;
	var totalNumCount4 = 0;
	var totalNumCount2 = 0;
	var uuId = '';
	var vuId = '';
	var secretKey = '';
	var userId = '';
	var userName = '';
	var id = '';
	var title = '评论';
	var api;
	var selectionsNoteId;
	var noteType = 0; //0视频，1文档
	var IsPraise = [];
	//做题参数
	var answerIddArray = '',
		idArray = '',
		answerArray = [];
	var pullToRefreshObject4;
	var selectionsDocId = '';
	var pullToRefreshObject;
	var pullToRefreshObject2;
	var getVideoTime = 0; //全局定义获取当前播放时间
	var selectionsId = ''; //选集id
	var selectionsName = ''; //选集名称
	var isDocOrVideo = 0;
	var beginIndex;
	var arrayList = [];
	var playType = 0; //播放类型   0点播 1直播；默认情况下为点播
	var isEnd = 0; //判断视频是否已经播放完
	var flag = true;
	var videoStatus = 0; //未播放状态
	var videoPlayStatus = 0; //判断是视频播放完还是手动点击做题功能
	var _back = mui.back;
	var A = '', //二级评论参数传递
		B = '',
		C = '',
		D = '',
		E = '',
		commentId = '';
	var playTime = 0; //资源播放时间
	var ResourceId; //我的学习笔记列表传过来的资源id
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//初始化监听视频收藏状态
		//监听父页面视频id
		id = WindowUtil.getExtraDataByKey('itemsId');
		playType = WindowUtil.getExtraDataByKey('type');
		//上传上传点击数据
		Tools.addCourceClickCounts(id);
		//我的学习界面页面跳转接受播放记录
		var Time = WindowUtil.getExtraDataByKey('playTime');
		var transResourceId = WindowUtil.getExtraDataByKey('resourceId');
		if(Time) {
			playTime = Time;
		};
		if(transResourceId) {
			ResourceId = transResourceId;
		};
		console.log(playTime + ResourceId);
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		//初始化视频区域滚动
		mui(".mediaPlayer,.imgList-wapper").scroll({
			indicators: false, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		//初始化点播视频简介
		getDianboIntro();
		//初始化选集数据
		videoPlaySelections();
		validateIsSaveStatus();
		//监听发表信息
		initPublishListener();
		//tab切换点击监听
		initListener();
		//console.log("id" + id);
	};

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
			playsinline: "0", //Ios 设备Web view下默认不全屏播放（1：启动，0：不启动）
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
		//var info = "（调试）当前时间：" + myDate.toLocaleTimeString() + "" + "===>" + "type:" + type + ";----data:" + JSON.stringify(data);
		//console.error(info);
		if(type == 'videoPause' || type == 'videoStop' || type == 'videoFull' || type == 'videoStart' || type == 'fullscreen' || type == 'resize') {
			//判断视频是否处于可播放状态
			videoStatus = 1;
			isEnd = 0;
			getVideoTime = api.getVideoTime();
			//alert('0000000'+type);
			//alert('0000000播放记录'+api.getVideoTime()+'xxxxxxxxx'+player.currentPlaybackTime());
		} else {
			videoStatus = 0;
		};
		if((type == "videoStop") && ("true" == JSON.stringify(data))) {
			videoPlayStatus = 1;
			isEnd = 1;
			validateDoWork();
		};
		if(type == 'resize') {
			if(flag) {
				Zepto('.mediaPlayer').css('z-index', '1000');
				flag = false;
			} else {
				Zepto('.mediaPlayer').css('z-index', '0');
				flag = true;
			}
		};
		if(type == 'videoStart' && playTime) {
			api.seekTo(playTime);
		};
		console.log("xxx" + type + JSON.stringify(data));
	};

	//选集点击操作样式变化
	Zepto('.list-container-selection').on('tap', '.mui-table-view-cell', function() {
		//console.log(Zepto(this).attr('id'));
		selectionsDocId = Zepto(this).attr('id');
		Zepto('.selectionsList').css('color', '#000000').css('background-color', '#f5f5f5');
		Zepto(this).css('color', '#ffffff').css('background-color', '#187bc2');
		var type = Zepto(this).find('.type').attr('id');
		selectionsId = this.id;
		selectionsDocId = this.id;
		selectionsNoteId = this.id;
		selectionsName = Zepto(this).find('.setItemName').text();
		//视频 = 1,文档 = 2
		if(type == 1) {
			noteType = 0;
			uuId = Zepto(this).find('.uuId').attr('id');
			vuId = Zepto(this).find('.vuId').attr('id');
			if(uuId && vuId) {
				//初始化视频
				initVodPlay();
			} else {
				console.log('uuId或vuid不存在');
			}
		} else if(type == 2) {
			noteType = 1;
			pullToRefreshObject4.refresh();
			mui('.imgList-wapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		}
		validateDoWork();
		//初始化刷新评论和笔记数据
		pullToRefreshObject.refresh();
		pullToRefreshObject2.refresh();
		//快速回滚到该区域顶部
		mui('.review-comment-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
	});

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
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsListright';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			pageIndex: CurrPage,
			pageSize: 100
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("response" + JSON.stringify(response));
				var tempInfo = response.data;
				var html = '';
				var litemplate = '<div id="{{id}}"class="selectionsList mui-table-view-cell"><span id="{{uuId}}"class="uuId"></span><span id="{{vuId}}"class="vuId"></span><span id="{{type}}"class="type"></span><div class="mui-clearfix"><span>{{key}}</span><span class="setItemName resouce">{{title}}</span><span>{{studyStatus}}</span></div></div>';
				var output = '';
				if(Array.isArray(tempInfo)) {
					mui.each(tempInfo, function(key, value) {
						output = '';
						if(value.name == '' || value.name == null) {
							value.name = '视频(文档)资源';
						};
						html += '<li id="' + value.id + '" class="setItem"><div class="zhangjie">' + value.name + '</div>';
						if(value.InfoList) {
							if(Array.isArray(value.InfoList)) {
								mui.each((value.InfoList), function(key, value) {
									if(value.studyStatus == 1) {
										value.studyStatus = '学习完';
									} else {
										value.studyStatus = '未学完';
									};
									if(key < 9) {
										value.key = '0' + parseFloat(key + 1);
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
								output = '<div id="' + value.InfoList.id + '"class="selectionsList mui-table-view-cell"><span id="' + value.InfoList.uuId + '"class="uuId"></span><span id="' + value.InfoList.vuId + '"class="vuId"></span><span id="' + value.InfoList.type + '"class="type"></span><div class="mui-clearfix"><span>01</span><span class="setItemName resouce">' + value.InfoList.title + '</span><span>' + value.InfoList.studyStatus + '</span></div></div>';
							}
						};
						html += output;
						html += '</li>';
					});
				} else {
					if(tempInfo.name == '' || tempInfo.name == null) {
						tempInfo.name = '视频(文档)资源';
					};
					html += '<li id="' + tempInfo.id + '" class="setItem"><div class="zhangjie">' + tempInfo.name + '</div>';
					if(tempInfo.InfoList) {
						if(Array.isArray(tempInfo.InfoList)) {
							mui.each((tempInfo.InfoList), function(key, value) {
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
								output += Mustache.render(litemplate, value);
							});
						} else {
							if(tempInfo.InfoList.studyStatus == 1) {
								tempInfo.InfoList.studyStatus = '学习完';
							} else {
								tempInfo.InfoList.studyStatus = '未学完';
							};
							output = '<div id="' + tempInfo.InfoList.id + '"class="selectionsList mui-table-view-cell"><span id="' + tempInfo.InfoList.uuId + '"class="uuId"></span><span id="' + tempInfo.InfoList.vuId + '"class="vuId"></span><span id="' + tempInfo.InfoList.type + '"class="type"></span><div class="mui-clearfix"><span>01</span><span class="setItemName resouce">' + tempInfo.InfoList.title + '</span><span>' + tempInfo.InfoList.studyStatus + '</span></div></div>';
						}
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
						if(tempArray[0].InfoList) {
							//视频 = 1,文档 = 2
							if((tempArray[0].InfoList)[0].type == 1) {
								Zepto('.mui-title').text('看视频');
								isDocOrVideo = 1;
								Zepto('#doc').css('display', 'none');
								noteType = 0;
								//播放记录跳转进来播放视频
								if(playTime && ResourceId) {
									var _this = Zepto('.list-container-selection li');
									for(var i = 0; i < _this.length; i++) {
										var _thisInner = Zepto(_this[i]).find('.selectionsList');
										for(var j = 0; j < _thisInner.length; j++) {
											var innerId = _thisInner[j].id;
											console.error(innerId);
											if(ResourceId.trim() == innerId.trim()) {
												var num = (1 + j)
												selectionsId = Zepto('.list-container-selection').children('li').eq(i).children('div').eq(num).attr('id');
												selectionsNoteId = selectionsId;
												selectionsName = Zepto('.list-container-selection').children('li').eq(i).children('div').eq(num).find('.resouce').text();
												uuId = Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).children('span:first-child').attr('id');
												vuId = Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).children('span:nth-child(2)').attr('id');
												Zepto('.selectionsList').css('color', '#000000').css('background-color', '#f5f5f5');
												Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).css('color', '#ffffff').css('background-color', '#187bc2');
											};
										};
									};
								} else {
									selectionsId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
									selectionsNoteId = selectionsId;
									selectionsName = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.setItemName').text();
									uuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.uuId').attr('id');
									vuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.vuId').attr('id');
								}
								//初始化视频
								initVodPlay();
							} else if((tempArray[0].InfoList)[0].type == 2) {
								Zepto('.mui-title').text('看文档');
								Zepto('#doc').css('display', 'block');
								noteType = 1;
								isDocOrVideo = 2;
								selectionsDocId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
								selectionsNoteId = selectionsDocId;
								//初始化看文档数据
								initWatchDoc();
							}
						};
						validateDoWork();
					} else {
						if(tempArray.InfoList) {
							//视频 = 1,文档 = 2
							if((tempArray.InfoList)[0].type == 1) {
								Zepto('.mui-title').text('看视频');
								isDocOrVideo = 1;
								Zepto('#doc').css('display', 'none');
								noteType = 0;
								//播放记录跳转进来播放视频
								if(playTime && ResourceId) {
									var _this = Zepto('.list-container-selection li');
									for(var i = 0; i < _this.length; i++) {
										var _thisInner = Zepto(_this[i]).find('.selectionsList');
										for(var j = 0; j < _thisInner.length; j++) {
											var innerId = _thisInner[j].id;
											console.error(innerId);
											if(ResourceId.trim() == innerId.trim()) {
												var num = (1 + j)
												selectionsId = Zepto('.list-container-selection').children('li').eq(i).children('div').eq(num).attr('id');
												selectionsNoteId = selectionsId;
												selectionsName = Zepto('.list-container-selection').children('li').eq(i).children('div').eq(num).find('.resouce').text();
												uuId = Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).children('span:first-child').attr('id');
												vuId = Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).children('span:nth-child(2)').attr('id');
												Zepto('.selectionsList').css('color', '#000000').css('background-color', '#f5f5f5');
												Zepto('.list-container-selection').find('li').eq(i).children('div').eq(num).css('color', '#ffffff').css('background-color', '#187bc2');
											};
										};
									};
								} else {
									selectionsId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
									selectionsNoteId = selectionsId;
									selectionsName = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.setItemName').text();
									uuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.uuId').attr('id');
									vuId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).find('.vuId').attr('id');
								}
								//初始化视频
								initVodPlay();
							} else if((tempArray.InfoList)[0].type == 2) {
								Zepto('.mui-title').text('看文档');
								Zepto('#doc').css('display', 'block');
								noteType = 1;
								isDocOrVideo = 2;
								selectionsDocId = Zepto('.list-container-selection li:first-child').children('.selectionsList').eq(0).attr('id');
								selectionsNoteId = selectionsDocId;
								//初始化看文档数据
								initWatchDoc();
							}
						};
						validateDoWork();
					}
				};
				initRefreshCommentList();
				initNoteList();
				//判断视频还是文档
				//validateVideoOrDoc();
				//console.log("uuId" + uuId + "vuId" + vuId);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/*
	 * 根据选集观看相应文档图片
	 */
	function initWatchDoc() {
		//看文档
		var getLitemplate4 = function() {
			var litemplate = "<img data-img-localcache='{{image}}' data-preview-src='{{image}}'/>";
			return litemplate;
		};

		var getUrl4 = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/watchDoc';
			return url;
		};

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData4 = function(CurrPage) {
			beginIndex = CurrPage * 2;
			var requestData = {};
			//动态校验字段
			var data = {
				pageIndex: CurrPage,
				pageSize: 1000,
				selectionsId: selectionsDocId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc4 = function(response) {
			//console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(tempArray[0].DocImageList));
				if(tempArray) {
					if(Array.isArray(tempArray)) {
						var Data = tempArray[0].DocImageList;
						//console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(Data));
						mui.each(Data, function(key, value) {
							if(value.image) {
								value.image = unescape(value.image);
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
			//console.log("xxxxxxxxxxxxxxx"+beginIndex);
			//console.log("总记录数：" + totalNumCount4);
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
			//图片预览，修改源文件mui.previewimage.js ，加上自定义的DOM
			document.querySelector('.doc_preview').addEventListener('slide', function(event) {
				var currentPicCount = event.detail.slideNumber + 1;
				console.log("您当前预览第" + currentPicCount + "(张/页)");
				if(currentPicCount == totalNumCount4) {
					console.log("亲，您的文档已预览完毕！");
					videoPlayStatus = 3;
					validateDoWork();
				}
			});
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
				//console.log("tempinfo"+JSON.stringify(tempInfo));
				Zepto('p').html('');
				Zepto('p').append(tempInfo.introduction);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//收藏视频
	Zepto('.save-icon').on('tap', function() {
		var saveType = null;
		var _this = Zepto(this);
		if(_this.hasClass('save-icon-active')) {
			_this.removeClass('save-icon-active');
			saveType = 0;
		} else {
			_this.addClass('save-icon-active');
			saveType = 1;
		};
		ajaxSaveVideo(saveType);
	});

	/**
	 * @description 收藏视频ajax请求
	 */
	function ajaxSaveVideo(saveType) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		//var url = 'http://221.224.167.154:8099/szedu_v1.0.0/resourceCenter/mobile/resourceCenter/saveVideo';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: 0,
			id: id,
			userId: userId,
			userName: userName,
			saveType: saveType
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("添加收藏的requestData" + requestData);
		console.log("url" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				console.log("收藏信息" + JSON.stringify(response));
				UIUtil.toast(response.description);
				//				var id = plus.webview.getWebviewById(plus.runtime.appid);
				//				WindowUtil.firePageEvent("resource_center_course_info_pad.html", "refreshChildrenPage");
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//初始化监听是否已经收藏了本视频
	function initIsSaveVideo(IsSave) {
		if(IsSave == 0) {
			//什么都不做
			console.log("0xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
		} else if(IsSave == 1) {
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxx1");
			Zepto('.save-icon').addClass('save-icon-active');
		}
	}

	//评论笔记切换
	Zepto('.review-notes-items').on('tap', 'div', function() {
		title = Zepto(this).text();
		//console.log(title);
		switch(title) {
			case "评论":
				//changePageShow("resource_center_view_video_commments_list_pad.html");
				////页面监听
				//WindowUtil.firePageEvent('resource_center_view_video_commments_list_pad.html', 'refreshListPage');
				Zepto('.review-comment-wrapper').css('display', 'block');
				Zepto('.review-notes-wrapper').css('display', 'none');
				pullToRefreshObject.refresh();
				break;
			case "笔记":
				//changePageShow("resource_center_view_video_note_list_pad.html");
				////监听子页面
				//WindowUtil.firePageEvent('resource_center_view_video_note_list_pad.html', 'refreshListPage');
				Zepto('.review-notes-wrapper').css('display', 'block');
				Zepto('.review-comment-wrapper').css('display', 'none');
				pullToRefreshObject2.refresh();
				break;
			case "做题":
				//做题功能
				videoPlayStatus = 2;
				api.pauseVideo();
				validateDoWork();
				break;
		};
		//快速回滚到该区域顶部
		mui('.review-comment-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
	});

	function initRefreshCommentList() {
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
					pageSize: PageSize,
					id: selectionsNoteId,
					userId: userId
				};
				requestData = data;
				//某一些接口是要求参数为字符串的 
				requestData = JSON.stringify(requestData);
				//console.log('url:' + url);
				//console.log('评价请求参数' + requestData);
				return requestData;
			}
			/*
			 * 评论
			 */
		var getLitemplate = function() {
			var litemplate = '<li id="{{id}}" class="clearfix"><span class="userId" id="{{userId}}"><img src="{{image}}"/><div class="user-review-newlyInfo"><div class="mui-ellipsis clearfix"><span class="user-name">{{nick}}</span><span class="user-praise">{{praise}}赞</span><div class="praise-icon"></div></div><span class="time-records">{{date}}</span><div class="commentContent">{{comment}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div></div></li>';
			return litemplate;
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
			var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
			//console.log("url" + url);
			return url;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//console.log("评价改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				//console.log("response00000000000" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				IsPraise = [];
				mui.each(tempArray, function(key, value) {
					value.image = unescape(value.image);
					value.comment = unescape(value.comment);
					if(value.isPraise == 0) {
						//什么都不做
					} else if(value.isPraise == 1) {
						//console.log("key"+key);
						IsPraise.push(key);
						//Zepto('.zanBorder').addClass('zanBorder-active');
					};
				})
			}
			return tempArray;
		}

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
			//console.log("已经点赞的Li的index" + IsPraise);
			for(var i = 0; i < IsPraise.length; i++) {
				Zepto('.review-notes-content li').eq(IsPraise[i]).find('.praise-icon').addClass('praise-icon-active');
			};
			var litemplate1 = '<div id="{{replyId}}"class="reviewContent hasIt"><img src="{{image}}"/><span class="reviewName"id="{{userId}}">{{name}}</span><span class="reviewerContent">{{reviewContent}}</span><br/><div class="reviewDate">{{time}}</div><div class="secondLevelCommnet mui-clearfix"><div class="ZanBorder"><span class="secondCommentPraiseStatus" id="{{isPraise}}"></span><span class="secondZan">{{like}}</span><span>赞</span></div><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div></div>';
			mui.each(response, function(key, value) {
				if(value.secondCommentList) {
					var output = '';
					if(Array.isArray(value.secondCommentList)) {
						mui.each(value.secondCommentList, function(key, value) {
							if(!value.image || value.image == 'image is undefined!') {
								value.image = '../../img/MobileFrame/img_head_logo190-190.png';
							} else {
								value.image = unescape(value.image);
							};
							value.reviewContent = unescape(value.reviewContent);
							output += Mustache.render(litemplate1, value);
						});
					} else {
						if(!value.secondCommentList.image || value.secondCommentList.image == 'image is undefined!') {
							value.secondCommentList.image = '../../img/MobileFrame/img_head_logo190-190.png';
						} else {
							value.secondCommentList.image = unescape(value.secondCommentList.image);
						};
						value.secondCommentList.reviewContent = unescape(value.secondCommentList.reviewContent);
						output = Mustache.render(litemplate1, value.secondCommentList);
					}
					//如果存在那一集表明key是存在的
					Zepto(Zepto('.review-notes-content').children('li')[key]).find('.user-review-newlyInfo').append(output);
				} else {
					//不存在此节点的话就不执行
				}
			});
			//二级评论点赞状态
			console.log('==================' + Zepto('.secondCommentPraiseStatus').length);
			for(var i = 0; i < Zepto('.secondCommentPraiseStatus').length; i++) {
				if(Zepto(Zepto('.secondCommentPraiseStatus')[i]).attr('id') == 1) {
					Zepto(Zepto('.secondCommentPraiseStatus')[i]).addClass('hasZan');
				} else {
					Zepto(Zepto('.secondCommentPraiseStatus')[i]).removeClass('hasZan');
				}
			};
			Zepto('.hasZan').parent('.ZanBorder').addClass('praise-icon-active');
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			var type = 0; //取消点赞为0，点赞为1
			commentId = this.id;
			//点赞
			if(Zepto(e.target).hasClass('user-praise') || Zepto(e.target).hasClass('praise-icon')) {
				var text = Zepto(this).find('.user-praise').text();
				var number = parseInt(text.substr(0, text.length - 1));
				console.log("number" + number);
				var _this = Zepto(this).find('.praise-icon');
				if(_this.hasClass('praise-icon-active')) {
					_this.removeClass('praise-icon-active');
					type = 0;
					var currentNum = number - 1;
					//console.log(currentNum);
					Zepto(this).find('.user-praise').text(currentNum + '赞');
					ajaxPraiseSubmit(commentId, type);
				} else {
					var currentNum = number + 1;
					_this.addClass('praise-icon-active');
					type = 1;
					//console.log(currentNum);
					Zepto(this).find('.user-praise').text(currentNum + '赞');
					ajaxPraiseSubmit(commentId, type);
				}
			} else if(Zepto(e.target).hasClass('ZanBorder') || Zepto(e.target).parent().hasClass('ZanBorder')) {
				var number = parseInt(Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text());
				var _this = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.ZanBorder');
				var secondReportId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
				if(_this.hasClass('praise-icon-active')) {
					_this.removeClass('praise-icon-active');
					type = 0;
					var currentNum = number - 1;
					ajaxPraiseSubmit(secondReportId, type);
					Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text(currentNum);
				} else {
					var currentNum = number + 1;
					_this.addClass('praise-icon-active');
					type = 1;
					ajaxPraiseSubmit(secondReportId, type);
					Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text(currentNum);
				}
			} else if(Zepto(e.target).hasClass('review') || Zepto(e.target).parent().hasClass('review')) {
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("评论回复");
				Zepto(".confirm-btn").text("回复");
				Zepto("#reason").attr("placeholder", "请输入回复内容！(50字以内)");
				if(noteType == 0) {
					api.pauseVideo(); //暂停
				};
				if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
					A = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.reviewName').text();
				} else {
					A = Zepto(this).find('.user-name').text();
				};
				B = Zepto(this).find('.commentContent').text();
				C = Zepto(this).find('.userId').attr('id');
				D = Zepto(this).find('.user-name').text();
				E = commentId;
			} else if(Zepto(e.target).hasClass('report') || Zepto(e.target).parent().hasClass('report')) {
				//举报
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("举报");
				Zepto(".confirm-btn").text("举报");
				Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
				if(noteType == 0) {
					api.pauseVideo(); //暂停
				};
				if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
					commentId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
				};
			}
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
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

	Zepto('.cancel-btn,.mui-icon-closeempty').on('tap', function() {
		CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
		document.getElementById("reason").value = "";
		if(noteType == 0) {
			api.resumeVideo();
		};
	});

	/**
	 * @description 资源中心评论举报
	 */
	function ajaxCommentReport() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/makeReport';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/makeReport';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: commentId,
			reportReason: document.getElementById("reason").value,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//console.log("赞的响应参数" + JSON.stringify(response));
				UIUtil.toast(response.description);
				document.getElementById("reason").value = "";
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//确认举报按钮
	Zepto(".confirm-btn").on('tap', function() {
		var btnOk = Zepto(this).text();
		//举报
		var inputStr = document.getElementById("reason").value;
		if(btnOk == "举报") {
			if(!inputStr) {
				mui.alert("亲，请填写举报理由！");
			} else if(StringUtil.getByteLen(inputStr) > 100) {
				UIUtil.toast('字数太多，请重新输入');
			} else {
				ajaxCommentReport();
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
				if(noteType == 0) {
					api.resumeVideo();
				};
			}
		} else if(btnOk == "回复") {
			if(!inputStr) {
				mui.alert("亲，请填写回复内容！");
			} else if(StringUtil.getByteLen(inputStr) > 100) {
				UIUtil.toast('字数太多，请重新输入');
			} else {
				//console.log("" + JSON.stringify(replyPara));
				//发表超过30个字数，应该提示“用户”
				if(StringUtil.getByteLen(inputStr) < 100) {
					ajaxPublishSecondComment(E, B, C, D);
					CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
					if(noteType == 0) {
						api.resumeVideo();
					};
				} else {
					mui.toast("评论内容不允许超过50个字哦！");
				}
			}
		}
	});

	//笔记列表
	function initNoteList() {
		//获取笔记模板
		var getLitemplate2 = function() {
			//var litemplate = '<li id="{{id}}" class="mui-table-view-cell myNoteItem"><div class="myNoteItemDiv"><img class="timeIcon" src="../../img/studyCircle/img_public_service.png" width="12px" height="12px" /><div class="NoteNoteTime"><span class="sanjiaoxin"></span><span class="NoteNoteTimeText">{{playRecordTime}}</span></div><div class="NoteNoteUserName"></div><div class="NoteNoteContent">{{content}}</div><div class="NoteNoteDateZan"><div class="NoteNoteDate">{{createNoteTime}}</div></div></div></li>';
			var litemplate = '<li id="{{id}}" class="clearfix"><div class="noteWrapper mui-clearfix"><span class="clock-icon"></span><span class="comment-time">{{playRecordTime}}</span></div><div class="note-content">{{content}}</div><div class="clearfix"><span class="note-year">{{createNoteTime}}</span></div></li>';
			return litemplate;
		}

		//获取笔记接口
		var getUrl2 = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
			var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
			return url;
		}

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData2 = function(CurrPage) {
			var requestData = {};
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: selectionsNoteId,
				userId: userId,
				courseGuid: id //课程id
			}
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('请求参数' + requestData);
			return requestData;
		}

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc2 = function(response) {
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					value.content = unescape(value.content);
				});
				//console.log("笔记的相应参数" + JSON.stringify(tempArray));
				totalNumCount2 = response.totalCount;
			}
			return tempArray;
		}

		/*
		 * @description 列表点击事件（笔记点赞）
		 */
		var onItemClickCallbackFunc2 = function(e) {

		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc2 = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount2;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc2 = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			if(isDocOrVideo == 1) {
				Zepto('.noteWrapper').css('display', 'block');
			} else if(isDocOrVideo == 2) {
				Zepto('.noteWrapper').css('display', 'none');
			};
		};

		PullToRefreshTools2.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 45
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate2,
				getUrl: getUrl2,
				listdataId: 'listdata2',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh2',
				getRequestDataCallback: getData2,
				changeResponseDataCallback: changeResponseDataFunc2,
				itemClickCallback: onItemClickCallbackFunc2,
				changeToltalCountCallback: changeToltalCountFunc2,
				successRequestCallback: successCallbackFunc2,
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
			pullToRefreshObject2 = pullToRefresh;
			pullToRefreshObject2.refresh();
		});
	}

	/**
	 * @description 点赞数据提交
	 */
	function ajaxPraiseSubmit(commentId, type) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: commentId,
			type: type,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//console.log("1");
				//console.log("赞的响应参数" + JSON.stringify(response));
				//UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//发表评论(笔记)
	function initPublishListener() {
		Zepto('.publishBtn').on('tap', function() {
			if(Zepto('input[type=text]').val() == '' || Zepto('input[type=text]').val() == null) {
				UIUtil.toast('发表内容不可为空噢');
			} else if(StringUtil.getByteLen(Zepto('input[type=text]').val()) > 600) {
				UIUtil.toast('字数太多，请重新输入');
			} else {
				//console.log("title"+title);
				if(title == '评论') {
					Zepto('input[type=text]').attr('placeholder', '50字以内');
					if(StringUtil.getByteLen(Zepto('input[type=text]').val()) > 100) {
						UIUtil.toast('字数太多，请重新输入');
					} else {
						Zepto('.publishBtn').attr('disabled', 'disabled');
						ajaxPublishComment();
					}
				} else if(title == '笔记') {
					Zepto('input[type=text]').attr('placeholder', '300字以内');
					api.pauseVideo();
					Zepto('.publishBtn').attr('disabled', 'disabled');
					if(isDocOrVideo == 1) {
						getVideoTime = api.getVideoTime(); //获取当前播放的时间(单位:秒).
					} else if(isDocOrVideo == 2) {
						getVideoTime = '';
					};
					ajaxcommitNote(getVideoTime);
				}
			}
		});
	}

	//发表评价
	Zepto('.praiseBtn').on('tap', function() {
		//暂停视频播放
		if(noteType == 0) {
			api.pauseVideo();
		};
		Zepto('.zhezhao-area').css('display', 'block');
		Zepto('.overallPraise').css('display', 'block');
	});

	//取消发表评价
	Zepto('.cancel').on('tap', function() {
		//恢复视频播放
		if(noteType == 0) {
			api.resumeVideo();
		};
		Zepto('.zhezhao-area').css('display', 'none');
		Zepto('.overallPraise').css('display', 'none');
		Zepto('.overallPri div').removeClass('overallPriActive').addClass('overallCommon');
	});

	//评价星数
	Zepto('.overallPri').on('tap', 'div', function() {
		var _index = Zepto(this).index();
		_index = _index + 1;
		//首次点击清空所有点击的评价星数
		Zepto('.overallPri div').removeClass('overallPriActive');
		for(var i = 0; i < _index; i++) {
			Zepto('.overallPri div').eq(i).addClass('overallPriActive');
		}
	});

	//提交评价
	Zepto('.submit').on('tap', function() {
		//恢复视频播放
		Zepto('.zhezhao-area').css('display', 'none');
		Zepto('.overallPraise').css('display', 'none');
		if(noteType == 0) {
			api.resumeVideo();
		};
		var _this = Zepto('.overallPri div');
		var array = [];
		mui.each(_this, function(key, value) {
			if(Zepto(value).hasClass('overallPriActive')) {
				array.push(key);
			};
		});
		if(Array.isArray(array)) {
			if(array.length) {
				appraiseSubmitAjax(array.length);
			} else {
				UIUtil.toast('亲,请评价');
			}
		}
	});

	/**
	 * @description 提交评价ajax请求数据
	 */
	function appraiseSubmitAjax(score) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoOverallPraise';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoOverallPraise';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			userName: userName,
			id: id,
			score: score
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("xxxxxxxxxxxxxxx" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				UIUtil.toast(response.description);
				Zepto('.overallPri div').removeClass('overallPriActive').addClass('overallCommon');
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 评论提交
	 */
	function ajaxPublishComment() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			resourceId: selectionsNoteId,
			userId: userId,
			userName: userName,
			content: StringUtil.utf16toEntities(Zepto('input[type=text]').val()),
			commentId: "",
			rpcontent: "",
			rpuserId: "",
			rpuserName: "",
			floor: 1 //1:一级评论 2:二级评论
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("发表评论参数"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("发表评论" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//WindowUtil.firePageEvent('resource_center_view_video_commments_list_pad.html', 'refreshListPage');
				Zepto('input[type=text]').val('');
				Zepto('.publishBtn').removeAttr('disabled');
				UIUtil.toast(response.description);
				pullToRefreshObject.refresh();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			Zepto('input[type=text]').val('');
			Zepto('.publishBtn').removeAttr('disabled');
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 单独二级评论提交
	 */
	function ajaxPublishSecondComment(commentId, rpcontent, rpuserId, rpuserName) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var requestData = {
			resourceId: selectionsNoteId,
			userId: userId,
			userName: userName,
			content: StringUtil.utf16toEntities('回复' + A + ':' + (document.getElementById("reason").value)),
			commentId: commentId,
			rpcontent: rpcontent,
			rpuserId: rpuserId,
			rpuserName: rpuserName,
			floor: 2 //1:一级评论 2:二级评论
		};
		requestData = JSON.stringify(requestData);
		console.log("发表评论参数" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("发表评论" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
				document.getElementById("reason").value = "";
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 添加笔记
	 */
	function ajaxcommitNote(getVideoTime) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/addNote';
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/addNote';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: noteType,
			courseGuid: id,
			resourceId: selectionsNoteId,
			userId: userId,
			userName: userName,
			content: Zepto('input[type=text]').val(),
			timePoint: StringUtil.getTimeFromSeconds(getVideoTime)
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		console.log("xxxxxxxxxxxxxxx" + url);
		//alert("获取当前笔记请求参数" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.closeWaiting();
				WindowUtil.firePageEvent('resource_center_view_video_note_list_pad.html', 'refreshListPage');
				Zepto('input[type=text]').val('');
				Zepto('.publishBtn').removeAttr('disabled');
				UIUtil.toast(response.description);
				pullToRefreshObject2.refresh();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	Zepto('.review-comment-wrapper,.review-notes-wrapper').on('tap', function() {
		Zepto("input").blur();
	});

	/*
	 * ajax请求是否已经收藏了本视频
	 */
	function validateIsSaveStatus() {
		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/getIsSaveStatus';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			guid: id,
			type: playType,
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxx111111111111111111111111111111" + requestData);
		console.log("xxxxxxxxxxxxxxxx111111111111111111111111111111" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				console.log("xxxxxxxxxxxxxxxxxxxxtempInfo" + JSON.stringify(response));
				var IsSave = response.data.isSave;
				//console.log("xxxxxxxxxxxxxxxxxxxxtempInfo"+JSON.stringify(IsSave));
				initIsSaveVideo(IsSave);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//暂停视频(可能会出现暂停广告).
	Zepto(".pauseVideo").on("tap", function() {
		api.pauseVideo();
	});
	//恢复视频
	Zepto(".resumeVideo").on("tap", function() {
		api.resumeVideo();
	});
	//切换视频
	Zepto(".playNewId").on("tap", function() {
		api.playNewId({
			uu: "cbedbf1ce4", //1wnmvkv1dr
			vu: "d8d281dd99", //86e12dca1b
		});
	});
	//通过内核，获取视频所有相关信息.
	Zepto(".getVideoSetting").on("tap", function() {
		var getVideoSetting = api.getVideoSetting();
		console.log(JSON.stringify(getVideoSetting));
	});
	//获取当前播放的时间(单位:秒).
	Zepto(".getVideoTime").on("tap", function() {
		var getVideoTime = api.getVideoTime();
		console.log("获得视频当前播放时间" + getVideoTime);
		//console.log("转换后的视频当前播放时间" + StringUtil.getTimeFromSeconds(getVideoTime));
	});
	//进行视频搜索.seekTo 所需参数: 时间点(单位:120秒)
	Zepto(".seekTo").on("tap", function() {
		//api.seekTo(120);
		console.log("搜索视频进行播放：" + getTimeFromSeconds(10000));
	});

	/**
	 * @description 记录当前视频播放时长
	 */
	function takeNotesVideoShow(data1) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoShowRecord';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/videoShowRecord';
		var requestData = {};
		//var data = data1;
		requestData = data1;
		requestData = JSON.stringify(requestData);
		//alert("xxxxxxxxxxxxxx" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			//alert(JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//传入成功
				WindowUtil.firePageEvent("szpark_playrecord_list.html", "refreshPlayRecordPad");
				UIUtil.closeWaiting();
				_back();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	mui.back = function() {
		if(isDocOrVideo == 1) {
			//首次按键
			//********点击退出，立马暂停视频**********
			api.pauseVideo(); //暂停
			//getVideoTime = api.getVideoTime(); //获取当前播放的时间(单位:秒).
			var extras = {
				id: id,
				playRecord: api.getVideoTime(),
				selectionsId: selectionsId,
				selectionsName: selectionsName,
				userId: userId,
				userName: userName
			};
			//alert('11111111111111');
			//alert(JSON.stringify(extras));
			//视频处于播放状态
			if(isEnd == 1) {
				//console.log("视频已经播放完");
				_back();
			} else if(videoStatus == 1) {
				//alert('111111111111111111');
				UIUtil.confirm({
					content: '保存视频当前播放时长',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//alert(JSON.stringify(extras));
						//alert('xxxxxxxxxxxxxxxxxxxx');
						takeNotesVideoShow(extras);
					} else {
						_back();
					}
				});
			} else {
				_back();
			};
		} else {
			_back();
		}
	};

	//影藏做题功能
	Zepto('.hideIcon').on('tap', function() {
		CustomDialogUtil.hideCustomDialog('doIt'); //显示自定义对话框
	});

	/**
	 * @description 初始化问题列表
	 */
	function initQuestionList() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/edu/questionsList';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/questionsList';
		var requestData = {};
		var data = {
			resourceId: selectionsNoteId,
			pageIndex: 1,
			pageSize: 1000
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				//var litemplate = '<li id="{{id}}"><div class="problem"><span>{{index}}、</span><span>{{title}}</span><span class="frame">(&nbsp;&nbsp;&nbsp;<span class="number"></span>&nbsp;&nbsp;&nbsp;)</span></div><div class="choice"></div></li>';
				var litemplateInner = '<div id="{{id}}" class="rowGuid"><span id="choice">{{choice}}</span><span>{{choiceSection}}</span></div>';
				var output = '';
				mui.each(tempInfo, function(key, value) {
					output += '<li id="' + value.id + '"><div class="problem"><span>' + (key + 1) + '、</span><span>' + value.title + '</span><span class="frame">(&nbsp;&nbsp;&nbsp;<span class="number"></span>&nbsp;&nbsp;&nbsp;)</span></div><div class="choice">';
					var tempInfoInner = value.choiceList;
					var output2 = '';
					mui.each(tempInfoInner, function(key, value) {
						output2 += Mustache.render(litemplateInner, value);
					});
					output += output2;
					output += '</div></li>';
				});
				Zepto('.loading').css('display', 'none');
				Zepto('#questionList').append(output);
			};
			//区域滚动
			mui(".itemsList").scroll({
				indicators: false, //是否显示滚动条
				deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			//选择答案
			//选择答案
			Zepto('.mui-table-view li .choice').on('tap', 'div', function() {
				var _this = Zepto(this);
				var choice = _this.children('span:first-child').text();
				_this.parents('li').find('.number').text(choice);
				_this.find('span:first-child').css('background-color', '#187bc2');
				_this.siblings().find('span:first-child').css('background-color', '#b3b3b3');
			});
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 提交答案
	 */
	function submitAnswer() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/edu/answerApply';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/answerApply';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			questionGuid: idArray,
			answerArray: answerIddArray,
			resourceId: selectionsNoteId,
			courseGuid: id,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				//UIUtil.toast(response.data.description);
				CustomDialogUtil.hideCustomDialog('doIt');
				//全部正确才是1 否则都是0
				var isAllRight = response.data.isAllRight;
				if(isAllRight == 1) {
					Tools.ajaxAddIntegral({
						userId: userId,
						userName: userName,
						resourceId: selectionsId,
						courseGuid: id
					});
				} else {
					UIUtil.toast('答案错误，请重新答题');
					//什么都不做，如果有错题，让后台提示有错重新答题
				};
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//获取答案数组
	function popAnswerList() {
		answerArray = [];
		var answerList = Zepto('#questionList li');
		mui.each(answerList, function(key, value) {
			var answer = Zepto(value).find('.number').text();
			if(!answer) {
				//不存在答案，则返回0
				answerArray.push(0);
			} else {
				var _this = Zepto(value).find('.rowGuid');
				for(var i = 0; i < _this.length; i++) {
					if(Zepto(_this[i]).find('#choice').text() == answer) {
						var answerId = Zepto(_this[i]).attr('id');
						answerArray.push(answerId);
					}
				}
			};
		});
		return answerArray;
	};

	Zepto('.submitAnswer').on('tap', function() {
		idArray = '';
		answerIddArray = '';
		answerArray = popAnswerList();
		var restAnswerList = [];
		for(var i = 0; i < answerArray.length; i++) {
			answerIddArray += answerArray[i] + ',';
		};
		mui.each(answerArray, function(key, value) {
			if(!value) {
				//将未填的题目放到数组中进行判断
				restAnswerList.push(key);
			};
		});
		//判断是否漏题
		if(restAnswerList.length > 0) {
			mui.alert('您还有' + (restAnswerList.length) + '题没写，请填写完成后提交');
		} else {
			var idList = Zepto('.mui-table-view li');
			mui.each(idList, function(key, value) {
				idArray += Zepto(value).attr('id') + ',';
			});
			UIUtil.confirm({
				content: '提示',
				title: '确定要提交吗？',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					//提交答案
					submitAnswer();
				};
			});
		}
	});

	/**
	 * @description 判断是否有积分和该资源下是否有题目
	 */
	function validateDoWork() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/edu/isNeedAnswer';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/isNeedAnswer';
		var requestData = {};
		var data = {
			resourceId: selectionsNoteId,
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				var integralStatus = tempInfo.integralStatus;
				var questionStatus = tempInfo.questionStatus;
				console.error("integralStatus" + integralStatus + '---------------' + 'questionStatus' + questionStatus);
				console.log("xxxxxxxxxxxxx" + videoPlayStatus);
				/*
				 * Description: 对于不存在题目的情况，即隐藏做题按钮，看完即获取积分
				 */
				if(questionStatus == 0) {
					Zepto('.review-notes-items div').css('width', '46%');
					Zepto('.review-notes-items div:last-child').css('display', 'none');
					//对于视频看完即上传积分
					if(noteType == 0) {
						if(videoPlayStatus == 1) {
							Tools.ajaxAddIntegral({
								userId: userId,
								userName: userName,
								resourceId: selectionsId,
								courseGuid: id
							});
							videoPlayStatus = 0;
						};
					} else if(noteType == 1) {
						if(videoPlayStatus == 3) {
							Tools.ajaxAddIntegral({
								userId: userId,
								userName: userName,
								resourceId: selectionsDocId,
								courseGuid: id
							});
							videoPlayStatus = 0;
						};
					};
				} else {
					/*
					 * Description: 对于存在题目的情况下，存在以下几种情况
					 * 对于视频播放来说： 1.存在题目，但是用户积分为0，{点击和看完分别判断}，2.拥有积分
					 * 对于文档来说： 1.存在题目，但是积分为0{点击和看完分别判断} 2.拥有积分
					 */
					Zepto('.review-notes-items div').css('width', '30%');
					Zepto('.review-notes-items div:last-child').css('display', 'inline-block');
					if(noteType == 0) {
						if(videoPlayStatus == 1) {
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								CustomDialogUtil.showCustomDialog('doIt');
								Zepto('#questionList').html('');
								Zepto('.loading').css('display', 'block');
								initQuestionList();
							};
						} else if(videoPlayStatus == 2) {
							//点击做题按钮判断
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								mui.alert('请看完该视频再做题');
								//存在积分	
							} else {
								videoPlayStatus = 0;
								CustomDialogUtil.showCustomDialog('doIt');
								Zepto('#questionList').html('');
								Zepto('.loading').css('display', 'block');
								initQuestionList();
							};
						};
					} else if(noteType == 1) {
						if(videoPlayStatus == 3) {
							//文档完整播放结束进行的判断
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								CustomDialogUtil.showCustomDialog('doIt');
								Zepto('#questionList').html('');
								Zepto('.loading').css('display', 'block');
								initQuestionList();
							};
						} else if(videoPlayStatus == 2) {
							//点击做题按钮判断
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								mui.alert('请看完该文档再做题');
								//存在积分	
							} else {
								videoPlayStatus = 0;
								CustomDialogUtil.showCustomDialog('doIt');
								Zepto('#questionList').html('');
								Zepto('.loading').css('display', 'block');
								initQuestionList();
							};
						}
					};

				};
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//监听上传积分刷新选集学习状态
	window.addEventListener('refreshChoiceListPad', function() {
		//刷新选集列表数据
		videoPlaySelections();
	});
});