define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', "dojo/dom",
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, dom ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
// Build and work with choosen menu in the profile section /////////////////////////////////////////////////////////////////				
				// Enable jquery plugin 'chosen'
				require(["jquery", "plugins/water_share/js/chosen.jquery"],lang.hitch(t,function($) {
					var configCrs =  { '.chosen-crs' : {allow_single_deselect:true, width:"200px", disable_search:false}}
					for (var selector in configCrs)  { $(selector).chosen(configCrs[selector]); }
				}));
				// Use selections on chosen menus
				require(["jquery", "plugins/water_share/js/chosen.jquery"],lang.hitch(t,function($) {
					//Select Huc8
					$('#' + t.id + 'ch-pro').chosen().change(lang.hitch(t,function(c, p){
							t.map.graphics.clear()
							t.profile.clear();
						if(p){
							t.profileName = $('#' + t.id + 'ch-pro').val()
							$('#' + t.id + 'profileName').html('Water Market Case Study: ' + t.profileName)
							$('#' + t.id + 'profileName').slideDown();
							$('#' + t.id + 'profileAttWrap').slideDown();
							var q = new Query();
							q.where = "Name = '"+t.profileName +"'";
							t.profileDD.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						}else{
							t.map.graphics.clear()
							t.profile.clear();
							$('#' + t.id + 'profileName').slideUp();
							$('#' + t.id + 'profileAttWrap').slideUp();
						}
					}));
				}));
// Profile selection complete //////////////////////////////////////////////////////////////////////////////////////////
				t.profile.on('selection-complete', lang.hitch(t,function(evt){
					//t.initExtent = t.map.extent;
					if(evt.features.length > 0){
						t.profileNameClick = evt.features[0].attributes.Name;
						var p = 'p'
						$('#' + t.id + 'ch-pro').val(t.profileNameClick).trigger('chosen:updated').trigger('change', p);
					}else{
						t.map.graphics.clear()
						t.profile.clear();
						t.profileDD.clear();
						$('#' + t.id + 'ch-pro').val('').trigger('chosen:updated').trigger('change');
					}
				}));
				// t.proWhere = "Name = '" + t.profileName + "'";
				// var btnText = 'Zoom to Profile';
				// var btnTextBack = 'Back';
				// t.clicks.zoomBackBtn(t, 'zoomToProfile', t.profile, t.proWhere,btnText, btnTextBack);
// Build innit chart labels //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// set init val
				t.monthYearClick = 'month'
				t.chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
				//make accrodians
				$( function() {
					$( "#" + t.id + "be_mainAccord" ).accordion({heightStyle: "fill"}); 
					$( "#" + t.id + "be_infoAccord" ).accordion({heightStyle: "fill"});
				});
// Work with accordian code when click on a part of the accordian or on map resize///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// Work with Info Icon clicks ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// info icon clicks
				$('#' + t.id + ' .be_minfo').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'be_mainAccord').hide();
					$('#' + t.id + 'be_infoAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').show();
					var ben = c.target.id.split("-").pop();
					t.clicks.updateAccord(t);	
					$('#' + t.id + 'be_infoAccord .' + ben).trigger('click');
				}));		
// Depletion, category, and profile header clicks //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
				// click on depletion header 
				$('#' + t.id + 'depHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'depHeader').next().is(':hidden')){
						t.obj.visibleLayers = [14];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
				}));
				// click on catagory header 
				$('#' + t.id + 'catHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'catHeader').next().is(':hidden')){
						t.obj.visibleLayers = [0];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						t.map.addLayer(t.category);
						t.map.removeLayer(t.profile)
						// trigger click on stop button to stop animation if its going.
						$('#' + t.id + 'sh_sliderStop').trigger('click');
						$('#' + t.id + 'sh_monthlyBtn').addClass('sh_togBtnSel');
						t.clicks.categorySelComplete(t);
					}
				}));
				// click on profile header
				$('#' + t.id + 'proHeader').on('click',lang.hitch(t,function(c){
					if($('#' + t.id + 'proHeader').next().is(':hidden')){
						t.obj.visibleLayers = [1];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						t.map.addLayer(t.profile);
						t.map.addLayer(t.profileDD);
						t.map.removeLayer(t.category);
						
					}
				}));
				
// Work with depletion slider and event listener //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// SET UP SLIDER AND ADD EVENT LISTENER //////////////////
				var vals = 13;
				t.labels = ['1900','1910','1920', '1930', '1940', '1950', '1960', '1970', '1980', '1985', '1990', '1995', '2000', '2005'];
				for (var i = 0; i <= vals; i++) {
					var el = $('<label>'+(t.labels[i])+'</label>').css('left',(i/vals*100)+'%');
					$('#' + t.id + 'sh_multiYearSlider').append(el);
				}
				// year range slider
				$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:13,value:0, step:1});
				// use the below if you want the slide event to fire only after you are done with the slide
				//$('#' + t.id + 'sh_multiYearSlider').slider({range:false, min:0, max:14, change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				
				$('#' + t.id + 'sh_multiYearSlider').on('slide', lang.hitch(t,function(w,evt){
					t.obj.sliderCounter = evt.value;
					t.clicks.updateSlider(t);
					$('#' + t.yearID).html('<div class="sh_yearMapText" id="yearMapText">' + t.labels[t.obj.sliderCounter] + '</div>');
					if (t.sliderPlayBtn  == 'play'){
						t.sliderPlayBtn  == ''
						$('#' + t.id + 'sliderStop').trigger('click');
					}
				}));
				// slider play button click
				$('#' + t.id + 'sh_sliderPlay').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sh_sliderPlay').addClass('sh_hide');
					$('#' + t.id + 'sh_sliderStop').removeClass('sh_hide');
					// show year text
					$('#' + t.yearID).show();
					//$('#' + this.yearID).html('<div id="yearMapText">test year update</div>');
					t.sliderPlayBtn  = 'play' 
					t.setInt = setInterval(function(){
						$('#' + t.yearID).html('<div class="sh_yearMapText" id="yearMapText">' + t.labels[t.obj.sliderCounter] + '</div>');
						$('#' + t.id + 'sh_multiYearSlider').slider('value',t.obj.sliderCounter);
						t.clicks.updateSlider(t);
						t.obj.sliderCounter++
						if(t.obj.sliderCounter>13){
							t.obj.sliderCounter = 0
						}
					}, 1000);
				}));
				//slider stop button click
				$('#' + t.id + 'sh_sliderStop').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sh_sliderPlay').removeClass('sh_hide');
					$('#' + t.id + 'sh_sliderStop').addClass('sh_hide');
					// hide year text
					$('#' + t.yearID).hide();
					
					clearInterval(t.setInt);
					t.sliderPlayBtn  = '';
					t.obj.sliderCounter = 0;
					$('#' + t.id + 'sh_multiYearSlider').slider('value',t.obj.sliderCounter);
					$('#' + t.yearID).html('<div class="sh_yearMapText" id="yearMapText">1900</div>');
				}));
				
				
			},
			
// Build chart for category section ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// build chart on selection complete
			categorySelComplete: function(t){
				t.category.on('selection-complete', lang.hitch(t,function(evt){
					if (evt.features.length > 0){
						t.initExtent = t.map.extent;
						t.atts = evt.features[0].attributes;
						// call zoom back button function in the water catagory area.
						t.where = "subBas_ID = " + t.atts.subBas_ID;
						var btnText = ' Zoom';
						var btnTextBack = ' Back'
						t.clicks.zoomBackBtn(t, 'zoomToFund', t.category, t.where, btnText, btnTextBack);
						
						$('#' + t.id + 'sh_attributeWrap .sh_attSpan').each(lang.hitch(t,function(i,v){
							var field = v.id.split("-").pop();
							var val = t.atts[field];
							if ( isNaN(val) == false ){
								if (field != 'subBas_ID'){
									if (val == -99){
										val = "No Data"
									}else{	
										val = Math.round(val);
										val = t.esriapi.commaSeparateNumber(val);
									}	
								}	
							}	
							$('#' + v.id).html(val);
						}));
						console.log(t.zoomTo, 'zoom to')
						if (t.zoomTo == 'yes'){
							console.log('if')
							var fExt = evt.features[0].geometry.getExtent().expand(1.5);	
							t.map.setExtent(fExt, true);
							t.zoomTo = 'no';
							//
						}else{	
							console.log('else')
							t.map.setExtent(t.initExtent, true);
							//t.esriapi.waterFundAttributeBuilder(evt,t);
						}	
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
							LIV: JSON.parse(t.obj.chartData.LIV_Mil_Array),
							Year: JSON.parse(t.obj.chartData.monthlyArrayMil)
						}]
						// set the max for the y axis on the graph
						// availmax
						t.availMax = Math.max.apply(Math, t.chartData[0].AVL)
						t.availMax = Math.round(t.availMax + (t.availMax * .1))
						// intermax
						t.interMax = Math.max.apply(Math, t.chartData[0].AVL_Max)
						t.interMax = Math.round(t.interMax + (t.interMax * .1))
						// yearmax
						t.yearMax = Math.max.apply(Math, t.chartData[0].Year)
						t.yearMax = Math.round(t.yearMax + (t.yearMax * .1))
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
						// logic if availemax is less than raw max
						if(t.availMax < t.rawMax){
							t.availMax = t.rawMax;
						}
						// 
						if(t.interMax < t.rawMax || t.interMax < t.availMax){
							t.interMax = Math.max.apply(Math, [t.rawMax ,t.availMax]);
						}
						// round up the max numbers
						t.rawMax = t.clicks.maxNumberRound(t.rawMax);
						t.availMax = t.clicks.maxNumberRound(t.availMax);
						t.interMax = t.clicks.maxNumberRound(t.interMax);
						//t.yearMax = t.clicks.maxNumberRound(t.yearMax);
						
						// handle the trigger for show and click the raw button
						$('#' + t.id + 'sh_rWrap').show();
						$('#' + t.id + 'sh_chartWrap').slideDown();
						
						$('#' + t.id + 'sh_chartUnits').slideUp();
						// check to see what button year or month was clicked then trigger clicks
						if(t.monthYearClick == 'month'){
							$('#' + t.id + 'sh_rawBtn').trigger('click')
						}else{
							$('#' + t.id + 'sh_yearlyBtn').trigger('click')
						}
						// build chart labels
						t.chartLabels = [];
						$.each(t.chartData[0].Year, lang.hitch(t,function(i, v){
							t.chartLabels.push('');
						}));

						
						
					}else{
						// hide graph elements when no target has been hit on click
						$('#' + t.id + 'sh_chartWrap').slideUp();
						$('#' + t.id + 'sh_chartUnits').slideDown();
					}
					
				}));
			},
// Max Number round function /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			maxNumberRound: function(num){
				if(num< 1){
					num = Math.ceil(num/.2)*.2;
				}
				else if(num> 1 && num<6){
					num = Math.ceil(num/2)*2;
				}
				else if(num> 6 && num<11){
					num = Math.round(num + (num * .25))
					num = Math.ceil(num/2)*2;
				}
				else if(num> 11 && num<=50){
					num = Math.round(num + (num * .5))
					num = Math.ceil(num/5)*5;
				}
				else if(num>= 51 && num<=100){
					num = Math.round(num + (num * .25))
					num = Math.ceil(num/10)*10;
				}
				else if(num>= 101 && num<=500){
					num = Math.round(num + (num * .20))
					num = Math.ceil(num/50)*50;
				}
				else if(num>= 501 && num<=1000){
					num = Math.round(num + (num * .15))
					num = Math.ceil(num/50)*50;
				}
				else if(num>= 1001){
					num = Math.round(num + (num * .1))
					num = Math.ceil(num/500)*500;
				}
				return num
			},
// update slider function //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			updateSlider: function(t){
				$.each(t.layersArray, lang.hitch(t,function(i, v){
					var val = t.labels[t.obj.sliderCounter]
					var lyrName = v.name.split(" - ").pop()
					if(val == lyrName){
						t.yearLyrId = v.id
					}
				}));
				t.obj.visibleLayers = [t.yearLyrId];
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
			},
// Zoom/back function used in multiple areas ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			zoomBackBtn: function(t, id, featureLayer, where, btnText, btnTextBack){
				// Zoom to water fund click
				$('#' + t.id + id).on('click',lang.hitch(t,function(){
					console.log('zoom')
					if($('#' + t.id + id).html() == btnText){
						t.zoomTo =  'yes';	
						var q = new Query();
						q.where = where;
						featureLayer.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW)
						$('#' + t.id + id).html(btnTextBack);
					}else{
						console.log('back')
						t.zoomTo = 'no'
						console.log(t.initExtent);
						t.map.setExtent(t.initExtent, true);
						$('#' + t.id + id).html(btnText);
					}
				}));
			},
			// update accordian of layout
			updateAccord: function(t){
				$( "#" + t.id + "be_mainAccord" ).accordion('refresh');	
				$( "#" + t.id +  "be_infoAccord" ).accordion('refresh');				
			},
			// number with comma function
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
        });
    }
)