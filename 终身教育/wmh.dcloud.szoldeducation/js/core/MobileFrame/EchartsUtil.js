/**
 * @description   移动开发框架
 * @author sunzl
 * @version 2.0
 * @time 2016-01-27 12:57:57
 * 功能模块:
 * 图表相关工具类********************************
 * core/MobileFrame/EchartsUtil
 * 1.相关功能函数-见源码和文档
 * Echarts 图表相关工具类结束*****************************
 */
define(function(require, exports, module) {
	"use strict";
	/**
	 * @description 初始化接口，返回ECharts实例
	 * @param {dom} dom 为图表所在节点
	 * @param {String}theme为可选的主题，内置主题（'macarons', 'infographic'）直接传入名称. 自定义扩展主题可传入主题对象
	 * @return {DOM}对象
	 */
	function init(dom, theme) {
		var initObject = "";
		var byId = function(id) {
			return document.getElementById(id);
		};
		try {
			initObject = echarts.init(byId(dom), theme);
		} catch (e) {
			//TODO 捕捉异常信息，打印信息
			console.error("错误原因: 获取Dom节点出错，请检查配置项setOption({dom: '空或者找不到'}");
		}
		return initObject;
	};
	/**
	 * @description 万能接口，配置图表实例任何可配置选项
	 * @param {options} options 配置选项参数这里是{json}格式的
	 * @param {returns}无
	 */
	exports.setOption = function(options) {
		//配置项
		var configOption = {};
		/**
		 * 默认的配置参数
		 */
		var defaultSettingOptions = {
			dom: null,
			chartType: null,
			chartData: null,
			theme: null
		};
		//判断配置项是否为空！如果为空，采用默认的配置项信息
		(options && options != null) ? (configOption = options) : (configOption = defaultSettingOptions);
		try {
			//实例化图表,配置相关配置
			var initEchartsInstance = init(configOption.dom, configOption.theme);
			initEchartsInstance.setOption(getOption(configOption.chartType, configOption.chartData));
		} catch (e) {
			//TODO 处理异常信息，打印信息
			console.error(e.message);
		}
	};
	/**
	 * @description 实例化图表方法
	 * @param {String} chartType 图表的类型(有line、bar以及pie等)
	 * @param {Json数组} chartData图表填充数据必须是json数组,比如以下格式：
	 * @return {option} chartOption图表配置选项{}
	 */
	function getOption(chartType, chartData) {
		var chartOption = "";
		var xAxisData = []; //X轴数据即横坐标数据，适用于折线图和柱状图，一般情况下，直角坐标系 grid 中的 x 轴，单个 grid 组件最多只能放上下两个 x 轴。
		var yAxisData = []; //Y轴数据即纵坐标数据[第一列]，适用于折线图和柱状图，一般情况下，直角坐标系 grid 中的 y 轴，单个 grid 组件最多只能放左右两个 y 轴。
		var yAxisData2 = [];//Y轴数据即纵坐标数据[第二列]，适用于折线图和柱状图，一般情况下，直角坐标系 grid 中的 y 轴，单个 grid 组件最多只能放左右两个 y 轴。
		$.each(chartData, function(key, value) {
			xAxisData.push(value.name);
			yAxisData.push(value.value);
			yAxisData2.push(value.time);
		});
		if (chartType == 'pie') {
			chartOption = {
				//饼图
				title: {
					text: '',
					subtext: '',
					textStyle: {
						color: 'black',
						fontFamily: '微软雅黑',
						fontSize: 20
					}
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: false
						},
						dataView: {
							show: false,
							readOnly: false
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: false
						}
					}
				},
				tooltip: {
					trigger: 'item',
					formatter: "{b} : {c} ({d}%)" //b代表块的标题，c代表数量，d代表比例（未婚：1200（89%））
				},
				legend: {
					orient: 'vertical', //图例的显示方向
					x: 'left',
					itemGap: 10,
					data: xAxisData
				},
				calculable: false,
				series: [{
					name: '数据总量分析',
					type: 'pie',
					radius: '45%',
					center: ['50%', '50%'],
					itemStyle: {
						normal: {
							label: {
								show: true,
								//position: 'inner',
								formatter: '{b}\n  {c}\n({d}%)'
							},
							labelLine: {
								show: true, //每一项标签线 
								length: 2
							}
						}
					},
					data: chartData
				}]
			}
		} else if (chartType == 'bar') {
			chartOption = {
				//柱状图
				title: {
					text: '',
					subtext: ''
				},
				legend: {
					data: ['在线时长', '获得积分']
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(value){
						//console.log(JSON.stringify(value[0][0]));
						//console.log(JSON.stringify(value[0][1]));
						//console.log(JSON.stringify(value[0][2]));
						//console.log(JSON.stringify(value[1][0]));
						//console.log(JSON.stringify(value[1][1]));
						//console.log(JSON.stringify(value[1][2]));
						var str=value[0][1]+"<br/>"+(value[0].seriesName)+"："+((value[0][2]/3600).toFixed(2))+" h<br/>"+(value[1].seriesName)+"："+value[1][2]+"";
						return str;
					}, //b代表块的标题，c代表数量，d代表比例（未婚：1200（89%））
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: false
						},
						dataView: {
							show: false,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: false
						},
						saveAsImage: {
							show: false
						}
					}
				},
				grid: {
					x: 90, //调整x标签显示问题
					x2: 10,
					y: 60,
					y2: 80 //调整y标签显示问题
				},
				calculable: false, //是否启用拖拽重计算特性,默认关闭
				xAxis: [{
					type: 'category',
					//					boundaryGap: true,
					data: xAxisData,
					axisLabel: {
						interval: 0,
						rotate: 45
					}
				}],
				yAxis: [{
					type: 'value',
					name: '时长/积分',
					//min: 0,
					//max: 250,
					interval: 50,
					splitArea: {
						show: true
					},
					axisLabel: {
						formatter: function(value){
							var formatterStr=((value/3600).toFixed(2))+'h/'+value+'分' //标明纵坐标的单位
							//console.log(value);
							return formatterStr ;
						}
					}
				}],
				series: [{
					name: '在线时长',
					type: 'bar',
					data: yAxisData2,

					barCategoryGap: '50%', //柱状之间的间隔代沟，50%
					itemStyle: {
						normal: {
							label: {
								show: true, //显示数据值
								position: 'outer' //显示在外侧
							}
						}
					}

				}, {
					name: '获得积分',
					type: 'bar',
					data: yAxisData,
					barCategoryGap: '50%', //柱状之间的间隔代沟，50%
					itemStyle: {
						normal: {
							label: {
								show: true, //显示数据值
								position: 'outer' //显示在外侧
							}
						}
					}
				}],
				color: ['#1ebaf3', '#ff9a38'] //该列表中取颜色作为系列颜色。
			}
		} else if (chartType == 'line') {
			chartOption = {
				//折线图
				title: {
					text: '',
					subtext: ''
				},
				tooltip: {
					trigger: 'axis', //触发提示
					formatter: "{b},{c}"
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: false
						},
						dataView: {
							show: false,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: false
						},
						saveAsImage: {
							show: false
						}
					}
				},
				grid: {
					x: 50, //调整x标签显示问题
					x2: 10,
					y: 30,
					y2: 80 //调整y标签显示问题
				},
				calculable: false,
				xAxis: [{
					type: 'category',
					data: xAxisData,
					axisLabel: {
						interval: 0,
						rotate: 45
					}
				}],
				yAxis: [{
					type: 'value',
					splitArea: {
						show: true
					}
				}],
				series: [{
					name: '数据总量分析',
					type: 'line',
					data: yAxisData,
					itemStyle: {
						normal: {
							label: {
								show: true
							}
						}
					}
				}]
			}
		}
		return chartOption;
	};
});