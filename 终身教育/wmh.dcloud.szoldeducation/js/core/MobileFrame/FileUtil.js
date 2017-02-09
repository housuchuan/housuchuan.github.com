/**
 * @description   移动开发框架
 * @author dailc  dailc 
 * @version 2.0
 * @time 2016-01-11 16:57:57
 * 功能模块:
 * File工具模块***************************************
 * core/MobileFrame/FileUtil
 * 1.delFile 删除文件
 * File工具类模块************************************
 */
define(function(require, exports, module) {
	"use strict";
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	/**
	 * @description 删除指定路径的文件
	 * @param {String} relativePath  绝对路径或相对路径例如:  _downloads/imgs/test.jpg
	 * @param {Function} successCallback  删除成功回调
	 * @param {Function} errorCallback  失败回调
	 */
	exports.delFile = function(relativePath, successCallback, errorCallback) {
		if (!relativePath) {
			return;
		}
		CommonUtil.plusReady(function() {
			plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
				entry.remove(function(entry) {
					if (successCallback && typeof(successCallback) == 'function') {
						successCallback(true);
					}
				}, function(e) {
					if (errorCallback && typeof(errorCallback) == 'function') {
						errorCallback('删除文件失败!');
					}
				});
			}, function() {
				if (errorCallback && typeof(errorCallback) == 'function') {
					errorCallback('打开文件路径失败!');
				}
			});
		});
	};
	/**
	 * @description 从一个file对象,加载对应的数据
	 * FileReader的方法
	 * 方法名 				参数				描述
	 * readAsBinaryString 	file 			将文件读取为二进制编码
	 * readAsText			file,[encoding] 将文件读取为文本
	 * readAsDataURL		file			将文件读取为DataURL
	 * abort				(none)			终端读取操作
	 * @param {FileReader} oFReader 对应的加载器
	 * @param {File} file 文件对象,选择的是img类型
	 * @param {Function} successCB 成功加载完毕后的回调,回调result(不同的加载方式result类型不同)
	 * @return {FileReader} 返回文件加载器对象
	 * @param {String} type 类型,DataUrl还是Text还是Binary
	 */
	function loadDataFromFile(oFReader, file, successCB, type) {
		if (window.FileReader || !oFReader || !(oFReader instanceof FileReader)) {
			oFReader.onload = function(oFREvent) {
				successCB && successCB(oFREvent.target.result);
			};
			if (type === 'DataUrl') {
				oFReader.readAsDataURL(file);
			} else if (type === 'Text') {
				oFReader.readAsText(file);
			} else {
				oFReader.readAsBinaryString(file);
			}
			return oFReader;
		} else {
			console.error('错误:FileReader不存在!');
		}
	}
	/**
	 * @description 设置,将input标签设为选择文件的标签,选择成功后返回dataSrc(根据类别不同返回不同)
	 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
	 * @param {Function} successCB(dataSrc) 成功选择后的回调,返回dataSrc字符串
	 * 注意: 没选择一张图片就会回调一次
	 * @param {JSON} options 设置参数
	 */
	function setSelectFilesFromwDisks(dom, successCB, options) {
		if (typeof dom == 'string') {
			dom = document.querySelector(dom);
		}
		if (!dom || !(dom instanceof HTMLElement)) {
			console.error('错误:input file标签的dom为空！或者不为Html元素!');
		}
		options = options || {};
		//设置单个文件选择需要的 属性
		dom.setAttribute('type', 'file');
		if (options.isMulti) {
			dom.setAttribute('multiple', 'multiple');
		} else {
			dom.removeAttribute('multiple');
		}
		var type = 'File';
		var filter;
		if (options.type === 'Image') {
			filter = 'image/*';
			type = 'DataUrl';
		} else if (options.type === 'Text') {
			filter = 'text/*';
			type = 'Text';
		} else {
			filter = '*';
			type = 'File';
		}
		filter = options.filter || filter;
		dom.setAttribute('accept', filter);
		var changeHandle = function() {
			var aFiles = dom.files;
			var len = aFiles.length;
			if (len === 0) {
				return;
			}
			//定义文件读取器和后缀类型过滤器
			var oFReader = new window.FileReader();
			var index = 0;

			var chainCall = function() {
				if (index >= len) {
					return;
				}
				loadDataFromFile(oFReader, aFiles[index], function(b64Src) {
					successCB && successCB(b64Src, aFiles[index]);
					index++;
					chainCall();
				}, type);
			};
			chainCall();
		};
		//给dom设置改变监听
		dom.removeEventListener('change', changeHandle);
		dom.addEventListener('change', changeHandle);
	};
	/**
	 * @description 设置,将input标签设为选择图片的标签,选择成功后返回图片src(base64数据)
	 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
	 * @param {Function} successCB(b64Src) 成功选择后的回调,返回base64字符串
	 * 注意: 没选择一张图片就会回调一次
	 * @param {JSON} options 设置参数
	 */
	exports.setSelectImgsFromDisks = function(dom, successCB, options) {
		//rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
		setSelectFilesFromwDisks(dom, successCB, {
			isMulti: options.isMulti || false,
			filter: options.filter || 'image/*',
			type: 'Image'
		});
	};
	/**
	 * @description 设置,将input标签设为选择文件的标签,选择成功后返回文件二进制str
	 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
	 * @param {Function} successCB(二进制str) 成功选择后的回调,返回二进制str
	 * 注意: 没选择一张图片就会回调一次
	 * @param {JSON} options 设置参数
	 */
	exports.setSelectFilesFromDisks = function(dom, successCB, options) {
		setSelectFilesFromwDisks(dom, successCB, {
			isMulti: options.isMulti || false,
			filter: options.filter || '*',
			type: 'File'
		});
	};
	/**
	 * @description 设置,将input标签设为选择文本的标签,选择成功后返回文本str
	 * @param {HTMLElement||String} dom input标签,最好直接是file类型(防止歧义)
	 * @param {Function} successCB(文本str) 成功选择后的回调,返回文本str
	 * 注意: 没选择一张图片就会回调一次
	 * @param {JSON} options 设置参数
	 */
	exports.setSelectTextsFromDisks = function(dom, successCB, options) {
		setSelectFilesFromwDisks(dom, successCB, {
			isMulti: options.isMulti || false,
			filter: options.filter || 'text/*',
			type: 'Text'
		});
	};
	/**
	 * @description 纯h5-下载浏览器端生成的文件
	 * URL.createObjectURL的参数是File对象或者Blob对象，
	 * File对象也就是通过input[type=file]选择的文件，
	 * Blob对象是二进制大对象
	 * @param {String} fileName 文件名
	 * @param {String} b64Content b64数据
	 */
	exports.downloadLocalFile = function(fileName, b64Content) {
		var aLink = document.createElement('a');
		var blob = new Blob([b64Content]);
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
		aLink.download = fileName;
		aLink.href = URL.createObjectURL(blob);
		aLink.dispatchEvent(evt);
	};

	//TODO 结束
});