/**
 * 描述 :办事查询页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-11-14 15:16:48
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var ImageLoaderTools = require('ImageLoaderTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefresh1;
	var pageSize = 10;
	var TotalCount = '';
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//每一个页面都要引入的工具类
	//变量
	var phaseGuid = '',     //阶段guid
		businessGuid = '',   //主题guid
		SearchVal = '',
		ScreenHeight = 0;
	var type = 1; //核准or备案   1：核准       2：备案
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
			'js/libs/mui.previewimage.js',
			'js/libs/mui.zoom.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			//初始化监听事件
			initListener();
			//图片预览效果
			mui.previewImage();
		});
	};

	//点击事件监听函数
	function initListener() {
		ScreenHeight = window.innerHeight;
		//区域滚动
		mui(".mui-scroll-wrapper").scroll({
			indicators: true, //是否显示滚动条
			deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});

		//接受原生传过来核准或者是备案的状态
		type = WindowTools.getExtraDataByKey("projectType") || '';
		if(type == 1) {
			Zepto('.managementNotice').children('div:first-child').text('企业投资项目核准类办理条件');
		} else if(type == 2) {
			Zepto('.managementNotice').children('div:first-child').text('企业投资项目备案类办理条件');
		};

		//企业投资栏目选项选择
		Zepto('.mui-content').on('tap', '.items', function() {
			var _thisText = Zepto(this).find('span:first-child').text();
			Zepto(this).find('span').css('color', '#008aff').parent().siblings().children('span').css('color', '#000000');
			Zepto(this).find('.line').css('display', 'block').parent().siblings().children('.line').css('display', 'none');
			//快速回滚到该区域顶部
			mui('.outerList').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
			switch(_thisText) {
				case '办理须知':
					changePageShow('managementNotice');
					break;
				case '办理流程':
					if(Zepto(this).hasClass('isInit')) {
						changePageShow('applySteps');
					} else {
						Zepto('.imgSteps,.spSteps_title').html('');
						if(type == 1) {
							Zepto('.spSteps_title').text('企业投资项目核准审批流程');
							Zepto('.imgSteps').append('<img src="../../img/investmentProjects/img_hezhun.png" data-preview-src="../../img/investmentProjects/img_hezhun.png" data-preview-group="1" />');
						} else if(type == 2) {
							Zepto('.spSteps_title').text('企业投资项目备案审批流程');
							Zepto('.imgSteps').append('<img src="../../img/investmentProjects/img_beian.png" data-preview-src="../../img/investmentProjects/img_beian.png" data-preview-group="1" />');
						};
						changePageShow('applySteps');
						Zepto(this).addClass('isInit');
					};
					break;
				case '相关事项':
					if(Zepto(this).hasClass('isInit')) {
						changePageShow('relatedMatters');
					} else {
						//请求事项阶段
						ajaxEventSteps();
						changePageShow('relatedMatters');
					};
					break;
				case '岗位分布':
					changePageShow('jobPosition');
					break;
			}
		});

		//相关事项的选择判断
		Zepto('.mattersChoice').on('tap', 'div', function() {
			businessGuid = Zepto(this).children('span').attr('id');
			phaseGuid = this.id;
			Zepto(this).css('color', '#ffffff').css('background-color', '#0b98f2').siblings().css('color', '#0b98f2').css('background-color', '#ffffff');
			//刷新相应数据
			pullToRefresh1.refresh();
		});

		//相关事项关键字搜索
		Zepto('.eventSearch input[type=search]').on('input', function() {
			SearchVal = Zepto(this).val();
			pullToRefresh1.refresh();
		});

		Zepto('.mui-icon-clear').on('tap', function() {
			SearchVal = '';
			pullToRefresh1.refresh();
		});
	};

	//判断关闭哪个窗口函数
	function changePageShow(extras) {
		var array = ['managementNotice', 'applySteps', 'relatedMatters','jobPosition'];
		for(var i = 0; i < array.length; i++) {
			if(extras == array[i]) {
				Zepto('.' + array[i]).css('display', 'block');
			} else {
				Zepto('.' + array[i]).css('display', 'none');
			}
		}
	};

	/**
	 * @description 获取相关事项下的各阶段
	 */
	function ajaxEventSteps() {
		var url = config.serverUrl + 'AuditXiangMu_KQ/GetXMPhaseList';
		var requestData = {};
		requestData.ValidateData = '';
		var data = {
			BUSINESSGUID: 'b8c4296e-4e05-4e3b-bf52-ac1cc57c2fc2'   //主题GUID
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(url);
		console.log("xxxxx"+requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response){
				console.log("xxxxxxxxxxxxxxxxxxxxx"+JSON.stringify(response));
				if(response.ReturnInfo.Code == 0) {
					ejs.nativeUI.toast(response.ReturnInfo.Description);
					return;
				};
				if(response.BusinessInfo.Code == "0") {
					ejs.nativeUI.toast(response.BusinessInfo.Description);
					return;
				};
				var tempArray = [];
				var allStep = {
					RowGuid: '',
					PhaseName: '所有选项',
					OrderNumber: '',
					BusinessGuid: ''
				};
				tempArray.push(allStep);
				var litemplate = '<div id="{{RowGuid}}"><span id="{{BusinessGuid}}"></span>{{PhaseName}}</div>';
				var output = '';
				if(Array.isArray(response.UserArea.XMPhaseList)){
					mui.each(response.UserArea.XMPhaseList,function(key,value){
						tempArray.push(value.PhaseInfo);
					});
				};
				mui.each(tempArray,function(key,value){
					if (tempArray[1]) {
						if(tempArray[1].BusinessGuid){
							if(key == 0){
								value.BusinessGuid = tempArray[1].BusinessGuid;
							}
						}
					}else{
						if(key == 0){
							value.BusinessGuid = 'a1dd92d4-01af-4bfd-919e-50203239b8e5';
						}
					}
					output += Mustache.render(litemplate, value);
				});
				Zepto('.mattersChoice').html('');
				Zepto('.mattersChoice').append(output);
				var chooseHei = Zepto('.mattersChoice').height();
				var realHei = (parseInt(ScreenHeight) - parseInt(chooseHei)-98) + 'px';
				Zepto('.innerList').css('height', realHei);
				Zepto('.innerList').css('margin-top',((parseInt(chooseHei)+49)+'px'))
				businessGuid = tempArray[0].BusinessGuid;
				phaseGuid = tempArray[0].RowGuid;
				//加载相关事项数据
				initPullRefreshList();
			},
			error: function(){
				ejs.nativeUI.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//相关立项
	//项目查询下拉刷新
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		//默认为公用url和模板
		var getUrl = function() {
			var url = config.serverUrl + 'AuditXiangMu_KQ/GetPhaseTaskList';
			console.log('url:' + url);
			return url;
		};

		var getLitemplate = function() {
			var litemplate = '<li id="{{PhaseGuid}}" class="mui-table-view-cell mui-ellipsis"><span class="TaskGuid" id="{{TaskGuid}}"></span><span id="{{BusinessGuid}}"></span><span style="display:none">{{OuName}}</span>{{TaskName}}</li>';
			return litemplate;
		};

		//获得请求参数的回调-党员
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = '';
			var data = {
				BusinessGuid: businessGuid,
				SearchVal: SearchVal,
				PhaseGuid: phaseGuid,
				PageSize: pageSize.toString(),
				CurrentPageIndex: currPage.toString()
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			console.log('请求数据:' + requestData);
			return requestData;
		};

		//点击回调
		var onClickCallback = function(e) {
			var TaskGuid = Zepto(this).find('.TaskGuid').attr('id');
			//打开原生页面
			ejs.page.openLocal("com.epoint.wssb.actys.MSBShiXiangDetailActivity", {
				TaskGuid: TaskGuid
			},function(){
				//回调函数
			});
		};

		var changeToltalCountCallback = function() {
			return TotalCount;
		};

		var changeResponseDataCallback = function(response) {
			console.log("xxxxxxxxxxx" + JSON.stringify(response));
			var tempArray = [];
			if(response.ReturnInfo.Code == 0) {
				ejs.nativeUI.toast(response.ReturnInfo.Description);
				return;
			};
			if(response.BusinessInfo.Code == "0") {
				ejs.nativeUI.toast(response.BusinessInfo.Description);
				return;
			};
			TotalCount = response.UserArea.TotalCount;
			mui.each(response.UserArea.PhaseTaskList, function(key, value) {
				tempArray.push(value.PhaseTaskInfo);
			});
			return tempArray;
		};

		var successRequestCallback = function() {
			Zepto(Zepto('.mui-content').children('.items')[2]).addClass('isInit');
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
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: getUrl,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata',
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