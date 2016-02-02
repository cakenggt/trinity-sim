var assert = require('chai').assert;
var expect = require('chai').expect;
var trinity = require('../index.js');

describe('Trinity', function(){
  describe('data', function(){
    it('sp500 data should exist', function(){
      expect(trinity.data['1913-0'].sp500).to.equal(9.3);
    })
    it('inflation should decrease money values', function(){
      var initial = 1000000;
      var net = initial;
      for (var year = 1913; year < 1950; year++){
        for (var month = 0; month < 12; month++){
          var currentMonthData = trinity.data[''+year+'-'+month];
          net /= (1+currentMonthData.inflation)
        }
      }
      expect(net).to.be.below(initial);
    })
    it('inflation should be realistic', function(){
      var inflation = 1;
      for (var year = 1940; year < 2016; year++){
        for (var month = 0; month < 12; month++){
          var currentMonthData = trinity.data[''+year+'-'+month];
          inflation /= (1+currentMonthData.inflation);
        }
      }
      expect(inflation).to.be.below(0.07).and.above(0.05);
    })
    it('growth should slowly increase money values', function(){
      var initial = 1000000;
      var net = initial;
      for (var year = 1914; year < 1950; year++){
        for (var month = 0; month < 12; month++){
          var currentMonthData = trinity.data[''+year+'-'+month];
          var lastMonthData;
          if (month == 0){
            lastMonthData = trinity.data[''+(year-1)+'-'+11];
          }
          else{
            lastMonthData = trinity.data[''+(year)+'-'+(month-1)];
          }
          net = (net/lastMonthData.sp500)*currentMonthData.sp500;
        }
      }
      expect(net).to.be.below(100*initial);
    })
  })
  describe('single sim', function(){
    var options;
    beforeEach(function(){
      options = {
        startingValue: 1000000,
        startingYear: 1980,
        durationYears: 30,
        fees: 0.0005,
        spendingModel: 40000
      }
    })
    it('result end balance between normal values', function(){
      var result = trinity.singleSim(options);
      expect(result.netWorths[result.netWorths.length-1]).to.be.above(1000000).and.below(1000000000);
    })
    it('failing result because of too high spending', function(){
      options.spendingModel = 100000;
      var result = trinity.singleSim(options);
      expect(result.netWorths[result.netWorths.length-1]).to.be.below(0);
    })
  })
  describe('full sim', function(){
    var options;
    beforeEach(function(){
      options = {
        startingValue: 1000000,
        durationYears: 50,
        fees: 0.0005,
        spendingModel: 30000
      }
    })
    it('high success rate', function(){
      var result = trinity.simulate(options);
      expect(result.successRate).to.be.at.least(0.8).and.at.most(1);
    })
    it('low succes rate', function(){
      options.spendingModel = 60000;
      var result = trinity.simulate(options);
      expect(result.successRate).to.be.at.least(0.5).and.below(0.7);
    })
  })
})
