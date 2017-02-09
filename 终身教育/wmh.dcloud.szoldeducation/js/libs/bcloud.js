// <!-----------------2016-06-28 20:26:28.820---------------------->
!(function(document, undefined) {
	if("undefined" == typeof SOTool) var SOTool = {},
		SOTool = {
			PluginStack: {},
			shareObj: function(a, b) {
				"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				window.CloudSdkPlugin.hasOwnProperty("STK") || (window.CloudSdkPlugin.STK = {});
				window.CloudSdkPlugin.STK[a] = b
			},
			getObj: function(a) {
				"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				if(!window.CloudSdkPlugin.hasOwnProperty("STK")) throw Error("no " + a + " Obj");
				return window.CloudSdkPlugin.STK[a]
			},
			creatPlugin: function(a, b) {
				"undefined" ==
				typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
				window.CloudSdkPlugin[a] = b
			},
			getPlugin: function(a, b) {
				if("STK" == a) throw Error(a + " is not support");
				window.CloudSdkPlugin && "undefined" != typeof window.CloudSdkPlugin[a] ? b(window.CloudSdkPlugin[a]) : videoSdkTool.getJS(SOTool.PluginStack[a], function() {
					b(window.CloudSdkPlugin[a])
				}, function() {
					b(null)
				}, this, "utf-8")
			},
			setPluginStack: function(a) {
				if(videoSdkTool.isArray(a))
					for(var b = 0; b < a.length; b++) arguments.callee(a[b]);
				else if(a.hasOwnProperty("name") &&
					a.hasOwnProperty("url")) SOTool.PluginStack[a.name] = a.url, "http" != a.url.substr(0, 4) && (SOTool.PluginStack[a.name] = "https:" == window.location.protocol ? window.location.protocol + SOTool.PluginStack[a.name].replace(/{domain}/g, "s.yuntv.letv.com") : "http:" + SOTool.PluginStack[a.name].replace(/{domain}/g, "yuntv.letv.com"));
				else throw Error(a + "must has name and url");
			}
		};
	SOTool.shareObj("common.SOTool", SOTool);
	var videoSdkTool = function() {
		function a(a) {
			for(var b = [{
					name: "ie",
					test: /msie/
				}, {
					name: "opera",
					test: /opera/
				}, {
					name: "firefox",
					test: /firefox/
				}, {
					name: "safari",
					test: /safari.*(?!chrome)/
				}, {
					name: "chrome",
					test: /chrome/
				}, {
					name: "wph",
					test: /windows phone/
				}, {
					name: "ps",
					test: /playstation/
				}, {
					name: "uc",
					test: /ucbrowser|ucweb/
				}, {
					name: "ps",
					test: /playstation/
				}, {
					name: "xiaomi",
					test: /xiaomi/
				}, {
					name: "qq",
					test: /qqbrowser/
				}, {
					name: "weixin",
					test: /micromessenger/
				}, {
					name: "360",
					test: /360browser/
				}, {
					name: "baidu",
					test: /baidu/
				}, {
					name: "qqwebview",
					test: / qq/
				}, {
					name: "sougou",
					test: /sougou/
				}, {
					name: "liebao",
					test: /liebaofast/
				}, {
					name: "letv",
					test: /eui browser/
				}], d = "un", c = 0; c < b.length; c++) {
				var k = b[c];
				k.test.test(a) && (d = k.name)
			}
			return d
		}

		function b(a) {
			var b = "Win32" == navigator.platform || "Windows" == navigator.platform,
				d = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
			if(d) return "mac";
			if(b) {
				if(-1 < a.indexOf("windows nt 5.0") || -1 < a.indexOf("windows 2000")) return "win2000";
				if(-1 < a.indexOf("windows nt 5.1") ||
					-1 < a.indexOf("windows XP")) return "winXP";
				if(-1 < a.indexOf("windows nt 5.2") || -1 < a.indexOf("windows 2003")) return "win2003";
				if(-1 < a.indexOf("windows nt 6.0") || -1 < a.indexOf("windows vista")) return "winVista";
				if(-1 < a.indexOf("windows nt 6.1") || -1 < a.indexOf("windows 7")) return "win7"
			}
			return /android/.test(a) ? "android" : a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || a.match(/iphone/) || a.match(/ipad/) ? "ios" : "X11" != navigator.platform || b || d ? -1 < String(navigator.platform).indexOf("Linux") ? "linux" : "un" : "unix"
		}
		var c = navigator.userAgent.toLowerCase(),
			d = {
				br: "",
				device: "",
				ver: "",
				params: null,
				os: ""
			};
		return {
			br: d,
			getOs: function() {
				"" == d.os && (d.os = b(c));
				return d.os
			},
			getUrlParams: function(a) {
				if(null == d.params) {
					var b = window.location.search,
						c = {};
					if(-1 != b.indexOf("?"))
						for(var b = b.substr(1).split("&"), f = 0; f < b.length; f++) {
							var k = b[f].substr(0, b[f].indexOf("=")),
								l = b[f].substr(b[f].indexOf("=") + 1);
							c[k] = l
						}
					d.params = c
				}
				return d.params && d.params.hasOwnProperty(a) ? d.params[a] : !1
			},
			getDevice: function() {
				if("" == d.device) {
					var a;
					a: {
						a = [{
							name: "wph",
							test: /windows phone/
						}, {
							name: "ipad",
							test: /ipad/
						}, {
							name: "iphone",
							test: /iphone/
						}, {
							name: "androidPad",
							test: /(?!.*mobile)android/
						}, {
							name: "androidPhone",
							test: /android.*mobile/
						}, {
							name: "android",
							test: /android/
						}, {
							name: "pc",
							test: /windows/
						}, {
							name: "mac",
							test: /macintosh|mac os x/
						}];
						for(var b = 0; b < a.length; b++) {
							var g = a[b];
							if(g.test.test(c)) {
								a = g.name;
								break a
							}
						}
						a = "un"
					}
					d.device = a
				}
				return d.device
			},
			getBrowser: function() {
				"" == d.br && (d.br = a(c));
				return d.br
			},
			getBrowserVersion: function() {
				"" == d.br && (d.br = a(c));
				if("" == d.ver) {
					var b = {},
						e;
					(e = c.match(/msie ([\d.]+)/)) ?
					b.msie = e[1]: (e = c.match(/firefox\/([\d.]+)/)) ? b.firefox = e[1] : (e = c.match(/360browser/)) ? b.b360 = e[1] ? e[1] : "-" : (e = c.match(/qqbrowser\/([\d.]+)/)) ? b.bqq = e[1] : (e = c.match(/ucbrowser\/([\d.]+)/)) ? b.buc = e[1] : (e = c.match(/baidubrowser\/([\d.]+)/)) ? b.bbaidu = e[1] : (e = c.match(/sogoumobilebrowser\/([\d.]+)/)) ? b.bsgm = e[1] : (e = c.match(/liebaofast\/([\d.]+)/)) ? b.blbfast = e[1] : (e = c.match(/mb2345browser\/([\d.]+)/)) ? b.b2345 = e[1] : (e = c.match(/4g explorer\/([\d.]+)/)) ? b.b4g = e[1] : (e = c.match(/huohoubrowser\/([\d.]+)/)) ? b.bhuohou =
						e[1] : (e = c.match(/maxthon[\/ ]([\d.]+)/)) ? b.maxthon = e[1] : (e = c.match(/(opera)|(opr)\/([\d.]+)/)) ? b.opera = e[3] : (e = c.match(/chrome\/([\d.]+)/)) ? b.chrome = e[1] : (e = c.match(/version\/([\d.]+).*safari/)) ? b.safari = e[1] : b.other = "-";
					e = "";
					for(var g in b) e = b[g];
					d.ver = e
				}
				return d.br + d.ver
			},
			now: Date.now || function() {
				return +new Date
			},
			getJS: function(b, a, d, c, k, l) {
				if("undefined" != typeof b) {
					var m = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
						n = document.createElement("script"),
						s;
					n.type =
						"text/javascript";
					k && (n.charset = k);
					n.onload = n.onreadystatechange = function() {
						n.readyState && "loaded" != n.readyState && "complete" != n.readyState || (n = n.onreadystatechange = n.onload = n.onerror = null, clearTimeout(s), "function" == typeof a && a.call(c))
					};
					n.onerror = function() {
						n = n.onload = n.onreadystatechange = n.onerror = null;
						clearTimeout(s);
						"function" == typeof d && d.call(c)
					};
					n.src = b;
					m.appendChild(n);
					l || (l = 1E4);
					s = setTimeout(function() {
						clearTimeout(s);
						"function" == typeof d && d()
					}, l)
				}
			},
			getJSON: function(b, a, d, c, k, l) {
				var m = this.now(),
					n = "letvcloud" + m + Math.floor(100 * Math.random()),
					s = "$1" + n + "$2",
					t = 0,
					q = 0,
					u = this,
					r, v = -1,
					w = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
					x = this.urlToObj(b);
				x.hasOwnProperty("callback") ? n = x.callback : (/_r=/i.test(b) || (b += "&callback=?"), b = b.replace(/(\=)\?(&|$)|\?\?/i, s));
				c = c || 5E3;
				var B = k || 2,
					C = l || 1E3;
				window[n] = function(b) {
					z();
					window[n] = null;
					v = -1;
					a.call(this, b, {
						responseTime: u.now() - m,
						retryCount: t
					})
				};
				var z = function() {
						clearTimeout(q);
						r && r.parentNode && (w.removeChild(r), r.onload =
							r.onreadystatechange = null, r.onerror = null, r = void 0)
					},
					D = function() {
						z();
						t >= B ? (clearTimeout(q), window[n] = null, d && d.call(this, null, {
							responseTime: u.now() - m,
							retryCount: t,
							error: v
						})) : setTimeout(A, C)
					},
					A = function() {
						z();
						t++;
						b = b.replace(/&_r=[\d|\?]+/i, "&_r=" + t);
						r = document.createElement("script");
						r.setAttribute("type", "text/javascript");
						r.setAttribute("src", b);
						r.setAttribute("charset", "utf-8");
						r.onload = r.onreadystatechange = function(b) {
							r.onload = r.onreadystatechange = null;
							clearTimeout(q)
						};
						w.insertBefore(r, w.firstChild);
						v = 1;
						q = setTimeout(D, c)
					};
				A()
			},
			getJSONbyAjax: function(b, a, d, c, k, l) {
				var m = this.now(),
					n = 0,
					s = this,
					t = -1,
					q;
				c = c || 5E3;
				var u = k || 2,
					r = l || 1E3,
					v = function() {
						clearTimeout(0);
						q && (q.onreadystatechange = null)
					},
					w = function() {
						v();
						n >= u ? (clearTimeout(0), d && d.call(this, null, {
							responseTime: s.now() - m,
							retryCount: n,
							error: t
						})) : setTimeout(x, r)
					},
					x = function() {
						v();
						n++;
						q = new XMLHttpRequest;
						q.timeout = c;
						q.onreadystatechange = function(b) {
							4 == q.readyState && (200 == q.status ? (b = q.responseText, v(), t = -1, a.call(this, b, {
									responseTime: s.now() - m,
									retryCount: n
								})) :
								w())
						};
						q.ontimeout = w;
						q.open("GET", b, !0);
						q.send();
						t = 1
					};
				x()
			},
			creatUuid: function() {
				var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
					a = [],
					d, c;
				c = 16;
				for(d = 0; 32 > d; d++) a[d] = b[0 | Math.random() * c];
				return a.join("")
			},
			urlToObj: function(b) {
				var a = {},
					d = b; - 1 != b.indexOf("?") && (d = b.substr(1));
				b = d.split("&");
				for(d = 0; d < b.length; d++) {
					var c = b[d].substr(0, b[d].indexOf("=")),
						k = b[d].substr(b[d].indexOf("=") + 1);
					a[c] = k
				}
				return a
			},
			objectParseToString: function(b) {
				if(null == b) return "";
				var a = "",
					d = 0,
					c;
				for(c in b) a = 0 < d ? a + ("&" + c + "=" + b[c]) : a + (c + "=" + b[c]), d++;
				return a
			},
			cookie: function(b, a, d) {
				if("undefined" != typeof a) {
					d = d || {};
					null === a && (a = "", d.expires = -1);
					var c = "";
					d.expires && ("number" == typeof d.expires || d.expires.toUTCString) && ("number" == typeof d.expires ? (c = new Date, c.setTime(c.getTime() + 864E5 * d.expires)) : c = d.expires, c = "; expires=" + c.toUTCString());
					var k = d.path ? "; path=" + d.path : "",
						l = d.domain ? "; domain=" + d.domain : "";
					d = d.secure ? "; secure" : "";
					document.cookie = [b, "=", encodeURIComponent(a), c, k, l, d].join("")
				} else {
					a =
						null;
					if(document.cookie && "" != document.cookie)
						for(d = document.cookie.split(";"), c = 0; c < d.length; c++)
							if(k = d[c], k.substring(0, b.length + 1) == b + "=") {
								a = decodeURIComponent(k.substring(b.length + 1));
								break
							}
					return a
				}
				return null
			},
			setLocal: function(b, a, d) {
				"undefined" == typeof d && (d = !0);
				if(window.localStorage) try {
					localStorage.setItem(b, a)
				} catch(c) {}
				d && this.cookie(b, a, d)
			},
			getLocal: function(b, a) {
				"undefined" == typeof a && (a = !0);
				if(window.localStorage) try {
					if(localStorage.getItem(b)) return localStorage.getItem(b)
				} catch(d) {}
				return a ?
					this.cookie(b) : -1
			},
			num2Time: function(b) {
				var a;
				a = 10 > parseInt(b / 60) ? "0" + parseInt(b / 60) + ":" : parseInt(b / 60) + ":";
				b = 10 > parseInt(b % 60) ? "0" + parseInt(b % 60) + "" : parseInt(b % 60) + "";
				return a + b
			},
			clone: function(b) {
				var a, d, c;
				if("object" != typeof b || null === b) return b;
				if(b instanceof Array)
					for(a = [], d = 0, c = b.length; d < c; d++) a[d] = "object" == typeof b[d] && null != b[d] ? arguments.callee(b[d]) : b[d];
				else
					for(d in a = {}, b) a[d] = "object" == typeof b[d] && null != b[d] ? arguments.callee(b[d]) : b[d];
				return a
			},
			isHttps: function() {
				try {
					return "https:" ==
						window.location.protocol
				} catch(b) {}
				return !1
			},
			isArray: function(b) {
				return "[object Array]" === Object.prototype.toString.call(b)
			},
			isFunction: function(b) {
				return "[object Function]" === Object.prototype.toString.call(b)
			},
			addUrlParams: function(b, a) {
				for(var d = 0; d < b.length; d++) {
					var c = b[d],
						k;
					for(k in a) - 1 == c.indexOf("&" + k + "=") && -1 == c.indexOf("?" + k + "=") && (c = -1 != c.indexOf("?") ? c + ("&" + k + "=" + a[k]) : c + ("?" + k + "=" + a[k]));
					b[d] = c
				}
			},
			bindFun: function(b, a) {
				return b.bind ? b.bind(a) : function() {
					return b.apply(a, arguments)
				}
			},
			split: function(b,
				a, d) {
				b = b.split(a);
				var c = [];
				if("undefined" == typeof d || d >= b.length) return b;
				for(; c.length < d - 1;) c.push(b[0]), b.shift();
				c[d - 1] = b.join(a);
				return c
			}
		}
	}();
	SOTool.shareObj("common.videoSdkTool", videoSdkTool);
	videoSdkTool.checkPano = function() {
		try {
			var a = document.createElement("canvas");
			if(window.WebGLRenderingContext && (a.getContext("webgl") || a.getContext("experimental-webgl"))) switch(videoSdkTool.getDevice()) {
				case "androidPad":
				case "androidPhone":
				case "android":
					if("chrome" == videoSdkTool.getBrowser() || "firefox" == videoSdkTool.getBrowser()) return !0;
					break;
				case "pc":
					return !0
			}
		} catch(b) {}
		return !1
	};
	SOTool.shareObj("common.videoSdkTool", videoSdkTool);
	var WIN = window,
		DC = document,
		ApiList = "playNewId getVideoSetting getVideoTime pauseVideo resumeVideo seekTo replayVideo closeVideo setVolume shutDown startUp getBufferPercent setDefinition getDefinition getDefaultDefinition getDefinitionList setVideoPercent getVideoPercent setVideoScale getVideoScale resetVideoScale fullVideoScale setVideoRect getLoadPercent getDownloadSpeed getPlayRecord getPlayState setVideoColor getVideoColor getVersion setAutoReplay feedback getLog getServerTime setTipInfo setPlayerInfo setHorseRaceLampInfo barrageInput barrageStop barrageStart barrageResume barragePause callFlash".split(" "),
		BaseCode = {
			decode: function(a) {
				var b, c, d, h, e, g = 0,
					f = 0;
				h = "";
				var k = [];
				if(!a) return a;
				a += "";
				do b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), d = b << 18 | c << 12 | h << 6 | e, b = d >> 16 & 255, c = d >> 8 & 255, d &= 255,
					64 == h ? k[f++] = String.fromCharCode(b) : 64 == e ? k[f++] = String.fromCharCode(b, c) : k[f++] = String.fromCharCode(b, c, d); while (g < a.length);
				return h = k.join("")
			},
			encode: function(a) {
				var b, c, d, h, e = 0,
					g = 0,
					f = "",
					f = [];
				if(!a) return a;
				a = this.utf8_encode(a + "");
				do b = a.charCodeAt(e++), c = a.charCodeAt(e++), d = a.charCodeAt(e++), h = b << 16 | c << 8 | d, b = h >> 18 & 63, c = h >> 12 & 63, d = h >> 6 & 63, h &= 63, f[g++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c) +
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h); while (e < a.length);
				f = f.join("");
				switch(a.length % 3) {
					case 1:
						f = f.slice(0, -2) + "==";
						break;
					case 2:
						f = f.slice(0, -1) + "="
				}
				return f
			}
		},
		MD5 = function() {
			function a(b, a, d, c, l, m) {
				b = h(h(a, b), h(c, m));
				return h(b << l | b >>> 32 - l, d)
			}

			function b(b, d, c, h, l, m, n) {
				return a(d & c | ~d & h, b, d, l, m, n)
			}

			function c(b, d, c, h, l, m, n) {
				return a(d & h | c & ~h, b, d, l, m, n)
			}

			function d(b, d, c, h, l, m, n) {
				return a(c ^
					(d | ~h), b, d, l, m, n)
			}

			function h(b, a) {
				var d = (b & 65535) + (a & 65535);
				return(b >> 16) + (a >> 16) + (d >> 16) << 16 | d & 65535
			}
			return {
				hash: function(e) {
					for(var g = [], f = 0; f < 8 * e.length; f += 8) g[f >> 5] |= (e.charCodeAt(f / 8) & 255) << f % 32;
					e = 8 * e.length;
					g[e >> 5] |= 128 << e % 32;
					g[(e + 64 >>> 9 << 4) + 14] = e;
					e = 1732584193;
					for(var f = -271733879, k = -1732584194, l = 271733878, m = 0; m < g.length; m += 16) {
						var n = e,
							s = f,
							t = k,
							q = l;
						e = b(e, f, k, l, g[m + 0], 7, -680876936);
						l = b(l, e, f, k, g[m + 1], 12, -389564586);
						k = b(k, l, e, f, g[m + 2], 17, 606105819);
						f = b(f, k, l, e, g[m + 3], 22, -1044525330);
						e = b(e, f, k,
							l, g[m + 4], 7, -176418897);
						l = b(l, e, f, k, g[m + 5], 12, 1200080426);
						k = b(k, l, e, f, g[m + 6], 17, -1473231341);
						f = b(f, k, l, e, g[m + 7], 22, -45705983);
						e = b(e, f, k, l, g[m + 8], 7, 1770035416);
						l = b(l, e, f, k, g[m + 9], 12, -1958414417);
						k = b(k, l, e, f, g[m + 10], 17, -42063);
						f = b(f, k, l, e, g[m + 11], 22, -1990404162);
						e = b(e, f, k, l, g[m + 12], 7, 1804603682);
						l = b(l, e, f, k, g[m + 13], 12, -40341101);
						k = b(k, l, e, f, g[m + 14], 17, -1502002290);
						f = b(f, k, l, e, g[m + 15], 22, 1236535329);
						e = c(e, f, k, l, g[m + 1], 5, -165796510);
						l = c(l, e, f, k, g[m + 6], 9, -1069501632);
						k = c(k, l, e, f, g[m + 11], 14, 643717713);
						f =
							c(f, k, l, e, g[m + 0], 20, -373897302);
						e = c(e, f, k, l, g[m + 5], 5, -701558691);
						l = c(l, e, f, k, g[m + 10], 9, 38016083);
						k = c(k, l, e, f, g[m + 15], 14, -660478335);
						f = c(f, k, l, e, g[m + 4], 20, -405537848);
						e = c(e, f, k, l, g[m + 9], 5, 568446438);
						l = c(l, e, f, k, g[m + 14], 9, -1019803690);
						k = c(k, l, e, f, g[m + 3], 14, -187363961);
						f = c(f, k, l, e, g[m + 8], 20, 1163531501);
						e = c(e, f, k, l, g[m + 13], 5, -1444681467);
						l = c(l, e, f, k, g[m + 2], 9, -51403784);
						k = c(k, l, e, f, g[m + 7], 14, 1735328473);
						f = c(f, k, l, e, g[m + 12], 20, -1926607734);
						e = a(f ^ k ^ l, e, f, g[m + 5], 4, -378558);
						l = a(e ^ f ^ k, l, e, g[m + 8], 11, -2022574463);
						k = a(l ^ e ^ f, k, l, g[m + 11], 16, 1839030562);
						f = a(k ^ l ^ e, f, k, g[m + 14], 23, -35309556);
						e = a(f ^ k ^ l, e, f, g[m + 1], 4, -1530992060);
						l = a(e ^ f ^ k, l, e, g[m + 4], 11, 1272893353);
						k = a(l ^ e ^ f, k, l, g[m + 7], 16, -155497632);
						f = a(k ^ l ^ e, f, k, g[m + 10], 23, -1094730640);
						e = a(f ^ k ^ l, e, f, g[m + 13], 4, 681279174);
						l = a(e ^ f ^ k, l, e, g[m + 0], 11, -358537222);
						k = a(l ^ e ^ f, k, l, g[m + 3], 16, -722521979);
						f = a(k ^ l ^ e, f, k, g[m + 6], 23, 76029189);
						e = a(f ^ k ^ l, e, f, g[m + 9], 4, -640364487);
						l = a(e ^ f ^ k, l, e, g[m + 12], 11, -421815835);
						k = a(l ^ e ^ f, k, l, g[m + 15], 16, 530742520);
						f = a(k ^ l ^ e, f, k, g[m + 2], 23, -995338651);
						e = d(e, f, k, l, g[m + 0], 6, -198630844);
						l = d(l, e, f, k, g[m + 7], 10, 1126891415);
						k = d(k, l, e, f, g[m + 14], 15, -1416354905);
						f = d(f, k, l, e, g[m + 5], 21, -57434055);
						e = d(e, f, k, l, g[m + 12], 6, 1700485571);
						l = d(l, e, f, k, g[m + 3], 10, -1894986606);
						k = d(k, l, e, f, g[m + 10], 15, -1051523);
						f = d(f, k, l, e, g[m + 1], 21, -2054922799);
						e = d(e, f, k, l, g[m + 8], 6, 1873313359);
						l = d(l, e, f, k, g[m + 15], 10, -30611744);
						k = d(k, l, e, f, g[m + 6], 15, -1560198380);
						f = d(f, k, l, e, g[m + 13], 21, 1309151649);
						e = d(e, f, k, l, g[m + 4], 6, -145523070);
						l = d(l, e, f, k, g[m + 11], 10, -1120210379);
						k = d(k, l, e, f, g[m + 2], 15,
							718787259);
						f = d(f, k, l, e, g[m + 9], 21, -343485551);
						e = h(e, n);
						f = h(f, s);
						k = h(k, t);
						l = h(l, q)
					}
					g = [e, f, k, l];
					e = "";
					for(f = 0; f < 4 * g.length; f++) e += "0123456789abcdef".charAt(g[f >> 2] >> f % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(g[f >> 2] >> f % 4 * 8 & 15);
					return e
				}
			}
		}(),
		UiTool = {
			getTemplate: function(a, b, c, d) {
				"undefined" != typeof c && (c = c.replace(/{#}/g, d), b = b.replace(/{#}/g, d), UiTool.loadCss(c));
				c = (new Date).getTime();
				d = b.match(/#{[a-z_A-Z0-9]{1,}}/g) || [];
				for(var h = [], e = 0; e < d.length; e++) {
					var g = d[e].replace(/^#{?|}$/g, "");
					b = b.replace(d[e],
						g + c);
					h.push(g)
				}
				a.innerHTML = b;
				for(e = 0; e < h.length; e++) g = h[e], a[g] = UiTool.$E(g + c);
				return h
			},
			loadCss: function(a) {
				var b = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
					c = document.createElement("style");
				c.setAttribute("type", "text/css");
				c.innerHTML = a;
				b.appendChild(c)
			},
			$E: function(a) {
				a = "string" == typeof a ? document.getElementById(a) : a;
				return null != a ? a : null
			},
			$C: function(a) {
				return document.createElement(a)
			},
			hasClassName: function(a, b) {
				if(a) {
					var c = a.className;
					return 0 == c.length ?
						!1 : c == b || c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) ? !0 : !1
				}
			},
			addClassName: function(a, b) {
				if(a) {
					var c = a.className;
					0 == c.length ? a.className = c : c == b || c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) || (a.className = c + " " + b)
				}
			},
			removeClassName: function(a, b) {
				if(a) {
					var c = a.className;
					0 != c.length && (c == b ? a.className = "" : c.match(new RegExp("(^|\\s)" + b + "(\\s|$)")) && (a.className = c.replace(new RegExp("(^|\\s)" + b + "(\\s|$)"), " ")))
				}
			},
			addEvent: function(a, b, c) {
				if(-1 != b.indexOf(",")) {
					b = b.split(",");
					for(var d = 0, h = b.length; d < h; d++) {
						var e =
							b[d];
						if("" == e) break;
						a.attachEvent ? a.attachEvent("on" + e, c) : a.addEventListener(e, c, !1)
					}
				} else a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c, !1)
			},
			removeEvent: function(a, b, c) {
				a = this.$E(a);
				if(null != a && "function" == typeof c && "undefined" != typeof b)
					if(-1 != b.indexOf(",")) {
						b = b.split(",");
						for(var d = 0, h = b.length; d < h; d++) {
							var e = b[d];
							if("" == e) break;
							a.addEventListener ? a.removeEventListener(e, c, !1) : a.attachEvent && a.detachEvent("on" + e, c)
						}
					} else a.addEventListener ? a.removeEventListener(b, c, !1) : a.attachEvent &&
						a.detachEvent("on" + b, c)
			},
			getPos: function(a) {
				a = this.$E(a);
				if(a.getBoundingClientRect) {
					var b = "CSS1Compat" == document.compatMode ? document.documentElement : document.body;
					a = a.getBoundingClientRect();
					return {
						x: a.left + b.scrollLeft,
						y: a.top + b.scrollTop
					}
				}
				for(b = y_ = 0; a.offsetParent;) b += a.offsetLeft, y_ += a.offsetTop, a = a.offsetParent;
				b += a.offsetLeft;
				y_ += a.offsetTop;
				return {
					x: b,
					y: y_
				}
			},
			getMousePoint: function(a) {
				var b = "createTouch" in document,
					c = y = 0,
					d = document.documentElement,
					h = document.body;
				a || (a = window.event);
				window.pageYOffset ?
					(c = window.pageXOffset, y = window.pageYOffset) : (c = (d && d.scrollLeft || h && h.scrollLeft || 0) - (d && d.clientLeft || h && h.clientLeft || 0), y = (d && d.scrollTop || h && h.scrollTop || 0) - (d && d.clientTop || h && h.clientTop || 0));
				b ? (a = a.touches.item(0), c = a.pageX, y = a.pageY) : (c += a.clientX, y += a.clientY);
				return {
					x: c,
					y: y
				}
			},
			preventDefault: function(a) {
				a ? a.preventDefault() : window.event.returnValue = !1
			},
			turnEvent: function(a) {
				var b = {
					mousedown: "touchstart",
					mousemove: "touchmove",
					mouseup: "touchend",
					mouseover: "touchstart",
					mouseout: "-",
					click: "touchstart"
				};
				return UiTool.isSupportsTouches() && b.hasOwnProperty(a) ? b[a] : a
			},
			isSupportsTouches: function(a) {
				return "createTouch" in document
			},
			drag: function(a, b) {
				var c = "createTouch" in document,
					d = UiTool.turnEvent("mousedown"),
					h = UiTool.turnEvent("mousemove"),
					e = UiTool.turnEvent("mouseup");
				"string" == typeof a && (a = document.getElementById(a));
				a.orig_index = a.style.zIndex;
				a.startX = 0;
				a.startY = 0;
				a["on" + d] = function(d) {
					var f, k;

					function l(d) {
						d || (d = window.event);
						c ? (d = d.touches.item(0), f = d.pageX - s, k = d.pageY - t) : (f = d.pageX ? d.pageX -
							s : d.clientX + document.body.scrollLeft - s, k = d.pageY ? d.pageY - t : d.clientY + document.body.scrollTop - t);
						f = u.x + f;
						k = u.x + k;
						q && (f < q.x ? f = q.x : f > q.x + q.w && (f = q.x + q.w), k < q.y ? k = q.y : k > q.y + 0 + q.h && (k = q.y + q.h));
						a.style.left = f + "px";
						a.style.top = k + "px";
						b.onMove && b.onMove((parseInt(a.style.left) - q.x) / q.w);
						return !1
					}

					function m() {
						a.releaseCapture ? a.releaseCapture() : window.captureEvents && window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
						UiTool.removeEvent(n, h, l);
						UiTool.removeEvent(n, e, m);
						a.style.zIndex = a.orig_index;
						b.onUp &&
							b.onUp((parseInt(a.style.left) - q.x) / q.w)
					}
					var n = document;
					k = f = void 0;
					var s, t, q;
					this.style.zIndex = 1E4;
					b.rect && (q = b.rect());
					d || (d = window.event);
					d.preventDefault();
					c ? (d = d.touches.item(0), s = d.pageX, t = d.pageY) : (s = d.clientX + n.body.scrollLeft, t = d.clientY + n.body.scrollTop);
					var u = {
						x: parseInt(a.offsetLeft),
						y: parseInt(a.offsetTop)
					};
					n.ondragstart = "return false;";
					n.onselectstart = "return false;";
					n.onselect = "document.selection.empty();";
					a.setCapture ? a.setCapture() : window.captureEvents && window.captureEvents(Event.MOUSEMOVE |
						Event.MOUSEUP);
					b.onDown && b.onDown((parseInt(a.style.left) - q.x) / q.w);
					UiTool.addEvent(n, h, l);
					UiTool.addEvent(n, e, m);
					return !1
				}
			},
			fullScreen: function(a) {
				if(a.requestFullscreen) return a.requestFullscreen();
				if(a.mozRequestFullScreen) return a.mozRequestFullScreen();
				if(a.webkitRequestFullscreen) return a.webkitRequestFullScreen();
				if(a.msRequestFullscreen) return a.msRequestFullscreen();
				if(a.oRequestFullscreen) return a.oRequestFullscreen()
			},
			isFullScreen: function() {
				return document.webkitIsFullScreen || document.fullscreen ||
					document.mozFullScreen || document.msFullscreenElement ? !0 : !1
			},
			cancelFullScreen: function() {
				document.cancelFullscreen ? document.cancelFullscreen() : document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.webkitCancelFullScreen && element.webkitCancelFullScreen()
			},
			supportFullScreen: function() {
				var a = document.documentElement;
				return "requestFullscreen" in
					a || "mozRequestFullScreen" in a && document.mozFullScreenEnabled || "webkitRequestFullscreen" in a || "msRequestFullscreen" in a
			},
			getClientWidth: function() {
				return document.body.clientWidth
			},
			getImgRealRect: function(a) {
				var b = a.width,
					c = a.height;
				"undefined" != typeof a.naturalWidth && (b = a.naturalWidth, c = a.naturalHeight);
				return {
					width: b,
					height: c
				}
			},
			isMobileEvent: function(a) {
				return -1 != ["touchstart", "touchmove", "touchend"].indexOf(a)
			},
			hexToRgba: function(a, b) {
				var c = a.toLowerCase(),
					d = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				if(c && d.test(c)) {
					if(4 === c.length) {
						for(var h = "#", d = 1; 4 > d; d += 1) h += c.slice(d, d + 1).concat(c.slice(d, d + 1));
						c = h
					}
					h = [];
					for(d = 1; 7 > d; d += 2) h.push(parseInt("0x" + c.slice(d, d + 2)));
					return "RGBA(" + h.join(",") + "," + b + ")"
				}
				return c
			},
			setCanvasColor: function(a, b) {
				for(var c = a.getContext("2d"), d = c.getImageData(0, 0, a.width, a.height), h = 0; h < d.data.length; h += 4)
					if(0 != d.data[h + 3]) {
						var e = b.toLocaleLowerCase(),
							e = e.replace(/rgba\(|\)/g, "").split(",");
						d.data[h] = e[0];
						d.data[h + 1] = e[1];
						d.data[h + 2] = e[2]
					}
				c.putImageData(d, 0, 0)
			}
		};
	SOTool.shareObj("common.UiTool", UiTool);
	var jsonTool = {
			isString: function(a) {
				return "string" === typeof a
			},
			stringToJson: function(a) {
				if(this.isString(a)) try {
					return window.JSON.parse(a)
				} catch(b) {
					return {}
				} else return a
			},
			isJson: function(a) {
				return a && "object" === typeof a && "Object" === a.constructor ? !0 : !1
			},
			jsonToString: function(a) {
				var b = "";
				try {
					b = window.JSON.stringify(a)
				} catch(c) {
					b = c
				}
				return b
			}
		},
		logTool = function() {
			var a = "",
				b = [];
			return {
				log: function(c, d, h) {
					d = "undefined" != typeof d ? "[" + d.constructor.name + "]" : "-";
					h = "undefined" != typeof h ? h : "-";
					if(a != c) try {
						var e =
							new Date,
							g = "[" + e.getFullYear() + "-" + e.getMonth() + "-" + e.getDate() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds() + ":" + e.getMilliseconds() + "]";
						b.push(g + c + "  target--\x3e" + d);
						1E3 < b.length && b.shift();
						if(-1 != window.location.href.indexOf("#dSDK=1") || "file" == window.location.href.substr(0, 4).toLocaleLowerCase()) - 1 != window.location.href.indexOf("#stack=1") && console.log(Error().stack), window.console && window.console.log(c, d, h, g);
						if(-1 != window.location.href.indexOf("#dSDK=2")) {
							if(document.getElementById("log")) var f =
								document.createElement("DIV");
							else {
								var k = document.createElement("DIV");
								k.id = "log";
								document.body.appendChild(k);
								f = document.createElement("DIV")
							}
							f.innerHTML = c + d + g;
							document.getElementById("log").appendChild(f);
							a = c
						}
					} catch(l) {}
				},
				getLog: function(a) {
					return b.join("<br>\r\n")
				}
			}
		}();
	logTool.log("js \u52a0\u8f7d\u6210\u529f  ua:" + window.navigator.userAgent);
	var ReportTool = function() {
			var a = document.createElement("DIV");
			a.style.cssText = "width:85%;height:80%;position:fixed;left:0px;top:0px;z-index: 3000;background-color:rgba(255, 255, 255, 1);";
			var b = document.createElement("IFRAME");
			b.name = "submit";
			b.style.cssText = "display:none;position:absolute;";
			var c = document.createElement("form");
			return {
				print: function(b, c) {
					a.innerHTML = '<div style="width:100%;"><span>\u7528\u6237id:</span><input type="text" style="width:300px;"><input style="float:right;" type="button" value="\u5173\u95ed"></div><textarea class="input" style="width: 100%;height: 100%"  placeholder="Once upon a time..."></textarea>';
					document.body.appendChild(a);
					a.style.display = "";
					a.getElementsByTagName("textarea")[0].innerHTML = b;
					var e = a.getElementsByTagName("input")[0];
					a.getElementsByTagName("input")[1].onclick = function() {
						a.style.display = "none"
					};
					e.value = c
				},
				report: function(a, h) {
					document.body.appendChild(b);
					c.innerHTML = "";
					c.action = a;
					c.method = "post";
					c.target = "submit";
					c.style.display = "none";
					for(var e in h) {
						var g = document.createElement("textarea");
						g.name = e;
						g.value = h[e];
						c.appendChild(g)
					}
					document.body.appendChild(c);
					c.submit()
				}
			}
		}(),
		FlashPlayer = {
			isSupportFlash: !1,
			isEmdbed: !1,
			num: 0,
			check: function(a) {
				var b = "";
				if("undefined" != typeof window.ActiveXObject) try {
					b = (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
				} catch(c) {}
				if(window.navigator.plugins && window.navigator.plugins["Shockwave Flash"]) try {
					b = window.navigator.plugins["Shockwave Flash"].description, this.isEmdbed = !0
				} catch(d) {}
				"" == b && (this.isSupportFlash = !1);
				for(var b = b.split(/\s+/), h = 0, e = b.length; h < e; h++) parseInt(b[h]) > a && (this.isSupportFlash = !0);
				return this.isSupportFlash
			},
			getPlayer: function(a) {
				return this.isEmdbed ? document[a] || window[a] : document.getElementById(a)
			},
			create: function(a, b, c) {
				var d = "cloudPlayer" + (new Date).getTime() + this.num;
				this.num++;
				var h = {
						bgcolor: "#000000",
						allowscriptaccess: "always",
						wmode: "Opaque",
						width: "100%",
						height: "100%",
						align: "middle",
						quality: "high",
						allowFullScreen: !0,
						version: 10
					},
					e;
				for(e in b) h[e] = b[e];
				h.flashvars = c;
				b = "";
				if(this.check(h.version)) {
					if(this.isEmdbed)
						for(e in c = ["<embed name='" + d + "'src='" + h.url + "' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='" +
								h.width + "' height='" + h.height + "' ", " />"
							], b = "", h) "width" != e && "height" != e && "url" != e && (b += e + "='" + h[e] + "' ");
					else
						for(e in b = "", c = ["<object id='" + d + "' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,45,0' type='application/x-shockwave-flash' width='" + h.width + "' height='" + h.height + "'><param name='movie' value='" + h.url + "'/>", "</object>"], h) "width" != e && "height" != e && "url" != e && (b += "<param name='" + e + "' value='" + h[e] +
							"'/>");
					b = c.join(b)
				} else b = '<div style="width:' + h.width + "px; height:" + h.height + 'px; text-align:center;"><span style="line-height:200%; font-size:18px">\u5b89\u88c5\u6216\u8005\u66f4\u65b0\u7248\u672c\u4e0d\u5c0f\u4e8e<b style="color:red">' + h.version + '</b>\u7684flash\u64ad\u653e\u5668, \u8bf7\u70b9\u51fb<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">\u8fd9\u91cc</a>\u5b89\u88c5</span></div>';
				"string" == typeof a && "" != a && document.getElementById(a) ? document.getElementById(a).innerHTML = b :
					document.write(b);
				return d
			}
		},
		ClassTool = function() {
			var a = {};
			return {
				inherits: function(b, a) {
					function d() {}
					try {
						d.prototype = a.prototype, b.prototype = new d, b.prototype.constructor = b, b.prototype.superClass = a.prototype
					} catch(h) {
						debugger
					}
				},
				provideClass: function(b, a) {
					var d = b.split(".");
					if(1 < d.length)
						for(var h = 0; h < d.length - 1; h++) {
							var e = d[h];
							last.hasOwnProperty(e) || (last[e] = {});
							last = last[e]
						}
					last[d[d.length - 1]] = a
				},
				importClass: function(b) {
					for(var c = b.split("."), d = a, h = 0; h < c.length - 1; h++) {
						var e = c[h];
						if(!d.hasOwnProperty(e)) throw "the " +
							b + "--" + e + " class is not provide";
						d = d[e]
					}
					return d
				}
			}
		}();
	SOTool.shareObj("common.ClassTool", ClassTool);
	SOTool.setPluginStack([{
		name: "ErrorInfo",
		url: "//{domain}/player/plugin/errorRender.js"
	}, {
		name: "FeedbackInfo",
		url: "//{domain}/player/plugin/feedbackRender.js"
	}, {
		name: "PanoRender",
		url: "//{domain}/player/plugin/panoRender1.1.js"
	}, {
		name: "Ad",
		url: "//{domain}/player/plugin/a.js"
	}]);
	var GlobalHandler = function() {
			var a = "cid pid vid mmsid pic title url nextvid nextpic nexttitle nexturl nextchapter duration total percent rotation fullscreen color volume jump continuePlay gpu gpuing definition defaultDefinition trylook fullScale originalScale originalRect".split(" ");
			return {
				settingList: function() {
					return a
				},
				getHttpsDomain: function(b) {
					if("https:" == window.location.protocol) {
						b = b.split("://")[1];
						var a = {
							"yuntv.letv.com": "s.yuntv.letv.com",
							"ark.letv.com": "arkletv.lecloud.com",
							"api.letvcloud.com": "apiletv.lecloud.com",
							"sdk.lecloud.com": "sdkletv.lecloud.com"
						};
						a.hasOwnProperty(b) && (b = a[b]);
						return "https://" + b
					}
					return b
				},
				checkPlayType: function() {
					var b = "samsung-sm-n9009__weibo__5.1.2__android__android4.3;HUAWEI MT1-T00 Build/HuaweiMT1-T00;cpqb;360zqb;p6-t00;sm-n9008;sm-;samsung;huawei;android.+chrome".split(";");
					switch(videoSdkTool.getDevice()) {
						case "ipad":
						case "iphone":
							return "ios";
						case "androidPad":
						case "androidPhone":
						case "android":
							if("mp4" == videoSdkTool.getLocal("playType")) break;
							for(var a = navigator.userAgent.toLowerCase(),
									d = 0; d < b.length; d++)
								if(-1 != a.indexOf(b[d].toLowerCase())) return "mp4";
							if(/samsung/i.test(a) && /weibo/i.test(a)) break;
							if(document.createElement("video") && "" == document.createElement("video").canPlayType("application/x-mpegURL")) break;
							return "ios"
					}
					return "mp4"
				},
				definitionTurn: function(b) {
					var a = {
						yuanhua: "yuanhua",
						1300: "super",
						800: "high",
						350: "low"
					};
					return a.hasOwnProperty(b) ? a[b] : b
				},
				definitionTurn2: function(b) {
					var a = {
						yuanhua: "yuanhua",
						"super": "1300",
						high: "800",
						low: "350"
					};
					return a.hasOwnProperty(b) ? a[b] : b
				}
			}
		}(),
		PlayState = {
			PLAY: 0,
			PAUSE: 1,
			STOP: 2
		},
		ERR = {
			PARAMS: "1",
			NOSTART: "2",
			INTERRUPT: "3",
			END: "7",
			NOPLAN: "4",
			PEOPLE_OUT: "5",
			WHITE_LIST: "6",
			ACTIVITY_IO: "60",
			ACTIVITY_TIMEOUT: "61",
			ACTIVITY_ANALY: "63",
			NOSTREAM: "64",
			LIVE_ANALY: "50",
			LIVE_IO: "51",
			LIVE_TIMEOUT: "53",
			PLAY_IO: "480",
			PLAY_TIMEOUT: "481",
			VOD_CONFIG_IO: "150",
			VOD_CONFIG_TIMEOUT: "152",
			VOD_MMSID_ANALY: "153",
			VOD_CONFIG_DRM: "154",
			GSLB_IO: "470",
			GSLB_ANALY: "473",
			NOSupport: "490"
		};
	SOTool.shareObj("manager.ColorManager", function() {
		function a() {
			this.managerDsipayList = [];
			this.cList = [];
			this.colorConfig = {
				bgColor: "#000000",
				fault: "#aaaaaa",
				active: "#208ac3"
			}
		}
		var b = SOTool.getObj("common.UiTool");
		a.prototype.setColor = function(a, d, h, e) {
			"undefined" == typeof h && (h = "bg");
			"undefined" == typeof e && (e = 1);
			a.setColor(b.hexToRgba(this.colorConfig[d], e), h);
			var g = this.managerDsipayList.indexOf(a); - 1 == g ? (this.managerDsipayList.push(a), this.cList.push({
				display: a,
				key: d,
				type: h,
				alpha: e
			})) : (this.cList[g].key =
				d, this.cList[g].type = h, this.cList[g].alpha = e)
		};
		a.prototype.register = function(b) {
			for(var a in b) this.colorConfig.hasOwnProperty(a) && ("#" != b[a].substr(0, 1) ? this.colorConfig[a] = "#" + b[a] : this.colorConfig[a] = b[a])
		};
		a.prototype.refresh = function(a) {
			this.register(a);
			for(a = 0; a < this.cList.length; a++) this.cList[a].display.setColor(b.hexToRgba(this.colorConfig[this.cList[a].key], this.cList[a].alpha), this.cList[a].type)
		};
		return a
	}());
	var ClassObject = function() {
		function a() {
			this.init()
		}
		a.prototype = {
			init: function() {},
			addEventListener: function(b, a, d, h) {
				if("undefined" == typeof b) throw this.log(b), Error("type is undefined");
				if("undefined" == typeof a) throw this.log(a), Error("handler is undefined");
				"undefined" == typeof d && (d = this);
				this.hasOwnProperty("EventMap") || (this.EventMap = {});
				this.EventMap.hasOwnProperty(b) || (this.EventMap[b] = []);
				this.hasEventListener(b, a, d) || this.EventMap[b].push({
					fun: a,
					target: d
				})
			},
			hasEventListener: function(b, a,
				d) {
				if("undefined" == typeof b) throw this.log(b), Error("type is undefined");
				if("undefined" == typeof a) throw this.log(a), Error("handler is undefined");
				if("undefined" == typeof d) throw this.log(d), Error("handlerThis is undefined");
				if(this.hasOwnProperty("EventMap") && this.EventMap.hasOwnProperty(b))
					for(var h = 0; h < this.EventMap[b].length; h++) {
						var e = this.EventMap[b][h];
						if(e.fun == a && e.target == d) return !0
					}
				return !1
			},
			dispatchEvent: function(b) {
				var a = b.type;
				b.target = this;
				this.hasOwnProperty("EventMap") || (this.EventMap = {});
				if(this.EventMap.hasOwnProperty(a)) {
					for(var d = [], h = 0; h < this.EventMap[a].length; h++) d.push(this.EventMap[a][h]);
					for(h = 0; h < d.length; h++) d[h].fun.call(this.EventMap[a][h].target, b)
				}
			},
			removeEventListener: function(b, a, d) {
				this.hasOwnProperty("EventMap") || (this.EventMap = {});
				if(this.EventMap.hasOwnProperty(b))
					for(var h = 0; h < this.EventMap[b].length; h++)
						if(this.EventMap[b][h].fun == a && this.EventMap[b][h].target == d) {
							this.EventMap[b].splice(h, 1);
							0 == this.EventMap[b].length && delete this.EventMap[b];
							break
						}
			},
			destroy: function() {
				for(var b in this.EventMap) delete this.EventMap[b];
				this.EventMap = null
			},
			log: function(b) {
				logTool.log(b, this)
			}
		};
		return a
	}();
	SOTool.shareObj("core.ClassObject", ClassObject);
	var Control = function() {
			function a(b, a) {
				this.init(b, a)
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function(a, c) {
				this.facade = a;
				this.model = c
			};
			return a
		}(),
		Event = function() {
			return function() {
				this.type = arguments[0];
				this.args = arguments
			}
		}();
	SOTool.shareObj("core.Event", Event);
	var Facade = function() {
		function a() {}
		var b = SOTool.getObj("manager.ColorManager");
		ClassTool.inherits(a, SOTool.getObj("core.ClassObject"));
		a.prototype.init = function(a) {
			this.color = new b;
			this.color.register(a)
		};
		return a
	}();
	SOTool.shareObj("core.Facade", Facade);
	var Proxy = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.load = function(a) {
				this.loader = new AutoLoader;
				this.isClose = !1;
				a = this.getRequestList();
				2 == this.requestType ? this.loader.load2(a, this.loadCmp, this.loadError, this) : this.loader.load(a, this.loadCmp, this.loadError, this)
			};
			a.prototype.getUrl = function(a) {
				return 1 < this.loader.urlList.length ? this.loader.urlList[0].url : ""
			};
			a.prototype.getRequestList = function(a) {
				return []
			};
			a.prototype.unload = function(a) {
				this.loader && this.loader.destroy();
				this.isClose = !0
			};
			a.prototype.loadCmp = function(a, c) {
				!this.isClose && this.dispatchEvent(new Event(LoadEvent.LOADCMP, [a, c]))
			};
			a.prototype.loadError = function(a, c) {
				!this.isClose && this.dispatchEvent(new Event(LoadEvent.LOADERROR, [a, c]))
			};
			return a
		}(),
		Plugin = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.initPlugin = function(a, c, d) {
				this.pluginCmpFun = c;
				this.REConf = d;
				if(this.REConf.hasOwnProperty(a.type))
					if(c = this.REConf[a.type], c.hasOwnProperty("check"))
						if("function" == typeof c.check)
							if(c.check()) this.load(a);
							else a.onerror(c.err);
				else if(c.check) this.load(a);
				else a.onerror(c.err);
				else this.load(a);
				else this.pluginCmpFun(null), a.onstart()
			};
			a.prototype.load = function(a) {
				var c = this;
				c.pl = this.REConf[a.type];
				SOTool.getPlugin(c.pl.name, function(a) {
					if(a) c.pluginCmpFun(a);
					else c.onerror({
						code: 420,
						message: "\u63d2\u4ef6\u52a0\u8f7d\u9519\u8bef"
					})
				})
			};
			return a
		}(),
		View = function() {
			function a(a, c) {
				this.facade = a;
				this.model = c;
				this.init()
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.tplKey = "view";
				this.addEvent = !0
			};
			a.prototype.setUp = function(a, c, d) {
				"undefined" == typeof d && (d = "");
				d = SkinRender.SkinTpl[this.tplKey] || d;
				this.el = UiTool.$E(a);
				this.skin = new DisplayObject(this.el);
				a = UiTool.getTemplate(this.el, d);
				if(c)
					for(c = 0; c < a.length; c++) this.el[a[c]] = new DisplayObject(this.el[a[c]]);
				this.addEvent && this.facade.addEventListener(SkinEvent.EVENT, this.skinHandler, this)
			};
			a.prototype.skinHandler = function(a) {};
			a.prototype.setSize = function(a, c) {};
			a.prototype.show = function() {
				this.skin.setVisible(!0)
			};
			a.prototype.hide =
				function() {
					this.skin.setVisible(!1)
				};
			return a
		}();
	SOTool.shareObj("core.View", View);
	var DisplayObject = function() {
		function a(a, b) {
			this.init(a);
			"undefined" == typeof b && (b = window.CloudSdkPlugin.skinUuid);
			this.sid = b
		}
		var b = SOTool.getObj("common.ClassTool"),
			c = SOTool.getObj("core.ClassObject"),
			d = SOTool.getObj("common.UiTool");
		b.inherits(a, c);
		a.prototype.init = function(a) {
			this.el = a
		};
		a.prototype.render = function(a) {
			if(this.el.hasAttribute("render-data")) {
				var b = videoSdkTool.split(this.el.getAttribute("render-data"), ";", 3),
					c = b[1],
					f = b[2];
				switch(b[0]) {
					case "canvas":
						if("img" == c)
							if(this.renderCanvas) this.el.hasOwnProperty("renderOption") ?
								this.el.renderOption = a : d.setCanvasColor(this.renderCanvas, a.color);
							else {
								var b = videoSdkTool.split(f, ";", 3),
									k = document.createElement("img"),
									l = document.createElement("canvas");
								k.width = b[0];
								k.height = b[1];
								this.el.appendChild(l);
								l.width = k.width;
								l.height = k.height;
								this.renderCanvas = l;
								this.el.renderOption = a;
								k.onload = videoSdkTool.bindFun(function() {
									l.getContext("2d").drawImage(k, 0, 0);
									d.setCanvasColor(l, this.el.renderOption.color);
									delete this.el.renderOption
								}, this);
								k.src = b[2]
							}
				}
			}
		};
		a.prototype.addEventListener =
			function(a, b, c) {
				a = d.turnEvent(a);
				"-" != a && d.addEvent(this.el, a, b)
			};
		a.prototype.removeEventListener = function(a, b, c) {
			a = d.turnEvent(a);
			d.removeEvent(this.el, a, b)
		};
		a.prototype.drag = function(a) {
			d.drag(this.el, a)
		};
		a.prototype.setButtonMode = function(a) {
			this.el.style.cursor = a ? "pointer" : "default"
		};
		a.prototype.setEnabled = function(a) {
			this.el.style.pointerEvents = a ? "auto" : "none"
		};
		a.prototype.setVisible = function(a) {
			a ? (this.el.style.display = "block", this.setAttribute({
					orgwidth: this.el.offsetWidth,
					orgheight: this.el.offsetHeight
				})) :
				this.el.style.display = "none"
		};
		a.prototype.getVisible = function() {
			return "none" != this.el.style.display
		};
		a.prototype.setWidth = function(a) {
			a += ""; - 1 != a.indexOf("%") ? this.el.style.width = a : this.el.style.width = a + "px"
		};
		a.prototype.getWidth = function() {
			return 0 == this.el.offsetWidth ? this.getAttribute("orgwidth") : this.el.offsetWidth
		};
		a.prototype.setHeight = function(a) {
			a += ""; - 1 != a.indexOf("%") ? this.el.style.height = a : this.el.style.height = a + "px"
		};
		a.prototype.getHeight = function() {
			return 0 == this.el.offsetHeight ? this.getAttribute("orgheight") :
				this.el.offsetHeight
		};
		a.prototype.setX = function(a) {
			a += ""; - 1 != a.indexOf("%") ? this.el.style.left = a : this.el.style.left = a + "px"
		};
		a.prototype.getX = function() {
			return this.el.offsetLeft
		};
		a.prototype.setY = function(a) {
			a += ""; - 1 != a.indexOf("%") ? this.el.style.top = a : this.el.style.top = a + "px"
		};
		a.prototype.getY = function() {
			return this.el.offsetTop
		};
		a.prototype.appendChild = function(a) {
			a.hasOwnProperty("el") && (a = a.el);
			this.el.appendChild(a)
		};
		a.prototype.setColor = function(a, b) {
			"bg" == b ? this.el.hasAttribute("render-data") ?
				this.render({
					color: a
				}) : this.el.style.backgroundColor = a : "text" == b && (this.el.style.color = a)
		};
		a.prototype.html = function(a) {
			this.el.innerHTML = a
		};
		a.prototype.gethtml = function(a) {
			return this.el.innerHTML
		};
		a.prototype.setClassName = function(a) {
			a = a.split(" ").join(this.sid + " ");
			a += this.sid;
			this.el.className = a
		};
		a.prototype.hasClassName = function(a) {
			a = a.split(" ").join(this.sid + " ");
			a += this.sid;
			return d.hasClassName(this.el, a)
		};
		a.prototype.addClassName = function(a) {
			a = a.split(" ").join(this.sid + " ");
			a += this.sid;
			d.addClassName(this.el, a)
		};
		a.prototype.removeClassName = function(a) {
			a = a.split(" ").join(this.sid + " ");
			a += this.sid;
			d.removeClassName(this.el, a)
		};
		a.prototype.getAttribute = function(a) {
			return this.el.getAttribute(a)
		};
		a.prototype.hasAttribute = function(a) {
			return this.el.hasAttribute(a)
		};
		a.prototype.setAttribute = function(a) {
			for(var b in a) this.el.setAttribute(b, a[b])
		};
		a.prototype.removeAttribute = function(a) {
			if(videoSdkTool.isArray(a))
				for(var b = 0; b < a.length; b++) this.el.removeAttribute(a[b]);
			else this.el.removeAttribute(a)
		};
		a.prototype.setStyle = function(a) {
			for(var b in a) this.el.style[b] = a[b]
		};
		return a
	}();
	SOTool.shareObj("core.view.DisplayObject", DisplayObject);
	SOTool.shareObj("core.view.display.DisplayObject", DisplayObject);
	var DragBar = function() {
		function a(a, b, c) {
			this.init(a, c);
			"undefined" == typeof b && (b = window.CloudSdkPlugin.skinUuid);
			this.sid = b
		}
		var b = SOTool.getObj("common.ClassTool"),
			c = SOTool.getObj("core.ClassObject");
		SOTool.getObj("common.UiTool");
		b.inherits(a, c);
		a.prototype.init = function(a, b) {
			this.percent = 0;
			this.view = a;
			this.rect = {
				x: 0.5 * -this.view.el.sliderOver.getWidth(),
				y: this.view.el.sliderOver.getY(),
				w: this.view.el.trackBg.getWidth(),
				h: 0
			};
			this.addEvents()
		};
		a.prototype.render = function(a) {};
		a.prototype.setPercent =
			function(a) {
				this.percent = a;
				this.updateView()
			};
		a.prototype.updateView = function(a) {
			a = this.percent * this.view.el.trackBg.getWidth();
			this.view.el.track.setWidth(a);
			this.view.el.sliderOver.setX(this.rect.x + a)
		};
		a.prototype.addEvents = function(a, b, c) {
			var g = this;
			this.view.el.sliderOver.drag({
				rect: function() {
					return g.rect
				},
				onDown: function(a) {
					g.isSeeking = !0
				},
				onMove: function(a) {
					g.seekHanler.apply(g, [!1])
				},
				onUp: function(a) {
					g.seekHanler.apply(g, [!0]);
					g.isSeeking = !1
				}
			})
		};
		a.prototype.seekHanler = function(a) {
			this.percent =
				(this.view.el.sliderOver.getX() - this.rect.x) / this.view.el.trackBg.getWidth();
			this.updateView();
			this.dispatchEvent(new Event("change", this.percent))
		};
		return a
	}();
	SOTool.shareObj("core.view.conttrols.DragBar", DragBar);
	var AutoLoader = function() {
			function a() {}
			a.prototype = {
				load: function(a, c, d, h) {
					this.urlList = a;
					var e = this,
						g = 0,
						f = videoSdkTool.now(),
						k = function() {
							clearTimeout(e.delayID);
							var a = e.getRealUrl(e.urlList[0]);
							e.log("load url:" + a);
							videoSdkTool.getJSON(a, function(a, b) {
								g += b.retryCount;
								c && c.call(h, a, {
									responseTime: videoSdkTool.now() - f,
									retryCount: g
								})
							}, function(a, b) {
								1 < e.urlList.length ? (g += e.urlList[0].maxCount, e.urlList.shift(), e.delayID = setTimeout(k, e.urlList[0].retryTime)) : (g += b.retryCount, d && d.call(h, null, {
									responseTime: videoSdkTool.now() -
										f,
									retryCount: g
								}))
							}, e.urlList[0].timeout, e.urlList[0].maxCount, e.urlList[0].retryTime)
						};
					k()
				},
				load2: function(a, c, d, h) {
					this.urlList = a;
					var e = this,
						g = 0,
						f = videoSdkTool.now(),
						k = function() {
							clearTimeout(e.delayID);
							var a = e.getRealUrl(e.urlList[0]);
							e.log("load url:" + a);
							videoSdkTool.getJSONbyAjax(a, function(a, b) {
								g += b.retryCount;
								c && c.call(h, a, {
									responseTime: videoSdkTool.now() - f,
									retryCount: g
								})
							}, function(a, b) {
								1 < e.urlList.length ? (g += e.urlList[0].maxCount, e.urlList.shift(), e.delayID = setTimeout(k, e.urlList[0].retryTime)) :
									(g += b.retryCount, d && d.call(h, null, {
										responseTime: videoSdkTool.now() - f,
										retryCount: g
									}))
							}, e.urlList[0].timeout, e.urlList[0].maxCount, e.urlList[0].retryTime)
						};
					k()
				},
				getRealUrl: function(a) {
					return videoSdkTool.isFunction(a.url) ? a.hasOwnProperty("args") ? a.url(a.args) : a.url() : a.url
				},
				destroy: function() {
					clearTimeout(this.delayID)
				},
				log: function(a) {
					logTool.log(a, this)
				}
			};
			return a
		}(),
		Timer = function() {
			function a(a, c, d, h) {
				this.delay = a;
				this.timerHandler = d;
				this.handlerThis = c;
				"undefined" == typeof h && (h = 0);
				this.max = h;
				this.currentCount =
					this.T = 0;
				this.running = !0
			}
			a.prototype = {
				start: function() {
					this.running = !0;
					this.checkTime(!1)
				},
				checkTime: function(a) {
					var c = this;
					clearTimeout(this.T);
					if(a && (c.currentCount++, c.timerHandler.call(c.handlerThis), 0 < c.max && c.currentCount >= c.max)) {
						c.stop();
						return
					}
					c.T = setTimeout(function() {
						c.checkTime.call(c, !0)
					}, c.delay)
				},
				stop: function() {
					this.running = !1;
					clearTimeout(this.T)
				},
				reset: function() {
					this.stop();
					this.currentCount = 0
				},
				clear: function() {
					this.handlerThis = this.timerHandler = this.delay = null;
					this.T = 0
				}
			};
			return a
		}();
	SOTool.shareObj("core.util.Timer", Timer);
	var SkinRender = {
		SkinTpl: "",
		setPlayerCss: function(a) {
			"" != a && (a = "." + a + " ");
			a = "{id} img{width: auto !important;height: auto !important;}".replace(/{id}/g, a);
			UiTool.loadCss(a)
		},
		setMediacontrols: function(a, b) {
			var c;
			"" != a && (a = "." + a + " ");
			c = "{id}video::-webkit-media-controls-enclosure,{id}video::-webkit-media-controls {display: {dislay} !important;}".replace(/{id}/g, a);
			c = b ? c.replace("{dislay}", "") : c.replace("{dislay}", "none");
			UiTool.loadCss(c)
		},
		setMediafullscreen: function(a, b) {
			var c;
			"" != a && (a = "." + a + " ");
			c = "{id}video::-webkit-media-controls-fullscreen-button {display: {dislay} !important;}".replace(/{id}/g, a);
			c = b ? c.replace("{dislay}", "") : c.replace("{dislay}", "none");
			UiTool.loadCss(c)
		},
		getSkinTpl: function(a, b, c, d) {
			"undefined" == typeof window.CloudSdkPlugin && (window.CloudSdkPlugin = {});
			window.CloudSdkPlugin.skinUuid = videoSdkTool.creatUuid();
			var h = window.CloudSdkPlugin.skinUuid;
			if("" == SkinRender.SkinTpl) {
				b = b.replace(/{#BGP}/g, c);
				b = b.replace(/{#}/g, h);
				UiTool.loadCss(b);
				for(var e in a)
					for(a[e] = a[e].replace(/{#}/g,
							h), b = a[e].match(/{[a-z_A-Z0-9]{1,}\.[a-z_A-Z0-9]{1,}}/g) || [], c = 0; c < b.length; c++) {
						var g = b[c].replace(/{|}/g, "").split("."),
							f = g[0],
							g = g[1];
						d && d.hasOwnProperty(f) && d[f].hasOwnProperty(g) && (f = [f, d[f][g].width, d[f][g].height, d[f][g].src].join(";"), a[e] = a[e].replace(b[c], f))
					}
				SkinRender.SkinTpl = a
			}
		}
	};
	SOTool.shareObj("core.SkinRender", SkinRender);
	var AdEvent = function() {
		return {
			EVENT: "adEvent",
			HEADSTART: "adHeadPlayStart",
			HEADEND: "adHeadPlayComplete",
			NOAD: "adHeadPlayNone"
		}
	}();
	SOTool.shareObj("event.AdEvent", AdEvent);
	var LoadEvent = function() {
		return {
			LOADCMP: "loadcmp",
			LOADERROR: "loaderror"
		}
	}();
	SOTool.shareObj("event.LoadEvent", LoadEvent);
	var PlayerEvent = function() {
		return {
			EVENT: "playerEvent",
			INIT: "playerInit",
			VIDEO_AUTH_VALID: "videoAuthValid",
			VIDEO_DATA_START: "videoDataStart",
			VIDEO_DATA_CMP: "videoDataCmp",
			GSLB_START: "gslbStart",
			GSLB_CMP: "gslbCmp",
			VPH: "videoPageHide",
			VPS: "videoPageShow",
			WPH: "webPageHide",
			ERROR: "playerError",
			RESIZE: "playerResize",
			VIDEO_INFO: "videoInfo",
			FULLSCREEN: "fullscreen",
			PRESIZE: "resize",
			VIDEO_LIVESTOP: "videoLiveStop",
			VIDEO_INTERRUPT: "videoLiveInterupt"
		}
	}();
	SOTool.shareObj("event.PlayerEvent", PlayerEvent);
	var MediaEvent = function() {
		return {
			EVENT: "MediaEvent",
			CONNECT: "videoConnect",
			START: "videoStart",
			PLAY: "videoResume",
			STOP: "videoStop",
			PAUSE: "videoPause",
			BUFFEREMPTY: "videoEmpty",
			BUFFEREFULL: "videoFull",
			SEEK: "videoSeek",
			SEEKEMPTY: "videoSeekEmpty",
			PLAYING: "videoPlaying",
			LODING: "videoLoading",
			METADATA: "MetaData",
			DURATION: "videoDuration",
			DEFSTART: "swapDefinition",
			ERROR: "videoError",
			VOL: "vol",
			REPLAY: "videoReplay"
		}
	}();
	SOTool.shareObj("event.MediaEvent", MediaEvent);
	var SkinEvent = function() {
		return {
			EVENT: "skinEvent",
			PLAY: "skinPlay",
			PAUSE: "skinPause",
			SETDEFINITION: "setDefinition",
			SEEK: "skinSeek",
			VOLUME: "skinVolume",
			FULLSCREEN: "skinFullScreen",
			REPLAY: "skinReplay"
		}
	}();
	SOTool.shareObj("event.SkinEvent", SkinEvent);
	var Model = function() {
			function a() {
				for(var a = "mac nt os osv app bd xh ro cs ssid lo la".split(" "), b = this, d = 0; d < a.length; d++) this[a[d]] = "";
				this.refresh = function(a) {
					for(var d in a) b[d] = a[d]
				}
			}

			function b() {
				var a = this;
				this.autoplay = 0;
				this.refresh = function(b) {
					for(var d in b) a[d] = b[d]
				}
			}

			function c() {
				var a = this;
				this.refresh = function(b) {
					for(var d in b) a[d] = b[d]
				}
			}

			function d() {
				for(var a = ["userId"], b = this, d = 0; d < a.length; d++) this[a[d]] = "";
				this.refresh = function(a) {
					for(var d in a) b[d] = a[d]
				}
			}

			function h() {
				for(var a =
						"title duration volume definition defaultDefinition fullscreen percent time url videoWidth videoHeight".split(" "), b = this, d = 0; d < a.length; d++) this[a[d]] = "";
				this.definitionCount = 0;
				this.refresh = function(a) {
					for(var d in a) b[d] = a[d]
				}
			}

			function e() {
				this.systemData = new a;
				this.config = new b;
				this.reportParam = {};
				this.clear()
			}
			e.prototype = {
				init: function(a) {
					switch(this.platform) {
						case "sdk":
							this._uuid = "";
							this.playType = a.ptype;
							delete a.ptype;
							for(var b = "autoplay uu vu liveId streamId activityId".split(" "), d = 0; d < b.length; d++) {
								var c =
									b[d];
								a.hasOwnProperty(c) && (this.config[c] = a[c], delete a[c])
							}
							this.systemData.refresh(a);
							logTool.log("[Stat K]  model init:" + this.systemData.deviceId + "  _2016-06-29 20:26:28.820");
							this._apprunid = this.systemData.deviceId + "_" + videoSdkTool.now();
							break;
						case "html5":
							this.systemData.refresh(a), this._apprunid = this.lc() + "_" + videoSdkTool.now()
					}
				},
				clear: function() {
					this._uuid = "";
					this._lc = videoSdkTool.getLocal("lc");
					this.userData = new d;
					this.videoSetting = new h;
					this.playerConfig = new c;
					this.platform = "html5";
					this.playType = "vod"
				},
				uuid: function() {
					if("sdk" == this.platform) {
						if(this.videoSetting.hasOwnProperty("uuid") && 6 < this.videoSetting.uuid.length) return this.videoSetting.uuid;
						var a = ExternalInterface.callSDK(this.systemData.os, "getVideoSetting", "");
						this.videoSetting.refresh(a);
						if(this.videoSetting.hasOwnProperty("uuid") && 6 < this.videoSetting.uuid.length) return this.videoSetting.uuid
					}
					"" == this._uuid && (this._uuid = videoSdkTool.creatUuid());
					return this._uuid + "_" + this.videoSetting.definitionCount
				},
				clearUuid: function() {
					this._uuid = ""
				},
				lc: function() {
					null == this._lc && (this._lc = videoSdkTool.creatUuid(), videoSdkTool.setLocal("lc", this._lc));
					return this._lc
				},
				getTypeFrom: function() {
					var a = videoSdkTool.getUrlParams("ch");
					if(a) return a.toString();
					try {
						if("" != this.userInfo().userId) return "bcloud_" + this.userInfo().userId
					} catch(b) {}
					return "letv"
				},
				apprunid: function() {
					return this._apprunid
				},
				auid: function() {
					return this.systemData.deviceId
				},
				pcode: function() {
					return "-"
				},
				videoInfo: function() {
					switch(this.platform) {
						case "sdk":
							var a = ExternalInterface.callSDK(this.systemData.os,
								"getVideoSetting", "");
							a.hasOwnProperty("cid") && "" != a.cid || (a.cid = 100);
							a.hasOwnProperty("liveid") && (a.lid = a.liveid, delete a.liveid);
							a.hasOwnProperty("time") && "" == a.time && (a.time = "0");
							this.videoSetting.refresh(a);
							return a;
						case "html5":
							return a = this.api.getVideoInfo(), this.videoSetting.refresh(a), a
					}
				},
				userInfo: function() {
					switch(this.platform) {
						case "sdk":
							if("" == this.userData.userId) {
								var a = ExternalInterface.callSDK(this.systemData.os, "getUserSetting", "");
								this.userData.refresh(a)
							}
							return this.userData;
						case "html5":
							return this.userData
					}
				}
			};
			return e
		}(),
		CloudVodProxy = function() {
			function a(a) {
				this.model = a;
				this.model.defaultDefinitionList = []
			}
			var b = MD5.hash("gpc_pet"),
				c = MD5.hash("gpc_playerInfo");
			ClassTool.inherits(a, Proxy);
			a.prototype.load = function(a) {
				this.curTime = 0;
				this.superClass.load.call(this, a)
			};
			a.prototype.getRequestList = function() {
				for(var a = [], c = ["//106.39.244.239/", "//111.206.211.221/", "//223.95.79.18/"], e = {
						cf: this.getCf(),
						ran: this.getCurTime(),
						pver: this.model.playerConfig.version,
						bver: encodeURIComponent(videoSdkTool.getBrowserVersion()),
						uuid: this.model.uuid(),
						pf: "html5",
						spf: this.getSpf(),
						p: this.getP()
					}, g = GlobalHandler.getHttpsDomain("http://api.letvcloud.com") + "/gpc.php?format=jsonp&ver=2.4", f = "ark uu vu payer_name check_code pu".split(" "), k = 0; k < f.length; k++) {
					var l = f[k];
					this.model.config.hasOwnProperty(l) && (e[l] = this.model.config[l])
				}
				e.pet = Math.max(0, videoSdkTool.getLocal(b, !1) + 0);
				e.sign = this.getSign([e.cf, e.uu, e.vu, e.ran]);
				for(l in e) g += "&" + l + "=" + e[l];
				g += "&page_url=" + encodeURIComponent(window.location.href);
				a.push({
					url: g,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(k = 0; k < c.length; k++) - 1 != a[0].url.indexOf("//api.letvcloud.com/") && (e = g.replace("//api.letvcloud.com/", c[k]), a.push({
					url: e,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				}));
				return a
			};
			a.prototype.getP = function(a) {
				this.model.config.hasOwnProperty("p") || (this.model.config.p = 101);
				return this.model.config.p
			};
			a.prototype.getSign = function(a) {
				return MD5.hash(a.join("") + "fbeh5player12c43eccf2bec3300344")
			};
			a.prototype.getCurTime = function(a) {
				return 0 != this.curTime ? this.curTime : parseInt(0.001 *
					videoSdkTool.now())
			};
			a.prototype.getCf = function() {
				switch(videoSdkTool.getDevice()) {
					case "ipad":
					case "iphone":
						return "html5_ios"
				}
				return "html5"
			};
			a.prototype.getSpf = function() {
				var a = videoSdkTool.getDevice(),
					b = {
						androidPhone: 0,
						iphone: 1,
						letvTv: 2,
						ipad: 3,
						androidPad: 4
					};
				return b.hasOwnProperty(a) ? b[a] : 0
			};
			a.prototype.loadCmp = function(a, h) {
				if(!this.isClose) {
					var e = this.model;
					this.log("gpc ok data:" + jsonTool.jsonToString(a) + "----time:" + jsonTool.jsonToString(h));
					if(0 == a.code) {
						a = a.data;
						var g = {};
						g.userId = a.userinfo.userid;
						e.userData.refresh(g);
						g = {};
						videoSdkTool.getLocal(b, !1) != a.playerinfo.pet && a.playerinfo.hasOwnProperty("logo") ? videoSdkTool.setLocal(c, jsonTool.jsonToString(a.playerinfo), !1) : (g = jsonTool.stringToJson(videoSdkTool.getLocal(c)), a.playerinfo = g);
						var f = {
								buttonColor: "fault",
								progressBarColor: "active"
							},
							g = {};
						g.mloadingUrl = a.playerinfo.loadingpic;
						g.logo = a.playerinfo.logo;
						g.watermark = a.playerinfo.watermark;
						e.playerConfig.refresh(g);
						!e.outConfig.hasOwnProperty("nskin") && a.playerinfo.hasOwnProperty("nskin") && (e.config.nskin =
							a.playerinfo.nskin);
						for(var k in a.playerinfo.onoff) f.hasOwnProperty(k) && (a.playerinfo.onoff[f[k]] = a.playerinfo.onoff[k], delete a.playerinfo.onoff[k], k = f[k]), e.outConfig.hasOwnProperty(k) || (e.config.hasOwnProperty(k) ? "boolean" == e.config[k] && (e.config[k] = "1" == a.playerinfo.onoff[k]) : e.config[k] = a.playerinfo.onoff[k]);
						g = {};
						g.pic = a.videoinfo.pic;
						g.vid = a.videoinfo.vid;
						g.cid = a.videoinfo.cid;
						g.pid = a.videoinfo.pid;
						g.title = a.videoinfo.name;
						g.duration = a.videoinfo.duration;
						g.defaultDefinition = a.videoinfo.medialist[0].vtype;
						g.isdrm = a.videoinfo.isdrm;
						g.ark = a.videoinfo.ark;
						g.mmsid = a.videoinfo.mmsid;
						g.pano = a.videoinfo.pa;
						a.videoinfo.hasOwnProperty("businessline") && (g.p = a.videoinfo.businessline);
						for(var f = {}, l = 0; l < a.videoinfo.medialist.length; l++) {
							var m = a.videoinfo.medialist[l];
							k = m.vtype;
							f[k] = {};
							f[k].urls = [];
							for(var n = 0; n < m.urllist.length; n++) f[k].urls.push(this.checkGslbUrl(BaseCode.decode(m.urllist[n].url)));
							f[k].videoWidth = m.vwidth;
							f[k].videoHeight = m.vheight;
							f[k].gbr = m.gbr;
							f[k].vtype = m.vtype;
							f[k].definition = m.definition;
							f[k].videoType = m.urllist[0].videotype;
							e.defaultDefinitionList.push(k)
						}
						g.media = f;
						videoSdkTool.setLocal(b, a.playerinfo.pet, !1);
						e.videoSetting.refresh(g);
						this.dispatchEvent(new Event(LoadEvent.LOADCMP, [a, h]))
					} else "10071" == a.code ? (this.curTime = a.timestamp, this.reload()) : this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
						code: ERR.VOD_MMSID_ANALY,
						message: a.message
					}, h]))
				}
			};
			a.prototype.reload = function() {
				this.unload();
				this.superClass.load.call(this)
			};
			a.prototype.checkGslbUrl = function(a) {
				switch(videoSdkTool.getDevice()) {
					case "ipad":
					case "iphone":
						-1 ==
							a.indexOf("&tss=ios&") && (a = -1 != a.indexOf("&tss=no&") ? a.replace("&tss=no&", "&tss=ios&") : a + "&tss=ios")
				}
				return a
			};
			a.prototype.loadError = function(a, b) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.VOD_CONFIG_IO,
					errInfo: "url:" + this.getUrl()
				}, b]))
			};
			return a
		}(),
		CloudMmsProxy = function() {
			function a(a) {
				this.model = a;
				this.model.defaultDefinitionList = []
			}
			var b = MD5.hash("mms_pet"),
				c = MD5.hash("mms_playerInfo");
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				for(var a = [], c = [], e = "cf uu vu format callback pageurl pver ran ver p pu pet userId utoken".split(" "), g = {}, f = 0; f < e.length; f++) {
					var k = e[f];
					this.model.config.hasOwnProperty(k) && (g[k] = this.model.config[k])
				}
				g.cf = this.getCf();
				g.p = this.model.config.p;
				g.format = "jsonp";
				g.pver = this.model.playerConfig.version;
				g.ran = this.getCurTime();
				g.pet = Math.max(0, videoSdkTool.getLocal(b, !1) + 0);
				g.ver = "1.0";
				a.push({
					url: videoSdkTool.bindFun(function(a) {
						g.callback = "vbk" + videoSdkTool.now() + Math.floor(100 * Math.random());
						var b;
						b = "http://api.mms.lecloud.com/v2/mms/play?cf=" +
							g.cf;
						for(var d in g) "cf" != d && (b += "&" + d + "=" + encodeURIComponent(g[d]));
						g.pageurl = window.location.href;
						d = this.getSign(g);
						b += "&sign=" + d + "&pageurl=" + encodeURIComponent(g.pageurl);
						"undefined" != typeof a && (b = b.replace("//api.mms.lecloud.com/", a));
						return b
					}, this),
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0
				});
				for(f = 0; f < c.length; f++) a.push({
					url: a[0].url,
					timeout: 5E3,
					maxCount: 3,
					retryTime: 0,
					args: c[f]
				});
				return a
			};
			a.prototype.getSign = function(a) {
				var b = [],
					c;
				for(c in a) b.push(c);
				b.sort();
				c = "";
				for(var g = 0; g < b.length; g++) c +=
					a[b[g]];
				return MD5.hash(c + "04c5e1e616f668bc559af2afa98b9a25")
			};
			a.prototype.getCf = function() {
				switch(videoSdkTool.getDevice()) {
					case "ipad":
						return "h5-ipad";
					case "iphone":
						return "h5-ios";
					case "androidPad":
						return "h5-androidpad";
					case "androidPhone":
						return "h5-android";
					case "wph":
					case "pc":
						return "h5-win";
					case "mac":
						return "h5-mac"
				}
				return this.model.config.hasOwnProperty("cf") ? this.model.config.cf : "other"
			};
			a.prototype.getSpf = function() {
				var a = videoSdkTool.getDevice(),
					b = {
						androidPhone: 0,
						iphone: 1,
						letvTv: 2,
						ipad: 3,
						androidPad: 4
					};
				return b.hasOwnProperty(a) ? b[a] : 0
			};
			a.prototype.getCurTime = function(a) {
				return this.curTime ? this.curTime : parseInt(0.001 * videoSdkTool.now())
			};
			a.prototype.loadCmp = function(a, h) {
				if(!this.isClose) {
					var e = this.model;
					if(0 == a.code) {
						a = a.data;
						var g = {};
						g.userId = a.userinfo.userid;
						e.userData.refresh(g);
						videoSdkTool.getLocal(b, !1) != a.playerinfo.pet && a.playerinfo.hasOwnProperty("logo") ? videoSdkTool.setLocal(c, jsonTool.jsonToString(a.playerinfo), !1) : (g = jsonTool.stringToJson(videoSdkTool.getLocal(c)),
							a.playerinfo = g);
						g = {};
						g.mloadingUrl = a.playerinfo.loadingpic;
						g.logo = a.playerinfo.logo;
						g.watermark = a.playerinfo.watermark;
						e.playerConfig.refresh(g);
						var g = {
								buttonColor: "fault",
								progressBarColor: "active"
							},
							f;
						for(f in a.playerinfo.onoff) g.hasOwnProperty(f) && (a.playerinfo.onoff[g[f]] = a.playerinfo.onoff[f], delete a.playerinfo.onoff[f], f = g[f]), e.outConfig.hasOwnProperty(f) || (e.config[f] = a.playerinfo.onoff[f]);
						g = {};
						g.vid = a.videoinfo.vid;
						g.cid = a.videoinfo.cid;
						g.pid = a.videoinfo.pid;
						g.title = a.videoinfo.name;
						g.duration =
							a.videoinfo.duration;
						g.defaultDefinition = a.videoinfo.medialist[0].vtype;
						g.isdrm = a.videoinfo.isdrm;
						g.ark = a.videoinfo.ark;
						g.mmsid = a.videoinfo.mmsid;
						a.videoinfo.hasOwnProperty("businessline") && (g.p = a.videoinfo.businessline);
						for(var k = {}, l = 0; l < a.videoinfo.medialist.length; l++) {
							var m = a.videoinfo.medialist[l];
							f = m.vtype;
							k[f] = {};
							k[f].urls = [];
							for(var n = 0; n < m.urllist.length; n++) k[f].urls.push(m.urllist[n].url);
							k[f].videoWidth = m.vwidth;
							k[f].videoHeight = m.vheight;
							k[f].gbr = m.gbr;
							k[f].vtype = m.vtype;
							k[f].definition =
								m.definition;
							k[f].videoType = m.urllist[0].videotype;
							e.defaultDefinitionList.push(f)
						}
						g.media = k;
						g.pic = a.videoinfo.pic["485*303"];
						e.videoSetting.refresh(g);
						videoSdkTool.setLocal(b, a.playerinfo.pet, !1);
						this.dispatchEvent(new Event(LoadEvent.LOADCMP, [a, h]))
					} else "10071" == a.code ? (this.curTime = a.timestamp, this.reload()) : this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
						code: ERR.VOD_MMSID_ANALY,
						message: a.message
					}, h]))
				}
			};
			a.prototype.reload = function() {
				this.unload();
				this.superClass.load.call(this)
			};
			a.prototype.checkGslbUrl =
				function(a) {
					switch(videoSdkTool.getDevice()) {
						case "ipad":
						case "iphone":
							-1 == a.indexOf("&tss=ios&") && (a = -1 != a.indexOf("&tss=no&") ? a.replace("&tss=no&", "&tss=ios&") : a + "&tss=ios")
					}
					return a
				};
			a.prototype.loadError = function(a, b) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.VOD_CONFIG_IO
				}, b]))
			};
			return a
		}(),
		GslbProxy = function() {
			function a(a) {
				this.model = a
			}
			ClassTool.inherits(a, Proxy);
			a.prototype.getRequestList = function() {
				var a = [],
					c = videoSdkTool.clone(this.model.videoSetting.urls);
				videoSdkTool.addUrlParams(c, {
					jsonp: "?",
					_r: "jsonp",
					format: 1,
					expect: 3
				});
				for(var d = 0; d < c.length; d++) {
					var h = this.checkGslbUrl(c[d]);
					a.push({
						url: h,
						timeout: 1E4,
						maxCount: 3,
						retryTime: 0
					})
				}
				return a
			};
			a.prototype.checkGslbUrl = function(a) {
				"ios" == this.model.vodPlayType && -1 == a.indexOf("&tss=ios&") && (a = -1 != a.indexOf("&tss=no&") ? a.replace("&tss=no&", "&tss=ios&") : a + "&tss=ios");
				"mp4" == this.model.vodPlayType && -1 == a.indexOf("&tss=no&") && (a = -1 != a.indexOf("&tss=ios&") ? a.replace("&tss=ios&", "&tss=no&") : a + "&tss=no");
				return a
			};
			a.prototype.loadCmp = function(a, c) {
				if(!this.isClose)
					if(this.log("gslb data:" + jsonTool.jsonToString(a) + " time" + jsonTool.jsonToString(c)), 200 == a.status) {
						a.ercode = "0";
						for(var d = [a.location], h = 0; h < a.nodelist.length; h++) a.nodelist[h].location != d[0] && d.push(a.nodelist[h].location);
						this.dispatchEvent(new Event(LoadEvent.LOADCMP, d))
					} else this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
						code: ERR.GSLB_ANALY,
						message: "\u8c03\u5ea6\u9519\u8bef"
					}, c]))
			};
			a.prototype.loadError = function(a, c) {
				this.isClose || this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.GSLB_IO,
					errInfo: "url:" + this.getUrl()
				}, c]))
			};
			return a
		}(),
		Reporter = function() {
			function a() {
				this.lastTime = this.pt = 0;
				this.isStartPlay = this.isPauseRecord = !1;
				this.state = "";
				this.replaytype = 1
			}

			function b(a) {
				this.model = a;
				this.reset()
			}
			var c = {
					pc: {
						value: 30,
						sub: {
							value: 300
						}
					},
					sdk: {
						value: 32,
						sub: {
							value: 321,
							ios: {
								value: 321
							},
							android: {
								value: 322
							}
						}
					},
					html5: {
						value: 31,
						sub: {
							value: 310,
							ios: {
								value: 311
							},
							android: {
								value: 312
							},
							pc: {
								value: 310
							}
						}
					}
				},
				d = {
					android: 600,
					ios: 601
				};
			b.prototype = {
				init: function() {
					this.model.reportParam.p1 =
						3;
					this.model.reportParam.p2 = c[this.model.platform.toLowerCase()].value;
					c[this.model.platform.toLowerCase()].sub.hasOwnProperty(this.model.systemData.os.toLowerCase()) ? this.model.reportParam.p3 = c[this.model.platform.toLowerCase()].sub[this.model.systemData.os.toLowerCase()].value : this.model.reportParam.p3 = c[this.model.platform.toLowerCase()].sub.value
				},
				reset: function() {
					this.heartTimer && (this.heartTimer.stop(), this.heartTimer = null);
					this.reportParam = new a
				},
				onStateChanged: function(a, b) {
					b = jsonTool.stringToJson(b);
					logTool.log("[Stat K \u65e5\u5fd7\u6570\u636e]  type:" + a + " data:" + b);
					switch(a) {
						case "init":
							this.reportParam.isStartPlay = !1;
							this.model.init(b);
							this.init();
							this.sendEnvStat();
							break;
						case "start":
							this.reportParam.isStartPlay = !1;
							this.sendPlayStat("init");
							break;
						case "play":
							this.reportParam.isStartPlay || (this.sendPlayStat("play", b), this.startHeartTimer(), this.resumePtStat(), this.reportParam.isStartPlay = !0);
							break;
						case "bufferEmpty":
							this.reportParam.state != a && this.reportParam.isStartPlay && (this.pausePtStat(),
								this.sendPlayStat("block"));
							break;
						case "bufferFull":
							"bufferEmpty" == this.reportParam.state && this.reportParam.isStartPlay && (this.resumePtStat(), this.sendPlayStat("eblock"));
							this.reportParam.isStartPlay || (this.reportParam.isStartPlay = !0);
							break;
						case "seek":
							this.reportParam.isStartPlay && (this.pausePtStat(), this.sendPlayStat("drag", {
								py: {
									dr: this.model.videoInfo().time + "_" + b.time
								}
							}));
							break;
						case "pause":
							this.reportParam.state != a && this.reportParam.isStartPlay && (this.pausePtStat(), this.sendPlayStat("pa"));
							break;
						case "resume":
							this.reportParam.isStartPlay && this.resumePtStat();
							break;
						case "definition":
							this.reportParam.isStartPlay && (this.pausePtStat(), this.model.videoSetting.definitionCount++, this.reportParam.replaytype = 2, this.sendPlayStat("tg"));
							break;
						case "stopPlay":
							this.reportParam.isStartPlay && (this.reportParam.isStartPlay = !1, this.pausePtStat(), this.pauseHeadStat(), this.sendPlayStat("end"));
							break;
						case "playStop":
							this.reportParam.isStartPlay && (this.reportParam.isStartPlay = !1, this.pauseHeadStat(), this.sendPlayStat("end"),
								this.sendPlayStat("finish"));
							break;
						case "hide":
							null != this.heartTimer && this.reportParam.isStartPlay && (this.pausePtStat(!0), this.heartTimer.stop());
							break;
						case "show":
							null != this.heartTimer && this.reportParam.isStartPlay && (this.resumePtStat(!0), this.heartTimer.start());
							break;
						case "error":
							this.reportParam.isStartPlay = !1, this.sendErrorStat(b), null != this.heartTimer && this.heartTimer.stop()
					}
					this.reportParam.state = a
				},
				startHeartTimer: function() {
					this.heartTimer ? this.heartTimer.running || (this.setDelay(), this.heartTimer.start()) :
						(this.heartTimer = new Timer(18E4, this, this.heartHanlder), this.setDelay(), this.heartTimer.start())
				},
				pauseHeadStat: function() {
					this.heartHanlder();
					this.heartTimer && this.heartTimer.stop()
				},
				setDelay: function() {
					if(this.heartTimer) switch(this.heartTimer.currentCount) {
						case 0:
							this.heartTimer.delay = 15E3;
							break;
						case 1:
							this.heartTimer.delay = 6E4;
							break;
						default:
							this.heartTimer.delay = 18E4
					}
				},
				heartHanlder: function() {
					this.pausePtStat(!0);
					this.resumePtStat(!0);
					this.setDelay();
					this.sendPlayStat("time");
					this.reportParam.pt =
						0
				},
				pausePtStat: function(a) {
					"undefined" == typeof a && (a = !1);
					var b = videoSdkTool.now();
					this.reportParam.isPauseRecord || 0 == this.reportParam.lastTime || (this.reportParam.pt += b - this.reportParam.lastTime);
					0 == this.reportParam.lastTime && (this.reportParam.pt = 0);
					this.reportParam.lastTime = b;
					a || (this.reportParam.isPauseRecord = !0)
				},
				resumePtStat: function(a) {
					"undefined" == typeof a && (a = !1);
					var b = videoSdkTool.now();
					this.reportParam.lastTime = b;
					a || (this.reportParam.isPauseRecord = !1)
				},
				sendEnvStat: function() {
					var a, b = this.model;
					a = "http://apple.www.letv.com/env/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					a += "&p2=" + this.model.reportParam.p2;
					a += "&p3=" + this.model.reportParam.p3;
					"html5" == this.model.platform && (a += "&lc=" + b.lc());
					"sdk" == this.model.platform && (a += "&auid=" + b.auid());
					a += "&uuid=" + b.uuid();
					a += "&mac=" + b.systemData.mac;
					a += "&nt=" + b.systemData.nt;
					a += "&os=" + b.systemData.os;
					a += "&osv=" + b.systemData.osv;
					a += "&app=" + b.systemData.appv;
					a += "&bd=" + encodeURIComponent(b.systemData.bd);
					a += "&xh=" + encodeURIComponent(b.systemData.xh);
					a += "&ro=" +
						encodeURIComponent(b.systemData.ro);
					a += "&src=pl";
					a += "&ch=" + b.getTypeFrom();
					a += "&cs=" + encodeURIComponent(b.systemData.cs);
					a += "&ssid=" + encodeURIComponent(b.systemData.ssid);
					a += "&lo=" + encodeURIComponent(b.systemData.lo);
					a += "&la=" + encodeURIComponent(b.systemData.la);
					a += "&apprunid=" + b.apprunid();
					a += "&r=" + Math.random();
					this.report(a)
				},
				sendPlayStat: function(a, b) {
					var c, f = this.model;
					c = "http://apple.www.letv.com/cloud_pl/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					c += "&p2=" + this.model.reportParam.p2;
					c += "&p3=" +
						this.model.reportParam.p3;
					c += "&ac=" + a;
					c += "&prg=" + f.videoInfo().time;
					"time" == a && (18E4 < this.reportParam.pt && (this.reportParam.pt = 18E4), c += "&pt=" + Math.abs(Math.round(0.001 * this.reportParam.pt)));
					"html5" == this.model.platform && (c += "&lc=" + f.lc());
					"sdk" == this.model.platform && (c += "&auid=" + f.auid());
					c += "&uuid=" + f.uuid();
					"vod" == f.playType && (c += "&cid=" + f.videoSetting.cid, "" != f.videoSetting.pid && (c += "&pid=" + f.videoSetting.pid), c += "&vid=" + f.videoSetting.vid, c += "&ty=0", c += "&vlen=" + f.videoSetting.duration);
					"live" ==
					f.playType && (c += "&lid=" + f.videoSetting.lid, c += "&sid=" + f.videoSetting.sid, c += "&ty=1", c += "&vlen=6000", f.videoSetting.hasOwnProperty("activityId") && (c += "&zid=" + f.videoSetting.activityId));
					c += "&ch=" + f.getTypeFrom();
					c += "&vt=" + f.videoSetting.vtype;
					c += "&pv=" + encodeURIComponent(this.model.systemData.appv);
					"sdk" == this.model.platform && (b || (b = {}), b.hasOwnProperty("py") || (b.py = {}), b.py.replaytype = this.reportParam.replaytype);
					this.model.videoSetting.hasOwnProperty("p") && (b || (b = {}), b.hasOwnProperty("py") || (b.py = {}), b.py.p = this.model.videoSetting.p);
					null != b && b.hasOwnProperty("py") && (c += "&py=" + encodeURIComponent(videoSdkTool.objectParseToString(b.py)));
					"sdk" == this.model.platform && (c += "&pcode=" + this.model.pcode(), c += "&nt=" + f.systemData.nt);
					c += "&ap=" + this.model.config.autoplay;
					"init" == a && "sdk" == this.model.platform && (c += "&cdev=" + f.systemData.cdev, c += "&caid=" + d[f.systemData.os.toLowerCase()]);
					"play" == a && (c += "&pay=0", b && b.hasOwnProperty("cv") && (c += "&stc=" + encodeURIComponent(videoSdkTool.objectParseToString(b.cv.stc)),
						c += "&joint=" + b.cv.joint));
					c += "&prl=0";
					c += "&ctime=" + videoSdkTool.now();
					c += "&custid=" + f.userInfo().userId;
					c += "&ipt=0";
					c += "&owner=1";
					c += "&apprunid=" + f.apprunid();
					"sdk" != this.model.platform && (c += "&url=" + encodeURIComponent(window.location.href), c += "&ref=" + encodeURIComponent(document.referrer));
					c += "&r=" + Math.random();
					this.report(c)
				},
				sendErrorStat: function(a) {
					var b, c = this.model;
					b = "http://apple.www.letv.com/er/?ver=3.0.5&p1=" + this.model.reportParam.p1;
					b += "&p2=" + this.model.reportParam.p2;
					b += "&p3=" + this.model.reportParam.p3;
					b += "&et=pl";
					b += "&err=" + a.errcode;
					"html5" == this.model.platform && (b += "&lc=" + c.lc());
					"sdk" == this.model.platform && (b += "&auid=" + c.auid());
					b += "&mac=" + c.systemData.mac;
					b += "&nt=" + c.systemData.nt;
					b += "&os=" + c.systemData.os;
					b += "&osv=" + c.systemData.osv;
					b += "&app=" + c.systemData.appv;
					b += "&bd=" + c.systemData.bd;
					b += "&xh=" + c.systemData.xh;
					b += "&ro=" + c.systemData.ro;
					"vod" == c.playType && (b += "&cid=" + c.videoSetting.cid, "" != c.videoSetting.pid && (b += "&pid=" + c.videoSetting.pid), b += "&vid=" + c.videoSetting.vid);
					"live" == c.playType &&
						(b += "&lid=" + c.videoSetting.lid, b += "&sid=" + c.videoSetting.sid);
					a = {
						ch: c.getTypeFrom(),
						custid: c.userInfo().userId
					};
					this.model.videoSetting.hasOwnProperty("p") && (a.p = this.model.videoSetting.p);
					for(var d = ["uu", "vu", "liveId", "streamId", "activityId"], k = 0; k < d.length; k++) c.config.hasOwnProperty(d[k]) && (a[d[k]] = c.config[d[k]]);
					b += "&ep=" + encodeURIComponent(videoSdkTool.objectParseToString(a));
					b += "&ap=" + c.config.autoplay;
					b += "&uuid=" + c.uuid();
					b += "&apprunid=" + c.apprunid();
					b += "&r=" + Math.random();
					this.report(b)
				},
				report: function(a) {
					if("html5" == this.model.platform) {
						logTool.log("[Stat K]  url:" + a);
						var b = new Image(1, 1);
						b.onload = b.onerror = b.onabort = function() {
							b = b.onload = b.onerror = b.onabort = null
						};
						b.src = a
					}
					"sdk" == this.model.platform && ExternalInterface.callSDK(this.model.systemData.os, "logRequest", {
						url: a
					})
				}
			};
			return b
		}(),
		ModelHandler = function() {
			function a(a) {
				this.model = a
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.setUp = function(a, c) {
				a.hasOwnProperty("uu") && a.hasOwnProperty("vu") ? (this.vodproxy = "101" == this.getP(a) ?
					new CloudVodProxy(this.model) : new CloudMmsProxy(this.model), this.vodproxy.addEventListener(LoadEvent.LOADCMP, this.gpcCmp, this), this.vodproxy.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this), this.vodproxy.load()) : this.dispatchEvent(new Event(LoadEvent.LOADERROR, [{
					code: ERR.PARAMS
				}]))
			};
			a.prototype.getP = function(a) {
				return a.hasOwnProperty("p") ? a.p : "101"
			};
			a.prototype.destroy = function(a) {
				this.vodproxy.unload()
			};
			a.prototype.errorHanlder = function(a) {
				this.dispatchEvent(new Event(LoadEvent.LOADERROR,
					a.args[1]))
			};
			a.prototype.gpcCmp = function(a) {
				this.refreshLoadingData(a);
				this.dispatchEvent(new Event(LoadEvent.LOADCMP, a))
			};
			a.prototype.refreshLoadingData = function() {
				this.model.config.hasOwnProperty("loadingurl") && (this.model.playerConfig.mloadingUrl = 0 == this.model.config.loadingurl ? this.model.playerConfig.loadingUrl : this.model.config.loadingurl)
			};
			return a
		}(),
		BasePlayer = function() {
			function a() {}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.playUrlList = [];
				this.isFtc = this.startPlay =
					this.autoplay = !1;
				this.playState = 0;
				this.render = null;
				this.emptyDelay = 1E3
			};
			a.prototype.setConfig = function(a) {};
			a.prototype.errorHandler = function(a) {
				1 < this.playUrlList.length && a && a.code && 4 != a.code ? (this.playUrlList.shift(), this.log("\u64ad\u653e\u5931\u8d25\uff0c errCode:" + a.code + ",\u5207\u6362\u4e0b\u4e00\u4e2a\u5730\u5740:" + this.playUrlList[0]), this.changeurl(this.playUrlList[0])) : (a.hasOwnProperty("retryCdn") || (a.retryCdn = !0), a.hasOwnProperty("code") || (a.code = ERR.PLAY_TIMEOUT), this.log("\u64ad\u653e\u5931\u8d25: errCode:" +
					a.code + ",url:" + this.playUrlList[0]), this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.ERROR, [a])))
			};
			a.prototype.onPlaySeekHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.startPlay && (this.playState = 5, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.SEEK, this.getTime())))
			};
			a.prototype.onPlayFullHandler = function() {
				this.startPlay || (this.startPlay = !0, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.START)), this.render && this.render.start());
				1 != this.playState && (this.playState =
					1, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.BUFFEREFULL, this.getTime())));
				this.emptyST && clearTimeout(this.emptyST)
			};
			a.prototype.onPlayEmptyHandler = function() {
				var a = this;
				a.emptyST && clearTimeout(a.emptyST);
				a.startPlay && 3 != a.playState && (5 != a.playState ? (a.playState = 3, a.emptyST = setTimeout(function() {
					a.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.BUFFEREMPTY, a.getTime()))
				}, a.emptyDelay)) : (a.playState = 3, a.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.SEEKEMPTY, a.getTime()))))
			};
			a.prototype.onPlaStopHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				4 != this.playState && (this.playState = 4, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.STOP, !0)))
			};
			a.prototype.onPlayHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.playState = 1;
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.PLAY, this.getTime()))
			};
			a.prototype.onPauseHandler = function() {
				this.emptyST && clearTimeout(this.emptyST);
				this.playState = 2;
				this.dispatchEvent(new Event(MediaEvent.EVENT,
					MediaEvent.PAUSE, this.getTime()))
			};
			a.prototype.onPlayIngHandler = function() {
				var a = this.getTime();
				if(0 <= a && !this.isFtc)
					if(0 < a) this.log("\u7b2c\u4e00\u6b21\u83b7\u5f97\u975e0\u7684\u64ad\u653e\u65f6\u95f4" + a), this.isFtc = !0, this.onPlayFullHandler();
					else if("iphone" == videoSdkTool.getDevice() && "qq" == videoSdkTool.getBrowser()) this.onPlayFullHandler();
				this.startPlay && this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.PLAYING, a))
			};
			a.prototype.onLoadIngHandler = function() {
				this.dispatchEvent(new Event(MediaEvent.EVENT,
					MediaEvent.LODING, this.getLoadPercent()))
			};
			a.prototype.onMetaDataHandler = function(a) {
				this.videoWidth = a.width || 0;
				this.videoHeight = a.height || 0;
				0 < this.videoWidth && 0 < this.videoHeight & !this.hasMetadata && (this.setSize(), this.hasMetadata = !0, this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.METADATA, {
					videoWidth: this.videoWidth,
					videoHeight: this.videoHeight,
					duration: this.duration
				})));
				this.mduration && 0 == a.duration && (a.duration = this.mduration);
				0 < a.duration && this.duration != a.duration && (this.duration = a.duration,
					this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.DURATION, {
						duration: this.duration
					})))
			};
			return a
		}(),
		H5SamplePlayer = function() {
			function a() {
				var a = this;
				this.type = "video";
				this._videoRect = {};
				this.videoHandlerBack = function() {
					a.videoHandler.apply(a, arguments)
				}
			}
			var b = 0,
				c = "error emptied abort playing play pause ended canplay waiting loadeddata loadedmetadata timeupdate seeked seeking progress durationchange".split(" ");
			ClassTool.inherits(a, BasePlayer);
			a.prototype.destroy = function() {
				this.removeEvents();
				this.video.pause();
				this.video.src = "";
				this.render && this.render.close()
			};
			a.prototype.setPoster = function(a) {
				this.video.poster = a
			};
			a.prototype.setUp = function(a, c) {
				b++;
				var e = "LecoudPlayer" + (new Date).getTime() + "" + b,
					g, f = ["preload", "controls", "width", "height"];
				g = '<div id="v{id}" style="left:0px;top:0px;width:100%;height:100%;display: block;position: relative;"><video  id="{id}" controls="controls"  style="width:100%;height:100%;"></video></div>'.replace(/{id}/g, e);
				c.innerHTML = g;
				this.outEl = c;
				this.video = document.getElementById(e);
				this.videoBox = document.getElementById("v" + e);
				this.config = a;
				this.isEndStartSeek = 0 < this.config.start ? !1 : !0;
				a.hasOwnProperty("pic") && (this.video.poster = a.pic);
				a.hasOwnProperty("autoplay") && "1" == a.autoplay ? (this.video.autoplay = "autoplay", this.autoplay = !0) : this.autoplay = !1;
				a.hasOwnProperty("playsinline") && "1" == a.playsinline && (this.video.WebKitPlaysInline ? this.video.WebKitPlaysInline = !0 : (this.video.setAttribute("webkit-playsinline", ""), this.video.setAttribute("playsinline", "")));
				for(e = 0; e < f.length; e++) a.hasOwnProperty(f[e]) &&
					"width" != f[e] && "height" != f[e] && (this.video[f[e]] = a[f[e]]);
				this.isShow = !0;
				this.vArea = this.videoBox;
				this.renderType = "";
				0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight || (this.videoBox.style.width = "99.5%", this.videoBox.style.height = "99.5%");
				this._videoRect = {
					x: 0,
					y: 0,
					width: this.outEl.offsetWidth,
					height: this.outEl.offsetHeight
				}
			};
			a.prototype.enableControls = function() {
				this.video.controls = !0
			};
			a.prototype.disableControls = function() {
				this.video.controls = !1
			};
			a.prototype.setContainer = function(a) {
				this.vArea = a
			};
			a.prototype.setLoop = function(a) {};
			a.prototype.hide = function(a) {
				this.isShow && (a ? this.video.style.display = "none" : (this.tmpwidth = this.videoBox.style.width, this.tmpheight = this.videoBox.style.height, this.videoBox.style.width = "1px", this.videoBox.style.height = "1px", this.videoBox.style.left = "-1000px", this.videoBox.style.top = "-1000px"), this.isShow = !1)
			};
			a.prototype.show = function() {
				this.isShow || (this.videoBox.style.display = "", this.videoBox.style.width = this.tmpwidth, this.videoBox.style.height = this.tmpheight,
					this.videoBox.style.left = "0px", this.videoBox.style.top = "0px", this.isShow = !0)
			};
			a.prototype.setSize = function() {
				this.display = 0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight ? !0 : !1;
				this.setVideoRect();
				this.isShow && (this.config.dvideoSize ? this.display && (this.videoBox.style.width = "100%", this.videoBox.style.height = "100%") : 0 < this.videoWidth && 0 < this.videoHeight & 0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight && (this.videoBox.style.width = this._videoRect.width + "px", this.videoBox.style.height = this._videoRect.height +
					"px", this.videoBox.style.top = this._videoRect.y + "px", this.videoBox.style.left = this._videoRect.x + "px"));
				this.render && this.render.setSize(this.vArea.offsetWidth, this.vArea.offsetHeight)
			};
			a.prototype.setVideoRect = function() {
				if("pano" == this.renderType) this._videoRect = {
					x: 0,
					y: 0,
					width: this.vArea.offsetWidth,
					height: this.vArea.offsetHeight
				};
				else if(0 < this.videoWidth && 0 < this.videoHeight & 0 < this.outEl.offsetWidth & 0 < this.outEl.offsetHeight) {
					var a, b;
					this.videoWidth / this.videoHeight > this.outEl.offsetWidth / this.outEl.offsetHeight ?
						(a = this.outEl.offsetWidth, b = this.videoHeight * this.outEl.offsetWidth / this.videoWidth) : (b = this.outEl.offsetHeight, a = this.videoWidth * this.outEl.offsetHeight / this.videoHeight);
					this._videoRect = {
						x: 0.5 * (this.outEl.offsetWidth - a),
						y: 0.5 * (this.outEl.offsetHeight - b),
						width: a,
						height: b
					}
				}
			};
			a.prototype.addEvents = function() {
				for(var a = this.video, b = 0; b < c.length; b++) a.addEventListener(c[b], this.videoHandlerBack, !0)
			};
			a.prototype.removeEvents = function() {
				for(var a = this.video, b = 0; b < c.length; b++) a.removeEventListener(c[b],
					this.videoHandlerBack, !0)
			};
			a.prototype.videoHandler = function(a) {
				switch(a.type) {
					case "error":
						if("firefox" == videoSdkTool.getBrowser() && null == this.video.error) break;
						if(this.video.error && 4 == this.video.error.code && 0 < this.getTime()) break;
						a = {
							code: ERR.PLAY_TIMEOUT
						};
						this.video.error && this.video.error.code && (a.code = "49" + this.video.error.code);
						this.errorHandler(a);
						break;
					case "playing":
						if(!this.startPlay) this.onMetaDataHandler({
							width: this.video.videoWidth,
							height: this.video.videoHeight,
							duration: this.video.duration
						});
						this.autoSeek();
						if(this.isEndStartSeek) this.onPlayFullHandler();
						this.isStartSeek && (this.isEndStartSeek = !0);
						break;
					case "emptied":
					case "waiting":
						this.onPlayEmptyHandler();
						break;
					case "seeked":
						this.isEndStartSeek = !0;
						this.onPlayFullHandler();
						break;
					case "seeking":
						this.onPlaySeekHandler();
						break;
					case "play":
						this.onPlayHandler();
						break;
					case "pause":
						this.onPauseHandler();
						break;
					case "ended":
						this.onPlaStopHandler();
						break;
					case "timeupdate":
						this.display || this.setSize();
						if(this.isEndStartSeek) this.onPlayIngHandler();
						break;
					case "progress":
						this.onLoadIngHandler();
						break;
					case "durationchange":
					case "loadedmetadata":
						this.onMetaDataHandler({
							width: this.video.videoWidth,
							height: this.video.videoHeight,
							duration: this.video.duration
						})
				}
			};
			a.prototype.autoSeek = function() {
				var a = this;
				this.log("autoSeek:" + a.config.start + "--" + a.startPlay + "-" + a.isEndStartSeek);
				0 != a.config.start ? a.startPlay || a.isEndStartSeek ? a.isStartSeek = !0 : setTimeout(function() {
					a.isStartSeek = !0;
					a.seek(a.config.start)
				}, 500) : a.isStartSeek = !0
			};
			a.prototype.getLoadPercent =
				function() {
					for(var a = this.video.buffered, b = 0; b < a.length; b++)
						if(this.getTime() < a.end(b)) return Math.min(1, a.end(b) / this.video.duration);
					return 0
				};
			a.prototype.play = function(a, b, c, g) {
				var f = this;
				f.renderType = g;
				f.hasMetadata = !1;
				f.playUrlList = a;
				f.config.start = b;
				f.url = f.playUrlList[0];
				f.isEndStartSeek = 0 < f.config.start ? !1 : !0;
				f.isStartSeek = !1;
				this.isFtc = f.startPlay = !1;
				this.render || (this.render = new RenderEngine);
				this.render.init({
					type: g,
					video: this.video,
					el: this.vArea,
					onstart: function() {
						f.log("\u6e32\u67d3\u5f15\u64ce\u521d\u59cb\u5316\u5b8c\u6bd5\uff0c\u56de\u8c03\u64ad\u653e, url:" +
							f.url);
						f.addEvents();
						f.video.src = f.url;
						if(f.autoplay || c) f.video.load && f.video.load(), f.video.play()
					},
					onerror: function(a) {
						f.log("\u6e32\u67d3\u5f15\u64ce\u521d\u59cb\u5316\u5931\u8d25");
						a.retryCdn = !1;
						f.errorHandler(a)
					}
				})
			};
			a.prototype.resume = function() {
				this.video.play && this.video.play()
			};
			a.prototype.pause = function() {
				this.video.pause()
			};
			a.prototype.getTime = function() {
				return this.video.currentTime
			};
			a.prototype.seek = function(a) {
				this.log("seek:" + a);
				this.video.currentTime = a
			};
			a.prototype.changeurl = function(a) {
				this.url =
					a;
				this.video.src = this.url;
				this.config.start = this.getTime();
				this.isEndStartSeek = 0 < this.config.start ? !1 : !0;
				this.video.load();
				this.video.play()
			};
			a.prototype.setVol = function(a) {
				this.video.volume = a
			};
			a.prototype.getVol = function(a) {
				return this.video.volume
			};
			a.prototype.stop = function() {
				this.destroy()
			};
			a.prototype.getVideoRect = function(a) {
				return "wh" == a ? {
					w: this.video.offsetWidth,
					h: this.video.offsetHeight
				} : this._videoRect
			};
			return a
		}(),
		RenderEngine = function() {
			function a(a) {}
			var b = {
				pano: {
					name: "PanoRender",
					check: videoSdkTool.checkPano,
					err: {
						code: "",
						message: ""
					}
				}
			};
			ClassTool.inherits(a, Plugin);
			a.prototype.init = function(a) {
				this.isStart = !1;
				this.options = a;
				this.log("\u521d\u59cb\u5316\u6e32\u67d3\u5f15\u64ce" + this.eg);
				this.eg ? a.type != this.eg.type ? this.eg = null : this.eg.reset(a) : this.eg = this.initPlugin(a, this.pluginOk, b)
			};
			a.prototype.pluginOk = function(a) {
				this.eg = a ? new a(this.options) : null
			};
			a.prototype.start = function() {
				this.isStart || (this.isStart = !0, this.eg && this.eg.start())
			};
			a.prototype.close = function() {
				this.log("\u5173\u95ed\u6e32\u67d3\u5f15\u64ce" +
					this.eg);
				this.eg && this.eg.close();
				this.isStart = !1
			};
			a.prototype.setSize = function(a, b) {
				this.eg && this.eg.setSize(a, b)
			};
			return a
		}(),
		MediaPlayer = function() {
			function a(a) {
				this.init(a)
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function(a) {
				this.time = 0;
				this.config = a
			};
			a.prototype.setUp = function(a, c) {
				var d = videoSdkTool.clone(this.config),
					h = ["pic", "volume"];
				this.loop = !1;
				this.el = c;
				this.volume = a.volume;
				for(var e = 0; e < h.length; e++) {
					var g = h[e];
					!d.hasOwnProperty(g) && a.hasOwnProperty(g) && (d[g] = a[g])
				}
				this.creatPlayer(d,
					c);
				this.player.duration = a.duration
			};
			a.prototype.creatPlayer = function(a, c) {
				this.player && (this.player.removeEventListener(MediaEvent.EVENT, this.MediaHanlder, this), this.player.destroy(), this.player = null);
				this.player = this.getPlayer(a);
				this.player.init();
				this.player.setUp(a, c)
			};
			a.prototype.setMedia = function(a) {};
			a.prototype.hide = function(a) {
				this.player.hide(a)
			};
			a.prototype.show = function() {
				this.player.show()
			};
			a.prototype.setConfig = function(a) {};
			a.prototype.setContainer = function(a) {
				null != a && this.player.setContainer(a)
			};
			a.prototype.getPlayer = function(a) {
				return new H5SamplePlayer
			};
			a.prototype.startPlay = function(a, c, d, h) {
				"undefined" == typeof c && (c = 0);
				"undefined" == typeof d && (d = !1);
				"undefined" == typeof h && (h = "");
				this.destroy();
				this.setVol(this.volume);
				this.player.addEventListener(MediaEvent.EVENT, this.MediaHanlder, this);
				this.player.mduration = a.duration;
				this.player.play(a.urls, c, d, h)
			};
			a.prototype.setSize = function() {
				this.player.setSize()
			};
			a.prototype.play = function() {
				this.player.resume()
			};
			a.prototype.setVol = function(a) {
				this.player.setVol(a);
				this.volume = a;
				this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.VOL, a))
			};
			a.prototype.pause = function() {
				this.player.pause()
			};
			a.prototype.destroy = function() {
				this.closeVideo();
				this.loop = !1;
				this.player.setLoop(!1);
				this.player.destroy()
			};
			a.prototype.closeVideo = function() {
				this.player.removeEventListener(MediaEvent.EVENT, this.MediaHanlder, this);
				this.player.stop()
			};
			a.prototype.getTime = function() {
				return parseInt(this.player.getTime())
			};
			a.prototype.seek = function(a) {
				0 <= a && 0 > a - this.player.duration && (this.player.seek(a),
					this.player.resume())
			};
			a.prototype.getBufferPercent = function(a) {
				return 1
			};
			a.prototype.getLoadPercent = function(a) {
				return this.player.getLoadPercent()
			};
			a.prototype.setLoop = function(a) {
				this.loop = a;
				this.player.setLoop(a)
			};
			a.prototype.MediaHanlder = function(a) {
				switch(a.args[1]) {
					case MediaEvent.STOP:
						if(this.loop) {
							this.seek(0);
							return
						}
				}
				this.dispatchEvent(a)
			};
			a.prototype.changeurl = function(a) {
				this.player.changeurl(a)
			};
			a.prototype.getVideoRect = function(a) {
				return this.player.getVideoRect(a)
			};
			a.prototype.replay =
				function() {
					this.player.seek(0);
					this.dispatchEvent(new Event(MediaEvent.EVENT, MediaEvent.REPLAY, this.getTime()))
				};
			a.prototype.getVideoEl = function() {
				return this.player.video
			};
			a.prototype.setPoster = function(a) {
				return this.player.setPoster(a)
			};
			return a
		}();
	SOTool.shareObj("media.watermask", function() {
		function a(a) {
			this.init(a);
			this.model = a
		}
		ClassTool.inherits(a, ClassObject);
		a.prototype.init = function(a) {
			this.waterList = [];
			this.config = {
				chackTime: 6E4
			};
			this.model = a;
			this._index = 0
		};
		a.prototype.setUp = function(a) {
			this.setWaterData();
			var c = this.model.playerConfig.watermark;
			this.clear();
			this.player = a;
			this.el = a.getVideoEl().parentNode;
			this.waterData = videoSdkTool.clone(c);
			this._index = 0;
			var d = this;
			if(this.waterData)
				for(a = 0; a < this.waterData.length; a++) c = UiTool.$C("img"),
					c.num = a, this.waterData[a].hasOwnProperty("position") && this.waterData[a].hasOwnProperty("url") && (this.waterData[a].hasOwnProperty("x") || (this.waterData[a].x = 15), this.waterData[a].hasOwnProperty("y") || (this.waterData[a].y = 15), this.waterData[a].hasOwnProperty("width") || (this.waterData[a].width = 640), this.waterData[a].hasOwnProperty("height") || (this.waterData[a].height = 360), c.onload = function() {
						var a = UiTool.$C("canvas");
						d.waterData[this.num].img = this;
						d._renderWater(a, d.waterData[this.num]);
						d.waterList.push(a);
						d.start()
					}, c.src = this.waterData[a].url)
		};
		a.prototype.isPano = function() {
			return this.model.config.hasOwnProperty("pano") && "1" == this.model.config.pano || "1" == this.model.videoSetting.pano ? !0 : !1
		};
		a.prototype.setWaterData = function() {
			this.isPano() ? (this.model.videoSetting.videoOrgHeight = this.model.playerConfig.pHeight, this.model.videoSetting.videoOrgWidth = this.model.playerConfig.pWidth) : this.model.videoSetting.videoWidth / this.model.videoSetting.videoHeight < this.model.playerConfig.pWidth / this.model.playerConfig.pHeight ?
				(this.model.videoSetting.videoOrgHeight = this.model.playerConfig.pHeight, this.model.videoSetting.videoOrgWidth = this.model.videoSetting.videoWidth * this.model.playerConfig.pHeight / this.model.videoSetting.videoHeight) : (this.model.videoSetting.videoOrgWidth = this.model.playerConfig.pWidth, this.model.videoSetting.videoOrgHeight = this.model.videoSetting.videoHeight * this.model.playerConfig.pWidth / this.model.videoSetting.videoWidth)
		};
		a.prototype.clear = function() {
			if(this.waterList) {
				for(var a = 0; a < this.waterList.length; a++) this.waterList[a].parentNode ==
					this.el && (this.el.removeChild(this.waterList[a]), this.waterList[a] = null);
				this.waterList = []
			}
		};
		a.prototype.start = function() {
			function a() {
				_self = this;
				for(var b = 0; b < _self.waterList.length; b++) _self.waterList[b].style.display = b != _self._index ? "none" : "";
				_self._index++;
				_self._index == _self.waterList.length && (_self._index = 0)
			}
			1 < this.waterList.length && (this.changeTimer = new Timer(this.config.chackTime, this, a), this.changeTimer.start());
			a.call(this)
		};
		a.prototype.setSize = function(a, c) {
			for(var d = 0; d < this.waterList.length; d++) this._renderWater(this.waterList[d],
				this.waterData[d])
		};
		a.prototype.destroy = function(a, c) {
			this.clear();
			this.waterData = null
		};
		a.prototype._renderWater = function(a, c) {
			var d = c.img,
				h = 1,
				h = this.model.playerConfig.pWidth / this.model.playerConfig.pHeight < c.width / c.height ? Math.min(1, this.model.playerConfig.pWidth / c.width) : Math.min(1, this.model.playerConfig.pHeight / c.height),
				e = this.player.getVideoRect();
			if(this.isPano()) var g = 1,
				f = 1;
			else g = e.width / this.model.videoSetting.videoOrgWidth, f = e.height / this.model.videoSetting.videoOrgHeight;
			h = a.fScale ?
				a.fScale : this.model.playerConfig.pWidth / this.model.playerConfig.pHeight < g * d.width / (f * d.height) ? Math.min(h, 0.5 * e.width / d.width) : Math.min(h, 0.5 * e.height / d.height);
			a.style.position = "absolute";
			switch(c.position + "") {
				case "1":
					a.style.top = e.y + f * h * c.y + "px";
					a.style.left = e.x + g * h * c.x + "px";
					break;
				case "2":
					a.style.top = e.y + f * h * c.y + "px";
					a.style.right = 0.5 * (this.el.offsetWidth - e.width) + g * h * c.x + "px";
					break;
				case "3":
					a.style.bottom = 0.5 * (this.el.offsetHeight - e.height) + f * h * c.y + "px";
					a.style.left = e.x + g * h * c.x + "px";
					break;
				case "4":
					a.style.bottom =
						0.5 * (this.el.offsetHeight - e.height) + f * h * c.y + "px", a.style.right = 0.5 * (this.el.offsetWidth - e.width) + g * h * c.x + "px"
			}
			a.fScale = h;
			a.width = g * h * d.width;
			a.height = f * h * d.height;
			a.getContext("2d").drawImage(d, 0, 0, d.width, d.height, 0, 0, a.width, a.height);
			this.el.appendChild(a)
		};
		return a
	}());
	var PlayUrlProxy = function() {
			function a(a) {
				this.model = a
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.translate = function() {
				this.gslbLoader = new GslbProxy(this.model);
				this.model.videoSetting.gslb ? (this.gslbLoader.addEventListener(LoadEvent.LOADCMP, this.gslbCmp, this), this.gslbLoader.addEventListener(LoadEvent.LOADERROR, this.gslbErr, this), this.gslbLoader.load()) : this.dispatchEvent(new Event(LoadEvent.LOADCMP, this.leUrlsHandler()))
			};
			a.prototype.gslbCmp = function(a) {
				this.dispatchEvent(new Event(LoadEvent.LOADCMP,
					a.args[1]))
			};
			a.prototype.gslbErr = function(a) {
				this.dispatchEvent(new Event(LoadEvent.LOADCMP, this.leUrlsHandler()))
			};
			a.prototype.leUrlsHandler = function(a) {
				a = videoSdkTool.clone(this.model.videoSetting.urls);
				for(var c = 0; c < a.length; c++) a[c] = this.gslbLoader.checkGslbUrl(a[c]);
				return a
			};
			return a
		}(),
		ReportPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.init = function(a, c) {
				this.facade = a;
				this.model = c;
				this.model.record = {};
				this.reportApi =
					new Reporter(c);
				this.reportApi.onStateChanged("init", {
					deviceId: this.model.lc(),
					os: videoSdkTool.getOs(),
					osv: "-",
					width: window.screen.width,
					height: window.screen.height,
					appv: this.model.playerConfig.version
				})
			};
			a.prototype.setUp = function(a, c) {
				this.model.videoSetting.errCode = 0;
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.destroy = function() {
				this.superClass.destroy.apply(this, arguments);
				this.reportApi.reset();
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler,
					this)
			};
			a.prototype.videoSateHandler = function(a) {
				switch(a.args[1]) {
					case PlayerEvent.VIDEO_DATA_CMP:
						0 != this.model.record.ms && (this.model.record.mr = videoSdkTool.now() - this.model.record.ms, this.model.record.ms = 0);
						this.reportApi.onStateChanged("start", {});
						break;
					case MediaEvent.BUFFEREMPTY:
						this.reportApi.onStateChanged("bufferEmpty");
						break;
					case MediaEvent.BUFFEREFULL:
						this.reportApi.onStateChanged("bufferFull");
						break;
					case MediaEvent.PLAY:
						this.reportApi.onStateChanged("resume");
						break;
					case MediaEvent.START:
						0 !=
							this.model.record.vs && (this.model.record.pr = videoSdkTool.now() - this.model.record.vs, this.model.record.vs = 0);
						this.reportApi.onStateChanged("play", {
							cv: {
								stc: {
									mr: this.model.record.mr,
									adr: this.model.record.adr,
									pr: this.model.record.pr,
									gslbr: this.model.record.gslbr
								},
								joint: this.model.joint
							}
						});
						break;
					case MediaEvent.STOP:
						if(a.args[2]) this.reportApi.onStateChanged("playStop");
						else this.reportApi.onStateChanged("stopPlay");
						break;
					case MediaEvent.PAUSE:
						this.reportApi.onStateChanged("pause");
						break;
					case MediaEvent.SEEK:
						this.reportApi.onStateChanged("seek", {
							time: a.args[2]
						});
						break;
					case PlayerEvent.VPH:
						this.reportApi.onStateChanged("hide");
						break;
					case PlayerEvent.VPS:
						this.reportApi.onStateChanged("show");
						break;
					case MediaEvent.DEFSTART:
						this.reportApi.onStateChanged("definition");
						break;
					case PlayerEvent.ERROR:
					case MediaEvent.ERROR:
						a = a.args[2][0];
						this.model.videoSetting.errCode = a.code;
						this.reportApi.onStateChanged("error", {
							errcode: a.code
						});
						this.report({
							logcontent: a.errInfo || ""
						});
						break;
					case AdEvent.HEADEND:
					case AdEvent.NOAD:
						0 != this.model.record.as && (this.model.record.adr =
							videoSdkTool.now() - this.model.record.as, this.model.record.as = 0);
						this.model.record.vs = videoSdkTool.now();
						break;
					case PlayerEvent.VIDEO_DATA_START:
						this.model.record.ms = videoSdkTool.now();
						break;
					case PlayerEvent.GSLB_START:
						this.model.record.gslbs = videoSdkTool.now();
						break;
					case PlayerEvent.GSLB_CMP:
						0 != this.model.record.gslbs && (this.model.record.gslbr = videoSdkTool.now() - this.model.record.gslbs, this.model.record.gslbs = 0), this.model.record.vs = videoSdkTool.now()
				}
			};
			a.prototype.report = function(a) {
				var c = this.model.videoSetting.errCode;
				a && a.hasOwnProperty("code") && (c = a.code);
				var d = {
					ver: "1.0"
				};
				d.uuid = this.model.uuid();
				d.ec = c;
				d.p3 = "h5";
				d.cvid = "vod" == this.model.playType ? this.model.videoSetting.vid : this.model.videoSetting.sid;
				d.vtyp = this.model.playType;
				d.mtyp = "cloud";
				d.cuid = this.model.userData.userId;
				d.leid = this.model.lc();
				d.pver = this.model.playerConfig.version;
				d.type = 1;
				d.logcontent = "";
				for(var h in a) d[h] = a[h];
				ReportTool.report("http://log.cdn.letvcloud.com/sdk/epl", d)
			};
			a.prototype.showLog = function() {
				ReportTool.print(logTool.getLog(),
					this.model.lc())
			};
			a.prototype.getLog = function() {
				return logTool.getLog()
			};
			return a
		}(),
		AdCtrl = function() {
			function a() {
				this.up = this.isvip = 0;
				this.isTrylook = !1;
				this.pname = "";
				this.ark = this.gdur = 0
			}

			function b() {
				this.superClass.constructor.apply(this, arguments)
			}
			var c = SOTool.PluginStack.Ad;
			ClassTool.inherits(b, Control);
			b.prototype.setUp = function(a, b) {
				var c = this;
				c.player = a;
				c.videoOutEl = b;
				if(c.model.config.hasOwnProperty("onPlayerReady"))
					if("function" != typeof c.model.config.onPlayerReady && (c.model.config.onPlayerReady =
							window[c.model.config.onPlayerReady]), "function" == typeof c.model.config.onPlayerReady) try {
						var g = setTimeout(function() {
							c.startLeAd.call(c)
						}, 5E3);
						c.model.config.onPlayerReady({
							video: c.player.player.video,
							el: this.videoOutEl
						}, function(a, b) {
							switch(a) {
								case "adstart":
									clearTimeout(g);
									break;
								case "adend":
									c.startLeAd.call(c)
							}
						})
					} catch(f) {
						c.startLeAd.call(c)
					} else c.startLeAd.call(c);
					else c.startLeAd.call(c)
			};
			b.prototype.startLeAd = function() {
				this.checkAd() ? "undefined" == typeof H5AD || "function" != typeof H5AD.initAD ?
					videoSdkTool.getJS(c, this.initAd, this.initAd, this, "utf-8") : this.initAd() : this.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.NOAD, "skip"))
			};
			b.prototype.checkAd = function() {
				return this.model.config.hasOwnProperty("letvad") && "0" == this.model.config.letvad.toString() || this.model.videoSetting.hasOwnProperty("ark") && "0" == this.model.videoSetting.ark.toString() ? !1 : !0
			};
			b.prototype.initAd = function(c, h) {
				function e(a, b) {
					g.log(a);
					if(g.player) switch(a) {
						case "playAD":
							g.adList = b;
							g.adList && 0 == g.adList.length ?
								setTimeout(function() {
									g.destroy();
									g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.NOAD))
								}, 0) : (g.curAdIndex = 0, g.playAD(), g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADSTART)));
							break;
						case "stopAD":
							setTimeout(function() {
								g.destroy();
								g.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADEND))
							}, 0);
							break;
						case "resumeAD":
							g.videoPlay();
							break;
						case "pauseAD":
							g.videoPause();
							break;
						case "getCurrTime":
							return g.getTime() || 0;
						case "getVideoRect":
							return g.getVideoRect()
					}
				}
				var g = this;
				if("undefined" !=
					typeof H5AD && "function" == typeof H5AD.initAD) {
					var f = new a;
					f.p1 = this.model.reportParam.p1;
					f.p2 = this.model.reportParam.p2;
					f.p3 = this.model.reportParam.p2;
					f.lc = this.model.lc();
					f.uuid = this.model.uuid();
					f.ver = this.model.playerConfig.version;
					f.gdur = this.model.videoSetting.duration;
					f.cont = this.videoOutEl.id;
					"vod" == this.model.playType ? (f.islive = !1, f.cid = this.model.videoSetting.cid, f.vid = this.model.videoSetting.vid, f.mmsid = this.model.videoSetting.mmsid, this.model.videoSetting.hasOwnProperty("pid") && (f.pid = this.model.videoSetting.pid)) :
						"live" == this.model.playType && (f.islive = !0, f.sid = this.model.config.activityId);
					f.ch = this.model.getTypeFrom();
					f.ark = this.model.videoSetting.ark;
					f.useui = 1;
					this.model.videoSetting.hasOwnProperty("p") && (f.ext = "" == this.model.userData.userId ? this.model.videoSetting.p : this.model.videoSetting.p + "|" + this.model.userData.userId);
					H5AD.initAD(f, e)
				} else this.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.NOAD, "error"));
				b.prototype.playAD = function() {
					if(this.curAdIndex < this.adList.length) {
						this.curAd = this.adList[this.curAdIndex];
						this.player.addEventListener(MediaEvent.EVENT, this.mediaHandler, this);
						var a = !0;
						0 == this.curAdIndex && -2 == this.model.config.posterType && (a = "1" == this.model.config.autoplay);
						this.player.startPlay({
							urls: [this.curAd.url]
						}, 0, a)
					} else this.destroy(), this.facade.dispatchEvent(new Event(AdEvent.EVENT, AdEvent.HEADEND))
				};
				b.prototype.mediaHandler = function(a) {
					switch(a.args[1]) {
						case MediaEvent.PLAY:
							H5AD.sendEvent("AD_PLAY", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							break;
						case MediaEvent.PAUSE:
							H5AD.sendEvent("AD_PAUSE", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							break;
						case MediaEvent.STOP:
							H5AD.sendEvent("AD_ENDED", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							});
							this.curAdIndex++;
							H5AD.destory(this.curAd);
							this.playAD();
							break;
						case MediaEvent.ERROR:
							H5AD.sendEvent("AD_ERROR", {
								curAD: this.curAd,
								curIndex: this.curAdIndex
							}), this.curAdIndex++, H5AD.destory(this.curAd), this.playAD()
					}
				};
				b.prototype.videoPlay = function() {
					this.player && this.player.play()
				};
				b.prototype.getTime = function() {
					return this.player ? this.player.getTime() : 0
				};
				b.prototype.videoPause =
					function() {
						this.player && this.player.pause()
					};
				b.prototype.getVideoRect = function() {
					return this.player ? this.player.getVideoRect("wh") : {
						w: 0,
						h: 0
					}
				};
				b.prototype.destroy = function() {
					this.player && (this.player.removeEventListener(MediaEvent.EVENT, this.mediaHandler, this), this.player.closeVideo(), this.player = null);
					try {
						H5AD && this.curAd && H5AD.destory(this.curAd)
					} catch(a) {
						this.log("ad error " + a)
					}
				}
			};
			return b
		}(),
		SkinPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			var b = {
				7: "//{domain}/player/plugin/skin/skin.js"
			};
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a, b, h) {
				a = '<div id="#{video}" style="left:0px;top:0px;position: absolute;width:{width};height:{height};z-index:1;display: block;background-color: #000000;overflow:hidden"></div><div id="#{skin}" style="left:0px;top:0px;position: relative;width:{width};height:{height};z-index:2;overflow: hidden;"></div><div id="#{error}" style="left:0px;top:0px;position: absolute;width:{width};height:{height};z-index:3;overflow: hidden;display:none;"></div>'.replace(/{width}/g,
					"100%");
				a = a.replace(/{height}/g, "100%");
				this.el = UiTool.$E(b);
				this.outEl = UiTool.$E(h);
				this.setStylebyConfig(this.model.config);
				this.skin = new DisplayObject(this.el);
				UiTool.getTemplate(this.el, a);
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.load = function(a) {
				var b = this;
				SOTool.setPluginStack({
					name: "view.skin",
					url: b.getSkinUrl()
				});
				b.model.config.skinnable ? SOTool.getPlugin("view.skin", function(a) {
					a ? (b.skinView = new a(b.facade, b.model), b.skinView.addEventListener(SkinEvent.EVENT,
						b.skinHandler, b), b.skinView.setUp(b.el.skin)) : b.el.removeChild(b.el.skin);
					b.dispatchEvent(new Event(LoadEvent.LOADCMP))
				}) : (b.el.removeChild(b.el.skin), b.facade.removeEventListener(PlayerEvent.EVENT, b.videoSateHandler, b), b.dispatchEvent(new Event(LoadEvent.LOADCMP)))
			};
			a.prototype.getSkinUrl = function() {
				return this.model.config.hasOwnProperty("nskin") && b.hasOwnProperty(this.model.config.nskin) ? b[this.model.config.nskin] : "//{domain}/player/plugin/skin/oldskin.js"
			};
			a.prototype.setStylebyConfig = function(a) {
				var b = ["controls", "fullscreen"],
					h = "vb" + videoSdkTool.creatUuid();
				this.el.className = h;
				for(var e = 0; e < b.length; e++)
					if(!a[b[e]])
						if(a.pageControls) SkinRender["setMedia" + b[e]]("", !1);
						else SkinRender["setMedia" + b[e]](h, !1)
			};
			a.prototype.getVideArea = function() {
				return this.el.skin.videoArea || null
			};
			a.prototype.autoSize = function() {
				var a = this.model.videoSetting.videoWidth,
					b = this.model.videoSetting.videoHeight;
				if(0 != a && 0 != b) switch(a /= b, this.model.config.autoSize + "") {
					case "1":
						b = UiTool.$E(this.el).offsetWidth;
						this.log("\u83b7\u5f97\u5bb9\u5668\u7684\u5bbd\u5ea6==============================" +
							b);
						0 == b && (b = UiTool.$E(this.outEl).style.width, b = -1 == b.indexOf("%") ? parseInt(b) : 0);
						this.log("\u83b7\u5f97\u5bb9\u5668\u7684\u5bbd\u5ea6==============================" + b);
						0 < b && (this.model.config.changeParent && (this.outEl.style.height = b / a + "px"), this.el.style.height = b / a + "px");
						break;
					case "2":
						b = UiTool.$E(this.el).offsetHeight, 0 == b && (b = UiTool.$E(this.outEl).style.height, b = -1 == b.indexOf("%") ? parseInt(b) : 0), 0 < b && (this.model.config.changeParent && (this.outEl.style.width = b * a + "px"), this.el.style.width = b * a + "px")
				}
			};
			a.prototype.setSize = function() {
				this.display = 0 < this.el.offsetWidth && 0 < this.el.offsetHeight ? !0 : !1
			};
			a.prototype.addEvents = function() {};
			a.prototype.removeEvents = function() {};
			a.prototype.destroy = function() {
				this.shutDown();
				this.skinView && (this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler, this), this.skinView.removeEventListener(SkinEvent.EVENT, this.skinHandler, this), this.skinView = null)
			};
			a.prototype.skinHandler = function(a) {
				this.facade.dispatchEvent(a)
			};
			a.prototype.shutDown = function() {
				this.skinView &&
					this.skinView.shutDown()
			};
			a.prototype.videoSateHandler = function(a) {
				a.args[1] !== MediaEvent.LODING && a.args[1] != MediaEvent.PLAYING && this.log(a.args[1]);
				this.skinView && this.skinView.listNotification(a.args[1], a.args[2])
			};
			a.prototype.setVideoPercent = function(a) {};
			a.prototype.setVideoScale = function(a) {};
			a.prototype.setVideoRect = function(a) {};
			a.prototype.refreshPlayerInfo = function(a) {
				this.skinView && this.skinView.refreshPlayerInfo(a)
			};
			return a
		}(),
		VideoPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this,
					arguments)
			}
			var b = SOTool.getObj("media.watermask");
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a, d) {
				this.log("\u5f00\u59cb\u521b\u5efa\u89c6\u9891\u6a21\u5757");
				this.el = d;
				this.skin = new DisplayObject(d);
				this.mediaPlayer = new MediaPlayer(this.getConfig());
				this.water = new b(this.model);
				this.model.videoSetting.volume = 0.8;
				this.model.videoSetting.fullscreen = !1;
				this.setDefinitionList();
				this.getDefaultConfig(this.model.config);
				this.changeVideoInfo(this.definition);
				this.mediaPlayer.setUp(this.model.videoSetting,
					d);
				this.facade.color.setColor(this.skin, "bgColor");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.INIT))
			};
			a.prototype.getConfig = function(a) {
				a = videoSdkTool.clone(this.model.config);
				switch(a.posterType) {
					case "-1":
					case "-2":
						break;
					default:
						a.autoplay = "1", a.pic = ""
				}
				return a
			};
			a.prototype.changeVideoInfo = function(a) {
				this.videoInfo = videoSdkTool.clone(this.model.videoSetting.media[a]);
				this.videoInfo.definitionName = this.videoInfo.definition;
				this.videoInfo.definition = a;
				a = {
					uuid: this.model.uuid(),
					p1: this.model.reportParam.p1,
					p2: this.model.reportParam.p2,
					p3: this.model.reportParam.p3
				};
				this.model.videoSetting.hasOwnProperty("liveId") && (a.liveid = this.model.videoSetting.liveId, this.videoInfo.lid = this.model.videoSetting.liveId);
				this.model.videoSetting.hasOwnProperty("vid") && (a.vid = this.model.videoSetting.vid);
				a.ajax = 1;
				videoSdkTool.addUrlParams(this.videoInfo.urls, a);
				this.model.videoSetting.refresh(this.videoInfo)
			};
			a.prototype.setDefinitionList = function() {
				var a = [],
					b = this.model,
					h;
				for(h in b.videoSetting.media) a.push(h);
				a.sort(function(a, c) {
					return b.defaultDefinitionList.indexOf(c) - b.defaultDefinitionList.indexOf(a)
				});
				b.videoSetting.refresh({
					definitionList: a
				})
			};
			a.prototype.getDefaultConfig = function(a) {
				this.definition = this.model.videoSetting.defaultDefinition || this.model.videoSetting.definitionList[0];
				a.hasOwnProperty("rate") && -1 != this.model.videoSetting.definitionList.indexOf(a.rate) && (this.definition = a.rate);
				this.startime = 0;
				a.hasOwnProperty("start") && (this.startime = a.start)
			};
			a.prototype.setSize = function(a, b, h) {
				this.mediaPlayer.setSize();
				this.water && this.water.setSize()
			};
			a.prototype.showPoster = function(a) {
				var b = this;
				b.hidePoster();
				b.poster = null;
				b.mediaPlayer.hide(!1);
				switch(this.model.config.posterType) {
					case "-2":
					case "-1":
						b.mediaPlayer.show();
						break;
					case "0":
						break;
					default:
						b.addPoster()
				}
				if(-2 == b.model.config.posterType) b.mediaPlayer.setPoster(b.getPosterUrl()), b.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_AUTH_VALID));
				else if(this.model.config.skinnable || b.model.config.controls) "7" == this.model.config.nskin ? (b.playBtn =
						UiTool.$C("canvas"), b.playBtn.style.cssText = "position:absolute;width:80px;height:80px;left:50%;top:50%;z-index:2;cursor:pointer;margin-left:-40px;margin-top:-40px;", b.playBtn.width = 80, b.playBtn.height = 80, b.render()) : (b.playBtn = UiTool.$C("DIV"), b.playBtn.style.cssText = "position:absolute;width:75px;height:75px;left:50%;top:50%;background:rgba(1, 1, 1, 0) url(http://yuntv.letv.com/assets/img/skin.png?v=1901) no-repeat -111px -101px;margin: -40px 0 0 -38px;z-index:2;cursor:pointer;"), b.el.appendChild(b.playBtn),
					UiTool.addEvent(b.playBtn, "click", function(a) {
						b.startAuth.call(b)
					})
			};
			a.prototype.render = function() {
				if(this.playBtn) {
					var a = this.playBtn.getContext("2d");
					a.beginPath();
					a.arc(40, 40, 37, 0, 2 * Math.PI, !0);
					a.closePath();
					a.fillStyle = UiTool.hexToRgba("#000000", 0.5);
					a.fill();
					a.lineWidth = 5;
					a.strokeStyle = this.facade.color.colorConfig.active;
					a.lineWidth = 1;
					a.strokeStyle = this.facade.color.colorConfig.fault;
					a.beginPath();
					a.moveTo(32, 25);
					a.lineTo(55, 40);
					a.lineTo(32, 55);
					a.closePath();
					a.stroke();
					a.fillStyle = UiTool.hexToRgba(this.facade.color.colorConfig.fault,
						1);
					a.fill()
				}
			};
			a.prototype.addPoster = function(a) {
				this.poster ? this.poster.style.display = "" : (this.poster = UiTool.$C("DIV"), this.poster.src = this.getPosterUrl(), this.poster.style.cssText = "position:absolute;width:100%;height:100%; top: 0px;left: 0px;background:rgba(1, 1, 1, 0) url(" + this.poster.src + ") no-repeat 50% 50%;background-size:" + ["", "contain", "cover", "100% 100%"][this.model.config.posterType] + ";z-index:2;cursor:pointer;");
				this.el.appendChild(this.poster)
			};
			a.prototype.hidePoster = function(a) {
				this.poster &&
					this.el && this.poster.parentNode == this.el && (this.el.removeChild(this.poster), this.poster = null);
				this.playBtn && this.el && this.playBtn.parentNode == this.el && (this.el.removeChild(this.playBtn), this.playBtn = null)
			};
			a.prototype.startAuth = function(a) {
				this.hidePoster();
				this.model.config.onlyPic ? this.mediaPlayer.hide() : this.mediaPlayer.show();
				this.mediaPlayer.play();
				0 > this.model.config.posterType + 0 ? this.mediaPlayer.setPoster(this.getPosterUrl()) : this.mediaPlayer.setPoster("");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT,
					PlayerEvent.VIDEO_AUTH_VALID))
			};
			a.prototype.startPlay = function(a) {
				this.log("\u5f00\u59cb\u5c1d\u8bd5\u64ad\u653e");
				this.isStartPlay = !1;
				this.setDefinitionList();
				this.getDefaultConfig(this.model.config);
				this.mediaPlayer.addEventListener(MediaEvent.EVENT, this.mediaHandler, this);
				this.facade.addEventListener(SkinEvent.EVENT, this.skinSateHandler, this);
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this);
				this.mediaPlayer.setContainer(a);
				this.mediaPlayer.setLoop(this.model.config.loop);
				this.playVideo(this.start);
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.CONNECT))
			};
			a.prototype.startGslb = function(a) {
				this.gslbplayTime = a;
				this.gslbLoader = new PlayUrlProxy(this.model);
				this.gslbLoader.addEventListener(LoadEvent.LOADCMP, this.gslbCmp, this);
				this.gslbLoader.addEventListener(LoadEvent.LOADERROR, this.gslbErr, this);
				this.gslbLoader.translate();
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.GSLB_START))
			};
			a.prototype.gslbCmp = function(a) {
				var b = this;
				b.videoInfo.urls =
					a.args[1];
				var h = !0;
				0 != b.model.joint || b.isStartPlay || -2 != b.model.config.posterType || (h = "1" == b.model.config.autoplay);
				b.model.config.onlyPic ? (b.mediaPlayer.show(), setTimeout(function() {
					b.mediaPlayer.startPlay(b.videoInfo, b.gslbplayTime, h, b.getPlayerType())
				}, 10)) : b.mediaPlayer.startPlay(b.videoInfo, b.gslbplayTime, h, b.getPlayerType());
				b.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.GSLB_CMP))
			};
			a.prototype.gslbErr = function(a) {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR,
					a.args[2]))
			};
			a.prototype.setAutoReplay = function(a) {
				this.mediaPlayer.setLoop(a)
			};
			a.prototype.setDefinition = function(a) {
				this.definition != a && -1 != this.model.videoSetting.definitionList.indexOf(a) && (this.log("\u5207\u6362\u7801\u6d41-----------------------------" + a), this.definition = a, this.isStartPlay = !1, this.playVideo(this.mediaPlayer.getTime()), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.DEFSTART)))
			};
			a.prototype.playVideo = function(a) {
				"pano" != this.getPlayerType() || videoSdkTool.checkPano() ?
					(this.changeVideoInfo(this.definition), this.mediaPlayer.getVideoEl() && this.mediaPlayer.getVideoEl().setAttribute("data-rate", GlobalHandler.definitionTurn2(this.model.videoSetting.definition)), this.startGslb(a)) : this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
						code: 490,
						message: "\u8be5\u8bbe\u5907\u8fd8\u4e0d\u652f\u63013d\u529f\u80fd,\u5efa\u8bae\u4f7f\u7528windows\u548c\u5b89\u5353\u7cfb\u7edf\u4e0b\u7684\u8c37\u6b4c\u6d4f\u89c8\u5668\u4f53\u9a8c\u8be5\u529f\u80fd"
					}]))
			};
			a.prototype.getDefinitionList = function() {
				return this.model.videoSetting.definitionList
			};
			a.prototype.videoSateHandler = function(a) {
				switch(a.args[1]) {
					case PlayerEvent.VPH:
						this.isStartPlay && this.mediaPlayer.pause();
						break;
					case MediaEvent.START:
						this.isStartPlay = !0;
						this.mediaPlayer.show();
						this.model.config.onlyPic && this.addPoster();
						this.water.setUp(this.mediaPlayer);
						break;
					case MediaEvent.STOP:
						this.isStartPlay = !1;
						break;
					case PlayerEvent.ERROR:
					case MediaEvent.ERROR:
						this.isStartPlay = !1;
					case PlayerEvent.VIDEO_INFO:
						this.model.config.skinnable &&
							this.mediaPlayer.hide(!1);
						break;
					case PlayerEvent.FULLSCREEN:
						this.model.config.onlyPic && !this.model.videoSetting.fullscreen && this.mediaPlayer.hide();
						break;
					case PlayerEvent.PRESIZE:
						this.setSize()
				}
			};
			a.prototype.skinSateHandler = function(a) {
				switch(a.args[1]) {
					case SkinEvent.PLAY:
						if(this.model.config.onlyPic) {
							var b = this;
							b.mediaPlayer.show();
							setTimeout(function() {
								b.mediaPlayer.play()
							}, 10)
						} else this.mediaPlayer.play();
						break;
					case SkinEvent.PAUSE:
						this.mediaPlayer.pause();
						break;
					case SkinEvent.SEEK:
						this.mediaPlayer.seek(a.args[2]);
						break;
					case SkinEvent.VOLUME:
						this.model.videoSetting.volume = a.args[2];
						this.mediaPlayer.setVol(this.model.videoSetting.volume);
						break;
					case SkinEvent.SETDEFINITION:
						this.setDefinition(a.args[2]);
						break;
					case SkinEvent.REPLAY:
						this.mediaPlayer.replay()
				}
			};
			a.prototype.getPlayerType = function() {
				return this.model.config.hasOwnProperty("pano") && "1" == this.model.config.pano || "1" == this.model.videoSetting.pano ? "pano" : ""
			};
			a.prototype.mediaHandler = function(a) {
				switch(a.args[1]) {
					case MediaEvent.ERROR:
						if("vod" == this.model.playType &&
							this.model.vodPlayType && "ios" == this.model.vodPlayType && a.args[2][0].retryCdn) {
							this.model.vodPlayType = "mp4";
							videoSdkTool.setLocal("playType", this.model.vodPlayType);
							this.log("\u91cd\u65b0\u8c03\u5ea6");
							this.startGslb(0);
							return
						}
				}
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, a.args[1], a.args[2]))
			};
			a.prototype.getPosterUrl = function(a) {
				return this.model.config.hasOwnProperty("pic") ? this.model.config.pic : this.model.videoSetting.pic
			};
			a.prototype.destroy = function(a) {
				this.facade.removeEventListener(SkinEvent.EVENT,
					this.skinSateHandler, this);
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoSateHandler, this);
				this.mediaPlayer.removeEventListener(MediaEvent.EVENT, this.mediaHandler, this);
				this.mediaPlayer.destroy();
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, MediaEvent.STOP, !1))
			};
			a.prototype.refreshPlayerInfo = function(a) {
				"7" == this.model.config.nskin && this.render();
				this.water.setUp(this.mediaPlayer)
			};
			return a
		}(),
		GlobalPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a) {
				this.player = a;
				this.addEvents()
			};
			a.prototype.addEvents = function() {
				var a = this;
				a.addVideoEvent = !1;
				a.facade.addEventListener(SkinEvent.EVENT, a.skinSateHandler, a);
				a.facade.addEventListener(PlayerEvent.EVENT, a.videoSateHandler, a);
				a.fullChangeFun = videoSdkTool.bindFun(a.fullChange, a);
				a.resizeFun = videoSdkTool.bindFun(a.resize, a);
				UiTool.addEvent(document, "fullscreenchange,webkitfullscreenchange,mozfullscreenchange,MSFullscreenChange", a.fullChangeFun);
				UiTool.addEvent(window, "resize", this.resizeFun);
				UiTool.addEvent(window, "pagehide", videoSdkTool.bindFun(this.pageHide, this));
				var c;
				["webkit", "moz", "o", "ms"].forEach(function(a) {
					"undefined" != typeof document[a + "Hidden"] && (c = a)
				});
				UiTool.addEvent(document, c + "visibilitychange", function() {
					"hidden" == document[c + "VisibilityState"] ? a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VPH)) : "visible" == document[c + "VisibilityState"] && a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VPS))
				})
			};
			a.prototype.videoSateHandler = function(a) {
				switch(a.args[1]) {
					case PlayerEvent.INIT:
						this.addVideoEvents()
				}
			};
			a.prototype.pageHide = function(a) {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.WPH))
			};
			a.prototype.fullChange = function() {
				this.model.videoSetting && (this.model.videoSetting.fullscreen = UiTool.isFullScreen(), this.model.videoSetting.fullscreen || (this.cancelFullscreen(), this.resizeFun()), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.FULLSCREEN, this.model.videoSetting.fullscreen)))
			};
			a.prototype.resize = function() {
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.PRESIZE))
			};
			a.prototype.cancelFullscreen = function() {
				var a = this.player.skinplugin.skin;
				a.hasAttribute("tmpStyle") && (a.setStyle({
					cssText: a.getAttribute("tmpStyle")
				}), a.removeAttribute("tmpStyle"));
				this.bodyTmpOverFlow && (document.body.style.overflow = this.bodyTmpOverFlow)
			};
			a.prototype.addVideoEvents = function(a) {
				a = this.player.videoplugin.mediaPlayer.getVideoEl();
				var c = this;
				c.addVideoEvent || (a.addEventListener("webkitbeginfullscreen",
					function() {
						c.model.videoSetting.fullscreen = !0;
						c.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.FULLSCREEN, c.model.videoSetting.fullscreen))
					}), a.addEventListener("webkitendfullscreen", function() {
					c.model.videoSetting.fullscreen = !1;
					c.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.FULLSCREEN, c.model.videoSetting.fullscreen));
					c.resizeFun()
				}), c.addVideoEvent = !0)
			};
			a.prototype.skinSateHandler = function(a) {
				switch(a.args[1]) {
					case SkinEvent.FULLSCREEN:
						a = this.player.videoplugin.mediaPlayer.getVideoEl();
						if(this.model.config.dfull && a && a.webkitEnterFullscreen && "chrome" != videoSdkTool.getBrowser()) {
							a.webkitEnterFullscreen();
							break
						}
						this.model.videoSetting.fullscreen ? (this.model.videoSetting.fullscreen = !1, this.cancelFullscreen(), UiTool.supportFullScreen() && this.model.config.dfull && UiTool.cancelFullScreen()) : (this.model.videoSetting.fullscreen = !0, this.player.skinplugin.skin.setAttribute({
								tmpStyle: this.player.skinplugin.el.style.cssText
							}), UiTool.supportFullScreen() && this.model.config.dfull ? UiTool.fullScreen(this.player.skinplugin.el) :
							(this.bodyTmpOverFlow = document.body.style.overflow, document.body.style.overflow = "hidden"), this.player.skinplugin.skin.setStyle({
								cssText: "background: #000;width:100%;height:100%;position:fixed;top:0;left:0;z-index:1000;overflow:hidden;"
							}));
						this.resizeFun()
				}
			};
			return a
		}(),
		ErrorPlayer = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, Control);
			a.prototype.setUp = function(a, c, d) {
				this.el = c;
				this._api = d;
				this.skin = new DisplayObject(this.el);
				this.playingStop = !1;
				this.error =
					null;
				this.facade.addEventListener(PlayerEvent.EVENT, this.videoSateHandler, this)
			};
			a.prototype.videoSateHandler = function(a) {
				var c = this;
				switch(a.args[1]) {
					case MediaEvent.START:
					case MediaEvent.BUFFEREFULL:
						this.skin.setVisible(!1);
						break;
					case MediaEvent.ERROR:
					case PlayerEvent.ERROR:
					case PlayerEvent.VIDEO_INFO:
						this.skin.setVisible(!0);
						if(!this.model.config.skinnable) break;
						c.error ? c.error.show(a.args[2], c.el, {
							api: c._api,
							model: c.model
						}) : SOTool.getPlugin("ErrorInfo", function(d) {
							d && (c.error = new d, c.error.show(a.args[2],
								c.el, {
									api: c._api,
									model: c.model
								}))
						});
						break;
					case MediaEvent.STOP:
						this.playingStop = !0;
						this.skin.setVisible(!1);
						break;
					case MediaEvent.PLAYING:
						this.playingStop && this.skin.setVisible(!1);
						this.playingStop = !1;
						break;
					case PlayerEvent.VIDEO_LIVESTOP:
						this.playingStop = !0
				}
			};
			a.prototype.report = function() {};
			return a
		}(),
		Api = function() {
			function a(a, c, d) {
				"undefined" != typeof d.api[a] && (c[a] = function() {
					return d.api[a].apply(d.api, arguments)
				})
			}
			return function(b) {
				for(var c = 0; c < ApiList.length; c++) a(ApiList[c], this, b)
			}
		}(),
		FlashSdk = function() {
			function a(a, d, h) {
				b.prototype[a] = function() {
					return h[a].apply(h, arguments)
				}
			}

			function b(c) {
				this.player = c;
				for(c = 0; c < ApiList.length; c++) a(ApiList[c], b, this.player.plugin);
				b.prototype.playNewId = function(a) {
					return this.player.plugin.setLejuData(a)
				};
				b.prototype.callFlash = function(a) {
					return this.player.plugin[a.action](a.value)
				}
			}
			return b
		}(),
		H5Sdk = function() {
			function a(a) {
				this._pl = a
			}
			a.prototype.playNewId = function(a) {
				return this._pl.playNewId(a)
			};
			a.prototype.getVideoSetting = function() {
				for(var a =
						videoSdkTool.clone(this._pl.model.videoSetting), c = {}, d = 0; d < GlobalHandler.settingList().length; d++) {
					var h = GlobalHandler.settingList()[d];
					a.hasOwnProperty(h) ? c[h] = "definition" == h ? this.getDefinition() : "defaultDefinition" == h ? this.getDefaultDefinition() : a[h] : c[h] = ""
				}
				return c
			};
			a.prototype.getVideoTime = function() {
				return this._pl.videoplugin ? this._pl.videoplugin.mediaPlayer.getTime() : 0
			};
			a.prototype.pauseVideo = function() {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PAUSE))
			};
			a.prototype.resumeVideo =
				function() {
					this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.PLAY))
				};
			a.prototype.seekTo = function(a) {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SEEK, a))
			};
			a.prototype.replayVideo = function() {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.REPLAY))
			};
			a.prototype.closeVideo = function() {
				this._pl.closeVideo()
			};
			a.prototype.setVolume = function(a) {
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.VOLUME, a))
			};
			a.prototype.shutDown = function() {
				this._pl.shutDown()
			};
			a.prototype.startUp = function() {
				this._pl.startUp()
			};
			a.prototype.getBufferPercent = function() {
				return this._pl.videoplugin ? this._pl.videoplugin.mediaPlayer.getBufferPercent() : 0
			};
			a.prototype.setDefinition = function(a) {
				a = GlobalHandler.definitionTurn(a);
				this._pl.facade.dispatchEvent(new Event(SkinEvent.EVENT, SkinEvent.SETDEFINITION, a))
			};
			a.prototype.getDefinition = function() {
				return GlobalHandler.definitionTurn2(this._pl.model.videoSetting.definition)
			};
			a.prototype.getDefaultDefinition = function() {
				return GlobalHandler.definitionTurn2(this._pl.model.videoSetting.defaultDefinition)
			};
			a.prototype.getDefinitionList = function() {
				for(var a = [], c = 0; c < this._pl.model.videoSetting.definitionList.length; c++) {
					var d = GlobalHandler.definitionTurn2(this._pl.model.videoSetting.definitionList[c]);
					a.push(d)
				}
				return a
			};
			a.prototype.setVideoPercent = function(a) {
				this._pl.skinplugin.setVideoPercent(a)
			};
			a.prototype.getVideoPercent = function() {};
			a.prototype.setVideoScale = function(a) {
				this._pl.skinplugin.setVideoScale(a);
				return 0
			};
			a.prototype.getVideoScale = function() {
				return 0
			};
			a.prototype.resetVideoScale = function() {
				this._pl.skinplugin.setVideoScale(0);
				return 0
			};
			a.prototype.fullVideoScale = function() {
				this._pl.skinplugin.setVideoScale(1)
			};
			a.prototype.setVideoRect = function(a) {
				this._pl.skinplugin.setVideoScale(a)
			};
			a.prototype.getLoadPercent = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.mediaPlayer.getLoadPercent()
			};
			a.prototype.getDownloadSpeed = function() {
				return 0
			};
			a.prototype.getPlayRecord = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.getPlayRecord()
			};
			a.prototype.getPlayState = function() {
				if(this._pl.videoplugin) return this._pl.videoplugin.getPlayState()
			};
			a.prototype.setVideoColor = function() {
				return -1
			};
			a.prototype.getVideoColor = function() {
				return -1
			};
			a.prototype.getVersion = function() {
				return this._pl.version
			};
			a.prototype.setAutoReplay = function(a) {
				return this._pl.videoplugin.setAutoReplay(a)
			};
			a.prototype.feedback = function(a) {
				return this._pl.feedback(a)
			};
			a.prototype.getLog = function(a) {
				return this._pl.getLog(a)
			};
			a.prototype.getServerTime = function(a) {};
			a.prototype.setPlayerInfo = function(a) {
				this._pl.setPlayerInfo(a)
			};
			a.prototype.setHorseRaceLampInfo = function(a) {};
			return a
		}(),
		PlayerConf = {
			configConver: function(a, b) {
				var c = {
					dfull: !0,
					fullscreen: !0,
					skinnable: !0,
					controls: !1,
					loop: !1,
					definition: !0,
					autoSize: "0",
					changeParent: !1,
					posterType: "1",
					playsinline: "1",
					autoplay: "0",
					onlyPic: !1,
					playIngBg: !1,
					dvideoSize: !0,
					mustAutoplay: !1,
					next: !1,
					setBtn: !1,
					seek: !0,
					share: !1,
					controlBarVisible: !0,
					bigPlayBtnVisible: !0,
					pageControls: !1
				};
				a.setBtn = !1;
				a.share = !1;
				a.hasOwnProperty("pa") && (a.pano = a.pa, delete a.pa);
				a.hasOwnProperty("auto_play") && (a.autoplay = a.auto_play, delete a.auto_play);
				a.hasOwnProperty("autoReplay") &&
					(a.loop = "1" == a.autoReplay, delete a.autoReplay);
				0 > parseInt(a.posterType) && !a.hasOwnProperty("controls") && !a.hasOwnProperty("skinnable") && (a.controls = "1", a.skinnable = "0");
				b.skinnable = 1;
				b.controls = 1;
				for(var d in a) b[d] = a[d];
				for(d in c) a.hasOwnProperty(d) ? "boolean" == typeof c[d] && (a[d] = "1" == a[d]) : a[d] = c[d];
				if(1 < parseInt(a.autoplay) || 0 > parseInt(a.autoplay)) a.autoplay = "0";
				if(3 < parseInt(a.posterType) || -2 > parseInt(a.posterType)) a.posterType = "1";
				a.autoplay += "";
				a.posterType += "";
				a.hasOwnProperty("rate") && (a.rate =
					GlobalHandler.definitionTurn(a.rate));
				a.onlyPic = !1;
				a.playIngBg = !0;
				switch(videoSdkTool.getDevice()) {
					case "androidPhone":
					case "androidPad":
					case "android":
						switch(videoSdkTool.getBrowser()) {
							case "uc":
								a.skinnable = !1;
								a.controls = !0;
								break;
							default:
								a.mustAutoplay || (a.autoplay = "0")
						}
						a.soundVisible = !1;
						b.soundVisible = !1;
						break;
					case "iphone":
						switch(videoSdkTool.getBrowser()) {
							case "uc":
								a.dfull = !1;
								break;
							case "qq":
								a.onlyPic = !0;
								break;
							default:
								var c = navigator.userAgent.toLowerCase(),
									h = [/cpu iphone os 8_/];
								for(d = 0; d < h.length; d++)
									if(h[d].test(c)) {
										a.dvideoSize = !1;
										break
									}
								if(0 <= parseInt(a.posterType) && (h = [/cpu iphone os 6_/], a.skinnable))
									for(d = 0; d < h.length; d++)
										if(h[d].test(c)) {
											a.onlyPic = !0;
											break
										}
						}
						a.soundVisible = !1;
						b.soundVisible = !1;
					case "ipad":
						switch(videoSdkTool.getBrowser()) {
							case "qqwebview":
							case "weixin":
								c = navigator.userAgent.toLowerCase();
								/cpu iphone os 8_/.test(c) && !a.mustAutoplay && (a.autoplay = "0");
								break;
							default:
								a.mustAutoplay || (a.autoplay = "0")
						}
						break;
					case "pc":
						a.playIngBg = !1
				}
			}
		},
		BaseH5Player = function() {
			function a() {
				this.init()
			}
			ClassTool.inherits(a, ClassObject);
			a.prototype.init = function() {
				this.api = new H5Sdk(this)
			};
			a.prototype.setUp = function(a, c, d) {
				this.vModelInit = this.canplay = !1;
				this.model = new Model;
				this.setModelByEnv();
				this.model.api = this.getVideoApi();
				this.model.outConfig = {};
				this.configHanlder(a, this.model.outConfig);
				this.model.config.refresh(a);
				this.model.playerConfig.refresh({
					version: this.version
				});
				this.facade = new Facade;
				this.facade.init(this.model.config);
				this.reportplugin = new ReportPlayer(this.facade, this.model);
				this.reportplugin.setUp();
				this.globalplugin =
					new GlobalPlayer(this.facade, this.model);
				this.globalplugin.setUp(this);
				this.skinplugin = new SkinPlayer(this.facade, this.model);
				this.skinplugin.setUp(a, c, d);
				this.errorplugin = new ErrorPlayer(this.facade, this.model);
				this.errorplugin.setUp(this, this.skinplugin.el.error, this.api);
				this.addEvents();
				this.envCheck() && this.startGetData()
			};
			a.prototype.envCheck = function() {
				return "1" != this.model.config.pano || videoSdkTool.checkPano() ? !0 : (this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_INFO, [{
					code: ERR.NOSupport,
					message: "\u8be5\u8bbe\u5907\u8fd8\u4e0d\u652f\u63013d\u529f\u80fd,\u5efa\u8bae\u4f7f\u7528window\u6216\u5b89\u5353\u7cfb\u7edf\u4e0b\u7684\u8c37\u6b4c\u6d4f\u89c8\u5668\u4f53\u9a8c\u8be5\u529f\u80fd"
				}])), !1)
			};
			a.prototype.setModelByEnv = function() {
				switch(videoSdkTool.getDevice()) {
					case "pc":
					case "mac":
						this.model.systemData.refresh({
							pc: !0
						});
						break;
					default:
						this.model.systemData.refresh({
							pc: !1
						})
				}
			};
			a.prototype.configHanlder = function(a, c) {
				PlayerConf.configConver(a, c)
			};
			a.prototype.addEvents =
				function() {
					this.facade.addEventListener(SkinEvent.EVENT, this.skinHandler, this);
					this.facade.addEventListener(PlayerEvent.EVENT, this.videoHandler, this)
				};
			a.prototype.removedEvents = function() {
				this.facade.removeEventListener(SkinEvent.EVENT, this.skinHandler, this);
				this.facade.removeEventListener(PlayerEvent.EVENT, this.videoHandler, this)
			};
			a.prototype.startGetData = function() {
				this.log("\u5f00\u59cb\u8bf7\u6c42\u6570\u636e");
				this.vModel = new ModelHandler(this.model);
				this.vModel.addEventListener(LoadEvent.LOADCMP,
					this.dataCmp, this);
				this.vModel.addEventListener(LoadEvent.LOADERROR, this.errorHanlder, this);
				this.vModel.setUp(this.model.config, this.skinplugin);
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_DATA_START))
			};
			a.prototype.dataCmp = function() {
				this.log("\u8bf7\u6c42GpC\u6210\u529f");
				var a = this;
				"0" == a.model.videoSetting.isdrm ? (a.setupPlayer(), a.vModelInit = !0, a.skinplugin.addEventListener(LoadEvent.LOADCMP, function() {
						"0" == a.model.config.autoplay ? a.videoplugin.showPoster() : a.videoplugin.startAuth()
					},
					this), a.facade.color.register(this.model.config), a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.VIDEO_DATA_CMP)), a.skinplugin.load()) : a.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR, [{
					code: ERR.VOD_CONFIG_DRM,
					message: "\u89c6\u9891\u4e3a\u52a0\u5bc6\u89c6\u9891\uff0c\u65e0\u6cd5\u89e3\u5bc6\u64ad\u653e"
				}]))
			};
			a.prototype.setupPlayer = function() {
				this.log("\u5f00\u59cb\u521b\u5efa\u64ad\u653e\u5668");
				this.videoplugin || (this.videoplugin = new VideoPlayer(this.facade, this.model),
					this.videoplugin.setUp(this.model.videoSetting, this.skinplugin.el.video))
			};
			a.prototype.creatVideo = function() {
				this.log("\u5f00\u59cb\u521b\u5efa\u89c6\u9891");
				this.videoplugin.startPlay(this.skinplugin.getVideArea())
			};
			a.prototype.setupAdplugin = function() {
				this.model.record.as = videoSdkTool.now();
				this.log("\u5f00\u59cb\u8bf7\u6c42\u5e7f\u544a");
				this.adplugin = new AdCtrl(this.facade, this.model);
				this.facade.addEventListener(AdEvent.EVENT, this.adHandler, this);
				this.adplugin.setUp(this.videoplugin.mediaPlayer,
					this.skinplugin.el)
			};
			a.prototype.errorHanlder = function(a) {
				this.log("\u6570\u636e\u8bf7\u6c42\u5931\u8d25");
				this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, PlayerEvent.ERROR, a.args[1]))
			};
			a.prototype.adHandler = function(a) {
				this.log("\u5e7f\u544a\u8fd4\u56de" + a.args[1]);
				switch(a.args[1]) {
					case AdEvent.HEADSTART:
						this.model.joint = 2;
						this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, AdEvent.HEADSTART));
						break;
					case AdEvent.HEADEND:
						this.model.joint = 2;
					case AdEvent.NOAD:
						this.model.joint = 0, this.facade.removeEventListener(AdEvent.EVENT,
							this.adHandler, this), this.facade.dispatchEvent(new Event(PlayerEvent.EVENT, a.args[1], a.args[2])), this.creatVideo()
				}
			};
			a.prototype.videoHandler = function(a) {
				this.vStateHandler(a);
				switch(a.args[1]) {
					case PlayerEvent.VIDEO_AUTH_VALID:
						this.canplay = !0;
						this.setupAdplugin();
						break;
					case PlayerEvent.VIDEO_DATA_START:
					case PlayerEvent.GSLB_START:
					case PlayerEvent.GSLB_CMP:
					case PlayerEvent.VIDEO_DATA_CMP:
					case MediaEvent.PLAYING:
					case MediaEvent.LODING:
						return;
					case PlayerEvent.INIT:
						"0" != this.model.config.autoSize && this.skinplugin.autoSize();
						this.model.playerConfig.refresh({
							pWidth: this.skinplugin.el.offsetWidth,
							pHeight: this.skinplugin.el.offsetHeight
						});
						break;
					case PlayerEvent.WPH:
						this.destroy();
						return
				}
				if(this.model.config.hasOwnProperty("callbackJs")) {
					var c = a.args[1];
					a = a.args[2];
					c == PlayerEvent.ERROR && (c = MediaEvent.ERROR);
					WIN[this.model.config.callbackJs] && WIN[this.model.config.callbackJs](c, a)
				}
			};
			a.prototype.vStateHandler = function(a) {};
			a.prototype.skinHandler = function(a) {};
			a.prototype.destroy = function() {
				this.skinplugin && this.skinplugin.shutDown();
				this.globalplugin && this.globalplugin.destroy();
				this.videoplugin && this.videoplugin.destroy();
				this.removedEvents();
				this.vModel && (this.vModel.destroy(), this.vModel = null);
				this.adplugin && (this.adplugin.destroy(), this.adplugin = null);
				this.reportplugin && this.reportplugin.destroy()
			};
			a.prototype.closeVideo = function() {
				this.videoplugin.destroy()
			};
			a.prototype.shutDown = function() {
				this.destroy();
				this.addEvents();
				this.videoplugin && this.videoplugin.showPoster()
			};
			a.prototype.startUp = function() {
				this.log("call startUp -vModelInit:" +
					this.vModelInit);
				this.destroy();
				this.vModelInit ? (this.reportplugin.setUp(), this.addEvents(), this.videoplugin && this.videoplugin.startAuth()) : (this.model.config.autoplay = "1", this.reportplugin.setUp(), this.addEvents(), this.startGetData())
			};
			a.prototype.playNewId = function(a) {
				var c = "";
				this.destroy();
				this.model.clear();
				this.setModelByEnv();
				this.model.playerConfig.refresh({
					version: this.version
				});
				this.model.init({
					deviceId: this.model.lc(),
					os: videoSdkTool.getOs(),
					osv: "-",
					width: window.screen.width,
					height: window.screen.height,
					appv: this.version
				});
				this.vModelInit = !1;
				this.canplay && !a.hasOwnProperty("autoplay") && (c = "1");
				this.configHanlder(a, this.model.outConfig);
				"" != c && (a.autoplay = c);
				this.model.config.refresh(a);
				this.reportplugin.setUp();
				this.addEvents();
				this.startGetData()
			};
			a.prototype.feedback = function(a) {
				"undefined" == typeof a && (a = {});
				a.type = "0";
				a.logcontent = api.getLog();
				this.reportplugin.report(a)
			};
			a.prototype.getLog = function() {
				return this.reportplugin.getLog()
			};
			a.prototype.getVideoApi = function() {
				var a = this;
				return {
					getVideoInfo: function() {
						return {
							time: a.videoplugin.mediaPlayer.getTime()
						}
					}
				}
			};
			a.prototype.setPlayerInfo = function(a) {
				var c = {
					buttonColor: "fault",
					progressBarColor: "active"
				};
				if(a.hasOwnProperty("onoff")) {
					for(var d in a.onoff) a[d] = a.onoff[d];
					delete a.onoff
				}
				for(d in a) c.hasOwnProperty(d) && (a[c[d]] = a[d], delete a[d]), "boolean" == typeof this.model.config[d] && (a[d] = "1" == a[d] + "");
				c = {};
				c.logo = a.logo;
				c.watermark = a.watermark;
				this.model.playerConfig.refresh(c);
				this.model.config.refresh(a);
				this.facade.color.refresh(a);
				this.skinplugin.refreshPlayerInfo(a);
				this.videoplugin.refreshPlayerInfo(a)
			};
			return a
		}(),
		BlH5Player = function() {
			function a() {
				this.superClass.constructor.apply(this, arguments)
			}
			ClassTool.inherits(a, BaseH5Player);
			a.prototype.init = function() {
				this.superClass.init.apply(this, arguments);
				this.version = "H5_Vod_20160629_4.5.2"
			};
			a.prototype.setModelByEnv = function() {
				this.superClass.setModelByEnv.apply(this, arguments);
				this.model.playType = "vod";
				this.model.videoSetting.gslb = !0;
				videoSdkTool.isHttps() && (this.model.videoSetting.gslb = !1)
			};
			return a
		}(),
		BlFlashPlayer = function() {
			function a(a) {
				this.minVer =
					a
			}
			a.prototype = {
				setUp: function(a, c) {
					var d = "http://yuntv.letv.com/bcloud.swf";
					videoSdkTool.isHttps() && (d = "https://s.yuntv.letv.com/bclouds.swf");
					a.hasOwnProperty("p") && 101 != a.p && (d = "http://yuntv.letv.com/bcloud.swf");
					a.hasOwnProperty("callback") && (a.callbackJs = a.callback, delete a.callback);
					var h = "Opaque";
					a.hasOwnProperty("wmode") && (h = a.wmode, delete a.wmode);
					"Opaque" == h && (a.panoType = 1);
					this.id = FlashPlayer.create(c, {
						url: d,
						version: this.minVer,
						wmode: h
					}, this.flashvarsToString(a));
					this.plugin = FlashPlayer.getPlayer(this.id);
					this.api = new FlashSdk(this)
				},
				flashvarsToString: function(a) {
					var c = "",
						d;
					for(d in a) c += d + "=" + a[d] + "&";
					return c
				}
			};
			return a
		}(),
		CloudPlayer = function() {
			function a(a) {
				this.init(a)
			}
			a.prototype = {
				init: function(a) {
					switch(this.check(a)) {
						case "swf":
							this.player = new BlFlashPlayer(10);
							break;
						default:
							this.player = new BlH5Player
					}
				},
				setUp: function(a, c, d) {
					this.player.setUp.apply(this.player, arguments)
				},
				check: function(a) {
					return a.hasOwnProperty("type") ? a.type : a.hasOwnProperty("dbd") && "LETV" == a.dbd ? "h5" : "android" != videoSdkTool.getOs() &&
						"iphone" != videoSdkTool.getDevice() && "ipad" != videoSdkTool.getDevice() && FlashPlayer.check(10) ? "swf" : document.createElement("video").canPlayType ? "h5" : "swf"
				}
			};
			return a
		}(),
		LecloudVodPlayer = function() {
			function a(a, b) {
				var c = "100%",
					g = "100%",
					f = "player" + videoSdkTool.creatUuid();
				a.hasOwnProperty("width") && (isNaN(a.width) ? -1 != c.indexOf("%") && (c = a.width) : c = a.width + "px");
				a.hasOwnProperty("height") && (isNaN(a.height) ? -1 != g.indexOf("%") && (g = a.height) : g = a.height + "px");
				c = '<div id="#{player}" style="position: relative;width: {width};height:{height};margin-right:auto;margin-left:auto"></div>'.replace(/{width}/g,
					c);
				c = c.replace(/{height}/g, g);
				c = c.replace(/#{player}/g, f);
				"string" == typeof b && "" != b && UiTool.$E(b) ? UiTool.$E(b).innerHTML = c : DC.write(c);
				return f
			}

			function b(a, b, c) {
				var g = new CloudPlayer(a);
				g.setUp(a, b, c);
				return g.player
			}

			function c() {}
			ClassTool.inherits(c, ClassObject);
			c.prototype.init = function(c, h, e) {
				var g = a(c, h),
					f = b(c, g, h);
				this.sdk = new Api(f);
				if(e) {
					var k = function(a) {
						switch(a.args[1]) {
							case PlayerEvent.INIT:
								f.facade.removeEventListener(PlayerEvent.EVENT, k, this), c.hasOwnProperty("callback") && ("function" ==
									typeof c.callback ? c.callback && c.callback(f.videoplugin.mediaPlayer.player.video) : c.callback && WIN[c.callback] && WIN[c.callback](f.videoplugin.mediaPlayer.player.video))
						}
					};
					f.facade && f.facade.addEventListener(PlayerEvent.EVENT, k, this)
				}
			};
			return c
		}();
	WIN.CloudVodPlayer = LecloudVodPlayer;
	if("undefined" != typeof WIN.letvcloud_player_conf) {
		var p = new CloudVodPlayer;
		WIN.letvcloud_player_conf.hasOwnProperty("callbackJs") && (WIN.letvcloud_player_conf.callback = WIN.letvcloud_player_conf.callbackJs, delete WIN.letvcloud_player_conf.callbackJs);
		if(!WIN.letvcloud_player_conf.hasOwnProperty("posterType")) {
			WIN.letvcloud_player_conf.posterType = "-1";
			var ua = navigator.userAgent.toLowerCase(); - 1 < ua.indexOf("iphone") && -1 < ua.indexOf("mac") && -1 < ua.indexOf("7.0") && (WIN.letvcloud_player_conf.posterType = "-2")
		}
		p.init(WIN.letvcloud_player_conf,
			"", !0);
		WIN.letvcloud_player_conf = void 0;
		WIN.Util = {
			setRate: function(a) {
				p.sdk.setDefinition(a)
			},
			getRate: function() {
				return p.sdk.getDefinition()
			}
		}
	};
})(document, undefined);