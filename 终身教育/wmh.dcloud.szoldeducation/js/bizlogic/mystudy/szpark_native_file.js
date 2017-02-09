/**
 * 描述 :本机文件交互 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-06-27 11:42:49
 */

define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var FileUtil = require('core/MobileFrame/FileUtil.js');
	var UploadH5Tools = require('core/MobileFrame/UpLoadH5Util.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var status = 0; //0:不公开   1：公开
	var videoArray = [];
	var allSize = 0;
	var tt1 = [];
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		};
		//初始化情况视频列表
		Zepto('.video-wrapper').html('');
		//初始化视频选择控件
		setFilesSelect();
	};

	//手机视频点击箭头转换
	Zepto('.mobile-video').on('tap', function() {
		var _this = Zepto(".arrow");
		if(_this.hasClass('arrow-before')) {
			_this.removeClass('arrow-before');
			_this.addClass('arrow-change');
			Zepto('.video-wrapper').css('display', 'none');
		} else {
			_this.removeClass('arrow-change');
			_this.addClass('arrow-before');
			Zepto('.video-wrapper').css('display', 'block');
		}
	});

	//点击取消
	Zepto('.cancel').on('tap', function() {
		Zepto(".pitch").removeClass('pitch-active');
		Zepto('.upload').css('display', 'none');
	});

	//是否公开
	Zepto('.whether-public').on('tap', 'div', function() {
		Zepto(this).addClass('choice-active').siblings().removeClass('choice-active');
		if(Zepto(this).hasClass('wrong-choice')) {
			status = 0;
		} else if(Zepto(this).hasClass('true-choice')) {
			status = 1;
		}
	});

	//手机视频内容选择
	Zepto('.mui-table-view').on('tap', '.video-resource .pitch-on', function() {
		var _this = Zepto(this);
		_this.parents('li').remove();
		var _this2 = _this.parents('li').find('.eachFileSize');
		if(Array.isArray(_this2)) {
			mui.each(_this2, function(key, value) {
				allSize -= parseFloat((Zepto(value).text()).substring(0, Zepto(value).text().length - 1));
			});
			Zepto('.fileSize').html('');
			Zepto('.fileSize').html('已选' + allSize + 'M');
		} else {
			Zepto('.fileSize').html('');
			Zepto('.fileSize').html('已选' + _this.text());
		};
		var title = _this.parents('li').find('.video-info span:first-child').text();
		//console.log("xxxxxxxxxx"+title);
		for(var i = 0; i < videoArray.length; i++) {
			//console.log("xxxxxx"+videoArray[i].name);
			//删除数组中存在这个名字的视频
			if(videoArray[i].name === title) {
				//console.log('1111111111'+i);
				videoArray.splice(i, 1);
				tt1 = videoArray;
			}
		}
	});

	//视频上传
	Zepto('.videoSubmit').on('tap', function() {
		var textList = [];
		var ret = [];
		var tt = [];
		tt1 = [];
		if(!Zepto('.video-wrapper').html()) {
			mui.alert('请选择视频');
		} else {
			var _this = Zepto('.video-wrapper').children('li');
			if(_this) {
				if(Array.isArray(_this)) {
					//将每个视频名称放到数组textList中
					for(var i = 0; i < _this.length; i++) {
						var text = Zepto(_this[i]).find('.video-info span:first-child').text();
						textList.push(text);
					}
				};
				for(var i = 0; i < textList.length; i++) {
					//筛选重复视频，将单个视频放在数组ret中
					if(ret.indexOf(textList[i]) === -1) {
						ret.push(textList[i]);
						tt.push(i);
					} else {
						UIUtil.toast('系统已自动筛选过重复视频');
						Zepto('.video-wrapper').children('li').eq(i).css('height', '0').css('padding', '0');
						//console.log("xxxxxx"+allSize);
						allSize -= parseFloat((Zepto('.video-wrapper li').eq(i).find('.eachFileSize').text()).substring(0, Zepto('.video-wrapper li').eq(i).find('.eachFileSize').text().length - 1));
						Zepto('.fileSize').html('');
						Zepto('.fileSize').html('已选' + allSize + 'M');
					}
				};
			};
			//根据需求将原视频数组按照标号筛选到新数组tt1中
			for(var i = 0; i < tt.length; i++) {
				var ss = tt[i];
				tt1.push(videoArray[ss]);
			};
			console.log("xxxxxxxx" + tt1);
			//for (var i = 0; i < tt1.length; i++) {
			//		console.log("xxxxxxxxxxxx"+tt1[i].name);
			//	}
			//完成对tt1数组的上传
			UpLoadImage(tt1);
			Zepto('.video-wrapper').html('');
			Zepto('.fileSize').html('已上传' + allSize + 'M');
			tt1 = [];
			//console.log("xxxxx"+tt1);
		}
	});

	/**
	 * @description 设置文件选择
	 */
	function setFilesSelect() {
		//设置文件选择为图片选择
		FileUtil.setSelectFilesFromDisks('#chooseImgFromGalleryFile', function(bitStr, file) {
			//添加视频文件;bitStr二进制流文件；file文件对象
			videoArray.push({
				name: file.name,
				file: file
			});
			//遍历映射模板
			appendVideoLitemp(file);
			//文件上传
			//UpLoadImage(videoArray);
		}, {
			isMulti: true
		});
	}

	function appendVideoLitemp(file) {
		//这里面写选择的视频文件列表
		var litemplate = '';
		litemplate = '<li class="mui-table-view-cell video-resource mui-clearfix"><div class="pitch pitch-on"></div><img src="../../img/mystudy/img-nativephoto.jpg"/><div class="video-info"><span>' + file.name + '</span><br/><span class="eachFileSize">' + parseFloat((file.size / 1024 / 1024).toFixed(2)) + 'M' + '</span><br/><span>' + file.lastModifiedDate + '</span></div></li>';
		Zepto('.video-wrapper').append(litemplate);
		var _this1 = Zepto('.eachFileSize');
		//console.log("xxxxxxxxxxxxxxxx"+_this1);
		if(Array.isArray(_this1)) {
			allSize = 0;
			mui.each(_this1, function(key, value) {
				//console.log("xxxxxxxxxx" + value);
				allSize += parseFloat((Zepto(value).text()).substring(0, Zepto(value).text().length - 1));
			});
			Zepto('.fileSize').html('');
			Zepto('.fileSize').html('已选' + allSize + 'M');
		} else {
			Zepto('.fileSize').html('');
			Zepto('.fileSize').html('已选' + _this.text());
		};
	};

	//上传照片
	function UpLoadImage(videoArrayList) {
		//console.log("xxxxxxxxxxxx" + videoArrayList);
		var attachUrl = config.JServerUrl + 'mystudy/myMovieUpload';
		UploadH5Tools.upLoadFiles({
			url: attachUrl,
			data: {
				//请求参数
				userId: userId,
				userName: userName,
				status: status
			},
			files: videoArrayList,
			beforeUploadCallback: function() {
				//console.log("准备上传");
			},
			successCallback: function(response, detail) {
				console.log("上传成功:" + JSON.stringify(response));
				mui.alert('上传成功');
				//console.log("detail:" + detail);
			},
			errorCallback: function(msg, detail) {
				console.log("上传失败:" + msg);
				//console.log("detail:" + detail);
			},
			uploadingCallback: function(percent, msg, speed) {
				//console.log("上传中:" + percent + ',msg:' + msg + ',speed:' + speed);
			}
		});
	}
});