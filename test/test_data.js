exports.data = [
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 1,
        bonds: 0
      },
      fees: 0.0005,
      spendingModel: 30000
    },
    cFireSim: 1,
    fireCalc: 1,
    description: 'All equities, low spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 1,
        bonds: 0
      },
      fees: 0.0005,
      spendingModel: 60000
    },
    cFireSim: 0.4632,
    fireCalc: 0.432,
    description: 'All equities, medium-high spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 1,
        bonds: 0
      },
      fees: 0.0005,
      spendingModel: 80000
    },
    cFireSim: 0.2316,
    fireCalc: 0.2,
    description: 'All equities, high spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0.5,
        bonds: 0.5
      },
      fees: 0.0005,
      spendingModel: 20000
    },
    cFireSim: 0.8421,
    fireCalc: 1,
    description: 'Half equities, low spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0.5,
        bonds: 0.5
      },
      fees: 0.0005,
      spendingModel: 40000
    },
    cFireSim: 0.7368,
    fireCalc: 0.663,
    description: 'Half equities, medium spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0.5,
        bonds: 0.5
      },
      fees: 0.0005,
      spendingModel: 60000
    },
    cFireSim: 0.2316,
    fireCalc: 0.2,
    description: 'Half equities, medium-high spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0,
        bonds: 1
      },
      fees: 0.0005,
      spendingModel: 20000
    },
    cFireSim: 0.8421,
    fireCalc: 0.884,
    description: 'All bonds, low spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0,
        bonds: 1
      },
      fees: 0.0005,
      spendingModel: 40000
    },
    cFireSim: 0.1474,
    fireCalc: 0.137,
    description: 'All bonds, medium spending'
  },
  {
    options: {
      startingValue: 1000000,
      durationYears: 50,
      allocation: {
        equities: 0,
        bonds: 1
      },
      fees: 0.0005,
      spendingModel: 60000
    },
    cFireSim: 0.0421,
    fireCalc: 0.021,
    description: 'All bonds, medium-high spending'
  }
];
