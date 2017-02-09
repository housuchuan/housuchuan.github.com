/**
 * 作者: dailc
 * 时间: 2016-06-15 
 * 描述: 园区图片轮播封装
 */
define(function(require, exports, module) {
	var HtmlUtil = require('core/MobileFrame/HtmlUtil.js');
	/**
	 * @description 图片轮播 控件的使用
	 * @param {HTMLElement||String} element  		添加元素选择器
	 * @param {JSONArray} galleryData 	json数据数组
	 * 每一个元素包含id,url,title
	 * @param {Function} callback		点击回调函数
	 * @param {JSON} options 			一些设置选项
	 * 包括 isLoop-是否打开循环播放,默认为true
	 * isAuto-是否自动播放,默认为false
	 * autoTime-自动播放的间隔时间,默认为3000ms
	 * maxImgHeight-图片的最大高度,默认为100%
	 * @return 返回图片轮播 gallery对象
	 */
	exports.generateGallery =function(element, galleryData,callback, options) {
		//初始化值
		if (galleryData == null || !Array.isArray(galleryData) || galleryData.length < 0) {
			console.error('错误:JSON数据格式不对!');
			return;
		}
		//对于元素选择器,我们有两种方案,如果是字符串,那么就对其进行dom操作,否则如果是dom对象,直接使用,否则直接无效
		if (element != null) {
			if (element instanceof HTMLElement) {} else if (typeof(element) == 'string') {
				element = document.querySelector(element);
				if (element == null) {
					console.error('错误:不存在该元素选择器!');
					return;
				}
			}
		} else {
			console.error('错误:元素选择器为空!');
			return;
		}
		options = options || {};
		options['isShowIndicator'] = (options['isShowIndicator'] != null && typeof(options['isShowIndicator']) === 'boolean') ? options['isShowIndicator'] : true;
		options['isLoop'] = (options['isLoop'] != null && typeof(options['isLoop']) == 'boolean') ? options['isLoop'] : true;
		options['isAuto'] = (options['isAuto'] != null && typeof(options['isAuto']) == 'boolean') ? options['isAuto'] : false;
		options['autoTime'] = (options['autoTime'] != null && typeof(options['autoTime']) == "number" && options['autoTime'] >= 0) ? options['autoTime'] : 3000;
		//默认为每一行2个,只有每一个item多张图时有效
		options['perLineItem'] = (options['perLineItem'] != null && typeof(options['perLineItem']) == 'number' && options['perLineItem'] > 0) ? options['perLineItem'] : 2;
		options['perLineItem'] = options['perLineItem'] % 5;
		options['maxImgHeight'] = (options['maxImgHeight'] != null && typeof(options['maxImgHeight']) == 'string') ? options['maxImgHeight'] : '100%';
		options['minImgHeight'] = (options['minImgHeight'] != null && typeof(options['minImgHeight']) == 'string') ? options['minImgHeight'] : null;
		var length = galleryData.length;
		var html = '';
		html += '<div class="mui-slider">';
		//增加 mui-slider-loop
		if (options['isLoop']) {
			//如果开启loop
			//需要注意的是,如果开启了loop,需要额外增加两个节点,循环轮播：
			//第一个节点是最后一张轮播,最后一个节点是第一张轮播
			html += '<div class="mui-slider-group mui-slider-loop">';
		} else {
			html += '<div class="mui-slider-group">';
		}
		//内容
		if (options['isLoop']) {
			var tmpI = length - 1;
			//开启循环额外增加的节点,第一个节点是最后一张轮播
			if (Array.isArray(galleryData[(tmpI)])) {
				//数组对象
				html += generateArrayItemsImg(galleryData[(tmpI)], true, options);
			} else {
				//普通的对象
				html += generateOneItemImg(galleryData[(tmpI)], true, options);
			}
		}
		for (var i = 0; i < length; i++) {
			if (Array.isArray(galleryData[(i)])) {
				//数组对象
				html += generateArrayItemsImg(galleryData[(i)], false, options);
			} else {
				//普通的对象
				html += generateOneItemImg(galleryData[(i)], false, options);
			}
		}
		if (options['isLoop']) {
			//开启循环额外增加的节点,最后一个节点是第一张轮播
			var tmpI = 0;
			if (Array.isArray(galleryData[(tmpI)])) {
				//数组对象
				html += generateArrayItemsImg(galleryData[(tmpI)], true, options);
			} else {
				//普通的对象
				html += generateOneItemImg(galleryData[(tmpI)], true, options);
			}
		}
		//补齐mui-slider-group
		html += '</div>';
		if (options['isShowIndicator']) {
			//动态添加 indicator
			html += '<div class="mui-slider-indicator">';
			for (var i = 0; i < length; i++) {
				if (i == 0) {
					html += '<div class="mui-indicator mui-active"></div>'; //默认从0开始
				} else {
					html += '<div class = "mui-indicator"></div>';
				}
			}
			//补齐indicator
			html += '</div>';
		}
		//补齐mui-slider
		html += '</div>';

		//先清空
		element.innerHTML = '';
		//添加图片轮播控件html
		HtmlUtil.appendHtmlChildCustom(element, html);
		//图片轮播初始化（不可缺少，否则无法正常显示）
		//这里由于 mui-slider是mui的特定空间,所以需要mui()特定的选择器才行
		//用zepto或者原生都不行
		var gallery = mui(element);
		//轮询时间
		var tmpAutoTime = 0;
		if (options['isAuto']) {
			tmpAutoTime = options['autoTime'];
		}
		gallery.slider({
			interval: tmpAutoTime //轮播周期，默认为0：不轮播
		});
		//批量绑定
		mui(element).on('tap', '.slider-img-item', function(e) {
			var id = this.getAttribute("id");
			//ios阻止事件冒泡
			e.preventDefault();
			callback && callback(e, id);
			return false;
		});
		if (options['isShowIndicator']) {
			mui(element).on('tap', '.mui-slider-indicator .mui-indicator', function(e) {

				var index = [].indexOf.call(this.parentNode.childNodes, this);
				gallery.slider().gotoItem(index);
				//ios阻止事件冒泡
				e.preventDefault();
				return false;
			});
		}
		/* gallery.slider()的api
		 * gotoItem(index,time)
		 * nextItem()
		 * prevItem()
		 * getSlideNumber()
		 * refresh(options)
		 * destroy()-不建议使用
		 * */
		return gallery;
	}
	/**
	 * @description 生成 单个的轮播图片
	 * @param {JSON} tmpinfo 传入json数据
	 * @param {Boolean} isduplicate 是否是重复(开启循环后)
	 */
	function generateOneItemImg(tmpinfo, isduplicate, options) {
		var html = '';
		if (isduplicate) {
			html += '<div class="mui-slider-item mui-slider-item-duplicate" >'
		} else {
			html += '<div class="mui-slider-item">'
		}
		var idStr = tmpinfo.InfoID ? ('id=' + tmpinfo.InfoID) : '';
		var maxHeightStr = options['maxImgHeight'] ? ('max-height:' + options['maxImgHeight'] + ';') : '';
		var minHeightStr = options['minImgHeight'] ? ('min-height:' + options['minImgHeight'] + ';') : '';

		html += ' <li class="mui-table-view-cell_news mui-media slider-img-item dataitem mui-col-xs-" ' + idStr + 'style="' + maxHeightStr + minHeightStr+'">';
		html += ' <div class="spark_left_img">';
		html += ' <img src="' + tmpinfo.HeadNewsAttachUrl + '" />';
		html += '</div> ';

		html += '<div class="spark_right_content">';
		html += '<div class="spark_right_comefrom">';
		html += '<span class="mui-pull-left" style="color: gray;">';
		html += '来源';
		html += '</span>';
		html += '<span class="spark_blue">';
		html += tmpinfo.Zhuanzai;
		html += '</span>';
		html += '<span class="mui-pull-right">';
		html += tmpinfo.InfoDate;
		html += '</span>';
		html += '</div> ';
		html += '<div class="spark_right_title">';
		html += tmpinfo.Title;
		html += '</div> ';
		html += '<div class="spark_right_word">';
		html += tmpinfo.infocontent;
		html += '</div> ';

		html += '</div> ';

		html += '</li>';

		html += '</div>';
		return html;
	};
	/**
	 * @description 生成多个的轮播图片
	 * @param {JSONArray} tmpArray 传入json数组数据
	 * @param {Boolean} isduplicate 是否是重复(开启循环后)
	 */
	function generateArrayItemsImg(tmpArray, isduplicate, options) {
		var html = '';
		if (isduplicate) {
			html += '<div class="mui-slider-item mui-slider-item-duplicate" >'
		} else {
			html += '<div class="mui-slider-item">'
		}
		//默认是grid-view
		html += '<ul class="mui-table-view mui-grid-view mui-grid-9 mui-slider-item0 first">';
		var len = tmpArray.length;
		var widthClass = 'mui-col-xs-' + 12 / options['perLineItem'];
		//每一个item的宽度由外部option控制,只有1/2 1/3  1/4 这三种
		for (var i = 0; i < len; i++) {
			var idStr = tmpArray[i].InfoID ? ('id=' + tmpArray[i].InfoID) : '';
			var maxHeightStr = options['maxImgHeight'] ? ('max-height:' + options['maxImgHeight'] + ';') : '';
			var minHeightStr = options['minImgHeight'] ? ('min-height:' + options['minImgHeight'] + ';') : '';
			html += ' <li class="mui-table-view-cell_news mui-media slider-img-item dataitem' + widthClass + '" ' + idStr + ' style="' + maxHeightStr + minHeightStr+'">';
			//console.log("minH:"+minHeightStr);
			html += ' <div class="spark_left_img">';
			html += ' <img src="' + tmpArray[i].HeadNewsAttachUrl + '" />';
			html += '</div> ';

			html += '<div class="spark_right_content">';
			html += '<div class="spark_right_comefrom">';
			html += '<span class="mui-pull-left" style="color: gray;">';
			html += '来源';
			html += '</span>';
			html += '<span class="spark_blue">';
			html += tmpArray[i].Zhuanzai;
			html += '</span>';
			html += '<span class="mui-pull-right">';
			html += tmpArray[i].InfoDate;
			html += '</span>';
			html += '</div> ';
			html += '<div class="spark_right_title">';
			html += tmpArray[i].Title;
			html += '</div> ';
			html += '<div class="spark_right_word">';
			html += tmpArray[i].infocontent;
			html += '</div> ';

			html += '</div> ';

			html += '</li>';
		}
		html += '</ul>';
		html += '</div>';
		return html;
	};
});