/**
 * 作者: 朱晓琪
 * 时间：2016-05-17
 * 描述：学员风采父页面 pad js
 */
define(function(require, exports, module) {
	"use strict"
	//调用windows框架
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	//引入CommonUtil
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	CommonUtil.initReady(function(){
		var Options=[{
			url:'szpark_xyfclist_padV.html',
			id:'szpark_xyfclist_padV.html',
			styles:{
				top:'44px',
				bottom:'0px'
			}
		}]
		WindowUtil.createSubWins(Options,true);
	})
});