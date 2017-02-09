/**
 * 
 * 作者：孙尊路
 * 时间：2016-04-05
 * 描述：学员风采父页面
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	CommonUtil.initReady(function(){
		var Options=[{
			url:'szpark_xyfclist.html',
			id:'szpark_xyfclist.html',
			styles:{
				top:'44px',
				bottom:'0px'
			}
		}]
		WindowUtil.createSubWins(Options,true);
	})
});