/**
 * @description  新点跨平台交互JS库 -EJS
 * 定义好原生和h5交互时所需要提供的api
 * 通过JSBridge交互,异步
 * @author dailc
 * @version 1.0
 * @time 2016-09-23
 */
(function(exports, isLocal) {
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
	(function() {
		function detect(ua) {
			this.os = {};
			this.os.name = 'browser';
			var funcs = [
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
	 * @description 判断os系统 ,判断是否是ejs
	 * ejs.os
	 * @param {type} 
	 * @returns {undefined}
	 */
	(function() {
		function detect(ua) {
			this.os = this.os || {};
			//比如 EpointEJS/6.1.1  也可以/(EpointEJS)\/([\d\.]+)/i
			var ejs = ua.match(/EpointEJS/i); //TODO ejs
			if(ejs) {
				this.os.ejs = true;
				this.os.name += '_' + 'ejs';
			}
		}
		detect.call(exports, navigator.userAgent);
	})();
	//最外层的ejs api名称
	var EJS_API = 'epoint_bridge';
	//默认的自定义api的名
	var EJS_API_CUSTOM = 'custom_epoint_bridge';
	(function() {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var JSBridge = window.JSBridge || (window.JSBridge = {});
		//jsbridge协议定义的名称
		var CUSTOM_PROTOCOL_SCHEME = 'EpointJSBridge';
		//ios中进行url scheme传值的iframe
		var messagingIframe = document.createElement('iframe');
		messagingIframe.style.display = 'none';
		//messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + EJS_API;
		document.documentElement.appendChild(messagingIframe);

		//定义的回调函数集合,在原生调用完对应的方法后,会执行对应的回调函数id
		var responseCallbacks = {};
		//唯一id,用来确保每一个回调函数的唯一性
		var uniqueId = 1;
		//本地注册的方法集合,原生只能调用本地注册的方法,否则会提示错误
		var messageHandlers = {};
		//当原生调用H5注册的方法时,通过回调来调用(也就是变为了异步执行,加强安全性)
		var dispatchMessagesWithTimeoutSafety = true;
		//本地运行中的方法队列
		var sendMessageQueue = [];

		//实际暴露给原生调用的对象
		var Inner = {
			/**
			 * @description 注册本地JS方法通过JSBridge给原生调用
			 * 我们规定,原生必须通过JSBridge来调用H5的方法
			 * 注意,这里一般对本地函数有一些要求,要求第一个参数是data,第二个参数是callback
			 * @param {String} handlerName 方法名
			 * @param {Function} handler 对应的方法
			 */
			registerHandler: function(handlerName, handler) {
				messageHandlers[handlerName] = handler;
			},
			/**
			 * @description 调用原生开放的方法
			 * @param {String} obj 这个属于协议头的一部分
			 * @param {String} handlerName 方法名
			 * @param {JSON} data 参数
			 * @param {Function} callback 回调函数
			 */
			callHandler: function(obj, handlerName, data, callback) {
				//如果没有 data
				if(arguments.length == 3 && typeof data == 'function') {
					callback = data;
					data = null;
				}
				_doSend(obj, {
					handlerName: handlerName,
					data: data
				}, callback);
			},
			/**
			 * iOS专用
			 * @description 当本地调用了callHandler之后,实际是调用了通用的scheme,通知原生
			 * 然后原生通过调用这个方法来获知当前正在调用的方法队列
			 */
			_fetchQueue: function() {
				var messageQueueString = JSON.stringify(sendMessageQueue);
				sendMessageQueue = [];
				return messageQueueString;
			},
			/**
			 * @description 原生调用H5页面注册的方法,或者调用回调方法
			 * @param {String} messageJSON 对应的方法的详情,需要手动转为json
			 */
			_handleMessageFromNative: function(messageJSON) {
				if(dispatchMessagesWithTimeoutSafety) {
					setTimeout(_doDispatchMessageFromNative);
				} else {
					_doDispatchMessageFromNative();
				}
				/**
				 * @description 处理原生过来的方法
				 */
				function _doDispatchMessageFromNative() {
					var message;
					try {
						if(typeof messageJSON === 'string') {
							message = JSON.parse(messageJSON);
						} else {
							message = messageJSON;
						}
					} catch(e) {
						//TODO handle the exception
						console.error("原生调用H5方法出错,传入参数错误");
						return;
					}

					//回调函数
					var responseCallback;
					if(message.responseId) {
						//这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
						responseCallback = responseCallbacks[message.responseId];
						if(!responseCallback) {
							return;
						}
						//执行本地的回调函数
						responseCallback(message.responseData);
						delete responseCallbacks[message.responseId];
					} else {
						//否则,代表原生主动执行h5本地的函数
						if(message.callbackId) {
							//先判断是否需要本地H5执行回调函数
							//如果需要本地函数执行回调通知原生,那么在本地注册回调函数,然后再调用原生
							//回调数据有h5函数执行完毕后传入
							var callbackResponseId = message.callbackId;
							responseCallback = function(responseData) {
								//默认是调用EJS api上面的函数
								//然后接下来原生知道scheme被调用后主动获取这个信息
								//所以原生这时候应该会进行判断,判断对于函数是否成功执行,并接收数据
								//这时候通讯完毕(由于h5不会对回调添加回调,所以接下来没有通信了)
								_doSend(EJS_API, {
									handlerName: message.handlerName,
									responseId: callbackResponseId,
									responseData: responseData
								});
							};
						}

						//从本地注册的函数中获取
						var handler = messageHandlers[message.handlerName];
						if(!handler) {
							//本地没有注册这个函数
						} else {
							//执行本地函数,按照要求传入数据和回调
							handler(message.data, responseCallback);
						}
					}
				}
			},
			/**
			 * @description 正常来说,在原生调用H5方法是是异步的,调用这个方法后,可以变为同步
			 */
			disableJavscriptAlertBoxSafetyTimeout: function() {
				dispatchMessagesWithTimeoutSafety = false;
			}

		};
		/**
		 * @description JS调用原生方法前,会先send到这里进行处理
		 * @param {String} obj 这个属于协议头的一部分
		 * @param {JSON} message 调用的方法详情,包括方法名,参数
		 * @param {Function} responseCallback 调用完方法后的回调
		 */
		function _doSend(obj, message, responseCallback) {
			if(responseCallback) {
				//取到一个唯一的callbackid
				var callbackId = Util.getCallbackId();
				//回调函数添加到集合中
				responseCallbacks[callbackId] = responseCallback;
				//方法的详情添加回调函数的关键标识
				message['callbackId'] = callbackId;
			}
			//android中,可以通过onJsPrompt或者截取Url访问都行
			if(ejs.os.ios) {
				//ios中,通过截取客户端url访问
				//因为ios可以不暴露scheme,而是由原生手动获取
				//正在调用的方法详情添加进入消息队列中,原生会主动获取
				sendMessageQueue.push(message);
			}
			//获取 触发方法的url scheme
			var uri = Util.getUri(obj, message);
			//android和ios的url scheme调用有所区别
			//console.log("ua:"+navigator.userAgent);
			if(ejs.os.android) {
				window.top.prompt(uri, "");
			} else if(ejs.os.ios) {
				//ios采用iframe跳转scheme的方法
				messagingIframe.src = uri;
				//console.log("ios:触发uri:"+uri);
			} else {
				//浏览器
				console.error("浏览器中ejs无效,scheme:" + uri);
			}
		}

		var Util = {
			getCallbackId: function() {
				//return 'cb_' + (uniqueId++) + '_' + new Date().getTime();
				return Math.floor(Math.random() * (1 << 30)) + '';
			},
			//获取url scheme
			//第二个参数是兼容android中的做法
			//android中由于原生不能获取JS函数的返回值,所以得通过协议传输
			getUri: function(obj, message) {
				var uri = CUSTOM_PROTOCOL_SCHEME + '://' + obj;
				if(ejs.os.android) {
					//回调id作为端口存在
					var callbackId, method, params;
					if(message.callbackId) {
						//第一种:h5主动调用原生
						callbackId = message.callbackId;
						method = message.handlerName;
						params = message.data;
					} else if(message.responseId) {
						//第二种:原生调用h5后,h5回调
						//这种情况下需要原生自行分析传过去的port是否是它定义的回调
						callbackId = message.responseId;
						method = message.handlerName;
						params = message.responseData;
					}
					//参数转为字符串
					params = this.getParam(params);
					//uri 补充
					uri += ':' + callbackId + '/' + method + '?' + params;
				}

				return uri;
			},
			getParam: function(obj) {
				if(obj && typeof obj === 'object') {
					return JSON.stringify(obj);
				} else {
					return obj || '';
				}
			}
		};
		for(var key in Inner) {
			if(!hasOwnProperty.call(JSBridge, key)) {
				JSBridge[key] = Inner[key];
			}
		}

		//注册一个测试函数
		JSBridge.registerHandler('testH5Func', function(data, callback) {
			alert('测试函数接收到数据:' + JSON.stringify(data));
			callback && callback('测试回传数据...');
		});
	})();
	//Android本地资源的路径
	var ANDROID_LOCAL = 'file:///android_asset/';
	//iOS本地资源的路径
	var IOS_LOCAL = '';

	/**
	 * @description 得到一个项目的根路径,只适用于混合开发
	 * h5模式下例如:http://id:端口/项目名/
	 * @return {String} 项目的根路径
	 */
	function getProjectBasePath() {
		var flag = window.ejsForceLocal || isLocal;
		var basePath = '';
		if(!flag) {
			//非本地
			var obj = window.location;
			var patehName = obj.pathname;
			//h5
			var contextPath = '';
			//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
			//普通浏览器
			contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
			//var contextPath = obj.pathname.split("/")[1] + '/';
			basePath = obj.protocol + "//" + obj.host + contextPath;
		} else {
			//本地
			if(ejs.os.android) {
				basePath = ANDROID_LOCAL;
			} else if(ejs.os.ios) {
				basePath = IOS_LOCAL;
			}
		}

		return basePath;
	};
	/**
	 * @description 得到一个全路径
	 * @param {String} path
	 */
	function getFullPath(path) {
		// 全路径
		if(/^(http|https|ftp)/g.test(path)) {
			return path;
		}
		// 是否是相对路径
		var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;
		// 非相对路径，页面路径默认从html目录开始
		path = (isRelative ? path : ((getProjectBasePath()) + path));
		return path;
	};

	/*
	 ***************************EJS API********************************************
	 * 返回参数格式：
	 * {"code":1,"msg":"OK","result":"{}"}
	 * code int类型 api调用成功与否 1：成功 0：失败
	 * msg String类型 描述信息
	 * result json类型 返回值
	 * 正常情况下 只会有一个code,又返回值才会有回调result
	 * */
	/**
	 ***Page 模块 
	 * 页面操作
	 */
	ejs.page = {
		/**
		 * @description 打开新页面
		 * 异步
		 * @param {String} url 页面的url
		 * @param {String} title 页面的标题
		 * @param {JSON} jsonObj json参数
		 * @param {JSON} options 额外的配置参数
		 * 包括 requestCode  请求code,startActivityForResult时需要用到,到时候用来进行页面传参
		 * 包括 finishAfterOpen 是否打开下一个页面后关闭关闭当前页面 1为是,其它为否,默认为0
		 * @param {Function} callback 回调函数,回调token值
		 */
		openPage: function(url, title, jsonObj, options, callback) {
			//jsonObj里面的额外参数 viewtitle()
			jsonObj = jsonObj || {};
			options = options || {};
			title = title || '';
			url = url || '';
			url = getFullPath(url);
			//默认为1101
			var requestCode = options.requestCode || '1101';
			var finishAfterOpen = options.finishAfterOpen || '0';
			//将jsonObj拼接到url上
			var extrasDataStr = '';
			if(jsonObj) {
				for(var item in jsonObj) {
					if(extrasDataStr.indexOf('?') == -1 && url.indexOf('?') == -1) {
						extrasDataStr += '?';
					} else {
						extrasDataStr += '&';
					}
					extrasDataStr += item + '=' + jsonObj[item];
				}
			}
			url = url + extrasDataStr;
			//这时候包括
			options.PAGE_URL = url;
			options.PAGE_TITLE = title;
			//一些其它参数就不再定义了,直接传入
			if(ejs.os.ejs) {
				//ejs
				JSBridge.callHandler(EJS_API, 'openPage', {
					//1为是,其它为否
					"finishAfterOpen": finishAfterOpen,
					'requestCode': requestCode,
					'data': options

				}, function(res) {
					callback && callback(null, res.msg, res);
				});
			} else {
				//普通
				document.location.href = url;
			}

		},
		/**
		 * @description 打开原生页面
		 * 异步
		 * @param {String} localPageClassName 本地activity或viewController名称
		 * @param {JSON} jsonObj json参数
		 * @param {JSON} options 额外的配置参数
		 * 包括 requestCode  请求code,startActivityForResult时需要用到,到时候用来进行页面传参
		 * 包括 viewtitle  h5页面title
		 * 包括 finishAfterOpen 是否打开下一个页面后关闭关闭当前页面 1为是,其它为否,默认为0
		 * @param {Function} callback 回调函数,回调token值
		 */
		openLocal: function(localPageClassName, jsonObj, options, callback) {
			//jsonObj里面的额外参数 viewtitle()
			jsonObj = jsonObj || {};
			options = options || {};
			//默认为1101
			var requestCode = options.requestCode || '1101';
			var finishAfterOpen = options.finishAfterOpen || '0';
			//参数合并
			jsonObj = ejs.extend(jsonObj, options, false);
			JSBridge.callHandler(EJS_API, 'openLocal', {
				"localPageClassName": localPageClassName,
				//1为是,其它为否
				"finishAfterOpen": finishAfterOpen,
				'requestCode': requestCode,
				'data': jsonObj

			}, function(res) {
				callback && callback(null, res.msg, res);
			});

		},
		/**
		 * @description 关闭当前页面，容器的关闭
		 * @param {JSON} extras 关闭时,传给打开页面的额外参数
		 * activit->finish
		 * ios->pop
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		closePage: function(extras, callback) {
			if(typeof extras === 'object') {
				extras = JSON.stringify(extras);
			}
			if(ejs.os.ejs) {
				JSBridge.callHandler(EJS_API, 'closePage', {
					"resultData": extras
				}, function(res) {
					callback && callback(null, res.msg, res);
				});
			} else {
				//浏览器退出
				if(window.history.length > 1) {
					window.history.back();
					return true;
				}
			}
		},
		/**
		 * @description 设置页面在恢复时，是否刷新页面元素(重新加载地址)
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		setResumeReload: function(callback) {
			JSBridge.callHandler(EJS_API, 'setResumeReload', {}, function(res) {
				callback && callback(null, res.msg, res);
			});
		},
		/**
		 * @description 重新加载页面
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		reloadPage: function(callback) {
			JSBridge.callHandler(EJS_API, 'reloadPage', {}, function(res) {
				callback && callback(null, res.msg, res);
			});
		}
	};
	/**
	 ***NativeUI 模块 
	 */
	ejs.nativeUI = {
		/**
		 * @description 调用ejs的toast
		 * 异步
		 * @param {String} msg 消息内容
		 * @param {Function} callback 回调函数,回调token值
		 */
		toast: function(msg, callback) {
			JSBridge.callHandler(EJS_API, 'toast', {
				'message': msg
			}, function(res) {
				callback && callback(null, res.msg, res);
			});
		},
		/**
		 * @description 显示等待对话框
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		showWaiting: function(callback) {
			JSBridge.callHandler(EJS_API, 'showProgress', {}, function(res) {
				callback && callback(null, res.msg, res);
			});
		},
		/**
		 * @description 隐藏等待对话框
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		closeWaiting: function(callback) {
			JSBridge.callHandler(EJS_API, 'hideProgress', {}, function(res) {
				callback && callback(null, res.msg, res);
			});
		}
	};
	/**
	 ***Navigator 模块 
	 * 包括原生页面title操作以及部分导航栏操作
	 */
	ejs.navigator = {
		/**
		 * @description 设置页面标题，不建议使用，有延迟
		 * 建议通过openPage调用，将标题传递给下个页面
		 * 异步
		 * @param {String} title
		 * @param {Function} callback 回调函数,回调token值
		 */
		setTitle: function(title, callback) {
			title = title || '';
			JSBridge.callHandler(EJS_API, 'setNaigationTitle', {
				"PAGE_TITLE": title
			}, function(res) {
				callback && callback(null, res.msg, res);
			});
		},
		/**
		 * 隐藏页面返回按钮，不建议使用，有延迟
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		hideBackButton: function(callback) {
			JSBridge.callHandler(EJS_API, 'hideBackButton', {}, function(res) {
				callback && callback(null, res.msg, res);
			});
		}
	};

	/**
	 ***Sql 模块 
	 * 包括原生的数据库键值操作
	 */
	ejs.sql = {
		/**
		 * @description 获取原生数据库中的键值对
		 * 异步
		 * @param {String} callback key
		 * @param {Function} callback 回调函数,回调token值
		 */
		getConfigValue: function(key, callback) {
			key = key || '';
			JSBridge.callHandler(EJS_API, 'getConfigValue', {
				"config_key": key
			}, function(res) {
				res = res || {};
				callback && callback(res.result, res.msg, res);
			});
		}
	};

	/**
	 ***Oauth 模块 
	 * 授权认证相关,如获取原生的token
	 */
	ejs.oauth = {
		/**
		 * @description 获取Token值
		 * 异步
		 * @param {Function} callback 回调函数,回调token值
		 */
		getToken: function(callback) {
			JSBridge.callHandler(EJS_API, 'getToken', {}, function(res) {
				res = res || {};
				callback && callback(res.result, res.msg, res);
			});
		}
	};
	/**
	 ***app 模块 
	 * 一些其它的杂七杂八的操作
	 */
	ejs.app = {
		/**
		 * @description 通过传入key值,得到页面key的初始化传值
		 * 实际情况是获取 window.location.href 中的参数的值
		 * 同步
		 * @param {String} key
		 */
		getExtraDataByKey: function(key) {
			if(!key) {
				return null;
			}
			//获取url中的参数值
			var getUrlParamsValue = function(url, paramName) {
				var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
				var paraObj = {}
				var i, j;
				for(i = 0; j = paraString[i]; i++) {
					paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
				}
				var returnValue = paraObj[paramName.toLowerCase()];
				//需要解码浏览器编码
				returnValue = decodeURIComponent(returnValue);
				if(typeof(returnValue) == "undefined") {
					return undefined;
				} else {
					return returnValue;
				}
			};
			var value = getUrlParamsValue(window.location.href, key);
			if(value === 'undefined') {
				value = null;
			}
			return value;
		}
	};

	/**
	 * @description 调用ejs的自定义方法
	 * @param {String} handlerName 方法名
	 * @param {JSON} data 额外参数
	 * @param {Function} callback 回调函数
	 * @param {String} proto 协议头,默认为epoint_bridge_custom
	 */
	ejs.call = function(handlerName, data, callback, proto) {
		proto = proto || EJS_API_CUSTOM;
		data = data || {};
		JSBridge.callHandler(proto, handlerName, data, function(res) {
			callback && callback(null, res.msg, res);
		});
	};

})(window.ejs = {}, false);