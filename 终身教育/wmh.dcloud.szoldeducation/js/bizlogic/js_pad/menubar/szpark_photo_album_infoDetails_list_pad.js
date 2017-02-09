/**
 * 描述 :相册详情列表 
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-09-01 10:44:56
 */

define(function(require, exports, module) {
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var UpLoadUtil = require('core/MobileFrame/UpLoadUtil.js');
	var UploadH5Tools = require('core/MobileFrame/UpLoadH5Util.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var btnText;
	var pullToRefreshObject;
	var photoAlbumId;
	var albumName;
	var photoAlbumPhotoNum;
	var totalNumCount = 0;
	var PageSize = 10;
	var delCount = 0;
	var secretKey = "";
	var userId = "";
	var photoAlbumInfoDataBody = '';
	//初始化
	CommonUtil.initReady(initData);

	function initData() {
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		if(userSession.userId) {
			userId = userSession.userId;
		};
		var photoAlbumInfo = JSON.parse(WindowUtil.getExtraDataByKey("photoAlbumInfo")) || {};
		if(photoAlbumInfo){
			photoAlbumId = photoAlbumInfo.photoAlbumId;
			var name = photoAlbumInfo.photoAlbumName;
			var num = photoAlbumInfo.photoAlbumPhotoNum;
			Zepto('.photoNum').text(num + '张');
			Zepto('#photoAlbumName').text(name);
		};
		//初始化相册列表
		initPullRefresh();
		//初始化下拉刷新
		setFilesSelect();
	};

	function initPullRefresh() {
		var getData = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				userId: userId,
				photoAlbumId: photoAlbumId
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('请求参数' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			//console.log("相册下的照片返回数据：" + JSON.stringify(response));
			if(response.code == 1) {
				console.log("相册下的照片返回数据：" + JSON.stringify(response));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				mui.each(tempArray, function(key, value) {
					if(value.photoImage || value.photoImage == 'img is not define') {
						value.photoImage = '../../img/homepage/img_news1.jpg';
					}
				});
			}
			return tempArray;
		};
		//映射模板
		var getLitemplate = function() {
			var litemplate = '<li id={{photoId}} class="mui-table-view-cell"><div class="chooseIcon"></div><img src={{photoImage}} data-preview-src={{photoImage}} data-preview-group="1" /><span class="photoTitle mui-ellipsis">{{photoName}}</span></li>';
			return litemplate;
		};

		//获取接口地址
		var getUrl = function() {
			//var url = config.MockServerUrl + 'mobile/space/album/photoAlbumInfoList';
			var url = config.JServerUrl + 'mobile/space/album/photoAlbumInfoList';
			//console.log('url:' + url);
			return url;
		};
		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {

		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			//图片预览
			mui.previewImage();
			if(response && Array.isArray(response)) {
				//上传成功，刷新照片数
				Zepto('.photoNum').text(response.length + '张');
			}
		};

		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataFunc,
				itemClickCallback: onItemClickCallbackFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc,
				ajaxSetting: {
					//默认的contentType
					contentType: "application/json",
					headers: {
						"X-SecretKey": secretKey
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type0'
		});
	};

	//照片管理按钮
	Zepto('.manage-btn').on('tap', function() {
		var _this = Zepto(this),
			_photoList = Zepto('.photoList').find('.chooseIcon');
		btnText = _this.text()
		if(btnText == '管理') {
			_this.parents().find('.chooseIcon,.deleteOperate').css('display', 'block');
			_this.text('取消');
			isChoose();
			allSelected();
		} else if(btnText == '取消') {
			_this.parents().find('.chooseIcon,.deleteOperate').css('display', 'none');
			_this.text('管理');
			isChoose();
			_photoList.removeClass('chooseIcon-active');
		}
	});

	//照片是否选中
	function isChoose() {
		Zepto('.photoList').on('tap', 'li', function() {
			var _this = Zepto(this).find('.chooseIcon');
			if(_this.hasClass('chooseIcon-active')) {
				_this.removeClass('chooseIcon-active');
			} else {
				_this.addClass('chooseIcon-active');
			}
		})
	};

	//全选按钮
	function allSelected() {
		Zepto('.allSelected').on('tap', function() {
			if("全选" == Zepto(".allSelected").text()) {
				Zepto(this).parents().find('.chooseIcon').addClass('chooseIcon-active');
				Zepto(".allSelected").text("全不选")
			} else {
				Zepto(this).parents().find('.chooseIcon').removeClass('chooseIcon-active');
				Zepto(".allSelected").text("全选")
			}
		});
	};

	/**
	 *@description删除照片 
	 */
	Zepto('.delete').on('tap', function() {
		var idArray = [];
		var idStringArray = "";
		var _this = Zepto('.photoList').find('div');
		for(var i = 0; i < _this.length; i++) {
			if(Zepto(_this[i]).hasClass("chooseIcon-active")) {
				delCount++;
				//Zepto(_this[i]).parents('li').remove();
				idArray.push(Zepto(_this[i]).parents('li').attr("id"));
			}
		}
		for(var i = 0; i < idArray.length; i++) {
			idStringArray += idArray[i] + ';';
		};
		//idStringArray = '"'+idStringArray+'"';
		idStringArray = idStringArray.substr(0, idStringArray.length - 1);
		//console.log("xxxxxxxxxxxxxxx"+idStringArray);
		//console.log("xxxxxxxxxxxxxxx"+idStringArray.length);
		//请求删除接口
		AjaxDeletePhoto(idStringArray);
	});

	//删除相册
	function AjaxDeletePhoto(idStringArray) {
		//var url = config.MockServerUrl + 'mobile/space/album/deletePhotoAlbumBtn';
		var url = config.JServerUrl + 'mobile/space/album/deletePhotoAlbumBtn';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			//userId: userId,
			albumId: photoAlbumId, //父页面传过来
			noteList: idStringArray
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("删除照片的请求参数" + requestData);
		console.log("删除照片的url" + url);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == '1') {
				Zepto('.photoNum').text((totalNumCount - delCount) + "张");
				//刷新列表
				WindowUtil.firePageEvent("szpark_photo_album_infoDetails_list.html", "refreshListPage");
				//快速回滚到该区域顶部
				mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
				UIUtil.toast(response.description);
				Zepto('.manage-btn').text('管理');
				var _this = Zepto('.manage-btn');
				_photoList = Zepto('.photoList').find('.chooseIcon');
				_this.parents().find('.chooseIcon,.deleteOperate').css('display', 'none');
				isChoose();
				_photoList.removeClass('chooseIcon-active');
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};
	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		var imgArray = [];
		//设置文件选择为图片选择
		FileUtil.setSelectImgsFromDisks('#chooseImgFromGalleryFile', function(b64, file) {
			//添加图片
			//console.log('JSON'+JSON.stringify(file));
			imgArray.push({
				name: file.name,
				file: file
			});
			//console.log("选择:" + b64);
			//添加预览
			//Zepto("#addImage").attr('src', b64);
			UpLoadImage(imgArray);
		}, {
			isMulti: false
		});
	};

	//上传照片
	function UpLoadImage(imgArray) {
		//console.log("选择照片：" + JSON.stringify(imgArray));
		//var attachUrl = config.MockServerUrl + 'mobile/space/album/uploadPhotoBtn';
		var url = config.JServerUrl + 'mobile/space/album/uploadPhotoBtn';
		var requestData = {};
		var data = {
			pictureId: StringUtil.getGuidGenerator(), //照片id
			name: imgArray[0].name, //照片名称
			albumId: photoAlbumId, //相册
		}
		requestData = JSON.stringify(data);
		//console.log("逻辑参数：" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			//console.log("返回数据：" + JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, 0);
			if(response.code == 1) {
				WindowUtil.firePageEvent("szpark_photo_album_infoDetails_list.html", "refreshListPage");
				mui.toast("照片上传成功！");
			}
		}, function(e) {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
		//		UploadH5Tools.upLoadFiles({
		//			url: attachUrl,
		//			data: {
		//				//userId: userId
		//				pictureId: StringUtil.getGuidGenerator(), //照片id
		//				photoAlbumId: photoAlbumId //父页面传过来
		//					//photoId: idArray				//请求参数
		//			},
		//			files: imgArray,
		//			beforeUploadCallback: function() {
		//				//console.log("准备上传");
		//			},
		//			successCallback: function(response, detail) {
		//				//console.log("上传成功:" + JSON.stringify(response));
		//				mui.alert('上传成功');
		//				//刷新列表
		//				WindowUtil.firePageEvent("szpark_photo_album_infoDetails_list.html", "refreshListPage");
		//				//console.log("detail:" + detail);
		//			},
		//			errorCallback: function(msg, detail) {
		//				//console.log("上传失败:" + msg);
		//				//console.log("detail:" + detail);
		//			},
		//			uploadingCallback: function(percent, msg, speed) {
		//				//console.log("上传中:" + percent + ',msg:' + msg + ',speed:' + speed);
		//			}
		//		});
	};
});