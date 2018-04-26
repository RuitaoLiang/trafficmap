
/* -----------
Mapbox Demo demo.
Visualizing 45,716 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// API Key for Mapbox. Get one here:
// https://www.mapbox.com/studio/account/tokens/
var traffic;
function preload() {

  var url = 'http://dev.virtualearth.net/REST/v1/Traffic/Incidents/19,-120,40,-90?key=AsfWWamX-dOtdQ4_PpPDDSkSmLVT0_f5ZnA4J9N6dyNnz2G8HaiV1WDlpKrTNktM';//+'summary/all_day.geojson';
	
  
  traffic = loadJSON(url);
}
var key = 'pk.eyJ1IjoiYmVsbGF0b3Rvcm8iLCJhIjoiY2pmdjlpdXhtMGV4bzM0bGJhcXYyeTVsNiJ9.BIv4jeGZCK5PlVD19A8EbQ';

// Options for map
var options = {
  lat: 0,
  lng: 0,
  zoom: 4,
  studio: true, // false to use non studio styles
  //style: 'mapbox.dark' //streets, outdoors, light, dark, satellite (for nonstudio)
  style: 'mapbox://styles/mapbox/traffic-night-v2'
}

// Create an instance of Mapbox
var mappa = new Mappa('Mapbox', key);
var myMap;

var canvas;
var meteorites;

var trafficPosition;

function setup() {
  print("running setup!");  
  // print(traffic);

  canvas = createCanvas(600, 300);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // Load the data

  trafficPosition = traffic.resourceSets[0].resources;
  
  
  myMap.onChange(drawtrafficPosition);

  fill(109, 255, 0);
  stroke(100);
  
}

// The draw loop is fully functional but we are not using it for now.
function draw() {}

function drawtrafficPosition() {
  // Clear the canvas
  clear();
  // print(trafficPosition);

  for (var i = 0; i < trafficPosition.length; i++) {
    // Get the lat/lng of each meteorite 
    var latitude = Number(trafficPosition[i].point.coordinates[0]);
    var longitude = Number(trafficPosition[i].point.coordinates[1]);

    print("traffic incident at "+latitude+", "+longitude);
    
    // Only draw them if the position is inside the current map bounds. We use a
    // Mapbox method to check if the lat and lng are contain inside the current
    // map. This way we draw just what we are going to see and not everything. See
    // getBounds() in https://www.mapbox.com/mapbox.js/api/v3.1.1/l-latlngbounds/
    if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      var pos = myMap.latLngToPixel(latitude, longitude);
      // Get the size of the meteorite and map it. 60000000 is the mass of the largest
      // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
      var size = 10; //trafficPosition.getString(i, 'mass (g)');
      size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      ellipse(pos.x, pos.y, size, size);
    }
  }
}