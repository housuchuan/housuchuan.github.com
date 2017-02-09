/**
 * 描述 :我的笔记详情列表 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-08-09 16:35:41
 */

define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var WindowUtil = require('core/MobileFrame/WindowUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var PullrefreshUtil = require('core/MobileFrame/PullrefreshUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var DeviceUtil = require('core/MobileFrame/DeviceUtil.js');
	//var url = config.MockServerUrl + 'mystudy/myNoteDetailList';
	var url = config.JServerUrl + 'mystudy/myNoteDetailList';
	var noteType = null; //0代表视频，1代表文档
	var PageSize = 10;
	var secretKey = '';
	//var secretKey = config.secretKey
	var userId;
	var userName;
	var totalNumCount = 0;
	var litemplate = null;
	var noteId;
	var searchValue = null;
	var title;
	var deleteItem;
	var pullToRefreshObject;
	var columnId = null; //点击的父页面栏目id
	var noteCount = null;
	var textareaContent = '';
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//加载基础信息
		secretKey = StorageUtil.getStorageItem("secretKey");
		var userSession = StorageUtil.getStorageItem("UserSession") || {};
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			}
			if(userSession.userName) {
				userName = userSession.userName;
			};
		}
		var extraData = JSON.parse(WindowUtil.getExtraDataByKey('extraData'));
		//console.log("extraData::::"+extraData);
		//console.log("xxxxxxx"+extraData.userId);
		noteType = extraData.noteType;
		columnId = extraData.columnId;
		noteCount = extraData.noteCount;
		//关键字搜索
		Zepto('input[type=search]').on('input', function() {
			searchValue = Zepto('input[type=search]').val();
			pullToRefreshObject.refresh();
		});
		//初始化下拉刷新列表
		pullRefreshList();
	}

	function pullRefreshList() {
		//获取模板
		var getLitemplate = function() {
			if(noteType == 0) {
				litemplate = '<li id="{{noteId}}" class="note-items"><span class="courseGuid" id="{{courseGuid}}"></span><div class="timer-icon"></div><div class="play-record">{{playRecord}}</div><p>{{noteContent}}</p><div class="li-bottomItems mui-clearfix"><div>{{noteTime}}</div><div class="note-operation"><span class="edit"><img src="../../img/mystudy/img_editIcon.png"/><span>编辑</span></span><span class="delete"><img src="../../img/mystudy/img_deleteIcon.png"/><span>删除</span></span></div></div></li>';
			} else if(noteType == 1) {
				//				litemplate = '<li id="{{noteId}}" class="articleNote-items"><p>{{noteContent}}</p><div class="li-bottomItems mui-clearfix"><div>{{noteTime}}</div><div class="note-operation"><span class="edit"><img src="../../img/mystudy/img_editIcon.png"/><span>编辑</span></span><span class="delete"><img src="../../img/mystudy/img_deleteIcon.png"/><span>删除</span></span></div></div></li>';
				litemplate = '<li id="{{noteId}}" class="articleNote-items"><span class="courseGuid" id="{{courseGuid}}"></span><p>{{noteContent}}</p><div class="li-bottomItems mui-clearfix"><div class="note-operation"><span class="edit"><img src="../../img/mystudy/img_editIcon.png"/><span>编辑</span></span><span class="delete"><img src="../../img/mystudy/img_deleteIcon.png"/><span>删除</span></span></div></div></li>';
			}
			return litemplate;
		};

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
				searchValue: Zepto('input[type=search]').val(),
				userId: userId,
				sourceId: columnId,
				noteType: noteType
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
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				totalNumCount = totalNumCount;
				tempArray = response.data;
				mui.each(tempArray, function(key, value) {
					value.noteContent = unescape(value.noteContent);
				});
			}
			return tempArray;
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			totalNumCount = noteCount;
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response, isPullDown) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			if(isPullDown) {
				if(noteType == 0) {
					var timeLine = '<li class="time-line"></li>';
					Zepto('.selection-items').prepend(timeLine);
				}
			}
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			noteId = this.id;
			var _this = null;
			title = Zepto(e.target).parent('span').hasClass('edit');
			deleteItem = Zepto(e.target).parent('span').hasClass('delete');
			var courseGuid = Zepto(this).find('.courseGuid').attr('id');
			if(title) {
				var text = Zepto(this).find('p').text();
				Zepto('textarea').val('');
				Zepto('textarea').val(text);
				Zepto('.editBox').css('display', 'block');
				Zepto('.zhezhao-area').css('display', 'block');
			} else if(deleteItem) {
				_this = this;
				var dataList = {
					userId: userId,
					noteType: noteType,
					noteId: noteId,
					noteContent: '',
					//columnId: columnId,
					type: 1
				}
				noteDeleteOrEditData(_this, dataList);
			} else {
				if(DeviceUtil.tablet()) {
					WindowUtil.createWin("resource_center_view_video_pad.html", "../html_pad/resourceCenter/resource_center_view_video_pad.html", {
						itemsId: courseGuid,
						type: 0
					});
				} else if(DeviceUtil.mobile()) {
					WindowUtil.createWin("resource_center_view_video.html", "../resourceCenter/resource_center_view_video.html", {
						itemsId: courseGuid,
						type: 0
					});
				};
			}
		};

		/*
		 * @description 初始化下拉刷新控件
		 */
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: url,
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
		}, function(pullToRefresh) {
			// console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	};

	//编辑（保存）信息
	Zepto('.save').on('tap', function() {
		var dataList1 = {
			userId: userId,
			noteType: noteType,
			noteId: noteId,
			//columnId: columnId,
			noteContent: Zepto('textarea').val(),
			type: 0
		};
		var textareaContent = Zepto('textarea').val();
		if(textareaContent == '' || textareaContent == null) {
			UIUtil.toast('请编辑');
		} else {
			noteDeleteOrEditData(null, dataList1);
		}
	});

	Zepto('.cancel').on('tap', function() {
		Zepto('textarea').val('');
		Zepto('.editBox').css('display', 'none');
		Zepto('.zhezhao-area').css('display', 'none');
	});

	Zepto('.mui-icon-clear').on('tap', function() {
		pullToRefreshObject.refresh();
	});

	/**
	 * @description 删除或者编辑笔记数据
	 */
	function noteDeleteOrEditData(_this, dataList) {
		//var url = config.MockServerUrl + 'mystudy/myNoteItemEditOrDelete';
		var url = config.JServerUrl + 'mystudy/myNoteItemEditOrDelete';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = dataList;
		requestData = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxxxxxxxxxxxx" + requestData);
		CommonUtil.ajax(url, requestData, function(response) {
			var response = CommonUtil.handleStandardResponse(response, '0');
			if(response.code == 1) {
				//console.log("xxx" + JSON.stringify(response));
				if(deleteItem) {
					//_this.remove();
					pullToRefreshObject.refresh();
					UIUtil.toast(response.description);
				} else if(title) {
					pullToRefreshObject.refresh();
					Zepto('textarea').val('');
					Zepto('.editBox').css('display', 'none');
					Zepto('.zhezhao-area').css('display', 'none');
					UIUtil.toast(response.description);
				}
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

});