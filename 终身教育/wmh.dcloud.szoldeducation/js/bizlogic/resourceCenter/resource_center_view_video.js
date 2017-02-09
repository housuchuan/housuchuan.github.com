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
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools2 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools3 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools4 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var Tools = require('bizlogic/resourceCenter/resource_center_view_video_Util.js')
	var pullToRefreshObject;
	var pullToRefreshObject2;
	var pullToRefreshObject3;
	var pullToRefreshObject4;
	var selectionsDocId;
	var noteType = 0; //0视频，1文档
	var uuId = '';
	var vuId = '';
	var selectionsNoteId;
	var selectionsId = ''; //选集id
	var selectionsName = ''; //选集名称
	var id = null;
	var IsPraise = [];
	var PageSize = 8;
	var totalNumCount = 0;
	var totalNumCount2 = 0;
	var totalNumCount3 = 0;
	var totalNumCount4 = 0;
	var secretKey = '';
	//var secretKey = config.secretKey;
	var userId = '';
	var userName = '';
	//用来判定是文档还是视频
	var isDocOrVideo;
	var ServerUrl = config.JServerUrl;
	var api; //全局点播API定义
	var playType = 0; //播放类型   0点播 1直播；默认情况下为点播
	var getVideoTime = 0; //全局定义获取当前播放时间
	var videoStatus = 0; //未播放状态
	var _back = mui.back;
	var videoPlayStatus = 0; //判断是视频播放完还是手动点击做题功能
	var isEnd = 0; //判断视频是否已经播放完
	var A = '', //二级评论参数传递
		B = '',
		C = '',
		D = '',
		E = '',
		commentId = '';
	var playTime = 0; //资源播放时间
	var ResourceId;  //我的学习笔记列表传过来的资源id
	//设置拖动前初始化时间initTime
	var initTime = 0;
	var inityy;
	CommonUtil.initReady(function() {
		StorageUtil.setStorageItem('timePOint',0);
		//获取缓存信息;
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		id = WindowUtil.getExtraDataByKey('itemsId'); //课程ID
		playType = WindowUtil.getExtraDataByKey('type');
		//我的学习界面页面跳转接受播放记录
		var Time = WindowUtil.getExtraDataByKey('playTime');
		var transResourceId = WindowUtil.getExtraDataByKey('resourceId');
		if(Time){
			playTime = Time;
		};
		if(transResourceId){
			ResourceId = transResourceId;
		};
		console.log(playTime+ResourceId);
		//1.获取简介详情
		getVideoIntroData();
		//初始化监听是否收藏了本视频资源
		validateIsSaveStatus();
		initAllPullRefresh();
		//调用课程访问量方法
		Tools.addCourceClickCounts(id);
	});

	//初始化所有下拉刷新监听
	function initAllPullRefresh() {
		//选集列表
		initPullRefresh3();
		//		setTimeout(function() {
		//			
		//		}, 300);
		//评论列表
		setTimeout(function() {
			initNoteRefresh();
		}, 300);
	}

	/**
	 * @description 初始化点播视频
	 * @param {Object} uu 点播的 uu，用户唯一标识 
	 * @param {Object} vu 点播的 vu，视频唯一标识 
	 */
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
			uu: uuId, //uu 点播的 uu，用户唯一标识 
			vu: vuId, //vu 点播的 vu，视频唯一标识 
			auto_play: '0', //是否自动播放
			dfull: '0',
			ark: "106",
			playsinline: '0', //Ios 设备Web view下默认不全屏播放（1：启动，0：不启动）
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
		//console.error(info);
		//console.error(api.getVideoTime());
		if(type == 'videoPause' || type == 'videoStop' || type == 'videoFull' || type == 'videoStart' || type == 'fullscreen' || type == 'resize') {
			//判断视频是否处于可播放状态
			videoStatus = 1;
			isEnd = 0;
			getVideoTime = api.getVideoTime(); //StringUtil.getTimeFromSeconds();
			//alert('0000000'+type);
			//alert('0000000播放记录'+api.getVideoTime()+'xxxxxxxxx'+player.currentPlaybackTime());
		} else {
			videoStatus = 0;
		};
		if((type == "videoStop") && ("true" == JSON.stringify(data))) {
			videoPlayStatus = 1;
			isEnd = 1;
			validateDoWork();
			//console.error("播放完毕");
			//解决视频播放收影响的问题
			//console.log("视频播放完毕" + type);
		};
		if(type == 'videoStart'&&playTime){
			api.seekTo(playTime);
		};
		//mui.toast('type值为：'+type);
		//判断视频是否是在快进状态
		if(type == 'videoSeek'){
				//mui.toast(type);
				//api.pauseVideo();
				clearInterval(inityy);
				//alert('拖动前时间'+initTime);
				//alert('拖动后时间'+api.getVideoTime());
				if(api.getVideoTime()<StorageUtil.getStorageItem('timePOint')){
					
				}else{
					api.seekTo(StorageUtil.getStorageItem('timePOint'));
					api.pauseVideo();
				}
		};
		if (type == 'videoStart') {
			setTimeout(function(){
				inityy = setInterval(function(){
					initTime = api.getVideoTime();
					var timepoint = api.getVideoTime();
					StorageUtil.setStorageItem('timePOint',timepoint);
					//mui.toast('正在监听'+api.getVideoTime());
				},3000);
			},20000);
		};
		if (type == 'videoResume') {
				inityy = setInterval(function(){
					initTime = api.getVideoTime();
					if(initTime>StorageUtil.getStorageItem('timePOint')){
						StorageUtil.setStorageItem('timePOint',initTime);
					};
					//mui.toast('正在监听'+api.getVideoTime());
				},2000);
		};
	};

	document.getElementById('slider').addEventListener('slide', function(e) {
		if(e.detail.slideNumber === 1) {
			Zepto('.comment').css('display', 'none');
			//pullToRefreshObject3.refresh();
		} else if(e.detail.slideNumber === 2) {
			//pullToRefreshObject.refresh();
			Zepto('.comment').css('display', 'block');
		} else {
			Zepto('.comment').css('display', 'none');
			//getVideoIntroData();
		}
	});

	/**
	 * 给tab绑定点击事件
	 */
	Zepto('#sliderSegmentedControl').on('tap', 'a', function() {
		if(Zepto(this).text() == "简介") {
			Zepto('.comment').css('display', 'none');
		} else if(Zepto(this).text() == "选集") {
			Zepto('.comment').css('display', 'none');
		} else {
			Zepto('.comment').css('display', 'block');
			pullToRefreshObject.refresh();
		}
	});

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
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var tempInfo = response.data;
				Zepto('#shortIntroduce').text(tempInfo.introduction);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 获取视频选集数据
	 */
	function initPullRefresh3() {
		var pageSize = 100;
		//获取选集模板
		var getLitemplate3 = function() {
			var litemplate = '<li id="{{id}}" class="setItem"><div class="zhangjieId">{{name}}</div></li>';
			return litemplate;
		}

		//获取选集接口
		var getUrl3 = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsList';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlaySelectionsListright';
			return url;
		}

		/**
		 * @description     选集接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData3 = function(CurrPage) {
			var requestData = {};
			var data = {
				pageIndex: CurrPage,
				pageSize: pageSize,
				id: id,
				userId: userId
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
		var changeResponseDataFunc3 = function(response) {
			console.error("选集数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
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
		}

		/*
		 * @description 列表点击事件（选集列表）
		 */
		var onItemClickCallbackFunc3 = function(e) {
			var type = Zepto(this).find('.type').attr('id');
			selectionsDocId = Zepto(Zepto(e.target).parents('.resourceList')).attr('id');
			Zepto('.setItemName').css('color', '#000000');
			Zepto(Zepto(e.target).parents('.resourceList')).find('.setItemName').css('color', '#7F8386');
			//视频 = 1,文档 = 2
			if(type == 1) {
				noteType = 0;
				selectionsId = Zepto(Zepto(e.target).parents('.resourceList')).attr('id');
				selectionsNoteId = selectionsId;
				selectionsName = Zepto(Zepto(e.target).parents('.resourceList')).find('.setItemName').text();
				uuId = Zepto(Zepto(e.target).parents('.resourceList')).find('.resourceList span:first-child').attr('id');
				vuId = Zepto(Zepto(e.target).parents('.resourceList')).find('.resourceList span:nth-child(2)').attr('id');
				initVodPlay();
			} else if(type == 2) {
				noteType = 1;
				selectionsDocId = Zepto(Zepto(e.target).parents('.resourceList')).attr('id');
				pullToRefreshObject4.refresh();
				//快速回滚到该区域顶部
				mui('.imgList-wapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			}
			//验证
			validateDoWork();
			//刷新评论列表
			pullToRefreshObject.refresh();
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc3 = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount3;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc3 = function(response, isPullDown) {
			console.log("xxxxxxxxxxxxxxxxxxxxx成功请求数据：" + JSON.stringify(response));
			var litemplate1 = '<div id="{{id}} "class="resourceList mui-table-view-cell"><span id="{{uuId}}"></span><span id="{{vuId}}"></span><span id="{{type}}"class="type"></span><div class="numIndex">{{key}}</div><div class="setItemIcon"></div><div class="setItemName">{{title}}</div><div class="studyStatus">{{studyStatus}}</div></div>';
			var output = '';
			if(isPullDown) {
				if(Array.isArray(response)) {
					mui.each(response, function(key, value) {
						output = '';
						if(value.InfoList){
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
						}
						Zepto('.list-container').children('li').eq(key).append(output);
					});

					//初始化视频播放以及文档播放
					if(response[0]) {
						//视频 = 1,文档 = 2
						if (response[0].InfoList) {
							if(response[0].InfoList[0].type == 1) {
							Zepto('.mui-title').text('看视频');
							Zepto('#doc').css('display', 'none');
							isDocOrVideo = 1;
							noteType = 0;
//							initVodPlay();
							//播放记录跳转进来播放视频
							if(playTime&&ResourceId){
								var _this = Zepto('.list-container li');
								for (var i = 0; i < _this.length; i++) {
									var _thisInner = Zepto(_this[i]).find('.resourceList');
									for (var j = 0; j < _thisInner.length; j++) {
										var innerId = _thisInner[j].id;
										console.error(innerId);
										if(ResourceId.trim() == innerId.trim()){
											var num = (1+j)
											selectionsId = Zepto('.list-container').children('li').eq(i).children('div').eq(num).attr('id');
											selectionsNoteId = selectionsId;
											selectionsName = Zepto('.list-container').children('li').eq(i).children('div').eq(num).find('.setItemName').text();
											uuId = Zepto('.list-container').find('li').eq(i).children('div').eq(num).find('span:first-child').attr('id');
											vuId = Zepto('.list-container').find('li').eq(i).children('div').eq(num).find('span:nth-child(2)').attr('id');
											Zepto('.setItemName').css('color', '#000000');
											Zepto('.list-container').find('li').eq(i).children('div').eq(num).find('.setItemName').css('color','#7F8386');
										};
									};
								};
							}else{
								//资源中心中的播放界面
								selectionsId = Zepto('.list-container').children('li:first-child').find('div:nth-child(2)').attr('id');
								selectionsNoteId = selectionsId;
								selectionsName = Zepto('.list-container').children('li:first-child').find('div:nth-child(2)').find('.setItemName').text();
								uuId = Zepto('.list-container').find('li:first-child').find('div:nth-child(2) span:first-child').attr('id');
								vuId = Zepto('.list-container').find('li:first-child').find('div:nth-child(2) span:nth-child(2)').attr('id');
							};
							initVodPlay();
							
							
						} else if(response[0].InfoList[0].type == 2) {
							Zepto('.mui-title').text('看文档');
							Zepto('#doc').css('display', 'block');
							isDocOrVideo = 2;
							selectionsDocId = Zepto('.list-container').find('li:first-child').children('div:nth-child(2)').attr('id');
							noteType = 1;
							selectionsNoteId = selectionsDocId;
							//初始化看文档数据
							initWatchDocList();
						}
						};
					};
					//验证
					validateDoWork();
				};
			}
			//遍历选集改变选集中学习状态的颜色
			for(var i = 0; i < Zepto('.list-container-selection').children('li').length; i++) {
				for(var j = 0; j < Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList').length; j++) {
					if(Zepto(Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList')[j]).find('.studyStatus') == '未学完') {
						Zepto(Zepto(Zepto('.list-container-selection').children('li')[i]).children('.resourceList')[j]).find('.studyStatus').css('color', 'blue');
					}
				}
			};
			initPullRefresh();
		};

		PullToRefreshTools3.initPullDownRefresh({
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
				getLitemplate: getLitemplate3,
				getUrl: getUrl3,
				getRequestDataCallback: getData3,
				listdataId: 'listdata3',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh3',
				changeResponseDataCallback: changeResponseDataFunc3,
				itemClickCallback: onItemClickCallbackFunc3,
				changeToltalCountCallback: changeToltalCountFunc3,
				successRequestCallback: successCallbackFunc3,
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
			pullToRefreshObject3 = pullToRefresh;
			pullToRefreshObject3.refresh();
		});
	};

	/*
	 * 根据选集观看相应文档图片
	 */
	function initWatchDocList() {
		var beginIndex = 1;
		var pageSize = 100;
		//看文档
		var getLitemplate4 = function() { //;;;<img data-img-localcache='{{image}}' data-preview-src='{{image}}'/>
			var litemplate = "<img src='{{image}}' data-preview-src='{{image}}' data-preview-group='1' />";
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
			beginIndex = pageSize * CurrPage;
			var requestData = {};
			//动态校验字段
			var data = {
				pageIndex: CurrPage,
				pageSize: pageSize,
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
		var changeResponseDataFunc4 = function(response) {
			//console.log("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				console.error("看文档改变数据1111111111111111111111111111 ：" + JSON.stringify(tempArray[0].DocImageList));
				if(tempArray) {
					if(Array.isArray(tempArray)) {
						var Data = tempArray[0].DocImageList;
						console.log("看文档改变数据 ：" + JSON.stringify(Data));
						mui.each(Data, function(key, value) {
							if(value.image) {
								value.image = unescape(value.image);
								value.image = (value.image).replace(/\s+/g,"");
							};
						});
						tempArray = Data;
						console.log("xxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(tempArray));
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
			//console.log("总记录数：" + totalNumCount4);
			return totalNumCount4;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc4 = function(response) {
			//console.log("测试滑动到最后一页"+beginIndex);
			//console.log("总页数"+totalNumCount4);
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
			//预览照片
			mui.previewImage(true);
			//图片预览，修改源文件mui.previewimage.js ，加上自定义的DOM
			document.querySelector('.doc_preview').addEventListener('slide', function(event) {
				var currentPicCount = event.detail.slideNumber + 1;
				console.log("您当前预览第" + currentPicCount + "(张/页)");
				if(currentPicCount == totalNumCount4) {
					console.log("亲，您的文档已预览完毕！");
					videoPlayStatus = 3;
					validateDoWork();
					//业务逻辑：文档预览完毕，请求积分接口
					//				Tools.ajaxAddIntegral({
					//					userId: userId,
					//					userName: userName,
					//					resourceId: selectionsDocId,
					//					courseGuid: id
					//				});
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

	/*
	 * 评论
	 */
	function initPullRefresh() {
		var getLitemplate = function() {
			//var litemplate = '<li id="{{id}}" class="mui-table-view-cell CommentItem"><div class="headImgBorder"><img src="{{image}}" width="30px" height="30px"/></div><div class="commentBorder"><div class="commentUserName">{{nick}}</div><div class="commentDate">{{date}}</div><div class="commentContent">{{comment}}</div></div><div class="zanBorder"><span>{{praise}}</span><span>赞</span></div></li>';
			//var litemplate = '<li id="{{id}}"class="mui-table-view-cell CommentItem"><div class="headImgBorder"><img src="{{image}}"width="30px"height="30px"/></div><div class="commentBorder"><div class="commentUserName">{{nick}}</div><div class="commentDate">{{date}}</div><div class="commentContent">{{comment}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div><div class="reviewContent hasIt"><img src="../../img/educate/img_noticepic.png"/><span class="reviewName reviewNamer">木棉</span><span class="reviewEE">回复</span><span class="reviewName">木棉</span><span class="reviewName">:</span><span>你还好吗？？？？你还好吗你还好吗？？？？？？？</span><br/><div class="reviewDate">2016-11-14 xx xx xx</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div></div></div><div class="zanBorder"><span>{{praise}}</span><span>赞</span></div></li>';
			var litemplate = '<li id="{{id}}"class="mui-table-view-cell CommentItem"><span class="userId" id="{{userId}}"><div class="headImgBorder"><img src="{{image}}"width="30px"height="30px"/></div><div class="commentBorder"><div class="commentUserName">{{nick}}</div><div class="commentDate">{{date}}</div><div class="commentContent">{{comment}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div></div><div class="zanBorder"><span>{{praise}}</span><span>赞</span></div></li>';
			return litemplate;
		}

		var getUrl = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/videoPlayCommentList';
			console.log("url" + url);
			return url;
		}

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
				pageSize: 1000,
				id: selectionsNoteId,
				userId: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('评价请求参数' + requestData);
			//console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"+CurrPage);
			return requestData;
		}

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
				tempArray = response.data;
				console.log("response00000000000000000000000000000000000000000000000水水水水" + JSON.stringify(tempArray));
				totalNumCount = response.totalCount;
				IsPraise = [];
				mui.each(tempArray, function(key, value) {
					//console.log("-----------" + value.image);
					if(value.isPraise == 0) {
						//什么都不做
					} else if(value.isPraise == 1) {
						//console.log("key"+key);
						IsPraise.push(key);
						//Zepto('.zanBorder').addClass('zanBorder-active');
					};
					if(!value.image || value.image == 'image is not define') {
						//console.log("1");
						value.image = '../../img/MobileFrame/img_head_logo102-102.png';
					} else {
						value.image = unescape(value.image);
					};
					value.comment = unescape(value.comment);
				});
				//console.log("xxxxxxxxxxisPraise"+IsPraise);
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
			console.log("成功请求数据：" + JSON.stringify(response));
			//console.log("已经点赞的Li的index" + IsPraise);
			for(var i = 0; i < IsPraise.length; i++) {
				Zepto('.commentArea li').eq(IsPraise[i]).find('.zanBorder').addClass('zanBorder-active');
			};
			var litemplate1 = '<div id="{{replyId}}"class="reviewContent hasIt"><img src="{{image}}"/><span class="reviewName"id="{{userId}}">{{name}}</span><span class="reviewContentPanner">{{reviewContent}}</span><br/><div class="reviewDate">{{time}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div><div class="ZanBorder"><span class="secondCommentPraiseStatus" id="{{isPraise}}"></span><span class="secondZan">{{like}}</span><span>赞</span></div></div></div>';
			mui.each(response, function(key, value) {
				if(value.secondCommentList) {
					var output = '';
					if(Array.isArray(value.secondCommentList)) {
						mui.each(value.secondCommentList, function(key, value) {
							console.log("xxxxxxxxxxxxxvaluevalue" + JSON.stringify(value));
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
					Zepto(Zepto('.commentArea').children('li')[key]).find('.commentBorder').append(output);
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
			Zepto('.hasZan').parent('.ZanBorder').addClass('zanBorder-active');
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			var type = 0; //取消点赞为0，点赞为1
			commentId = this.id;
			//点赞
			if(Zepto(e.target).hasClass('zanBorder') || Zepto(e.target).parent().hasClass('zanBorder')) {
				var number = parseInt(Zepto(this).find('.zanBorder span:first-child').text());
				var _this = Zepto(this).find('.zanBorder');
				if(_this.hasClass('zanBorder-active')) {
					_this.removeClass('zanBorder-active');
					type = 0;
					var currentNum = number - 1;
					ajaxPraiseSubmit(commentId, type);
					Zepto(this).find('.zanBorder span:first-child').text(currentNum);
				} else {
					var currentNum = number + 1;
					_this.addClass('zanBorder-active');
					type = 1;
					ajaxPraiseSubmit(commentId, type);
					Zepto(this).find('.zanBorder span:first-child').text(currentNum);
				}
			} else if(Zepto(e.target).hasClass('ZanBorder') || Zepto(e.target).parent().hasClass('ZanBorder')) {
				var number = parseInt(Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text());
				var _this = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.ZanBorder');
				var secondReportId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
				if(_this.hasClass('zanBorder-active')) {
					_this.removeClass('zanBorder-active');
					type = 0;
					var currentNum = number - 1;
					ajaxPraiseSubmit(secondReportId, type);
					Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text(currentNum);
				} else {
					var currentNum = number + 1;
					_this.addClass('zanBorder-active');
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
					Zepto('#player').css('display', 'none');
				};
				if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
					A = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.reviewName').text();
				} else {
					A = Zepto(this).find('.commentUserName').text();
				};
				B = Zepto(this).find('.commentContent').text();
				C = Zepto(this).find('.userId').attr('id');
				D = Zepto(this).find('.commentUserName').text();
				E = commentId;
			} else if(Zepto(e.target).hasClass('report') || Zepto(e.target).parent().hasClass('report')) {
				//举报
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("举报");
				Zepto(".confirm-btn").text("举报");
				Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
				if(noteType == 0) {
					api.pauseVideo(); //暂停
					Zepto('#player').css('display', 'none');
				};
				if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
					commentId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
				};
			}
		};

		/**
		 * @description 点赞数据提交
		 */
		function ajaxPraiseSubmit(commentId, type) {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/praiseOperation';
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
					//console.log("赞的响应参数" + JSON.stringify(response));
					if(type == 0) {
						UIUtil.toast(response.description);
					} else {
						UIUtil.toast(response.description);
					}
				}
				//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
			}, function() {
				UIUtil.toast('网络连接超时！请检查网络...');
			}, 1, secretKey, false);
		};

		/**
		 * @description 获取视频评论列表数据
		 * @description 初始化下拉刷新控件
		 */
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			down: {
				height: 45
			},
			indicators: false, //是否显示滚动条
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
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};

	/**
	 * @description 资源中心评论举报
	 */
	function ajaxCommentReport() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/makeReport';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/makeReport';
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

	Zepto('.cancel-btn,.mui-icon-closeempty').on('tap', function() {
		CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
		document.getElementById("reason").value = "";
		if(noteType == 0) {
			api.resumeVideo();
			Zepto('#player').css('display', 'block');
		};

	});

	//确认举报按钮
	Zepto(".confirm-btn").on('tap', function() {
		var btnOk = Zepto(this).text();
		//举报
		var inputStr = document.getElementById("reason").value;
		if(btnOk == "举报") {
			if(!inputStr) {
				mui.alert("亲，请填写举报理由！");
			} else if(StringUtil.getByteLen(inputStr) >= 100) {
				UIUtil.toast('字数太多,请重新输入');
			} else {
				ajaxCommentReport();
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
				if(noteType == 0) {
					api.resumeVideo();
					Zepto('#player').css('display', 'block');
				};
			}
		} else if(btnOk == "回复") {
			if(!inputStr) {
				mui.alert("亲，请填写回复内容！");
			} else if(StringUtil.getByteLen(inputStr) >= 100) {
				UIUtil.toast('字数太多,请重新输入');
			} else {
				//console.log("" + JSON.stringify(replyPara));
				//发表超过30个字数，应该提示“用户”
				ajaxPublishSecondComment(E, B, C, D);
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
				if(noteType == 0) {
					api.resumeVideo();
					Zepto('#player').css('display', 'block');
				};
			}
		}
	});

	//发表评论
	Zepto('#btnPublish').on('tap', function() {
		var _thisText = Zepto('.comment input').val();
		if(Zepto('.comment input').val() == '' || Zepto('.comment input').val() == null) {
			UIUtil.toast('发表内容不可为空噢');
		} else if(StringUtil.getByteLen(_thisText) >= 100) {
			UIUtil.toast('字数太多，请重新输入');
		} else {
			ajaxPublishComment();
			Zepto('.comment input').val('');
		}
	});

	/**
	 * @description 评论提交
	 */
	function ajaxPublishComment() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var requestData = {
			resourceId: selectionsNoteId,
			userId: userId,
			userName: userName,
			content: StringUtil.utf16toEntities(Zepto('.comment input').val()),
			commentId: "",
			rpcontent: "",
			rpuserId: "",
			rpuserName: "",
			floor: 1 //1:一级评论 2:二级评论
		};
		requestData = JSON.stringify(requestData);
		console.log("发表评论参数" + requestData);
		console.log("发表评论url" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("发表评论" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				pullToRefreshObject.refresh();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 单独二级评论提交
	 */
	function ajaxPublishSecondComment(commentId, rpcontent, rpuserId, rpuserName) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
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
		//		console.log("发表评论参数" + requestData);
		//		console.log("发表评论url" + url);
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

	function initNoteRefresh() {
		//获取笔记模板
		var getLitemplate2 = function() {
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell myNoteItem"><div class="myNoteItemDiv"><img class="timeIcon" src="../../img/studyCircle/img_public_service.png" width="12px" height="12px" /><div class="NoteNoteTime"><span class="sanjiaoxin"></span><span class="NoteNoteTimeText">{{playRecordTime}}</span></div><div class="NoteNoteUserName"></div><div class="NoteNoteContent">{{content}}</div><div class="NoteNoteDateZan"><div class="NoteNoteDate">{{createNoteTime}}</div></div></div></li>';
			return litemplate;
		}

		//获取笔记接口
		var getUrl2 = function() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/noteList';
			console.log('笔记url:' + url);
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
				courseGuid: id
			}
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('获取笔记的请求参数' + requestData);
			//console.log("xxxxxxxxxxxx" + secretKey);
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
			console.log("笔记的相应参数" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				tempArray = response.data;
				totalNumCount2 = response.totalCount;
				//console.log("xxxxxxxxx"+JSON.stringify(tempArray));
				mui.each(tempArray, function(key, value) {
					value.content = unescape(value.content);
				});
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
				Zepto('.NoteNoteTime').css('display', 'block');
			} else if(isDocOrVideo == 2) {
				Zepto('.NoteNoteTime').css('display', 'none');
			}
		};

		PullToRefreshTools2.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			//下拉有关
			down: {
				height: 30
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate2,
				getUrl: getUrl2,
				getRequestDataCallback: getData2,
				listdataId: 'listdata2',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh2',
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
	};

	//添加笔记
	Zepto('#commitButton').on('tap', function() {
		//console.log("笔记内容："+Zepto('#commitNote').val());
		if(Zepto('#commitNote').val() == '' || Zepto('#commitNote').val() == null) {
			UIUtil.toast('发表内容不可为空噢');
		} else if(StringUtil.getByteLen(Zepto('#commitNote').val()) > 600) {
			UIUtil.toast('亲,字数太多重新输入');
		} else {
			if(isDocOrVideo == 1) {
				ajaxcommitNote();
			} else if(isDocOrVideo == 2) {
				getVideoTime = '';
				ajaxcommitNote();
			}
		}
	});
	//监听键盘输入事件
	document.getElementById("commitNote").addEventListener('input', function() {

	});

	/**
	 * @description 添加笔记
	 */
	function ajaxcommitNote() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/addNote';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/addNote';
		var requestData = {
			type: noteType,
			courseGuid: id,
			resourceId: selectionsNoteId,
			userId: userId,
			userName: userName,
			content: Zepto('#commitNote').val(),
			timePoint: StringUtil.getTimeFromSeconds(getVideoTime)
		};
		requestData = JSON.stringify(requestData);
		console.log("获取当前笔记请求参数" + requestData);
		console.log("xxxxxxxxxxxxx" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				console.log("xxxxxxxxx" + JSON.stringify(response));
				UIUtil.toast(response.description);
				//置空发表内容
				Zepto('#commitNote').val('');
				pullToRefreshObject2.refresh();
				//快速回滚到该区域顶部
				mui('.listwrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/*
	 * ajax请求是否已经收藏了本视频
	 */
	function validateIsSaveStatus() {
		//var url = config.MockServerUrl +'resourceCenter/mobile/resourceCenter/getIsSaveStatus';
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
		//		console.log("返回xxxxxxxxxxxxxxxx" + requestData);
		//		console.log("返回xxxxxxxxxxxxxxxx" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				//console.log("xxxxxxxxxxxxxxxxxxxxtempInfo" + JSON.stringify(response));
				var IsSave = response.data.isSave;
				initIsSaveVideo(IsSave);
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
			//console.log("0");
		} else if(IsSave == 1) {
			//console.log("1");
			Zepto('.saveVideo').addClass('saveVideo-active');
		}
	}

	//收藏视频
	Zepto('.saveVideo').on('tap', function() {
		var saveType = null;
		var _this = Zepto(this);
		if(_this.hasClass('saveVideo-active')) {
			_this.removeClass('saveVideo-active');
			saveType = 0;
		} else {
			_this.addClass('saveVideo-active');
			saveType = 1;
		}
		ajaxSaveVideo(saveType);
	});

	/**
	 * @description 收藏视频ajax请求
	 */
	function ajaxSaveVideo(saveType) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
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
		//		console.log("收藏的requestData" + requestData);
		//		console.log("收藏的url"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			//console.log("收藏操作的返回数据"+JSON.stringify(response));
			if(response.code == 1) {
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/*
	 * 取消做笔记
	 */
	Zepto("#closeWin").on("tap", function() {
		//********取消做笔记菜单，重新恢复视频播放**
		if(isDocOrVideo == 1) {
			api.resumeVideo();
			Zepto('#player').css('display', 'block');
			Zepto("#takeNoteBorder").hide();
			Zepto(".zhezhao-area").hide();
		} else if(isDocOrVideo == 2) {
			Zepto("#takeNoteBorder").hide();
			Zepto(".zhezhao-area").hide();
		}
	});
	/**
	 * 开始做笔记
	 */
	Zepto("#clickWriteNote").on("tap", function() {
		if(isDocOrVideo == 1) {
			//********点击作笔记，立马暂停视频**********
			api.pauseVideo(); //暂停
			//getVideoTime = StringUtil.getTimeFromSeconds(getVideoTime); //获取当前播放的时间(单位:秒).
			Zepto('#player').css('display', 'none');
			Zepto("#takeNoteBorder").show();
			Zepto(".zhezhao-area").show();
			pullToRefreshObject2.refresh();
		} else if(isDocOrVideo == 2) {
			Zepto("#takeNoteBorder").show();
			Zepto(".zhezhao-area").show();
			pullToRefreshObject2.refresh();
		}

	});

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
		//console.log("获得视频当前播放时间" + getVideoTime);
		//console.log("转换后的视频当前播放时间" + StringUtil.getTimeFromSeconds(getVideoTime));
	});

	//进行视频搜索.seekTo 所需参数: 时间点(单位:120秒)
	Zepto(".seekTo").on("tap", function() {
		//api.seekTo(120);
		//console.log("搜索视频进行播放：" + getTimeFromSeconds(10000));
	});

	/**
	 * @description 记录当前视频播放时长
	 */
	function takeNotesVideoShow(data1) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoShowRecord';
		var url = config.JServerUrl + 'resourceCenter/mobile/edu/videoShowRecord';
		var requestData = {};
		var data = data1;
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("xxxxxxxxxxxxxx播放记录" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//传入成功
				//UIUtil.toast('您当前播放到' + StringUtil.getTimeFromSeconds(data.playRecord) + '秒');
				WindowUtil.firePageEvent("szpark_playrecord_list.html", "refreshPlayRecord");
				UIUtil.closeWaiting();
				_back();
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	mui.back = function() {
		//alert("ios点击了退出！！！！！！！"+videoStatus);
		//alert("videoStatus+");
		if(isDocOrVideo == 1) {
			//alert("videoStatus+"+videoStatus);
			//首次按键
			//********点击退出，立马暂停视频**********
			api.pauseVideo(); //暂停
			//getVideoTime = api.getVideoTime(); //获取当前播放的时间(单位:秒).
			var extras = {
				id: id,
				playRecord: getVideoTime,
				selectionsId: selectionsId,
				selectionsName: selectionsName,
				userId: userId,
				userName: userName
			};
			//视频处于播放状态
			if(isEnd == 1) {
				//alert("视频已经播放完");
				_back();
			} else if(videoStatus == 1) {
				//Zepto('#player').css('display', 'none');
				UIUtil.confirm({
					content: '保存视频当前播放时长',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//解决Uiutil会影响视频的问题
						//console.log("播放记录上传数据11111111111111111111");
						//alert("播放记录上传数据"+JSON.stringify(extras));
						//alert("播放记录上传数据"+(extras.playRecord));
						takeNotesVideoShow(extras);
					} else {
						_back();
					}
				});
			} else {
				//alert("是否正在播放就退出");
				_back();
			}
		} else {
			//alert("ios没有判断直接退出了");
			_back();
		}
	};

	/*
	 * @Description:视频播放界面发表评价
	 * 
	 */
	//发表评价
	Zepto('#clickPraise').on('tap', function() {
		//********点击发表评价，立马暂停视频**********
		if(isDocOrVideo == 1) {
			//评价视频
			api.pauseVideo(); //暂停
		}
		Zepto(".zhezhao-area").css('display', 'block');
		Zepto('.overallPraise').css('display', 'block');
		Zepto('#player').css('display', 'none');
	});

	//取消发表评价
	Zepto('.cancel').on('tap', function() {
		Zepto('.overallPraise').css('display', 'none');
		Zepto('.zhezhao-area').css('display', 'none');
		Zepto('#player').css('display', 'block');
		//恢复视频播放
		//api.resumeVideo();
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
		Zepto('.zhezhao-area').css('display', 'none');
		Zepto('.overallPraise').css('display', 'none');
		Zepto('#player').css('display', 'block');
		//恢复视频播放
		//api.resumeVideo();
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
		console.log("xxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.toast(response.description);
				Zepto('.zhezhao').css('display', 'none');
				Zepto('.overallPraise').css('display', 'none');
				Zepto('.overallPri div').removeClass('overallPriActive').addClass('overallCommon');
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//做题功能
	Zepto('.solveProblems').on('tap', function() {
		videoPlayStatus = 2;
		//评价视频
		api.pauseVideo(); //暂停
		validateDoWork();
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
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				var integralStatus = tempInfo.integralStatus;
				var questionStatus = tempInfo.questionStatus;
				console.error("integralStatus" + integralStatus + '---------------' + 'questionStatus' + questionStatus);
				console.log("xxxxxxxxxxxxx" + videoPlayStatus);
				/*
				 * @Description 不存在题目的情况下;有一种情况如下：
				 * @Description 看完直接上传积分
				 */
				if(questionStatus == 0) {
					Zepto('.solveProblems').css('display', 'none');
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
							//不存在题目看完文档上传积分
							Tools.ajaxAddIntegral({
								userId: userId,
								userName: userName,
								resourceId: selectionsDocId,
								courseGuid: id
							});
							videoPlayStatus = 0;
						}
					};
				} else {
					/*
					 * @Description   存在题目的情况下;有两种情况如下
					 * @Description ①积分为0，，直接跳转做题
					 * @Description ②有积分可以手动点击做题，跳转到做题页面
					 */
					Zepto('.solveProblems').css('display', 'block');
					//视频情况下
					if(noteType == 0) {
						if(videoPlayStatus == 1) {
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								WindowUtil.createWin("resource_center_exercises_list.html", "resource_center_exercises_list.html", {
									resourceId: selectionsNoteId,
									courseGuid: id
								});
							};
						} else if(videoPlayStatus == 2) {
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								mui.alert('请看完该视频再做题');
								//存在积分	
							} else {
								videoPlayStatus = 0;
								WindowUtil.createWin("resource_center_exercises_list.html", "resource_center_exercises_list.html", {
									resourceId: selectionsNoteId,
									courseGuid: id
								});
							};
						};
					} else if(noteType == 1) {
						if(videoPlayStatus == 3) {
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								WindowUtil.createWin("resource_center_exercises_list.html", "resource_center_exercises_list.html", {
									resourceId: selectionsDocId,
									courseGuid: id
								});
							};
						} else if(videoPlayStatus == 2) {
							//不存在积分
							if(integralStatus == 0) {
								videoPlayStatus = 0;
								mui.alert('请看完该文档再做题');
								//存在积分	
							} else {
								videoPlayStatus = 0;
								WindowUtil.createWin("resource_center_exercises_list.html", "resource_center_exercises_list.html", {
									resourceId: selectionsDocId,
									courseGuid: id
								});
							};
						};
					};
				};
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//监听上传积分刷新选集学习状态
	window.addEventListener('refreshChoiceList', function() {
		pullToRefreshObject3.refresh();
	});
});