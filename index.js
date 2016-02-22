/**
  @typedef SingleSimReturn
  @type Object
  @property {Array.<Number>} netWorths - Array of net worths in the simulation for each year.
*/

/**
  @typedef SimulationReturn
  @type Object
  @property {Number} successRate - Success rate.
  @property {Array.<Array.<Number>>} data - Array of array of net worths for each single simulation.
*/

//Months are 0 indexed
//inflation is not in percents
var archive = require('./archive.js').data;

/**
  Runs a single simulation line.

  @param {Object} options - Options object which contains the options necessary for simulation.
  @param {Number} options.startingValue - Starting portfolio value. Required.
  @param {Number} options.startingYear - Starting year for the simulation.
  Must be between 1914 and 2015. Required.
  @param {Number} options.durationYears - Duration of the simulation in years. Required.
  @param {Object} options.allocation - Object which contains the allocations for the starting value. All values must add up to 1.
  @param {Number} options.allocation.equities - Percent of equities.
  @param {Number} options.allocation.bonds - Percent of bonds.
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @returns {SingleSimReturn} result - Result of the sim.
*/
function singleSim(options){
  if (options.startingValue === undefined){
    throw "No starting value";
  }
  var startingValue = parseFloat(options.startingValue);
  if (options.startingYear === undefined){
    throw "No starting year";
  }
  var startingYear = parseInt(options.startingYear);
  if (startingYear < 1914 || startingYear > 2015) {
    throw "Starting year not in correct range";
  }
  if (options.durationYears === undefined){
    throw "No duration";
  }
  var durationYears = parseInt(options.durationYears);
  if (durationYears + startingYear > 2015) {
    throw "Duration too long for starting year";
  }
  if (options.spendingModel === undefined){
    throw "No spending model";
  }
  var spendingModel = options.spendingModel;
  if (options.fees === undefined){
    throw "No fees";
  }
  var fees = parseFloat(options.fees);
  if (options.allocation === undefined){
    throw "No allocation";
  }
  var allocation = options.allocation;
  if (allocation.equities === undefined){
    throw "No equities";
  }
  if (allocation.bonds === undefined){
    throw "No bonds";
  }
  if (allocation.bonds + allocation.equities != 1){
    throw "Allocations do not add up to 1";
  }

  var result = {};
  result.netWorths = [];
  var inflation = 1;
  var shares = (startingValue*allocation.equities)/archive[''+startingYear+'-'+0].sp500;
  var bonds = startingValue*allocation.bonds;
  for (var year = 0; year < durationYears; year++){
    for (var month = 0; month < 12; month++){
      var currentMonthData = archive[''+(year+startingYear)+'-'+month];
      //dividend
      shares *= (1+currentMonthData.dividend);
      //bonds
      bonds *= (1+currentMonthData.treasuryrate);
      //add inflation
      inflation /= (1+currentMonthData.inflation);
      //fees
      shares *= 1-(fees/12);
      //subtract spending
      var spending;
      if (typeof(spendingModel) == 'object'){
        //spending array
        spending = (spendingModel[year]/12)/inflation;
      }
      else{
        //flat spending
        spending = (spendingModel/12)/inflation;
      }
      //subtract inflation adjusted spending from each asset type
      shares -= (spending*allocation.equities)/currentMonthData.sp500;
      bonds -= spending*allocation.bonds;
      if (month === 0){
        var net = (shares*currentMonthData.sp500*inflation)+(bonds*inflation);
        result.netWorths.push(net);
      }
    }
  }
  return result;
}

/**
  Runs the entire simulation with multiple simulation lines starting in different years.

  @param {Object} options - Options object which contains the options necessary for simulation.
  @param {Number} options.startingValue - Starting portfolio value. Required.
  @param {Number} options.durationYears - Duration of the simulation in years. Required.
  @param {Object} options.allocation - Object which contains the allocations for the starting value. All values must add up to 1.
  @param {Number} options.allocation.equities - Percent of equities.
  @param {Number} options.allocation.bonds - Percent of bonds.
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @returns {SimulationReturn} result - Result of the sim.
*/
function simulate(options){
  var result = {};
  result.data = [];
  var totalSuccess = 0;
  var totalRuns = 0;
  for (var year = 1914; year < 2016-options.durationYears; year++){
    var singleOptions = {
      startingValue: options.startingValue,
      startingYear: year,
      durationYears: options.durationYears,
      allocation: options.allocation,
      fees: options.fees,
      spendingModel: options.spendingModel
    };
    var singleResult = singleSim(singleOptions);
    if (singleResult.netWorths[singleResult.netWorths.length-1] > 1){
      totalSuccess++;
    }
    totalRuns++;
    result.data.push(singleResult.netWorths);
  }
  result.successRate = totalSuccess/totalRuns;
  return result;
}

exports.singleSim = singleSim;
exports.simulate = simulate;
