/**
 * 描述 :项目详情页面 
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
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
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
			UserPK = WindowTools.getExtraDataByKey('UserPK')||'';
			//获取token与其他id
			config.GetToken(function(token) {
				Token = token;
				//请求项目详情数据
				ajaxProjectDetailData();
			}, function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			});
		});
	};

	//点击事件监听函数
	function initListener() {
		//项目立项样式设置
		var _this = Zepto('.projectSteps .mui-table-view-cell span:last-child');
		for(var i = 0; i < _this.length; i++) {
			if(Zepto(_this[i]).text() == '办理中') {
				Zepto(_this[i]).css('color', '#1da02f');
				Zepto(_this[i]).parent().css('border-right', '3px solid #37b74a');
			} else {
				Zepto(_this[i]).css('color', '#ff3b3b');
				Zepto(_this[i]).parent().css('border-right', '3px solid #ff3b3b');
			};
		};

		/*
		 * @description  各阶段type类型
		 * 项目立项阶段       type(0)
		 * 综合评估阶段       type(1)
		 * 建设评审阶段       type(2)
		 * 点击项目详情中的各阶段发生跳转
		 */
		Zepto('.projectSteps ul').on('tap', 'li', function() {
			var _this = Zepto('.projectSteps ul li');
			var projectStepName = Zepto(this).children('span:first-child').text();
			var BiGuid = Zepto('.projectDetail').children('.BiGuid').attr('id');
			var PhaseGuid = this.id;
			WindowTools.createWin('keqiao_projectStep.html','keqiao_projectStep.html',{
				projectStepName: projectStepName,
				PhaseGuid: PhaseGuid,
				BiGuid: BiGuid,
				XMNUMBER: WindowTools.getExtraDataByKey('id'),
				UserPK: UserPK
			});
		});
	};

	//请求项目详情数据
	/**
	 * @description 请求项目详情数据
	 */
	function ajaxProjectDetailData() {
		var url = config.extraServerUrl + '/AuditXiangMu_KQ/GetXMDetail';
		var requestData = {};
		requestData.ValidateData = Token;
		var data = {
			XMNUMBER: WindowTools.getExtraDataByKey('id')
		};
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log("" + url);
		console.log("xxxxxxxxxxx" + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				console.log("xxxxxxxxxxxxxx" + JSON.stringify(response));
				if(response.ReturnInfo.Code == 0) {
					//显示toast
					UITools.toast(response.ReturnInfo.Description);
					return;
				} else if(response.BusinessInfo.Code == 0) {
					//显示toast
					UITools.toast(response.BusinessInfo.Description);
					return;
				};
				//var litemplate = '<li class="mui-table-view-cell"><i id="{{BiGuid}}" class="BiGuid"></i><i id="{{RowGuid}}"></i><i class="XMTYPE" id="{{XMTYPE}}"></i><span>项目名称：</span><span>{{XMNAME}}</span></li><li class="mui-table-view-cell"><span>项目编码：</span><span>{{XMNUMBER}}</span></li><li class="mui-table-view-cell"><span>企业名称：</span><span>{{SBDW}}</span></li><li class="mui-table-view-cell"><span>企业代码：</span><span>{{LEREP_CERTNO}}</span></li><li class="mui-table-view-cell"><span>等其他信息：</span><span>{{OTHERMESSAGE}}</span></li>';
				Zepto('.projectDetail li').children('span:last-child').html('');
				Zepto('.xmName').text(response.UserArea.XMNAME);
				Zepto('.xmCode').text(response.UserArea.XMNUMBER);
				Zepto('.coName').text(response.UserArea.SBDW);
				Zepto('.coCode').text(response.UserArea.LEREP_CERTNO);
				Zepto('.BiGuid').attr('id', response.UserArea.BiGuid);
				if(response.UserArea.OTHERMESSAGE) {
					Zepto('.otherInfo').text(response.UserArea.OTHERMESSAGE);
				} else {
					Zepto('.otherInfo').text('无');
				};
				var litemplate1 = '<li id="{{PhaseGuid}}"class="mui-table-view-cell"><span>{{PhaseName}}</span><span>{{Status}}</span></li>';
				//var output = Mustache.render(litemplate, response.UserArea);
				var output1 = '';
				var tempArray = [];
				mui.each(response.UserArea.PhaseList, function(key, value) {
					output1 += Mustache.render(litemplate1, value.PhaseInfo);
				});
				//Zepto('.projectDetail ul').html('');
				//Zepto('.projectDetail ul').append(output);
				Zepto('.projectSteps ul').html('');
				Zepto('.projectSteps ul').append(output1);
				//初始化监听事件
				initListener();
			},
			error: function() {
				//显示toast
				UITools.toast('网络连接超时！请检查网络...');
			}
		});
	};
});