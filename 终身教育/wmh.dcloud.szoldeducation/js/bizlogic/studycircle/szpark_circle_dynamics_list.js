/**
 * 描述 :圈子动态列表页面 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-14 09:25:58
 */
define(function(require, exports, module) {
	"use strict"
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var HtmlTools = require('core/MobileFrame/HtmlUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UploadH5Tools = require('core/MobileFrame/UpLoadH5Util.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	//Tools该工具类主要是优化代码，把一些初始化的操作放在这里面，关联性耦合性低的操作放在这里面
	var Tools = require('bizlogic/studycircle/szpark_circle_dynamics_list_Util.js');
	var maxLenth = parseInt(Zepto('.font-num span:last-child').text());
	//设置一个showFlag的显示标志位
	var showFlag = false;
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
	//被申请还有信息
	var ownerId = '',
		ownerName = '';
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
		//setFilesSelect();
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
		//console.log("参数"+requestData);
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
				tmpInfo.image = '../../img/MobileFrame/img_default_noimage130-130.png';
			} else {
				tmpInfo.image = unescape(tmpInfo.image);
			};
			tmpInfo.title = unescape(tmpInfo.title);
			tmpInfo.introduction = unescape(tmpInfo.introduction);
			circleName = tmpInfo.title;
			Zepto("#circleBaseInfo").html('');
			var litemplate = '<ul class="mui-table-view"><li class="table-view-cell clearfix"><button class="join-us">＋加入</button><div>{{title}}</div></li><li class="table-view-cell"><span>圈子简介：</span><span class="introsty mui-ellipsis-2">{{introduction}}</span><br/><span class="circle-member">成员：</span><span class="circle-number">{{member}}</span><span class="showMore">显示更多</span></li></ul><img src="{{image}}"/>';
			var output = Mustache.render(litemplate, tmpInfo);
			Zepto("#circleBaseInfo").append(output);
			console.log("xxxxxxxxxxxxxxxxx" + JSON.stringify(tmpInfo));
			//（isManager  0/1/2/3/4:申请加入/已加入/圈主/待审核/被删除的和被拒绝的） 
			if(tmpInfo.isManager == "0") {
				//申请加入
				Zepto(".join-us").text("申请加入");
				Zepto(".join-us").css('background', '#1ebaf3');
			} else if(tmpInfo.isManager == "1") {
				//已加入
				//Zepto(".join-us").text("已加入");
				//Zepto(".join-us").css('background', 'gray');
				//Zepto(".join-us").attr('disabled', 'disabled');
				//由于加入的圈子存在退出功能，所以更改相应需求
				Zepto(".join-us").text("退出圈子");
				Zepto(".join-us").css('background', '#1ebaf3');
			} else if(tmpInfo.isManager == "2") {
				//圈主
				Zepto(".join-us").hide();
				Zepto(".join-us").text("已是圈主");
				Zepto(".join-us").css('background', 'gray');
				Zepto(".join-us").attr('disabled', 'disabled');
			} else if(tmpInfo.isManager == "3") {
				//审核中....
				Zepto(".join-us").hide();
				Zepto(".join-us").text("待审核");
				Zepto(".join-us").css('background', 'gray');
				Zepto(".join-us").attr('disabled', 'disabled');
			} else if(tmpInfo.isManager == "4") {
				//不作处理
				Zepto(".join-us").hide();
				// 被删除的和被拒绝的”，页面上不显示状态。
				Zepto(".join-us").text("审核不通过");
				Zepto(".join-us").css('background', 'gray');
				Zepto(".join-us").attr('disabled', 'disabled');
			}
			//初始化下拉列表
			initPullRefreshList();
			//Zepto(".userwrapper").css('background','../../img/studyCircle/circle_dynmatic.jpg');
			//1.加入圈子点击事件
			Zepto('.join-us').on('tap', function() {
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
			//显示更多简介
			Zepto('.showMore').on('tap', function() {
				if(showFlag) {
					Zepto('.introsty').addClass('mui-ellipsis-2');
					Zepto('.showMore').text('显示更多').css('color', 'dimgray');
					showFlag = false;
				} else {
					Zepto('.introsty').removeClass('mui-ellipsis-2');
					Zepto('.showMore').text('隐藏').css('color', 'red');
					showFlag = true;
				};
			});
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

	window.addEventListener('initCircleInfo', function(e) {
		ajaxDetailData(circleId);
	});

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = 'validatedata';
			var data = {
				userId: userId,
				circleId: circleId,
				pageIndex: CurrPage,
				pageSize: PageSize,
				keyword: ""
			};
			requestData.para = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData.para);
			//console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};
		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, 1);
			if(response.code == "1") {
				totalNumCount = response.totalCount;
				console.log("改变数据：" + JSON.stringify(response));
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					//解码话题标题
					value.topicName = unescape(value.topicName);
					//判断发表话题的作者是否与
					if(value.authorId == userId) {
						value.img = image;
					} else {
						value.img = "../../img/MobileFrame/img_head_logo102-102.png";
					}
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
			var litemplate = '<li class="table-view-cell character-operate clearfix"id="{{topicId}}"><span class="isFriend" id="{{isFriend}}"></span><div class="userwrapper"><img class="appendFriends" src="{{img}}"/><span class="authorId" id="{{authorId}}"></span><div class="character-outer"><p class="charactersec"><span class="character-name">{{author}}：</span><span class="topicName">{{topicName}}</span></p><span class="character-datetime">{{date}}</span></div><div class="report-wrapper"><span class="delete-div"><span class="deleteIcon"></span><span class="deldete">删除</span></span><span class="report-div"><span class="reporticon"></span><span class="report">举报</span></span><span class="comment-div"><span class="comment-icon"></span><span>评论<span class="report-number praise-number">({{comment}})</span></span></span></span><span class="praise-div"><span class="praise-icon praise"></span><span>赞<span class="report-number"id="praiseNumber">({{praise}})</span></span><span style="display:none"class="praiseStatus">{{isPraise}}</span></div><div class="cut-line-no-line"></div><div class="comments_list"></div></div></li>';
			return litemplate;
		};
		var getUrl = function() {
			//var url = config.MockServerUrl + "studycircle/getCircleDynamicList";
			//var url = config.PCServerUrl + "TopicList";
			var url = config.JServerUrl + "circle/mobile/detail/topicList";
			console.log("url" + url);
			return url;
		};
		//点击事件
		var onItemClickCallbackFunc = function(e) {
			topicId = Zepto(this).attr('id'); //每一条动态guid
			topicName = Zepto(this).find('.topicName').text(); //每一条动态guid
			var praiseStatus = Zepto(this).find('.praiseStatus').text(); //点赞状态
			//console.log("点赞状态：" + praiseStatus);
			//如果是选择了举报，触发加入按钮
			if(Zepto(e.target).hasClass('report-div') || Zepto(e.target).parent('.report-div').html() != null) {
				//举报
				CustomDialogUtil.showCustomDialog('join-circle'); //显示自定义对话框
				Zepto("#commontitle").text("举报");
				Zepto(".confirm-btn").text("举报");
				Zepto("#reason").attr("placeholder", "请输入举报理由！(50字以内)");
				//删除动态
			} else if(Zepto(e.target).hasClass('delete-div') || Zepto(e.target).parent('.delete-div').html() != null) {
				var extras = {
					userId: userId,
					topicId: topicId
				}
				UIUtil.confirm({
					content: '是否要删除该话题?',
					title: '温馨提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						Tools.deleteTopic(extras);
					}
				});
			} else if(Zepto(e.target).hasClass('comment-div') || Zepto(e.target).parent('.comment-div').html() != null) {
				WindowUtil.createWin("szpark_circle_dynamics_details.html", "szpark_circle_dynamics_details.html", {
					circleId: circleId,
					topicId: topicId,
					topicName: topicName
				});
			} else if(Zepto(e.target).hasClass('praise-div') || Zepto(e.target).parent('.praise-div').html() != null) {
				//console.log('target:' + Zepto(e.target).parent('.praise-div').html());
				var _this = Zepto(this).find('.praise-icon');
				var praise_text = Zepto(this).find("#praiseNumber").text();
				var praiseCount = parseInt(praise_text.substring(1, praise_text.length - 1));
				if(_this.hasClass('praise-active')) {
					//console.log("取消点赞-1");
					//点击赞-1
					var data = {
						userId: userId,
						userName: userName,
						topicId: topicId,
						type: "0"
					};
					Tools.praise(data, false, function(message) {
						console.log("message" + message);
						if(message == "话题取消点赞成功！") {
							mui.toast(message);
							_this.removeClass('praise-active');
							Zepto(this).find("#praiseNumber").text("(" + parseInt(praiseCount - 1) + ")")
						} else {
							mui.toast(message);
						}
					});
				} else {
					//console.log("点赞+1");
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
							_this.addClass('praise-active');
							Zepto(this).find("#praiseNumber").text("(" + parseInt(praiseCount + 1) + ")");
						} else {
							mui.toast(message);
						}

					});
				}
			} else if(Zepto(e.target).hasClass('appendFriends')) {
				//加好友设置
				ownerId = Zepto(this).find('.authorId').attr('id');
				ownerName = Zepto(this).find('.character-name').text();
				var ownerimg = Zepto(this).find('.appendFriends').attr('src');
				Zepto('.ownerName').text(ownerName.substring(0, ownerName.length - 1));
				Zepto('.ownerImg > img').attr('src', ownerimg);
				if(ownerId !== userId) {
					var isFriend = Zepto(this).find('.isFriend').attr('id');
					console.log("xxxxxxxxxxxxxxxxxxxx" + isFriend);
					if(isFriend == 1) {
						var authorSession = {
							image: ownerimg,
							ownerId: ownerId,
							ownerName: (ownerName.substring(0, ownerName.length - 1))
						};
						//跳转到相应人员的个人空间
						WindowUtil.createWin('szpark_personal_space.html', '../menubar/szpark_personal_space.html', {
							authorSession: authorSession
						});
					} else {
						CustomDialogUtil.showCustomDialog('apply-friends'); //显示自定义对话框
					}
				} else {
					//跳转到相应人员的个人空间
					WindowUtil.createWin('szpark_personal_space.html', '../menubar/szpark_personal_space.html');
				}
			} else {
				WindowUtil.createWin("szpark_circle_dynamics_details.html", "szpark_circle_dynamics_details.html", {
					circleId: circleId,
					topicId: topicId,
					topicName: topicName
				});
			}
		};
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			var _this = Zepto("#listdata").find('li').find('.praise-icon');
			//遍历增加点赞
			mui.each(response, function(key, value) {
				if(value.isPraise == 0) {
					//还未点赞
					//console.log("未点赞");
					Zepto(_this[key]).removeClass('praise-active');
					//_this.removeClass('praise-active');
				} else {
					//点过赞了
					//console.log("点赞了");
					Zepto(_this[key]).addClass('praise-active');
					//_this.addClass('praise-active');
				}
			});
			//图片预览
			mui.previewImage();

		};
		//初始化下拉刷新控件
		PullrefreshUtil.initPullDownRefresh({
			//是否是debug模式,如果是的话会输出错误提示PullrefreshUtil
			IsDebug: true,
			//默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			mDefaultInitPageNum: 1,
			mGetLitemplate: getLitempate,
			mGetUrl: getUrl,
			mGetRequestDataFunc: getData,
			mChangeResponseDataFunc: changeResponseDataFunc,
			mChangeToltalCountFunc: changeToltalCountFunc,
			mRequestSuccessCallbackFunc: successCallbackFunc,
			mOnItemClickCallbackFunc: onItemClickCallbackFunc,
			ajaxSetting: {
				accepts: {
					json: "application/json;charset=utf-8"
				},
				contentType: "application/json",
				//头部heads，用于过滤头部信息，判断请求之前是否需要验证规则（比如登录）
				headers: {
					"X-SecretKey": secretKey
				},
			}
		});
	};
	//发表新话题点击事件
	Zepto(".publish-newTopic").on('tap', function() {
		//var url = config.MockServerUrl + 'studycircle/publishNewTopic';
		//var url = config.PCServerUrl + 'TopicInsert';
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
		//console.log("发表话题接口：" + url);
		//console.log("发表话题参数：" + requestData);
		Zepto('textarea').val('');
		Zepto('#title').val('');
		//关闭发表动态框
		mui('#picture').popover('toggle');
		if(Tools.checkInputValidate(data) == true) {
			CommonUtil.ajax(url, requestData, function(response) {
				//console.log("response" + JSON.stringify(response));
				var response = CommonUtil.handleStandardResponse(response, 0);
				if(response.code == '1') {
					//console.log(JSON.stringify(response));
					mui.toast(response.description);
					//清空输入
					Tools.resetData();
					//刷新话题列表
					WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "refreshListPage");
					//刷新圈子列表
					WindowUtil.firePageEvent("szpark_study_circle.html", "refreshListPage");
				}
			}, function(e) {
				UIUtil.toast("网络连接超时！请检查网络...");
			}, 1, secretKey);
		}
	});
	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		//设置文件选择为图片选择
		FileUtil.setSelectImgsFromDisks('#chooseImgFromGalleryFile', function(b64, file) {
			//添加图片
			//			imgArray.push({
			//				name: file.name,
			//				file: file
			//			});
			//选择映射 添加预览
			appendImg(b64, file);
		}, {
			isMulti: true
		});
	}
	/**
	 * @description 将图片添加进入容器中显示
	 * @param {String} path 路径
	 */
	function appendImg(path, file) {
		var html = getImgHtmlByPath(path, file);
		var dom = document.getElementById('tupian');
		HtmlTools.appendHtmlChildCustom(dom, html);
		deleteIcon();
	}
	/**
	 * @description 添加图片有关,获得图片模板
	 *  @param {String} path 路径
	 */
	function getImgHtmlByPath(path, file) {
		var imgLitemplate = '<div class="pailie"><div class="file" style="display:none">' + file + '</div><div class="delete-icon"id="' + file.name + '"></div><img src="' + path + '"data-preview-src="' + path + '" data-preview-group="1"/></div>';
		return imgLitemplate;
	};
	//删除照片
	function deleteIcon() {
		//2.选择上传展示图片、删除上传图片
		Zepto(".delete-icon").unbind();
		Zepto(".delete-icon").on('tap', function() {
			Zepto(this).parent().remove();
			var name = Zepto(this).attr("id");
			var htmlArr = Zepto(".pailie");
			if(Array.isArray(htmlArr)) {
				mui.each(htmlArr, function(key, value) {
					imgArray.push({
						name: Zepto(value).find('.delete-icon').attr('id'),
						file: Zepto(value).find('.file').text()
					});
				});
			} else {
				imgArray = [];
			}

			//console.log("还剩"+JSON.stringify(imgArray));
			//console.log("还剩" + StringUtil.formatJson(imgArray));
		});
	}
	//上传照片
	function UpLoadImage(imgArray) {
		//var attachUrl = config.MockServerUrl + 'personalSpace/uploadPhotoBtn';
		UploadH5Tools.upLoadFiles({
			url: attachUrl,
			data: {
				userId: 'jdadkjnank',
				photoAlbumId: 'photoAlbumId', //父页面传过来
				//photoId: idArray				//请求参数
			},
			files: imgArray,
			beforeUploadCallback: function() {
				//console.log("准备上传");
			},
			successCallback: function(response, detail) {
				//console.log("上传成功:" + JSON.stringify(response));
				mui.alert('上传成功');
				//console.log("detail:" + detail);
			},
			errorCallback: function(msg, detail) {
				//console.log("上传失败:" + msg);
				//console.log("detail:" + detail);
			},
			uploadingCallback: function(percent, msg, speed) {
				//console.log("上传中:" + percent + ',msg:' + msg + ',speed:' + speed);
			}
		});
	};

	/*
	 * @description 加好友设置
	 */
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
			ownerName: (ownerName.substring(0, ownerName.length - 1)),
			reason: document.getElementById("textarea").value,
			userId: userId,
			userName: userName
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("身申请还有的请求参数" + requestData);
		console.log("xxxxxxxxxxxxxxxx"+url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				console.log("xxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
				WindowUtil.firePageEvent("szpark_circle_dynamics_list.html", "refreshListPage");
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
		console.log("xxxxx"+url);
		console.log("xxxxx"+requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				UIUtil.toast(response.description);
				//请求基本信息
				ajaxDetailData(circleId);
				WindowUtil.firePageEvent("szpark_study_circle.html", "dropCircle");
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});