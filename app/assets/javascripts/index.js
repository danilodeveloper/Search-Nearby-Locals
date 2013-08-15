
var atual;
var lat, lon;

$(function(){

  // Descobre localização atual
  pegarLocalizacao();

  // Carrega categorias de pesquisa
  listaCategorias();

  // Trigger do clique de botão pesquisa
  $("#procurar").click(function(){
  	listaLocais(lat, lon, $("#tipo").find("option:selected").val(), $("#distancia").val());
  });
});

// Preenche categorias para pesquisa
function listaCategorias() {
  var url = "https://api.foursquare.com/v2/venues/categories?client_id=PKAHBB1OAX0B000CG5UUYO4BXV0LWQWKFB51EK3XVNFJ2ULS&client_secret=RDPX01C01RHCYASZIKVH5XXMPVFIPLFHFP1D53UR4GUWQD50&v=20120101"

  $.getJSON(url, function(data){

    // Para cada categoria pai
    for(var i = 0; i < data.response.categories.length; i++) {

      // Para cada categoria filho
      for(var j = 0; j < data.response.categories[i].categories.length; j++) {
        $("#tipo").append(
          new Option(data.response.categories[i].name + " - " + data.response.categories[i].categories[j].name, data.response.categories[i].categories[j].id)
        );
      }
    }
  });

}

// Retorna localização
function pegarLocalizacao()
{
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(gravaLocalizacao);
    else
      alert("Geolocalização não suportada");
}

function gravaLocalizacao(position)
{
    var url;

    // Grava localização
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    
    // Descobre endereço
    url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=false";
    $.getJSON(url, function(data){
      	$("#endereco").html("<p>" + data.results[0].formatted_address + "</p>");
    });

    //listaLocais(lat, lon, $("#tipo").find("option:selected").val(), $("#distancia").val());
}

// Lista locais baseado na localização
function listaLocais(lat, lon, tipo, distancia) {

    var url; // url de chamado do JSON
    var limit = 5; // limite de resultados
    var radius = distancia; // raio
    var client_id = "PKAHBB1OAX0B000CG5UUYO4BXV0LWQWKFB51EK3XVNFJ2ULS"; // id
    var client_secret = "RDPX01C01RHCYASZIKVH5XXMPVFIPLFHFP1D53UR4GUWQD50"; // senha

    url = "https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lon + "&" +
      "limit=" + limit + "&" +
      "radius=" + radius + "&" +
      "client_id=" + client_id + "&" +
      "client_secret=" + client_secret + "&" +
      "categoryId=" + tipo +
      "&v=20120101";

      console.log(url);

    // Monta saída html
    $.getJSON(url, function(data){
      var resultado = ""; // saída html

      for(var i = 0; i < data.response.venues.length; i++) {
        resultado += "<li>" + data.response.venues[i].name + "</li>";
      }

      // Exibe saída html
      $("#locais").html("<ul>" + resultado + "</ul>");
    });
}

// Inicia Google Maps
/*
ANTIGO UTILIZANDO GOOGLE MAPS

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
*/

// Retorno do listaLocais
/*function callback(results, status) {

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
}*/

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
