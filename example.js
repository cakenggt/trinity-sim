var trinitysim = require('trinity-sim');

var options = {
  startingValue: 1000000,
  durationYears: 50,
  fees: 0.0005,
  spendingModel: 30000,
  allocation: {
    equities: 1,
    bonds: 0
  },
  rebalance: false
};

var result = trinitysim.simulate(options);
console.log(result.successRate);
