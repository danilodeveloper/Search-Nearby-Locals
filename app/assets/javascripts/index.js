
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
}

// Lista locais baseado na localização
function listaLocais(lat, lon, tipo, distancia) {

    var url; // url de chamado do JSON
    var limit = 20; // limite de resultados
    var radius = distancia * 1000; // raio
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
        resultado += '<li><a href="#" onclick="javascript:exibeDetalhes(this, ' + data.response.venues[i].location.lat + ', ' + data.response.venues[i].location.lng + ')">' + data.response.venues[i].name + '</a> - ' +
          (Math.round(data.response.venues[i].location.distance / 100) / 10) + ' km'+
          '</li>';
      }

      // Exibe saída html
      $("#locais").html("<ul>" + resultado + "</ul>");
    });
}

// Exibe detalhes do local
function exibeDetalhes(item, lat, lon) {

  var listItem = $(item).parent();

  // Esconde detalhes anteriores
  $("#detalhes").remove();

  // Cria novo div de detalhes abaixo do local selecionado
  listItem.append('<div id="detalhes"><div id="mapa"></div></div>');

  // Exibe mapa
  exibeMapa(lat, lon);
}

// Mostra local no Google Maps
function exibeMapa(lat, lon) {
  $("#mapa").empty();
  $("#mapa").prepend('<a href="https://maps.google.com/?ll=' + lat + ',' + lon + '"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lon + 
    '&zoom=15&size=' + ($(window).width() - 10) + 'x200' +
    '&markers=color:red%7Ccolor:red%7C' + lat + ',' + lon +
    '&sensor=false"></a>');
}
