// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function getRadius(mag)
  {
    if (mag == 0)
    {
      return 1;
    }
    return mag*4;
  }
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  function styleinfo(feature)
  {
    return {
      opacity:1,
      fillOpacity:1,
      fillColor:getColor(feature.properties.mag),
      color:"#000",
      radius:getRadius(feature.properties.mag),
      stroke:true,
      weight:0.5
    }
  }

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) +  "</p> <hr> <h3> Magnitute : " + feature.properties.mag + "</h3>"  );
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: onEachFeature,
    style : styleinfo


  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
  function getColors(d) {
    return d > 5 ? '#800026' :
           d > 4  ? '#BD0026' :
           d > 3  ? '#E31A1C' :
           d > 2  ? '#FC4E2A' :
           d > 1   ? '#FD8D3C' :
           d >   0 ? '#FEB24C' :
                     '#FFEDA0';
}
  var grades = [0, 1, 2, 3, 4, 5];
   var colors = [
     "#98ee00",
     "#d4ee00",
     "#eecc00",
     "#ee9c00",
     "#ea822c",
     "#ea2c2c"
   ];
  // var temp = ["gsajdhgsjk","jsadjhsajhgd","jshdjhsdjshjhgds","jsgdjkhgsajkd","ysdusyudd"];
var legend = L.control({
   position: "bottomright"
 });

 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
for (var i = 0; i < grades.length; i++) {
     div.innerHTML +=
     '<i style="background:' + colors[i] + '"></i> '   + 
       grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
   }
   return div;
 };

 legend.addTo(myMap);
};

