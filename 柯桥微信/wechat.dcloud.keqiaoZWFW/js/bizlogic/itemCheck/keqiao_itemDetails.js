/**
 * 描述 :事项详情页面 
 * 作者 :侯苏川
 * 版本 :1.0
 * 时间 :2016-11-23
 */
define(function(require, exports, module) {
	"use strict"
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	//需要用到的变量
	var evevtId = '';
	var TaskGuid = ''; //事项Guid
	var userName = '',
		userGuid = ''; //用户名称
	var OpenId = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var Token = '';
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
			OpenId = WindowTools.getExtraDataByKey('UserPK')||'';
			//接受项目Guid
			evevtId = WindowTools.getExtraDataByKey('RowGuid');
			TaskGuid = WindowTools.getExtraDataByKey('TaskGuid');
			//获取token与其他id
			config.GetToken(function(token) {
				//alert('xxxxxxxxxxxxx'+token);
				//alert('xxxxxxxxxxxxxOpenId'+OpenId);
				Token = token;
				//请求办件详情数据
				ajaxEventDetailData();
				config.getUserguidbyOpenID(Token, OpenId, function(LoginID, UserGuid, tips) {
					userGuid = UserGuid;
					//alert('userGuid'+userGuid);
					Zepto('.user').text(LoginID); //需要从数据库中调取
				});
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});
	};

	/**
	 * @description 事项详情数据请求
	 */
	function ajaxEventDetailData() {
		var url = config.extraServerUrl + '/AuditProject/getProjectDetail';
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {
			ProjectGuid: evevtId
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxxxx事项详情url" + url);
		console.log("xxxxxxxxxxx事项详情请求参数" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("xxxxxxxxxxxx1111111111" + JSON.stringify(response));
				var litemplate = '<ul class="mui-table-view"><li class="mui-table-view-cell"><span class="event mui-ellipsis">事项名称:</span><span>{{TaskName}}</span></li><li class="mui-table-view-cell"><span>申请人</span><span>{{ApplyerName}}</span></li><li class="mui-table-view-cell"><span>申请日期</span><span>{{ApplyDate}}</span></li><li class="mui-table-view-cell"><span>办理进度</span><span id="pass">{{Status}}</span></li><li class="mui-table-view-cell applyCailiao"><a class="mui-navigate-right"><span>申报材料</span><span>共有<i class="number">{{MaterialCount}}</i>个附件</span></a></li></ul>';
				if(response.ReturnInfo.Code == 0) {
					//显示toast
					UITools.toast(response.ReturnInfo.Description);
					return;
				} else if(response.BusinessInfo.Code == 0) {
					//显示toast
					UITools.toast(response.BusinessInfo.Description);
					return;
				};
				var output = Mustache.render(litemplate, response.UserArea);
				Zepto('.mui-content').html('');
				Zepto('.mui-content').append(output);
				//附件点击操作
				taoOperation();
			},
			error: function() {
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};

	//跳转事项服务指南
	function taoOperation() {
		//看附件
		Zepto('.applyCailiao').on('tap', function() {
			WindowTools.createWin('ZWFW_ItemsCommon_detail.html','../Service/ZWFW_ItemsCommon_detail.html',{
				TaskGuid: TaskGuid,
				UserPK: OpenId
			});		
		})
	}
});