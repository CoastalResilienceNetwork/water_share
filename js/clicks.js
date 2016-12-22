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
				}));
				
				// click on depletion header 
				$('#' + t.id + 'depHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'depHeader').next().is(':hidden')){
					}
				}));
				// click on catagory header 
				$('#' + t.id + 'catHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'catHeader').next().is(':hidden')){
						t.obj.visibleLayers = [0];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						
						t.map.addLayer(t.category);
						t.clicks.categorySelComplete(t);
					}
				}));
				// click on profile header
				$('#' + t.id + 'proHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'proHeader').next().is(':hidden')){
					}
				}));
				
				// SET UP SLIDER AND ADD EVENT LISTENER //////////////////
				var vals = 13;
				var labels = ['1900','1910s','1940s', '1962', '1970s', '1985-6', '1994', '2002', '2004', '2006', '2009', '2011', '2013', '2014'];
				for (var i = 0; i <= vals; i++) {
					var el = $('<label>'+(labels[i])+'</label>').css('left',(i/vals*100)+'%');
					$('#' + t.id + 'sh_multiYearSlider').append(el);
				}
				
				// fire when the multi year slider is changed
				// year range slider
				$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:14, slide:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// use the below if you want the slide event to fire only after you are done with the slide
				//$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:14, change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				
				$('#' + t.id + 'sh_multiYearSlider').on('slide', lang.hitch(this,function(w,evt){
					t.obj.sliderYear = labels[evt.value];
					t.obj.sliderYearQuery = "CRToolDate = '" + t.obj.sliderYear + "'";
					t.clicks.setSliderYear(t);
					if (t.sliderPlayBtn  == 'play'){
						t.sliderPlayBtn  == ''
						$('#' + t.id + 'sliderStop').trigger('click');
					}
				}));
				
				// slider play button click
				$('#' + t.id + 'sh_sliderPlay').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sh_sliderPlay').addClass('sh_hide');
					$('#' + t.id + 'sh_sliderStop').removeClass('sh_hide');
					t.sliderPlayBtn  = 'play' 
					t.setInt = setInterval(function(){
						//$('#' + t.id + 'multiShoreSlider').slider('value',t.obj.sliderCounter);
						//t.obj.sliderYear = labels[t.obj.sliderCounter];
						//t.obj.sliderYearQuery = "CRToolDate = '" + t.obj.sliderYear + "'";
						// t.clicks.setSliderYear(t);
						// t.obj.sliderCounter++
						// if(t.obj.sliderCounter>13){
							// t.obj.sliderCounter = 0
						// }
					}, 100);
				}));
				//slider stop button click
				$('#' + t.id + 'sh_sliderStop').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sh_sliderPlay').removeClass('sh_hide');
					$('#' + t.id + 'sh_sliderStop').addClass('sh_hide');
					clearInterval(t.setInt);
					t.sliderPlayBtn  = '';
				}));
				
				
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
			},
			
			// build chart on selection complete
			categorySelComplete: function(t){
				t.category.on('selection-complete', lang.hitch(t,function(evt){
					if (evt.features.length > 0){
						
						// retrieve attribute data
						t.obj.chartData = evt.features[0].attributes;
						// data for the chart, parse the data
						t.chartData = [{
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
						t.availMax = Math.max.apply(Math, t.chartData[0].AVL)
						t.availMax = Math.round(t.availMax + (t.availMax * .2))
						// intermax
						t.interMax = Math.max.apply(Math, t.chartData[0].AVL_Max)
						t.interMax = Math.round(t.interMax + (t.interMax * .2))
						
						//work with raw max
						var rawMaxArray = [0,1,2,3,4,5,6,7,8,9,10,11];
						var y = 0;
						var x = 0;
						$.each(rawMaxArray, lang.hitch(t,function(i, v){
							x = t.chartData[0].DOM[i] + t.chartData[0].IND[i] + t.chartData[0].IRR[i] + t.chartData[0].LIV[i]
							if( x > y ) { y = x }
						}));
						t.rawMax = y;
						
						//raw max
						t.rawMax = Math.round(t.rawMax + (t.rawMax * .2))
						// logic if availemax is less than raw max
						if(t.availMax < t.rawMax){
							t.availMax = t.rawMax;
						}
						// 
						if(t.interMax < t.rawMax || t.interMax < t.availMax){
							t.interMax = Math.max.apply(Math, [t.rawMax ,t.availMax]);
						}
						
						// handle the trigger for show and click the raw button
						$('#' + t.id + 'sh_rWrap').show();
						$('#' + t.id + 'sh_chartWrap').slideDown();
						
						$('#' + t.id + 'sh_chartUnits').slideUp();
						$('#' + t.id + 'sh_rawBtn').trigger('click')
					}else{
						// hide graph elements when no target has been hit on click
						$('#' + t.id + 'sh_chartWrap').slideUp();
						$('#' + t.id + 'sh_chartUnits').slideDown();
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