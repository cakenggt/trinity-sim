# trinity-sim
[![Build Status](https://travis-ci.org/cakenggt/trinity-sim.svg?branch=master)](https://travis-ci.org/cakenggt/trinity-sim)

trinity-sim lets you run your own permutations on the classic [Trinity Study](https://en.wikipedia.org/wiki/Trinity_study).

## Documentation
* * *

### singleSim(options)

Runs a single simulation line.

**Parameters**

**options**: `Object`, Options object which contains the options necessary for simulation.

**options.startingValue**: `Number`, Starting portfolio value. Required.

**options.startingYear**: `Number`, Starting year for the simulation.
  Must be between 1914 and 2015. Required.

**options.durationYears**: `Number`, Duration of the simulation in years. Required.

**options.allocation**: `Object`, Object which contains the allocations for the starting value. All values must add up to 1.

**options.allocation.equities**: `Number`, Ratio of equities.

**options.allocation.bonds**: `Number`, Ratio of bonds. Defaults to 1-equities.

**options.fees**: `Number`, Fees on investments per year. Required.

**options.spendingModel**: `Array.<Number> | Number`, Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.

**options.rebalance**: `Boolean`, Whether to rebalance allocation annually. Defaults to false.

**Returns**: `SingleSimReturn`, result - Result of the sim.
  **result.data**: `Array.<Object>`, Array of objects containing adjustedNet,
  adjustedSharesBalance, and adjustedBondsBalance properties.


### simulate(options)

Runs the entire simulation with multiple simulation lines starting in different years.

**Parameters**

**options**: `Object`, Options object which contains the options necessary for simulation.

**options.startingValue**: `Number`, Starting portfolio value. Required.

**options.durationYears**: `Number`, Duration of the simulation in years. Required.

**options.allocation**: `Object`, Object which contains the allocations for the starting value. All values must add up to 1.

**options.allocation.equities**: `Number`, Ratio of equities.

**options.allocation.bonds**: `Number`, Ratio of bonds. Defaults to 1-equities.

**options.fees**: `Number`, Fees on investments per year. Required.

**options.spendingModel**: `Array.<Number> | Number`, Spending model for the simulation. Required.
  If it is a list of yearly spending, it must be an array at least as large as the durationYears property. Each index says how much money is spent per year.
  If it is a number, that will be the spending per year, adjusted with inflation.

**options.rebalance**: `Boolean`, Whether to rebalance allocation annually. Defaults to false.

**Returns**: `SimulationReturn`, result - Result of the sim.
  **result.successRate**: `Number`, Number between 0 and 1 representing the proportion of cycles which succeeded.
  **result.data**: `Array.<Array.<Object>>`, Array of arrays of objects, each one containing
  adjustedNet, adjustedSharesBalance, and adjustedBondsBalance properties.



* * *

## Sources

Data for archive.js is taken from Robert Shiller's book "Irrational Exuberance".

Specifically, data can be found here:

  sp500: http://www.multpl.com/s-p-500-historical-prices/table/by-year

  dividend: http://www.multpl.com/s-p-500-dividend-yield/table

  cpi: http://www.multpl.com/cpi/table

  treasuryrate: http://www.multpl.com/10-year-treasury-rate/table/by-year
