/**
 * @description   移动开发框架
 * @author sunzl  sunzl  by(c) 2014 Matthew Hudson
 * @version 2.0
 * @time 2016-09-14 16:57:57
 * @Device.js is freely distributable under the MIT license.
 * @http://matthewhudson.me/projects/device.js/
 * 功能模块:
 * 常用工具模块****************************************
 * core/MobileFrame/CommonUtil
 * 常用工具类模块完毕*************************************
 */

define(function(require, exports, module) {

	var device,
		previousDevice,
		addClass,
		documentElement,
		find,
		handleOrientation,
		hasClass,
		orientationEvent,
		removeClass,
		userAgent;

	// Save the previous value of the device variable.
	previousDevice = window.device;

	device = {};

	// Add device as a global object.
	window.device = device;

	// The <html> element.
	documentElement = window.document.documentElement;

	// The client user agent string.
	// Lowercase, so we can use the more efficient indexOf(), instead of Regex
	userAgent = window.navigator.userAgent.toLowerCase();

	// Main functions
	// --------------
	/**
	 * @author sunzl 2016-11-07
	 * @description 纯PLUS下获取手机系统信息
	 */
	device.getDeviceInfo = function() {
		var device = {
			IMEI: plus.device.imei, //设备的国际移动设备身份码
			IMSI: '', //设备的国际移动用户识别码
			Model: plus.device.model, //设备的型号
			Vendor: plus.device.vendor, //设备的生产厂商
			UUID: plus.device.uuid, //设备的唯一标识
			Screen: plus.screen.resolutionWidth * plus.screen.scale + 'x' + plus.screen.resolutionHeight * plus.screen.scale + '', //屏幕大小
			DPI: plus.screen.dpiX + 'x' + plus.screen.dpiY, //屏幕分辨率
			OS: new Object() // OS模块管理操作系统信息
		};
		for(var i = 0; i < plus.device.imsi.length; i++) {
			device.IMSI += plus.device.imsi[i];
		}
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = '未知网络';
		types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
		types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
		types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
		types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络';
		device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
		device.OS = {
			Language: plus.os.language,
			Version: plus.os.version,
			Name: plus.os.name,
			Vendor: plus.os.vendor
		};
		return device;
	};
	
	device.ios = function() {
		return device.iphone() || device.ipod() || device.ipad();
	};

	device.iphone = function() {
		return !device.windows() && find('iphone');
	};

	device.ipod = function() {
		return find('ipod');
	};

	device.ipad = function() {
		return find('ipad');
	};

	device.android = function() {
		return !device.windows() && find('android');
	};

	device.androidPhone = function() {
		return device.android() && find('mobile');
	};

	device.androidTablet = function() {
		return device.android() && !find('mobile');
	};

	device.blackberry = function() {
		return find('blackberry') || find('bb10') || find('rim');
	};

	device.blackberryPhone = function() {
		return device.blackberry() && !find('tablet');
	};

	device.blackberryTablet = function() {
		return device.blackberry() && find('tablet');
	};

	device.windows = function() {
		return find('windows');
	};

	device.windowsPhone = function() {
		return device.windows() && find('phone');
	};

	device.windowsTablet = function() {
		return device.windows() && (find('touch') && !device.windowsPhone());
	};

	device.fxos = function() {
		return(find('(mobile;') || find('(tablet;')) && find('; rv:');
	};

	device.fxosPhone = function() {
		return device.fxos() && find('mobile');
	};

	device.fxosTablet = function() {
		return device.fxos() && find('tablet');
	};

	device.meego = function() {
		return find('meego');
	};

	device.cordova = function() {
		return window.cordova && location.protocol === 'file:';
	};

	device.nodeWebkit = function() {
		return typeof window.process === 'object';
	};

	device.mobile = function() {
		return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
	};

	device.tablet = function() {
		return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
	};

	device.desktop = function() {
		return !device.tablet() && !device.mobile();
	};

	device.television = function() {
		var i, tvString;

		television = [
			"googletv",
			"viera",
			"smarttv",
			"internet.tv",
			"netcast",
			"nettv",
			"appletv",
			"boxee",
			"kylo",
			"roku",
			"dlnadoc",
			"roku",
			"pov_tv",
			"hbbtv",
			"ce-html"
		];

		i = 0;
		while(i < television.length) {
			if(find(television[i])) {
				return true;
			}
			i++;
		}
		return false;
	};

	device.portrait = function() {
		return(window.innerHeight / window.innerWidth) > 1;
	};

	device.landscape = function() {
		return(window.innerHeight / window.innerWidth) < 1;
	};

	// Public Utility Functions
	// ------------------------

	// Run device.js in noConflict mode,
	// returning the device variable to its previous owner.
	device.noConflict = function() {
		window.device = previousDevice;
		return this;
	};

	// Private Utility Functions
	// -------------------------

	// Simple UA string search
	find = function(needle) {
		return userAgent.indexOf(needle) !== -1;
	};

	// Check if documentElement already has a given class.
	hasClass = function(className) {
		var regex;
		regex = new RegExp(className, 'i');
		return documentElement.className.match(regex);
	};

	// Add one or more CSS classes to the <html> element.
	addClass = function(className) {
		var currentClassNames = null;
		if(!hasClass(className)) {
			currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '');
			documentElement.className = currentClassNames + " " + className;
		}
	};

	// Remove single CSS class from the <html> element.
	removeClass = function(className) {
		if(hasClass(className)) {
			documentElement.className = documentElement.className.replace(" " + className, "");
		}
	};

	// HTML Element Handling
	// ---------------------

	// Insert the appropriate CSS class based on the _user_agent.

	if(device.ios()) {
		if(device.ipad()) {
			addClass("ios ipad tablet");
		} else if(device.iphone()) {
			addClass("ios iphone mobile");
		} else if(device.ipod()) {
			addClass("ios ipod mobile");
		}
	} else if(device.android()) {
		if(device.androidTablet()) {
			addClass("android tablet");
		} else {
			addClass("android mobile");
		}
	} else if(device.blackberry()) {
		if(device.blackberryTablet()) {
			addClass("blackberry tablet");
		} else {
			addClass("blackberry mobile");
		}
	} else if(device.windows()) {
		if(device.windowsTablet()) {
			addClass("windows tablet");
		} else if(device.windowsPhone()) {
			addClass("windows mobile");
		} else {
			addClass("desktop");
		}
	} else if(device.fxos()) {
		if(device.fxosTablet()) {
			addClass("fxos tablet");
		} else {
			addClass("fxos mobile");
		}
	} else if(device.meego()) {
		addClass("meego mobile");
	} else if(device.nodeWebkit()) {
		addClass("node-webkit");
	} else if(device.television()) {
		addClass("television");
	} else if(device.desktop()) {
		addClass("desktop");
	}

	if(device.cordova()) {
		addClass("cordova");
	}

	// Orientation Handling
	// --------------------

	// Handle device orientation changes.
	handleOrientation = function() {
		if(device.landscape()) {
			removeClass("portrait");
			addClass("landscape");
		} else {
			removeClass("landscape");
			addClass("portrait");
		}
		return;
	};

	// Detect whether device supports orientationchange event,
	// otherwise fall back to the resize event.
	if(Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
		orientationEvent = "orientationchange";
	} else {
		orientationEvent = "resize";
	}

	// Listen for changes in orientation.
	if(window.addEventListener) {
		window.addEventListener(orientationEvent, handleOrientation, false);
	} else if(window.attachEvent) {
		window.attachEvent(orientationEvent, handleOrientation);
	} else {
		window[orientationEvent] = handleOrientation;
	}

	handleOrientation();

	if(typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function() {
			return device;
		});
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = device;
	} else {
		window.device = device;
	}
});
//}).call(this);//去掉define,加上.call(this)直接在外面引用