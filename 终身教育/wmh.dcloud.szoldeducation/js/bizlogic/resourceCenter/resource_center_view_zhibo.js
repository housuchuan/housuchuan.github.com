/**
 * 描述 : 直播js
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-11 13:43:55
 */
define(function(require, exports, module) {
	//	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var id = '';
	var activityId = '';
	//用户信息
	var secretKey = '';
	//var secretKey = config.secretKey;
	//var secretKey = "";
	var userId = "";
	var userName = "";
	var PageSize = 10;
	var totalNumCount = 0;
	var pullToRefreshObject;
	var beginIndex;
	var ServerUrl = config.JServerUrl;
	CommonUtil.initReady(function() {
		id = WindowUtil.getExtraDataByKey('videoId');
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		getZhiboIntroData();
		initPullRefresh();
		//console.log("id" + id);
	});

	function initLeBroadcast(activityId) {
		var p = new CloudLivePlayer();
		var playerConf = {
			// activeProxy data{"activityId":"A2016091400002g0","activityName":"园区终身学习课程资源","activityState":1,"ark":"0","beginTime":"1473866820","coverImgUrl":"http://i0.letvimg.com/lc04_live/201609/14/23/28/1473866888662new.png","description":"测试测试","endTime":"1475162820","isNeedAd":1,"liveNum":1,"lives":[{"liveId":"201609143000003hd","machine":"1","playTypes":"1,2,3","status":"1"}],"needFullView":0,"needTimeShift":0,"playMode":0,"playerPageUrl":"http://live.lecloud.com/live/playerPage/getView?activityId=A2016091400002g0"}----time:{"responseTime":222,"retryCount":1} at http://yuntv.letv.com/player/live/blive.js:51
			activityId: activityId, //activityId 请换成自己设置的获得id,可播放的id:A20160915000001c
			autoplay: 1,
			//ark: "106",
			//playsinline: "1", //Ios 设备Web view下默认不全屏播放（1：启动，0：不启动）
			//gpcflag: 1,
			callbackJs: "TTVideoInit"
		};
		p.init(playerConf, "player"); //创建播放器的实例
	}
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
	 * @description 请求直播视频简介数据
	 */
	function getZhiboIntroData() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getProgramIntroById';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			id: id,
			type: 1
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("ssss" + JSON.stringify(requestData));
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

	//直播课次初始化下拉刷新
	function initPullRefresh() {
		function getLitemplate() {
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell setItem"><div class="topleft-triangle"></div><div class="topleft-text">{{broadcastStatus}}</div><span id="{{activityId}}" class="activityId"></span><div class="setItemName">{{title}}</div></br><div class="broadcastTimeWrapper"><div class="broadcastTime"><span>直播开始时间：</span><span>{{broadcastStartTime}}</span></div><div class="broadcastTime"><span>直播结束时间：</span><span>{{broadcastEndTime}}</span></div><div class="broadcastTime"><span>直播状态：</span><span>{{broadcastStatus}}</span></div></div></li>';
			return litemplate;
		}

		function getUrl() {
			//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/mobileLivingLessonsList';
			var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/mobileLivingLessonsList';
			//console.log("URL===="+url);
			return url;
		}

		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		function getData(CurrPage) {
			beginIndex = CurrPage * PageSize;
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: id
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('课次请求参数' + requestData);
			return requestData;
		}

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		function changeResponseDataFunc(response) {
			//console.log("11111111111111111111111111111111"+beginIndex);
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				//console.log("直播课次列表数据" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					var status = value.broadcastStatus;
					switch(status) {
						case '0':
							value.broadcastStatus = '未开播';
							break;
						case '1':
							value.broadcastStatus = '正在直播';
							break;
						case '2':
							value.broadcastStatus = '直播结束';
							break;
						default:
							break;
					}
				})
			}
			return tempArray;
		}

		/*
		 * @description 列表点击事件
		 */
		function onItemClickCallbackFunc(e) {
			activityId = Zepto(this).find('.activityId').attr('id');
			console.error("切换直播活动到:【" + activityId + "】");
			Zepto(this).find('.broadcastTimeWrapper,.topleft-triangle,.topleft-text').css('display', 'block');
			Zepto(this).siblings().find('.broadcastTimeWrapper,.topleft-triangle,.topleft-text').css('display', 'none');
			if(Zepto(this).find('.topleft-text').text() == '正在直播'){
				Zepto(this).find('.topleft-triangle').css('border-top','40px solid red');
			}else if(Zepto(this).find('.topleft-text').text() == '未开播'){
				Zepto(this).find('.topleft-triangle').css('border-top','40px solid blueviolet');
			}else if(Zepto(this).find('.topleft-text').text() == '直播结束'){
				Zepto(this).find('.topleft-triangle').css('border-top','40px solid #808080');
			};
			//初始化直播
			initLeBroadcast(activityId);
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		function changeToltalCountFunc() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		function successCallbackFunc(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			activityId = Zepto('.list-container-selection li:first-child').find('.activityId').attr('id');
			if(Zepto('.list-container li:first-child').find('.topleft-text').text() == '正在直播'){
				Zepto('.list-container li:first-child').find('.topleft-triangle').css('border-top','40px solid red');
			}else if(Zepto('.list-container li:first-child').find('.topleft-text').text() == '未开播'){
				Zepto('.list-container li:first-child').find('.topleft-triangle').css('border-top','40px solid blueviolet');
			}else if(Zepto('.list-container li:first-child').find('.topleft-text').text() == '直播结束'){
				Zepto('.list-container li:first-child').find('.topleft-triangle').css('border-top','40px solid #808080');
			};
			//初始化直播
			initLeBroadcast(activityId);
		};

		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			//下拉有关
			down: {
				height: 15
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
	}

});