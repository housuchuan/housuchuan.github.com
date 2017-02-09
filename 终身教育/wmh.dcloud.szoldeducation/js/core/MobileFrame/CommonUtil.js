/**
 * @description   移动开发框架
 * @author dailc  dailc 
 * @version 2.0
 * @time 2016-01-11 16:57:57
 * 功能模块:
 * 常用工具模块****************************************
 * core/MobileFrame/CommonUtil
 * 0.initReady 操作,plus下为plusready,h5下直接回调
 * 1.包含一个plusReady 操作
 * 2.包含一个 each操作
 * 3.IsInclude 判断是否包含文件
 * 4.IsNetWorkCanUse 判断是否有网络
 * 5.compareVersion 比较两个版本大小
 * 6.getRelativePathKey 得到一个path的key-这个key是去除了非法字符的,可以用来本地缓存
 * 7.changImgUrlTypeWithRandomKey 将url后面加上随机的key,用来去除缓存,否则同一个url会有缓存
 * 8.getUrlParamsValue 得到url中特定参数的值
 * 常用工具类模块完毕*************************************
 */
define(function(require, exports, module) {
	"use strict";
	//condig
	var Config = {
		info: {
			TIME_STAMP: 'default'
		}
	};
	/**
	 * 空函数
	 */
	exports.noop = function() {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	exports.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if(typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}
		if(typeof target !== "object" && !exports.isFunction(target)) {
			target = {};
		}
		if(i === length) {
			target = this;
			i--;
		}
		for(; i < length; i++) {
			if((options = arguments[i]) != null) {
				for(name in options) {
					src = target[name];
					copy = options[name];
					if(target === copy) {
						continue;
					}
					if(deep && copy && (exports.isPlainObject(copy) || (copyIsArray = exports.isArray(copy)))) {
						if(copyIsArray) {
							copyIsArray = false;
							clone = src && exports.isArray(src) ? src : [];

						} else {
							clone = src && exports.isPlainObject(src) ? src : {};
						}

						target[name] = exports.extend(deep, clone, copy);
					} else if(copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	};
	/**
	 *  isFunction
	 */
	exports.isFunction = function(value) {
		return exports.type(value) === "function";
	};
	/**
	 *  isPlainObject
	 */
	exports.isPlainObject = function(obj) {
		return exports.isObject(obj) && !exports.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	exports.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 *  isWindow(需考虑obj为undefined的情况)
	 */
	exports.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 *  isObject
	 */
	exports.isObject = function(obj) {
		return exports.type(obj) === "object";
	};
	exports.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * @description each遍历操作
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {global}
	 */
	exports.each = function(elements, callback, hasOwnProperty) {
		if(!elements) {
			return this;
		}
		if(typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for(var key in elements) {
				if(hasOwnProperty) {
					if(elements.hasOwnProperty(key)) {
						if(callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if(callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	var class2type = {};
	exports.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	/**
	 * exports.fn
	 */
	exports.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};
	/**
	 * @description 模拟Class的基类,以便模拟Class进行继承等
	 * 仿照mui写的
	 */
	(function() {
		//同时声明多个变量,用,分开要好那么一点点
		var initializing = false,
			//通过正则检查是否是函数
			fnTest = /xyz/.test(function() {
				xyz;
			}) ? /\b_super\b/ : /.*/;
		var Class = function() {};
		//很灵活的一种写法,直接重写Class的extend,模拟继承
		Class.extend = function(prop) {
			var _super = this.prototype;
			initializing = true;
			//可以这样理解:这个prototype将this中的方法和属性全部都复制了一遍
			var prototype = new this();
			initializing = false;
			for(var name in prop) {
				//这一些列操作逻辑并不简单，得清楚运算符优先级
				//逻辑与的优先级是高于三元条件运算符的,得注意下
				//只有继承的函数存在_super时才会触发(哪怕注释也一样进入)
				//所以梳理后其实一系列的操作就是判断是否父对象也有相同对象
				//如果有,则对应函数存在_super这个东西
				prototype[name] = typeof prop[name] == "function" &&
					typeof _super[name] == "function" && fnTest.test(prop[name]) ?
					(function(name, fn) {
						return function() {
							var tmp = this._super;
							this._super = _super[name];
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret;
						};
					})(name, prop[name]) :
					prop[name];
			}
			/**
			 * @description Clss的构造,默认会执行init方法
			 */
			function Class() {
				if(!initializing && this.init) {
					this.init.apply(this, arguments);
				}
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			//callee 的作用是返回当前执行函数的自身
			//这里其实就是this.extend,不过严格模式下禁止使用
			//Class.extend = arguments.callee;
			//替代callee 返回本身
			Class.extend = this.extend;
			return Class;
		};
		exports.Class = Class;
	})();
	/**
	 * @description 判断os系统,非5+
	 * exports.os
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = {};
			this.os.name = 'browser';
			var funcs = [
				function() { //wechat
					var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
					if(wechat) { //wechat
						this.os.wechat = {
							version: wechat[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'wechat';
					}
					return false;
				},
				function() { // QQ browser
					//console.log('ua:'+ua);
					var browserQQ = ua.match(/(QQBrowser)\/([\d\.]+)/i);
					if(browserQQ) { //wechat
						this.os.browserQQ = {
							version: browserQQ[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'browserQQ';
					}
					return this.os.browserQQ === true;
				},
				function() { // mobile QQ
					//这个判断是否是手机QQ客户端
					//console.log('ua:'+ua);
					var mobileQQClient = ua.match(/(QQ)\/([\d\.]+)/i);
					if(mobileQQClient) { //wechat
						this.os.mobileQQClient = {
							version: mobileQQClient[2].replace(/_/g, '.')
						};
						this.os.name += '_' + 'mobileQQClient';
					}
					return this.os.mobileQQClient === true;
				},
				function() { //android
					var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
					if(android) {
						this.os.android = true;
						this.os.version = android[2];
						this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
						this.os.name += '_' + 'Android';
						this.os.name += '_' + 'mobile';
					}
					return this.os.android === true;
				},
				function() { //ios
					var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
					if(iphone) { //iphone
						this.os.ios = this.os.iphone = true;
						this.os.version = iphone[2].replace(/_/g, '.');
						this.os.name += '_' + 'iphone';
						this.os.name += '_' + 'mobile';
					} else {
						var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
						if(ipad) { //ipad
							this.os.ios = this.os.ipad = true;
							this.os.version = ipad[2].replace(/_/g, '.');
							this.os.name += '_' + 'iOS';
							this.os.name += '_' + 'mobile';
						}

					}
					return this.os.ios === true;
				}
			];
			[].every.call(funcs, function(func) {
				return !func.call(exports);
			});
		}
		detect.call(exports, navigator.userAgent);
	})();
	/**
	 * @description description 判断os系统,5+情况
	 * exports.os.plus
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = this.os || {};
			var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
			if(plus) {
				this.os.plus = true;
				document.body.classList.add('plus');
				if(ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
					this.os.stream = true;
					document.body.classList.add('plus-stream');
					this.os.name += '_' + 'StreamApp';
				}
				this.os.name += '_' + 'plus';
			}
		}
		detect.call(exports, navigator.userAgent);
	})();
	/**
	 * @description initReady,plus情况为plusready,普通情况为直接回调
	 * @param {Function} callback
	 * @returns {global} 返回的是global
	 */
	exports.initReady = function(callback) {
		if(window.plus) {
			//如果plus已经好了
			callback && callback(true);
		} else {
			//如果是plus系统存在,添加plusready监听
			if(exports.os.plus) {
				exports.plusReady(function() {
					callback && callback(true);
				});
			} else {
				if(window.mui) {
					mui.ready(function() {
						callback && callback(false);
					});
				} else {
					//由于用了define AMD模块化开发,所以现在肯定已经加载完毕了
					callback && callback(false);
				}
			}
		}
		return this;
	};
	/**
	 * @description plusReady
	 * @param {Function} callback
	 * @returns {global} 返回的是global
	 */
	exports.plusReady = function(callback) {
		if(window.plus) {
			setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
				callback();
			}, 0);
		} else {
			document.addEventListener("plusready", function() {
				callback();
			}, false);
		}
		return this;
	};
	/**
	 * @description 判断网络状态
	 */
	function GetNetWorkState() {
		if(!window.plus) {
			//当非plus时,直接默认为已联网
			return '无法判断网络';
		}
		var NetStateStr = '未知';
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		NetStateStr = types[plus.networkinfo.getCurrentType()];

		return NetStateStr;
	};
	/**
	 * @description 判断是否有网络
	 * @return {Boolean} 判断是否有网络,plus情况有用H5情况默认返回true
	 */
	exports.IsNetWorkCanUse = function() {
		var IsCanUseNetWork = false;
		if(GetNetWorkState() == '未知' || GetNetWorkState() == '未连接网络') {
			IsCanUseNetWork = false;
		} else {
			IsCanUseNetWork = true;
		}
		return IsCanUseNetWork;
	};
	/**
	 * @description 判断是否存在js或者css
	 * @param {String} name js或者css的名字
	 * @return {Boolean} 返回是否有引用对应脚本或css
	 */
	exports.IsInclude = function(name) {
		var js = /js$/i.test(name);
		var es = document.getElementsByTagName(js ? 'script' : 'link');
		for(var i = 0; i < es.length; i++)
			if(es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
		return false;
	};
	/**
	 * @description 比较两个版本大小
	 * 比较版本大小，如果新版本nowVersion大于旧版本OldResourceVersion则返回true，否则返回false
	 * @param {String} OldVersion
	 * @param {String} nowVersion
	 * @return {Boolean} 如果新版本nowVersion大于旧版本OldResourceVersion则返回true，否则返回false
	 */
	exports.compareVersion = function(OldVersion, nowVersion) {
		if(!OldVersion || !nowVersion || OldVersion == '' || nowVersion == '') {

			return false;
		}
		//第二份参数 是 数组的最大长度
		var OldVersionA = OldVersion.split(".", 4);
		var nowVersionA = nowVersion.split(".", 4);
		for(var i = 0; i < OldVersionA.length && i < nowVersionA.length; i++) {
			var strOld = OldVersionA[i];
			var numOld = parseInt(strOld);
			var strNow = nowVersionA[i];
			var numNow = parseInt(strNow);
			//小版本到高版本
			if(numNow > numOld
				//||strNow.length>strOld.length
			) {
				return true;
			} else if(numNow < numOld) {
				return false;
			}
		}
		//如果是版本  如 1.6 - 1.6.1
		if(nowVersionA.length > OldVersionA.length && 0 == nowVersion.indexOf(OldVersion)) {
			return true;
		}
	};
	/**
	 * @description 得到相对路径对应的key,这个key可以使缓存池的或者是本地缓存键值
	 * 主要作用是去除非法字符
	 * @param {String} relativePath
	 * @return {String} 返回相对路径
	 */
	exports.getRelativePathKey = function(relativePath) {
		var finalKey =
			//					relativePath.replace('\/', '').replace('.', '').replace('\/', '')
			//					.replace('_download', '').replace('jpg', '');
			relativePath.replace(/[&\|\\\*^%$#@\-]/g, "");
		return finalKey;
	};
	/**
	 * @description 更改url类型,去除cache,因为cache会造成一些困扰
	 * 具体做法为给url最后加上timeRandKey= Math.random();
	 * @param {String} url 传入的url
	 *  @return {String} 返回处理后的url
	 */
	exports.changImgUrlTypeWithRandomKey = function(url) {
		url = url || '';
		if(url.indexOf('?') != -1) {
			url += '&timeRandKey=' + Math.random();
		} else {
			url += '?timeRandKey=' + Math.random();
		}
		return url;
	};
	/**
	 * @description 普通的html href通过传入参数名,得到对应的参数值
	 * @param {String} url 目标url
	 * @param {String} paramName 参数名
	 * @return {String} 返回对应的参数值
	 */
	exports.getUrlParamsValue = function(url, paramName) {
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {}
		var i, j;
		for(i = 0; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paramName.toLowerCase()];
		//需要解码浏览器编码
		returnValue = decodeURI(returnValue);
		if(typeof(returnValue) == "undefined") {
			return undefined;
		} else {
			return returnValue;
		}
	};

	/**
	 * @description 播发电话
	 * @param {Number} phone
	 */
	exports.callPhone = function(phone) {
		//拨打电话
		if(window.plus) {
			plus.device.dial(phone, true);
		} else {
			window.location.href = 'tel:' + phone;
		}
	};
	/**
	 * @description sendMsg
	 * @param {String} phone
	 */
	exports.sendMsg = function(phone) {
		window.location.href = 'sms:' + phone;
	};
	/**
	 * @description 产生一个四位随机数uuid-取自stackoverflow
	 */
	function S4() {
		return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	/**
	 * @description 产生一个 唯一uuid-guid
	 * @return {String} 返回一个随机性的唯一uuid
	 */
	exports.randUUID = function() {
		return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	};
	/**
	 * @description 得到一个项目的根路径
	 * h5模式下例如:http://id:端口/项目名/
	 * plus模式下android中如:file:////mnt/sdcard/Android/data/项目包名/.HBuilder/apps/HBuilder/www/
	 * @return {String} 项目的根路径
	 * BUG整理:
	 * Plus.io.convertLocalFileSystemURL(‘_www/’),调用这个函数时,
	 * 返回的路径不全只返回了'apps/H5***后面的内容后,
	 * 正常全路径应该是(storage/emulated/0/Android/data/包名/apps…)
	 * 原因:
	 * 打包的时候,manifest里面没有选择解压资源后运行(默认是不解压直接运行),所以无法获取全路径
	 * 解决:打包时,manifest中将选项选为 解压资源后运行
	 */
	exports.getProjectBasePath = function() {
		var basePath = '';
		//plus下要用plus的方法找取
		if(exports.os.plus) {
			//事实证明这两个路径一致
			var pathParent = window.location.pathname;
			//var pathParent = plus.io.convertLocalFileSystemURL("_www/");
			//5+情况,找到/www/结构的目录作为根目录
			basePath = pathParent.substr(0, pathParent.indexOf("/www/") + 5);
			if(basePath.indexOf('file://') === -1) {
				basePath = 'file://' + basePath;
			}
		} else {
			var obj = window.location;
			var patehName = obj.pathname;
			//h5
			var contextPath = '';
			//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
			//普通浏览器
			if(patehName.indexOf(':/') !== -1) {
				//如果是包含了完整路径 如 http:...或  E:...
				contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
			} else {
				//普通相对路径 如/项目名/html/...
				contextPath = '/' + patehName.split("/")[1] + '/';
			}
			//var contextPath = obj.pathname.split("/")[1] + '/';
			basePath = obj.protocol + "//" + obj.host + contextPath;
		}

		return basePath;
	};
	/**
	 * @description 得到一个全路径
	 * @param {String} path
	 */
	exports.getFullPath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}

		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? path : (exports.getProjectBasePath() + '/')) + path;

		return path;
	};
	/**
	 * @description 得到一个相对路径
	 * 根据目前的层级,将普通路径变为相对路径
	 * 相对路径的好处是,比如打包后可以不解压资源直接运行也不会出错
	 * @param {String} path
	 */
	exports.getRealativePath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}
		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;
		if(!isRelative) {
			//如果不是相对路径转为相对路径
			//只需要判断当前是在项目的第几个层级就可以加上多少个../
			var patehName = window.location.pathname;
			var protocol = window.location.protocol;
			//项目的根路径文件夹
			//var contextPath = '/'+ patehName.split("/")[1] +'/';
			var contextPath = '';
			var ua = window.navigator.userAgent;
			if(ua.match(/Html5Plus/i) && protocol.indexOf('http') === -1 && protocol.indexOf('https') === -1) {
				//plus下-而且不是远程加载-远程加载的判断条件为包含http://或包含https://
				contextPath = patehName.substr(0, patehName.indexOf("/www/") + 5);
			} else {
				//普通浏览器
				//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
				//普通浏览器
				if(patehName.indexOf(':/') !== -1) {
					//如果是包含了完整路径 如 http:...或  E:...
					contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
				} else {
					//普通相对路径 如/项目名/html/...
					contextPath = '/' + patehName.split("/")[1] + '/';
				}
				//contextPath = '/' + patehName.split("/")[1] + '/';
			}
			//完成路径-根路径 = 剩余的实际路径
			var remainPath = patehName.replace(contextPath, '');
			//处理//情况,如果第一个仍然为/,去除
			if(remainPath.substring(0, 1) === '/') {
				remainPath = remainPath.substring(1, remainPath.length);
			}
			//根据实际路径获取当前页面所在层级
			//层级
			var level = remainPath.split('/').length - 1;
			for(var i = 0; i < level; i++) {
				path = '../' + path;
			}
		}
		return path;
	};
	/**
	 * @description 得到一个页面的路径-主要是为了带上timestamp参数
	 * @param {String} path
	 */
	exports.getPagePath = function(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}

		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? '' : (exports.getProjectBasePath() + '/html/')) + path + '?' + Config.info.TIME_STAMP;

		return path;
	};
	/**
	 * @description 得到文件的后缀
	 * @param {String} path
	 */
	exports.getPathSuffix = function(path) {
		var dotPos = path.lastIndexOf('.'),
			suffix = path.substring(dotPos + 1);
		return suffix;
	};
	/**
	 * @description 动态引入文件-如引入css或js
	 * @param {Array||String} pathStr 是一个字符串数组或者是单个字符串
	 * @param {Function} callback 成功加载后的回调
	 * @param {Boolean} paralle 是否是并联默认为false
	 * -串联加载一般用到前后依赖性较强的对方
	 * -并联加载更快
	 */
	exports.importFile = function(pathStr, callback, paralle) {
		paralle = paralle || false;
		//最终还是用数组来兼容
		var pathArray = (Array.isArray(pathStr)) ? pathStr : [pathStr];
		if(!paralle) {
			//串联加载
			seriesLoadFiles(pathArray, callback);
		} else {
			//并联加载
			parallelLoadFiles(pathArray, callback);
		}
	};

	/** 
	 * 串联加载指定的脚本,css
	 * 串联加载[异步]逐个加载，每个加载完成后加载下一个
	 * 全部加载完成后执行回调
	 * @param array|string 指定的脚本们
	 * @param function 成功后回调的函数
	 * @return array 所有生成的脚本元素对象数组
	 */

	function seriesLoadFiles(scripts, callback) {
		if(typeof(scripts) != "object") var scripts = [scripts];
		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
		var s = new Array(),
			last = scripts.length - 1,
			recursiveLoad = function(i) { //递归
				var path = scripts[i];
				path = exports.getRealativePath(path);
				var suffix = exports.getPathSuffix(path);
				path += ('?' + Config.info.TIME_STAMP);
				if(suffix == 'js') {
					//js
					s[i] = document.createElement("script");
					s[i].setAttribute("type", "text/javascript");
				} else {
					//css
					s[i] = document.createElement("link");
					s[i].setAttribute("type", "text/css");
					s[i].setAttribute("rel", "stylesheet");
				}
				s[i].suffix = suffix;
				s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
					if(! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
						this.onload = this.onreadystatechange = null;
						if(this.suffix == 'js') {
							//只移除脚本
							//暂时不移除脚本,移除了无法进行判断
							//this.parentNode.removeChild(this);
						}
						if(i != last) recursiveLoad(i + 1);
						else if(typeof(callback) == "function") callback();
					}
				};
				//这里设置两边charset 是因为有时候charset设置前面会有bug
				//目前设置到后面
				//s[i].charset = 'UTF-8';
				if(suffix == 'js') {
					s[i].setAttribute("src", path);
				} else {
					s[i].setAttribute("href", path);
				}
				s[i].charset = 'UTF-8';
				HEAD.appendChild(s[i]);
			};
		recursiveLoad(0);
	}

	/**
	 * 并联加载指定的脚本,css
	 * 并联加载[同步]同时加载，不管上个是否加载完成，直接加载全部
	 * 全部加载完成后执行回调
	 * @param array|string 指定的脚本们
	 * @param function 成功后回调的函数
	 * @return array 所有生成的脚本元素对象数组
	 */

	function parallelLoadFiles(scripts, callback) {
		if(typeof(scripts) != "object") var scripts = [scripts];
		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement,
			s = new Array(),
			loaded = 0;
		for(var i = 0; i < scripts.length; i++) {
			var path = scripts[i];
			path = exports.getRealativePath(path);
			var suffix = exports.getPathSuffix(path);
			path += ('?' + Config.info.TIME_STAMP);
			if(suffix == 'js') {
				//js
				s[i] = document.createElement("script");
				s[i].setAttribute("type", "text/javascript");
			} else {
				//css
				s[i] = document.createElement("link");
				s[i].setAttribute("type", "text/css");
				s[i].setAttribute("rel", "stylesheet");
			}
			s[i].suffix = suffix;
			s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
				if(! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
					loaded++;
					this.onload = this.onreadystatechange = null;
					if(this.suffix == 'js') {
						//只移除脚本,css如果移除就没效果了
						//暂时不移除脚本,移除了无法进行判断
						//this.parentNode.removeChild(this);
					}
					if(loaded == scripts.length && typeof(callback) == "function") callback();
				}
			};
			//这里设置两边charset 是因为有时候charset设置前面会有bug
			//目前设置到后面
			//s[i].charset = 'UTF-8';
			if(suffix == 'js') {
				s[i].setAttribute("src", path);
			} else {
				s[i].setAttribute("href", path);
			}
			s[i].charset = 'UTF-8';
			HEAD.appendChild(s[i]);
		}
	}
	/**
	 * @description 移动已经加载过的js/css
	 * @param {String} filename
	 * @param {String} filetype
	 */
	function removejscssfile(filename, filetype) {
		var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
		var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
		var allsuspects = document.getElementsByTagName(targetelement)
		for(var i = allsuspects.length; i >= 0; i--) {
			if(allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
				allsuspects[i].parentNode.removeChild(allsuspects[i])
		}
	}
	/**
	 * @description 移除css或者js
	 * @param {String} fileName 文件名
	 * 例如 mui.min.css  mui.min.js
	 */
	exports.removeFile = function(fileName) {
		if(!fileName) {
			return;
		}
		//后缀-默认为js
		var dotIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(dotIndex + 1, fileName.length) || 'js';
		var name = fileName.substring(0, dotIndex);
		removejscssfile(name, suffix);
	};
	/**
	 * @description 统一处理返回数据,返回数据必须符合标准才行,否则会返回错误提示
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等

	 */
	exports.handleStandardResponse = function(response, type) {
		var returnValue = {
			//code默认为0代表失败
			code: 0,
			//描述默认为空
			description: '',
			//数据默认为空
			data: null,
			//一些数据详情,可以调试用
			debugInfo: {
				type: '未知数据格式'
			}
		};
		if(!response) {
			returnValue.description = '接口返回数据为空!';
			return returnValue;
		}
		if(response && response.ReturnInfo) {
			//V6格式数据处理
			returnValue = handleV6Data(response, type, returnValue);
		} else if(response && response.status) {
			//f9规范
			returnValue = handleF9Data(response, type, returnValue);
		} else if(response && response.EpointDataBody) {
			//其它规范，以前项目中使用的老规范
			returnValue = handleEpointDataBody(response, type, returnValue);
		} else {
			//数据格式不对
			returnValue.code = 0;
			returnValue.description = '接口数据返回格式不正确,不是V6也不是F9!';
			//装载数据可以调试
			returnValue.debugInfo.data = response;
		}

		return returnValue;
	};
	/**
	 * @description 处理F9框架返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等
	 */
	function handleF9Data(response, type, returnValue) {
		var debugInfo = {
			type: 'F9数据格式'
		};

		if(response && response.status) {
			//存储code信息
			debugInfo.code = response.status.code;
			debugInfo.text = response.status.text;
			debugInfo.url = response.status.url;
		}
		if(response && response.status && (response.status.code === 200 || response.status.code === '200')) {
			//必须状态为200
			if(response && response.custom) {
				//业务也没有错误,开始判断类型
				var tips = '接口请求成功!';
				if(response.status.text) {
					//如果存在自己的信息
					tips = response.status.text;
				}
				returnValue.description = tips;
				type = type || 0;
				if(type === 0 || type === '0') {
					returnValue.code = 1;
					if(response.custom.message) {
						returnValue.description = response.custom.message;
					}
				} else if(type === 1 || type === '1') {
					//列表
					returnValue.code = 1;
					if(response.custom.PageInfo && response.custom.PageInfo.TotalNumCount) {
						var numberTotalCount = parseInt(response.custom.PageInfo.TotalNumCount);
						numberTotalCount = numberTotalCount || 0;
						returnValue.totalCount = numberTotalCount;
					} else if(response.custom.pageInfo && response.custom.pageInfo.TotalNumCount) {
						var numberTotalCount = parseInt(response.custom.pageInfo.TotalNumCount);
						numberTotalCount = numberTotalCount || 0;
						returnValue.totalCount = numberTotalCount;
					} else {
						returnValue.totalCount = 0;
					}
					//f9框架不会单独做列表兼容
					//否则普通列表-便利每一个节点,如果是InfoList,直接返回,否则继续找
					for(var obj in response.custom) {
						//returnValue.data = response.custom[obj];
						if(obj === 'InfoList') {
							returnValue.data = response.custom[obj];
							break;
						} else if(obj === 'PageInfo') {
							continue;
						} else {
							returnValue.data = response.custom[obj];
							//console.log(JSON.stringify(returnValue.data));
						}
					}
				} else if(type === 2 || type === '2') {
					//详情
					returnValue.code = 1;
					//详情数据
					for(var obj in response.custom) {
						returnValue.data = response.custom[obj];
						if(obj === 'Info') {
							returnValue.data = response.custom[obj];
							break;
						} else {
							returnValue.data = response.custom;
						}
					}
				} else {
					returnValue.code = 0;
					returnValue.description = '处理接口数据错误,传入类别不在处理范围!';
				}

			} else {
				returnValue.code = 0;
				returnValue.description = '接口返回列表数据格式不符合规范!';
			}

		} else if(response && response.status && (response.status.code === 401 || response.status.code === '401')) {
			//如果返回401，说明用户未登录，请登录
			returnValue.code = 401;
			var tips = '亲，您还未登录，请先登录！';
			if(response && response.status && response.status.text) {
				//如果存在自己的信息
				tips = response.status.text;
			}
			returnValue.description = tips;
		} else {
			returnValue.code = 0;
			var tips = '接口请求错误,返回状态出错!';
			if(response && response.status && response.status.text) {
				//如果存在自己的信息
				tips = response.status.text;
			}
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}
	/**
	 * @description 处理V6返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等

	 */
	function handleV6Data(response, type, returnValue) {
		var debugInfo = {
			type: 'V6数据格式'
		};
		//默认的
		if(response && response.ReturnInfo && response.ReturnInfo.Code) {
			//程序没有错误,判读是否业务错误
			if(response && response.BusinessInfo && response.BusinessInfo.Code) {
				//业务也没有错误,开始判断类型
				var tips = '接口请求成功,后台业务逻辑处理成功!';
				if(response && response.BusinessInfo && response.BusinessInfo.Description) {
					//如果存在自己的信息
					tips = response.BusinessInfo.Description;
				}
				returnValue.description = tips;
				type = type || 0;
				if(type === 0 || type === '0') {
					returnValue.code = 1;

				} else if(type === 1 || type === '1') {
					//列表
					if(response && response.UserArea) {
						returnValue.code = 1;
						if(response.UserArea.PageInfo && response.UserArea.PageInfo.TotalNumCount) {
							var numberTotalCount = parseInt(response.UserArea.PageInfo.TotalNumCount);
							numberTotalCount = numberTotalCount || 0;
							returnValue.totalCount = numberTotalCount;
						} else {
							returnValue.totalCount = 0;
						}
						//如果是兼容列表
						if(response.UserArea.InfoList[0].Info) {
							var outArray = [];
							for(var i = 0, len = response.UserArea.InfoList.length; i < len; i++) {
								outArray.push(response.UserArea.InfoList[i].Info);
							}
							returnValue.data = outArray;
						} else {
							//否则普通列表-便利每一个节点,如果是InfoList,直接返回,否则继续找
							for(var obj in response.UserArea) {
								returnValue.data = response.UserArea[obj];
								if(obj === 'InfoList') {
									break;
								}
							}
						}
					} else {
						returnValue.code = 0;
						returnValue.description = '接口返回列表数据格式不符合规范!';
					}
				} else if(type === 2 || type === '2') {
					//详情
					if(response && response.UserArea) {
						returnValue.code = 1;
						//详情数据
						for(var obj in response.UserArea) {
							returnValue.data = response.UserArea[obj];
							if(obj === 'Info') {
								break;
							}
						}
					} else {
						returnValue.code = 0;
						returnValue.description = '接口返回详情数据格式不符合规范!';
					}
				} else {
					returnValue.code = 0;
					returnValue.description = '处理接口数据错误,传入类别不在处理范围!';
				}

			} else {
				//业务错误
				returnValue.code = 0;
				var tips = '接口请求错误,后台业务逻辑处理出错!';
				if(response && response.BusinessInfo && response.BusinessInfo.Description) {
					//如果存在自己的错误信息
					tips = response.BusinessInfo.Description;
				}
				returnValue.description = tips;
			}

		} else {
			//程序错误
			returnValue.code = 0;
			var tips = '接口请求错误,后台程序处理出错!';
			if(response && response.ReturnInfo && response.ReturnInfo.Description) {
				//如果存在自己的程序错误信息
				tips = response.ReturnInfo.Description;
			}
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}

	/**
	 * @description 处理旧的项目（老框架）中返回数据
	 * @param {JSON} response 接口返回的数据
	 * @param {Number} type = [0|1|2]  类别,兼容字符串形式
	 * @param {JSON} returnValue 返回数据
	 * 0:返回校验信息-默认是返回业务处理校验信息
	 * 1:返回列表
	 * 2:返回详情
	 * 其它:无法处理,会返回对应错误信息
	 * @return {JSON} 返回的数据,包括多个成功数据,错误提示等等
	 */
	function handleEpointDataBody(response, type, returnValue) {
		var debugInfo = {
			type: '老(Old)框架数据格式'
		};

		if(response && response.EpointDataBody && response.EpointDataBody.DATA) {
			if(response.EpointDataBody.DATA.ReturnInfo && (response.EpointDataBody.DATA.ReturnInfo.Status == 'true')) {
				//业务也没有错误,开始判断类型
				var tips = '接口请求成功!';
				if(type == 1) {
					if(response.EpointDataBody.DATA.ReturnInfo.Status.Description) {
						//如果存在自己的信息
						tips = response.EpointDataBody.DATA.ReturnInfo.Status.Description;
					}
				} else if(type == 2) {
					if(response.EpointDataBody.DATA.UserArea) {
						//如果存在自己的信息
						tips = response.EpointDataBody.DATA.UserArea;
					}
				} else if(type == 0) {
					if(response.EpointDataBody.DATA.UserArea) {
						//如果存在自己的信息
						tips = response.EpointDataBody.DATA.UserArea;
					}
				}
				returnValue.description = tips;
				type = type || 0;
				if(type === 0 || type === '0') {
					returnValue.code = 1;

				} else if(type === 1 || type === '1') {
					//1.列表
					returnValue.code = 1;
					if(response.EpointDataBody.DATA.UserArea && response.EpointDataBody.DATA.UserArea.PageInfo) {
						var numberTotalCount = parseInt(response.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount);
						numberTotalCount = numberTotalCount || 0;
						returnValue.totalCount = numberTotalCount;
					} else {
						returnValue.totalCount = 0;
					}
					//f9框架不会单独做列表兼容
					//否则普通列表-便利每一个节点,如果是InfoList,直接返回,否则继续找
					for(var obj in response.EpointDataBody.DATA.UserArea) {
						if(response.EpointDataBody.DATA.UserArea[obj]) {
							//returnValue.data = response.EpointDataBody.DATA.UserArea[obj];
							if(obj === 'PageInfo') {
								continue;
							} else {
								if(Array.isArray(response.EpointDataBody.DATA.UserArea[obj])) {
									returnValue.data = response.EpointDataBody.DATA.UserArea[obj];
								} else {
									var tempArray = [];
									tempArray.push(response.EpointDataBody.DATA.UserArea[obj]);
									returnValue.data = tempArray;
								}
							}

						} else {
							console.log("该列表节点为空null！");
							//returnValue.data = [];
						}
						if(obj === 'InfoList') {
							break;
						} else if(obj === 'PageInfo') {
							continue;
						}
					}
				} else if(type === 2 || type === '2') {
					//2.详情
					returnValue.code = 1;
					//详情数据
					for(var obj in response.EpointDataBody.DATA.UserArea) {
						returnValue.data = response.EpointDataBody.DATA.UserArea[obj];
						if(obj === 'Info') {
							break;
						} else if(obj === 'PageInfo') {
							continue;
						}
					}
				} else {
					returnValue.code = 0;
					returnValue.description = '处理接口数据错误,传入类别不在处理范围!';
				}
			} else {
				returnValue.code = 0;
				var tips = '接口请求错误,返回状态出错!';
				returnValue.description = tips;
			}
		} else {
			returnValue.code = 0;
			var tips = '接口请求错误,返回状态出错!';
			returnValue.description = tips;
		}
		returnValue.debugInfo = debugInfo;
		return returnValue;
	}

	/**
	 * @description 为了统一ajax请求以及代码优化，园区项目中接下来统一采用这个方法请求数据。
	 * @param {Object} url 请求接口地址
	 * @param {Object} requestData 请求参数
	 * @param {Object} successCallback 成功回调
	 * @param {Object} errorCallback 失败回调
	 * @param {Object} contentType 内容类型
	 * @param {Object} configSecretKey 秘钥也叫sessionIndex,该值用来判断是否登录。
	 * @param {Object} isMockData  默认false(正常请求的接口)，true代表“Mock数据”，false代表“接口请求”，false判断是否是Mock的数据还是请求真实接口的数据
	 */
	exports.ajax = function(url, requestData, successCallback, errorCallback, contentType, configSecretKey, isMockData) {
		//判断是否请求的是mock数据,isMock==false不是mock请求，isMock==true是mock请求
		var defaultRequestPara = {
			data: requestData, //请求参数
			dataType: "json", //参数数据类型
			timeout: "15000", //超时时间设置为3秒；
			type: "POST", //请求方式
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			success: function(response) {
				//成功回调
				if(successCallback && typeof(successCallback) == 'function') {
					successCallback(response);
				}
			},
			error: function(xhr) {
				//失败回调
				if(errorCallback && typeof(errorCallback) == 'function') {
					errorCallback(xhr);
				}
			}
		};
		//判断contentType类型,jquery默认为“application/x-www-form-urlencoded;charset=utf-8”
		if(contentType === 1 || contentType === "1") {
			defaultRequestPara.contentType = "application/json";
		} else if(contentType === 0 || contentType === "0") {
			defaultRequestPara.contentType = "application/x-www-form-urlencoded;charset=utf-8";
		} else {
			//默认为这个"application/x-www-form-urlencoded"
			defaultRequestPara.contentType = "application/x-www-form-urlencoded;charset=utf-8";
		}
		//判断是否是mock数据
		if(isMockData == true) {
			//如果是Mock请求，则不加头部header,否则会报下面这个错，因为mock并没有加上这个头部，根本不认识。
			//XMLHttpRequest cannot load http://218.4.136.118:8086/mockjs/110/circle/mobile/topic/TopicAllCommentsList. Request header field X-SecretKey is not allowed by Access-Control-Allow-Headers."
			//什么都不做
		} else {
			//正常请求Java那边接口，应该带上头部信息，这是我们与后台约定好的，该头部作用可以通过该值判断用户是否登录。
			defaultRequestPara.headers = {
				"X-SecretKey": configSecretKey
			};
		}
		console.error("<============默认校验ajax所有请求参数：===============>\n" + JSON.stringify(defaultRequestPara));
		mui.ajax(url, defaultRequestPara);
	};
	//结束

});