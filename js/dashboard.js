$(document).ready(function () {
    // alert("message");
    $('#progress-div').css('display','inline');
    var opts = {
      lines: 9, // The number of lines to draw
      length: 0, // The length of each line
      width: 14, // The line thickness
      radius: 14, // The radius of the inner circle
      corners: 0, // Corner roundness (0..1)
      rotate: 28, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#419641', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 45, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      className: 'spinner', // The CSS class to assign to the spinner
      // zIndex: 2e9, // The z-index (defaults to 2000000000)
      top:'10%',
      left:'65%'
    };
    spinner = new Spinner(opts).spin();
    $('#progress').append(spinner.el);

    var vin = 'WBY1Z4C55EV273078';
    var url = 'http://api.hackthedrive.com/vehicles/' + vin;
    $.ajax({
      url: url,
      // data: {limit: 2, 'api-key-id': api_key_id},
      type: 'GET',
      success: function(data) {
        // console.log(data)
        $('#year_model').html('<b>'+data.make+'</b>'+' '+data.model+ ' '+data.year+' : '+data.colorAccent);  
        $('#lastupdate').html(Date(data.timestamp))  
        // console.log(Date(data.timestamp))
      }
    });

    // // Last Trip
    // url = 'http://api.hackthedrive.com/vehicles/'+vin+'/lastTrip/';
    // $.ajax({
    //   url: url,
    //   // data: {limit: 2, 'api-key-id': api_key_id},
    //   type: 'GET',
    //   success: function(data) {
    //     console.log(data)
    //     // $('#year_model').html('<b>'+data.make+'</b>'+' '+data.model+ ' '+data.year+' : '+data.colorAccent);    
    //   }
    // });

    // Fuel
    url = 'http://api.hackthedrive.com/vehicles/'+vin+'/fuel/';
    $.ajax({
      url: url,
      // data: {limit: 2, 'api-key-id': api_key_id},
      type: 'GET',
      success: function(data) {
        // console.log(data)
        $('#fuel').html(data.remainingPercent+'%');
      }
    });

    // Battery
    url = 'http://api.hackthedrive.com/vehicles/'+vin+'/battery/';
    $.ajax({
      url: url,
      // data: {limit: 2, 'api-key-id': api_key_id},
      type: 'GET',
      success: function(data) {
        // console.log(data)
        $('#battery').html(data.remainingPercent+'%');
      }
    });

    // Mileage
    url = 'http://api.hackthedrive.com/vehicles/'+vin+'/odometer/';
    $.ajax({
      url: url,
      // data: {limit: 2, 'api-key-id': api_key_id},
      type: 'GET',
      success: function(data) {
        // console.log(data)
        $('#mileage').html(data.totalMi+' miles');
      }
    });



    $('#progress-div').css('display','none');
    $('.dashboard').css('display','');
    $('#content').css('display', '');
})