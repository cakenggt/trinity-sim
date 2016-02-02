/**
  @typedef SingleSimReturn
  @type Object
  @property {Array.<Number>} netWorths - Array of net worths in the simulation for each year.
*/

/**
  @typedef SimulationReturn
  @type Object
  @property {Number} successRate - Success rate.
*/

//Months are 0 indexed
//inflation is not in percents
var archive = require('./archive.js').data

/**
  Runs a single simulation line.

  @param {Object} options - Options object which contains the options necessary for simulation.
  @param {Number} options.startingValue - Starting portfolio value. Required.
  @param {Number} options.startingYear - Starting year for the simulation.
  Must be between 1914 and 2015. Required.
  @param {Number} options.durationYears - Duration of the simulation in years. Required.
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @returns {SingleSimReturn} result - Result of the sim.
*/
function singleSim(options){
  if (options.startingValue == undefined){
    throw "No starting value";
  }
  var startingValue = parseFloat(options.startingValue);
  if (options.startingYear == undefined){
    throw "No starting year";
  }
  var startingYear = parseInt(options.startingYear);
  if (startingYear < 1914 || startingYear > 2015) {
    throw "Starting year not in correct range";
  }
  if (options.durationYears == undefined){
    throw "No duration";
  }
  var durationYears = parseInt(options.durationYears);
  if (durationYears + startingYear > 2015) {
    throw "Duration too long for starting year";
  }
  if (options.spendingModel == undefined){
    throw "No spending model";
  }
  var spendingModel = options.spendingModel;
  if (options.fees == undefined){
    throw "No fees";
  }
  var fees = parseFloat(options.fees);

  var result = {};
  result.netWorths = [];
  var inflation = 1;
  var net = startingValue;
  var shares = net/archive[''+startingYear+'-'+0].sp500;
  for (var year = 0; year < durationYears; year++){
    for (var month = 0; month < 12; month++){
      var currentMonthData = archive[''+(year+startingYear)+'-'+month];
      //dividend
      shares *= (1+currentMonthData.dividend);
      //add inflation
      inflation /= (1+currentMonthData.inflation);
      //fees
      shares *= 1-(fees/12);
      //subtract spending
      if (typeof(spendingModel) == 'object'){
        //spending array
        shares -= ((spendingModel[year]/12)/inflation)/currentMonthData.sp500;
      }
      else{
        //flat spending
        shares -= ((spendingModel/12)/inflation)/currentMonthData.sp500;
      }
      if (month == 0){
        result.netWorths.push(shares*currentMonthData.sp500*inflation);
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
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @returns {SimulationReturn} result - Result of the sim.
*/
function simulate(options){
  var result = {};
  var totalSuccess = 0;
  var totalRuns = 0;
  for (var year = 1914; year < 2016-options.durationYears; year++){
    var singleOptions = {
      startingValue: options.startingValue,
      startingYear: year,
      durationYears: options.durationYears,
      fees: options.fees,
      spendingModel: options.spendingModel
    };
    var result = singleSim(singleOptions);
    if (result.netWorths[result.netWorths.length-1] > 1){
      totalSuccess++;
    }
    totalRuns++;
  }
  result.successRate = totalSuccess/totalRuns;
  return result;
}

exports.singleSim = singleSim;
exports.simulate = simulate
