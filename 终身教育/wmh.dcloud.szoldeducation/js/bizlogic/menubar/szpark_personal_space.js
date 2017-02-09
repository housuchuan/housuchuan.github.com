/**
 * 描述 :个人空间父页面加载子页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-22 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	//引入窗口模块
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var isFirst = true;
	var secretKey = '';
	var friendsLen = 0;
	//var secretKey = config.secretKey;
	var userId = '',
		userName = '';
	var authorData = '';
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData(isFirst, para) {
		//缓存数据
		secretKey = StorageUtil.getStorageItem("secretKey");
		//获取用户缓存头像信息
		setUserHeadImgInfo();
		if(isFirst == false) {
			//第一次
			isFirst = true;
		} else {
			//否则
			isFirst = false;
		}
		var style_data = {
			top: '190px', //内容页面顶部位置,需根据实际页面布局计算
			bottom: '0px' //其它参数定义
		};
		//子页面
		var Options = [{
			url: 'szpark_personal_space_list.html', //下拉刷新内容页面地址
			id: 'szpark_personal_space_list.html', //内容页面标志
			styles: style_data,
			extras: {
				authorData: JSON.stringify(authorData)
			}
		}, {
			url: 'szpark_log_list.html', //下拉刷新内容页面地址
			id: 'szpark_log_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_newPhoto_album_list.html', //下拉刷新内容页面地址
			id: 'szpark_newPhoto_album_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_personal_profile_list.html', //下拉刷新内容页面地址
			id: 'szpark_personal_profile_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_yearbook_list.html', //下拉刷新内容页面地址
			id: 'szpark_yearbook_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_my_friends_list.html', //下拉刷新内容页面地址
			id: 'szpark_my_friends_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_photo_album_infoDetails_list.html', //下拉刷新内容页面地址
			id: 'szpark_photo_album_infoDetails_list.html', //内容页面标志
			styles: style_data,
			extras: {
				photoAlbumInfo: para
			}
		}];
		//console.log("打印信息：" + isFirst);
		WindowUtil.createSubWins(Options, true);
		//默认激活选项【主页】
		Zepto(".choose-list").find(".default-choice").addClass("new-active");
	}

	//设置头部头像信息
	function setUserHeadImgInfo() {
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		var authorSession = WindowUtil.getExtraDataByKey('authorSession');  
		console.log("用户信息：" + JSON.stringify(authorSession));
		if(authorSession){
			Zepto(".choose-list > div").hide();
			Zepto(".choose-list > div:first-child").show();
			if(!authorSession.image) {
			//如果为空，就默认一张
			Zepto("#user-photo").attr('src', '../../img/MobileFrame/img_head_logo190-190.png');
			} else {
				Zepto("#user-photo").attr('src', authorSession.image);
			};
			if(authorSession.ownerId) {
				userId = authorSession.ownerId;
			};
			if(authorSession.ownerName) {
				userName = authorSession.ownerName;
			};
			authorData = {
				userId: userId,
				userName: userName
			}
			//新增访客记录
			addVisitRecord();
		}else{
			if(!userSession.image) {
			//如果为空，就默认一张
			Zepto("#user-photo").attr('src', '../../img/MobileFrame/img_head_logo190-190.png');
			} else {
				Zepto("#user-photo").attr('src', userSession.image);
			};
			if(userSession.userId) {
				userId = userSession.userId;
			};
		}
		WindowUtil.firePageEvent("szpark_my_friends_list.html", "refreshListPage");
	};
	
	
	/**
     * @description //新增访客记录
     */
    function addVisitRecord() {
    	var url = config.ServerUrl + 'circle/mobile/index/visitorRecordInsert';
        var requestData = {};
        var data = {
            userId: (userSession.userId)||'',
            userName:(userSession.userName)||'',
            ownerId:(authorSession.ownerId)||'',
            ownername:(authorSession.ownerName)||''
        };
        requestData = data;
        requestData = JSON.stringify(requestData);
        mui.ajax(url, {
            data: requestData,
            dataType: "json",
            timeout: "15000", //超时时间设置为3秒；
            type: "POST",
            success: function(response){
            	var response = CommonUtil.handleStandardResponse(response, '2');
            	console.error(JSON.stringify(response));
            },
            error: function(){
            	UIUtil.toast('网络连接超时！请检查网络...');
            }
        });
    };
	
	//导航栏目切换
	Zepto(".choose-list").on('tap', 'div', function() {
		var title = Zepto(this).children('span:first-child').text();
		//var title2 = Zepto(this).first('span').text();
		//console.log(title);
		Zepto(this).addClass("new-active").siblings().removeClass("new-active");
		switch(title) {
			case "主页":
				changePageShow('szpark_personal_space_list.html');
				WindowUtil.firePageEvent("szpark_personal_space_list.html", "refreshListPage");
				break;
			case "日志":
				changePageShow('szpark_log_list.html');
				WindowUtil.firePageEvent("szpark_log_list.html", "refreshListPage");
				break;
			case "相册":
				changePageShow('szpark_newPhoto_album_list.html');
				WindowUtil.firePageEvent("szpark_newPhoto_album_list.html", "refreshListPage");
				break;
			case "好友":
				changePageShow('szpark_my_friends_list.html');
				WindowUtil.firePageEvent("szpark_my_friends_list.html", "refreshListPage");
				break;
			case "资料":
				changePageShow('szpark_personal_profile_list.html');
				break;
			case "年鉴":
				changePageShow('szpark_yearbook_list.html');
				break;
		}
	});

	function changePageShow(showPage) {
		var pageArray = ['szpark_personal_space_list.html', 'szpark_log_list.html', 'szpark_newPhoto_album_list.html', 'szpark_personal_profile_list.html', 'szpark_yearbook_list.html', 'szpark_my_friends_list.html', 'szpark_photo_album_infoDetails_list.html'];
		var len = pageArray.length;
		for(var i = 0; i < len; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i]);
			}
		}
	}

	//隐藏个人空间
	Zepto('.mui-icon-closeempty,.cancel-btn').on('tap', function() {
		var _this = Zepto('.add-photo');
		_this.css('display', 'none');
	})

	//是否公开
	Zepto('.whether-public').on('tap', 'div', function() {
		var _this = Zepto(this);
		_this.addClass('choice-active').siblings().removeClass('choice-active');
	})

	//监听子页面(浏览器版)
	window.showAddMenu = function(photoAlbumInfo) {
		//console.log("父页面接收子页面相册ID的值：" + photoAlbumInfo);
		changePageShow('szpark_photo_album_infoDetails_list.html');
		//initData(true, photoAlbumInfo);
		WindowUtil.firePageEvent("szpark_photo_album_infoDetails_list.html", "refreshListPage1", {
				photoAlbumInfo: photoAlbumInfo
			});
	};
	//监听子页面弹出(手机版)
	window.addEventListener('showAddMenu', function(e) {
		//console.log("父页面接收子页面相册ID的值：" + e.detail.photoAlbumInfo);
		if(e.detail.photoAlbumInfo) {
			var photoAlbumInfo = e.detail.photoAlbumInfo;
			//console.log("photoAlbumInfo"+photoAlbumInfo);
			//StorageUtil.setStorageItem("photoAlbumInfo", photoAlbumInfo);
			changePageShow('szpark_photo_album_infoDetails_list.html');
			WindowUtil.firePageEvent("szpark_photo_album_infoDetails_list.html", "refreshListPage1", {
				photoAlbumInfo: photoAlbumInfo
			});
		}
	});

	//监听好友申请的人数
	window.addEventListener('refreshFriendCounts', function(e) {
		console.log("监听中...........xxxxxxxxxxxxxxxxxxxx");
		if(e.detail.friendCounts) {
			var friendCounts = e.detail.friendCounts;
			Zepto(".messageNotice").text(friendCounts);
		}else{
			Zepto(".messageNotice").text(0);
		}
	});
	//监听子页面(浏览器版)
	window.refreshFriendCounts = function(friendCount) {
		console.log("浏览器里刷新好友数目的值：" + friendCount);
		Zepto('.messageNotice').text(friendCount);
	};

});