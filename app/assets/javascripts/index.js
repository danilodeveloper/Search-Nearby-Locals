var NearbyLocals = (function(){
    // private methods and variables here
    var _lat, _lon;
    var _url = "https://api.foursquare.com/v2/venues/categories?client_id=PKAHBB1OAX0B000CG5UUYO4BXV0LWQWKFB51EK3XVNFJ2ULS&client_secret=RDPX01C01RHCYASZIKVH5XXMPVFIPLFHFP1D53UR4GUWQD50&v=20120101";
    var _gmaps_url = function(lat, lon){
        return "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=false"
    };
    var _foursquare_conf = {
        limit: 20, // limite de resultados
        client_id: "PKAHBB1OAX0B000CG5UUYO4BXV0LWQWKFB51EK3XVNFJ2ULS", // id
        client_secret: "RDPX01C01RHCYASZIKVH5XXMPVFIPLFHFP1D53UR4GUWQD50" // senha
    };
    var _foursquare_url = function(radius, tipo, lat, lon){
        return "https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lon + "&" +
        "limit=" + _foursquare_conf.limit + "&" +
        "radius=" + radius + "&" +
        "client_id=" + _foursquare_conf.client_id + "&" +
        "client_secret=" + _foursquare_conf.client_secret + "&" +
        "categoryId=" + tipo +
        "&v=20120101";
    };

    // public methods and variables here
    return {
        listar_categorias: function(){
            $.getJSON(_url, function(data){

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
        },
        pegar_localizacao: function(){
            if (navigator.geolocation)
                navigator.geolocation.getCurrentPosition(NearbyLocals.gravar_localizacao);
            else
                alert("Geolocalização não suportada");
        },
        gravar_localizacao: function(position){

            _lat = position.coords.latitude;
            _lon = position.coords.longitude;

            // Descobre endereço
            $.getJSON(_gmaps_url(_lat, _lon), function(data){
                $("#endereco").html("<p>" + data.results[0].formatted_address + "</p>");
            });
        },
        listar_locais: function(tipo, radius){
            console.log(_foursquare_url(radius,tipo,_lat,_lon));

            // Monta saída html
            $.getJSON(_foursquare_url(radius,tipo,_lat,_lon), function(data){
                var resultado = ""; // saída html

                for(var i = 0; i < data.response.venues.length; i++) {
                    resultado += '<li><a href="#" onclick="javascript:NearbyLocals.exibir_detalhes(this, ' + data.response.venues[i].location.lat + ', ' + data.response.venues[i].location.lng + ')">' + data.response.venues[i].name + '</a> - ' +
                        (Math.round(data.response.venues[i].location.distance / 100) / 10) + ' km'+
                        '</li>';
                }

                // Exibe saída html
                $("#locais").html("<ul>" + resultado + "</ul>");
            });
        },
        exibir_detalhes: function(obj, lat, lon){
            var listItem = $(obj).parent();

            // Esconde detalhes anteriores
            $("#detalhes").remove();

            // Cria novo div de detalhes abaixo do local selecionado
            listItem.append('<div id="detalhes"><div id="mapa"></div></div>');

            // Exibe mapa
            this.exibir_mapa(lat, lon);
        },
        exibir_mapa: function(lat, lon){
            $("#mapa").empty();
            $("#mapa").prepend('<a href="https://maps.google.com/?ll=' + lat + ',' + lon + '"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lon +
                '&zoom=15&size=' + ($(window).width() - 10) + 'x200' +
                '&markers=color:red%7Ccolor:red%7C' + lat + ',' + lon +
                '&sensor=false"></a>');
        }
    };
})();

$(function(){
  var nl = NearbyLocals;
  // Descobre localização atual
  nl.pegar_localizacao();

  // Carrega categorias de pesquisa
  nl.listar_categorias();

  // Trigger do clique de botão pesquisa
  $("#procurar").click(function(){
  	nl.listar_locais($("#tipo").find("option:selected").val(), $("#distancia").val() * 1000);
  });
});
