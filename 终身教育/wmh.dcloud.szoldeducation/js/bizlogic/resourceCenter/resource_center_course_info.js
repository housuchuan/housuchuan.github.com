/**
 *	作者:朱晓琪
 *	时间:2016-06-28
 *	描述:资源中心index
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	var UIUtil = require('core/MobileFrame/UIUtil.js');
	var StorageUtil = require('core/MobileFrame/StorageUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var Tools = require('bizlogic/resourceCenter/resource_center_common_util.js');
	var PullToRefreshTools2 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var PullToRefreshTools3 = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var StringUtil = require('core/MobileFrame/StringUtil.js');
	var ImageLoaderFactory = require('core/MobileFrame/ImageLoaderFactory.js');
	var LoginUtil = require('bizlogic/common/LoginUtil.js');
	//	var data;
	var PageSize = 10;
	var itemsId = null;
	var ClassifyId = null;
	var type = null;
	var ClassifyText = null;
	var courseKind = 2; //0：视频    1：文档    2：所有
	var secretKey = "";
	//var IsSave = 0; //是否已经收藏过，0未收藏，1已收藏
	//var secretKey = config.secretKey;
	var userId = "";
	var userName = "";
	var totalNumCount = 0;
	var totalNumCount2 = 0;
	var totalNumCount3 = 0;
	var pullToRefreshObject;
	var pullToRefreshObject2;
	var pullToRefreshObject3;
	var iconClolor = '',
		courseNameTitleText = '';
	var ServerUrl = config.JServerUrl;
	var userSession;
	CommonUtil.initReady(function() {
		mui('.kindWrapper').scroll();
		mui('body').on('shown', '.mui-popover', function(e) {
			//console.log('shown', e.detail.id);//detail为当前popover元素
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
			//console.log('hidden', e.detail.id);//detail为当前popover元素
		});
		//console.log("跳转后" + WindowUtil.getExtraDataByKey('data'));
		var translatData = JSON.parse(WindowUtil.getExtraDataByKey('data')) || {};
		if(translatData.ClassifyId) {
			ClassifyId = translatData.ClassifyId;
		} else {
			ClassifyId = null;
		};
		if(translatData.secondLevelText) {
			ClassifyText = translatData.secondLevelText;
		} else {
			ClassifyText = null;
		};
		if(translatData.bgColor) {
			iconClolor = translatData.bgColor;
		};
		type = translatData.type;
		secretKey = StorageUtil.getStorageItem("secretKey");
		userSession = StorageUtil.getStorageItem("UserSession");
		//console.log("用户信息：" + JSON.stringify(userSession));
		if(type == 1) {
			Zepto('.mui-pull-right').css('display', 'none');
		};
		if(userSession) {
			if(userSession.userId) {
				userId = userSession.userId;
			};
			if(userSession.userName) {
				userName = userSession.userName;
			};
		}
		lessonDetailData(ClassifyId);
		//初始化下拉刷新模块
		initPullDownRefresh();
		//console.log("iconColor"+iconClolor);
	});

	/**
	 * @description 一级分类下的二级分类列表数据
	 */
	function lessonDetailData(ClassifyId) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getCourseListByClassifyID';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getCourseListByClassifyID';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: type,
			id: ClassifyId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		//console.log(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			//console.log("一级分类下的二级分类:"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var tempInfo = response.data;
				//console.log("sssssss"+JSON.stringify(tempInfo));
				var output = Tools.generateBliveHtml(tempInfo);
				Zepto('#topItem').html('');
				Zepto('#topItem').append(output);
				//类别弹出框操作
				if(type == 0) {
					Zepto('.mui-pull-right').css('display', 'block');
					Zepto('.kindSelections').on('tap', 'li', function() {
						var text = Zepto(this).children('a').text();
						Zepto('#menu').text(text);
						//Zepto("#topPopover").hide();
						switch(text) {
							case '所有':
								courseKind = 2;
								break;
							case '文档':
								courseKind = 1;
								break;
							case '视频':
								courseKind = 0;
								break;
							default:
								break;
						};
						pullToRefreshObject.refresh();
						pullToRefreshObject2.refresh();
						pullToRefreshObject3.refresh();
					});
				};
				//一级分类下的二级分类区域滚动
				mui(".classifyList").scroll({
					indicators: true, //是否显示滚动条
					deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				});
				courseNameTitleText = Zepto('.courseNameTitle > span').text();
				Zepto('.courseNameIcon').css('background-color', iconClolor);
				//点击课程类别下的相应课程，跳转到播放页面
				var _this = Zepto('.courseName').find('li');
				var secondClassifyId = '';
				for(var i = 0; i < _this.length; i++) {
					if(ClassifyText == Zepto(_this[i]).children('div').text()) {
						Zepto(_this[i]).children('div').css('color', 'red').css('font-size', '14px');
					};
				};
				Zepto('.courseNameTitle').on('tap', function() {
					secondClassifyId = tempInfo.parentCloumnId;
					getClassifyId(secondClassifyId);
					lessonAchieveDetailData(tempInfo.parentCloumnId);
					pullToRefreshObject.refresh();
					pullToRefreshObject2.refresh();
					pullToRefreshObject3.refresh();
				});
				Zepto('.courseName').on('tap', 'li', function() {
					Zepto(this).children('div').css('color', 'red').css('font-size', '14px');
					Zepto(this).siblings().children('div').css('color', '#000000').css('font-size', '13px');
					secondClassifyId = Zepto(this).attr('id');
					getClassifyId(secondClassifyId);
					pullToRefreshObject.refresh();
					pullToRefreshObject2.refresh();
					pullToRefreshObject3.refresh();
					lessonAchieveDetailData(secondClassifyId);
					//if(Zepto('.item1mobile').hasClass('mui-active')) {
					//pullToRefreshObject.refresh();
					//} else if(Zepto('.item2mobile').hasClass('mui-active')) {
					//pullToRefreshObject2.refresh();
					//} else if(Zepto('.item3mobile').hasClass('mui-active')) {
					//pullToRefreshObject3.refresh();
					//}
				});
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	/**
	 * @description 一级分类下的二级分类列表数据
	 */
	function lessonAchieveDetailData(ClassifyId) {
		//var url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getCourseListByClassifyID';
		var url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getCourseListByClassifyID';
		var requestData = {};
		//requestData.ValidateData = 'validatedata';
		var data = {
			type: type,
			id: ClassifyId
		};
		requestData = data;
		requestData = JSON.stringify(requestData);
		//console.log(url);
		//console.log(requestData);
		UIUtil.showWaiting();
		CommonUtil.ajax(url, requestData, function(response) {
			UIUtil.closeWaiting();
			//console.log("一级分类下的二级分类:"+JSON.stringify(response));
			var response = CommonUtil.handleStandardResponse(response, '2');
			if(response.code == 1) {
				var tempInfo = response.data;
				//console.log("sssssss"+JSON.stringify(tempInfo));
				var output = Tools.generateBliveHtml(tempInfo);
				Zepto('#topItem').html('');
				Zepto('#topItem').append(output);
				//类别弹出框操作
				if(type == 0) {
					Zepto('.kind').css('display', 'block');
					Zepto('.kindSelections').on('tap', 'li', function() {
						var text = Zepto(this).children('a').text();
						Zepto('#menu').text(text);
						//Zepto("#topPopover").hide();
						switch(text) {
							case '所有':
								courseKind = 2;
								break;
							case '文档':
								courseKind = 1;
								break;
							case '视频':
								courseKind = 0;
								break;
							default:
								break;
						};
						pullToRefreshObject.refresh();
						pullToRefreshObject2.refresh();
						pullToRefreshObject3.refresh();
					});
				} else if(type == 1) {
					Zepto('.kind').css('display', 'none');
				};
				//一级分类下的二级分类区域滚动
				mui(".classifyList").scroll({
					indicators: true, //是否显示滚动条
					deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				});
				courseNameTitleText = Zepto('.courseNameTitle > span').text();
				Zepto('.courseNameIcon').css('background-color', iconClolor);
				//点击课程类别下的相应课程，跳转到播放页面
				var _this = Zepto('.courseName').find('li');
				var secondClassifyId = '';
				for(var i = 0; i < _this.length; i++) {
					if(ClassifyText == Zepto(_this[i]).children('div').text()) {
						Zepto(_this[i]).children('div').css('color', 'red').css('font-size', '14px');
					};
				};
				Zepto('.courseNameTitle').on('tap', function() {
					secondClassifyId = tempInfo.parentCloumnId;
					getClassifyId(secondClassifyId);
					lessonDetailData(tempInfo.parentCloumnId);
					pullToRefreshObject.refresh();
					pullToRefreshObject2.refresh();
					pullToRefreshObject3.refresh();
				});
				Zepto('.courseName').on('tap', 'li', function() {
					Zepto(this).children('div').css('color', 'red').css('font-size', '14px');
					Zepto(this).siblings().children('div').css('color', '#000000').css('font-size', '13px');
					secondClassifyId = Zepto(this).attr('id');
					getClassifyId(secondClassifyId);
					pullToRefreshObject.refresh();
					pullToRefreshObject2.refresh();
					pullToRefreshObject3.refresh();
					lessonDetailData(secondClassifyId);
					//if(Zepto('.item1mobile').hasClass('mui-active')) {
					//pullToRefreshObject.refresh();
					//} else if(Zepto('.item2mobile').hasClass('mui-active')) {
					//pullToRefreshObject2.refresh();
					//} else if(Zepto('.item3mobile').hasClass('mui-active')) {
					//pullToRefreshObject3.refresh();
					//}
				});
			}
			//'1'表示ajax传输类型为1，secretKey表示用户信息，true表示是mock数据
		}, function() {
			UIUtil.closeWaiting();
			UIUtil.toast('网络连接超时！请检查网络...');
		}, 1, secretKey, false);
	};

	//切记：直播不需要登录，直接进入直播间，即可观看
	function validataBroadcast(id) {
		WindowUtil.createWin('resource_center_view_zhibo_parent.html', 'resource_center_view_zhibo_parent.html', {
			videoId: id
		});
	};

	//ajax外部获取二级分类的id名
	function getClassifyId(secondClassifyId) {
		ClassifyId = secondClassifyId;
	}

	Zepto('.resourceType').on('tap', 'a', function() {
		var title = Zepto(this).text();
		switch(title) {
			case '推荐':

				pullToRefreshObject.refresh();
				break;
			case '最新':

				pullToRefreshObject2.refresh();
				break;
			default:

				pullToRefreshObject3.refresh();
				break;
		}
	})

	//手机无法刷新数据，所以手动初始化下拉刷新
	function initPullDownRefresh() {
		PullDownRefresh1();
		PullDownRefresh2();
		PullDownRefresh3();
	}

	//推荐
	function PullDownRefresh1() {
		var getLitemplate = function() {
			var litemplate = '';
			if(type == 0) {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}" /></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div><span>点击量：</span><span>{{number}}</span></div><div><span>积分:&nbsp;&nbsp;</span><span>{{marks}}</span></div></div></li>';
			} else if(type == 1) {
				litemplate = '<li id="{{id}}"class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div class="mui-ellipsis-2"><p>简介：{{introduction}}</p></div></div></li>';
			}
			return litemplate;
		};

		var getUrl = function() {
			var url = '';
			if(type == 0) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
			} else if(type == 1) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
			}
			//console.log("推荐课程url============" + url);
			return url;
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
				id: ClassifyId,
				//secondLevelId: secondLevelId,	            
				courseType: 0,
				//userId: userId,
				searchValue: null,
				courseKind: courseKind
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('（推荐）参数：' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("推荐列表数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("推荐列表数据：" + unescape(JSON.stringify(response.data)));
				tempArray = response.data;
				totalNumCount = response.totalCount;
				//console.log(JSON.stringify(tempArray));
				//判断是否存在这个数据
				if(tempArray) {
					if(type == 0) {
						if(Array.isArray(tempArray)) {
							//设置默认视频封面logo
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
								if(!value.marks) {
									value.marks = 0;
								};
								if(!value.number) {
									value.number = 0;
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
							if(!tempArray.marks) {
								tempArray.marks = 0;
							};
							if(!tempArray.number) {
								tempArray.number = 0;
							};
						};
					} else if(type == 1) {
						if(Array.isArray(tempArray)) {
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
						}
					}
				} else {
					//什么都不做	
				}
				//console.log("推荐JSON数据" + JSON.stringify(response.data));
			}
			return tempArray;
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc = function(e) {
			itemsId = this.id;
			if(Zepto(e.target).hasClass('zhiboItem') || Zepto(e.target).parents('li').hasClass('zhiboItem')) {
				if(type == 0) {
					Zepto("#zhezhao-area").show();
					Zepto("#alertWin").show();
				} else if(type == 1) {
					//console.log("activityId"+activityId+'============id'+id);
					validataBroadcast(itemsId);
				}
			}
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
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
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObject = pullToRefresh;
			pullToRefreshObject.refresh();
		});
	}

	//最新
	function PullDownRefresh2() {
		var getLitemplate2 = function() {
			var litemplate = '';
			if(type == 0) {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div><span>点击量：</span><span>{{number}}</span></div><div><span>积分:&nbsp;&nbsp;</span><span>{{marks}}</span></div></div></li>';
			} else if(type == 1) {
				litemplate = '<li id="{{id}}"class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div class="mui-ellipsis-2"><p>简介：{{introduction}}</p></div></div></li>';
			}
			return litemplate;
		};

		var getUrl2 = function() {
			var url = '';
			if(type == 0) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
			} else if(type == 1) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
			}
			return url;
		};
		//
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData2 = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: ClassifyId,
				//secondLevelId: secondLevelId,	            
				courseType: 1,
				//userId: userId,
				searchValue: null,
				courseKind: courseKind
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('（最新）参数：' + requestData);
			return requestData;
		};
		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc2 = function(response) {
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("最新列表数据 ：" + unescape(JSON.stringify(response.data)));
				tempArray = response.data;
				totalNumCount2 = response.totalCount;
				if(tempArray) {
					if(type == 0) {
						if(Array.isArray(tempArray)) {
							//设置默认视频封面logo
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
								if(!value.marks) {
									value.marks = 0;
								};
								if(!value.number) {
									value.number = 0;
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
							if(!tempArray.marks) {
								tempArray.marks = 0;
							};
							if(!tempArray.number) {
								tempArray.number = 0;
							};
						};
					} else if(type == 1) {
						if(Array.isArray(tempArray)) {
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
						}
					}
				};
			}
			//console.log("xxxxxxxxxxxxx"+JSON.stringify(tempArray));
			return tempArray;
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc2 = function(e) {
			itemsId = this.id;
			if(Zepto(e.target).hasClass('zhiboItem') || Zepto(e.target).parents('li').hasClass('zhiboItem')) {
				if(type == 0) {
					Zepto("#zhezhao-area").show();
					Zepto("#alertWin").show();
				} else if(type == 1) {
					//console.log("activityId"+activityId);
					validataBroadcast(itemsId);
				}
			}
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc2 = function() {
			//console.log("总记录数：" + totalNumCount2);
			return totalNumCount2;
		}

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc2 = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
		};

		PullToRefreshTools2.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				listdataId: 'listdata2',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh2',
				getLitemplate: getLitemplate2,
				getUrl: getUrl2,
				getRequestDataCallback: getData2,
				changeResponseDataCallback: changeResponseDataFunc2,
				itemClickCallback: onItemClickCallbackFunc2,
				changeToltalCountCallback: changeToltalCountFunc2,
				successRequestCallback: successCallbackFunc2,
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
			//console.log("生成下拉刷新成功");
			pullToRefreshObject2 = pullToRefresh;
			pullToRefreshObject2.refresh();
		});
	};

	//最热
	function PullDownRefresh3() {
		var getLitemplate3 = function() {
			var litemplate = '';
			if(type == 0) {
				litemplate = '<li id="{{id}}" class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}" /></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div><span>点击量：</span><span>{{number}}</span></div><div><span>积分:&nbsp;&nbsp;</span><span>{{marks}}</span></div></div></li>';
			} else if(type == 1) {
				litemplate = '<li id="{{id}}"class="mui-table-view-cell zhiboItem"><div class="imgBorder"><img data-img-localcache="{{image}}"/></div><div class="infoDetailBorder"><div class="zhiboTitle">{{title}}</div><div class="mui-ellipsis-2"><p>简介：{{introduction}}</p></div></div></li>';
			}
			return litemplate;
		};

		var getUrl3 = function() {
			var url = '';
			if(type == 0) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getDianBoSourceByType';
			} else if(type == 1) {
				//url = config.MockServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
				url = ServerUrl + 'resourceCenter/mobile/resourceCenter/getBroadcastSourceByType';
			}
			return url;
		};
		//
		/**
		 * @description     接口请求参数
		 * @param {Number}  currPage 列表模版界面传进来的当前页参数
		 * @return{JSON}    返回的是一个JSON
		 */
		var getData3 = function(CurrPage) {
			var requestData = {};
			//动态校验字段
			//requestData.ValidateData = 'validatedata';
			var data = {
				pageIndex: CurrPage,
				pageSize: PageSize,
				id: ClassifyId,
				//secondLevelId: secondLevelId,	            
				courseType: 2,
				//userId: userId,
				searchValue: null,
				courseKind: courseKind
			};
			requestData = data;
			//某一些接口是要求参数为字符串的 
			requestData = JSON.stringify(requestData);
			console.log('（最热）参数：' + requestData);
			return requestData;
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc3 = function(response) {
			//console.log("改变数据 ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			var response = CommonUtil.handleStandardResponse(response, '1');
			if(response.code == 1) {
				console.log("最热列表数据：" + unescape(JSON.stringify(response.data)));
				tempArray = response.data;
				totalNumCount3 = response.totalCount;
				if(tempArray) {
					if(type == 0) {
						if(Array.isArray(tempArray)) {
							//设置默认视频封面logo
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
								if(!value.marks) {
									value.marks = 0;
								};
								if(!value.number) {
									value.number = 0;
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
							if(!tempArray.marks) {
								tempArray.marks = 0;
							};
							if(!tempArray.number) {
								tempArray.number = 0;
							};
						};
					} else if(type == 1) {
						if(Array.isArray(tempArray)) {
							mui.each(tempArray, function(key, value) {
								if(!value.image || value.image == "") {
									value.image = '../../img/MobileFrame/img_default_noimage240-240.png';
								} else {
									//解码
									value.image = unescape(value.image);
								};
							});
						} else {
							//设置默认视频封面logo
							if(!tempArray.image) {
								tempArray.image = '../../img/MobileFrame/img_default_noimage240-240.png';
							} else {
								tempArray.image = unescape(tempArray.image);
							};
						}
					}
				};
			}
			return tempArray;
		};

		/*
		 * @description 列表点击事件
		 */
		var onItemClickCallbackFunc3 = function(e) {
			itemsId = this.id;
			if(Zepto(e.target).hasClass('zhiboItem') || Zepto(e.target).parents('li').hasClass('zhiboItem')) {
				if(type == 0) {
					Zepto("#zhezhao-area").show();
					Zepto("#alertWin").show();
				} else if(type == 1) {
					//console.log("activityId" + id);
					validataBroadcast(itemsId);
				}
			}
		};

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc3 = function() {
			//console.log("总记录数：" + totalNumCount3);
			return totalNumCount3;
		};

		/**
		 * @description 成功回调
		 * @param {Object} response
		 */
		var successCallbackFunc3 = function(response) {
			//console.log("成功请求数据：" + JSON.stringify(response));
			ImageLoaderFactory.lazyLoadAllImg(true);
		};

		PullToRefreshTools3.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				listdataId: 'listdata3',
				//默认的下拉刷新容器id,mui会对这个id进行处理,这里只接受id
				//注意,传给Mui时可以传 #id形式或者是  原生dom对象
				pullrefreshId: 'pullrefresh3',
				getLitemplate: getLitemplate3,
				getUrl: getUrl3,
				getRequestDataCallback: getData3,
				changeResponseDataCallback: changeResponseDataFunc3,
				itemClickCallback: onItemClickCallbackFunc3,
				changeToltalCountCallback: changeToltalCountFunc3,
				successRequestCallback: successCallbackFunc3,
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
			//console.log("生成下拉刷新成功");
			pullToRefreshObject3 = pullToRefresh;
			pullToRefreshObject3.refresh();
		});
	};
	//监听点播事件
	Zepto("#preview").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
		WindowUtil.createWin('resource_center_preview_video.html', 'resource_center_preview_video.html', {
			itemsId: itemsId,
		});
	});

	Zepto("#play").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
		console.log("xxxxxxxxxxxxxxxxx");
		LoginUtil.ResetTARGET_URL('resource_center_view_video.html', {
			itemsId: itemsId,
			type: type
		});
		if(LoginUtil.isLoginSystem()) {
			//console.log("是否收藏"+IsSave);
			WindowUtil.createWin('resource_center_view_video.html', 'resource_center_view_video.html', {
				itemsId: itemsId,
				type: type
			});
		} else {
			//console.log("请先登录！");
			WindowUtil.createWin("login.html", LoginUtil.loginUrl());
		}
	});

	Zepto("#cancle").on("tap", function() {
		Zepto("#zhezhao-area").hide();
		Zepto("#alertWin").hide();
	});

	//上拉收缩动画
	(function() {
		var scroll;
		var scroll2;
		var scroll3;
		var swipeup = function() {
			Zepto('.courseNameTitle').removeClass('topItemA').addClass('topItem');
			Zepto('#topItem').find('.classifyList').removeClass('classifyListActiveB').addClass('classifyListActive');
			Zepto('.mui-slider-indicator.mui-segmented-control').removeClass('ttC').addClass('tt');
			Zepto('.mui-fullscreen .mui-segmented-control~.mui-slider-group').removeClass('tt2D').addClass('tt2');
		};
		var swipedown = function() {
			Zepto('.mui-fullscreen .mui-segmented-control~.mui-slider-group').removeClass('tt2').addClass('tt2D');
			Zepto('.mui-slider-indicator.mui-segmented-control').removeClass('tt').addClass('ttC');
			Zepto('#topItem').find('.classifyList').removeClass('classifyListActive').addClass('classifyListActiveB');
			Zepto('.courseNameTitle').removeClass('topItem').addClass('topItemA');
		};
		//区域滚动
		mui("#pullrefresh,#pullrefresh2,#pullrefresh3").scroll({
			indicators: true, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		scroll = mui("#pullrefresh").scroll();
		scroll2 = mui("#pullrefresh2").scroll();
		scroll3 = mui("#pullrefresh3").scroll();
		Zepto('#pullrefresh').on('drag', function() {
			console.log("xxxxxxxxxxxxxx" + scroll.y);
			if(parseInt(scroll.y) < -60) {
				Zepto('.mui-title').text(courseNameTitleText);
				console.log("up");
				swipeup();
			} else if(parseInt(scroll.y) > -10) {
				swipedown();
				//console.log("down");
				Zepto('.mui-title').text('课外知识');
			};
		});
		Zepto('#pullrefresh2').on('drag', function() {
			console.log("xxxxxxxxxxxxxx" + scroll2.y);
			if(parseInt(scroll2.y) < -60) {
				Zepto('.mui-title').text(courseNameTitleText);
				swipeup();
			} else if(parseInt(scroll2.y) > -10) {
				swipedown();
				Zepto('.mui-title').text('课外知识');
			};
		});
		Zepto('#pullrefresh3').on('drag', function() {
			console.log("xxxxxxxxxxxxxx" + scroll3.y);
			if(parseInt(scroll3.y) < -60) {
				swipeup();
				Zepto('.mui-title').text(courseNameTitleText);
			} else if(parseInt(scroll3.y) > -10) {
				swipedown();
				Zepto('.mui-title').text('课外知识');
			};
		});
	})();

});