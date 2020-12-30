import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import {Tile,Vector as VectorLayer} from 'ol/layer';
import {TileWMS, BingMaps} from 'ol/source';
import {Group} from 'ol/layer';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {asArray} from 'ol/color';
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';


		
const toggleModal =() =>{
		document.querySelector('.modal')
		.classList.toggle('modal--hidden');
	};
/*
document.querySelector('#show-modal')
		.addEventListener('click',toggleModal);
	*/
document.querySelector('#more')
		.addEventListener('submit',(event)=>{
			event.preventDefault();	
toggleModal();
		});
		
document.querySelector('.modal_close-bar span')
		.addEventListener('click',toggleModal);
		
var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'MouseCord',
  target: document.getElementById('MouseCord'),
  undefinedHTML: '&nbsp;',
});
var view = new View({
  projection:'EPSG:4326',
  center: [85.538044,27.618896],
  zoom: 18,
});
var highlightStyle = new Style({
  fill: new Fill({
    color: 'rgba(255,255,255,0.7)',
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 3,
  }),
});

var BuildingStyle = new Style({
  fill: new Fill({
	color:'rgba(255,255,0,0.63)',
  }),
  stroke: new Stroke({
    color: 'red',
    width: 1,
  }),
});

var color = BuildingStyle.getFill().getColor();
var colorArray = asArray(color).slice();
colorArray[3] = 0.0;
BuildingStyle.getFill().setColor(colorArray);

var style_selected=new Style({
  fill: new Fill({
    color: 'rgba(25,255,55,0.7)',
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 3,
  }),
});

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'data/buildings.json',
    format: new GeoJSON(),
  }),
  style:BuildingStyle,
});

var points= new VectorLayer({
	source:new VectorSource({
		url:'data/point.json',
		format:new GeoJSON(),
		})
		});
/*
var wmsSource = new TileWMS({
  url: 'http://localhost:8080/geoserver/wms',
  params: {'LAYERS': 'Chisma:new_shapefile', 'TILED': true},
  serverType: 'geoserver',
  crossOrigin: 'anonymous',
});

var wmsLayer = new TileLayer({
  source: wmsSource,
});
*/

var bingMap = new TileLayer({
      source: new BingMaps({
		key: 'AoTlmaazzog43ImdKts9HVztFzUI4PEOT0lmo2V4q7f20rfVorJGAgDREKmfQAgd',
		imagerySet: 'AerialWithLabels',
		maxZoom: 19
			})
    })
var map = new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'degrees',
    }),mousePositionControl ]),
  target: 'map',
  layers: [bingMap,vector,points],
  view: view,
  
});


var status1 = document.getElementById('content1_1');

map.on('click', evt => {
  setTimeout(function(){ document.getElementById('my_image').style.display = 'inline'; }, 3000);
  var select = null; // ref to currently selected interaction

var selectClick = new Select({
  condition: click,
  style: style_selected,
});

var changeInteraction = function () {
  if (select !== null) {
    map.removeInteraction(select);
  }

    select = selectClick;

  if (select !== null) {
    map.addInteraction(select);
  }
};

changeInteraction();

 map.forEachFeatureAtPixel(evt.pixel, function (f) {
    select = f;
    return true;
  });
var AtrribName=select.get('name'); 
  if (select) {
	
	status1.innerHTML = '&nbsp;Selected: ' + AtrribName;
	
  } else {

    status1.innerHTML = '&nbsp;Nothing Selected';

  }
  /*
  if (AtrribName="KU Boys Hostel"){
	  document.getElementById("one").style.display = "block";
  }
  else{
	  document.getElementById("one").style.display = "none";
  }
  */
})


var selected = null;
var status = document.getElementById('content1_2');


map.on('pointermove', function (e) {
  if (selected !== null) {
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    return true;
  });
  if (selected) {
	status.innerHTML = '&nbsp;Hovering: ' + selected.get('name');

  } else {
    status.innerHTML = '&nbsp;';
	
  }
});

 


map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function () {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}); 




