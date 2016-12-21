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
				// Create objects for Raw chart
				t.raw = [
					{ label: 'DOM', backgroundColor: 'rgba(253, 191, 45, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IND', backgroundColor: 'rgba(70, 116, 193,0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IRR', backgroundColor: 'rgba(114, 172, 77, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'LIV', backgroundColor: 'rgba(68, 103, 46, 0.7)', yAxisID: "bar-y-axis" }
				]
				var rawOpt = {
					elements:{ point:{ radius:0 } },
					scales: {
						yAxes: [
							{ id:"bar-y-axis", stacked:true, ticks:{beginAtZero:true, min:0, max: 10}, type:'linear', display:true }
						],
						xAxes: [
							{ stacked:true, ticks:{beginAtZero:true} }
						]
					}
				}
				// Create objects for Available chart
				t.avail = [
					{ type: 'line', label: 'AVL', borderColor: '#3783c7', fill: false },
					{ label: 'DOM', backgroundColor: 'rgba(253, 191, 45, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IND', backgroundColor: 'rgba(70, 116, 193,0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IRR', backgroundColor: 'rgba(114, 172, 77, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'LIV', backgroundColor: 'rgba(68, 103, 46, 0.7)', yAxisID: "bar-y-axis" },
				]
				var availOpt = {
					elements:{ point:{ radius:0 } },
					scales: {
						yAxes: [
							{stacked:false, ticks:{beginAtZero:true, min:0, max: 10} },
							{ id:"bar-y-axis", stacked:true, ticks:{beginAtZero:true, min:0, max: 10}, type:'linear', display:false }
						],
						xAxes: [
							{ stacked:true, ticks:{beginAtZero:true} }
						]
					}
				}
				// Create objects for Interannual chart
				t.inter = [
					{ type: 'line', label: 'AVL', borderColor: '#3783c7', fill: false },
					{ label: 'DOM', backgroundColor: 'rgba(253, 191, 45, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IND', backgroundColor: 'rgba(70, 116, 193,0.7)', yAxisID: "bar-y-axis" },
					{ label: 'IRR', backgroundColor: 'rgba(114, 172, 77, 0.7)', yAxisID: "bar-y-axis" },
					{ label: 'LIV', backgroundColor: 'rgba(68, 103, 46, 0.7)', yAxisID: "bar-y-axis" },
					{ type:'line', label:'AVL_Min', borderColor:'#96bee2', backgroundColor:'#FFF', fill:true },
					{ type:'line', label:'AVL_Max', borderColor:'#82b2dc', backgroundColor:'rgba(190, 215, 237, 0.7)', fill: true }
				]
				var interOpt = {
					elements:{ point:{ radius:0 } },
					scales: {
						yAxes: [
							{stacked:false, ticks:{beginAtZero:true, min:0, max: 10} },
							{ id:"bar-y-axis", stacked:true, ticks:{beginAtZero:true, min:0, max: 10}, type:'linear', display:false }
						],
						xAxes: [
							{ stacked:true, ticks:{beginAtZero:true} }
						]
					}
				}
				// Instantiate charts from objects above
				t.myRawChart = new Chart($('#' + t.id + 'rawChart'), {
					type: 'bar', data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: t.raw }, options: rawOpt
				})
				t.myAvailChart = new Chart($('#' + t.id + 'availChart'), {
					type: 'bar', data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: t.avail }, options: availOpt
				});
				t.myInterChart = new Chart($('#' + t.id + 'interChart'), {
					type: 'bar', data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: t.inter }, options: interOpt
				});


				t.dver = "f";
				$('#' + t.id + 'chData').on('click',lang.hitch(t,function(){
					if (t.dver == "f"){
						t.chartjs.updateChart(t,tempData1)
						t.dver = "s";
					}else{
						t.chartjs.updateChart(t,tempData)
						t.dver = "f";
					}
				}));
				// Handle Clicks on chart type buttons
				$('#' + t.id + 'sh_rawBtn').on('click',lang.hitch(t,function(){
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_rWrap').show();
					$('#' + t.id + 'sh_rawBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_aWrap').hide();
					$('#' + t.id + 'sh_iWrap').hide();
					$('#' + t.id + 'sh_avlLWrap, #' + t.id + 'sh_avlmmLWrap').css('opacity', '0.4');
				}));
				$('#' + t.id + 'sh_availBtn').on('click',lang.hitch(t,function(){
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_rWrap').hide();
					$('#' + t.id + 'sh_aWrap').show();
					$('#' + t.id + 'sh_availBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_iWrap').hide();
					$('#' + t.id + 'sh_avlLWrap').css('opacity', '1');
					$('#' + t.id + 'sh_avlmmLWrap').css('opacity', '0.4');
				}));
				$('#' + t.id + 'sh_interBtn').on('click',lang.hitch(t,function(){
					$('#' + t.id + ' .sh_chartBtns').removeClass('sh_togBtnSel');
					$('#' + t.id + 'sh_rWrap').hide();
					$('#' + t.id + 'sh_aWrap').hide();
					$('#' + t.id + 'sh_iWrap').show();
					$('#' + t.id + 'sh_interBtn').addClass('sh_togBtnSel');
					$('#' + t.id + 'sh_avlLWrap, #' + t.id + 'sh_avlmmLWrap').css('opacity', '1');
				}));
				// Triggers a click on the raw button to show data
				$('#' + t.id + t.obj.chartVisBtn).trigger('click');
			},
			// Update charts with new data
			updateChart: function(t,a){
				$.each(t.raw,function(i,v){
					v.data = a[0][v.label]
				})
				$.each(t.avail,function(i,v){
					v.data = a[0][v.label]
				})
				$.each(t.inter,function(i,v){
					v.data = a[0][v.label]
				})
				t.myRawChart.update();
				t.myAvailChart.update();
				t.myInterChart.update();
			}
		});
    }
)