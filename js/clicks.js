define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', "dojo/dom",
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, dom ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				//make accrodians
				$( function() {
					$( "#" + t.id + "be_mainAccord" ).accordion({heightStyle: "fill"}); 
					$( "#" + t.id + "be_infoAccord" ).accordion({heightStyle: "fill"});
				});
				// update accordians on window resize - map resize is much cleaner than window resize
				t.map.on('resize',lang.hitch(t,function(){
					t.clicks.updateAccord(t);
				}))		
				// temp to show main accordians
				t.clicks.updateAccord(t);
				$('#' + t.id + 'be_mainAccord').show();
				// leave the get help section
				$('#' + t.id + 'getHelpBtn').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'be_infoAccord').hide();
					$('#' + t.id + 'be_mainAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').hide();
					$('#' + t.id + 'getHelpBtn').html('Back to Benefits Explorer');
					t.clicks.updateAccord(t);
				}));
				// info icon clicks
				$('#' + t.id + ' .be_minfo').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'be_mainAccord').hide();
					$('#' + t.id + 'be_infoAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').show();
					var ben = c.target.id.split("-").pop();
					t.clicks.updateAccord(t);	
					$('#' + t.id + 'be_infoAccord .' + ben).trigger('click');
				}));		
				// year clicks
				$('#' + t.id + ' .sh_togYear').on('click',lang.hitch(t,function(c){
					$('#' + t.id + ' .sh_togYear').removeClass('sh_togBtnSel');
					$('#' + c.target.id).addClass('sh_togBtnSel');
					console.log(c.target.id);
				}));
				
				// click on depletion header 
				$('#' + t.id + 'depHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'depHeader').next().is(':hidden')){
						console.log('opening dep header')
					}
				}));
				// click on catagory header 
				$('#' + t.id + 'catHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'catHeader').next().is(':hidden')){
						console.log('opening cat header')
						t.obj.visibleLayers = [0];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						
						t.map.addLayer(t.category);
						t.clicks.categorySelComplete(t);
					}
				}));
				// click on profile header
				$('#' + t.id + 'proHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'proHeader').next().is(':hidden')){
						console.log('opening pro header')
					}
				}));
				
				// fire when the multi year slider is changed
				// year range slider
				$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:14, slide:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// use the below if you want the slide event to fire only after you are done with the slide
				//$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:14, change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				
				
				
				
				
				// var ben  = event.target.id.split("-").pop()
				// t[ben] = "(" + ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1] + ")";	
				// t.clicks.layerDefsUpdate(t);
				// var low = 0;
				// var high = 0;
				// if (ben == 'freshbiot'){
					// low = ui.values[0]/10;
					// high = ui.values[1]/10;			
				// }else{	
					// low = t.clicks.numberWithCommas(ui.values[0])
					// high = t.clicks.numberWithCommas(ui.values[1])
				// }
				// if (low == high){						
					// $('#' + t.id + ben + '-range').html("(" + low);
				// }else{
					// $('#' + t.id + ben + '-range').html("(" + low + " - " + high);
				// }
				// $('#' + t.id + ben + '-unit').css('display', 'inline-block');
					
					
				
				
				// Benefit CB Clicks
				$('#' + t.id + 'cbListener .be_cbBenWrap').on('click',lang.hitch(t,function(c){
					var ben = "";
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						ben = $(c.currentTarget.children[0].children[0]).val()
					}else{
						ben = c.target.value;
					}	
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.be_rangeWrap').slideDown();
						var values = $('#' + t.id + '-' + ben).slider("option", "values");
						$('#' + t.id + '-' + ben).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.be_rangeWrap').slideUp();
						t[ben] = "";
						t.clicks.layerDefsUpdate(t);
						$('#' + t.id + ben + '-range').html("")
						$('#' + t.id + ben + '-unit').hide();
					}	
				}));	
				
			},
			// fire when the multi year slider is changed
			sliderChange: function( event, ui, t ){
				console.log('slider fire 2')
			},
			
			// build chart on selection complete
			categorySelComplete: function(t){
				t.category.on('selection-complete', lang.hitch(t,function(evt){
					if (evt.features.length > 0){
						// retrieve attribute data
						t.obj.chartData = evt.features[0].attributes;
						// data for the chart, parse the data
						t.tempData = [{
							AVL: JSON.parse(t.obj.chartData.AVL_mean_Mil_Array),
							AVL_Min: JSON.parse(t.obj.chartData.AVL_min_Mil_Array),
							AVL_Max: JSON.parse(t.obj.chartData.AVL_MAX_Mil_Array),
							DOM: JSON.parse(t.obj.chartData.DOM_Mil_Array),
							IND: JSON.parse(t.obj.chartData.IND_Mil_Array),
							IRR: JSON.parse(t.obj.chartData.IRR_Mil_Array),
							LIV: JSON.parse(t.obj.chartData.LIV_Mil_Array)
						}]
						// set the max for the y axis on the graph
						// availmax
						t.availMax = Math.max.apply(Math, t.tempData[0].AVL)
						t.availMax = Math.round(t.availMax + (t.availMax * .1))
						// intermax
						t.interMax = Math.max.apply(Math, t.tempData[0].AVL_Max)
						t.interMax = Math.round(t.interMax + (t.interMax * .1))
						//work with raw max
						var rawList = t.tempData[0].DOM +',' + t.tempData[0].IND +',' + t.tempData[0].IRR +',' + t.tempData[0].LIV
						rawList = rawList.split(',');
						var newRawList = []
						$.each(rawList, lang.hitch(t,function(i, v){
							newRawList.push(Number(v));
						}));
						//raw max
						t.rawMax = Math.max.apply(Math, newRawList)
						t.rawMax = Math.round(t.rawMax + (t.rawMax * .2))
						
						// set chart options below with max value for y axis
						t.myRawChart.config.options.scales.yAxes[0].ticks.max = t.rawMax;
						t.myAvailChart.config.options.scales.yAxes[0].ticks.max = t.availMax;
						t.myAvailChart.config.options.scales.yAxes[1].ticks.max = t.availMax;
						t.myInterChart.config.options.scales.yAxes[0].ticks.max = t.interMax;
						t.myInterChart.config.options.scales.yAxes[1].ticks.max = t.interMax;
						
						// call the update chart function
						t.chartjs.updateChart(t, t.tempData);
					}
				}));
			},
			// update accordian of layout
			updateAccord: function(t){
				$( "#" + t.id + "be_mainAccord" ).accordion('refresh');	
				$( "#" + t.id +  "be_infoAccord" ).accordion('refresh');				
			},
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}			
        });
    }
)