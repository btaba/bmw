function rnd_snd() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function rnd(mean, stdev) {
  return Math.round(rnd_snd()*stdev+mean);
}



var prevaScore = .85;
var chart;
var chartData = [];
var zenChart;
var zenChartData = [];
var day;
var firstDate;
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



    chartInit();
    aScore(prevaScore,0.85);
    // dashboard_functions();

    $('#progress-div').css('display','none');
    $('.dashboard').css('display','');
    $('.content').css('display', '');


    dashboard_functions();

})




function dashboard_functions() {
  // set up the chart to update every second
    setInterval(function () {
        // normally you would load new datapoints here,
        // but we will just generate some random values
        // and remove the value from the beginning so that
        // we get nice sliding graph feeling
        
        // remove datapoint from the beginning
        costChart();
    }, 2500);

}

function costChart() {
  // remove datapoint from the beginning
  chart.dataProvider.shift();
  
  // add new one at the end
  day++;
  var newDate = new Date(firstDate);
  newDate.setDate(newDate.getDate() + day);
  // var visits = Math.round(Math.random() * 100) - 40;
  var visits = rnd(0,10);
  chart.dataProvider.push({
      date: newDate,
      visits: visits
  });
  chart.validateData();

  // remove datapoint from the beginning
  zenChart.dataProvider.shift();
  
  // add new one at the end
  day++;
  var newDate = new Date(firstDate);
  newDate.setDate(newDate.getDate() + day);

  if (visits < -8) {
    var visits = rnd(55, 12);
  }
  else if (visits < -11) {
    var visits = rnd(25,12);
  }
  else {
    var visits = rnd(85, 6);
    if (visits > 100) visits = 92;
    if (visits < 0) visits = 7;
  }
  
  if (visits < 50) {
    sendSMS("Tushar, you suck balls");
  }

  zenChart.dataProvider.push({
      date: newDate,
      visits: visits
  });
  zenChart.validateData();

  aScore(prevaScore, visits/100)


}

function aScore(startPercent, endPercent) {
  prevaScore = endPercent;

  function getColor(t) {
    var rainbow = new Rainbow();
    rainbow.setSpectrum('red', 'green');
    rainbow.setNumberRange(0, 1);
    return '#'+rainbow.colourAt(t)
  }

  var radius = 100;
  var border = 5;
  var padding = 30;
  // var startPercent = 0;
  // var endPercent = 0.85;


  var twoPi = Math.PI * 2;
  var formatPercent = d3.format('.0%');
  var boxSize = (radius + padding) * 2;


  var count = Math.abs((endPercent - startPercent) / 0.01);
  var step = endPercent < startPercent ? -0.01 : 0.01;

  var arc = d3.svg.arc()
      .startAngle(0)
      .innerRadius(radius)
      .outerRadius(radius - border);

  $('#aScore').empty();
  var parent = d3.select('div#aScore');

  var svg = parent.append('svg')
      .attr('width', boxSize)
      .attr('height', boxSize);

  var defs = svg.append('defs');

  var filter = defs.append('filter')
      .attr('id', 'blur');


  var g = svg.append('g')
      .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

  var meter = g.append('g')
      .attr('class', 'progress-meter');

  meter.append('path')
      .attr('class', 'background')
      .attr('fill', '#ccc')
      .attr('fill-opacity', 0.5)
      .attr('d', arc.endAngle(twoPi));

  var foreground = meter.append('path')
      .attr('class', 'foreground')
      // .attr('fill', color)
      .attr('fill-opacity', 1)
      // .attr('stroke', color)
      .attr('stroke-width', 5)
      .attr('stroke-opacity', 1)
      .attr('filter', 'url(#blur)');

  var front = meter.append('path')
      .attr('class', 'foreground')
      // .attr('fill', color)
      .attr('fill-opacity', 1);

  var numberText = meter.append('text')
      .attr('fill', '#111')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em');


  function updateProgress(progress) {
      color = getColor(progress);
      foreground.attr('d', arc.endAngle(twoPi * progress)).attr('fill',color).attr('stroke',color);
      front.attr('d', arc.endAngle(twoPi * progress)).attr('fill',color);
      var textStat = '';
      if (progress < .3 ) textStat = '   Oh Crap'
      else if (progress < .5 && progress >= .30) textStat = '   Very Bad'
      else if (progress >= .50 && progress < .70) textStat = '  Not Great'
      else if (progress >= .70 && progress < .85) textStat = '  Ok'
      else if(progress >= .85) textStat = '   Great'


      numberText.html(formatPercent(progress)+textStat);
  }

  var progress = startPercent;

  (function loops() {
      updateProgress(progress);

      if (count > 0) {
          count--;
          progress += step;
          setTimeout(loops, 10);
      }
  })();
}

function chartInit() {
    
    var chartCursor;
    day = 0;
    firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 50);

    // generate some random data, quite different range
    function generateChartData() {
        for (day = 0; day < 30; day++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + day);

            var visits = rnd(0,10);

            chartData.push({
                date: newDate,
                visits: visits
            });
        }
    }

    // create chart
    AmCharts.ready(function() {
      generateChartData();

      // SERIAL CHART    
      chart = new AmCharts.AmSerialChart();
      chart.pathToImages = "http://www.amcharts.com/lib/images/";
      chart.marginTop = 0;
      chart.marginRight = 10;
      chart.autoMarginOffset = 5;
      chart.zoomOutButton = {
          backgroundColor: '#000000',
          backgroundAlpha: 0.15
      };
      chart.dataProvider = chartData;
      chart.categoryField = "date";

      // AXES
      // category
      var categoryAxis = chart.categoryAxis;
      categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
      categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
      categoryAxis.dashLength = 1;
      categoryAxis.gridAlpha = 0.15;
      categoryAxis.axisColor = "#DADADA";

      // value                
      var valueAxis = new AmCharts.ValueAxis();
      valueAxis.axisAlpha = 0.2;
      valueAxis.dashLength = 1;
      chart.addValueAxis(valueAxis);

      // GRAPH
      var graph = new AmCharts.AmGraph();
      graph.title = "red line";
      graph.valueField = "visits";
      graph.bullet = "round";
      graph.bulletBorderColor = "#FFFFFF";
      graph.bulletBorderThickness = 2;
      graph.lineThickness = 2;
      graph.lineColor = "#0352b5";
      graph.negativeLineColor = "#b5030d";
      graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection
      chart.addGraph(graph);

      // CURSOR
      chartCursor = new AmCharts.ChartCursor();
      chartCursor.cursorPosition = "mouse";
      chart.addChartCursor(chartCursor);

      // SCROLLBAR
      var chartScrollbar = new AmCharts.ChartScrollbar();
      chartScrollbar.graph = graph;
      chartScrollbar.scrollbarHeight = 40;
      chartScrollbar.color = "#FFFFFF";
      chartScrollbar.autoGridCount = false;
      chart.addChartScrollbar(chartScrollbar);

      // WRITE
      chart.write("costChart");
  })

  function generateZenChartData() {
        for (day = 0; day < 30; day++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + day);

            var visits = rnd(85, 4);
            if (visits > 100) visits = 100;

            zenChartData.push({
                date: newDate,
                visits: visits
            });
        }
    }

  // ZenDrive Chart
  AmCharts.ready(function() {
      generateZenChartData();

      // SERIAL CHART    
      zenChart = new AmCharts.AmSerialChart();
      zenChart.pathToImages = "http://www.amcharts.com/lib/images/";
      zenChart.marginTop = 0;
      zenChart.marginRight = 10;
      zenChart.autoMarginOffset = 5;
      zenChart.zoomOutButton = {
          backgroundColor: '#000000',
          backgroundAlpha: 0.15
      };
      zenChart.dataProvider = zenChartData;
      zenChart.categoryField = "date";

      // AXES
      // category
      var categoryAxis = zenChart.categoryAxis;
      categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
      categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
      categoryAxis.dashLength = 1;
      categoryAxis.gridAlpha = 0.15;
      categoryAxis.axisColor = "#DADADA";

      // value                
      var valueAxis = new AmCharts.ValueAxis();
      valueAxis.axisAlpha = 0.2;
      valueAxis.dashLength = 1;
      zenChart.addValueAxis(valueAxis);

      // GRAPH
      var graph = new AmCharts.AmGraph();
      graph.title = "red line";
      graph.valueField = "visits";
      graph.bullet = "round";
      graph.bulletBorderColor = "#FFFFFF";
      graph.bulletBorderThickness = 2;
      graph.lineThickness = 2;
      graph.lineColor = "#0352b5";
      graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection
      zenChart.addGraph(graph);

      // CURSOR
      chartCursor = new AmCharts.ChartCursor();
      chartCursor.cursorPosition = "mouse";
      zenChart.addChartCursor(chartCursor);

      // SCROLLBAR
      var chartScrollbar = new AmCharts.ChartScrollbar();
      chartScrollbar.graph = graph;
      chartScrollbar.scrollbarHeight = 40;
      chartScrollbar.color = "#FFFFFF";
      chartScrollbar.autoGridCount = false;
      zenChart.addChartScrollbar(chartScrollbar);

      // WRITE
      zenChart.write("zenChart");
  })
}

function sendSMS(data) {
    // function below will run clear.php?h=michael
    $.ajax({
        type: "GET",
        url: "sendSMS.php" ,
        data: { text: data },
        success : function() { 

            // location.reload();

        }
    });
}




