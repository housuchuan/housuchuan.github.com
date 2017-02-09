define(function(require, exports, module) {
	"use strict";
	var i = (require("CommonTools_Core"), require("HtmlTools_Core"));
	exports.addGalleryLandscape = function(e, t, r, a) {
		if(null == t || !Array.isArray(t) || t.length < 0) return void console.error("错误:JSON数据格式不对!");
		if(null == e) return void console.error("错误:元素选择器为空!");
		if(e instanceof HTMLElement);
		else if("string" == typeof e && (e = i.$domByStr(e), null == e)) return void console.error("错误:不存在该元素选择器!");
		a = a || {}, a.isShowIndicator = null == a.isShowIndicator || "boolean" != typeof a.isShowIndicator || a.isShowIndicator, a.isShowPageIndicator = null != a.isShowPageIndicator && "boolean" == typeof a.isShowPageIndicator && a.isShowPageIndicator, a.perLineItem = null != a.perLineItem && "number" == typeof a.perLineItem && a.perLineItem > 0 ? a.perLineItem : 2, a.perLineItem = a.perLineItem % 5, a.maxImgHeight = null != a.maxImgHeight && "string" == typeof a.maxImgHeight ? a.maxImgHeight : "100%", a.minImgHeight = null != a.minImgHeight && "string" == typeof a.minImgHeight ? a.minImgHeight : null, a.isLoop = null == a.isLoop || "boolean" != typeof a.isLoop || a.isLoop, a.isAuto = null != a.isAuto && "boolean" == typeof a.isAuto && a.isAuto, a.autoTime = null != a.autoTime && "number" == typeof a.autoTime && a.autoTime >= 0 ? a.autoTime : 3e3;
		var o = t.length,
			n = "";
		n += '<div class="mui-slider">', n += a.isLoop ? '<div class="mui-slider-group mui-slider-loop">' : '<div class="mui-slider-group">';
		var s = function(i, e) {
				var t = "";
				t += e ? '<div class="mui-slider-item mui-slider-item-duplicate" >' : '<div class="mui-slider-item">';
				var r = i.id ? "id=" + i.id : "",
					o = a.maxImgHeight ? "max-height:" + a.maxImgHeight + ";" : "",
					n = a.minImgHeight ? "min-height:" + a.minImgHeight + ";" : "";
				return t += '<a class="slider-img-item"' + r + ">", t += '<img data-preview-src="" data-preview-group="1" src="' + i.url + '" style="' + o + n + '">', i.title && (t += '<p class="mui-slider-title">' + i.title + "</p>"), t += "</a>", t += "</div>"
			},
			m = function(i, e) {
				var t = "";
				t += e ? '<div class="mui-slider-item mui-slider-item-duplicate" >' : '<div class="mui-slider-item">', t += '<ul class="mui-table-view mui-grid-view">';
				for(var r = i.length, o = "mui-col-xs-" + 12 / a.perLineItem, n = 0; n < r; n++) {
					var s = i[n].id ? "id=" + i[n].id : "",
						m = a.maxImgHeight ? "max-height:" + a.maxImgHeight + ";" : "",
						l = a.minImgHeight ? "min-height:" + a.minImgHeight + ";" : "";
					t += ' <li class="mui-table-view-cell mui-media slider-img-item ' + o + '" ' + s + ">", t += "<a> ", t += '<img class="mui-media-object" src="' + i[n].url + '" style="' + m + l + '">', i[n].title && (t += '<div class="mui-media-body">' + i[n].title + "</div>"), t += "</a>", t += "</li>"
				}
				return t += "</ul>", t += "</div>"
			};
		if(a.isLoop) {
			var l = o - 1;
			n += Array.isArray(t[l]) ? m(t[l], !0) : s(t[l], !0)
		}
		for(var u = 0; u < o; u++) n += Array.isArray(t[u]) ? m(t[u], !1) : s(t[u], !1);
		if(a.isLoop) {
			var l = 0;
			n += Array.isArray(t[l]) ? m(t[l], !0) : s(t[l], !0)
		}
		if(n += "</div>", a.isShowIndicator) {
			n += '<div class="mui-slider-indicator">';
			for(var u = 0; u < o; u++) n += 0 == u ? '<div class="mui-indicator mui-active"></div>' : '<div class = "mui-indicator"></div>';
			n += "</div>"
		}
		a.isShowPageIndicator && (n += '<div class="mui-slider-indicator">', n += '<span class="mui-action mui-action-previous mui-icon mui-icon-back"></span>', n += '<div class="mui-number">', n += '<span id="curr-gallery-index">1</span> / <span id="gallery-length">' + o + "</span>", n += "</div>", n += '<span class="mui-action mui-action-next mui-icon mui-icon-forward"></span>', n += "</div>"), n += "</div>", e.innerHTML = "", i.appendHtmlChildCustom(e, n);
		var d = mui(e),
			c = 0;
		return a.isAuto && (c = a.autoTime), d.slider({
			interval: c
		}), mui(e).on("tap", ".slider-img-item", function(i) {
			var e = this.getAttribute("id");
			return i.preventDefault(), r && r(i, e), !1
		}), a.isShowIndicator && mui(e).on("tap", ".mui-slider-indicator .mui-indicator", function(i) {
			var e = [].indexOf.call(this.parentNode.childNodes, this);
			return d.slider().gotoItem(e), i.preventDefault(), !1
		}), a.isShowPageIndicator && (mui(e).on("tap", ".mui-slider-indicator .mui-action-previous", function(i) {
			return d.slider().prevItem(), i.preventDefault(), !1
		}), mui(e).on("tap", ".mui-slider-indicator .mui-action-next", function(i) {
			return d.slider().nextItem(), i.preventDefault(), !1
		})), d
	}
});