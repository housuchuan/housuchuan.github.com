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
	 * 附件下载成功 默认保存在本地相对路径的"downloads/imgs"文件夹里面, 如"_downloads/imgs/logo.jpg"
	 */
	var attachStoragePath = "_downloads/attachFiles/";
	
	/**
	 * @description 删除	指定文件
	 * @param {String} relativePath 文件的相对路径
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 失败会掉
	 */
	function delFile(relativePath, successCallback, errorCallback) {
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			entry.remove(function(entry) {
				//console.log("文件删除成功==" + relativePath);
				if (successCallback && typeof(successCallback) == 'function') {
					successCallback();
				}
			}, function(e) {
				//console.log("文件删除失败=" + relativePath);
				if (errorCallback && typeof(errorCallback) == 'function') {
					errorCallback();
				}
			});
		});
	};
	/**
	 * @description 删除一个url在本地的附件缓存
	 * @param {String} loadUrl
	 */
	exports.delAttachFilesFromUrl = function(loadUrl) {
		var realPath = getRelativePathFromLoadUrl(loadUrl);
		if (realPath == null) {
			if (window.plus) {
				plus.nativeUI.toast('附件路径为空,无法删除!');
			}
			return;
		}
		IsAttachFileExists(realPath, function(flag) {
			if (flag == true) {
				//如果附件已经存在,直接删除
				delFile(realPath, function() {
					if (window.plus) {
						plus.nativeUI.toast('删除附件成功!');
					}
				}, function() {
					if (window.plus) {
						plus.nativeUI.toast('删除附件失败!');
					}
				});
			} else {
				//不存在
				if (window.plus) {
					plus.nativeUI.toast('附件不存在,无法删除!');
				}
			}
		});
	};
	/**
	 * @description 清除附件缓存
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 失败回调
	 */
	exports.clearAllAttachFilesCache = function(successCallback, errorCallback) {
		//遍历目录文件夹下的所有文件，然后删除
		var tmpUrl = plus.io.convertLocalFileSystemURL(attachStoragePath);
		plus.io.resolveLocalFileSystemURL(tmpUrl, function(entry) {
			entry.removeRecursively(function() {
				//console.log('清除附件缓存成功...');
				if (successCallback && typeof(successCallback) == 'function') {
					successCallback();
				}
			}, function() {
				//console.log('清除附件缓存失败...');
				if (errorCallback && typeof(errorCallback) == 'function') {
					errorCallback('清除附件缓存失败');
				}
			});
		}, function(e) {
			//console.log("打开附件缓存目录失败...");
			if (errorCallback && typeof(errorCallback) == 'function') {
				errorCallback('打开附件缓存目录失败');
			}
		});
	};
	/**
	 * @description 从一个网络URL中,获取本地附件缓存相对路径
	 * @param {String} loadUrl 附件的网络路径,如果为null,则返回一个null
	 */
	function getRelativePathFromLoadUrl(loadUrl) {
		if (loadUrl == null) return null;
		//这是普通的网络图片的读取方法  例如:http://123.333:8080/test.jpg  截取出来就是  test.jpg
		var filename = loadUrl.substring(loadUrl.lastIndexOf("/") + 1, loadUrl.length);
		//然后去除非法字符
		var regIllegal = /[&\|\\\*^%$#@\-]/g;
		filename = filename.replace(regIllegal, '');
		//去除中文
		//var reg = /[\u4E00-\u9FA5]/g;
		//filename = filename.replace(reg, 'chineseRemoveAfter');
		//console.log('fileName:'+filename);
		var relativePath = attachStoragePath + filename;
		return relativePath;
	};
	/**
	 * @description 打开本地文件
	 * @param {String} relativePath 传入的是相对路径
	 * @param {Function} errorCallback 错误回调
	 */
	function openLocalFile(relativePath, errorCallback) {
		/*
		 * 本地相对路径("downloads/imgs/logo.jpg")转成SD卡绝对路径
		 * 例如相对路径:downloads/imgs/logo.jpg
		 * ("/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/imgs/logo.jpg");
		 * */
		var sd_path = plus.io.convertLocalFileSystemURL(relativePath);

		if (sd_path && sd_path.indexOf('file://') == -1) {
			sd_path = 'file://' + sd_path;
		}
		//console.log('打开本地文件:' + sd_path);
		plus.runtime.openFile(sd_path, null, function(error) {
			//error: ( DOMException ) 必选 
			if (errorCallback && typeof(errorCallback) == 'function') {
				errorCallback(error);
			}
		});
	};
	/**
	 * @description 联网下载附件
	 * @param {String} loadUrl 附件网络地址
	 * @param {String} relativePath 本地相对地址
	 * @param {Function} successCallback 成功回调
	 * @param {Function} errorCallback 失败会掉
	 * @param {Boolean} isShowDialog 是否显示下载进度条
	 */
	function downloadFileFromNet(loadUrl, relativePath, successCallback, errorCallback, isShowDialog) {
		var options = {
			filename: relativePath,
			timeout: 3,
			retryInterval: 3
		};

		//创建下载任务
		var dtask = plus.downloader.createDownload(loadUrl,
			options,
			function(d, status) {
				if (status == 200) {
					//下载成功
					if (successCallback && typeof(successCallback) == 'function') {
						successCallback(relativePath);
					}
				} else {
					//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
					//console.log("下载失败=" + status + "==" + relativePath);
					//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
					dtask.abort();
					if (relativePath != null) {
						delFile(relativePath);
					}
					if (errorCallback && typeof(errorCallback) == 'function') {
						errorCallback('下载附件失败...');
					}
				}
			});
		if (isShowDialog) {
			var showWaitingOption = {
				back: "close"
			};
			var IsDownloadCompleted = false;
			var showProgressbar = plus.nativeUI.showWaiting('开始下载...', showWaitingOption);
			var i = 0,
				progress = 0;
			dtask.addEventListener("statechanged", function(task, status) {
				switch (task.state) {
					case 1: // 开始
						showProgressbar.setTitle("开始下载...");
						break;
					case 2: // 已连接到服务器
						showProgressbar.setTitle("正在下载...");
						break;
					case 3:
						//每隔一定的比例显示一次
						if (task.totalSize != 0) {
							var progress = task.downloadedSize / task.totalSize * 100;
							progress = Math.round(progress);
							if (progress == i) {
								i += 5;
								//console.log('下载信息:' + task.totalSize + "," + task.downloadedSize);
								showProgressbar.setTitle("正在下载" + parseInt(progress) + "%");
							}
						}
						break;
					case 4: // 下载完成
						IsDownloadCompleted = true;
						showProgressbar.close();
						break;
				}
			});
			showProgressbar.onclose = function() {
				//console.log('关闭下载...IsAbortDownload:'+IsAbortDownload);
				if (IsDownloadCompleted == false) {
					IsAbortDownload = true;
				}
				//alert('关闭下载任务!');
				dtask.abort();
			};
		}
		//启动下载任务
		dtask.start();
	};
	/**
	 * @description 是否本地相对路径附件已经存在
	 * @param {String} relativePath
	 * @param {Function} successCallback 成功回调,返回一个flag,如果为true代表已经存在,否则不存在
	 */
	function IsAttachFileExists(relativePath, successCallback) {
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			if (successCallback && typeof(successCallback) == 'function') {
				successCallback(true);
			}
		}, function(e) {
			//console.log("附件不存在=" + relativePath);
			if (successCallback && typeof(successCallback) == 'function') {
				successCallback(false);
			}
		});
	};
	/**
	 * @description 根据附件的url打开本地附件,如果本没有就联网下载
	 * @param {String} attachFileUrl 附件的网络地址
	 * @param {Boolean} isShowAlertDialog 当本地没有文件,联网下载时,是否提示,要用户确认
	 * @param {Function} errorCallback 打开失败回调
	 * @param {Boolean} isShowDialog 是否显示下载进度条
	 * @param {Boolean} isWithNoCache 是否直接下载,不用缓存
	 */
	exports.openAttachFileFromUrl = function(attachFileUrl, isShowAlertDialog, errorCallback, isShowDialog, isWithNoCache) {
		var realPath = getRelativePathFromLoadUrl(attachFileUrl);
		if (realPath == null) {
			if (errorCallback && typeof(errorCallback) == 'function') {
				errorCallback('附件路径为空,无法打开!');
			}
			return;
		}
		isWithNoCache = (typeof(isWithNoCache)=='boolean')?isWithNoCache:false;
		var reg = /[\u4E00-\u9FA5]/g;
		var tmpfilename = attachFileUrl.replace(reg, 'chineseRemoveAfter');
		if (tmpfilename.indexOf('chineseRemoveAfter') != -1) {
			//路径中有中文,编码,解决中文下载问题
			attachFileUrl = encodeURI(attachFileUrl);
		}
		IsAttachFileExists(realPath, function(flag) {
			if (flag == true&&isWithNoCache==false) {
//				if (isOpenExists == true) {
					//如果附件已经存在,直接打开
					openLocalFile(realPath, function(msg) {
						if (errorCallback && typeof(errorCallback) == 'function') {
							errorCallback(msg);
						}
					});
//				}
			} else {
				//不存在,弹出对话框提示下载
				if (isShowAlertDialog == true && window.plus) {
					// 提示用户是否下载
					plus.nativeUI.confirm('是否下载附件?', function(e) {
						if (0 == e.index) {
							//下载
							//console.log('下载附件:'+attachFileUrl);
							downloadFileFromNet(attachFileUrl, realPath, function() {
								openLocalFile(realPath, function(msg) {
									if (window.plus) {
										plus.nativeUI.toast(msg);
									}
								});
							}, function(msg) {
								if (window.plus) {
									plus.nativeUI.toast(msg);
								}
							}, isShowDialog);
						} else {}
					}, '附件下载', ["立即下载", "下次再说"]);
				}
			}
		});
	};
});