/**
 * 描述 :相册子页面交互 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-23 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var photoAlbumId;
	var photoAlbumName;
	var photoAlbumDescribe;
	var titleTag = '';
	var ispublic = 0;
	//每页显示条数
	var PageSize = 14;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = "";
	var userId = "";
	var userName = "";
	CommonUtil.initReady(function() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			}
		};
		//初始化相册列表刷新
		initPhototAlbumPullrefresh();
	});
	/**
	 * 初始化监听事件
	 */
	function initOnClickOrTapListenerEvent() {
		//隐藏修改相册和添加相册弹出框
		Zepto('.mui-icon-closeempty,.cancel-btn').on('tap', function() {
			CustomDialogUtil.hideCustomDialog('add-photo'); //隐藏自定义对话框
			resetDefault();
		});

		//是否公开
		Zepto('.whether-public').on('tap', 'div', function() {
			Zepto(this).addClass('choice-active').siblings().removeClass('choice-active');
			if(Zepto(this).hasClass('true-choice')) {
				//公开
				ispublic = 1;
			} else if(Zepto(this).hasClass('wrong-choice')) {
				//不公开
				//console.log("不公开");
				ispublic = 0;
			}
		});
	};

	function initPhototAlbumPullrefresh() {
		//接口请求参数
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: userId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求参数' + requestData);
			return requestData;
		};

		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			console.log("改变数据 ：" + JSON.stringify(response));
			if(response.code == 1) {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(!value.photoAlbumImage || value.photoAlbumImage == "img is not define") {
						value.photoAlbumImage = '../../img/homepage/img_news1.jpg';
					}else{
						value.photoAlbumImage = unescape(value.photoAlbumImage);
					};
					value.photoAlbumName = unescape(value.photoAlbumName);
					value.introduce = unescape(value.introduce);
				});
				//console.log(JSON.stringify(tempArray));
			}
			return tempArray;
		};
		
		//这是必须传的,否则数量永远为0,永远不能加载更多
		var changeToltalCountFunc = function(response) {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};
		
		//模板
		var getLitempate = function() {
			var litemplate = '<li id="{{photoAlbumId}} "class="photolist"><div class="photo-background"><img src="{{photoAlbumImage}}"/><span>{{photoAlbumNum}}</span><div class="photo-operate"><button class="update">修改</button><button class="delete">删除</button></div></div><div class="photo-operation"><span>{{photoAlbumName}}</span></div><span style="display:none" class="introduce">{{introduce}}</span></li>';
			return litemplate;
		};
		
		//服务接口地址
		var getUrl = function() {
				//var url = config.MockServerUrl + "mobile/space/album/photoAlbumList";
				var url = config.JServerUrl + "mobile/space/album/photoAlbumList";
				return url;
			}
		
			//事项item点击回调
		var onItemClickCallbackFunc = function(e) {
			photoAlbumId = this.id; //相册id
			var albumName = Zepto(this).find('.photo-operation span').text(); //相册名称
			var introduce = Zepto(this).find('.introduce').text(); //相册描述
			var photoAlbumPhotoNum = Zepto(this).find('.photo-background span').text(); //相册里的照片数量
			if(Zepto(e.target).hasClass('add-photoAlbum') || Zepto(e.target).hasClass('mui-icon-plusempty') || Zepto(e.target).hasClass('addText')) {
				titleTag = '添加相册';
				CustomDialogUtil.showCustomDialog('add-photo'); //显示自定义对话框
				Zepto('.photo-bar').children('span').first().text('添加相册');
			} else if(Zepto(e.target).hasClass('update')) {
				titleTag = "修改相册";
				CustomDialogUtil.showCustomDialog('add-photo'); //显示自定义对话框
				Zepto('.photo-bar').children('span').first().text('修改相册');
				Zepto('.photo-name').find('input').val(albumName);
				Zepto('.photo-describe').find('input').val(introduce);
			} else if(Zepto(e.target).hasClass('delete')) {
				//删除相册
				UIUtil.confirm({
					content: '您确认要删除吗？',
					title: '提示',
					buttonValue: ['确定', '取消']
				}, function(index) {
					if(index == 0) {
						deleteAlbum(photoAlbumId);
					}
				});
			} else {
				//console.log("111111");
				//跳转到相册详情页面
				var photoAlbumInfo = {
					photoAlbumId: photoAlbumId,
					photoAlbumPhotoNum: photoAlbumPhotoNum,
					albumName: albumName
				}
				photoAlbumInfo = JSON.stringify(photoAlbumInfo);
				if(CommonUtil.os.plus) {
					//触发父页面
					WindowUtil.firePageEvent("szpark_personal_space.html", "showAddMenu", {
						photoAlbumInfo: photoAlbumInfo
					});
				} else {
					window.parent.showAddMenu(photoAlbumInfo);
				}
			}
		};

		// 成功回调
		var successCallbackFunc = function(response, isPullDown) {
			if(isPullDown) {
				//console.log("成功请求数据：" + JSON.stringify(response));
				var appendAlbum = '<li id="append-album" class="photolist add-photoAlbum"><a><span class="mui-icon mui-icon-plusempty"></span></a><div class="addText">新建相册</div></li>';
				Zepto('#listdata').prepend(appendAlbum);
			}
			initOnClickOrTapListenerEvent();
		};
		/*
		 * @description 初始化下拉刷新控件
		 */
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
				//accepts: {
				//	json: "application/json;charset=utf-8"
				//},
				contentType: "application/json",
				headers: {
					"X-SecretKey": secretKey
				}
			}
		});
	};

	//确认按钮
	Zepto('.confirm-btn').on('tap', function() {
		photoAlbumName = Zepto('.photo-name').find('input').val();
		photoAlbumDescribe = Zepto('.photo-describe').find('input').val();
		//console.log(photoAlbumDescribe);
		if(photoAlbumName == '') {
			mui.alert('亲，还没有相册名称哦');
		} else {
			if(titleTag == "修改相册") {
				//console.log("相册操作类型：" + titleTag);
				editAlbumInfo(photoAlbumId, photoAlbumName, photoAlbumDescribe, ispublic);
			} else if(titleTag == "添加相册") {
				//console.log("相册操作类型：" + titleTag);
				addAlbum();
			}

		}

	});

	/**
	 * @description 添加相册详情数据
	 */
	function addAlbum() {
		//var url = config.MockServerUrl + 'mobile/space/album/appendAlbum';
		var url = config.JServerUrl + 'mobile/space/album/appendAlbum';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			userName: userName,
			status: ispublic, //状态：0：私密 1：公开 
			introduce: photoAlbumDescribe,
			name: photoAlbumName
		};
		requestData.para = data;
		//console.log("添加相册是否公开(0不公开，1公开)" + ispublic);
		requestData = JSON.stringify(requestData.para);
		//console.log("新建相册参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			//console.log(JSON.stringify(response));
			if(response.code == '1') {
				mui.alert('相册已添加', function() {
					resetDefault();
					CustomDialogUtil.hideCustomDialog('add-photo'); //隐藏自定义对话框
				});
				WindowUtil.firePageEvent("szpark_newPhoto_album_list.html", "refreshListPage");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	//删除相册
	function deleteAlbum(photoAlbumId) {
		//var url = config.MockServerUrl + 'mobile/space/album/deletePhotoAlbum';
		var url = config.JServerUrl + 'mobile/space/album/deletePhotoAlbum';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			albumId: photoAlbumId
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData.para);
		CommonUtil.ajax(url, requestData, function(response) {
			WindowUtil.firePageEvent("szpark_newPhoto_album_list.html", "refreshListPage");
			UIUtil.toast("删除成功！");
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	//修改相册
	function editAlbumInfo(photoAlbumId, photoAlbumName, photoAlbumDescribe, ispublic) {
		//var url = config.MockServerUrl + 'mobile/space/album/revisephotoAlbum';
		var url = config.JServerUrl + 'mobile/space/album/revisephotoAlbum';
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			//userName: userName,
			status: ispublic, //状态：0：私密 1：公开 
			introduce: photoAlbumDescribe,
			name: photoAlbumName,
			albumId: photoAlbumId,
		};
		requestData.para = data;
		//console.log("修改相册是否公开(0不公开，1公开)" + ispublic);
		requestData = JSON.stringify(requestData.para);
		console.log("修改相册" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			console.log("修改相册：" + JSON.stringify(response));
			if(response.code == '1') {
				mui.alert(response.description, function() {
					resetDefault();
					CustomDialogUtil.hideCustomDialog('add-photo'); //隐藏自定义对话框
				});
				//刷新
				WindowUtil.firePageEvent("szpark_newPhoto_album_list.html", "refreshListPage");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	//置空操作
	function resetDefault() {
		//清空相册名称和相册描述输入内容
		Zepto('.photo-name,.photo-describe').find('input').val('');
		Zepto('.wrong-choice').addClass('choice-active').siblings().removeClass('choice-active');
		ispublic = 0;
	};
});