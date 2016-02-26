var trinity = require('./index.js');

$(function(){
  $('#allocation').on('change mousemove', function(){
    $('#allocationValue').text($(this).val());
  });
  $('#run').on('click', function(){
    var durationYears = parseFloat($('#durationYears').val());
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
    var netData = [];
    var equityData = [];
    var bondData = [];
    var result = trinity.simulate(options);
    $('#successRate').text(result.successRate);
    $('#data').show();
    for (var y = 0; y < result.data.length; y++){
      var runData = result.data[y];
      var netDataset = [];
      var equityDataset = [];
      var bondDataset = [];
      for (var z = 0; z < runData.length; z++){
        var yearData = runData[z];
        netDataset.push([z, yearData.adjustedNet]);
        equityDataset.push([z, yearData.adjustedSharesBalance]);
        bondDataset.push([z, yearData.adjustedBondsBalance]);
      }
      netData.push(netDataset);
      equityData.push(equityDataset);
      bondData.push(bondDataset);
    }
    Flotr.draw(document.getElementById('netChart'), netData);
    Flotr.draw(document.getElementById('equityChart'), equityData);
    Flotr.draw(document.getElementById('bondChart'), bondData);
  });
});
