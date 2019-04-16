// Set URL for JSON Data File
var Quake_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create Earthquake Layer
var earthquakes = new L.LayerGroup();

// Pull JSON Data and Create Markers
d3.json(Quake_URL, function (data) {
    L.geoJSON(data.features, {
        pointToLayer: function (geoPoint, latlng) {
            return L.circleMarker(latlng, { radius: circleSize(geoPoint.properties.mag) });
        },

        // Set Marker Style
        style: function (geoFeature) {
            return {
                fillColor: circleColor(geoFeature.properties.mag),
                fillOpacity: 0.8,
                weight: 0.1,
                color: 'black'

            }
        },

        // Populate Markers and Set Tooltip Info
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) +
                "</h3><hr><p>" + feature.properties.mag + "</p>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

// Size Function
function circleSize(magSize) {
    return magSize * 6;
};

// Color Function
function circleColor(magColor) {
    if (magColor > 5) {
        return 'red'
    } else if (magColor > 4) {
        return 'orangered'
    } else if (magColor > 3) {
        return 'coral'
    } else if (magColor > 2) {
        return 'gold'
    } else if (magColor > 1) {
        return 'yellow'
    } else {
        return 'lightgreen'
    }
};

// Create Map Function
function createMap(earthquakes) {

    // Define Title Layers
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

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define baseMaps
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Light Map": lightmap  
    };

    // Create Overlay
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create Map
    var myMap = L.map("map-id", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create Layer Control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create Legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:6px'>Magnitude Levels</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + circleColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
}
