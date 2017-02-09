define(function(require, exports, module) {
	"use strict";
	/**
	 * @description 动态生成点播(bcloud的页面
	 * @param tempInfo 接口返回的数据 一般是临时数组
	 */
	exports.generateBcloudHtml = function(tempInfo) {
		var html = '';
		if(tempInfo) {
			if(Array.isArray(tempInfo)) {
				mui.each(tempInfo, function(key, value) {
					html += '<li id="' + value.columnId + '">';
					html += '<div>';
					html += '<div class="courseNameTitle">' + value.columnTitle + '</div>';
					html += '<div class="courseInfoList">';
					html += '<div class="courseNameIcon">';
					html += '<div class="courseNameIcon1">' + (value.columnTitle).substring(0, 1) + '</div>';
					html += '<div class="courseNameIcon2">' + (value.columnTitle).substring(1, 2) + '</div>';
					html += '</div>';
					html += '<div class="courseName">';
					if(value.column) {
						var column = value.column;
						var litemp = '<span id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></span>';
						if(Array.isArray(column)) {
							mui.each(column, function(key, value) {
								html += Mustache.render(litemp, value);
							});
						} else {
							html += Mustache.render(litemp, column);
						}
					}
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</li>';

				});
			} else {
				html += '<li id="' + tempInfo.columnId + '">';
				html += '<div>';
				html += '<div class="courseNameTitle">' + tempInfo.columnTitle + '</div>';
				html += '<div class="courseInfoList">';
				html += '<div class="courseNameIcon">';
				html += '<div class="courseNameIcon1">' + tempInfo.columnTitle.substring(0, 1) + '</div>';
				html += '<div class="courseNameIcon2">' + tempInfo.columnTitle.substring(1, 2) + '</div>';
				html += '</div>';
				html += '<ul class="courseName">';
				if(tempInfo.column) {
					var column = tempInfo.column;
					var litemp = '<li id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></li>';
					if(Array.isArray(column)) {
						mui.each(column, function(key, value) {
							html += Mustache.render(litemp, value);
						});
					} else {
						html += Mustache.render(litemp, column);
					}
				}
				html += '</ul>';
				html += '</div>';
				html += '</div>';
				html += '</li>';
			}
		}
		return html;
	};
	/**
	 * @description 动态生成直播(blive)的页面
	 * @param tempInfo 接口返回的数据 一般是临时数组
	 */
	exports.generateBliveHtml = function(tempInfo) {
		var html = '';
		if(tempInfo) {
			if(Array.isArray(tempInfo)) {
				mui.each(tempInfo, function(key, value) {
					var title = value.columnTitle;
					var title1 = title.substring(0, 1);
					var title2 = title.substring(1, 2);
					html += '<div id="' + value.columnId + '" class="courseNameTitle mui-clearfix">' + '<span>' + value.columnTitle + '</span>' + '</div><div class="mui-scroll-wrapper classifyList"><div class="mui-scroll" ><div class="courseInfoList"><div class="courseNameIcon"><div class="courseNameIcon1">' + title1 + '</div><div class="courseNameIcon2">' + title2 + '</div></div>';
					if(value.column) {
						if(Array.isArray(value.column)) {
							html += '<ul class="courseName">';
							var output1 = '';
							mui.each(value.column, function(key, value) {
								var litemplate = '<li id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></li>';
								output1 += Mustache.render(litemplate, value);
							})
							html += output1;
							html += '</ul>';
						} else {
							var litemplate = '<ul class="courseName"><li id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></li></ul>';
							var output = Mustache.render(litemplate, value.column);
							html += output;
						}
					}
					html += '</div></div></div>';
				});
			} else {
				var title1 = (tempInfo.columnTitle).substring(0, 1);
				var title2 = (tempInfo.columnTitle).substring(1, 2);
				html += '<div id="' + tempInfo.columnId + '" class="courseNameTitle mui-clearfix">' + '<span>' + tempInfo.columnTitle + '</span>' + '</div><div class="mui-scroll-wrapper classifyList"><div class="mui-scroll" ><div class="courseInfoList"><div class="courseNameIcon"><div class="courseNameIcon1">' + title1 + '</div><div class="courseNameIcon2">' + title2 + '</div></div>';
				if(tempInfo.column) {
					if(Array.isArray(tempInfo.column)) {
						html += '<ul class="courseName">';
						var output2 = '';
						mui.each(tempInfo.column, function(key, value) {
							var litemplate = '<li id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></li>';
							output2 += Mustache.render(litemplate, value);
						})
						html += output2;
						html += '</ul>';
					} else {
						var litemplate = '<ul class="courseName"><li id="{{childColumnId}}"><div class="innerBorder">{{columnItems}}</div></li></ul>';
						var output3 = Mustache.render(litemplate, tempInfo.column);
						html += output3;
					}
				}
				html += '</div></div></div>';
			}
		}
		return html;
	};

	//TODO END
});