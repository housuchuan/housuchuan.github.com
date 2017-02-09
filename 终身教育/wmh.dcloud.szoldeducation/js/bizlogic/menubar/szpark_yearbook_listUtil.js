/**
 * 描述 :个人空间(年鉴辅助类) 
 * 作者 :孙尊路
 * 版本 :1.0
 * 时间 :2016-09-01 11:42:49
 */
define(function(require, exports, module) {
	"use strict"
	/**
	 *@description 动态映射年鉴列表模板 
	 * @param {Object} objectData 返回的json数据
	 */
	exports.generateYearBookListHtml = function(objectData) {
		var html = '';
		if(!objectData) {
			//console.error("============获取年鉴列表数据为空！==========");
		} else {
			if(objectData && Array.isArray(objectData)) {
				mui.each(objectData, function(key, value) {
					html += '<div class="year-wrapper-item">';
					html += '<div class="year-log">';
					html += '<img src="../../img/menubar/img-datepicker.png" />';
					html += '<span class="now-year">' + value.year + '</span>';
					html += '</div>';
					html += '<div class="time-wrapper">';
					html += '<div class="time-line"></div>';
					html += '<div class="publish-section">';
					if(value.monthList && Array.isArray(value.monthList)) {
						mui.each(value.monthList, function(key, value) {
							html += '<span class="publish-month">' + value.month + '</span><span class="radius-icon"></span>';
							html += '<div class="publish-area">';
							var litemplate = '<span>{{content}}</span>';
							if(value.contentList && Array.isArray(value.contentList)) {
								mui.each(value.contentList, function(key, value) {
									value.content = unescape(value.content);
									html += Mustache.render(litemplate, value);
								});
							} else {
								html += '<span>' + unescape(value.contentList.content) + '</span>';
							}
							html += '</div>';
						});

					} else {
						html += '<span class="publish-month">' + value.monthList.month + '</span><span class="radius-icon"></span>';
						html += '<div class="publish-area">';
						var litemplate = '<span>{{content}}</span>';
						if(value.MonthList.contentList && Array.isArray(value.MonthList.contentList)) {
							mui.each(value.MonthList.contentList, function(key, value) {
								value.content = unescape(value.content);
								html += Mustache.render(litemplate, value);
							});
						} else {
							html += '<span>' + unescape(value.monthList.contentList.content) + '</span>';
						}
						html += '</div>';
					}
					html += '</div>';
					html += '</div>';
					html += '</div>';
				});

			} else {
				//非数组
				html += '<div class="year-wrapper-item">';
				html += '<div class="year-log">';
				html += '<img src="../../img/menubar/img-datepicker.png" />';
				html += '<span class="now-year">' + objectData.year + '</span>';
				html += '</div>';
				html += '<div class="time-wrapper">';
				html += '<div class="time-line"></div>';
				html += '<div class="publish-section">';
				if(objectData.monthList && Array.isArray(objectData.monthList)) {
					mui.each(objectData.monthList, function(key, value) {
						html += '<span class="publish-month">' + value.month + '</span><span class="radius-icon"></span>';
						html += '<div class="publish-area">';
						var litemplate = '<span>{{content}}</span>';
						if(value.contentList && Array.isArray(value.contentList)) {
							mui.each(value.contentList, function(key, value) {
								value.content = unescape(value.content);
								html += Mustache.render(litemplate, value);
							});
						} else {
							html += '<span>' + unescape(value.contentList.content) + '</span>';
						}
						html += '</div>';
					});

				} else {
					html += '<span class="publish-month">' + objectData.monthList.month + '</span><span class="radius-icon"></span>';
					html += '<div class="publish-area">';
					var litemplate = '<span>{{content}}</span>';
					if(objectData.monthList.contentList && Array.isArray(objectData.monthList.contentList)) {
						mui.each(objectData.monthList.contentList, function(key, value) {
							value.content = unescape(value.content);
							html += Mustache.render(litemplate, value);
						});
					} else {
						html += '<span>' + unescape(objectData.monthList.contentList.content) + '</span>';
					}
					html += '</div>';
				}
			}
		}
		return html;
	};

});