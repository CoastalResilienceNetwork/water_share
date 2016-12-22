define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, lang, on, $, ui) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					// Start with empty expressions
					t.standingc = ""; 
					t.forloss = "";
					t.refor = "";
					t.freshbiot = "";
					t.terrsp = "";
					t.vita = "";
					t.agloss = "";
					t.nitrogen = "";
					t.clicks.layerDefsUpdate(t);
					t.map.setMapCursor("pointer");
				}));
				
				// set the initial visible layers on app load
				t.obj.visibleLayers = [14];
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				
				// selection symbolgy for category layer
				var catSym = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 2 ), new Color([0,0,0,0.1])
				);
				// set category layer
				t.category = new FeatureLayer(t.url + "/0", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.category.setSelectionSymbol(catSym);
				// set depletion layer
				
				// set profile layer
				
				// on map click
				t.map.on("click", lang.hitch(t, function(evt) {
					var pnt = evt.mapPoint;
					var q = new Query();
					q.geometry = pnt;
					t.category.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				}));
				// zoom end 
				t.map.on("zoom-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));
				// update end
				t.map.on("update-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));				
			}
		});
    }
);