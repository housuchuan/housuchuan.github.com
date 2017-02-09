/*！
 *案例库
 *date:2017-02-08
 *author: housc;
 */

(function($) {
	//声明dom
	//业务包裹层
	var $servicewrapper = $('#servicewrapper ul'),
		//类型分类包裹层
		$typeList = $('#type-list'),
		//方向分类包裹层
		$direction = $('#direction'),
		//成果包裹层
		$resultwrapper = $('#resultwrapper'),
		//颜色分类包裹层
		$colorwrapper = $('#colorwrapper'),
		//显示更多dom
		$more = $('#see-more'),
		//案例列表包裹层
		$caselist = $('#caselist'),
		//最新和下载量包裹层dom
		$datatab = $('#data-tab'),
		//关键字检索dom
		$sbtn = $('#search-btn'),
		//header中input
		$keyword = $('#keyword'),
		//案例列表上搜索框
		$inputbtn = $('#input-searchbtn'),
		//案例中input
		$inputkeyword = $('#inputkeyword'),
		//分页
		//案例总数
		$num = $('#num'),
		//案例列表右上角当前页
		$currentIndex = $('#current-index'),
		//总页数
		$allpage = $('#allpage'),
		//案例右上角向左翻页
		$leftarrow = $('#leftarrow'),
		//案例右上角向右翻页
		$rightarrow = $('#rightarrow'),
		//分页包裹层
		$pager = $(".pager");
	//声明变量
	var pageindex = 0; //当前页
	//案例列表声明常量
	var currentpageindex = 1, //案例请求数据当前页
		//颜色id
		colorId = '',
		//方向id
		casedirectionId = '',
		//成果id
		resultId = [],
		//类型id
		typeId = '',
		//业务id
		categoryId = '',
		//根据最新和下载量进行排序；0：最新   1：下载量，默认为0
		orderbytype = 0,
		//关键字
		keyword = '';

	//mustache渲染机制变量
	var M = Mustache,
		//清楚业务模板空格
		servicemodule = Util.clearHtml($('#service').html()),
		//清楚成果模板空格
		resultmodule = Util.clearHtml($('#result').html()),
		//清楚颜色模板空格
		colormodule = Util.clearHtml($('#colorall').html()),
		//清楚案例模板空格
		projectlistmodule = Util.clearHtml($('#projectlist').html());

	//预处理模板
	//mustache预处理业务模板
	M.parse(servicemodule);
	//mustache预处理成果模板
	M.parse(resultmodule);
	//mustache预处理颜色模板
	M.parse(colormodule);
	//mustache预处理案例列表模板
	M.parse(projectlistmodule);

	//用于改变分类模块的li样式切换公用模块js,dom:需要传入的操作dom
	var initlistener = function(dom) {
		dom.on('click', 'li', function() {
			$(this).addClass('active').siblings().removeClass('active');
		});
	};

	//点击更多
	var clickmore = function(domwrapper, module, data) {
		$more.on('click', function() {
			//类型分类模块中右侧Button中的text值
			var text = $(this).text();
			if(text == "更多") {
				$('#typewrapper').addClass('typewrapper-active');
				$more.text('收起');
			} else {
				$('#typewrapper').removeClass('typewrapper-active');
				$more.text('更多');
			};
		});
	};

	//筛选案例数据
	//请求tab列表下项目列表数据
	var ajaxprojectlist = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			//当前页
			PageIndex: currentpageindex,
			//每页显示数量
			PageSize: 10,
			//颜色guid
			CaseColor: colorId,
			//方向guid
			CaseFangXiang: casedirectionId,
			//成果guid
			CaseResult: resultId,
			//类型guid
			CaseType: typeId,
			//业务guid
			CategoryGuid: categoryId,
			//是按时间还是下载量排序
			OrderByText: orderbytype,
			OrderByType: '',
			//搜索关键字
			keyWords: keyword
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		console.log("xxx" + requestData);
		Util.ajax({
			url: _settings.projectlist,
			data: requestData,
			type: 'POST',
			success: function(data) {
				if(data.InfoList.Info) {
					//将数据渲染进案例列表模块中
					$caselist.html(M.render(projectlistmodule, {
						data: data.InfoList.Info
					}));
				}
			}
		});
	};

	//业务点击
	var serviceclick = function() {
		//业务点击
		$servicewrapper.on('click', 'li', function() {
			//获取业务id值
			categoryId = this.id;
			//重新请求案例列表数据
			ajaxprojectlist();
		});
	};

	//案例列表点击
	var typeclick = function() {
		//案例类型id
		$typeList.on('click', 'li', function() {
			//获取方向id值
			typeId = this.id;
			//初始化方向函数
			directdata();

		});
	};

	//方向列表点击
	$direction.on('click', 'li', function(e) {
		//获取方向id值
		casedirectionId = this.id;
		//重新请求案例列表数据
		ajaxprojectlist();
	});

	//成果列表点击
	var resultclick = function() {
		//成果列表点击
		$resultwrapper.on('click', 'li', function() {
			//当前li对象
			var _this = $(this),
				//成果列表下面所有li对象集合
				resultlist = $resultwrapper.children('li');
			if(_this.hasClass('checkactive')) {
				_this.removeClass('checkactive');
			} else {
				_this.addClass('checkactive');
			};
			resultId = [];
			//遍历成果下的子对象
			for(var i = 0; i < resultlist.length; i++) {
				//判断是否该元素被激活
				if($(resultlist[i]).hasClass('checkactive')) {
					resultId.push($(resultlist[i]).attr('id'));
				};
			};
			//重新请求案例列表数据
			ajaxprojectlist();
		});
	};

	//成果请求数据
	var resultdata = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CodeName: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.service,
			data: requestData,
			type: 'POST',
			success: function(data) {
				//当模块是成果模块时
				$resultwrapper.append(M.render(resultmodule, {
					service: data.InfoList.Info
				}));
				var firstlidom = $resultwrapper.children('li:first-child'),
					firstliid = firstlidom.attr('id');
				//成果模块中第一个Li呈现激活状态
				firstlidom.addClass('checkactive');
				resultId.push(firstliid);
				//初始化获取分类id函数
				resultclick();
				//重新请求案例列表数据
				ajaxprojectlist();
			}
		});
	};

	//色调
	//颜色列表中各子元素之间的样式切换 
	var colortab = function($colordom) {
		//颜色列表各item元素点击
		$colordom.on('click', 'li', function() {
			//当前点击li对象
			var _this = $(this);
			//获取当前颜色id
			colorId = this.id;
			//当前在颜色模块中点击的是全部时
			_this.addClass('select').siblings().removeClass('select');
			//重新请求案例列表数据
			ajaxprojectlist();
		});
	};

	//渲染颜色数据
	var colordata = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CodeName: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.color,
			data: requestData,
			type: 'POST',
			success: function(data) {
				if(data.InfoList.Info) {
					//将颜色数据渲染进颜色包裹层中
					$colorwrapper.append(M.render(colormodule, {
						color: data.InfoList.Info
					}))
				};
				//初始化颜色模块中各子元素点击事件
				colortab($colorwrapper);
			}
		});
	};

	//方向请求数据
	var directdata = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CodeName: typeId
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.service,
			data: requestData,
			type: 'POST',
			success: function(data) {
				//其他情况下，执行以下
				$direction.html(M.render(servicemodule, {
					service: data.InfoList.Info
				}));
				$direction.prepend('<li class="l active">全部</li>');
				//初始化头部分类各li元素点击监听函数，改变li样式
				initlistener($direction);
			}
		});
	};

	//类型
	var typedata = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CodeName: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.service,
			data: requestData,
			type: 'POST',
			success: function(data) {
				$typeList.append(M.render(servicemodule, {
					service: data.InfoList.Info
				}));
				var typeheight = parseInt($typeList.height()),
					commonheight = parseInt($('#typewrapper').height());
				if(typeheight > commonheight) {
					//不操作
				} else {
					//若总数小于11则隐藏更多按钮
					$more.addClass('invisible');
				};
				//类型模块当数据大于11时重新初始化列表中元素的监听，改变li样式
				initlistener($typeList);
				//分类中右侧（更多/收起）按钮点击监听
				clickmore($typeList, servicemodule, data);
				$typeList.append('<li class="l" id="other">其他</li>');
				//类型分类列表各li点击事件监听
				typeclick();
			}
		});
	};

	//业务
	var servicedata = function() {
		var requestData = {};
		requestData.ValidateData = 'validatedata';
		var data = {
			CodeName: ''
		};
		requestData.para = data;
		requestData = JSON.stringify(requestData);
		Util.ajax({
			url: _settings.service,
			data: requestData,
			type: 'POST',
			success: function(data) {
				//其他情况下，执行以下
				$servicewrapper.append(M.render(servicemodule, {
					service: data.InfoList.Info
				}));
				//初始化子元素点击监听
				initlistener($servicewrapper);
				//类型分类列表各li点击事件监听
				serviceclick();
			}
		});
	};

	//初始化业务函数
	servicedata();

	//初始化类型函数
	typedata();

	//初始化方向函数
	directdata();

	//初始化色调函数
	colordata();

	//初始化成果数据
	resultdata();

	//最新和下载量active样式切换
	$(' > .new-bar', $datatab).on('click', function() {
		var _this = $(this);
		//最新以及下载量参数
		orderbytype = _this.index();
		if(_this.hasClass('baractive')) {
			//最新以及下载量样式切换
			_this.addClass('barbmactive').removeClass('baractive');
			_this.siblings().removeClass('baractive').removeClass('barbmactive');
		} else {
			_this.addClass('baractive').removeClass('barbmactive');
			_this.siblings().removeClass('baractive').removeClass('barbmactive');
		};
		//重新请求案例列表数据
		ajaxprojectlist();
	});

	//渲染分页
	/*
	 * description
	 * pageindex:当前页
	 * pagesize:煤业展示数据数量
	 * total:数据总条数
	 */
	var renderPager = function(pageindex, pagesize, total) {

		//案例列表数据总数量
		$num.text(total);
		//案例右上角展示总页数
		$allpage.text(total / pagesize);

		if($pager.pagination()) {
			$pager.pagination('destroy');
		}
		//不存在数据时
		if(!total) {
			return;
		}

		//配置分页模块
		$pager.pagination({
			pageIndex: pageindex,
			pageSize: pagesize,
			total: total,
			showJump: true,
			jumpBtnText: 'Go'
		});

		//改变分页页码
		var changepage = function(data) {
			$currentIndex.text(data.pageIndex + 1);
			currentpageindex = (data.pageIndex + 1);
			//初始化分页
			renderPager(data.pageIndex, data.pageSize, total);
			//清空案例数据并重新请求案例列表数据
			ajaxprojectlist();
		};

		//分页点击
		$pager.on("pageClicked", function(event, data) {
			changepage(data);
		}).on('pageSizeChanged', function(event, data) {
			changepage(data);
		}).on('jumpClicked', function(event, data) {
			$currentIndex.text(data.pageIndex + 1);
			currentpageindex = (data.pageIndex + 1);
			//初始化分页
			renderPager(data.pageIndex, data.pageSize, total);
		});

		//go点击
		$('button', $pager).on('click', function() {
			var inputnum = $('input', $pager).val();
			//go点击，对input框中的数值进行数值判断，不能超出最大total区间范围
			if(inputnum < (total / pagesize + 1) && inputnum > 0) {
				currentpageindex = inputnum;
				//改变右上角当前页数值
				$currentIndex.text(inputnum);
				ajaxprojectlist();
			} else {
				return;
			};
		});
	};

	//右上角点击小分页
	function clickpage(pageindex, pagesize, total) {
		var pagemin = 0;

		//右上角向左切换分页点击
		$leftarrow.on('click', function() {
			//pagenum指右上角当前页num值
			var pagenum = parseInt($currentIndex.text());
			pagenum--;
			if(pagenum < 1) {
				pagenum = 1;
				return;
			};
			pagemin = pagenum;
			currentpageindex = pagenum;
			$currentIndex.text(pagenum);
			//初始化底部分页
			renderPager(pagemin - 1, pagesize, total);
			ajaxprojectlist();
		});

		//右上角向右切换分页点击
		$rightarrow.on('click', function() {
			var pagenum = parseInt($currentIndex.text());
			pagenum++;
			if(pagenum > (total / pagesize)) {
				pagenum = total / pagesize;
				return;
			};
			pagemin = pagenum;
			currentpageindex = pagenum;
			$currentIndex.text(pagenum);
			//初始化底部分页
			renderPager(pagemin - 1, pagesize, total);
			ajaxprojectlist();
		});

	};

	//页面加载初始化页面底部分页功能
	renderPager(0, 10, 1000);

	//案例右上角分页按钮点击操作数据变化
	clickpage(0, 10, 1000);

	//页面关键字搜索监听时间函数
	var keywordclicklistener = function() {

		$sbtn.on('click', function() {
			//获取页面顶部搜索框输入值
			keyword = $keyword.val();
			ajaxprojectlist();
		});

		$inputbtn.on('click', function() {
			//获取案例头部搜索框输入值
			keyword = $inputkeyword.val();
			ajaxprojectlist();
		});
	};

	//初始化关键字检索
	keywordclicklistener();

})(jQuery);