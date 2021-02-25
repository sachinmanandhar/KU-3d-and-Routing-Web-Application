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
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {asArray} from 'ol/color';
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import RasterSource from 'ol/source/Raster';
import {Image as ImageLayer} from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import * as pano from 'panolens';
import {Icon} from 'ol/style';
import {LineString, Point} from 'ol/geom';
import {Feature} from 'ol';
import {selectFeatureControl} from 'ol/control';
import OLCesium from 'olcs/OLCesium.js';

import {easeIn, easeOut} from 'ol/easing';
 
import Shadow from 'ol-ext/style/Shadow';
import {RegularShape} from 'ol/style';
import Path from 'ol-ext/featureanimation/Path';
import * as easing from 'ol/easing'; 

//import Vue from 'vue';
//import VuePannellum from 'vue-pannellum';
//import {ImagePanorama,Viewer} from 'panolens';
const RouteDataa=require('./js/routeData');
const BuildingDataa=require('./js/buildingData');

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const panoImage=document.querySelector('#content1_1');

const panoFunction=(imagePan)=>{
  return imagePan;
  /*
	const panorama=new pano.ImagePanorama(imagePan);

 const otherPanorama=new pano.ImagePanorama(imagePan1);
 const otherPanorama1=new pano.ImagePanorama(imagePan2);

  

	const viewer=new pano.Viewer({
			container:panoImage
		});
	viewer.add(panorama);
  viewer.add(otherPanorama);
  viewer.add(otherPanorama1);

  const panoPosition2 = new Vector3(4000, 243.54, -4000 );
  const panoPosition1=new Vector3(9000, 243.54, 1000 )
  const imageScale=300;
  const imageSrc=pano.DataImage.Arrow;
panorama.link(otherPanorama,panoPosition1,500,imageSrc);
panorama.link(otherPanorama1,panoPosition2,300,imageSrc);
*/
};


/*
const panoImageIn=document.querySelector('#content1_3');

const panoFunctionInner=(imagePan)=>{
    const panorama=new pano.ImagePanorama(imagePan);
    const viewer=new pano.Viewer({
      container:panoImageIn
    });
    viewer.add(panorama);

    const infospot =new pano.Infospot(300,pano.DataImage.info);
    infospot.position.set(0,0,-5000);
    infospot.addHoverText('Office of Dean',40);
    panorama.add(infospot);

    const infospot1 =new pano.Infospot(300,pano.DataImage.info);
    infospot1.position.set(0,0,5000);
    infospot1.addHoverText('Office of Asoociate Dean',40);
    panorama.add(infospot1);

  };

	*/			


		
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
  center: [85.5386,27.6195],
  zoom: 0,
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

var StrokecolorArray = asArray('red').slice();
StrokecolorArray[3] = 0.0;

var BuildingStyle = new Style({
  fill: new Fill({
	color:'rgba(255,255,0,0.63)',
  }),
  stroke: new Stroke({
    color: StrokecolorArray,
    width: 1,
  }),
});

var color = BuildingStyle.getFill().getColor();
var colorArray = asArray(color).slice();
colorArray[3] = 0.0;
BuildingStyle.getFill().setColor(colorArray);

/*
var PointStyle = new Style({
  fill: new Fill({
	color:'rgba(0,0,255,0.9)',
  }),
  stroke: new Stroke({
    color: 'rgba(0,0,255,0.1)',
    width: 1,
  }),
});
*/
var iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'image/1.jpg',
    scale: 0.047
  }),
});

var style_selected=new Style({
  fill: new Fill({
    color: 'rgba(0,0,255,1)',
  }),
  stroke: new Stroke({
    color: 'rgba(0,0,255,1)',
    width: 3,
  }),
});
var style_route=new Style({
  fill: new Fill({
    color: 'rgba(255,0,0,0.9)',
  }),
  stroke: new Stroke({
    color: 'rgba(255,0,0,0.8)',
    width: 6,
  }),
});
var style = [
  new Style({
    image: new Shadow({
      radius: 15,
    }),
    stroke: new Stroke({
      color: [0,0,0,0.3],
      width: 2
    }),
    fill: new Fill({
      color: [0,0,0,0.3]
    }),
    zIndex: -1
  }),
  new Style({
    image: new RegularShape({
      radius: 10,
      radius2: 5,
      points: 5,
      fill: new Fill({ color: 'blue' })
    }),
    stroke: new Stroke({
      color: [0,0,255],
      width: 2
    }),
    fill: new Fill({
      color: [0,0,255,0.3]
    })
  })
];
// Offset image
style[1].getImage().getAnchor()[1] += 10

// Triangle style
var triangle = new RegularShape({
  radius: 14,
  points: 3,
  fill: new Fill({ color: '#00f' }),
  stroke: new Stroke({ color: '#fff', width: 2 })
});

  // stretch the symbol
  var c = triangle.getImage();
  var ctx = c.getContext("2d");
  var c2 = document.createElement('canvas');
  c2.width = c2.height = c.width;
  c2.getContext("2d").drawImage(c, 0,0);
  ctx.clearRect(0,0,c.width,c.height);
  ctx.drawImage(c2, 0,0, c.width, c.height, 6, 0, c.width-12, c.height);

  var styleTriangle = 
    new Style({
      image: triangle,
      stroke: new Stroke({
        color: [0,0,255],
        width: 2
      }),
      fill: new Fill({
        color: [0,0,255,0.3]
      })
    });
/*
var routeSource=new VectorSource({
    features:new GeoJSON().readFeatures(RouteDataa.routeD),
  })
 
var route=new VectorLayer({
  source: routeSource ,
 visible: true
});
*/

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'data/buildings.json',
    format: new GeoJSON(),
  }),
  style:BuildingStyle,
});

/*
vector.getProperties().source.map((data)=>{
    
    if (data.properties.Id==RouteSelect.value)
    {

    }
  });
*/


var points= new VectorLayer({
	source:new VectorSource({
		url:'data/points.geojson',
		format:new GeoJSON(),
		}),
	style:iconStyle,
		});
/*
var key = 'Get your own API key at https://www.maptiler.com/cloud/';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';		
var aerial = new XYZ({
  attributions: attributions,
  url: 'image/',
  maxZoom: 20,
  crossOrigin: '',
});


var RasterImg=new ImageLayer({
	source: new RasterSource({
		url:'image/odm_orthophoto.tif',
		
	})
});

*/
var wmsSource = new TileWMS({
  url: 'http://localhost:8080/geoserver/wms',
  params: {'LAYERS': 'Chisma:odm_orthophoto', 'TILED': true},
  serverType: 'geoserver',
});

var wmsLayer = new TileLayer({
  source: wmsSource,
});


var bingMap = new TileLayer({
  source: new BingMaps({
    key: 'AoTlmaazzog43ImdKts9HVztFzUI4PEOT0lmo2V4q7f20rfVorJGAgDREKmfQAgd',
    imagerySet: 'AerialWithLabels',
    maxZoom: 19
  }),
  zIndex:-2,
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
	/*
	var routeValue=RouteSelect.value;
	return routeValue;
	*/
				/*
			var source = layer.getSource();
			var params = source.getParams();
			params.t = new Date().getMilliseconds();
			source.updateParams(params);
			*/
var SourceV = new VectorSource({});

var layer = new VectorLayer({
    source: SourceV,
    zIndex:-1,
	style:style_route,
});

map.addLayer(layer);

  // Animation
  var path;
  SourceV.on('change',function(e){
    if (SourceV.getState() === 'ready') {
      path = SourceV.getFeatures()[0];
    }
  });

// Add a feature on the map
var f, anim;

function animateFeature(){
  console.log("Running Fuction animate Feature");
  if (path) {
    f = new Feature(new Point([0,0]));
    f.setStyle(styleTriangle);

    anim = new Path({
      path: path,
      rotate:25,
      easing: easing[easing.easeIn],
      speed: Number(0)
    });
    /** / 
    source.addFeature(f);
    anim.on('animationend', function(e)
    {	if (e.feature) source.removeFeature(e.feature);
    });
    /**/
    /** /
    anim.on('animating', (e) => {
      map.getView().setCenter(e.geom.getCoordinates())
      map.getView().setRotation(e.rotation||0)
    })
    /**/
    vector.animateFeature ( f, anim );
  }
}



const SubmitFunction=() =>
{
	var RouteSelect=document.getElementById('RouteSelectID');
	RouteDataa.routeD.features.map((data)=>{
		
		if (data.properties.Id==RouteSelect.value)
		{
			var coordinates= data.geometry.coordinates[0];
			var LineFeature = new Feature({
        			geometry: new LineString(coordinates),
        			name: 'routing'
        			});
			SourceV.clear();
			SourceV.addFeature(LineFeature);
		}
    
    
	});



  
};

 

const SearchFunction= () =>
{
  var VarSearch = document.getElementById('searchValue').value;
  BuildingDataa.BuildingD.features.map((data)=>{
    
    if (data.properties.Build_Name.toUpperCase()==VarSearch.toUpperCase())
    {
      var coordinates= data.geometry.coordinates[0];
      var LineFeature = new Feature({
              geometry: new LineString(coordinates),
              name: 'routing'
              });
      SourceV.clear();
      SourceV.addFeature(LineFeature);
    }
  });
}

var SearchSubmitBtn = document.getElementById("searchSubmitBtn");

SearchSubmitBtn.onclick = () =>
{

  SearchFunction();
};

var routeSubmitBtn = document.getElementById("routeSubmitBtn");
routeSubmitBtn.onclick = () =>
{
  
	SubmitFunction();
  animateFeature();
  topFunction();
  
};

var status1 = document.getElementById('content1_1');



map.on('click', evt => {
  SourceV.clear();
  

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

var AtrribName=select.get('Build_Name'); 
var PointName=select.get('Point_name'); 

if (AtrribName=="Block 9"){
  document.getElementById('content1_3').innerHTML='';
  const ImgFile='image/pano18.jpg';
  panoFunctionInner(ImgFile);
}
 else{
    document.getElementById('content1_3').innerHTML='Select Building to View';
  }


/*
    const Pelton_Turbine='image/pano5.jpg';
    const Block_10='image/pano8.jpg';
    const Bus_Park='image/pano1.jpg';
    const Boys_Hostel='image/pano2.jpg';
    const Civil_Department='image/pano3.jpg';
    const Fountain='image/pano4.jpg';
    const KU_gate='image/pano6.jpg';
    const Multipurpose_Hall_road='image/pano7.jpg';
    const KU_Admin='image/pano9.jpg';
    const KU_Corner='image/pano10.jpg';
    const Block_9='image/pano11.jpg';
    const inge='image/pano12.jpg';
    const ttl='image/pano13.jpg';
    const khetan='image/pano14.jpg';
    const bt='image/pano15.jpg';
    const golo_ghar='image/pano16.jpg';
    const science='image/pano17.jpg';
    const fountainii='image/pano19.jpg';
    const library='image/pano20.jpg';

  if (PointName=="Bus Park"){
	  document.getElementById('content1_1').innerHTML='';
    
	  panoFunction(Bus_Park,Boys_Hostel,Civil_Department);
	  //setTimeout(function(){ document.getElementById('one').style.display = 'inline'; }, 1000);
	  //setTimeout(function(){ document.getElementById('two').style.display = 'none'; }, 1000);
  }
  else if (PointName=="Boys Hostel") {
		document.getElementById('content1_1').innerHTML='';
	  	
	    panoFunction(Boys_Hostel,Bus_Park,Boys_Hostel);
	//setTimeout(function(){ document.getElementById('one').style.display = 'none'; }, 1000);
	//setTimeout(function(){ document.getElementById('two').style.display = 'inline'; }, 1000);
  }
   else if (PointName=="Civil Department") {
		document.getElementById('content1_1').innerHTML='';

	    panoFunction(Civil_Department,Bus_Park,Multipurpose_Hall_road);
  }
  
   else if (PointName=="Fountain") {
		document.getElementById('content1_1').innerHTML='';

	    panoFunction(Fountain,Civil_Department,Fountain);
  }
    else if (PointName=="KU gate") {
		document.getElementById('content1_1').innerHTML='';
	    panoFunction(KU_gate,KU_gate,Pelton_Turbine);
  }
    else if (PointName=="Pelton Turbine") {
		document.getElementById('content1_1').innerHTML='';
	    panoFunction(Pelton_Turbine,KU_gate,Block_10);
  }
    else if (PointName=="Multipurpose Hall road") {
		document.getElementById('content1_1').innerHTML='';

	    panoFunction(Multipurpose_Hall_road,Civil_Department,Block_10);
  }
    else if (PointName=="Block 10") {
		document.getElementById('content1_1').innerHTML='';
	    panoFunction(Block_10,Multipurpose_Hall_road,Pelton_Turbine);
  }
    else if (PointName=="KU Admin") {
		document.getElementById('content1_1').innerHTML='';
	    panoFunction(KU_Admin,KU_Admin,KU_Admin);
  }
    else if (PointName=="KU corner") {
		document.getElementById('content1_1').innerHTML='';
	    panoFunction(KU_Corner,KU_Corner,KU_Corner);
  }
      else if (PointName=="Block 9") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(Block_9,Pelton_Turbine,inge);
  }
        else if (PointName=="inge") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(inge,Block_9,ttl);
  }
          else if (PointName=="TTL") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(ttl,inge,khetan);
  }
            else if (PointName=="khetan") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(khetan,ttl,bt);
  }
  else if (PointName=="BT") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(bt,khetan,golo_ghar);
  }
    else if (PointName=="Golo Ghar") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(golo_ghar,bt,science);
  }
      else if (PointName=="science") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(science,golo_ghar,fountainii);
  }
    else if (PointName=="kufountainII") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(fountainii,science,Fountain);
  }
    else if (PointName=="library") {
    document.getElementById('content1_1').innerHTML='';
      panoFunction(library,KU_Corner,Fountain);
  }
  else{
	  document.getElementById('content1_1').innerHTML='&nbsp;';
	  //setTimeout(function(){ document.getElementById('one').style.display = 'none'; }, 1000);
	  //setTimeout(function(){ document.getElementById('two').style.display = 'none'; }, 1000);
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
	if (selected.get('Point_name')==null)
		{
	status.innerHTML = 'Building: ' +selected.get('Build_Name');
		}
	else if (selected.get('Build_Name')==null)
		{
		status.innerHTML = 'Point: ' +selected.get('Point_name');
		}
	

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

const ol3d = new OLCesium({map: map}); // map is the ol.Map instance

ol3d.setEnabled(true);

var KU=[85.53853,27.61946]

    function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
    }

onClick('pan-to-KU', function () {
      view.animate({
      center: KU,
      duration: 2000,

      zoom:17,
      });
    ol3d.setEnabled(false);
    document.querySelector(".cesiumlogoOverlay").style.display = "none";
    

    });   
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
/*
document.querySelector('#show-modal')
    .addEventListener('click',toggleModal);
  */