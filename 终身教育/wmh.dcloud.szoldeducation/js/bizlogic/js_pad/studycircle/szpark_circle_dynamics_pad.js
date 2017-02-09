/**
 * 描述 :圈子动态列表页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-09-14 19:07:29
 */
define(function(require, exports, module) {
	"use strict";
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var HtmlTools = require('core/MobileFrame/HtmlUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UploadH5Tools = require('core/MobileFrame/UpLoadH5Util.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	//Tools该工具类主要是优化代码，把一些初始化的操作放在这里面，关联性耦合性低的操作放在这里面
	var Tools = require('bizlogic/studycircle/szpark_circle_dynamics_list_Util.js');
	var maxLenth = parseInt(Zepto('.font-num span:last-child').text());
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	//圈子唯一标识
	var circleId = null;
	//圈子标题（名称）
	var circleName = null;
	//话题topicId
	var topicId = null;
	//话题名称
	var topicName = null;
	var data2 = {};
	//临时全局选择上传的图片附件
	var imgArray = [];
	//用户信息
	var secretKey = "";
	var userId = "";
	var userName = "";
	var image = "";
	var pullToRefreshObject;
	//话题关键字搜索
	var keyWord = "";
	//加好友参数
	var ownerId = '',
		ownerName = '',
		flag = false;
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
		if(userSession.image) {
			image = userSession.image;
		}
		circleId = WindowUtil.getExtraDataByKey("circleId"); //获取圈子ID
		//一进入该页面，圈子点击量+1
		Tools.CircleClickCountAdd(circleId);
		//console.log(circleId);
		//请求基本信息
		ajaxDetailData(circleId);
		//初始化监听
		Tools.initComponents();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxDetailData(circleId) {
		//var url_detail = 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/appservice/CircleBasicInfo';
		//var url_detail = config.MockServerUrl + "studycircle/cricleBaseInfo";
		var url = config.JServerUrl + 'circle/mobile/detail/cricleBaseInfo';
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			circleId: circleId,
			userId: userId
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("参数" + requestData);
		//console.log("url"+url);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, successRequestCallback, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
	//请求详情数据成功回调
	function successRequestCallback(response) {
		UIUtil.closeWaiting();
		//console.log("圈子基本信息：\n" + StringUtil.formatJson(response));
		var response = CommonUtil.handleStandardResponse(response, "2");
		//console.log("圈子基本信息：\n" + JSON.stringify(response.data));
		if(response.code == "1") {
			var tmpInfo = response.data;
			if(!tmpInfo.image) {
				tmpInfo.image = '../../../img/MobileFrame/img_default_noimage130-130.png';
			} else {
				tmpInfo.image = unescape(tmpInfo.image);
			};
			circleName = unescape(tmpInfo.title);
			tmpInfo.title = unescape(tmpInfo.title);
			tmpInfo.introduction = unescape(tmpInfo.introduction);
			Zepto("#headerContent").html('');
			var litemplate = '<div><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">圈子动态</h1><!--<a><span class="mui-icon mui-icon-search"></span></a>--></div><div class="columnIntro"><div class="columnImg"><img src="{{image}}"/></div><div class="parkBroadCast">{{title}}</div><div class="park-info"><div class="park-member"><span>{{member}}</span><span>成员</span></div><div class="park-describe"><p class="mui-ellipsis-2">{{introduction}}</p></div><div class="more"><span>显示更多</span></div><button type="button"class="mui-btn mui-btn-blue mui-btn-block joinBtn">申请加入</button></div></div>';
			var output = Mustache.render(litemplate, tmpInfo);
			Zepto("#headerContent").append(output);
			//映射渲染动态区模板
			var dynatmicHeader = '<div>动态区</div><div class="input-search"><input type="text" name="" id="searchValue" value="" placeholder="请输入关键字搜索"/><button type="button"class="mui-btn mui-btn-blue mui-btn-block searchBtn"><a><span class="mui-icon mui-icon-search"></span></a></button><button type="button"class="mui-btn mui-btn-blue mui-btn-block publishBtn"><img src="../../../img/img_pad/studycircle/img_publishIcon.png"/><span>发表</span></button></div>';
			Zepto(".dynatmic-header").html('');
			Zepto(".dynatmic-header").append(dynatmicHeader);
			//（isManager  0/1/2/3/4:申请加入/已加入/圈主/待审核/被删除的和被拒绝的） 
			console.log("xxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(tmpInfo));
			if(tmpInfo.isManager == "0") {
				//申请加入
				Zepto(".joinBtn").text("申请加入");
				Zepto(".joinBtn").css('background', '#1ebaf3');
			} else if(tmpInfo.isManager == "1") {
				//已加入
				//Zepto(".joinBtn").text("已加入");
				//Zepto(".joinBtn").css('background', 'gray');
				//Zepto(".joinBtn").attr('disabled', 'disabled');
				Zepto(".joinBtn").text("退出圈子");
				Zepto(".joinBtn").css('background', '#1ebaf3');
			} else if(tmpInfo.isManager == "2") {
				//圈主
				Zepto(".joinBtn").hide();
				Zepto(".joinBtn").text("已是圈主");
				Zepto(".joinBtn").css('background', 'gray');
				Zepto(".joinBtn").attr('disabled', 'disabled');
			} else if(tmpInfo.isManager == "3") {
				//审核中....
				Zepto(".joinBtn").hide();
				Zepto(".joinBtn").text("待审核");
				Zepto(".joinBtn").css('background', 'gray');
				Zepto(".joinBtn").attr('disabled', 'disabled');
			} else if(tmpInfo.isManager == "4") {
				//不作处理
				// 被删除的和被拒绝的”，页面上不显示状态。
				Zepto(".joinBtn").hide();
				Zepto(".joinBtn").text("审核不通过");
				Zepto(".joinBtn").css('background', 'gray');
				Zepto(".joinBtn").attr('disabled', 'disabled');
			};
			//监听渲染控件的点击事件
			initListener();
			//初始化下拉列表
			initPullRefreshList();

		}
	};

	//点击加入圈子事件
	Zepto(".confirm-btn").on('tap', function() {
		var btnOk = Zepto(this).text();
		//用户加入某个圈子
		var inputStr = document.getElementById("reason").value;
		if(btnOk == "申请加入") {
			if(!inputStr) {
				mui.alert("亲，请填写加入理由！");
			} else {
				Tools.joinCircleFunc(circleId, inputStr);
			}
		} else if(btnOk == "举报") {
			if(!inputStr) {
				mui.alert("亲，请填写举报理由！");
			}else if(StringUtil.getByteLen(inputStr) > 100){
				UIUtil.toast('字数太多，请重新输入');
			} else {
				var data = {
					content: topicName,
					reportUserId: userId,
					reportUserName: userName,
					reportReason: inputStr,
					contentId: topicId,
					circleId: circleId,
					type: "1" //类型1:话题 2:评论
				};
				Tools.report(data);
			}
		}
	});

	//监听申请刷新头部申请状态数据
	window.addEventListener("initCirclePadInfo", function(e) {
		//刷新头部数据
		ajaxDetailData(circleId);
	});

	//渲染动态区映射模板后的监听事件
	function initListener() {
		//显示更多
		Zepto('.more').on('tap', function() {
			if(flag) {
				Zepto('.park-describe > p').addClass('mui-ellipsis-2');
				Zepto(this).children('span').text('显示更多').css('color', 'dimgray');
				flag = false;
			} else {
				Zepto('.park-describe > p').removeClass('mui-ellipsis-2');
				Zepto(this).children('span').text('隐藏').css('color', 'red');
				flag = true;
			}
		});
		//加入圈子点击事件
		Zepto('.joinBtn').on('tap', function() {
			if(Zepto(this).text() == "申请加入") {
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("申请加入圈子");
				Zepto(".confirm-btn").text("申请加入");
				Zepto("#reason").attr("placeholder", "亲，请填写加入理由！");
			} else if(Zepto(this).text() == "退出圈子") {
				UIUtil.confirm({
					content: '退出圈子',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						//退出圈子ajax请求
						ajaxPauseCircle();
					}
				});
			};
		});
		//按钮搜索按钮事件
		Zepto(".searchBtn").on('tap', function() {
			keyWord = Zepto("#searchValue").val();
			pullToRefreshObject.refresh();
			//快速回滚到该区域顶部
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
		});
		//键盘回车、搜索事件
		document.getElementById("searchValue").addEventListener('input', function(e) {
			keyWord = Zepto("#searchValue").val();
			if(keyWord == "" || keyWord == null) {
				pullToRefreshObject.refresh();
			}
		});
		//输入框改变事件
		document.getElementById("searchValue").addEventListener('change', function(e) {
			keyWord = Zepto("#searchValue").val();
			pullToRefreshObject.refresh();
		});
		//发表话题
		Zepto(".publishBtn").on('tap', function() {
			CustomDialogUtil.showCustomDialog("publish-list"); //显示自定义对话框
		});
		//发表新话题点击事件
		Zepto(".publish-newTopic").on('tap', function() {
			var url = config.JServerUrl + 'circle/mobile/vote/publish';
			var requestData = {};
			requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				userName: userName,
				circleId: circleId,
				circleName: circleName,
				topicName: Zepto('#title').val(),
				content: Zepto('textarea').val()
			};
			requestData.para = data;
			requestData = JSON.stringify(requestData.para);
			console.log("发表话题接口：" + url);
			console.log("发表话题参数：" + requestData);
			//关闭发表动态框
			if(Tools.checkInputValidate(data) == true) {
				Zepto('textarea,#title').val('');
				CustomDialogUtil.hideCustomDialog("publish-list"); //隐藏自定义对话框
				CommonUtil.ajax(url, requestData, function(response) {
					console.log("发表新话题的response" + JSON.stringify(response));
					var response = CommonUtil.handleStandardResponse(response, 0);
					if(response.code == '1') {
						//console.log(JSON.stringify(response));
						mui.toast(response.description);
						//清空输入
						Tools.resetData();
						//刷新话题列表
						pullToRefreshObject.refresh();
						//刷新圈子列表
						//快速回滚到该区域顶部
						mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
					}
				}, function(e) {
					UIUtil.toast("网络连接超时！请检查网络...");
				}, 1, secretKey);
			}
		});
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var getData = function(CurrPage) {
			var requestData = {
				userId: userId,
				circleId: circleId,
				pageIndex: CurrPage,
				pageSize: PageSize,
				keyword: keyWord
			};
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			//console.log('请求参数' + requestData);
			return requestData;
		};
		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == "1") {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					//判断发表话题的作者是否与
					if(value.authorId == userId) {
						value.img = image;
					} else {
						value.img = "../../../img/MobileFrame/img_head_logo102-102.png";
					};
					value.topicName = unescape(value.topicName);
					console.log("pad版本 圈子列表返回数据：" + JSON.stringify(value));
				});
			}
			return tempArray;
		};
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc = function() {
			console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};
		var getLitempate = function() {
			var litemplate = '<li class="mui-table-view-cell dynatmicList mui-clearfix" id="{{topicId}}"><span class="isFriend" id="{{isFriend}}"></span><div class="userBaseInfo"><div class="userFile mui-clearfix"><img class="appendFriends" src="{{img}}"/><span class="authorId" id="{{authorId}}"></span><div class="dynatmicUserInfo"><span class="author">{{author}}</span><span>{{date}}</span></div></div><div class="title">{{topicName}}</div><!--<div class="dynamicsImg"><img src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-group="1"/><img src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-group="1"/><img src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-group="1"/><img src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-src="../../../img/img_pad/studycircle/img_dynatmicImg.png"data-preview-group="1"/></div>--></div><div class="userOperation"><div class="comment comment-div"><div></div><div>评论({{comment}})</div></div><div class="praise praise-div"><div class="praiseIcon praise-common"></div><div>赞</div></div><div class="report-div">举报</div><div class="delete-div"><img src="../../../img/menubar/img-deleteicon.png"/><span>删除</span></div></div><span style="display:none"class="praiseStatus">{{isPraise}}</span></li>';
			return litemplate;
		};
		var getUrl = function() {
			//var url = config.MockServerUrl + "studycircle/getCircleDynamicList";
			//var url = config.PCServerUrl + "TopicList";
			var url = config.JServerUrl + "circle/mobile/detail/topicList";
			return url;
		};
		//点击事件
		var onItemClickCallbackFunc = function(e) {
			topicId = Zepto(this).attr('id'); //每一条动态guid
			topicName = Zepto(this).find('.title').text(); //每一条动态guid
			var praiseStatus = Zepto(this).find('.praiseStatus').text(); //点赞状态
			//如果是选择了举报，触发加入按钮
			if(Zepto(e.target).hasClass('report-div') || Zepto(e.target).parent('.report-div').html() != null) {
				//举报
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("举报");
				Zepto(".confirm-btn").text("举报");
				Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
			} else if(Zepto(e.target).hasClass('comment-div') || Zepto(e.target).parent('.comment-div').html() != null) {
				WindowUtil.createWin("szpark_circle_dynamics_details_pad.html", "../../html_pad/studycircle/szpark_circle_dynamics_details_pad.html", {
					circleId: circleId,
					topicId: topicId,
					topicName: topicName
				});
				//删除话题
			} else if(Zepto(e.target).hasClass('delete-div') || Zepto(e.target).parent('.delete-div').html() != null) {
				var extras = {
					userId: userId,
					topicId: topicId
				}
				UIUtil.confirm({
					content: '删除话题',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						Tools.deleteTopic(extras);
					}
				});
			} else if(Zepto(e.target).hasClass('praise-div') || Zepto(e.target).parent('.praise-div').html() != null) {
				var _this = Zepto(this).find('.praiseIcon');
				//var praise_text = Zepto(this).find("#praiseNumber").text();
				//var praiseCount = parseInt(praise_text.substring(1, praise_text.length - 1));
				if(_this.hasClass('praiseFlur')) {
					//_this.removeClass('praise-active');
					//_this.removeClass("praiseFlur").addClass('praise-common');
					//Zepto(this).find("#praiseNumber").text("(" + parseInt(praiseCount - 1) + ")")
					//点击赞-1
					var data = {
						userId: userId,
						userName: userName,
						topicId: topicId,
						type: "0"
					};
					Tools.praise(data, false, function(message) {
						if(message == "话题取消点赞成功！") {
							_this.removeClass("praiseFlur").addClass('praise-common');
							mui.toast(message);
						} else {
							mui.toast(message);
						}
					});
				} else {
					console.log("点赞+1");
					//_this.addClass('praise-active');
					//_this.removeClass("praise-common").addClass('praiseFlur');
					//Zepto(this).find("#praiseNumber").text("(" + parseInt(praiseCount + 1) + ")");
					//点击赞+1
					var data = {
						userId: userId,
						userName: userName,
						topicId: topicId,
						type: "1"
					};
					Tools.praise(data, false, function(message) {
						if(message == "话题点赞成功！") {
							mui.toast(message);
							_this.removeClass("praise-common").addClass('praiseFlur');
						} else {
							mui.toast(message);
						}
					});
				}
			} else if(Zepto(e.target).hasClass('appendFriends')) {
				//加好友设置
				ownerId = Zepto(this).find('.authorId').attr('id');
				ownerName = Zepto(this).find('.author').text();
				var ownerimg = Zepto(this).find('.appendFriends').attr('src');
				Zepto('.ownerName').text(ownerName);
				Zepto('.ownerImg > img').attr('src', ownerimg);
				if(ownerId !== userId) {
					var isFriend = Zepto(this).find('.isFriend').attr('id');
					if(isFriend == 1) {
						var authorSession = {
							image: ownerimg,
							ownerId: ownerId,
							ownerName: ownerName
						};
						//跳转到相应人员的个人空间
						WindowUtil.createWin('szpark_personal_space_pad.html', '../menubar/szpark_personal_space_pad.html', {
							authorSession: authorSession
						});
					} else {
						CustomDialogUtil.showCustomDialog('apply-friends'); //显示自定义对话框
					}
				} else {
					//跳转到相应人员的个人空间
					WindowUtil.createWin('szpark_personal_space_pad.html', '../menubar/szpark_personal_space_pad.html');
				}
				//				
			} else {
				WindowUtil.createWin("szpark_circle_dynamics_details_pad.html", "../../html_pad/studycircle/szpark_circle_dynamics_details_pad.html", {
					circleId: circleId,
					topicId: topicId,
					topicName: topicName
				});
			}
		};
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			var _this = Zepto("#listdata").find('li').find('.praiseIcon');
			//遍历增加点赞
			mui.each(response, function(key, value) {
				if(value.isPraise == 0) {
					//还未点赞
					//console.log("未点赞");
					//Zepto(_this[key]).removeClass('praise-active');
					//_this.removeClass('praise-active');
				} else {
					//点过赞了
					//console.log("点赞了");
					Zepto(_this[key]).addClass('praiseFlur');
					//_this.addClass('praise-active');
				}
			});
			//图片预览
			//mui.previewImage();

		};
		//初始化下拉刷新控件
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitempate,
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
		});
	};

	Zepto('#textarea').on('input', function() {
		var textLength = Zepto(this).val().length;
		if(textLength > maxLenth) {
			UIUtil.toast('您已超过最大字数限制');
			var text = Zepto(this).val().substring(0, 60);
			Zepto('#textarea').val(text);
			var textLength = Zepto(this).val().length;
			Zepto('.font-num span:first-child').text(textLength);
			Zepto('.font-num span:last-child').text(maxLenth - textLength);
		} else {
			Zepto('.font-num span:first-child').text(textLength);
			Zepto('.font-num span:last-child').text(maxLenth - textLength);
		}
	});

	//加好友取消操作
	Zepto('.applyCancel,.hideIcon').on('tap', function() {
		CustomDialogUtil.hideCustomDialog('apply-friends'); //显示自定义对话框
		Zepto('#textarea').val('');
		Zepto('.font-num span:first-child').text(0);
		Zepto('.font-num span:last-child').text(60);
	});

	//加好友确定操作
	Zepto('.applyOk').on('tap', function() {
		if(parseInt(Zepto('.font-num span:first-child').text()) > 0) {
			ajaxAppendFriends();
		} else {
			mui.alert('请留言');
		}
	});

	/**
	 * @description 加好友请求数据
	 */
	function ajaxAppendFriends() {
		//var url = config.MockServerUrl + 'circle/mobile/index/userRelationInsert';
		var url = config.JServerUrl + 'circle/mobile/index/userRelationInsert';
		var requestData = {};
		var data = {
			ownerId: ownerId,
			ownerName: ownerName,
			reason: document.getElementById("textarea").value,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("身申请还有的请求参数" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.toast(response.description);
				CustomDialogUtil.hideCustomDialog('apply-friends'); //显示自定义对话框
				Zepto('#textarea').val('');
				Zepto('.font-num span:first-child').text(0);
				Zepto('.font-num span:last-child').text(60);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 操作：删除话题
	 */
	function ajaxPauseCircle() {
		var url = config.JServerUrl + 'circle/mobile/detail/memberout';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			circleId: circleId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.toast(response.description);
				ajaxDetailData(circleId);
				WindowUtil.firePageEvent("szpark_study_circle_pad.html", "pauseCirclePad");
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
});