/*
 * 作者 : 黄赟博
 * 时间 : 2016-04-07 08:44:22
 * 描述 : 认证机构父页面
 */
define(function(require, exports, module) {
	"use strict"
	var CommonUtil = require('core/MobileFrame/CommonUtil');
	//引入页面操作模块
	var WindowUtil = require('core/MobileFrame/WindowUtil');
	CommonUtil.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 */
	function initData() {
		//子页面
		var PageArray = [{
			url: 'szpark_institution_list.html', //下拉刷新内容页面地址
			id: 'szpark_institution_list.html', //内容页面标志
			styles: {
				top: '88px', //内容页面顶部位置,需根据实际页面布局计算
				bottom: '0px' //其它参数定义
			}
		}];
		WindowUtil.createSubWins(PageArray);
		//绑定搜索事件
		bindSearchEvent();
	}
	//绑定搜索事件
	function bindSearchEvent() {
		//初始化加载class
		var classSelector = function(name) {
			return '.' + mui.className(name);
		}
		var IndexedList = mui.IndexedList = mui.Class.extend({
			/**
			 * 通过 element 和 options 构造 IndexedList 实例
			 **/
			init: function(holder, options) {
				var self = this;
				self.options = options || {};
				self.box = holder;
				if (!self.box) {
					throw "实例 IndexedList 时需要指定 element";
				}
				self.createDom();
				self.findElements();
				self.bindEvent();
			},
			createDom: function() {
				var self = this;
				self.el = self.el || {};
			},
			findElements: function() {
				var self = this;
				self.el = self.el || {};
				self.el.search = self.box.querySelector(classSelector('indexed-list-search'));
				self.el.searchInput = self.box.querySelector(classSelector('indexed-list-search-input'));
				self.el.searchClear = self.box.querySelector(classSelector('indexed-list-search') + ' ' + classSelector('icon-clear'));
			},
			search: function(keyword) {
				var self = this;
				keyword = (keyword || '').toLowerCase();
			},
			bindSearchEvent: function() {
				var self = this;
				self.el.searchInput.addEventListener('input', function() {
					/**
					 * @description 根据输入框内容的变化自动进行搜索
					 */
					var keyword = this.value;
					WindowUtil.firePageEvent("szpark_institution_list.html", "searchEventName", {
						searchContent: keyword
					});
				}, false);
				mui(self.el.search).on('tap', classSelector('icon-clear'), function() {
					/**
					 * @description 清除搜索框内容，查找全部内容
					 */
					WindowUtil.firePageEvent("szpark_institution_list.html", "searchEventName", {
						searchContent: ""
					});
				}, false);
			},
			bindEvent: function() {
				var self = this;
				self.bindSearchEvent();
			}
		});
		//初始化
		var list = document.getElementById('list');
		window.indexedList = new mui.IndexedList(list);
	}
});