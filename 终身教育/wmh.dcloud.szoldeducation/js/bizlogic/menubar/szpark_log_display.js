/**
 * 描述 :日志展示 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-28 17:27:49
 */
define(function(require, exports, module) {
	"use strict";
	//引入窗体模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var DealComplexFileUtil = require('core/MobileFrame/DealComplexFileUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var A = '', //二级评论参数传递
		B = '',
		C = '',
		D = '',
		E = '',
		commentId = '';
	var secretKey = "";
	var userId = "",
		userName = '';
	var logId,
		hideType;
	var IsPraise = [];
	CommonUtil.initReady(function() {
		//区域滚动
		mui(".mui-scroll-wrapper").scroll();
		logId = WindowUtil.getExtraDataByKey("logId");
		hideType = WindowUtil.getExtraDataByKey("hideType");
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		console.log("用户信息logId：" + logId);
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		if(hideType) {
			if(hideType == 1) {
				Zepto('.comment').css('display', 'none');
			};
		};
		ajaxLogDetailData();
	});
	/**
	 * @description 请求详情数据
	 */
	function ajaxLogDetailData() {
		//		var url = config.MockServerUrl + "mobile/space/log/getLogDetails";
		var url = config.JServerUrl + "mobile/space/log/ getLogDetails";
		var requestData = {};
		var data = {
			logId: logId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("日志参数：" + requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("返回数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 2);
			if(response.code == 1) {
				UIUtil.closeWaiting();
				var tmpInfo = response.data;
				console.log("xxxxxxxxxxxxxxxxxxxx" + JSON.stringify(tmpInfo));
				tmpInfo.content = unescape(tmpInfo.content);
				tmpInfo.title = unescape(tmpInfo.title);
				var commentListInfo = tmpInfo.commentList;
				var template = '<h4 class="title">{{title}}</h4><span>作者：{{author}}</span><div><p id="complexContent"></p></div>';
				Zepto("#logContent").html('');
				var output = Mustache.render(template, tmpInfo);
				Zepto("#logContent").append(output);
				//处理富文本
				if(tmpInfo.content) {
					document.getElementById("complexContent").innerHTML = "";
					HtmlUtil.appendComplexHtml(document.getElementById("complexContent"), tmpInfo.content, function(loadUrl) {
						if(loadUrl) {
							if(loadUrl.toUpperCase().indexOf('.XLSX') != -1 || loadUrl.toUpperCase().indexOf('.XLS') != -1 || loadUrl.toUpperCase().indexOf('.TXT') != -1 || loadUrl.toUpperCase().indexOf('.PPT') != -1 || loadUrl.toUpperCase().indexOf('.ZIP') != -1 || loadUrl.toUpperCase().indexOf('.PDF') != -1 || loadUrl.toUpperCase().indexOf('.DOC') != -1 || loadUrl.toUpperCase().indexOf('.DOCX') != -1 || loadUrl.toUpperCase().indexOf('.RAR') != -1 || loadUrl.toUpperCase().indexOf('.JPG') != -1 || loadUrl.toUpperCase().indexOf('.PNG') != -1 || loadUrl.toUpperCase().indexOf('.GIF') != -1) {
								DealComplexFileUtil.openAttachFileFromUrl(loadUrl, true, function() {
									plus.nativeUI.toast('该附件下载失败!');
								}, true);
							} else {
								//打开url
								plus.runtime.openURL(loadUrl);
							}
						}
					});
				};
				initLogComments();
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description commonutil.ajax请求数据
	 */
	function initLogComments() {
		//var url = config.MockServerUrl + 'menubar/orginalDiplay/commentList';
		var url = config.JServerUrl + 'menubar/orginalDiplay/commentList';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			originalType: 1,
			pageIndex: 1,
			pageSize: 1000,
			resourceId: logId,
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		UIUtil.showWaiting();
		console.log("xxxxxxxxxxxxxxxxxxxxxx" + url);
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				var tempInfo = response.data;
				UIUtil.closeWaiting();
				IsPraise = [];
				if(tempInfo) {
					Zepto('#commentlistdata').html('');
					var output = '';
					mui.each(tempInfo, function(key, value) {
						value.comment = unescape(value.comment);
						if(value.isPraise == 0) {
							//什么都不做
						} else if(value.isPraise == 1) {
							IsPraise.push(key);
						};
						if(!value.image || value.image == 'image is not define') {
							//console.log("1");
							value.image = '../../img/MobileFrame/img_head_logo102-102.png';
						} else {
							value.image = unescape(value.image);
						};
						output += '<li id="' + value.id + '" class="mui-table-view-cell CommentItem"><span class="userId" id="' + value.userId + '"></span><div class="headImgBorder"><img src="' + value.image + '" width="30px" height="30px"/></div><div class="commentBorder"><div class="commentUserName">' + value.nick + '</div><div class="commentDate">' + value.date + '</div><div class="commentContent">' + value.comment + '</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div></div>';
						var litemplate = '<div id="{{replyId}}"class="reviewContent hasIt"><img src="{{image}}"/><span class="reviewName"id="{{userId}}">{{name}}</span><span>{{reviewContent}}</span><br/><div class="reviewDate">{{time}}</div><div class="secondLevelCommnet mui-clearfix"><div class="review"><div class="reviewIcon"></div><div>回复</div></div><div class="report"><div class="reportIcon"></div><div>举报</div></div><div class="ZanBorder"><span class="secondCommentPraiseStatus" id="{{isPraise}}"></span><span class="secondZan">{{like}}</span><span>赞</span></div></div></div>';
						var output2 = ''
						if(value.secondCommentList) {
							if(Array.isArray(value.secondCommentList)) {
								mui.each(value.secondCommentList, function(key, value) {
									if(!value.image || value.image == 'image is undefined!') {
										value.image = '../../img/MobileFrame/img_head_logo190-190.png';
									} else {
										value.image = unescape(value.image);
									};
									value.reviewContent = unescape(value.reviewContent);
									output2 += Mustache.render(litemplate, value);
								});
							} else {
								if(!value.secondCommentList.image || value.secondCommentList.image == 'image is undefined!') {
									value.secondCommentList.image = '../../img/MobileFrame/img_head_logo190-190.png';
								} else {
									value.secondCommentList.image = unescape(value.secondCommentList.image);
								};
								value.secondCommentList.reviewContent = unescape(value.secondCommentList.reviewContent);
								output2 = Mustache.render(litemplate, value.secondCommentList);
							}
							output += output2;
						} else {
							//不存在此节点的话就不执行
						}
						output += '</div><div class="zanBorder"><span>' + value.praise + '</span><span>赞</span></div></li>';
					});
					Zepto('#commentlistdata').append(output);
					//酱油点赞的数据存在数组中
					for(var i = 0; i < IsPraise.length; i++) {
						Zepto('#commentlistdata li').eq(IsPraise[i]).find('.zanBorder').addClass('zanBorder-active');
					};
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
				} else {
					Zepto('.noComment').css('display', 'block');
				};
				//对二级评论进行相应操作
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//点赞操作
	Zepto('#commentlistdata').on('tap', 'li .zanBorder', function() {
		var type = 0; //取消点赞为0，点赞为1
		var number = parseInt(Zepto(this).find('span:first-child').text());
		var commentId = Zepto(this).parents('li').attr('id');
		//因为未登录跳转本页面不会初始化，需要重新请求基础信息
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
			//已结登录
			if(Zepto(this).hasClass('zanBorder-active')) {
				Zepto(this).removeClass('zanBorder-active');
				type = 0;
				var currentNum = number - 1;
				ajaxPraiseSubmit(commentId, type);
				Zepto(this).find('span:first-child').text(currentNum);
			} else {
				var currentNum = number + 1;
				Zepto(this).addClass('zanBorder-active');
				type = 1;
				ajaxPraiseSubmit(commentId, type);
				Zepto(this).find('span:first-child').text(currentNum);
			};
		} else {
			UIUtil.confirm({
				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
				title: '温馨提示',
				buttonValue: ['确定', '取消']
			}, function(index) {
				if(index == 0) {
					LoginUtil.ResetTARGET_URL('szpark_log_display.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		};
	});

	//二级评论点赞操作
	Zepto('#commentlistdata').on('tap', 'li .ZanBorder', function(e) {
		var type = 0; //取消点赞为0，点赞为1
		var number = parseInt(Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.secondZan').text());
		var _this = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.ZanBorder');
		var secondReportId = Zepto(Zepto(e.target).parents('.reviewContent')[0]).attr('id');
		//因为未登录跳转本页面不会初始化，需要重新请求基础信息
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
			//已结登录
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
					LoginUtil.ResetTARGET_URL('szpark_log_display.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		};
	});

	//二级评论操作
	//回复操作
	Zepto('#commentlistdata').on('tap', 'li .review', function(e) {
		var commentId = Zepto(this).parents('li').attr('id');
		//因为未登录跳转本页面不会初始化，需要重新请求基础信息
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
			//已结登录
			CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
			Zepto("#commontitle").text("评论回复");
			Zepto(".confirm-btn").text("回复");
			Zepto("#reason").attr("placeholder", "请输入回复内容！(50字以内)");
			if(Zepto(Zepto(e.target).parents('.reviewContent')[0]).hasClass('hasIt')) {
				A = Zepto(Zepto(e.target).parents('.reviewContent')[0]).find('.reviewName').text();
			} else {
				A = Zepto(this).parents('li').find('.commentUserName').text();
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
					LoginUtil.ResetTARGET_URL('szpark_log_display.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		};
	});

	//举报操作
	Zepto('#commentlistdata').on('tap', 'li .report', function(e) {
		commentId = Zepto(this).parents('li').attr('id');
		//因为未登录跳转本页面不会初始化，需要重新请求基础信息
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
			//已结登录
			//举报
			CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
			Zepto("#commontitle").text("举报");
			Zepto(".confirm-btn").text("举报");
			Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
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
					LoginUtil.ResetTARGET_URL('szpark_log_display.html');
					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
				}
			});
		};
	});

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
				mui.toast("字数太多，请重新输入");
			} else {
				ajaxCommentReport();
				CustomDialogUtil.hideCustomDialog('join-circle'); //显示自定义对话框
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
				} else {
					mui.toast("字数太多，请重新输入");
				}
			}
		}
	});

	/**
	 * @description 单独二级评论提交
	 */
	function ajaxPublishSecondComment(commentId, rpcontent, rpuserId, rpuserName) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/publishComment';
		var url = config.JServerUrl + 'menubar/orginalDiplay/publishComments';
		var requestData = {
			originalType: 1,
			resourceId: logId,
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
				initLogComments();
				UIUtil.toast(response.description);
				document.getElementById("reason").value = "";
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
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
				UIUtil.toast('字数太多，请重新输入');
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
					LoginUtil.ResetTARGET_URL('szpark_log_display.html');
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
			originalType: 1,
			resourceId: logId,
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
				initLogComments();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//监听自定义事件
	window.addEventListener('refreshLogCommentsList', function() {
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
		initLogComments();
	});
});