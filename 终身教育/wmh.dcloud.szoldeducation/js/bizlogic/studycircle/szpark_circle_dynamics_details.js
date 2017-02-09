/**
 * 描述 :圈子(话题)动态详情页面
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-07-19 09:25:58
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var Tools = require('bizlogic/studycircle/szpark_circle_dynamics_list_Util.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var DetailTools = require('bizlogic/studycircle/szpark_circle_dynamics_detailsUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	//全局参数
	var circleId = null;
	var topicId = null;
	var commentId = null;
	var topicName = null;
	var content = null; //话题标题或者评论内容
	//评论回复参数
	var replyPara = null;
	//举报类型
	var Tag;
	var pageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var pullToRefreshObject;
	//secretKey
	var secretKey = "";
	var userId = "";
	var userName = "";
	var image = "";
	var A = '',
		reportCommentId = '';

	CommonUtil.initReady(initData);
	//初始化
	function initData() {
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
		//初始化监听
		Tools.initComponents();
		circleId = WindowUtil.getExtraDataByKey('circleId');
		topicId = WindowUtil.getExtraDataByKey('topicId');
		topicName = WindowUtil.getExtraDataByKey('topicName');
		content = WindowUtil.getExtraDataByKey('topicName');
		ajaxDetailData(topicId);
	}
	//请求详情数据
	function ajaxDetailData(topicId) {
		//var url = config.MockServerUrl + 'personalPage/topicDetails';
		//var url = config.PCServerUrl + 'TopicInfo';
		var url = config.JServerUrl + 'circle/mobile/index/TopicInfo';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			topicId: topicId
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("参数：" + requestData);
		//console.log("url：" + url);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, '2')
			console.log(JSON.stringify(response));
			if(response.code == '1') {
				var litemplate = '<img src="{{image}}"/><div class="character-outer"><p class="charactersec mui-clearfix"><span class="character-name">{{nick}}：</span><span class="topicTitle">{{topicName}}</span><br/><span class="topicContent"id="topicContent"><span/></p><span class="character-datetime">{{time}}</span></div><!--<img src="../../img/studyCircle/img_shinystar.png"data-preview-src="../../img/studyCircle/img_shinystar.png"data-preview-group="1"class="dynamics-img"/>--><div class="report-wrapper"><span class="reporticon"></span><span class="report">举报</span><span class="comment-icon"></span><span>评论<span class="report-number">({{commentCounts}})</span></span><span class="praise-div"><span class="praise-icon praise"></span><span>赞<span class="report-number"id="praiseNumber">({{praiseCounts}})</span></span></span></div>';
				Zepto('.userwrapper').html('');
				var tmpInfo = response.data;
				var praiseStatus = tmpInfo.isPraise;
				//console.log(praiseStatus);
				tmpInfo.topicName = unescape(tmpInfo.topicName);
				if(tmpInfo.authorId == userId) {
					tmpInfo.image = image;
				} else {
					//平板
					if(tmpInfo.image) {
						tmpInfo.image = unescape(tmpInfo.image);
					} else {
						if(DeviceUtil.tablet()) {
							tmpInfo.image = '../../../img/MobileFrame/img_head_logo102-102.png';
						} else {
							tmpInfo.image = '../../img/MobileFrame/img_head_logo102-102.png';
						}
					};
				};
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.userwrapper').append(output);
				//处理话题富文本
				HtmlUtil.appendComplexHtml(document.getElementById("topicContent"), unescape(tmpInfo.content));

				//映射评论列表
				commentListData();
				//图片预览
				//mui.previewImage();
				//设置监听
				addOnclickOrTapListeners(praiseStatus);
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
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
				UIUtil.toast('字数太多,请重新输入');
			} else {
				var data = {
					content: content, //话题标题或者评论内容
					reportUserId: userId, //举报人Guid
					reportUserName: userName, //举报人姓名
					reportReason: inputStr, //举报理由
					circleId: circleId, //圈子Guid
				};
				if(Tag == "1") {
					//1:话题 
					data.type = "1";
					data.contentId = topicId; //Type=1时话题Guid;Type=2时评论Guid
					Tools.report(data);
				} else if(Tag == "2") {
					//2:评论
					data.type = "2";
					//console.log("xxxx"+reportCommentId);
					//针对一二级评论传入相应的评论id
					data.contentId = reportCommentId; //Type=1时话题Guid;Type=2时评论Guid
					Tools.report(data);
				}

			}
		} else if(btnOk == "回复") {
			if(!inputStr) {
				mui.alert("亲，请填写回复内容！");
			} else {
				//console.log("" + JSON.stringify(replyPara));
				//发表超过30个字数，应该提示“用户”
				if(StringUtil.getByteLen(inputStr) < 100) {
					var secondReviewComment = '回复' + A + ':' + document.getElementById("reason").value;
					Zepto('.confirm-btn').attr('disabled', 'disabled');
					publishComment(secondReviewComment, 2, replyPara.originalCommentGuid, replyPara.originalComment, replyPara.originalUserGuid, replyPara.originalUserName);
				} else {
					mui.toast("评论内容不允许超过50个字哦！");
				}
			}
		}
	});
	//增加监听事件
	function addOnclickOrTapListeners(praiseStatus) {
		//举报
		Zepto(".report").on('tap', function() {
			Tag = "1"; //话题举报
			//举报
			CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
			Zepto("#commontitle").text("举报");
			Zepto(".confirm-btn").text("举报");
			Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
		});
		//映射点赞信息
		var _this = Zepto(".praise-div").find('.praise-icon');
		if(praiseStatus == "1") {
			Zepto(_this).addClass('praise-active');
		} else {
			Zepto(_this).removeClass('praise-active');
		}
		//点赞
		Zepto('.praise-div').on('tap', function() {
			var _this = Zepto(this).find('.praise-icon');
			var praise_text = Zepto(this).find("#praiseNumber").text();
			var praiseCount = parseInt(praise_text.substring(1, praise_text.length - 1));
			if(_this.hasClass('praise-active')) {
				//点击赞-1
				var data = {
					userId: userId,
					userName: userName,
					topicId: topicId,
					type: "0"
				};
				Tools.praise(data, true, function(message) {
					if(message == "话题取消点赞成功！") {
						mui.toast(message);
						_this.removeClass('praise-active').addClass('praise');
						_this.parent('.praise-div').find("#praiseNumber").text("(" + (parseInt(praiseCount) - 1) + ")");
					} else {
						mui.toast(message);
					}
				});
			} else {
				//点击赞+1
				var data = {
					userId: userId,
					userName: userName,
					topicId: topicId,
					type: "1"
				};
				Tools.praise(data, true, function(message) {
					if(message == "话题点赞成功！") {
						mui.toast(message);
						_this.removeClass('praise').addClass('praise-active');
						_this.parent('.praise-div').find("#praiseNumber").text("(" + (parseInt(praiseCount) + 1) + ")");
					} else {
						mui.toast(message);
					}
				});
			}
		});
	}

	/**
	 * @description话题详情评论列表数据
	 */
	function commentListData(currpage) {
		//var url = config.MockServerUrl + 'circle/mobile/topic/TopicAllCommentsList';
		//var url = config.PCServerUrl + 'TopicFirstCommentsList';
		var url = config.JServerUrl + 'circle/mobile/topic/topicAllCommentsList';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			pageIndex: "1",
			pageSize: "1000",
			topicId: topicId,
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		//console.log("评论列表参数"+requestData);
		//console.log("评论列表接口"+url);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, '1');
			var output = '';
			console.log("评论列表：" + JSON.stringify(response.data));
			if(response.code == '1') {
				if(response.data) {
					var tmpInfo = response.data;
					var html = DetailTools.generateCommentListHtml(tmpInfo);
					Zepto('#commentlistdata').html('');
					Zepto('#commentlistdata').append(html);
					//列表点击事件
					Zepto("#commentlistdata").on('tap', 'li', function(e) {
						commentId = Zepto(this).attr('id');
						reportCommentId = commentId;
						content = Zepto(this).find(".commentContent").text();
						var author = Zepto(this).find(".author").text();

						var authorId = Zepto(this).find(".authorId").text();
						//console.log("commnetId"+commentId);
						//console.log("content"+content);
						if(Zepto(e.target).hasClass('tip')) {
							//类型1:话题 2:评论
							Tag = "2"; //话题举报
							//举报
							CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
							Zepto("#commontitle").text("举报");
							Zepto(".confirm-btn").text("举报");
							Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
							if(Zepto(e.target).parents('.secondCommentLog').hasClass('secondLevelCommnet')){
								reportCommentId = Zepto(Zepto(e.target).parents('.secondLevelCommnet')[0]).attr('id');
							}
						} else if(Zepto(e.target).hasClass('review-icon') || Zepto(e.target).hasClass('replay-person2')) {
							//console.log("点击了回复按钮");
							CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
							Zepto("#commontitle").text("评论回复");
							Zepto(".confirm-btn").text("回复");
							Zepto("#reason").attr("placeholder", "请输入回复内容！(50字以内)");
							if(Zepto(e.target).parent().hasClass('firstCommentLog')) {
								A = Zepto(this).find('.author').text();
								replyPara = {
									originalCommentGuid: commentId,
									originalComment: content,
									originalUserGuid: authorId,
									originalUserName: author,
								};
							} else if(Zepto(e.target).parents('.secondCommentLog').hasClass('secondLevelCommnet')) {
								A = Zepto(Zepto(e.target).parents('.secondLevelCommnet')[0]).find('.secondAutor').text();
								replyPara = {
									originalCommentGuid: commentId,
									originalComment: content,
									originalUserGuid: authorId,
									originalUserName: author,
								};
							}
						}
					});
				}
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
	//当有输入内容时，按钮颜色变化
	document.getElementById("content").addEventListener('input', function() {
		var content = Zepto(this).val();
		if(!content) {
			//console.log("没有内容");
			Zepto("#btnPublish").css('background', '#fff');
			Zepto("#btnPublish").css('color', 'darkgray');
		} else {
			//console.log("有内容");
			Zepto("#btnPublish").css('background-color', '#187bc2');
			Zepto("#btnPublish").css('color', '#fff');
		}
	});
	//发表评论
	Zepto("#btnPublish").on('tap', function() {
		var content = Zepto("#content").val();
		if(!content) {
			UIUtil.toast("请输入发表内容");
		} else {
			//发表超过30个字数，应该提示“用户”
			if(StringUtil.getByteLen(content) < 100) {
				Zepto('#btnPublish').attr('disabled', 'disabled');
				publishComment(content, 1, "", "", "", "");
			} else {
				mui.toast("评论内容不允许超过50个字哦！");
			}
		}
	});

	//发表话题评论
	function publishComment(content, floor, originalCommentGuid, originalComment, originalUserGuid, originalUserName) {
		//var url = config.MockServerUrl + 'studycircle/publishComment';
		//var url = config.PCServerUrl + 'TopicCommentInsert'
		var url = config.JServerUrl + 'circle/mobile/topic/publishContent';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			commentBody: content,
			fromUserGuid: userId,
			fromUserName: userName,
			originalCommentGuid: originalCommentGuid,
			originalComment: originalComment,
			originalUserGuid: originalUserGuid,
			originalUserName: originalUserName,
			topicGuid: topicId,
			circleId: circleId, //后来新增上去的，用来标记是哪个圈子下的话题评论
			floor: floor
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		console.log("请求参数：" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("发表评论成功：" + JSON.stringify(response));
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, 0)
			if(response.code == 1) {
				Zepto('#btnPublish,.confirm-btn').removeAttr('disabled');
				mui.toast(response.description);
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
				document.getElementById("reason").value = "";
				//刷新详情数据以及刷新评论列表
				ajaxDetailData(topicId);
				commentListData();
				//刷新话题列表
				WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "refreshListPage");
				//置空操作
				Zepto("#content").val('');
			}
		}, function(e) {
			UIUtil.closeWaiting();
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey);
	};
});