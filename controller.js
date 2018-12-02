var app = angular.module('App', []);

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { // 地図の中心を指定
            lat: 35.658034, // 緯度
            lng: 139.701636 // 経度
        },
        zoom: 11, // 地図のズームを指定
        minZoom: 11,
        maxZoom: 15,
        disableDefaultUI: true,
        styles: [
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "simplified"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "simplified"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "simplified"
                }
              ]
            },
            {
              "featureType": "administrative.neighborhood",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "simplified"
                }
              ]
            },
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.attraction",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.business",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "stylers": [
                {
                  "weight": 2
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "stylers": [
                {
                  "color": "#ffffff"
                },
                {
                  "visibility": "simplified"
                },
                {
                  "weight": 2
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.local",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
    });
}

var cafedata;
d3.csv("dataset.csv").then(function(d){
    cafedata  = d;
    console.log(cafedata);
})




function setMarker(data){
    var pixelOffset = new google.maps.Size(0, -5);
    var lat = Number(data.Lat)+0.1*Math.random()
    var lng = Number(data.Lng)+0.1*Math.random()
    var latlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({ // マーカーの追加
        position: latlng, // マーカーを立てる位置を指定
        map: map,
        icon: {
          fillColor: "#FF0000",
          fillOpacity: 1,
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          strokeColor: "FFFFFF",
          strokeWeight: 0
        },
    })

    marker.addListener("mouseover", function(){
      hoverinfo = new google.maps.InfoWindow({
        map: map,
        content: "<p>lat: "+ lat +"</p><p>lng: "+ lng +"</p>",
        noSuppress: true,
        pixelOffset: pixelOffset,
      });
      
      console.log();
      hoverinfo.setPosition(latlng);

      marker.addListener("mouseout", function(){
        if(hoverinfo){
          hoverinfo.close();
        }
      })
    })
}
    

