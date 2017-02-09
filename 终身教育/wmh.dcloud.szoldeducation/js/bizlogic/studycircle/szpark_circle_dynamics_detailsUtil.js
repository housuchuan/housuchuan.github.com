/**
 * 描述 :话题详情辅助类 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-08-02 17:10:36
 */
define(function(require, exports, module) {
	//设备判断类
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	/**
	 * @description 由于涉及一级评论列表和二级评论列表，话题评论列表页面需要动态生成评论信息。
	 * @param tempInfo 数组Array
	 */
	exports.generateCommentListHtml = function(tempInfo) {
		//console.log("ddd" + JSON.stringify(tempInfo));
		var html = '';
		if(tempInfo) {
			if(Array.isArray(tempInfo)) {
				mui.each(tempInfo, function(key, value) {
					//console.log("value" + JSON.stringify(value));
					//判断头像是否存在，不存在默认
					if(!value.image || value.image == "Zhrong  :  image is undefined!") {
						if(DeviceUtil.tablet()) {
							value.image = '../../../img/MobileFrame/img_head_logo102-102.png';
						} else {
							value.image = '../../img/MobileFrame/img_head_logo102-102.png';
						}
					}
					html += '<li class="comment-area comment_item"id="' + value.commentId + '">';
					html += '<img src="' + value.image + '" />';
					html += '<div class="comment-content commentId firstCommentLog">';
					html += '<span class="author">' + value.author + '</span>：';
					html += '<span class="authorId" style="display:none">' + value.authorId + '</span>';
					html += '<p class="commentContent">' + unescape(value.content) + '</p><br />';
					html += '<span class="release-time">' + value.time + '</span><span class="review-icon"></span><span class="replay-person2">回复</span>';
					html += '<span class="tip">举报</span>';
					html += '</div>';
					//html += '<div class="secondLevelCommnet">';
					if(value.secondcommendlist) {
						var secondtLevelCommentListData = value.secondcommendlist;
						if(Array.isArray(secondtLevelCommentListData)) {
							var outputComment = '';
							var litemplate = '<div id="{{commentId}}" class="secondLevelCommnet secondCommentLog"><img src="{{image}}"><div class="comment-content"><span class="secondAutor">{{author}}</span><span>{{content}}</span><br><span class="release-time">{{time}}</span><span class="review-icon"></span><span class="replay-person2">回复</span> <span class="tip">举报</span></div></div>';
							mui.each(secondtLevelCommentListData, function(key1, value1) {
								//console.log("value1" + JSON.stringify(value1));
								//判断头像是否存在，不存在默认
								if(!value1.image || value1.image == "Zhrong  :  image is undefined!") {
									if(DeviceUtil.tablet()) {
										value1.image = '../../../img/MobileFrame/img_head_logo102-102.png';
									} else {
										value1.image = '../../img/MobileFrame/img_head_logo102-102.png';
									}
								};
								value1.content = unescape(value1.content);
//								html += '<img src="' + value1.image + '" />';
//								html += '<div class="comment-content reply_commentId" id="' + value1.commentId + '"><span>' + value1.author + '：</span>回复 <span class="replay-person">' + value.author + '：</span>';
//								html += '<p>' + unescape(value1.content) + '</p><br />';
//								html += '<span class="release-time">' + value1.time + '</span>';
//								//html += '<span class="tip">举报</span>';
//								html += '</div>';
								outputComment += Mustache.render(litemplate, value1);
							});
							html += outputComment;
						} else {
							//判断头像是否存在，不存在默认
							if(!secondtLevelCommentListData.image || secondtLevelCommentListData.image == "Zhrong  :  image is undefined!") {
								if(DeviceUtil.tablet()) {
									secondtLevelCommentListData.image = '../../../img/MobileFrame/img_head_logo102-102.png';
								} else {
									secondtLevelCommentListData.image = '../../img/MobileFrame/img_head_logo102-102.png';
								}
							};
							var litemplate = '<div id="{{commentId}}" class="secondLevelCommnet secondCommentLog"><img src="{{image}}"><div class="comment-content"><span class="secondAutor">{{author}}</span><span>{{content}}</span><br><span class="release-time">{{time}}</span><span class="review-icon"></span><span class="replay-person2">回复</span> <span class="tip">举报</span></div></div>';
							secondtLevelCommentListData.content = unescape(secondtLevelCommentListData.content);
//							html += '<img src="' + secondtLevelCommentListData.image + '" />';
//							html += '<div class="comment-content"><span>' + secondtLevelCommentListData.author + '：</span>回复 <span class="replay-person">' + value.author + '：</span>';
//							html += '<p>' + unescape(secondtLevelCommentListData.content) + '</p><br />';
//							html += '<span class="release-time">' + secondtLevelCommentListData.time + '</span>';
//							//html += '<span class="tip">举报</span>';
//							html += '</div>';
							var output = Mustache.render(litemplate, secondtLevelCommentListData);
							html += output;
						}
					}
//					html += '</div>';
				});
			} else {
				//判断头像是否存在，不存在默认
				if(!tempInfo.image || tempInfo.image == "Zhrong  :  image is undefined!") {
					if(DeviceUtil.tablet()) {
						tempInfo.image = '../../../img/MobileFrame/img_head_logo102-102.png';
					} else {
						tempInfo.image = '../../img/MobileFrame/img_head_logo102-102.png';
					}
				}
				html += '<img src="' + tempInfo.image + '" />';
				html += '<div class="comment-content firstCommentLog">';
				html += '<span class="author">' + tempInfo.author + '：</span>';
				html += '<span class="authorId" style="display:none">' + tempInfo.authorId + '：</span>';
				html += '<p>' + unescape(tempInfo.content) + '</p><br />';
				html += '<span class="release-time">' + tempInfo.time + '</span><span class="review-icon"></span>';
				html += '<span class="tip">举报</span>';
				html += '</div>';
				//html += '<div class="secondLevelCommnet">';
				if(tempInfo.secondcommendlist) {
					var secondtLevelCommentListData = tempInfo.secondcommendlist;
					if(Array.isArray(secondtLevelCommentListData)) {
						var outputComment = '';
						var litemplate = '<div id="{{commentId}}" class="secondLevelCommnet secondCommentLog"><img src="{{image}}"><div class="comment-content"><span class="secondAutor">{{author}}</span><span>{{content}}</span><br><span class="release-time">{{time}}</span><span class="review-icon"></span><span class="replay-person2">回复</span> <span class="tip">举报</span></div></div>';
						mui.each(secondtLevelCommentListData, function(key1, value1) {
							//判断头像是否存在，不存在默认
							if(!value1.image || value1.image == "Zhrong  :  image is undefined!") {
								if(DeviceUtil.tablet()) {
									value1.image = '../../../img/MobileFrame/img_head_logo102-102.png';
								} else {
									value1.image = '../../img/MobileFrame/img_head_logo102-102.png';
								}
							};
							value1.content = unescape(value1.content);
//							html += '<img src="' + value1.image + '" />';
//							html += '<div class="comment-content"><span>' + value1.author + '：</span>回复 <span class="replay-person">' + value1.author + '：</span>';
//							html += '<p></p><br />';
//							html += '<span class="release-time">' + value1.time + '</span>';
//							html += '<span class="tip">举报</span>';
//							html += '</div>';
							outputComment += Mustache.render(litemplate, value1);
						});
						html += outputComment;
					} else {
						//判断头像是否存在，不存在默认
						if(!secondtLevelCommentListData.image || secondtLevelCommentListData.image == "Zhrong  :  image is undefined!") {
							if(DeviceUtil.tablet()) {
								secondtLevelCommentListData.image = '../../../img/MobileFrame/img_head_logo102-102.png';
							} else {
								secondtLevelCommentListData.image = '../../img/MobileFrame/img_head_logo102-102.png';
							}
						};
						var litemplate = '<div id="{{commentId}}" class="secondLevelCommnet secondCommentLog"><img src="{{image}}"><div class="comment-content"><span class="secondAutor">{{author}}</span><span>{{content}}</span><br><span class="release-time">{{time}}</span><span class="review-icon"></span><span class="replay-person2">回复</span> <span class="tip">举报</span></div></div>';
						secondtLevelCommentListData.content = unescape(secondtLevelCommentListData.content);
//						html += '<img src="' + secondtLevelCommentListData.image + '" />';
//						html += '<div class="comment-content"><span>' + secondtLevelCommentListData.author + '：</span>回复 <span class="replay-person">' + secondtLevelCommentListData.author + '：</span>';
//						html += '<p></p><br />';
//						html += '<span class="release-time">' + secondtLevelCommentListData.time + '</span>';
//						html += '<span class="tip">举报</span>';
//						html += '</div>';
						var output = Mustache.render(litemplate, secondtLevelCommentListData);
						html += output;
					}
				}
//				html += '</div>';
			}
		}
		html += '</li>';
		return html;
	}
});