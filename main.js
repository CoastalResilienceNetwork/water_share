// Pull in your favorite version of jquery 
require({ 
	packages: [{ name: "jquery", location: "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/", main: "jquery.min" }] 
});
// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
	"dojo/_base/declare", "framework/PluginBase", "dijit/layout/ContentPane", "dojo/dom", "dojo/dom-style", "dojo/dom-geometry", "dojo/_base/lang", "dojo/text!./obj.json", 
	"jquery", "dojo/text!./html/content.html", './js/jquery-ui-1.11.2/jquery-ui', './js/esriapi', './js/clicks', './js/chartjs', './js/barChart', './js/horizontalBar'
],
function ( 	declare, PluginBase, ContentPane, dom, domStyle, domGeom, lang, obj, 
			$, content, ui, esriapi, clicks, chartjs, barChart, hbar ) {
	return declare(PluginBase, {
		// The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
		toolbarName: "Water Scarcity Explorer", showServiceLayersInLegend: true, allowIdentifyWhenActive: false, rendered: false, resizable: false,
		hasCustomPrint: true, usePrintPreviewMap: true, previewMapSize: [1000, 550], size:'custom', width:460,	
		// First function called when the user clicks the pluging icon. 
		initialize: function (frameworkParameters){
			// Access framework parameters
			declare.safeMixin(this, frameworkParameters);
			// Define object to access global variables from JSON object. Only add variables to varObject.json that are needed by Save and Share. 
			this.obj = dojo.eval("[" + obj + "]")[0];	
			this.url = "http://dev.services2.coastalresilience.org:6080/arcgis/rest/services/Water_Blueprint/water_share/MapServer";
			this.layerDefs = [];
		},
		// Called after initialize at plugin startup (why all the tests for undefined). Also called after deactivate when user closes app by clicking X. 
		hibernate: function () {
			if (this.appDiv != undefined){
				this.map.removeLayer(this.dynamicLayer);
			}
			this.open = "no";
		},
		// Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.   
		activate: function () {
			if (this.rendered == false) {
				this.rendered = true;							
				this.render();
				// Hide the print button until a hex has been selected
				$(this.printButton).hide();
			}else{
				this.map.addLayer(this.dynamicLayer);
			}	
			this.open = "yes";
		},
		// Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
		deactivate: function () {
			if (this.appDiv != undefined){
				$('#' + this.yearID).hide();
				this.map.removeLayer(this.dynamicLayer);
			}
			this.open = "no";
		},	
		// Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON. 
		// Write anything to you varObject.json file you have tracked during user activity.		
		getState: function () {
			this.obj.extent = this.map.geographicExtent;
			this.obj.stateSet = "yes";	
			var state = new Object();
			state = this.obj;
			return state;	
		},
		// Called before activate only when plugin is started from a getState url. 
		//It's overwrites the default JSON definfed in initialize with the saved stae JSON.
		setState: function (state) {
			this.obj = state;
		},
		// Called when the user hits the print icon
		beforePrint: function(printDeferred, $printArea, mapObject) {
			printDeferred.resolve();
		},	
		// Called by activate and builds the plugins elements and functions
		render: function() {
			// BRING IN OTHER JS FILES
			this.barChart = new barChart();
			this.hbar = new hbar();
			this.esriapi = new esriapi();
			this.clicks = new clicks();
			this.chartjs = new chartjs();
			// ADD HTML TO APP
			// Define Content Pane as HTML parent		
			this.appDiv = new ContentPane({style:'padding:0; color:#000; flex:1; display:flex; flex-direction:column;}'});
			
			this.id = this.appDiv.id
			$(dom.byId(this.container)).addClass('dflex')
			dom.byId(this.container).appendChild(this.appDiv.domNode);					
			// Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
			var idUpdate = content.replace(/id='/g, "id='" + this.id);	
			$('#' + this.id).html(idUpdate);
			
			
			// add this.yearDiv like above and add styling 
			this.yearDiv = new ContentPane({style:'display:none; padding:0; color:#000; opacity: 0.9; margin-right:145px; flex:1; z-index:1000; position: absolute; top: 27px; left: 50%; text-align:center; border-radius:1px; -moz-box-shadow:0 1px 2px rgba(0,0,0,0.5); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.5); box-shadow: 0 1px 2px rgba(0,0,0,0.5); }'});
			this.yearID = this.yearDiv.id;
			dom.byId('map-0').appendChild(this.yearDiv.domNode);
			//
			$('#' + this.yearID).html('<div class="sh_yearMapText" id="yearMapText"></div>');
			// $('#map-0').append()
			// CREATE ESRI OBJECTS AND EVENT LISTENERS	
			this.esriapi.esriApiFunctions(this);
			// Click listeners
			this.clicks.clickListener(this);
			// set up chartjs charts
			this.chartjs.createChart(this);
			this.rendered = true;	
		}
	});
});
