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
  @param {Number} options.allocation.equities - Ratio of equities.
  @param {Number} options.allocation.bonds - Ratio of bonds. Will default to 1-equities.
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @param {Boolean} options.rebalance - Whether to rebalance allocation annually. Defaults to false.
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
  if (startingYear < 1871 || startingYear > 2016) {
    throw "Starting year not in correct range";
  }
  if (options.durationYears === undefined){
    throw "No duration";
  }
  var durationYears = parseInt(options.durationYears);
  if (durationYears + startingYear > 2016) {
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
    allocation.bonds = 1-allocation.equities;
  }
  if (allocation.bonds + allocation.equities != 1){
    throw "Allocations do not add up to 1";
  }
  var rebalance;
  if (options.rebalance === undefined){
    rebalance = false;
  }
  else{
    rebalance = options.rebalance;
  }

  var result = {};
  result.netWorths = [];
  //starting net worth is in the starting year's dollars
  var startingNetWorth = inflationAdjuster(startingValue, 2016, startingYear);
  //actual number of shares that the starting value in the
  //starting year would have bought, inflation adjusted
  var shares = (startingNetWorth*allocation.equities)/archive[''+startingYear].sp500;
  //bonds are in the starting year's dollars
  var bonds = startingNetWorth*allocation.bonds;
  for (var year = 0; year < durationYears; year++){
    var currentYearData = archive[''+(year+startingYear)];
    //dividend
    shares *= 1+currentYearData.dividend;
    //bonds
    //annual percentage yield calculation
    var apy = Math.pow(1+(currentYearData.treasuryrate/2), 2)-1;
    bonds *= 1+apy;
    //fees
    shares *= 1-fees;
    bonds *= 1-fees;
    //subtract spending
    //spending is in inflation adjusted dollars
    var spending;
    if (typeof(spendingModel) == 'object'){
      //spending array
      spending = inflationAdjuster(spendingModel[year], 2016, year+startingYear);
    }
    else{
      //flat spending
      spending = inflationAdjuster(spendingModel, 2016, year+startingYear);
    }
    //subtract inflation adjusted spending from each asset type equally
    var valueOfShares = shares*currentYearData.sp500;
    var spendingRatioForEquities = valueOfShares/(bonds+valueOfShares);
    shares -= (spending*spendingRatioForEquities)/currentYearData.sp500;
    bonds -= spending*(1-spendingRatioForEquities);
    //net is in sim year dollars
    var net = (shares*currentYearData.sp500)+(bonds);
    //rebalance
    if (rebalance){
      if (spendingRatioForEquities != allocation.equities){
        //it is not balanced according to allocation
        var newValueOfShares = allocation.equities * net;
        shares = newValueOfShares/currentYearData.sp500;
        bonds = allocation.bonds * net;
      }
    }
    //adjusted net is in current year dollars
    var adjustedNet = worthAdjuster(net, year+startingYear, 2016);
    result.netWorths.push(adjustedNet);
  }
  return result;
}

/**
  Adjusts an amount of money with inflation to show it's worth at an ending year.
  This will almost always return a lesser amount if the end year is greater.

  @param {Number} amount - Amount of money.
  @param {Number} startYear - Year the amount of money is in currently.
  @param {Number} endYear - Year you want to see the worth of the money in.
  @returns {Number} Worth of the money in the end year, in starting year dollars.
*/
function worthAdjuster(amount, startYear, endYear){
  if (!archive[''+startYear]){
    throw "Start year not in archive";
  }
  if (!archive[''+endYear]){
    throw "End year not in archive";
  }
  return (amount/archive[endYear].cpi)*archive[startYear].cpi;
}

/**
  Adjusts an amount of money with inflation to show it's amount at an ending year.
  This will almost always return a greater amount if the end year is greater.

  @param {Number} amount - Amount of money.
  @param {Number} startYear - Year the amount of money is in currently.
  @param {Number} endYear - Year you want to see the inflated amount of the money in.
  @returns {Number} Number of dollars to equal the worth of the money in the
  start year, in end year dollars.
*/
function inflationAdjuster(amount, startYear, endYear){
  if (!archive[''+startYear]){
    throw "Start year not in archive";
  }
  if (!archive[''+endYear]){
    throw "End year not in archive";
  }
  return (amount/archive[startYear].cpi)*archive[endYear].cpi;
}

/**
  Runs the entire simulation with multiple simulation lines starting in different years.

  @param {Object} options - Options object which contains the options necessary for simulation.
  @param {Number} options.startingValue - Starting portfolio value. Required.
  @param {Number} options.durationYears - Duration of the simulation in years. Required.
  @param {Object} options.allocation - Object which contains the allocations for the starting value. All values must add up to 1.
  @param {Number} options.allocation.equities - Ratio of equities.
  @param {Number} options.allocation.bonds - Ratio of bonds. Will default to 1-equities.
  @param {Number} options.fees - Fees on investments per year. Required.
  @param {Array.<Number>|Number} options.spendingModel - Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.
  @param {Boolean} options.rebalance - Whether to rebalance allocation annually. Defaults to false.
  @returns {SimulationReturn} result - Result of the sim.
*/
function simulate(options){
  var result = {};
  result.data = [];
  var totalSuccess = 0;
  var totalRuns = 0;
  for (var year = 1871; year < 2016-options.durationYears; year++){
    var singleOptions = {
      startingValue: options.startingValue,
      startingYear: year,
      durationYears: options.durationYears,
      allocation: options.allocation,
      fees: options.fees,
      spendingModel: options.spendingModel,
      rebalance: options.rebalance
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
