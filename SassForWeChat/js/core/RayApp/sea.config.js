! function(o) {
	"use strict";

	function s(o) {
		if(/^(http|https|ftp)/g.test(o)) return o;
		var s = o.indexOf("./") != -1 || o.indexOf("../") != -1;
		if(!s) {
			var e = window.location.pathname,
				p = window.location.protocol,
				a = "",
				l = window.navigator.userAgent;
			a = l.match(/Html5Plus/i) && p.indexOf("http") === -1 && p.indexOf("https") === -1 ? e.substr(0, e.indexOf("/www/") + 5) : e.substr(0, e.lastIndexOf("/html/") + 1);
			for(var r = e.replace(a, ""), T = r.split("/").length - 1, y = 0; y < T; y++) o = "../" + o
		}
		return o
	}
	return window.seajs ? (window.cacheConfig_Ray && window.cacheConfig_Ray.TIME_STAMP ? window.seaConfig_Ray = window.cacheConfig_Ray : window.seaConfig_Ray = {
		TIME_STAMP: "_t=20160522"
	}, void seajs.config({
		charset: "utf-8",
		base: s(""),
		alias: {
			Config_Core: "js/core/RayApp/RayApp.Config.js",
			CommonTools_Core: "js/core/RayApp/Tools/RayApp.CommonTools.js",
			FileTools_Core: "js/core/RayApp/Tools/RayApp.FileTools.js",
			HtmlTools_Core: "js/core/RayApp/Tools/RayApp.HtmlTools.js",
			StorageTools_Core: "js/core/RayApp/Tools/RayApp.StorageTools.js",
			WindowTools_Core: "js/core/RayApp/Tools/RayApp.WindowTools.js",
			DownLoadTools_Core: "js/core/RayApp/Tools/RayApp.DownLoadTools.js",
			UpLoadPlusTools_Core: "js/core/RayApp/Tools/RayApp.UpLoadPlusTools.js",
			UpLoadH5Tools_Core: "js/core/RayApp/Tools/RayApp.UpLoadH5Tools.js",
			ImageLoaderTools_Core: "js/core/RayApp/Tools/RayApp.ImageLoaderTools.js",
			ImageTools_Core: "js/core/RayApp/Tools/RayApp.ImageTools.js",
			GallerySliderTools_Core: "js/core/RayApp/Tools/RayApp.GallerySliderTools.js",
			KeyBoardTools_Core: "js/core/RayApp/Tools/RayApp.KeyBoardTools.js",
			NotificationTools_Core: "js/core/RayApp/Tools/RayApp.NotificationTools.js",
			MediaTools_Core: "js/core/RayApp/Tools/RayApp.MediaTools.js",
			UpdateTools_Core: "js/core/RayApp/Tools/RayApp.UpdateTools.js",
			UITools_Core: "js/core/RayApp/Tools/RayApp.UITools.js",
			CharsetTools_Core: "js/core/RayApp/Tools/RayApp.CharsetTools.js",
			DateTools_Core: "js/core/RayApp/Tools/RayApp.DateTools.js",
			EchartsTools_Core: "js/core/RayApp/Tools/RayApp.EchartsTools.js",
			IDCardTools_Core: "js/core/RayApp/Tools/RayApp.IDCardTools.js",
			Md5Tools_Core: "js/core/RayApp/Tools/RayApp.Md5Tools.js",
			JSONTools_Core: "js/core/RayApp/Tools/RayApp.JSONTools.js",
			StringTools_Core: "js/core/RayApp/Tools/RayApp.StringTools.js",
			VerifyCodeTools_Core: "js/core/RayApp/Tools/RayApp.VerifyCodeTools.js",
			PullToRefresh_Base_Default_Core: "js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Default.js",
			PullToRefresh_Base_Type0_Core: "js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type0.js",
			PullToRefresh_Base_Type1_Core: "js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type1.js",
			PullToRefresh_Base_Type1__Material1_Core: "js/core/RayApp/Tools/RayApp.PullToRefresh.Base.Type1.material1.js",
			PullToRefresh_Impl_Default_Core: "js/core/RayApp/Tools/RayApp.PullToRefresh.Impl.Default.js"
		},
		paths: {
			js_bizlogic: "js/bizlogic/",
			js_core: "js/core/"
		},
		vars: {
			debug: "debug-v1"
		},
		map: [
			[/^(.*\.(?:css|js))(.*)$/i, "$1?" + seaConfig_Ray.TIME_STAMP]
		]
	})) : void console.error("error:seajs.config文件必须在sea.js文件后引入!")
}(window);