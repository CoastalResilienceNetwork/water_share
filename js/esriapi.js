define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, lang, on, $, ui) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){
				// define dynamic layer numbers
				t.selectedBasin = 0;
				t.selectedProfile = 2;
				t.layerDefinitions = [];
// build the dropdown menu for the profiles section with the code below. ////////////////////////////////////////////////////////////////////
				var queryTask = new QueryTask(t.url + "/3")
				var query = new Query();
				query.returnGeometry = false;
				query.where = "OBJECTID > -1"
				queryTask.execute(query, lang.hitch(t, function(results){
					var profiles = [];
					$.each(results.features,lang.hitch(this, function(i,v){
						profiles.push(v.attributes.name)
					}));
					profiles.sort()
					$('#' + t.id + 'ch-pro').empty();
					$('#' + t.id + 'ch-pro').append("<option value=''></option>")
					$.each(profiles, lang.hitch(this, function(i,v){
						$('#' + t.id + 'ch-pro').append("<option value='" + v + "'>" + v + "</option>")
					})); 
					$('#' + t.id + 'ch-pro').trigger("chosen:updated");
				}));
					
// Add dynamic map service ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					// Start with empty expressions
					t.map.setMapCursor("pointer");
					
// State set work on dynamic layer load ///////////////////////////////////////////////////////////////////////////////////////////////////////////
					if (t.obj.stateSet == "yes"){
						if(t.obj.accordActive == 1){
							t.obj.selectedProWhere = '';
						} else if(t.obj.accordActive == 2){
							t.obj.selectedBasinWhere = ''
						}else{
							t.obj.selectedProWhere = '';
							t.obj.selectedBasinWhere = ''
						}
						// accordion visibility
						$('#' + t.id + t.obj.accordVisible).show();
						$('#' + t.id + t.obj.accordHidden).hide();
						$('#' + t.id + 'getHelpBtn').html(t.obj.buttonText);
						t.clicks.updateAccord(t);
						$('#' + t.id + t.obj.accordVisible).accordion( "option", "active", t.obj.accordActive );

						// work with depletion section button
						if(t.obj.sliderPlayBtn == 'play'){
							$('#' + t.id + 'sliderPlay').trigger('click');
						}
						// Work with cat section in save and share
						t.clicks.categorySelComplete(t);
						// save and share category section
						if (t.obj.selectedBasinWhere.length > 0){
							var q = new Query();
							q.where = t.obj.selectedBasinWhere;
							t.category.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						} 
						// save and share profile section
						if(t.obj.selectedProWhere.length > 0){
							var q = new Query();
							q.where = t.obj.selectedProWhere;
							t.profileDD.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
							$('#' + t.id + 'ch-pro').val(t.obj.profileName).trigger('chosen:updated').trigger('change', p);
						}
						t.layerDefinitions[0] = t.obj.selectedBasinWhere;
						t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
						// Update the visible layers from set state vis layers
						t.dynamicLayer.setVisibleLayers(t.obj.setStateVisLayers);
						t.obj.stateSet = "no";
					}else{
						// set the initial visible layers on app load
						t.obj.visibleLayers = [5];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						//t.clicks.layerDefsUpdate(t);
					}
				}));
// Work with feature layers and map clicks //////////////////////////////////////////////////////////////////////////////////////////////////////////				
				// set category layer
				t.category = new FeatureLayer(t.url + "/0", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// set profile layer
				t.profile = new FeatureLayer(t.url + "/2", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// set profile dropdown layer
				t.profileDD = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				
				$('#' + t.id + 'getHelpBtn').on('click',lang.hitch(t,function(){
					var initHtml = $('#' + t.id + 'getHelpBtn').html();
					if(initHtml == 'Start Using Water Scarcity Explorer'){
						t.obj.visibleLayers = [17];
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
				}));
				
				// on map click
				t.map.on("click", lang.hitch(t, function(evt) {
					if (t.open == "yes"){	
						t.obj.pnt = evt.mapPoint;
						var q = new Query();
						q.geometry = t.obj.pnt;
						if(t.obj.accordSection == 'cat'){
							t.category.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						} else if (t.obj.accordSection == 'pro'){
							t.profile.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						}else{
							'do nothing here'
						}
					}	
				}));
				// zoom end 
				t.map.on("zoom-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));
				// update end
				t.map.on("update-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));				
			},
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			}
		});
    }
);
