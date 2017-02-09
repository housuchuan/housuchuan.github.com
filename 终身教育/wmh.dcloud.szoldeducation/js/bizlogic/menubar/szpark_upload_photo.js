/**
 * 描述 :选择上传照片页面
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-06-28 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var common_initActionSheetUtil = require('bizlogic/common/common_initActionSheetUtil.js');
	var ImageUtil = require('core/MobileFrame/ImageUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	//	var photoName = "请选择相册";
	CommonUtil.initReady(function() {
		//代码初始化
		initOnClickOrTapListenerEvent();
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
		mui('.mui-scroll-wrapper').scroll();
		mui('body').on('shown', '.mui-popover', function(e) {
			//console.log('shown', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
			//console.log('hidden', e.detail.id);//detail为当前popover元素
		});
	});
	/**
	 * 初始化监听事件
	 */
	function initOnClickOrTapListenerEvent() {
		//		var photoName = WindowUtil.getExtraDataByKey("photoName");
		//		Zepto(".photo-name").text(photoName);
		Zepto('.photolist').on('tap', 'li', function() {
				var photoTitle = Zepto(this).find('a').text();
				Zepto('.photo-name').text(photoTitle);
				mui('#middlePopover').popover('toggle');
			})
			//非PLUS状态下，获取相册名称
		if(CommonUtil.os.plus) {
			Zepto(".default-plus-selectphoto").show();
			Zepto(".default-Noplus-selectphoto").hide();
		} else {
			Zepto(".default-plus-selectphoto").hide();
			Zepto(".default-Noplus-selectphoto").show();
		}
		//plus下显示拍照和相册
		common_initActionSheetUtil.initActionSheet(function(selectedStr) {
			if(selectedStr == "拍照") {
				//TODO 拍照代码
				ImageUtil.ImageSelectFactory.SelectCompressImgFromCamera(function(path) {
					//console.log('摄像图片路径:' + path);
				}, function() {
					//console.log("从摄像中拍照失败！");
				}, {

				});
			} else if(selectedStr == "相册") {
				//TODO 从相册中选择
				ImageUtil.ImageSelectFactory.SelectCompressImgFromGallery(function(files) {
					//console.log('图库图片路径:' + JSON.stringify(files));
				}, function() {
					//console.log("从图库中选择照片失败！");
				}, {
					multiple: true
				});

			}
		});

		//选择属于的相册
		//		Zepto("#selectGallery").on("tap", function() {
		//			WindowUtil.createWin("szpark_upload_specific.html", "szpark_upload_specific.html");
		//		});
	}
	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		var imgArray = [];
		//设置文件选择为图片选择
		FileUtil.setSelectImgsFromDisks('#chooseImgFromGalleryFile', function(b64, file) {
			//console.log("选择:" + JSON.stringify(file));
			//添加图片
			imgArray.push({
				name: 'fileImage' + imgArray.length,
				file: file
			});
			//添加预览
			//appendImg(b64);
		}, {
			isMulti: true
		});
	}
});