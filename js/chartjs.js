define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', "dojo/dom", "./Chart_v2.4.0"
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, dom, Chart ) {
        "use strict";

        return declare(null, {
			createChart: function(t){
				// Set global chart variables
				Chart.defaults.global.tooltips.enabled = false;
				Chart.defaults.global.legend.display = false;
				// build config options for graph
				var main = [
					{ type: 'line', label: 'AVL', borderColor: '#3783c7', fill: false },
					{ label: 'DOM', backgroundColor: 'rgba(253, 191, 45, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IND', backgroundColor: 'rgba(70, 116, 193,0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IRR', backgroundColor: 'rgba(114, 172, 77, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'LIV', backgroundColor: 'rgba(68, 103, 46, 0.7)', yAxisID: "bar-y-axis" },
					{ type:'line', label:'AVL_Min', borderColor:'#96bee2', backgroundColor:'#FFF', fill:true },
					{ type:'line', label:'AVL_Max', borderColor:'#82b2dc', backgroundColor:'rgba(190, 215, 237, 0.7)', fill: true }
				]
				// build main options for graph
				var mainOpt = {
					elements:{ point:{ radius:0 } },
					scales: {
						yAxes: [
							{stacked:false, ticks:{beginAtZero:true, min:0, max:450}, type:'linear', display:false },
							{ id:"bar-y-axis", stacked:true, ticks:{beginAtZero:true, min:0, max:450}, type:'linear' }
						],
						xAxes: [
							{ stacked:true, ticks:{beginAtZero:true} }
						]
					}
				}
				
				// Instantiate charts from objects above
				var ctx = $('#' + t.id + 'rawChart');
				// build chart
				t.myRawChart = new Chart(ctx, {
					type: 'bar', data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: main }, options: mainOpt
				});
				// Handle Clicks on chart type buttons
				$('#' + t.id + 'sh_interBtn').on('click',lang.hitch(t,function(){
					// update the config of the chart options to show either bars, lines or ranges or all three
					t.myRawChart.config.data.datasets[0].label = 'AVL'
					t.myRawChart.config.data.datasets[5].label = 'AVL_Min'
					t.myRawChart.config.data.datasets[6].label = 'AVL_Max'
					t.myRawChart.config.options.scales.yAxes[0].ticks.max = t.interMax;
					t.myRawChart.config.options.scales.yAxes[1].ticks.max = t.interMax;
					$.each(main,function(i,v){
						v.data = t.chartData[0][v.label]
					})
					t.myRawChart.update();
					// work with css and show rawChart
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_chartWrap').show();
					$('#' + t.id + 'sh_interBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_avlLWrap, #' + t.id + 'sh_avlmmLWrap').css('opacity', '1');
				}));
				$('#' + t.id + 'sh_availBtn').on('click',lang.hitch(t,function(){
					// update the config of the chart options to show either bars, lines or ranges or all three
					t.myRawChart.config.data.datasets[0].label = 'AVL'
					t.myRawChart.config.data.datasets[5].label = 'AVL_Min1'
					t.myRawChart.config.data.datasets[6].label = 'AVL_Max1'
					t.myRawChart.config.options.scales.yAxes[0].ticks.max = t.availMax;
					t.myRawChart.config.options.scales.yAxes[1].ticks.max = t.availMax;
					
					$.each(main,function(i,v){
						v.data = t.chartData[0][v.label]
					})
					t.myRawChart.update();
					// work with css and show rawChart
					$('#' + t.id + 'sh_chartWrap').show();
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_availBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_avlLWrap').css('opacity', '1');
					$('#' + t.id + 'sh_avlmmLWrap').css('opacity', '0.4');
				}));
				
				$('#' + t.id + 'sh_rawBtn').on('click',lang.hitch(t,function(){
					// update the config of the chart options to show either bars, lines or ranges or all three
					t.myRawChart.config.data.datasets[0].label = 'AVL1'
					t.myRawChart.config.data.datasets[5].label = 'AVL_Min1'
					t.myRawChart.config.data.datasets[6].label = 'AVL_Max1'
					t.myRawChart.config.options.scales.yAxes[0].ticks.max = t.rawMax;
					t.myRawChart.config.options.scales.yAxes[1].ticks.max = t.rawMax;
					
					$.each(main,function(i,v){
						v.data = t.chartData[0][v.label]
					})
					t.myRawChart.update();
					// work with css and show rawChart
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_chartWrap').show();
					$('#' + t.id + 'sh_rawBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_avlLWrap, #' + t.id + 'sh_avlmmLWrap').css('opacity', '0.4');
				}));
				
				// Triggers a click on the raw button to show data
				//$('#' + t.id + t.obj.chartVisBtn).trigger('click');
			}
			
		});
    }
)