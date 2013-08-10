
$(function(){

var atual;

// Trigger do clique de botão pesquisa
$("#procurar").click(function(){
	pegarLocalizacao();
});

// Retorna localização
function pegarLocalizacao()
{
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(showPosition);
    else
      alert("Geolocalização não suportada");
}

function showPosition(position)
{
    var lat, lon, url;

    lat = position.coords.latitude;
    lon = position.coords.longitude;
    url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=false";

    $.getJSON(url, function(data){
      	$("#endereco").html("<p>" + data.results[0].formatted_address + "</p>");
    });

    listaLocais(lat, lon, $("#tipo").find("option:selected").val(), $("#distancia").val());
}

// Inicia Google Maps
function listaLocais(lat, lon, tipo, distancia) {

    var map;

    atual = new google.maps.LatLng(lat, lon);

    var request = {
      location: new google.maps.LatLng(lat, lon),
      radius: distancia,
      types: [tipo],
      rankBy: google.maps.places.DISTANCE
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: atual,
      zoom: 15
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

// Retorno do listaLocais
function callback(results, status) {

    var resultados = "";

    if(status == google.maps.places.PlacesServiceStatus.OK) {
      for(var i = 0; i < results.length; i++) {
        resultados += "<li>" + results[i].name +
          "<span class=\"distancia\"> - " + calculaDistancia(results[i].geometry.location, atual) + " km</span>";

        // Nota
        if("rating" in results[i]) resultados += "<span class=\"nota\"> - nota " + String(results[i].rating * 2) + "</span>";
        
        // Foto
        if("photos" in results[i])
          resultados += " - <img src=\"" + results[i].photos[0].getUrl({maxWidth: 50, maxHeight: 50}) + "\" />";

        // Mapa
        resultados += " - <a href=\"javascript: exibeMapa();\">Mapa</a>";

        resultados += "</li>";
      }

      $("#locais").html("<ul>" + resultados + "</ul>");
    }
    else {
      $("#locais").html("Nenhum resultado encontrado!");
    }
}
});

// Calcula distancia entre dois pontos
rad = function(x) {return x*Math.PI/180;}

calculaDistancia = function(p1, p2) {
  var R = 6371; // earth's mean radius in km
  var dLat  = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(1);
}

// Mostra local no Google Maps
function exibeMapa() {
  var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
  var mapOptions = {
    zoom: 4,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
}
