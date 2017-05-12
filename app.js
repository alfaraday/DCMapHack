var map;

function initMap(latitude, longitude) {
  var project = {lat: latitude, lng: longitude};
  var mapProp = {
    zoom: 4,
    center: project,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  map = new google.maps.Map(document.getElementById('map'), mapProp);
};


function watchSubmit() {
  //create dcURL out of search
  var dcURL;
  $('#js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('#zip-code-search').val();
    console.log(query);
    dcURL = "http://api.donorschoose.org/common/json_feed.html?zip="+query+"&APIKey=DONORSCHOOSE&max=10&callback=?";
    console.log(dcURL);
    //use dcURL to call DC API
    $.getJSON(dcURL, function(data){
      console.log(data);
      //add first result to the top of the page
      $("#results").append(data.proposals[0].fulfillmentTrailer + 
        "<a href='" + data.proposals[0].fundURL + "'>" 
        + data.proposals[0].fundingStatus + 
        "</a>");
      //get the coordinates for the first result
      var lat = parseFloat(data.proposals[0].latitude);
      var long = parseFloat(data.proposals[0].longitude);
      //create the map
      initMap(lat, long);
      //add remaining results to the map
      for (var i = 0; i < data.proposals.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(data.proposals[i].latitude), parseFloat(data.proposals[i].longitude)),
          map: map,
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      };
    });
  });
}

$(function() {watchSubmit();});



