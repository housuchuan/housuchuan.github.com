/**
 * 作者: lb
 * 时间: 2016-08-26 
 * 描述: tab切换含下拉刷新
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//token值
	var Token = '';
	var choosetext = '';
	var totalcount = '';
	//下拉刷新对象
	var pullToRefreshObj;
	//搜索值
	var Affairs_TypeID = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'css/libs/mui.previewimage.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.zoom.js',
			'js/libs/mui.previewimage.js'
		], function() {
			//给图片绑定预览功能
				mui.previewImage();
			//初始化
			console.log("初始化");
			//获取token
			Config.GetToken(function(token) {
				console.log(token);
				Token = token;
				getTitle();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});

			/*initPullRefreshList();*/
		});

	}

	/**
	 * @description 加载tab标题
	 */
	var getTitle = function() {
		//var url =Config.serverUrl+ 'windowstitle';
		var url = Config.serverUrl + '/TaskKind/GetTaskKindsByCodeName';
		var litemplate =
			'<a class="mui-control-item">{{ItemText}}<span class="hidden itemvalue">{{ItemValue}}</span><span class="hidden itemurl">{{ItemUrl}}</span></a>';
		var requestData = {};
		//动态校验字段
		//动态校验字段
		requestData.ValidateData = Token;
		var data = {
			CodeName: "大厅分类"
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		//某一些接口是要求参数为字符串的
		//requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		console.log('请求数据:' + JSON.stringify(requestData));

		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				if(response.ReturnInfo.Code == "0") {
					alert(response.ReturnInfo.Description);
					return;
				}
				if(response.BusinessInfo.Code == "0") {
					alert(response.BusinessInfo.Description);
					return;
				}
				//console.log(JSON.stringify(response));
				var outdata = response.UserArea.ItemList;
				//console.log(JSON.stringify(outdata));
				//console.log(outdata.length);
				for(var i = 0; i < outdata.length; i++) {
					var output = Mustache.render(litemplate, outdata[i].ItmeInfo);
					Zepto('#list').append(output);
				}
				Zepto('#list').find('a').first().addClass('current mui-active');
				var url = Zepto('#list').find('a').first().find('.itemurl').text();
				Zepto('#imgLobby').attr('src', url);
				choosetext=outdata[0].ItmeInfo.ItemValue;
				initPullRefreshList();
				tabClick();
				var imgs=Zepto('img');
				Zepto.each(imgs,function(){
					var src=Zepto(this).attr('src');
					Zepto(this).attr('data-preview-src','');
					Zepto(this).attr('data-preview-group','1');
				})
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
		return requestData;
	};
	/**
	 * @description 设置tab切换点击事件
	 */
	var tabClick = function() {
		var tabli = Zepto('#list');
		tabli.on('tap', 'a', function() {
			tabli.find('a').removeClass('current');
			Zepto(this).addClass('current');
			var nowurl = Zepto(this).find('.itemurl').text();
			Zepto('#imgLobby').attr('src', nowurl);
			choosetext = Zepto(this).find('.itemvalue').text();
			pullToRefreshObj.refresh();
		})
	}

	var aClick = function() {
		var finda = Zepto('#listdata').find('.mui-clearfix').find('.region-tel');
		mui.each(finda, function(key, value) {
			Zepto(this).on('tap', function() {
				window.location.href = 'tel:' + Zepto(this).attr('id');
			})
		})
	}

	/*/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		choosetext
		//var url =Config.serverUrl+ 'windowscontent';
		var url = Config.serverUrl + "/AuditWindow/GetAuditWindowList";

		var getLitemplate = function(value) {
			if(value.Tel == "") {
				var temple =
					'<li class="mui-clearfix"><span class="region-name">{{WindowName}}</span><span class="noTel">暂无数据</span></li>';
			} else {
				var temple =
					'<li class="mui-clearfix"><span class="region-name">{{WindowName}}</span><a href="#" class="region-tel" id="{{Tel}}">{{Tel}}</a></li>';
				//				console.log('111');
			}
			return temple;
		}

		/*var litemplate =
		'<li class="mui-clearfix"><span class="region-name">{{WindowName}}</span><a href="#" class="region-tel">{{Tel}}</a></li>';*/
		var pageSize = 15;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = Token;
			var data = {
				WindowName: "",
				LobbyType: 'all',  //choosetext
				CurrentPageIndex: currPage.toString(),
				PageSize: pageSize.toString()
			};
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			console.log('url:' + url);
			console.log('部门列表请求数据:' + requestData);

			return JSON.stringify(requestData);
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response));
			if(response.ReturnInfo.Code == "0") {
				alert(response.ReturnInfo.Description);
				return false;
			}
			if(response.BusinessInfo.Code == "0") {
				alert(response.BusinessInfo.Description);
				return false;
			}
			//return response.UserArea.WindowList;
			totalcount = response.UserArea.TotalCount;
			var wdlist = response.UserArea.WindowList;
			var windowlist = [];
			//去掉多余层
			for(var i = 0; i < wdlist.length; i++) {
				windowlist.push(wdlist[i].WindowInfo);
			}
			return windowlist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		var successRequestCallback = function(response) {
			aClick();
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 1,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				//requestTimeOut:3000,
				//itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
});