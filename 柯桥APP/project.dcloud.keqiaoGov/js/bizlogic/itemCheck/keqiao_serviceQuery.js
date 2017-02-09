/**
 * 描述 :办事查询页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-11-14 15:16:48
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var UITools = require('UITools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//下拉刷新对象
	//用户信息变量
	var userGuid = '',
		totalNumCount = 0;
	var maxPageIndex = 1;
	//两个下拉刷新对象
	var pullToRefresh1;
	var status = '';
	//办件名称（事项名称）
	var TaskName = '',
		projectCode = '';
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
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/core/sea.min.js',
			'js/libs/epoint.moapi.v2.js'
		], function() {
			//获取数据库键值配对
			ejs.sql.getConfigValue("MSBConfigKeys_userGuid", function(result, msg, res) {
				var value = result.value;
				userGuid = value || '';
				//如有问题,请自行alert result,根据层级进行取值
			});
			//初始化点击事件监听
			initListener();
			del();
		});
	};

	//点击事件监听函数
	function initListener() {
		//头部tab切换
		Zepto('.tabItem').on('tap', 'span', function() {
			var _thisText = Zepto(this).text();
			Zepto(this).css('color', '#008aff').siblings().css('color', '#666666');
			if(_thisText == '办件查询') {
				Zepto('.eventSearch').css('display', 'block');
				Zepto('.scrollWrapper').css('display', 'none');
			} else {
				Zepto('.eventSearch').css('display', 'none');
				Zepto('.scrollWrapper').css('display', 'block');
			}
		});
		//办件查询模糊查找
		Zepto('#input-searchIdName').on('tap', function() {
			TaskName = Zepto('#TaskId').val();
			if(!TaskName) {
				UITools.toast('请输入办件名称');
			} else {
				Zepto('.BJSearch').html('');
				//初始化办件查询数据
				initPullRefreshList();
			}
		});

		//项目查询模糊查找
		Zepto('#input-searchName').on('tap', function() {
			projectCode = Zepto('#Tasksearch').val();
			if(!projectCode) {
				UITools.toast('请输入项目编号');
			} else {
				//初始化项目查询数据
				initProjectSearch();
			}
		});

		//项目查询详情点击页面跳转
		Zepto('.ProjectSearch').on('tap', 'li', function() {
			//点击该详情跳转
			var XMNUMBER = Zepto(this).children('.XMNUMBER').attr('id');
			//得到根路径
			var basePath = CommonTools.getProjectBasePath();
			var ResetUrl = basePath + 'html/itemCheck/keqiao_projectDetail.html';
			ejs.page.openPage(ResetUrl, '项目详情', {
				id: XMNUMBER
			});
		});
	};

	/**
	 * @description 项目查询请求详情数据
	 */
	function initProjectSearch() {
		var url = config.serverUrl + 'AuditXiangMu_KQ/GetXMDetail';
		var litemplate = '<li id="{{RowGuid}}" class="mui-table-view-cell mui-ellipsis"><span class="XMNUMBER" id="{{XMNUMBER}}">{{XMNAME}}</li>';
		var requestData = {};
		requestData.ValidateData = '';
		var data = {
			XMNUMBER: projectCode //XM20160005XM20160005
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("xxx" + url);
		console.log("xxxxxxxx" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("xxxxxxx" + JSON.stringify(response));
				var tmpInfo = response.UserArea;
				if(response.ReturnInfo.Code == 0) {
					ejs.nativeUI.toast(response.ReturnInfo.Description);
					return;
				};
				if(response.BusinessInfo.Code == "0") {
					ejs.nativeUI.toast(response.BusinessInfo.Description);
					return;
				};
				var output = Mustache.render(litemplate, tmpInfo);
				Zepto('.ProjectSearch').html('');
				Zepto('.ProjectSearch').append(output);
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
		var url = config.serverUrl + 'AuditProject_KQ/getProjectList';
		//动态选择映射模板
		var getLitemplate = function(value) {
			var temple = '';
			console.log(JSON.stringify(value));
			if(value.Status == '外网申报未提交' || value.Status == '不予受理') {
				temple = '<li id="{{ProjectGuid}}" _task="{{Status}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-right mui-disabled"><a id="{{ProjectGuid}}" class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{ProjectGuid}}" _task="{{Status}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{FLOWSN}}</span><span class="state"><label>状态：</label>{{Status}}</span></p><p id="{{ProjectGuid}}" _task="{{Status}}" class="requirement">{{TaskName}}</p><p id="{{ProjectGuid}}" _task="{{Status}}"  class="unit"><label>办理部门：</label>{{OUName}}</p></div></div></li>';
			} else {
				temple = '<li id="{{ProjectGuid}}" _task="{{Status}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{ProjectGuid}}" _task="{{Status}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{FLOWSN}}</span><span class="state"><label>状态：</label>{{Status}}</span></p><p id="{{ProjectGuid}}" _task="{{Status}}" class="requirement">{{TaskName}}</p><p id="{{ProjectGuid}}" _task="{{Status}}"  class="unit"><label>办理部门：</label>{{OUName}}</p></div></div></li>';
			}
			return temple;
		};

		var pageSize = 10;
		//获得请求参数的回调
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = '';
			var data = {
				CurrentPageIndex: currPage.toString(),
				PageSize: pageSize.toString(),
				ProjectStatus: 0,
				TaskName: TaskName,
				ApplyerGuid: '',
				UserGuid: userGuid //userGuid//4a4c5f94-feaf-4329-852b-1d9ecc367f6b
			};
			//console.log("当前页:"+currPage);
			requestData.paras = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			console.log('url:' + url);
			console.log('请求数据:' + requestData);
			return requestData;
		};
		//点击回调
		var onClickCallback = function(e) {
			//可用的办件编号：STD201612070001
			status = Zepto(this).find('.itme-number').text();
		};

		//动态处理数据
		var changeResponseDataFunc = function(response) {
			console.log(JSON.stringify(response))
			if(response.ReturnInfo.Code == "0") {
				mui.toast(response.ReturnInfo.Description);
				return;
			};
			if(response.BusinessInfo.Code == "0") {
				mui.toast(response.BusinessInfo.Description);
				return;
			}
			var tasklist = response.UserArea.ProjectList;
			var projectlist = [];
			//去掉多余层
			for(var i = 0; i < tasklist.length; i++) {
				projectlist.push(tasklist[i].ProjectInfo);
			}
			totalNumCount = response.UserArea.TotalCount;
			Zepto('#totalnum').html(totalNumCount.toString());
			maxPageIndex = Math.ceil(totalNumCount / pageSize);
			return projectlist;
		}

		/**
		 * @description 这是必须传的,否则数量永远为0,永远不能加载更多
		 */
		var changeToltalCountFunc = function() {
			//console.log("总记录数：" + totalNumCount);
			return totalNumCount;
		};

		var successCallbackFunc = function() {
			document.getElementById('listdata').addEventListener('tap', function(e) {
					var id = e.target.id;
					var pars = id;
					var task = Zepto("#" + pars).attr('_task');
					if(e.target.tagName === 'li') {
						if(task == '外网申报未提交') {
							//打开原生页面(未提交情况下)
							ejs.page.openLocal("com.epoint.wssb.actys.MSBShenBaoActivity", {
								from: "banjian",
								ProjectGuid: pars
							});
						} else if(task == '待补办') {
							//打开原生页面（提交过的）
							ejs.page.openLocal("com.epoint.wssb.actys.MSBBanJianDetailActivity", {
								type: status,
								ProjectGuid: pars
							});
						} else {
							//打开原生页面（提交过的）
							ejs.page.openLocal("com.epoint.wssb.actys.MSBBanJianDetailActivity", {
								type: status,
								ProjectGuid: pars
							});
						}
					}
					if(e.target.tagName === 'P') {
						if(task == '外网申报未提交') {
							//打开原生页面(未提交情况下)
							ejs.page.openLocal("com.epoint.wssb.actys.MSBShenBaoActivity", {
								from: "banjian",
								ProjectGuid: pars
							});
						} else if(task == '待补办') {
							//打开原生页面（提交过的）
							ejs.page.openLocal("com.epoint.wssb.actys.MSBBanJianDetailActivity", {
								type: status,
								ProjectGuid: pars
							});
						} else {
							//打开原生页面（提交过的）
							ejs.page.openLocal("com.epoint.wssb.actys.MSBBanJianDetailActivity", {
								type: status,
								ProjectGuid: pars
							});
						}
					}
				}

			);
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
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				listdataId: 'listdata',
				pullrefreshId: 'pullrefresh',
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
			pullToRefresh1 = pullToRefresh;
		});
	};

	function del() {
		Zepto('#listdata').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认删除该条记录？', '', btnArray, function(e) {
				if(e.index == 0) {
					//li.parentNode.removeChild(li);
					var id = event.target.id;
					console.log(id)
						//elem.parentNode.removeChild(elem);
					deleteProject(id);
				} else {
					setTimeout(function() {
						mui.swipeoutClose(li);
					}, 0);
				};
			});
		});
		var btnArray = ['确认', '取消'];
	}

	function deleteProject(s) {
		var url = config.bbServerUrl + "/AuditProject/deleteProject";
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = '';
		var data = {
			ProjectGuid: s
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + JSON.stringify(requestData));
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			success: function(response) {
				if(response.ReturnInfo.Code == "0") {
					alert(response.ReturnInfo.Description);
					return false;
				}
				if(response.BusinessInfo.Code == "0") {
					alert(response.BusinessInfo.Description);
					return false;
				}
				pullToRefresh1.refresh();
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	}

});