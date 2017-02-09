/**
 * 
 * 作者：戴科
 * 时间：2016-04-05
 * 描述：终身教育子页面
 */
define(function(require, exports, module) {
	"use strict"
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//每页显示条数
	var PageSize = 10;
	//映射模板
	var Litemplate = '';
	//引入UI操作模块
	var UIUtil = require('core/MobileFrame/UIUtil');
	//引入下拉刷新模块
	var PullRefreshPageUtil = require('core/MobileFrame/PullrefreshUtil');
	//请求地址
	var url = config.ServerUrl + '';
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	CommonUtil.initReady(function() {
	
	});
	

	function getData(currPage) {
		var requestData = {};
		//动态校验字段
		requestData.ValidateData = 'EpointMall';
		var data = {
			
		};
		requestData.paras = data;
		//console.log("基本信息列表请求地址：" + url + "基本信息列表请求数据：" + JSON.stringify(requestData));
		requestData = JSON.stringify(requestData);
		return requestData;

	}
	/**
	 * @description 列表请求成功回调
	 */
	function successCallback(response) {
		//console.log('请求数据成功');
		//console.log(JSON.stringify(response));
	};
	/**
	 * @description 手动处理数据
	 */
	function changeCallback(response) {
		//console.log('请求数据成功');
		//console.log(JSON.stringify(response));
		var outdata = [];
		if (response.UserArea.InfoList.length > 0) {
			for (var i = 0; i < response.UserArea.InfoList.length; i++) {
				outdata[i] = response.UserArea.InfoList[i].Info;
			}
		}
		var newdata = JSON.stringify(outdata);
		//console.log(newdata);
		return outdata;
	};
	/*
	 * @description 初始化下拉刷新控件
	 */
	PullRefreshPageUtil.initPullDownRefresh({
		////是否是debug模式,如果是的话会输出错误提示
		IsDebug: true,
		//是否初始化下拉刷新的时候就请求,如果为false代表需要手动刷新才请求
		mIsRequestFirst: true,
		//接口请求的地址
		mGetUrl: url,
		//请求接口时的参数
		mGetRequestDataFunc: getData,
		//渲染html模板
		mGetLitemplate: Litemplate,
		//默认的列表数据容器id,所有的数据都会添加到这个容器中,这里只接受id
		mListdataId: 'listdata',
		//的列表监听元素选择器,默认为给li标签添加标签
		//如果包含#,则为给对应的id监听
		//如果包含. 则为给class监听
		//否则为给标签监听
		mTargetListItemClickStr: 'li',
		//离线获取数据的函数
		mGetDataOffLineFunc: '',
		//改变数据的函数,代表外部如何处理服务器端返回过来的数据
		mChangeResponseDataFunc: changeCallback,
		//请求成功回调
		mRequestSuccessCallbackFunc: successCallback,
		//列表点击回调
		mOnItemClickCallbackFunc: '',
		ajaxSetting: {
			contentType: "application/json;charset=utf-8"
		},
	});

	
})