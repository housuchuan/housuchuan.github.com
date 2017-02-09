/**
 * 作者: chenxuan
 * 时间: 2016-12-31
 * 描述:  中学
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefresh1;
	var pageSize = 6;
	var TotalCount = '';
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//首页传过来的参数
	var InfoID = '',
		CateNum = '';
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
			'js/core/sea.min.js',
			'js/libs/mustache.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			InfoID =  WindowTools.getExtraDataByKey('infoID');
			CateNum =  WindowTools.getExtraDataByKey('cateNum');
			//请求详情数据
			ajaxDetailInfo();
			initListners();
		});
	}

	function initListners() {
		mui.init();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		//学校在线统计与教师在线统计切换
		Zepto('.two-link').on('tap','button',function(){
			var text = Zepto(this).text();
			var Type = '0';
			if (text == '教师在线统计') {
				Type = '1';
			}else{
				Type = '0';
			};
			ejs.page.openLocal('com.epoint.zjzjy.actys.ZJTSActivity', {
			    type: Type
			});
		});
		//校园直通车主栏目点击
		Zepto('.school-hd h5').on('tap',function(){
			ejs.page.openPage("html/bizlogic-homepage/info-list.html", "校园直通车", {
				cateNum: CateNum
			});
		});
	};
	
	/**
	 * @description 请求信息详情数据
	 */
	function ajaxDetailInfo() {
		var url = config.serverUrl + 'GetInfoDetail';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			InfoID: InfoID,
			CateNum: CateNum,
			IsNeedUrl: '0',
			isvideo: '0',
			imgwidth: '200',
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxx"+url);
		console.log("xxxxxxxx"+requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("-----------"+JSON.stringify(response));
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				console.log("xxxxxxxxxxxxxx"+unescape(response.EpointDataBody.DATA.UserArea.infocontent));
				Zepto('.mui-title').text(unescape(response.EpointDataBody.DATA.UserArea.title));
				Zepto('.guardInfo').html('');
				Zepto('.guardInfo').append(unescape(response.EpointDataBody.DATA.UserArea.infocontent));
				Zepto('.brief-state').text('——'+unescape(response.EpointDataBody.DATA.UserArea.title));
				//校园直通车列表请求数据
				initPullRefreshList();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};
	
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//默认为公用url和模板
		var getUrl = function() {
			var url = config.serverUrl + 'GetInfoList';
			console.log('url:' + url);
			return url;
		};

		var getLitemplate = function() {
			var litemplate = '<li id="{{InfoID}}" class="mui-table-view-cell"><span id="{{CateNum}}" class="CateNum"></span><p class="mui-ellipsis title">{{Title}}</p></li>';
			return litemplate;
		};

		//获得请求参数的回调-党员
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = config.token;
			var data = {
				Title: '',
				IsHeadNews: 0,
				CateNum: CateNum,
				PageSize: pageSize.toString(),
				CurrentPageIndex: currPage.toString()
			};
			requestData.para = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			console.log('请求数据:' + requestData);
			return requestData;
		};

		//点击回调
		var onClickCallback = function(e) {
			var id = this.id;
			var CateNum = Zepto(this).find('.CateNum').attr('id');
			ejs.page.openPage("html/bizlogic-homepage/info-detail.html", "详情", {
				infoId: id,
				cateNum: CateNum
			});
		};

		var changeToltalCountCallback = function() {
			return TotalCount;
		};

		var changeResponseDataCallback = function(response) {
			console.log("xxxxxxxxxxx" + JSON.stringify(response));
			var tempArray = [];
			if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
				UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
				return;
			};
			TotalCount = response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount;
			mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
				value.Title = unescape(value.Title);
			});
			tempArray = response.EpointDataBody.DATA.UserArea.InfoList.Info;
			return tempArray;
		};

		var successRequestCallback = function() {
			
		};

		//初始化下拉刷新是异步进行的,回调后才代表下拉刷新可以使用
		//因为用了sea.js中的require.async
		//第二个
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata1',
				pullrefreshId: 'pullrefresh',
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1_material1'
		}, function(pullToRefresh) {
			pullToRefresh1 = pullToRefresh;
		});
	}
	
	
});