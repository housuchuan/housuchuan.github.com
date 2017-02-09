/**
 * 描述 :个人空间（pad版页面） 
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-09-14 13:43:55
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var userId = '',
		userName = '',
		headImg = '',
		authorData = '';
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//获取个人信息（头像和昵称）
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		var authorSession = WindowUtil.getExtraDataByKey('authorSession');
		if(authorSession) {
			Zepto(".tab-item-common").hide();
			Zepto(".tab-item-style").show();
			if(!authorSession.image) {
				//如果为空，就默认一张
				Zepto("#headImg").attr('src', '../../../img/MobileFrame/img_head_logo190-190.png');
			} else {
				Zepto("#headImg").attr('src', authorSession.image);
			};
			if(authorSession.ownerId) {
				userId = authorSession.ownerId;
			};
			if(authorSession.ownerName) {
				userName = authorSession.ownerName;
				Zepto(".nick").text(userName);
			} else {
				//默认用户为空！
				Zepto(".nick").text("");
			};
			authorData = {
				userId: userId,
				userName: userName
			};
			//新增访客记录
			addVisitRecord();
		} else {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
				Zepto(".nick").text(userName);
			} else {
				//默认用户为空！
				Zepto(".nick").text("");
			}
			if(userSession.image) {
				headImg = userSession.image;
				Zepto("#headImg").attr("src", headImg);
			} else {
				//默认一张头像照片
				Zepto("#headImg").attr("src", "../../../img/MobileFrame/img_head_logo190-190.png");
			}
		};

		//创建子页面
		var style_data = {
			top: '44px', //内容页面顶部位置,需根据实际页面布局计算
			bottom: '0px', //其它参数定义
			left: "14%",
			right: "0px"
		};
		var PageArray = [{
			url: 'szpark_personal_space_list_pad.html', //下拉刷新内容页面地址
			id: 'szpark_personal_space_list_pad.html', //内容页面标志
			styles: style_data,
			extras: {
				authorData: JSON.stringify(authorData)
			}
		}, {
			url: '../../menubar/szpark_log_list.html', //下拉刷新内容页面地址
			id: 'szpark_log_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_photo_album_list_pad.html', //下拉刷新内容页面地址
			id: 'szpark_photo_album_list_pad.html', //内容页面标志
			styles: style_data
		}, {
			url: '../../menubar/szpark_trends_list.html', //下拉刷新内容页面地址
			id: 'szpark_trends_list.html', //内容页面标志
			styles: style_data
		}, {
			url: '../../menubar/szpark_personal_profile_list.html', //下拉刷新内容页面地址
			id: 'szpark_personal_profile_list.html', //内容页面标志
			styles: style_data
		}, {
			url: '../../menubar/szpark_yearbook_list.html', //下拉刷新内容页面地址
			id: 'szpark_yearbook_list.html', //内容页面标志
			styles: style_data
		}, {
			url: 'szpark_my_friends_list_pad.html', //下拉刷新内容页面地址
			id: 'szpark_my_friends_list_pad.html', //内容页面标志
			styles: style_data
		}];
		WindowUtil.createSubWins(PageArray);
	}
	//tab切换
	Zepto('.tab-content').on('tap', '.tab-item-common', function() {
		Zepto(this).addClass('tab-item-style').siblings().removeClass('tab-item-style');
		var titleText = Zepto(this).text();
		//console.log("titleText"+titleText);
		switch(titleText) {
			case '主页':
				changePageShow('szpark_personal_space_list_pad.html');
				WindowUtil.firePageEvent("szpark_personal_space_list_pad.html", "refreshMainPage");
				break;
			case '日志':
				changePageShow('szpark_log_list.html');
				break;
			case '相册':
				changePageShow('szpark_photo_album_list_pad.html');
				break;
			case '动态':
				changePageShow('szpark_trends_list.html');
				break;
			case '个人资料':
				changePageShow('szpark_personal_profile_list.html');
				break;
			case '年鉴':
				changePageShow('szpark_yearbook_list.html');
				break;
			case '好友':
				changePageShow('szpark_my_friends_list_pad.html');
				break;
		}
	});
	
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

	/**
	 * @description 改变页面展示
	 * @param {Object} showPage
	 */
	function changePageShow(showPage) {
		var pageArray = ['szpark_personal_space_list_pad.html', 'szpark_log_list.html', 'szpark_photo_album_list_pad.html', 'szpark_trends_list.html', 'szpark_personal_profile_list.html', 'szpark_yearbook_list.html', 'szpark_my_friends_list_pad.html'];
		var length = pageArray.length;
		for(var i = 0; i < length; i++) {
			if(showPage == pageArray[i]) {
				WindowUtil.showSubPage(showPage);
			} else {
				WindowUtil.hideSubPage(pageArray[i])
			}
		}
	}
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
		if(e.detail.friendCounts) {
			var friendCounts = e.detail.friendCounts;
			Zepto(".messageNotice").text(friendCounts);
		}
	});
	//监听子页面(浏览器版)
	window.refreshFriendCounts = function(friendCount) {
		console.log("浏览器里刷新好友数目的值：" + friendCount);
		Zepto('.messageNotice').text(friendCount);
	};
});