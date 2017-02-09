/**
 * 描述 :原创展示视频播放页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-10-26 14:05:48
 */
define(function(require, exports, module) {
	"use strict";
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var api, pullToRefreshObject; //全局点播API定义
	var secretKey = '',
		userId = '',
		userName = '',
		uuId = '',
		vuId = '',
		resourceId = '',
		IsPraise = [],
		totalNumCount = 0;
	var A = '', //二级评论参数传递
		B = '',
		C = '',
		D = '',
		E = '',
		commentId = '';
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//获取缓存信息;
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
		uuId = WindowUtil.getExtraDataByKey('uuId');
		vuId = WindowUtil.getExtraDataByKey('vuId');
		console.log("xxxxxxxxxxxxxxxxxxx" + uuId + 'XXXXXXXXXXXXXXXXXXXXXX' + vuId);
		resourceId = WindowUtil.getExtraDataByKey('resourceId');
		initVodPlay();
		initPullRefreshCommentList();
	};

	//乐视云播放器配置
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
			autoplay: 0, //是否自动播放
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
		//console.log("获得视频当前播放时间" + getVideoTime);
		//console.log("转换后的视频当前播放时间" + StringUtil.getTimeFromSeconds(getVideoTime));
	});

	//进行视频搜索.seekTo 所需参数: 时间点(单位:120秒)
	Zepto(".seekTo").on("tap", function() {
		//api.seekTo(120);
		//console.log("搜索视频进行播放：" + getTimeFromSeconds(10000));
	});

	//评论下拉刷新
	/*
	 * 评论
	 */
	function initPullRefreshCommentList() {
		var getLitemplate = function() {
			var litemplate = '<li id="{{id}}" class="mui-table-view-cell CommentItem"><span class="userId" id="{{userId}}"></span><div class="headImgBorder"><img src="{{image}}" width="30px" height="30px"/></div><div class="commentBorder"><div class="commentUserName">{{nick}}</div><div class="commentDate">{{date}}</div><div class="commentContent">{{comment}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div></div><div class="zanBorder"><span>{{praise}}</span><span>赞</span></div></li>';
			return litemplate;
		}

		var getUrl = function() {
			//var url = config.MockServerUrl + 'menubar/orginalDiplay/commentList';
			var url = config.JServerUrl + 'menubar/orginalDiplay/commentList';
			//console.log("url" + url);
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
				resourceId: resourceId,
				userId: userId,
				originalType: 0
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('评价请求参数' + requestData);
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
				console.log("response00000000000000000000000000000000000000000000000水水水水" + JSON.stringify(response));
				tempArray = response.data;
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
			//console.log("成功请求数据：" + JSON.stringify(response));
			//console.log("已经点赞的Li的index" + IsPraise);
			for(var i = 0; i < IsPraise.length; i++) {
				Zepto('.commentArea li').eq(IsPraise[i]).find('.zanBorder').addClass('zanBorder-active');
			};
			var litemplate1 = '<div id="{{replyId}}"class="reviewContent hasIt"><img src="{{image}}"/><span class="reviewName"id="{{userId}}">{{name}}</span><span>{{reviewContent}}</span><br/><div class="reviewDate">{{time}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div><div class="ZanBorder"><span class="secondCommentPraiseStatus" id="{{isPraise}}"></span><span class="secondZan">{{like}}</span><span>赞</span></div></div></div>';
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
			secretKey = StorageUtil.getStorageItem("secretKey");
			var userSession = StorageUtil.getStorageItem("UserSession");
			if(userSession) {
				if(userSession.userId) {
					userId = userSession.userId;
				};
				if(userSession.userName) {
					userName = userSession.userName;
				};
			};
			//点赞
			if(Zepto(e.target).hasClass('zanBorder') || Zepto(e.target).parent().hasClass('zanBorder')) {
				var number = parseInt(Zepto(this).find('.zanBorder span:first-child').text());
				var _this = Zepto(this).find('.zanBorder');
				if(LoginUtil.isLoginSystem()) {
					//已结登录
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
					};
				} else {
					UIUtil.confirm({
						content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
						title: '温馨提示',
						buttonValue: ['确定', '取消']
					}, function(index) {
						if(index == 0) {
							LoginUtil.ResetTARGET_URL('szpark_original_display_videoPlayer.html');
							WindowUtil.createWin("login.html", LoginUtil.loginUrl());
						}
					});
				};
			} else if(Zepto(e.target).hasClass('ZanBorder') || Zepto(e.target).parent().hasClass('ZanBorder')) {
				var number = parseInt(Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text());
				var _this = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.ZanBorder');
				var secondReportId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
				if(LoginUtil.isLoginSystem()) {
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
				} else {
					UIUtil.confirm({
						content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
						title: '温馨提示',
						buttonValue: ['确定', '取消']
					}, function(index) {
						if(index == 0) {
							LoginUtil.ResetTARGET_URL('szpark_original_display_videoPlayer.html');
							WindowUtil.createWin("login.html", LoginUtil.loginUrl());
						}
					});
				};
			} else if(Zepto(e.target).hasClass('review') || Zepto(e.target).parent().hasClass('review')) {
				if(LoginUtil.isLoginSystem()) {
					CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
					Zepto("#commontitle").text("评论回复");
					Zepto(".confirm-btn").text("回复");
					Zepto("#reason").attr("placeholder", "请输入回复内容！(50字以内)");
					api.pauseVideo(); //暂停
					Zepto('#player').css('display', 'none');
					if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
						A = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.reviewName').text();
					} else {
						A = Zepto(this).find('.commentUserName').text();
					};
					B = Zepto(this).find('.commentContent').text();
					C = Zepto(this).find('.userId').attr('id');
					D = Zepto(this).find('.commentUserName').text();
					E = commentId;
				} else {
					UIUtil.confirm({
						content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
						title: '温馨提示',
						buttonValue: ['确定', '取消']
					}, function(index) {
						if(index == 0) {
							LoginUtil.ResetTARGET_URL('szpark_original_display_videoPlayer.html');
							WindowUtil.createWin("login.html", LoginUtil.loginUrl());
						}
					});
				}
			} else if(Zepto(e.target).hasClass('report') || Zepto(e.target).parent().hasClass('report')) {
				if(LoginUtil.isLoginSystem()) {
					//举报
					CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
					Zepto("#commontitle").text("举报");
					Zepto(".confirm-btn").text("举报");
					Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
					api.pauseVideo(); //暂停
					Zepto('#player').css('display', 'none');
					if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
						commentId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
					};
				} else {
					UIUtil.confirm({
						content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
						title: '温馨提示',
						buttonValue: ['确定', '取消']
					}, function(index) {
						if(index == 0) {
							LoginUtil.ResetTARGET_URL('szpark_original_display_videoPlayer.html');
							WindowUtil.createWin("login.html", LoginUtil.loginUrl());
						}
					});
				};
			};
		};

		/**
		 * @description 点赞数据提交
		 */
		function ajaxPraiseSubmit(commentId, type) {
			//var url = config.MockServerUrl + 'menubar/orginalDiplay/tapOperation';
			var url = config.JServerUrl + 'menubar/orginalDiplay/tapOperation';
			var requestData = {};
			//requestData.ValidateData = 'validatedata';
			var data = {
				id: commentId,
				type: type,
				userId: userId,
				userName: userName,
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
	 * @description 原创展示评论举报
	 */
	function ajaxCommentReport() {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/makeReport';
		var url = config.JServerUrl + 'menubar/orginalDiplay/makeReport';
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
		console.log("xxxxx" + url);
		console.log("xxxxxxxx" + requestData);
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

	//关闭弹出框
	Zepto('.cancel-btn,.mui-icon-closeempty').on('tap', function() {
		CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
		document.getElementById("reason").value = "";
		api.resumeVideo();
		Zepto('#player').css('display', 'block');
	});

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
				api.resumeVideo();
				Zepto('#player').css('display', 'block');
			}
		} else if(btnOk == "回复") {
			if(!inputStr) {
				mui.alert("亲，请填写回复内容！");
			} else {
				//console.log("" + JSON.stringify(replyPara));
				//发表超过30个字数，应该提示“用户”
				if(StringUtil.getByteLen(inputStr) < 100) {
					ajaxPublishSecondComment(E, B, C, D);
					CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
					api.resumeVideo();
					Zepto('#player').css('display', 'block');
				} else {
					mui.toast("字数太多，请重新输入");
				}
			}
		}
	});

	//提交评论
	//发表评论
	Zepto('#btnPublish').on('tap', function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		if(LoginUtil.isLoginSystem()) {
			if(Zepto('.comment input').val() == '' || Zepto('.comment input').val() == null) {
				UIUtil.toast('发表内容不可为空噢');
			} else if(StringUtil.getByteLen(Zepto('.comment input').val()) > 100) {
				mui.toast("字数太多，请重新输入");
			} else {
				ajaxPublishComment();
				Zepto('.comment input').val('');
			};
		} else {
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					LoginUtil.ResetTARGET_URL('szpark_original_display_videoPlayer.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		};
	});

	/**
	 * @description 评论提交
	 */
	function ajaxPublishComment() {
		//var url = config.MockServerUrl + 'menubar/orginalDiplay/publishComments';
		var url = config.JServerUrl + 'menubar/orginalDiplay/publishComments';
		var requestData = {
			originalType: 0,
			resourceId: resourceId,
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
		//console.log("发表评论参数"+requestData);
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
		var url = config.JServerUrl + 'menubar/orginalDiplay/publishComments';
		var requestData = {
			resourceId: resourceId,
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

	//监听自定义事件
	window.addEventListener('refreshVideoCommentsList', function() {
		//重定向之后刷新评论列表，获取基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		initVodPlay();
		initPullRefreshCommentList();
	});

});