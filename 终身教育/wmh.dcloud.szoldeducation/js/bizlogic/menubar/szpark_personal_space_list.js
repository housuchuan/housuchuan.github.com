/**
 * 描述 :个人空间--主页列表 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-21 17:11:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var Tools = require('bizlogic/menubar/szpark_personal_space_listUtil.js');
	//每页显示条数
	var PageSize = 2;
	//列表总记录数
	var totalNumCount = 0;
	var beginIndex = 0;
	var secretKey = "";
	var userId = "";
	var userName = "";
	var _thisLength;
	var firstCommentId = '';
	var rpuserName = '';
	var rpuserId = '';
	var rpcontentId = '';
	var rpcontent = '';
	var dynatmicId = ''; //动态id
	//初始化
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		//虎丘登录用户的信息
		var authorData = JSON.parse(WindowUtil.getExtraDataByKey('authorData'));
		//console.log("用户信息：" + authorData);
		if(authorData) {
			if(authorData.userId) {
				userId = authorData.userId;
			}
			if(authorData.userName) {
				userName = authorData.userName;
			};
		} else {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		if(userSession || authorData) {
			//使用下拉刷新分页
			//initPullRefreshList();
			//不使用下拉刷新分页
			initPullRefreshList2();
			//列表点击事件方法集合
			onItemsClick();
		} else {

		}
	});
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullrefreshUtil.initPullDownRefresh({
		//这个下拉刷新不需要请求接口
		mIsRequestFirst: false,
		IsRendLitemplateAuto: false,
		refreshCallback: function() {
			//下拉刷新 重新请求数据
			initPullRefreshList2();
		},
		pullUpLoadType: 'none',
	});

	//动态列表点击事件
	function onItemsClick() {
		var dataReport = {};
		//点击举报按钮
		Zepto('#listdata').on('tap', 'li .report', function() {
			var dynamicGuid = Zepto(this).parents('li').attr('id'); //每一条动态guid
			dataReport = {
				id: dynamicGuid,
				userId: userId,
				userName: userName,
			};
			CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
		});

		//点击取消和叉子按钮
		Zepto('.mui-icon-closeempty,.cancel-btn').on('tap', function() {
			CustomDialogUtil.hideCustomDialog('join-circle'); //隐藏自定义对话框
		})

		//点击举报按钮
		Zepto('.confirm-btn').on('tap', function() {
			if(Zepto('textarea').val() == '' || Zepto('textarea').val() == null) {
				UIUtil.toast('请填写举报理由');
			}else if(StringUtil.getByteLen(Zepto('textarea').val()) > 100){
				UIUtil.toast('字数太多，请重新输入');
			} else {
				var reportReason = Zepto('textarea').val();
				dataReport.reportReason = reportReason;
				//console.log("=========================="+JSON.stringify(dataReport));
				Tools.reportDynamic(dataReport);
				CustomDialogUtil.hideCustomDialog('join-circle'); //隐藏自定义对话框
			}
		})

		//点击删除
		Zepto('#listdata').on('tap', 'li .deleteActive', function() {
			var dynamicGuid = Zepto(this).parents('li').attr('id'); //每一条动态guid
			var data = {
				id: dynamicGuid,
				userId: userId
					//userName: userName,
			};
			if(userSession) {
				if(userSession.userId) {
					if(userSession.userId === userId) {
						UIUtil.confirm({
							content: '您确定要删除吗',
							title: '提示',
							buttonValue: ['确定', '取消']
						}, function(index) {
							if(index == 0) {
								Tools.deleteDynamic(data);
							}
						});
					} else {
						UIUtil.toast('您没有删除权限');
					}
				}
			}
		});

		//点赞操作
		Zepto('#listdata').on('tap', 'li .praiseActive,.praise', function() {
			var dynamicGuid = Zepto(this).parents('li').attr('id'); //每一条动态guid
			//console.log('target:' + Zepto(e.target).parent('.praise-div').html());
			var _this = Zepto(this).parents('li').find('.praise');
			var praise_text = Zepto(this).parents('li').find(".praiseCount").text();
			var praiseCount = parseInt(praise_text.substring(1, praise_text.length - 1));
			if(_this.hasClass('praise-active')) {
				//console.log("取消点赞-1");
				_this.removeClass('praise-active');
				Zepto(this).parents('li').find(".praiseCount").text("(" + (praiseCount - 1) + ")");
				var data = {
					id: dynamicGuid,
					userId: userId,
					userName: userName,
					praiseType: 0
				};
				Tools.praise(data);
			} else {
				//console.log("点赞+1");
				_this.addClass('praise-active');
				Zepto(this).parents('li').find(".praiseCount").text("(" + (praiseCount + 1) + ")");
				var data = {
					id: dynamicGuid,
					userId: userId,
					userName: userName,
					praiseType: 1
				};
				Tools.praise(data);
			}
		});

		//删除一级评论
		Zepto('#listdata').on('tap', 'li .amputate', function() {
			firstCommentId = Zepto(Zepto(this)[0]).parents('li').attr('id');
			//console.log("firstCommentId"+firstCommentId);
			if(userSession) {
				if(userSession.userId) {
					if(userSession.userId === userId) {
						UIUtil.confirm({
							content: '删除动态',
							title: '提示',
							buttonValue: ['确定', '取消']
						}, function(index) {
							if(index === 1) {
								//什么都不做
							} else {
								ajaxDeleteComment();
							}
						});
					} else {
						UIUtil.toast('您没有权限删除该评论');
					}
				}
			}
		});
	}

	/**
	 * @description 一级评论删除ajax操作
	 */
	function ajaxDeleteComment() {
		var url = config.JServerUrl + 'mobile/space/trends/commentDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			firstCommentId: firstCommentId,
			userId: userId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				initPullRefreshList2();
				UIUtil.toast(response.description);
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 发表评论ajax请求
	 */
	function ajaxPublishContent() {
		var url = config.JServerUrl + 'mobile/space/trends/publish';
		var requestData = {};
		var data = {};
		//requestData.ValidateData = 'validatedata';
		if(_thisLength === 1) {
			data = {
				id: dynatmicId,
				userId: userId,
				userName: userName,
				content: Zepto('.comment-popover input[type=text]').val(),
				rpuserName: '',
				rpuserId: '',
				rpcontentId: '',
				rpcontent: '',
				floor: 1
			};
		} else if(_thisLength === 2) {
			data = {
				id: dynatmicId,
				userId: userId,
				userName: userName,
				content: Zepto('.comment-popover input[type=text]').val(),
				rpuserName: rpuserName,
				rpuserId: rpuserId,
				rpcontentId: rpcontentId,
				rpcontent: rpcontent,
				floor: 2
			};
		}
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("评价的requestData"+requestData);
		//console.log("评价的url"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//console.log("评论提交数据" + JSON.stringify(response));
				UIUtil.toast(response.description);
				initPullRefreshList2();
				Zepto('input[type=text]').val('');
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//发表评论
	Zepto('.send').on('tap', function() {
		var content = Zepto('.comment-popover input[type=text]').val();
		if(!content || content == '' || content == null) {
			UIUtil.toast('发表内容不允许为空');
		}else if(StringUtil.getByteLen(content) > 100){
			UIUtil.toast('字数太多，请重新输入');
		} else {
			//console.log("_thisLength"+_thisLength);
			ajaxPublishContent();
			Zepto('.sendHide').css('display', 'none');
			Zepto('.mui-backdrop').css('display', 'none');
		}
	});

	//判断input处于激活状态
	Zepto('input[type=text]').focus(function() {
		Zepto('input[type=text]').css('border', '1px solid #007AFF');
		Zepto('.send').css('border', '1px solid #007AFF');
	});

	//判断input未处于激活状态
	Zepto('input[type=text]').blur(function() {
		Zepto('input[type=text]').css('border', '1px solid #e0e0e0');
		Zepto('.send').css('border', '1px solid #e0e0e0');
	});

	//判断input是否存在值
	Zepto('input[type=text]').on('input', function() {
		if(Zepto('input[type=text]').val()) {
			Zepto('.send').css('color', '#007AFF');
		} else {
			Zepto('.send').css('color', '#000000');
		}
	});

	/**
	 * 一次性请求出来数据
	 */
	function initPullRefreshList2() {
		//var url = config.MockServerUrl + "mobile/space/trends/info";
		var url = config.JServerUrl + "mobile/space/trends/info";
		var requestData = {};
		//动态校验字段
		//requestData.ValidateData = 'validatedata';
		var data = {
			pageIndex: 1,
			pageSize: 1000,
			userId: userId
		};
		requestData = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		//console.log("secretKey==========="+secretKey);
		//console.log("数据列表xxxxxxxxxxxxxxx" + requestData);
		//console.log("数据列表url"+url);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			var response = CommonUtil.handleStandardResponse(response, 1);
			//console.log("一次性请求数据：" + JSON.stringify(response));
			if(response.code == 1) {
				var html = Tools.generateHtml(response.data);
				Zepto(".dynamic-wrapper").html('');
				Zepto(".dynamic-wrapper").append(html);
				var _this = Zepto('.dynamic-wrapper').find('li');
				for(var i = 0; i < _this.length; i++) {
					var index = _this.eq(i).find('.isPraise').attr('id');
					if(index == 1) {
						Zepto('#listdata li').eq(i).find('.praise').addClass('praise-active');
					}
				}
				//var userInfo = Zepto('#listdata li').find('.userId');
				//对该条动态进行一级评论
				Zepto('.popverScreeen').on('tap', function() {
					_thisLength = 1;
					dynatmicId = Zepto(this).parents('.itemsWapper').attr('id'); //动态id
					Zepto('.send').text('发表');
				});
				//二级评论
				Zepto('.review-icon').on('tap', function() {
					rpuserName = Zepto(this).parents('li').find('.firstUserName').text();
					rpuserId = Zepto(this).parents('li').find('.firstUserId').text();
					rpcontentId = Zepto(this).parents('li').attr('id');
					rpcontent = Zepto(this).parents('li').find('.firstContent').text();
					_thisLength = 2;
					dynatmicId = Zepto(this).parents('.itemsWapper').attr('id'); //动态id
					Zepto('.send').text('回复');
				});
			}
		}, function(e) {
			UIUtil.closeWaiting();
			console.log("网络连接超时！请检查网络...");
		}, 1, secretKey, false);
	}
});