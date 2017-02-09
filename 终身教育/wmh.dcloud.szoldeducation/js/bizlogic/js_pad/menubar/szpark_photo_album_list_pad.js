/**
 * 描述 :相册子页面交互 (pad版本)
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-28 13:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var CustomDialogUtil = require('core/MobileFrame/CustomDialogUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var ImageLoaderFactory=require('core/MobileFrame/ImageLoaderFactory.js');
	var photoAlbumId;
	var photoAlbumName;
	var photoAlbumDescribe;
	var titleTag = '';
	var ispublic = 0;
	//每页显示条数
	var PageSize = 10;
	//列表总记录数
	var totalNumCount = 0;
	var secretKey = "";
	var userId = "";
	var userName = "";
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
		//初始化相册列表
		initPullRefreshPhotoList();
	});

	function initPullRefreshPhotoList() {
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
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

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			console.log("改变数据 ：" + JSON.stringify(response));
			if(response.code == '1') {
				totalNumCount = response.totalCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					if(!value.photoAlbumImage || value.photoAlbumImage == "img is not define") {
						value.photoAlbumImage = '../../../img/MobileFrame/img_error.jpg';
					} else {
						value.photoAlbumImage = unescape(value.photoAlbumImage);
					};
					value.photoAlbumName = unescape(value.photoAlbumName);
					value.introduce = unescape(value.introduce);
				});
			}
			return tempArray;
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function(response) {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};
		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
		};

		var getLitempate = function() {
			var litemplate = '<li id={{photoAlbumId}} class="mui-table-view-cell photolist"><div class="photo-background"><img data-img-localcache="{{photoAlbumImage}}" /><span>{{photoAlbumNum}}</span></div><span style="display:none" class="introduce">{{introduce}}</span><div class="photo-operation"><span>{{photoAlbumName}}</span><button class="change update">修改</button><button class="delete">删除</button></div></li>';
			return litemplate;
		};

		var getUrl = function() {
			//var url = config.MockServerUrl + "mobile/space/album/photoAlbumList";
			var url = config.JServerUrl + "mobile/space/album/photoAlbumList";
			return url;
		};
		/**
		 * @description 事项item点击回调
		 * @param {Event} e
		 */
		var onItemClickCallbackFunc = function(e) {
			photoAlbumId = this.id;
			var albumName = Zepto(this).find('.photo-operation span').text(); //相册名称
			var introduce = Zepto(this).find('.introduce').text(); //相册描述
			var photoAlbumInfo = {
				photoAlbumId: photoAlbumId,
				photoAlbumName: Zepto(this).find('.photo-operation span').text(),
				photoAlbumPhotoNum: Zepto(this).find('.photo-background span').text()
			};
			var targetStr = e.target.innerHTML;
			if(targetStr == '修改') {
				titleTag = "修改相册";
				Zepto('.photo-bar').children('span').text('修改相册');
				Zepto('.photo-name').find('input').val(albumName);
				Zepto('.photo-describe').find('#photoDesc').val(introduce);
				//CustomDialogUtil.showCustomDialog('add-photo'); //显示自定义对话框
				Zepto('#zhezhao-area,.add-photo').css('display','block');
			} else if(targetStr == '删除') {
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
				//console.log("bhda"+JSON.stringify(photoAlbumInfo));
				photoAlbumInfo = JSON.stringify(photoAlbumInfo);
				WindowUtil.createWin("szpark_photo_album_infoDetails_list_pad.html", "szpark_photo_album_infoDetails_list_pad.html", {
					photoAlbumInfo: photoAlbumInfo
				});
			}
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
			mGetDataOffLineFunc: null,
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

	//删除相册
	/**
	 * @description 删除相册详情数据
	 */
	function deleteAlbum(photoAlbumId) {
		//var url = config.MockServerUrl + 'personalSpace/deletePhotoAlbum';
		var url = config.JServerUrl + 'mobile/space/album/deletePhotoAlbum';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			albumId: photoAlbumId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			WindowUtil.firePageEvent("szpark_photo_album_list_pad.html", "refreshListPage");
			UIUtil.toast("操作成功！");
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//是否公开
	Zepto('.whether-public').on('tap', 'div', function() {
		Zepto(this).addClass('choice-active').siblings().removeClass('choice-active');
	});

	Zepto('.wrong-choice').on('tap', function() {
		ispublic = 0
	});
	Zepto('.true-choice').on('tap', function() {
		ispublic = 1
	});

	//上传照片
	//	Zepto('.default-plus-selectphoto').on('tap', function() {
	//		WindowUtil.createWin("szpark_upload_photo.html", "szpark_upload_photo.html");
	//	});

	//添加相册
	Zepto('#append-album').on('tap', function() {
		//CustomDialogUtil.showCustomDialog('add-photo'); //显示自定义对话框
		Zepto('#zhezhao-area,.add-photo').css('display','block');
		Zepto('.photo-bar').children('span').text('添加相册');
		titleTag = '添加相册';
	});

	Zepto('.cancel-btn').on('tap', function() {
		//CustomDialogUtil.hideCustomDialog('add-photo'); //显示自定义对话框
		Zepto('#zhezhao-area,.add-photo').css('display','none');
		//还原默认值
		resetDefault();
	});

	Zepto('.confirm-btn').on('tap', function() {
		photoAlbumName = Zepto('#photoName').val();
		photoAlbumDescribe = document.getElementById("photoDesc").value;
		//console.log(photoAlbumDescribe);
		if(photoAlbumName == '') {
			mui.alert('亲，还没有相册名称哦');
		} else {
			if(titleTag == "修改相册") {
				editAlbumInfo(photoAlbumId, photoAlbumName, photoAlbumDescribe, ispublic);
			} else if(titleTag == "添加相册") {
				addAlbum();
			}
		}
	});
	
	//修改相册
	function editAlbumInfo(photoAlbumId, photoAlbumName, photoAlbumDescribe, ispublic) {
		//var url = config.MockServerUrl + 'mobile/space/album/revisephotoAlbum';
		var url = config.JServerUrl + 'mobile/space/album/revisephotoAlbum';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			//userName: userName,
			status: ispublic, //状态：0：私密 1：公开 
			introduce: photoAlbumDescribe,
			name: photoAlbumName,
			albumId: photoAlbumId,
		};
		requestData = data;
		//console.log("修改相册是否公开(0不公开，1公开)" + ispublic);
		requestData = JSON.stringify(requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == '1') {
				mui.alert(response.description, function() {
					//CustomDialogUtil.hideCustomDialog('add-photo'); //隐藏自定义对话框
					Zepto('#zhezhao-area,.add-photo').css('display','none');
					resetDefault();
				});
				//刷新
				WindowUtil.firePageEvent("szpark_photo_album_list_pad.html", "refreshListPage");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 添加相册详情数据
	 */
	function addAlbum() {
		//var url = config.MockServerUrl + 'mobile/space/album/appendAlbum';
		var url = config.JServerUrl + 'mobile/space/album/appendAlbum';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			userId: userId,
			userName: userName,
			status: ispublic, //状态：0：私密 1：公开 
			introduce: photoAlbumDescribe,
			name: photoAlbumName
		};
		requestData = data;
		//console.log("添加相册是否公开(0不公开，1公开)" + ispublic);
		console.log("url" + url);
		requestData = JSON.stringify(requestData);
		console.log("-----------------------" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			console.log("xxxxxxxxxxxx" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				mui.alert('相册已添加', function() {
					//CustomDialogUtil.hideCustomDialog('add-photo'); //隐藏自定义对话框
					Zepto('#zhezhao-area,.add-photo').css('display','none');
					resetDefault();
				});
				WindowUtil.firePageEvent("szpark_photo_album_list_pad.html", "refreshListPage");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//编辑添加还原默认值
	function resetDefault() {
		//置空
		Zepto('#photoName').val(''); //相册名称
		document.getElementById("photoDesc").value = ""; //相册描述
		Zepto('.wrong-choice').addClass('choice-active').siblings().removeClass('choice-active');
		ispublic = 0;
	};

});