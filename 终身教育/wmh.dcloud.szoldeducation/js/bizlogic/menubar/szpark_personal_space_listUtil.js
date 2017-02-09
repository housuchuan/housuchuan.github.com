/**
 * 描述 :个人空间--主页列表以及动态列表辅助js 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-21 17:11:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var device = require('core/MobileFrame/DeviceUtil.js');
	var secretKey = "";
	var userId = "";
	var userName = "";

	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey") || "";
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession.userId) {
			userId = userSession.userId;
		}
		if(userSession.userName) {
			userName = userSession.userName;
		}
	});
	/**
	 * @description 自己动态生成html主页列表
	 */
	exports.generateHtml = function(tempArr) {
		var html = '';
		//首先判断tempArr是否存在
		if(!tempArr) {
			console.log("--------动态列表数据为空！-----");
		} else {
			if(Array.isArray(tempArr)) {
				//数组,遍历数组
				mui.each(tempArr, function(key1, value) {
					html += '<li class="dynamic-area-wrapper itemsWapper" id="' + value.trendsId + '"><span class="isPraise" id="' + value.isPraise + '"></span><span class="userId" id="' + value.userId + '"></span>';
					html += '<div class="dynamic-area clearfix">';
					if(!value.img || value.img == "Image is not define") {
						//默认一张头像
						if(device.tablet()) {
							html += '<img src="../../../img/MobileFrame/img_head_logo190-190.png" />';
						} else {
							html += '<img src="../../img/MobileFrame/img_head_logo190-190.png" />';
						}
						//value.img = "../../img/MobileFrame/img_head_logo102-102.png";
					} else {
						html += '<img src="' + unescape(value.img) + '" />';
					}
					html += '<span class="username">' + value.userName + '</span><br /><span class="publish-time">' + value.time + '</span><br />';
					html += '<span class="publish-content">' + unescape(value.trendsContent) + '</span>'
					html += '<div class="attach">';
					//判断图片附件是否存在
					if(value.imageAttachList) {
						var imageAttachList = value.imageAttachList;
						var imgDiv = '<img src="{{trendsImage}}" />'
						if(Array.isArray(imageAttachList)) {
							//多张图片附件
							mui.each(imageAttachList, function(key, value) {
								if(device.tablet()) {
									if(!value.trendsImage || value.trendsImage == "trendsImage is not define") {
										value.trendsImage = '../../../img/educate/img_project1.png';
									}else{
										value.trendsImage = unescape(value.trendsImage);
									}
								} else {
									if(!value.trendsImage || value.trendsImage == "trendsImage is not define") {
										value.trendsImage = '../../img/educate/img_project1.png';
									}else{
										value.trendsImage = unescape(value.trendsImage);
									}
								}
								html += Mustache.render(imgDiv, value);
							});
						} else {
							//单张图片附件
							if(device.tablet()) {
								if(!imageAttachList.trendsImage || imageAttachList.trendsImage == "trendsImage is not define") {
									imageAttachList.trendsImage = '../../../img/educate/img_project1.png';
								}else{
									imageAttachList.trendsImage = unescape(imageAttachList.trendsImage);
								}
							} else {
								if(!imageAttachList.trendsImage || imageAttachList.trendsImage == "trendsImage is not define") {
									imageAttachList.trendsImage = '../../img/educate/img_project1.png';
								}else{
									imageAttachList.trendsImage = unescape(imageAttachList.trendsImage);
								}
							}

							html += Mustache.render(imgDiv, imageAttachList);
						}
					} else {
						console.log("图片附件不存在！");
					}
					html += '</div>';
					html += '<div class="operate-module">';
					html += '<a href="#picture" class="popverScreeen" style="color:#000000"><span class="comment comment-active"></span><span class="common-change comment-active">评论</span><span class="common-change common-number comment-active">(' + value.commentNumber + ')</span></a>';
					html += '<span></span><span class="praise praise-common"></span><span class="common-change praiseActive">赞</span><span class="common-change common-number praiseActive praiseCount">(' + value.praiseNumber + ')</span></span>';
					html += '<span class="delete deleteActive"></span><span class="common-change deleteActive">删除</span>';
					html += '<span class="reporticon report"></span><span class="common-change report">举报</span>';
					html += '</div>';
					//发表评论部分
					html += '<div class="review">';
					html += '<ul class="mui-table-view">';
					//遍历评论（一级和二级）信息
					if(!value.commentList) {
						//console.log("第" + (key1 + 1) + "条评论信息不存在！！\n" + "评论信息：" + JSON.stringify(value.commentList));
					} else {
						var commentListData = value.commentList;
						//console.log("评论信息："+JSON.stringify(commentListData));
						if(Array.isArray(commentListData)) {
							//多条评论
							//console.log("评论信息长度：" + commentListData.length);
							mui.each(commentListData, function(key, value) {
								if(JSON.stringify(value[key1])) {
									console.log("具体评论内容为空！undefined");
								} else {
									html += '<li class="mui-table-view-cell" class="firstReplyId" id="' + value.firstReplyId + '">';
									html += '<span class="firstUserId" style="display:none">' + value.firstUserId + '</span>';
									html += '<span class="firstUserName" style="display:none">' + value.firstUserName + '</span>';
									//判断以及评论人头像是否存在

									if(!value.img || value.img == "img is not define") {
										if(device.tablet()) {
											html += '<img src="../../../img/MobileFrame/img_head_logo102-102.png" />';
										} else {
											html += '<img src="../../img/MobileFrame/img_head_logo102-102.png" />';
										}
									} else {
										html += '<img src="' + unescape(value.img) + '" />';
									}
									html += '<div class="review-content">';
									html += '<span class="review-username">' + value.firstUserName + '：</span><span class="firstContent">' + unescape(value.firstContent) + '</span><br />';
									html += '<span class="review-time">' + value.firstReplyTime + '</span><a href="#picture"  class="review-icon"></a><span class="amputate"></span>';
									html += '</div>';
									//判断二级评论
									if(!value.secondCommentList) {
										//console.log("第" + (key1 + 1) + "条动态二级评论信息不存在！！");
									} else {
										var secondCommentListData = value.secondCommentList;
										var secondCommentLi = '<div class="review-replay"id="{{secondReplyId}}"><img src="{{img}}"/><div class="review-content"><span class="review-username">{{secondUserName}}</span><span class="reviewer">回复</span><span class="review-username">{{secondRpuserName}}：</span><span>{{secondContent}}</span><br/><span class="review-time">{{secondReplyTime}}</span></div></div>';
										if(Array.isArray(secondCommentListData)) {
											//多条二级评论信息
											mui.each(secondCommentListData, function(key, value) {
												if(!value.img || value.img == "img is not define") {
													if(device.tablet()) {
														value.img = '../../../img/MobileFrame/img_head_logo102-102.png';
													} else {
														value.img = '../../img/MobileFrame/img_head_logo102-102.png';
													}

												}else{
													value.img = unescape(value.img);
												}
												value.secondContent = unescape(value.secondContent);
												html += Mustache.render(secondCommentLi, value);
											});
										} else {
											//单条二级评论信息
											if(!secondCommentListData.img || secondCommentListData.img == "img is not define") {
												if(device.tablet()) {
													secondCommentListData.img = '../../../img/MobileFrame/img_head_logo102-102.png';
												} else {
													secondCommentListData.img = '../../img/MobileFrame/img_head_logo102-102.png';
												}

											}else{
												secondCommentListData.img = unescape(secondCommentListData.img);
											}
											html += Mustache.render(secondCommentLi, secondCommentListData);
										}
									}
									html += '</li>';
								}
							});
						} else {
							//单条评论
							html += '<li class="mui-table-view-cell" class="firstReplyId" id="' + commentListData.firstReplyId + '">';
							html += '<span class="firstUserId" style="display:none">' + commentListData.firstUserId + '</span>';
							html += '<span class="firstUserName" style="display:none">' + commentListData.firstUserName + '</span>';
							//判断以及评论人头像是否存在
							if(!commentListData.img || commentListData.img == "img is not define") {
								if(device.tablet()) {
									commentListData.img = '../../../img/MobileFrame/img_head_logo190-190.png';
								} else {
									commentListData.img = '../../img/MobileFrame/img_head_logo190-190.png';
								}
							} else {
								html += '<img src="' + unescape(commentListData.img) + '" />';
							}
							html += '<div class="review-content">';
							html += '<span class="review-username">' + commentListData.firstUserName + '：</span><span class="firstContent">' + unescape(commentListData.firstContent) + '</span><br />';
							html += '<span class="review-time">' + commentListData.firstReplyTime + '</span><a href="#picture"  class="review-icon"></a><span class="amputate"></span>';
							html += '</div>';
							//判断二级评论
							if(!commentListData.secondCommentList) {
								console.log("二级评论不存在！");
							} else {
								var secondCommentListData = commentListData.secondCommentList;
								var secondCommentLi = '<div class="review-replay"id="{{secondReplyId}}"><img src="{{img}}"/><div class="review-content"><span class="review-username">{{secondUserName}}</span><span class="reviewer">回复</span><span class="review-username">{{secondRpuserName}}：</span><span>{{secondContent}}</span><br/><span class="review-time">{{secondReplyTime}}</span></div></div>';
								if(Array.isArray(secondCommentListData)) {
									//多条二级评论信息
									mui.each(secondCommentListData, function(key, value) {
										if(!value.img || value.img == "img is not define") {
											if(device.tablet()) {
												value.img = '../../../img/MobileFrame/img_head_logo102-102.png';
											} else {
												value.img = '../../img/MobileFrame/img_head_logo102-102.png';
											}

										}else{
											value.img = unescape(value.img);
										};
										value.secondContent = unescape(value.secondContent);
										html += Mustache.render(secondCommentLi, value);
									});
								} else {
									//单条二级评论信息
									if(!secondCommentListData.img || secondCommentListData.img == "img is not define") {
										if(device.tablet()) {
											secondCommentListData.img = '../../../img/MobileFrame/img_head_logo102-102.png';
										} else {
											secondCommentListData.img = '../../../img/MobileFrame/img_head_logo102-102.png';
										}
									}else{
										secondCommentListData.img = unescape(secondCommentListData.img);
									}
									html += Mustache.render(secondCommentLi, secondCommentListData);
								}
							}
							html += '</li>';
						}
					}
					html += '</ul>';
					html += '</div>';
					html += '<a href="#picture" class="default-plus-selectphoto">';
					html += '<button class="clearfix popverScreeen">';
					html += '<span>我也说一句</span>';
					html += '<div></div>';
					html += '</button>';
					html += '</a>';
					html += '</div>';
					html += '</li>';
				});
			} else {
				//非数组
				html += '<li class="dynamic-area-wrapper itemsWapper" id="' + tempArr.trendsId + '"><span class="isPraise" id="' + tempArr.isPraise + '"></span><span class="userId" id="' + value.userId + '"></span>';
				html += '<div class="dynamic-area clearfix">';
				if(!tempArr.img || tempArr.img == "Image is not define") {
					//默认一张头像
					tempArr.img = "../../img/MobileFrame/img_head_logo102-102.png";
				} else {
					html += '<img src="' + unescape(tempArr.img) + '" />';
				}
				html += '<span class="username">' + tempArr.userName + '</span><br /><span class="publish-time">' + tempArr.time + '</span><br />';
				html += '<span class="publish-content">' + unescape(tempArr.trendsContent) + '</span>'
				html += '<div class="attach">';
				//判断图片附件是否存在
				if(tempArr.imageAttachList) {
					var imageAttachList = tempArr.imageAttachList;
					var imgDiv = '<img src="{{trendsImage}}" />'
					if(Array.isArray(imageAttachList)) {
						//多张图片附件
						mui.each(imageAttachList, function(key, value) {
							if(!value.trendsImage || value.trendsImage == "trendsImage is not define") {
								value.trendsImage = '../../img/educate/img_project1.png';
							}else{
								value.trendsImage = unescape(value.trendsImage);
							}
							html += Mustache.render(imgDiv, value);
						});
					} else {
						//单张图片附件
						if(!imageAttachList.trendsImage || imageAttachList.trendsImage == "trendsImage is not define") {
							imageAttachList.trendsImage = '../../img/educate/img_project1.png';
						}else{
							imageAttachList.trendsImage = unescape(imageAttachList.trendsImage);
						}
						html += Mustache.render(imgDiv, imageAttachList);
					}
				} else {
					console.error("图片附件不存在！");
				}
				html += '</div>';
				html += '<div class="operate-module">';
				html += '<a href="#picture" class="popverScreeen" style="color:#000000"><span class="comment comment-active"></span><span class="common-change comment-active">评论</span><span class="common-change common-number comment-active">(' + value.commentNumber + ')</span></a>';
				html += '<span></span><span class="praise praise-common"></span><span class="common-change praiseActive">赞</span><span class="common-change common-number praiseActive">(' + value.praiseNumber + ')</span></span>';
				html += '<span class="delete"></span><span class="common-change">删除</span>';
				html += '<span class="reporticon"></span><span class="common-change report">举报</span>';
				html += '</div>';
				//发表评论部分
				html += '<div class="review">';
				html += '<ul class="mui-table-view">';
				//遍历评论（一级和二级）信息
				if(!tempArr.commentList) {
					console.error("评论信息不存在！！");
				} else {
					var commentListData = tempArr.commentList;
					if(Array.isArray(commentListData)) {
						//多条评论
						mui.each(commentListData, function(key, value) {
							html += '<li class="mui-table-view-cell" class="firstReplyId" id="' + value.firstReplyId + '">';
							html += '<span class="firstUserId" style="display:none">' + value.firstUserId + '</span>';
							html += '<span class="firstUserName" style="display:none">' + value.firstUserName + '</span>';
							//判断以及评论人头像是否存在
							if(!value.img || value.img == "img is not define") {
								value.img = '../../img/MobileFrame/img_head_logo102-102.png';
							} else {
								html += '<img src="' + unescape(value.img) + '" />';
							}
							html += '<div class="review-content">';
							html += '<span class="review-username">' + value.firstUserName + '：</span><span class="firstContent">' + unescape(value.firstContent) + '</span><br />';
							html += '<span class="review-time">' + value.firstReplyTime + '</span><a href="#picture"  class="review-icon"></a><span class="amputate"></span>';
							html += '</div>';
							//判断二级评论
							if(!value.secondCommentList) {
								console.log("二级评论不存在！");
							} else {
								var secondCommentListData = value.secondCommentList;
								var secondCommentLi = '<div class="review-replay" id="{{secondReplyId}}"><img src="{{img}}"/><div class="review-content"><span class="review-username">{{secondUserName}}</span><span class="reviewer">回复</span><span class="review-username">{{secondRpuserName}}：</span><span>{{secondContent}}</span><br/><span class="review-time">{{secondReplyTime}}</span></div></div>';
								if(Array.isArray(secondCommentListData)) {
									//多条二级评论信息
									mui.each(secondCommentListData, function(key, value) {
										if(!value.img || value.img == "img is not define") {
											value.img = '../../img/MobileFrame/img_head_logo102-102.png';
										}else{
											value.img = unescape(value.img);
										};
										value.secondContent = unescape(secondContent);
										html += Mustache.render(secondCommentLi, value);
									});
								} else {
									//单条二级评论信息
									if(!secondCommentListData.img || secondCommentListData.img == "img is not define") {
										secondCommentListData.img = '../../img/MobileFrame/img_head_logo102-102.png';
									}else{
										secondCommentListData.img = unescape(secondCommentListData.img);
									}
									html += Mustache.render(secondCommentLi, secondCommentListData);
								}
							}
							html += '</li>';
						});
					} else {
						//单条评论
						html += '<li class="mui-table-view-cell" class="firstReplyId" id="' + commentListData.firstReplyId + '">';
						html += '<span class="firstUserId" style="display:none">' + commentListData.firstUserId + '</span>';
						html += '<span class="firstUserName" style="display:none">' + commentListData.firstUserName + '</span>';
						//判断以及评论人头像是否存在
						if(!commentListData.img || commentListData.img == "img is not define") {
							html += '<img src="../../img/MobileFrame/img_head_logo102-102.png" />';
						} else {
							html += '<img src="' + unescape(commentListData.img) + '" />';
						}
						html += '<div class="review-content">';
						html += '<span class="review-username">' + commentListData.firstUserName + '：</span><span  class="firstContent">' + unescape(commentListData.firstContent) + '</span><br />';
						html += '<span class="review-time">' + commentListData.firstReplyTime + '</span><a href="#picture"  class="review-icon"></a><span class="amputate"></span>';
						html += '</div>';
						//判断二级评论
						if(!commentListData.secondCommentList) {
							console.log("二级评论不存在！");
						} else {
							var secondCommentListData = commentListData.secondCommentList;
							var secondCommentLi = '<div class="review-replay"id="{{secondReplyId}}"><img src="{{img}}"/><div class="review-content"><span class="review-username">{{secondUserName}}</span><span class="reviewer">回复</span><span class="review-username">{{secondRpuserName}}：</span><span>{{secondContent}}</span><br/><span class="review-time">{{secondReplyTime}}</span></div></div>';
							if(Array.isArray(secondCommentListData)) {
								//多条二级评论信息
								mui.each(secondCommentListData, function(key, value) {
									if(!value.img || value.img == "img is not define") {
										value.img = '../../img/MobileFrame/img_head_logo102-102.png';
									}else{
										value.img = unescape(value.img);
									};
									value.secondContent = unescape(value.secondContent);
									html += Mustache.render(secondCommentLi, value);
								});
							} else {
								//单条二级评论信息
								if(!secondCommentListData.img || secondCommentListData.img == "img is not define") {
									secondCommentListData.img = '../../img/MobileFrame/img_head_logo102-102.png';
								}else{
									secondCommentListData.img = unescape(secondCommentListData.img);
								}
								html += Mustache.render(secondCommentLi, secondCommentListData);
							}
						}
						html += '</li>';
					}
				}
				html += '</ul>';
				html += '</div>';
				html += '<a href="#picture" class="default-plus-selectphoto">';
				html += '<button class="clearfix popverScreeen">';
				html += '<span>我也说一句</span>';
				html += '<div></div>';
				html += '</button>';
				html += '</a>';
				html += '</div>';
				html += '</li>';
			}
		}
		return html;
	};
	/**
	 * @description 给动态（点赞）操作
	 */
	exports.praise = function(data, isRefresh) {
		//var url = config.MockServerUrl + "mobile/space/trends/like";
		var url = config.JServerUrl + "mobile/space/trends/like";
		//var url = config.JServerUrl + "circle/mobile/circle/TopicPraiseManage";
		var requestData = {};
		//requestData.ValidateData = 'mobilevalidatedata';
		var data = data;
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("点赞参数：" + requestData);
		//console.log("点赞参数：" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("点赞结果" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 0);
			if(response.code == 1) {
				console.log("xxxxxxxxxxx" + JSON.stringify(response.custom));
				console.log(response.description);
				//赞和取消赞都要刷新动态列表，isRefresh代表是否刷新动态列表，true代表是，false代表否
				if(isRefresh) {
					//WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "refreshListPage");
				} else {
					console.log("在动态列表中点赞，不需要刷新列表！");
				}
			}
		}, function(e) {
			UIUtil.toast("网络连接超时！请检查网络...");
		}, 1, secretKey, false);
	};

	/**
	 * @description 删除动态以及跟评
	 */
	exports.deleteDynamic = function(data) {
		//var url = config.MockServerUrl + 'mobile/space/trends/delete';
		var url = config.JServerUrl + 'mobile/space/trends/delete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("删除参数：" + requestData);
		console.log("删除接口：" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				console.log("删除的显示信息" + JSON.stringify(response));
				if(device.tablet()) {
					WindowUtil.firePageEvent('szpark_personal_space_list_pad.html', 'refreshListMainPage');
				} else {
					WindowUtil.firePageEvent('szpark_personal_space_list.html', 'refreshListPage');
				}
				UIUtil.toast(response.description);
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 举报动态
	 */
	exports.reportDynamic = function(data) {
		//var url = config.MockServerUrl + "mobile/space/trends/accusation";
		var url = config.JServerUrl + "mobile/space/trends/accusation";
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log("举报的Url"+url);
		//console.log("举报的参数"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				//console.log("举报信息"+JSON.stringify(response));
				//举报
				UIUtil.toast(response.description);
			}
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});