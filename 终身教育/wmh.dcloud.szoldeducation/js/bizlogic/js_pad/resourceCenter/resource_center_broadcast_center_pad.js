/**
 * 描述 :直播中心ipad版本页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-07-10 15:17:07
 */

define(function(require, exports, module) {
	"use strict"
	//引入工具类
	var CommonUtil = require('core/MobileFrame/CommonUtil.js');
	var PullToRefreshTools = require('core/MobileFrame/RayApp.PullToRefresh.Impl.Default');
	var litemplate = '<div><img src="../../../img/menubar/img-menubar.jpg"/><span class="title-program mui-ellipsis">冶金技术冶金技术冶金技术的发展</span><div class="m-btn mui-clearfix"><div class="video-log"></div><span class="video-show">正在直播</span></div></div><div><img src="../../../img/menubar/img-menubar.jpg"/><span class="title-program mui-ellipsis">冶金技术冶金技术冶金技术的发展</span><div class="m-btn m-btn-end mui-clearfix"><div class="video-log"></div><span class="video-show">已经结束</span></div></div>';
	var url = config.ServerUrl + 'getinfolist';
	var CurrPage = 0;
	var PageSize = 10;
	var totalNumCount = '';
	var pullToRefreshObject;
	var arr = [];
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		columnSelect();
	}

	//栏目类型列表选择
	function columnSelect() {
		Zepto('.column-list').on('tap', '.common-share', function() {
			var _this = Zepto(this).find('div');
			if (_this.text() == '√') {
				for (var i = 0; i <= arr.length - 1; i++) {
					_this.html('');
					if (arr[i] == _this.siblings().text()) {
						//console.log(i);
						//删除下标为i，长度为1的数
						arr.splice(i, 1);
					}
				}
			} else {
				_this.html('√');
				var itemTapTitle = _this.siblings().text();
				//依次数组入栈
				arr.push(itemTapTitle);
			}
			console.log(arr);
		})
	}

	//下拉刷新
	/*
	 * @description 初始化下拉刷新控件
	 */
	/**
	 * @description     接口请求参数
	 * @param {Number}  currPage 列表模版界面传进来的当前页参数
	 * @return{JSON}    返回的是一个JSON
	 */
	function getData(CurrPage) {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'validatedata';
		var data = {
			currentpageindex: CurrPage,
			pagesize: PageSize,
			catenum: "003",
			isheadnews: "0",
			title: " "
		};
		requestData.para = data;
		//某一些接口是要求参数为字符串的 
		requestData = JSON.stringify(requestData);
		console.log('url:' + url);
		console.log('请求参数' + requestData);
		return requestData;
	}

	/**
	 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
	 * @param {Object} response Json数组
	 */
	function changeResponseDataFunc(response) {
		//console.log("改变数据 ：" + JSON.stringify(response));
		//定义临时数组
		var tempArray = [];
		if (response && response.EpointDataBody && response.EpointDataBody.DATA && response.EpointDataBody.DATA.ReturnInfo && response.EpointDataBody.DATA.ReturnInfo.Status == "True") {
			if (response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.InfoList && response.EpointDataBody.DATA.UserArea.InfoList.Info && response.EpointDataBody.DATA.UserArea.PageInfo) {
				totalNumCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
				var InfoArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
				mui.each(InfoArray, function(key, value) {
//					value.Title = unescape(value.Title);
					tempArray.push(value);
				});
			}
		}
		return tempArray;
	}

	/**
	 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
	 */
	function changeToltalCountFunc() {
		//console.log("总记录数：" + totalNumCount);
		return totalNumCount;
	}

	/**
	 * @description 成功回调
	 * @param {Object} response
	 */
	function successCallbackFunc(response) {
		console.log("成功请求数据：" + JSON.stringify(response));
	};

	/*
	 * @description 列表点击事件
	 */
	function onItemClickCallbackFunc(e) {
		var infoID = Zepto(this).find('.RowGuid').text();
		WindowUtil.createWin('', '', {
			InfoID: infoID
		});
	};

	PullToRefreshTools.initPullDownRefresh({
		isDebug: true,
		up: {
			auto: true
		},
		bizlogic: {
			defaultInitPageNum: 0,
			getLitemplate: litemplate,
			getUrl: url,
			getRequestDataCallback: getData,
			changeResponseDataCallback: changeResponseDataFunc,
			itemClickCallback: onItemClickCallbackFunc,
			changeToltalCountCallback: changeToltalCountFunc,
			successRequestCallback: successCallbackFunc
		},
		//三种皮肤
		//default -默认人的mui下拉刷新,webview优化了的
		//type1 -自定义类别1的默认实现, 没有基于iscroll
		//type1_material1 -自定义类别1的第一种材质
		skin: 'type1'
	}, function(pullToRefresh) {
		console.log("生成下拉刷新成功");
		pullToRefreshObject = pullToRefresh;
		pullToRefreshObject.refresh();
	});

});