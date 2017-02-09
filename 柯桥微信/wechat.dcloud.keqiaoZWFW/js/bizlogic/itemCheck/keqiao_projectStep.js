/**
 * 描述 :项目阶段页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-11-14
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//每一个页面都要引入的工具类
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	var totalNumCount = 0;
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var PhaseGuid = '', //阶段Guid
		projectStepName = ''; //阶段名称
	var XMNUMBER = ''; //项目编码
	var BiGuid = '';  //主题实例Guid
	var Token = '',
		UserPK = '';
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
			'js/libs/mustache.min.js'
		], function() {
			//接受项目Guid
			projectStepName = WindowTools.getExtraDataByKey('projectStepName');
			PhaseGuid = WindowTools.getExtraDataByKey('PhaseGuid');
			XMNUMBER = WindowTools.getExtraDataByKey('XMNUMBER');
			BiGuid = WindowTools.getExtraDataByKey('BiGuid');
			UserPK = WindowTools.getExtraDataByKey('UserPK')||'';
			//获取token与其他id
			config.GetToken(function(token) {
				//alert('xxxxxxxxxxxxx'+UserPK);
				Token = token;
				//请求阶段
				ajaxStepList();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});
	};

	//点击事件监听函数
	function initListener() {
		//项目立项样式设置
		var _this = Zepto('.mui-content > .stepsWrapper');
		for(var i = 0; i < _this.length; i++) {
			if(Zepto(_this[i]).find('.status1').text() == '办理中') {
				Zepto(_this[i]).find('.status1').css('color', '#71bb78');
			} else if(Zepto(_this[i]).find('.status1').text() == '未开始') {
				Zepto(_this[i]).find('.status1').css('color', '#f61e1e');
			} else {
				Zepto(_this[i]).find('.status1').css('color', '#67acff');
			}
		};
		//刷新个阶段下的事项列表数据
		//ajaxDetailData();
		//阶段选择请求详情数据
		Zepto('.mui-content').on('tap', '.stepsWrapper', function(e) {
			PhaseGuid = this.id;
			var scrollHtml = '<div class="mui-scroll-wrapper" id="pullrefresh"><div class="mui-scroll"><ul class="mui-table-view liWrapperInner" id="listdata"></ul></div></div>';
			Zepto('.msWrapper').html('');
			Zepto(this).find('.msWrapper').append(scrollHtml);
			//初始化下拉刷新列表
			initPullRefreshList();
		});
		//阻止冒泡
		Zepto('.stepsWrapper').on('tap', '.mui-scroll-wrapper', function(e) {
			e.stopPropagation();
		});
	};

	/**
	 * @description 请求阶段
	 */
	function ajaxStepList() {
		var url = config.extraServerUrl + '/AuditXiangMu_KQ/GetXMDetail';
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {
			XMNUMBER: XMNUMBER
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("xxxxxxxxxxxxxxx" + JSON.stringify(response));
				var output = '';
				var litemplate = '<div id="{{PhaseGuid}}" class="stepsWrapper"><div class="steps"><div>{{PhaseName}}</div><div class="status"><span class="status1">{{Status}}</span><a><span class="mui-icon mui-icon-arrowright"></span></a></div></div><div class="msWrapper"></div></div>';
				if(response.ReturnInfo.Code == 0) {
					//显示toast
					UITools.toast(response.ReturnInfo.Description);
					return;
				} else if(response.BusinessInfo.Code == 0) {
					//显示toast
					UITools.toast(response.BusinessInfo.Description);
					return;
				};
				mui.each(response.UserArea.PhaseList, function(key, value) {
					output += Mustache.render(litemplate, value.PhaseInfo);
				});
				Zepto('.mui-content').html('');
				Zepto('.mui-content').append(output);
				//初始化上个页面跳转的刷新数据
				var _this = Zepto('.stepsWrapper');
				for(var i = 0; i < _this.length; i++) {
					var text = Zepto(_this[i]).children('.steps').find('div:first-child').text();
					if(text == projectStepName) {
						var scrollHtml = '<div class="mui-scroll-wrapper" id="pullrefresh"><div class="mui-scroll"><ul class="mui-table-view liWrapperInner" id="listdata"></ul></div></div>';
						Zepto('.msWrapper').html('');
						Zepto('.stepsWrapper').eq(i).find('.msWrapper').append(scrollHtml);
						console.log("xxxxxxxxxx"+Zepto('.stepsWrapper').eq(i).html());
						//初始化下拉刷新列表
						initPullRefreshList();
					}
				};
				//监听点击事件
				initListener();
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
		//两个下拉刷新对象
		var pullToRefresh0;
		//默认为公用url和模板
		var url = config.extraServerUrl + '/AuditXiangMu_KQ/GetPhaseProjectList';
		var litemplate =
			'<li id="{{taskGuid}}"class="mui-table-view-cell"><span class="RowGuid"id="{{RowGuid}}" style="display:none"></span><span class="BiGuid"id="{{BiGuid}}" style="display:none"></span><span class="PhaseGuid"id="{{PhaseGuid}}" style="display:none"></span><a class="mui-navigate-right"><span>{{TaskName}}</span><span class="event">{{status}}</span></a></li>';
		var pageSize = 4;
		console.log("xxxxx"+url);
		//获得请求参数的回调
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				CurrentPageIndex: currPage.toString(),
				PageSize: pageSize.toString(),
				PhaseGuid: PhaseGuid, //阶段Guid
				BiGuid: BiGuid //主题实例Guid   暂时可用 325720c8-11aa-4479-b6cf-2bade36f06dd
			};
			//console.log("当前页:"+currPage);
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			console.log('url:' + url);
			console.log('阶段请求请求数据:' +requestData);
			return requestData;
		};
		//点击回调
		var onClickCallback = function(e) {
			console.log("点击:" + this.id);
			var id = this.id;
			var RowGuid = Zepto(this).find('.RowGuid').attr('id');
			WindowTools.createWin('keqiao_itemDetails.html','keqiao_itemDetails.html',{
				RowGuid: RowGuid,
				TaskGuid: id,
				UserPK: UserPK
			});			
		};

		/**
		 * @description 改变数据的函数,代表外部如何处理服务器端返回过来的数据
		 * @param {Object} response Json数组
		 */
		var changeResponseDataFunc = function(response) {
			console.log("改变数据xxxxxxxxxxxxx ：" + JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			if(response.ReturnInfo.Code == 0) {
				//显示toast
				UITools.toast(response.ReturnInfo.Description);
				return;
			} else if(response.BusinessInfo.Code == 0) {
				//显示toast
				UITools.toast(response.BusinessInfo.Description);
				return;
			};
			totalNumCount = response.TotalCount;
			mui.each(response.UserArea.PhaseProjectList, function(key, value) {
				tempArray.push(value.PhaseProjectInfo);
			});
			return tempArray;
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
			//立项阶段内部样式设计
			var _this = Zepto('.stepsWrapper');
			for(var i = 0; i < _this.length; i++) {
				if(Zepto(_this[i]).find('.event').text() == '办理中') {
					Zepto(_this[i]).find('.event').css('color', '#71bb78');
				} else if(Zepto(_this[i]).find('.event').text() == '未开始') {
					Zepto(_this[i]).find('.event').css('color', '#f61e1e');
				} else {
					Zepto(_this[i]).find('.event').css('color', '#67acff');
				}
			};
		};

		//初始化下拉刷新是异步进行的,回调后才代表下拉刷新可以使用
		//因为用了sea.js中的require.async
		//第一个
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				pullrefreshId: 'pullrefresh',
				listdataId: 'listdata',
				changeResponseDataCallback: changeResponseDataFunc,
				changeToltalCountCallback: changeToltalCountFunc,
				successRequestCallback: successCallbackFunc
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//default只支持一个
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1_material1'
		}, function(pullToRefresh) {
			pullToRefresh0 = pullToRefresh;
		});
	}

});