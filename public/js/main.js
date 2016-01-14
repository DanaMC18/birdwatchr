console.log("         _     ")
console.log("        <')_,/ ")
console.log("        (_==/  ")
console.log("birder  ='-    ")
console.log("we're hiring!  ")


$(document).ready(function(){

  $('#bird-data').click(function(){
    event.preventDefault();
    console.log('chirp');

    $.ajax({
      url: '/demo_sightings',
      type: 'get',
      dataType: 'JSON'
    }).done(function(data){
      console.log(data)

      var template = Handlebars.compile($('#sightings-template').html());

      data.forEach(function(sighting){
        $('#birds-list').append(template(sighting));
      })
    })
  })


})