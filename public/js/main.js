console.log("         _     ")
console.log("        <')_,/ ")
console.log("        (_==/  ")
console.log("birder  ='-    ")
console.log("we're hiring!  ")


$(document).ready(function(){

  $('#bird-data').click(function(){
    console.log('chirp');
    event.preventDefault();

    $.ajax({
      url: '/demo_sightings',
      type: 'get',
      dataType: 'JSON'
    }).done(function(data){
      var template = Handlebars.compile($('#sightings-template').html());
      data.forEach(function(sighting){
        $('#birds-list').append(template(sighting));
      })
    })
  })
  

  $('#lat-long').submit(function(){
    console.log('where am i?');
    event.preventDefault();
    var address = $('#lat-long').serializeArray()[0].value;
    var dataObject = {'address': address}
    $.ajax({
      url: '/geolocate',
      type: 'post',
      dataType: 'JSON',
      data: dataObject
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#geolocate-template').html());
      $('#geolocate').append(template(data))
    })
  })

})