var trinity = require('./index.js');

$(function(){
  $('#allocation').on('change mousemove', function(){
    $('#allocationValue').text($(this).val());
  });
  $('#run').on('click', function(){
    var durationYears = parseFloat($('#durationYears').val());
    var labels = [];
    for (var x = 0; x < durationYears; x++){
      labels.push(x);
    }
    var options = {
      startingValue: parseFloat($('#startingValue').val()),
      durationYears: durationYears,
      allocation: {
        equities: parseFloat($('#allocation').val())
      },
      fees: $('#fees').val(),
      spendingModel: parseFloat($('#spending').val()),
      rebalance: parseInt($('#rebalance').val())
    };
    var netData = {
      labels: labels,
      datasets: []
    };
    var equityData = {
      labels: labels,
      datasets: []
    };
    var bondData = {
      labels: labels,
      datasets: []
    };
    var result = trinity.simulate(options);
    $('#successRate').text(result.successRate);
    $('#data').show({
      done: function(){
        for (var y = 0; y < result.data.length; y++){
          var runData = result.data[y];
          var color = randomColor();
          var netDataset = {
            label: ''+y,
            data: [],
            strokeColor: color
          };
          var equityDataset = {
            label: ''+y,
            data: [],
            strokeColor: color
          };
          var bondDataset = {
            label: ''+y,
            data: [],
            strokeColor: color
          };
          for (var z = 0; z < runData.length; z++){
            var yearData = runData[z];
            netDataset.data.push(yearData.adjustedNet);
            equityDataset.data.push(yearData.adjustedSharesBalance);
            bondDataset.data.push(yearData.adjustedBondsBalance);
          }
          netData.datasets.push(netDataset);
          equityData.datasets.push(equityDataset);
          bondData.datasets.push(bondDataset);
        }
        var chartOptions = {
          datasetFill: false,
          pointDot: false,
          showTooltips: false
        };
        new Chart(getContextOfId('netChart')).Line(netData, chartOptions);
        new Chart(getContextOfId('equityChart')).Line(equityData, chartOptions);
        new Chart(getContextOfId('bondChart')).Line(bondData, chartOptions);
      }
    });
  });
});

function randomColor(){
  //return random color
  return "rgba("+Math.floor(Math.random()*255)+
    ","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+
    ",1)";
}

function getContextOfId(id){
  //gets the 2d context of the canvas by this id
  return $('#'+id).get(0).getContext('2d');
}
