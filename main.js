var trinity = require('./index.js');

var ctx;
$(function(){
  ctx = $('#chart').get(0).getContext('2d');
  $('#run').on('click', function(){
    var durationYears = 50;
    var labels = [];
    for (var x = 0; x < durationYears; x++){
      labels.push(x);
    }
    var options = {
      startingValue: 1000000,
      durationYears: durationYears,
      allocation: {
        equities: 0.5,
        bonds: 0.5
      },
      fees: 0.0005,
      spendingModel: 40000,
      rebalance: false
    };
    var data = {
      labels: labels,
      datasets: []
    };
    var result = trinity.simulate(options);
    for (var y = 0; y < result.data.length; y++){
      var runData = result.data[y];
      var dataset = {};
      dataset.label = ''+y;
      for (var z = 0; z < runData.length; z++){
        var yearData = runData[z];
        dataset.data.push(yearData.adjustedNet);
      }
      data.datasets.push(dataset);
    }
    var chartOptions = {
      datasetFill: false
    };
    var myLineChart = new Chart(ctx).Line(data, chartOptions);
  });
});
