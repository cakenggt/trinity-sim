var assert = require('chai').assert;
var expect = require('chai').expect;
var trinity = require('../index.js');
var archive = require('../archive.js').data;
var testData = require('./test_data.js').data;

describe('Trinity', function(){
  describe('data', function(){
    it('sp500 data should exist', function(){
      expect(archive['1913'].sp500).to.equal(9.3);
    });
    it('inflation should decrease money values', function(){
      var initial = 1000000;
      expect(initial/archive['1950'].cpi).to.be.below(initial/archive['1913'].cpi);
    });
    it('growth should slowly increase money values', function(){
      var initial = 1000000;
      var net = initial;
      for (var year = 1914; year < 1950; year++){
        var currentYearData = archive[''+year];
        var lastYearData = archive[''+(year-1)];
        net = (net/lastYearData.sp500)*currentYearData.sp500;
      }
      expect(net).to.be.below(100*initial);
    });
  });
  describe('single sim', function(){
    var options;
    beforeEach(function(){
      options = {
        startingValue: 1000000,
        startingYear: 1980,
        durationYears: 30,
        allocation: {
          equities: 1,
          bonds: 0
        },
        fees: 0.0005,
        spendingModel: 40000
      };
    });
    it('result end balance between normal values', function(){
      var result = trinity.singleSim(options);
      expect(result.netWorths[result.netWorths.length-1]).to.be.above(1000000).and.below(1000000000);
    });
    it('failing result because of too high spending', function(){
      options.spendingModel = 100000;
      var result = trinity.singleSim(options);
      expect(result.netWorths[result.netWorths.length-1]).to.be.below(0);
    });
  });
  describe('full sim', function(){
    var options;
    beforeEach(function(){
      options = {
        startingValue: 1000000,
        durationYears: 50,
        allocation: {
          equities: 1,
          bonds: 0
        },
        fees: 0.0005,
        spendingModel: 30000
      };
    });
    it('high success rate', function(){
      var result = trinity.simulate(options);
      expect(result.successRate).to.be.within(0.8, 1);
    });
    it('low succes rate', function(){
      options.spendingModel = 60000;
      var result = trinity.simulate(options);
      expect(result.successRate).to.be.within(0.5, 0.7);
    });
    it('different success rates due to spending', function(){
      options.spendingModel = 40000;
      var resultHigh = trinity.simulate(options);
      options.spendingModel = 50000;
      var resultLow = trinity.simulate(options);
      expect(resultHigh.successRate).to.be.above(resultLow.successRate);
    });
    it('different success rates due to allocation', function(){
      options.spendingModel = 40000;
      var resultHigh = trinity.simulate(options);
      options.allocation.equities = 0.5;
      options.allocation.bonds = 0.5;
      var resultLow = trinity.simulate(options);
      expect(resultHigh.successRate).to.be.above(resultLow.successRate);
    });
  });
  describe('comparison runs', function(){
    for (var x = 0; x < testData.length; x++){
      var data = testData[x];
      var result = trinity.simulate(data.options);
      //margin is either the difference between fireCalc and cFireSim,
      //or 11%, whichever is higher
      var margin = Math.max(Math.abs(data.fireCalc-data.cFireSim), 0.11);
      it('within ' + Math.round(margin*100) + '% using ' + data.description,
        createComparisonTest(result, data, margin));
    }
  });
});

function createComparisonTest(result, data, margin){
  return function(){
    var lower = Math.min(data.cFireSim-margin, data.fireCalc-margin);
    var upper = Math.max(data.cFireSim+margin, data.fireCalc+margin);
    expect(result.successRate).to.be.within(lower, upper);
  };
}
