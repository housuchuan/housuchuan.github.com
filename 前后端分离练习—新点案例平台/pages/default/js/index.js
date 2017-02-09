/*！
 *新点首页
 *date:2017-02-03
 *author: housc;
 */
//初始化轮播图
(function(win, $) {
	function topFocus() {
		// 获取swiper-container宽度
		var complementWidth = $('.swiper-container').width();

		// 左右按钮
		$('.swiper-container').hover(
			function() {
				$(this).find('.swiper-arrow-left').fadeIn(600);
				$(this).find('.swiper-arrow-right').fadeIn(600);
			},
			function() {
				$(this).find('.swiper-arrow-left').fadeOut(600);
				$(this).find('.swiper-arrow-right').fadeOut(600);
			}
		);
		// new Swiper
		window.mySwiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoplay: 2000,
			autoplayDisableOnInteraction: false,
			speed: 1500,
			loop: true,

			onFirstInit: function(swiper) {

				// 补充向右最后一个card
				var len = swiper.slides.length - 1,
					focus = $('.swiper-wrapper');
				var
					targetObj = focus.children().eq(len),
					complementObj = focus.children().eq(2).clone();
				complementObj.css({
					"position": "absolute",
					"top": "0",
					"right": '-' + complementWidth + 'px'
				});
				targetObj.css('overflow', 'visible');
				targetObj.append(complementObj);

				// 补充向左最后一个card

				var
					lenL = swiper.slides.length - 3,
					targetObjl = focus.children().eq(0),
					complementObjl = focus.children().eq(lenL).clone();
				complementObjl.css({
					"position": "absolute",
					"top": "0",
					"left": '-' + complementWidth + 'px'
				});
				targetObjl.css('overflow', 'visible');
				targetObjl.append(complementObjl);
				console.log(complementObjl)

				// 向左、向右按钮
				$('.swiper-arrow-left').click(function() {
					swiper.swipePrev();
				})
				$('.swiper-arrow-right').click(function() {
					swiper.swipeNext();
				})

			}
		});
	};
	// 初始化轮播组件
	setTimeout(function() {
		topFocus();
	}, 200);

}(this, jQuery));

(function($) {
	//声明dom
	
	var $productype = $("#product-type"),
		$projectlistwrapper = $('#projectlistwrapper'),
		//更多案例
		$morecase = $('#morecase'),
		//页面顶部Input内容框
		$keyword = $('#keyword'),
		//页面顶部搜索按钮
		$sbtn = $('#search-btn');
	//声明变量
		//tab分类id
	var id = '',
		//搜索关键字
		keyword = '';
	//mustache渲染声明
	var M = Mustache,
		//util类处理tab分类模板空格
		tabmodule = Util.clearHtml($("#tab").html()),
		//util类处理项目列表模板空格
		projectlistmodule = Util.clearHtml($("#projectlist").html());

	// 预处理模板
	//mustache预处理tab分类模板
	M.parse(tabmodule);
	//mustache预处理项目列表模板
	M.parse(projectlistmodule);

	//请求tab列表数据
	var ajaxtablist = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CategoryNum: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.Category,
			data: requestData,
			type: 'POST',
			success: function(data) {
				if(data.InfoList.Info) {
					$productype.html(M.render(tabmodule, {
						data: data.InfoList.Info
					}));
					$(' > li:first-child', $productype).addClass('product-type-active');
					id = $(' > li:first-child', $productype).attr('id');
					//初始化项目列表数据
					ajaxprojectlist();
					//初始化监听
					inittabclicklistener();
				}
			}
		});
	};

	//请求tab列表下项目列表数据
	var ajaxprojectlist = function(type) {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			PageIndex: 1,
			PageSize: 6,
			CaseColor: '',
			CaseFangXiang: '',
			CaseResult: '',
			CaseType: '',
			CategoryGuid: id,
			OrderByText: '',
			OrderByType: '',
			keyWords: keyword
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("xxxxxxxxx" + JSON.stringify(requestData));
		Util.ajax({
			url: _settings.ProjectList,
			data: requestData,
			type: 'POST',
			success: function(data) {
				if(data.InfoList.Info) {
					if (type == 'yes') {
						$projectlistwrapper.append(M.render(projectlistmodule, {
							datalist: data.InfoList.Info
						}));
					}else{
						$projectlistwrapper.html(M.render(projectlistmodule, {
							datalist: data.InfoList.Info
						}));
					};
				};
			}
		});
	};

	//案例tab模块点击监听
	var inittabclicklistener = function() {
		$productype.on('click','li', function() {
			id = this.id;
			$(this).addClass('product-type-active').siblings().removeClass('product-type-active');
			ajaxprojectlist();
		});
	};

	//关键字搜索监听
	var keywordclicklistener = function() {
		//页面关键字搜索
		$sbtn.on('click', function() {
			keyword = $keyword.val();
			//重新初始化项目列表数据
			ajaxprojectlist();
		});
		
		//更多案例
		$morecase.on('click', function() {
			//初始化项目列表数据，所传参数用户数据的叠加
			ajaxprojectlist('yes');
		});
	};

	//初始化tab列表数据
	ajaxtablist();
	
	//关键字检索
	keywordclicklistener();
	
})(jQuery);