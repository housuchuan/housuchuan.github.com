/**
 * 描述 :这个文件暂时使用不到，为了防止删错代码，将冗余的代码放在这里面，后面需要整理（不需要就删除）
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-09-14 19:07:29
 */
/*
 * @Description:预览界面暂时不需要实现评价等功能
 * 
 */
define(function(require, exports, module) {
	"use strict";
	exports.initListener = function() {
		//	//发表评价
		//	Zepto('#clickPraise').on('tap', function() {
		//		Zepto('.zhezhao').css('display', 'block');
		//		Zepto('.overallPraise').css('display', 'block');
		//	});
		//
		//	//取消发表评价
		//	Zepto('.cancel').on('tap', function() {
		//		Zepto('.zhezhao').css('display', 'none');
		//		Zepto('.overallPraise').css('display', 'none');
		//		Zepto('.overallPri div').removeClass('overallPriActive').addClass('overallCommon');
		//	});
		//
		//	//评价星数
		//	Zepto('.overallPri').on('tap', 'div', function() {
		//		var _index = Zepto(this).index();
		//		_index = _index + 1;
		//		//首次点击清空所有点击的评价星数
		//		Zepto('.overallPri div').removeClass('overallPriActive');
		//		for(var i = 0; i < _index; i++) {
		//			Zepto('.overallPri div').eq(i).addClass('overallPriActive');
		//		}
		//	});
		//
		//	//提交评价
		//	Zepto('.submit').on('tap', function() {
		//		var _this = Zepto('.overallPri div');
		//		var array = [];
		//		mui.each(_this, function(key, value) {
		//			if(Zepto(value).hasClass('overallPriActive')) {
		//				array.push(key);
		//			};
		//		});
		//		if(Array.isArray(array)) {
		//			if(array.length) {
		//				appraiseSubmitAjax(array.length);
		//			} else {
		//				UIUtil.toast('亲,请评价');
		//			}
		//		}
		//	});
		//
		//	/**
		//	 * @description 提交评价ajax请求数据
		//	 */
		//	function appraiseSubmitAjax(score) {
		//		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/videoOverallPraise';
		//		var url = config.JServerUrl + 'resourceCenter/mobile/resourceCenter/videoOverallPraise';
		//		var requestData = {};
		//		//requestData.ValidateData = 'validatedata';
		//		var data = {
		//			userId: userId,
		//			userName: userName,
		//			id: id,
		//			score: score
		//		};
		//		requestData = data;
		//		requestData = JSON.stringify(requestData);
		//		//console.log("xxxxxxxxxxxxxxx" + requestData);
		//		CommonUtil.ajax(url, requestData, function(response) {
		//			var response = CommonUtil.handleStandardResponse(response, '0');
		//			if(response.code == 1) {
		//				UIUtil.toast(response.description);
		//				Zepto('.zhezhao').css('display', 'none');
		//				Zepto('.overallPraise').css('display', 'none');
		//				Zepto('.overallPri div').removeClass('overallPriActive').addClass('overallCommon');
		//			}
		//			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		//		}, function() {
		//			UIUtil.toast('网络连接超时！请检查网络...');
		//		}, 1, secretKey, false);
		//	};
		/*
		 * @Description:预览界面暂时不需要实现收藏等功能
		 * 
		 */
		//	//初始化监听是否已经收藏了本视频
		//	function initIsSaveVideo() {
		//		if(IsSave == 0) {
		//			//什么都不做
		//			//console.log("0");
		//		} else if(IsSave == 1) {
		//			//console.log("1");
		//			Zepto('.saveVideo').addClass('saveVideo-active');
		//		}
		//	}
		//
		//	//收藏视频
		//	Zepto('.saveVideo').on('tap', function() {
		//		if(LoginUtil.isLoginSystem()) {
		//			var saveType = null;
		//			var _this = Zepto(this);
		//			if(_this.hasClass('saveVideo-active')) {
		//				_this.removeClass('saveVideo-active');
		//				saveType = 0;
		//			} else {
		//				_this.addClass('saveVideo-active');
		//				saveType = 1;
		//			}
		//			ajaxSaveVideo(saveType);
		//		} else {
		//			UIUtil.confirm({
		//				content: '您还没有登录,请先登录!', //您还没有登录,请先登录!
		//				title: '温馨提示',
		//				buttonValue: ['确定', '取消']
		//			}, function(index) {
		//				if(index == 0) {
		//					WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		//					StorageUtil.setStorageItem('TARGET_URL', 'resource_center_preview_video.html');
		//				}
		//			});
		//		}
		//	});
		//
		//	/**
		//	 * @description 收藏视频ajax请求
		//	 */
		//	function ajaxSaveVideo(saveType) {
		//		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		//		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/saveVideo';
		//		//var url = 'http://221.224.167.154:8099/szedu_v1.0.0/resourceCenter/mobile/resourceCenter/saveVideo';
		//		var requestData = {};
		//		//requestData.ValidateData = 'validatedata';
		//		var data = {
		//			type: 0,
		//			id: id,
		//			userId: userId,
		//			userName: userName,
		//			saveType: saveType
		//		};
		//		requestData = data;
		//		requestData = JSON.stringify(requestData);
		//		console.log("requestData" + requestData);
		//		//console.log("url"+url);
		//		CommonUtil.ajax(url, requestData, function(response) {
		//			var response = CommonUtil.handleStandardResponse(response, '0');
		//			if(response.code == 1) {
		//				UIUtil.toast(response.description);
		//				if(reFreshType === 3) {
		//					WindowUtil.firePageEvent('resource_center_course_info.html', 'refreshParentPage');
		//				} else if(reFreshType === 1) {
		//					WindowUtil.firePageEvent('resource_center_search.html', 'refreshSearchParentPage');
		//				} else if(reFreshType === 2) {
		//					WindowUtil.firePageEvent('szpark_my_study.html', 'refreshStudyPage');
		//				}
		//			}
		//			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		//		}, function() {
		//			UIUtil.toast('网络连接超时！请检查网络...');
		//		}, 1, secretKey, false);
		//	};
	}
});