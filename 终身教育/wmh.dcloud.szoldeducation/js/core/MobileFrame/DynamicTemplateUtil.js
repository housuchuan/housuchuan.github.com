/**
 * 描述 :动态代码模板映射 工具方法
 * 作者 :sunzl
 * 版本 :1.0
 * 时间 :2016-04-16 17:49:20
 */
define(function(require, exports, module) {
	"use strict";
	/**
	 * @description 首页-调查投票提交页面
	 * @涉及页面【szpark_investigation_submit.html】
	 * @param {Object} jsonArray
	 */
	exports.generateInvestigationItems=function(jsonArray){
		var html = '';
		//单道题目
		if (jsonArray && !Array.isArray(jsonArray)) {
			html += '<div class="subject" id="' + jsonArray.SubjectID + '">';
			html += '<li class="title-item">' + unescape(jsonArray.SubjectName) + '</li>'
			if (jsonArray.Options) {
				//form
				html += '<form class="mui-input-group">';
				var litemplate =
					'<div class="mui-input-row mui-radio mui-left"><label>{{OptionName}}</label><input name="checkbox"value="{{OptionID}}"type="radio" class="radio-class"/></div>';
				if (Array.isArray(jsonArray.Options)) {
					//单道题目，多个选项
					for (var j = 0, lenJ = jsonArray.Options.length; j < lenJ; j++) {
						jsonArray.Options[j].OptionName = unescape(jsonArray.Options[j].OptionName);
						html += Mustache.render(litemplate, jsonArray.Options[j]);
					}
				} else {
					//单道题目，多个选项
					jsonArray.Options.OptionName = unescape(jsonArray.Options.OptionName);
					html += Mustache.render(litemplate, jsonArray.Options);
				}
				html += '</form>';
			}
			//补齐
			html += '</div>';
		}else{
			//判断是否是数组;多道题目时
			for (var i = 0, len = jsonArray.length; i < len; i++) {
			var tmpInfo = jsonArray[i];
			html += '<div class="subject" id="' + tmpInfo.SubjectID + '">';
			html += '<li class="title-item">' + unescape(tmpInfo.SubjectName) + '</li>';
			if (tmpInfo && tmpInfo.Options) {
				//form
				html += '<form class="mui-input-group">';
				var litemplate =
					'<div class="mui-input-row mui-radio mui-left"><label>{{OptionName}}</label><input name="checkbox"value="{{OptionID}}"type="radio" class="radio-class"/></div>';
				if (Array.isArray(tmpInfo.Options)) {
					//多个选项
					for (var j = 0, lenJ = tmpInfo.Options.length; j < lenJ; j++) {
						tmpInfo.Options[j].OptionName = unescape(tmpInfo.Options[j].OptionName);
						html += Mustache.render(litemplate, tmpInfo.Options[j]);
					}
				} else {
					//单个选项
					tmpInfo.Options.OptionName = unescape(tmpInfo.Options.OptionName);
					html += Mustache.render(litemplate, tmpInfo.Options);
				}
				html += '</form>';
			}

			//补齐
			html += '</div>';
		}
		}
		return html;
	}
});