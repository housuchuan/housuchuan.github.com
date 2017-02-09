/**
 * 作者: dailc
 * 时间: 2016-06-07
 * 描述:  图片轮播工具类
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	// initready 要在所有变量初始化做完毕后
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
			'js/core/sea.min.js',
			'js/libs/mustache.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			initListeners();

		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
		mui('.mui-scroll-wrapper').scroll({
			indicators: true, //是否显示滚动条
		});

		ajaxAppList();
	}

	/**
	 * @description app应用
	 */
	function ajaxAppList() {
		var url = config.serverUrl + 'getinfolistepic';
		var requestData = {};
		requestData.ValidateData = config.token;
		var data = {
			currentpageindex: 0,
			pagesize: 100,
			catenum: '003001',
			isheadnews: 1,
			title: '',
			fieldname: '来源',
			typename: '应用辅助信息',
			bigimgwidth: 100,
			bigimgheight: 100,
			smallimgwidth: 100,
			smallimgheight: 100
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				var ul = document.getElementById('application-list');
				if(response.EpointDataBody.DATA.ReturnInfo.Status == false) {
					UITools.toast(response.EpointDataBody.DATA.ReturnInfo.Description);
					return;
				};
				var litemplate = '<li id="{{InfoID}}" class="mui-table-view-cell application"><div class="image"><img src="{{BigImgUrl}}" /></div><p class="name">{{Title}}</p></li>';
				var lastLi = '<li class="mui-table-view-cell mr0"><div class="image more-application"><img src="../../img/img-application/application9.png" /></div></li>';
				var output = '';
				if (Array.isArray(response.EpointDataBody.DATA.UserArea.InfoList.Info)) {
					mui.each(response.EpointDataBody.DATA.UserArea.InfoList.Info, function(key, value) {
						if(value.extend) {
							value['extra'] = unescape(value.extend.fieldvalue);
						} else {
							value['extra'] = '';
						};
						value.Title = unescape(value.Title);
						output += Mustache.render(litemplate, value);
					});
				} else{
					response.EpointDataBody.DATA.UserArea.InfoList.Info.Title = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.Title);
					if (response.EpointDataBody.DATA.UserArea.InfoList.Info.extend) {
						response.EpointDataBody.DATA.UserArea.InfoList.Info.extra = unescape(response.EpointDataBody.DATA.UserArea.InfoList.Info.extend.fieldvalue);
					};
					output = Mustache.render(litemplate, (response.EpointDataBody.DATA.UserArea.InfoList.Info));
				}
				output += lastLi;
				ul.innerHTML = output;
				applicationHerf();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	var applicationHerf = function() {
		mui('#application-list').on('tap', '.application', function() {
			var src = Zepto(this).find('img')[0].src;
			var jsonObj = {
				infoID: this.id,
				ImgSrc: src
			};
			ejs.page.openPage("html/bizlogic-application/application-detail.html", "应用详情", jsonObj, {});
		});
	}

});