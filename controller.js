var map;
var markerArray;

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
    markerArray = new google.maps.MVCArray()
}

var cafedata;
d3.csv("data_1.csv").then(function(d){
    cafedata  = d;
});



function contents(content,rank,lunch_budget){
  if(content=="Rank")return d3.interpolateOrRd((rank-1)/4);
  if(content=="Lunch_Budget"){
    if(lunch_budget == " ～￥999")return d3.interpolateOrRd(0.2);
    if(lunch_budget == "￥1,000～￥1,999")return d3.interpolateOrRd(0.5);
    if(lunch_budget == "-")return "grey";
  }
}

function setMarker(data, content){
    var pixelOffset = new google.maps.Size(0, -5);
    var lat = Number(data.Lat)//+0.15*Math.random() 
    var lng = Number(data.Lng)//+0.15*Math.random() 
    var rank = Number(data.Rank)//+4*Math.random()-2
    var lunch_budget = data.Lunch_Budget
    var open;
    if (data.Open_Date == "0"){
      open = "-"
    }
    else open = data.Open_Date;
    var latlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({ // マーカーの追加
        position: latlng, // マーカーを立てる位置を指定
        map: map,
        icon: {
          fillColor: contents(content,rank,lunch_budget),
          fillOpacity: 1,
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeWeight: 0.2,
        },
    })

    marker.addListener("mouseover", function(){
      hoverinfo = new google.maps.InfoWindow({
        map: map,
        content: "<p>name: "+ data.Name +"</p>"
                  +"<p>rank: "+ rank.toFixed(2) +"</p>"
                  +"<p>open: "+ open+"</p>"
                  +"<p>lunch_budget: "+ lunch_budget +"</p>",
        noSuppress: true,
        pixelOffset: pixelOffset,
      });
      
      console.log(typeof(open));

      hoverinfo.setPosition(latlng);

      marker.addListener("mouseout", function(){
        if(hoverinfo){
          hoverinfo.close();
        }
      })
    })

    markerArray.push(marker)
}
    

