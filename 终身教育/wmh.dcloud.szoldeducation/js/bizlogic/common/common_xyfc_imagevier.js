/**
 * 作者: sunzl
 * 时间: 2016-06-15 
 * 描述: 相册预览封装
 */
define(function(require, exports, module) {
	/**
	 * @description 手机端-老年教育页面-学员风采-展示两项 ,
	 * @from：（szpark_oldeducation_home.html）
	 * @param infoArray 传入的json数据（数组）
	 */
	exports.generateHtml_oldeducation_home = function(infoArray) {
		var html = '';
		if (infoArray && Array.isArray(infoArray)) {
			mui.each(infoArray, function(key, value) {
				if (key < 2) {
					html += '<div class="suzhou_oldeducation_course_show">';
					html += '<i class="ChannelGuid" style="display:none">' + value.ChannelGuid + '</i>';
					html += '<img class="suzhou_oldeducation_course_pic" src="' + value.IndexPic + '" data-preview-src="' + value.IndexPic + '" data-preview-group="' + value.ChannelGuid + '">'
					html += '<span class="title">' + value.ChannelName + '</span> &nbsp;&nbsp;' + value.PicCount + '';
					html += '<div class="piclistdata" style="display: none;">';
					if (value.PicList && value.PicList.ImgUrl) {
						if (Array.isArray(value.PicList.ImgUrl)) {
							for (var i = 1; i < value.PicList.ImgUrl.length; i++) {
								html += '<img src="' + value.PicList.ImgUrl[i] + '"  data-preview-src="' + value.PicList.ImgUrl[i] + '" data-preview-group="' + value.ChannelGuid + '"/>';
							}
						} else {
							//html += '<img src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '" data-preview-group="' + value.ChannelGuid + '"/>';
						}
					} else {
						console.log("该相册下无数据!");
					}
					html += '</div>';
					html += '</div>';
				}
			});
		} else {
			html += '<div class="suzhou_oldeducation_course_show">';
			html += '<i class="ChannelGuid" style="display:none">' + infoArray.ChannelGuid + '</i>';
			html += '<img class="suzhou_oldeducation_course_pic" src="' + infoArray.IndexPic + '" data-preview-src="' + infoArray.IndexPic + '" data-preview-group="' + infoArray.ChannelGuid + '">';
			html += '<span class="title">' + infoArray.ChannelName + '</span> &nbsp;&nbsp;' + infoArray.PicCount + '';
			html += '<div class="piclistdata" style="display: none;">';
			if (infoArray.PicList && infoArray.PicList.ImgUrl) {
				if (Array.isArray(infoArray.PicList.ImgUrl)) {
					for (var i = 1; i < infoArray.PicList.ImgUrl.length; i++) {
						html += '<img src="' + infoArray.PicList.ImgUrl[i] + '"  data-preview-src="' + infoArray.PicList.ImgUrl[i] + '" data-preview-group="' + infoArray.ChannelGuid + '"/>';
					}
				} else {
					//如果相册中就一张图片，那么这张图片就是封面图片。
					//html += '<img src="' + config.ServerUrl_Pic + infoArray.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + infoArray.PicList.ImgUrl + '" data-preview-group="' + infoArray.ChannelGuid + '"/>';
				}
			} else {
				console.log("该相册下无数据!");
			}
			html += '</div>';
			html += '</div>';
		}
		return html;
	};
	/**
	 * @description 手机端-老年教育页面-学员风采列表页面,
	 * @from：（szpark_xyfclist.html）
	 * @param infoArray 传入的json数据（数组）
	 */
	exports.generateHtml_szpark_xyfclist = function(infoArray) {
		var html = '';
		if (infoArray && Array.isArray(infoArray)) {
			mui.each(infoArray, function(key, value) {
				html += '<li class="mui-table-view-cell" id="' + value.ChannelGuid + '" style="z-index: 2;">';
				html += '<i class="Title" style="display:none">' + value.ChannelName + '</i>';
				html += '<div class="imgWrap w190">';
				html += '<div class="bg1"></div>';
				html += '<div class="bg2"></div>';
				html += '<div class="imgDiv">';
				html += '<div>';
				html += '<img src="' + value.IndexPic + '"  data-preview-src="' + value.IndexPic + '" data-preview-group="' + value.ChannelGuid + '"/>';
				html += '<span style="float: right;z-index: 1000;margin-bottom: 5px;" class="mui-badge mui-badge-primary">' + value.ChannelName + '</span>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '<div class="PicList" style="display: none;">';
				if (value.PicList && value.PicList.ImgUrl) {
					if (Array.isArray(value.PicList.ImgUrl)) {
						for (var i = 1; i < value.PicList.ImgUrl.length; i++) {
							html += '<img src="' + value.PicList.ImgUrl[i] + '"  data-preview-src="' +  value.PicList.ImgUrl[i] + '" data-preview-group="' + value.ChannelGuid + '"/>';
						}
					} else {
						//html += '<img src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '" data-preview-group="' + value.ChannelGuid + '"/>';
					}
				} else {
					console.log("该相册下无数据!");
				}
				html += '</div>';
				html += '</li>';
			});
		} else {
			html += '<li class="mui-table-view-cell" id="' + infoArray.ChannelGuid + '" style="z-index: 2;">';
			html += '<i class="Title" style="display:none">' + infoArray.ChannelName + '</i>';
			html += '<div class="imgWrap w190">';
			html += '<div class="bg1"></div>';
			html += '<div class="bg2"></div>';
			html += '<div class="imgDiv">';
			html += '<div>';
			html += '<img src="' + infoArray.IndexPic + '"  data-preview-src="' + infoArray.IndexPic + '" data-preview-group="' + infoArray.ChannelGuid + '"/>';
			html += '<span style="float: right;z-index: 1000;margin-bottom: 5px;" class="mui-badge mui-badge-primary">' + infoArray.ChannelName + '</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="PicList" style="display: none;">';
			if (infoArray.PicList && infoArray.PicList.ImgUrl) {
				if (Array.isArray(infoArray.PicList.ImgUrl)) {
					for (var i = 1; i < infoArray.PicList.ImgUrl.length; i++) {
						html += '<img src="' + infoArray.PicList.ImgUrl[i] + '"  data-preview-src="' + infoArray.PicList.ImgUrl[i] + '" data-preview-group="' + infoArray.ChannelGuid + '"/>';
					}
				} else {
					//html += '<img src="' + config.ServerUrl_Pic + infoArray.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + infoArray.PicList.ImgUrl + '" data-preview-group="' + infoArray.ChannelGuid + '"/>';
				}
			} else {
				console.log("该相册下无数据!");
			}
			html += '</div>';
			html += '</li>';
		}
		return html;
	};
	/**
	 * @description pad端-老年教育页面- 更多--学员风采列表,
	 * @from：（szpark_xyfclist_padV.html）
	 * @param picsData 传入的json数据（数组）
	 */
	exports.generateHtml_oldeducation_xyfclist_padV = function(picsData) {
		var html = '';
		if (picsData && Array.isArray(picsData)) {
			mui.each(picsData, function(key, value) {
				html += '<li class="mui-table-view-cell picCell" id="' + value.ChannelGuid + '">';
				html += '<i class="Title" style="display:none">' + value.ChannelName + '</i>';
				html += '<div class="imgWrap w190">';
				html += '<div class="bg1"></div>';
				html += '<div class="bg2"></div>';
				html += '<div class="imgDiv">';
				html += '<div>';
				html += '<img src="' + value.IndexPic + '"  data-preview-src="' + value.IndexPic + '" data-preview-group="' + value.ChannelGuid + '"/>';
				html += '<span style="float: right;z-index: 999;" class="PicCountPos">' + value.PicCount + '</span>';
				html += '<span style="float: left;z-index: 1000;margin-bottom: 5px;" class="">' + value.ChannelName + '</span>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '<div class="PicList" style="display: none;">';
				if (value.PicList && value.PicList.ImgUrl) {
					if (Array.isArray(value.PicList.ImgUrl)) {
						for (var i = 1; i < value.PicList.ImgUrl.length; i++) {
							html += '<img src="' + value.PicList.ImgUrl[i] + '"  data-preview-src="' + value.PicList.ImgUrl[i] + '" data-preview-group="' + value.ChannelGuid + '"/>';
						}
					} else {
						//html += '<img src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '" data-preview-group="' + value.ChannelGuid + '"/>';
					}
				} else {
					console.log("该相册下无数据!");
				}
				html += '</div>';
				html += '</li>';
			});
		} else {
			html += '<li class="mui-table-view-cell picCell" id="' + picsData.ChannelGuid + '">';
			html += '<i class="Title" style="display:none">' + picsData.ChannelName + '</i>';
			html += '<div class="imgWrap w190">';
			html += '<div class="bg1"></div>';
			html += '<div class="bg2"></div>';
			html += '<div class="imgDiv">';
			html += '<div>';
			html += '<img src="' + picsData.IndexPic + '"  data-preview-src="' + picsData.IndexPic + '" data-preview-group="' + picsData.ChannelGuid + '"/>';
			html += '<span style="float: right;z-index: 999;" class="PicCountPos">' + picsData.PicCount + '</span>';
			html += '<span style="float: left;z-index: 1000;margin-bottom: 5px;" class="">' + picsData.ChannelName + '</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="PicList" style="display: none;">';
			if (picsData.PicList && picsData.PicList.ImgUrl) {
				if (Array.isArray(picsData.PicList.ImgUrl)) {
					for (var i = 1; i < picsData.PicList.ImgUrl.length; i++) {
						html += '<img src="' + picsData.PicList.ImgUrl[i] + '"  data-preview-src="' + picsData.PicList.ImgUrl[i] + '" data-preview-group="' + picsData.ChannelGuid + '"/>';
					}
				} else {
					//html += '<img src="' + config.ServerUrl_Pic + picsData.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + picsData.PicList.ImgUrl + '" data-preview-group="' + picsData.ChannelGuid + '"/>';
				}
			} else {
				console.log("相册下不存在照片的！");
			}
			html += '</div>';
			html += '</li>';
		}
		return html;
	};
	/**
	 * @description pad端-老年教育页面-学员风采-展示两项 ,
	 * @from：（szpark_oldeducation_home_apad.html）
	 * @param picsData 传入的json数据（数组）
	 */
	exports.generateHtml_oldeducation_home_apad = function(picsData) {
		var html = '';
		if (picsData && Array.isArray(picsData)) {
			//当返回的相册数据为数组时
			mui.each(picsData, function(key, value) {
				if (key < 5) {
					html += '<div class="suzhou_oldeducation_course_show student_list_item" id="' + value.ChannelGuid + '">';
					html += '<img class="suzhou_oldeducation_course_pic" src="' + value.IndexPic + '" data-preview-src="' + value.IndexPic + '" data-preview-group="' + value.ChannelGuid + '">';
					html += '<span class="title">' + value.ChannelName + '</span>';
					html += '<i class="ChannelGuid" style="display:none">' + value.ChannelGuid + '</i>';
					html += '<div class="piclistdata" style="display: none;">';
					if (value.PicList && value.PicList.ImgUrl) {
						if (Array.isArray(value.PicList.ImgUrl)) {
							for (var i = 1; i < value.PicList.ImgUrl.length; i++) {
								html += '<img src="' + value.PicList.ImgUrl[i] + '"  data-preview-src="' + value.PicList.ImgUrl[i] + '" data-preview-group="' + value.ChannelGuid + '"/>';
							}
						} else {
							//html += '<img src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + value.PicList.ImgUrl + '" data-preview-group="' + value.ChannelGuid + '"/>';
						}
					} else {
						console.log("该相册下无数据!");
					}
					html += '</div>';
					html += '</div>';
				}
			});
		} else {
			//当返回相册数据为单条时
			html += '<div class="suzhou_oldeducation_course_show student_list_item" id="' + picsData.ChannelGuid + '">';
			html += '<img class="suzhou_oldeducation_course_pic" src="' + picsData.IndexPic + '" data-preview-src="' + picsData.IndexPic + '" data-preview-group="' + picsData.ChannelGuid + '">';
			html += '<span class="title">' + picsData.ChannelName + '</span>';
			html += '<i class="ChannelGuid" style="display:none">' + picsData.ChannelGuid + '</i>';
			html += '<div class="piclistdata" style="display: none;">';
			if (picsData.PicList && picsData.PicList.ImgUrl) {
				if (Array.isArray(picsData.PicList.ImgUrl)) {
					for (var i = 1; i < picsData.PicList.ImgUrl.length; i++) {
						html += '<img src="' + picsData.PicList.ImgUrl[i] + '"  data-preview-src="' + picsData.PicList.ImgUrl[i] + '" data-preview-group="' + picsData.ChannelGuid + '"/>';
					}
				} else {
					//html += '<img src="' + config.ServerUrl_Pic + picsData.PicList.ImgUrl + '"  data-preview-src="' + config.ServerUrl_Pic + picsData.PicList.ImgUrl + '" data-preview-group="' + picsData.ChannelGuid + '"/>';
				}
			} else {
				console.log("该相册下无数据!");
			}
			html += '</div>';
			html += '</div>';
		}
		return html;
	}
});