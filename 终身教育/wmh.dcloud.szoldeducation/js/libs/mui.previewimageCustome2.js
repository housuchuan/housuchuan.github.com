/**
 * @description 重写mui的图片预览插件
 * 前提: mui.min.js mui.min.css 以及图片预览样式,例如imageviewer.css
 * 功能:在一个新的webview中使用这个插件,支持直接传入图片数据
 * @author dailc
 * @version 1.0
 * @time 2015-12-27 23:14:47
 */
(function() {
	var template = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
	var itemTemplate = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
	var defaultGroupName = '__DEFAULT';
	var div = document.createElement('div');
	
	/**
	 * @description 图片预览工具的构造函数
	 * @constructor 构造
	 * @param {JSON} options
	 */
	var PreviewImage = function(options) {
		this.options = mui.extend(true, {
			id: '__MUI_PREVIEWIMAGE',
			zoom: true,
			header: '<span class="mui-preview-indicator"></span>',
			footer: ''
		}, options || {});
		this.init();
		this.initEvent();
	};
	/**
	 * 获取图片预览的原型,然后扩展原型
	 */
	var proto = PreviewImage.prototype;
	/**
	 * @description 初始化
	 */
	proto.init = function() {
		var options = this.options;
		var el = document.getElementById(this.options.id);
		if (!el) {
			div.innerHTML = template.replace(/\{\{id\}\}/g, this.options.id).replace('{{header}}', options.header).replace('{{footer}}', options.footer);
			document.body.appendChild(div.firstElementChild);
			el = document.getElementById(this.options.id);
		}
		this.closeCallback = this.options.closeCallback||function(){};
		this.allImgsData =  this.options.allImgsData||null;
		//自动启用
		mui.options.gestureConfig.pinch = true;
		mui.options.gestureConfig.doubletap = true;
		
		this.element = el;
		this.scroller = this.element.querySelector(mui.classSelector('.slider-group'));
		this.indicator = this.element.querySelector(mui.classSelector('.preview-indicator'));
		this.loader = this.element.querySelector(mui.classSelector('.preview-loading'));
		if (options.footer) {
			this.element.querySelector(mui.classSelector('.preview-footer')).classList.remove(mui.className('hidden'));
		}
		this.addImages();
	};
	/**
	 * @description 初始化事件
	 */
	proto.initEvent = function() {
		var self = this;
		var laterClose = null;
		this.loader.addEventListener('tap', function(e) {
			console.log('点击loader');
			laterClose = mui.later(function() {
				self.close();
			}, 300);
		});
		this.scroller.addEventListener('tap', function() {
			console.log('点击scroller');
			laterClose = mui.later(function() {
				self.close();
			}, 300);
		});
		this.scroller.addEventListener('doubletap', function() {
			console.log('双击');
			laterClose && laterClose.cancel();
			laterClose = null;
		});
		//滚动事件
		this.element.addEventListener('slide', function(e) {
			if (self.options.zoom) {
				var lastZoomerEl = self.element.querySelector('.mui-zoom-wrapper:nth-child(' + (self.lastIndex + 1) + ')');
				if (lastZoomerEl) {
					mui(lastZoomerEl).zoom().setZoom(1);
				}
			}
			var slideNumber = e.detail.slideNumber;
			self.lastIndex = slideNumber;
			console.log('开始slide,slideNumber:'+slideNumber);
			self.indicator && (self.indicator.innerText = (slideNumber + 1) + '/' + self.currentGroup.length);
			self._loadItem(slideNumber);
		});
	};
	/**
	 * @description 添加图片
	 * @param {String} group 图片预览的组名
	 */
	proto.addImages = function(group) {
		this.groups = {};
		var imgs = [];
		if (this.allImgsData && this.allImgsData[group]) {
			//如果存在改组的图片数据
			imgs = this.allImgsData[group];
		}
		console.log('当前组的数据:'+JSON.stringify(imgs));
		if (imgs.length > 0) {
			for (var i = 0, len = imgs.length; i < len; i++) {
				this.addImage(imgs[i], group);
			}
		}
	};
	/**
	 * @description 单独添加每一张图片
	 * @param {JSON} img 图片对象,其中的FileContent为路径
	 * @param {String} group 该图片对应的分组名
	 */
	proto.addImage = function(img, group) {
		group = group || defaultGroupName;
		if (!this.groups[group]) {
			this.groups[group] = [];
		}
		if (img.__mui_img_data) {
			this.groups[group].push(img.__mui_img_data);
		} else {
			var src = img.FileContent;
			var lazyload = img.FileContent;
			if (!lazyload) {
				lazyload = src;
			}
			var imgObj = {
				src: src,
				lazyload: src === lazyload ? '' : lazyload,
				loaded: src === lazyload ? true : false,
				sWidth: 0,
				sHeight: 0,
				sTop: 0,
				sLeft: 0,
				sScale: 1,
				//这里的去除el  因为在以前的mui中是点击的预览图片元素
				el: null
			};
			this.groups[group].push(imgObj);
			img.__mui_img_data = imgObj;
			//
			console.log('img的数据:'+JSON.stringify(img));
		}
	};
	/**
	 * @description 清空图片预览
	 */
	proto.empty = function() {
		this.scroller.innerHTML = '';
	};
	/**
	 * @description 根据分组来打开图片预览,默认选择最后一组
	 * @param {Number} index
	 * @param {String} group
	 */
	proto.openByGroup = function(index, group) {
		index = Math.min(Math.max(0, index), this.groups[group].length - 1);
		console.log('打开分组,index:'+index+',组名:'+group);
		this.refresh(index, this.groups[group]);
	};
	/**
	 * @description 初始化图片数据
	 * @param {JSON} itemData
	 * @param {HTMLElement} imgEl
	 */
	proto._initImgData = function(itemData, imgEl) {
		console.log('初始化图片数据:'+JSON.stringify(itemData));
		if (!itemData.sWidth) {
			var img = itemData.el;
			itemData.sWidth = 100;
			//img.offsetWidth;
			itemData.sHeight = 0;
			//img.offsetHeight;
			var offset = 
			//mui.offset(img);
			{
				sTop:0,
				sLeft:0
			}
			itemData.sTop = offset.top;
			itemData.sLeft = offset.left;
			itemData.sScale = Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
		}
		imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
	};
	/**
	 * @description 刷新
	 * @param {Number} index
	 * @param {Array} groupArray 图片数组
	 */
	proto.refresh = function(index, groupArray) {
		this.currentGroup = groupArray;
		console.log('当前分组数据:'+JSON.stringify(this.currentGroup));
		//重新生成slider
		var length = groupArray.length;
		var itemHtml = [];
		var currentRange = this.getRangeByIndex(index, length);
		var from = currentRange.from;
		var to = currentRange.to + 1;
		console.log('range,from:'+from+',to:'+to);
		var currentIndex = index;
		var className = '';
		var itemStr = '';
		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;
		for (var i = 0; from < to; from++, i++) {
			var itemData = groupArray[from];
			var style = '';
			if (itemData.sWidth) {
				style = '-webkit-transform:translate3d(0,0,0) scale(' + itemData.sScale + ');transform:translate3d(0,0,0) scale(' + itemData.sScale + ')';
			}
			itemStr = itemTemplate.replace('{{src}}', itemData.src).replace('{{lazyload}}', itemData.lazyload).replace('{{style}}', style);
			if (from === index) {
				currentIndex = i;
				className = mui.className('active');
			} else {
				className = '';
			}
			itemHtml.push(itemStr.replace('{{className}}', className));
		}
		this.scroller.innerHTML = itemHtml.join('');
		this.element.classList.add(mui.className('preview-in'));
		this.lastIndex = currentIndex;
		this.element.offsetHeight;
		mui(this.element).slider().gotoItem(currentIndex, 0);
		this.indicator && (this.indicator.innerText = (currentIndex + 1) + '/' + this.currentGroup.length);
		this._loadItem(currentIndex);
	};
	/**
	 * @description 进行比例缩放
	 * @param {Number} from 开始
	 * @param {Number} to 结束
	 */
	proto._getScale = function(from, to) {
		var scaleX = from.width / to.width;
		var scaleY = from.height / to.height;
		var scale = 1;
		if (scaleX <= scaleY) {
			scale = from.height / (to.height * scaleX);
		} else {
			scale = from.width / (to.width * scaleY);
		}
		return scale;
	};
	/**
	 * @description 结束变化
	 * @param {Event} e
	 */
	proto._imgTransitionEnd = function(e) {
		var img = e.target;
		img.classList.remove(mui.className('transitioning'));
		img.removeEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
	};
	/**
	 * @description 关闭变化
	 * @param {Event} e
	 */
	proto._closeTransitionEnd = function(e) {
		var img = e.target;
		img.classList.remove(mui.className('transitioning'));
		img.removeEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
		this.element.classList.remove(mui.className('preview-in'));
		this.element.classList.remove(mui.className('transitioning'));
	};
	/**
	 * @desc 加载元素
	 * @param {Object} index
	 * @param {Object} callback
	 */
	proto._loadItem = function(index, callback) { //TODO 暂时仅支持img
		var itemEl = this.scroller.querySelector(mui.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		var itemData = this.currentGroup[index];
		var imgEl = itemEl.querySelector('img');
		this._initImgData(itemData, imgEl);
		if (!itemData.loaded && imgEl.getAttribute('data-preview-lazyload')) {
			var self = this;
			self.loader.classList.add(mui.className('active'));
			imgEl && this.loadImage(imgEl, function() {
				itemData.loaded = true;
				imgEl.src = itemData.lazyload;
				self._initZoom(itemEl, this.width, this.height);
				imgEl.classList.add(mui.className('transitioning'));
				imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
				imgEl.setAttribute('style', '');
				imgEl.offsetHeight;
				callback && callback.call(itemEl);
				self.loader.classList.remove(mui.className('active'));
			});
		} else {
			itemData.lazyload && (imgEl.src = itemData.lazyload);
			this._initZoom(itemEl, imgEl.width, imgEl.height);
			imgEl.classList.add(mui.className('transitioning'));
			imgEl.addEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
			imgEl.setAttribute('style', '');
			imgEl.offsetHeight;
			callback && callback.call(itemEl);
		}
		this._preloadItem(index + 1);
		this._preloadItem(index - 1);
	};
	/**
	 * @description 预加载元素
	 * @param {Number} index
	 */
	proto._preloadItem = function(index) {
		var itemEl = this.scroller.querySelector(mui.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
		if (itemEl) {
			var itemData = this.currentGroup[index];
			if (!itemData.sWidth) {
				var imgEl = itemEl.querySelector('img');
				this._initImgData(itemData, imgEl);
			}
		}
	};
	/**
	 * @description 初始化缩放
	 * @param {HTMLElement} zoomWrapperEl 缩放的元素
	 * @param {Number} zoomerWidth
	 * @param {Number} zoomerHeight
	 */
	proto._initZoom = function(zoomWrapperEl, zoomerWidth, zoomerHeight) {
		if (!this.options.zoom) {
			return;
		}
		if (zoomWrapperEl.getAttribute('data-zoomer')) {
			return;
		}
		var zoomEl = zoomWrapperEl.querySelector(mui.classSelector('.zoom'));
		if (zoomEl.tagName === 'IMG') {
			var self = this;
			var maxZoom = self._getScale({
				width: zoomWrapperEl.offsetWidth,
				height: zoomWrapperEl.offsetHeight
			}, {
				width: zoomerWidth,
				height: zoomerHeight
			});
			mui(zoomWrapperEl).zoom({
				maxZoom: Math.max(maxZoom, 1)
			});
		} else {
			mui(zoomWrapperEl).zoom();
		}
	};
	/**
	 * @description 加载图片
	 * @param {HTMLElement} imgEl
	 * @param {Function} callback
	 */
	proto.loadImage = function(imgEl, callback) {
		var onReady = function() {
			callback && callback.call(this);
		};
		var img = new Image();
		img.onload = onReady;
		img.onerror = onReady;
		img.src = imgEl.getAttribute('data-preview-lazyload');
	};
	/**
	 * @description 根据index得到范围
	 * @param {Number} index
	 * @param {Number} length
	 */
	proto.getRangeByIndex = function(index, length) {
		return {
			from: 0,
			to: length - 1
		};
		//		var from = Math.max(index - 1, 0);
		//		var to = Math.min(index + 1, length);
		//		if (index === length - 1) {
		//			from = Math.max(length - 3, 0);
		//			to = length - 1;
		//		}
		//		if (index === 0) {
		//			from = 0;
		//			to = Math.min(2, length - 1);
		//		}
		//		return {
		//			from: from,
		//			to: to
		//		};//
	};
	/**
	 * @description 打开图片预览
	 * @param {Number} index 打开第几张图片
	 * @param {String} group
	 */
	proto.open = function(index, group) {
		if (typeof index !== "number") {
			index = 0;
		}
		group = group || defaultGroupName;
		this.addImages(group); //刷新当前group
		this.openByGroup(index, group);
	};
	/**
	 * @description 关闭图片预览
	 * @param {Object} index
	 * @param {Object} group
	 */
	proto.close = function(index, group) {
		this.element.classList.add(mui.className('transitioning'));
		var itemEl = this.scroller.querySelector(mui.classSelector('.slider-item:nth-child(' + (this.lastIndex + 1) + ')'));
		var imgEl = itemEl.querySelector('img');
		if (imgEl) {
			imgEl.classList.add(mui.className('transitioning'));
			var itemData = this.currentGroup[this.lastIndex];
			var sLeft = itemData.sLeft - window.pageXOffset;
			var sTop = itemData.sTop - window.pageYOffset;
			if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
				imgEl.addEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
				imgEl.style.opacity = 0;
				imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
			} else {
				var left = (window.innerWidth - itemData.sWidth) / 2;
				var top = (window.innerHeight - itemData.sHeight) / 2;
				imgEl.addEventListener('webkitTransitionEnd', this._closeTransitionEnd.bind(this));
				imgEl.style.webkitTransform = 'translate3d(' + (sLeft - left) + 'px,' + (sTop - top) + 'px,0) scale(' + itemData.sScale + ')';
			}
		}
		var zoomers = this.element.querySelectorAll(mui.classSelector('.zoom-wrapper'));
		for (var i = 0, len = zoomers.length; i < len; i++) {
			mui(zoomers[i]).zoom().destory();
		}
		//回调
		this.closeCallback&&this.closeCallback();
		//		mui(this.element).slider().destory();
		//		this.empty();
	};
	/**
	 * @description 判断是否在显示
	 */
	proto.isShown = function() {
		return this.element.classList.contains(mui.className('preview-in'));
	};
	var previewImageApi = null;
	mui.previewImage = function(options) {
		if (!previewImageApi) {
			previewImageApi = new PreviewImage(options);
		}
		return previewImageApi;
	};
	mui.getPreviewImage = function() {
		return previewImageApi;
	}
})();