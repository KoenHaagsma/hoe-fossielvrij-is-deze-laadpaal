const changeOperator = (operatorName) => {
    if (operatorName === undefined) return 'BudgetEnergie';
    switch (operatorName) {
        case 'PitPoint':
            return 'Essent';
        case 'NL-EVB':
            return 'Engie';
        case 'Allego':
            return 'PureEnergie';
        case 'EV-Box':
            return 'Om_nieuwe_energie';
        case 'Community by Shell Recharge':
            return 'PureEnergie';
        case 'LastMileSolutions':
            return 'NLE';
        case 'Blue Current':
            return 'DVEP_Energie';
        case 'E-Flux':
            return 'Oxxio';
        case 'Abel&co':
            return 'GreenCaravan+EasyEnergy';
        case 'Fastned':
            return 'PureEnergie';
        case 'Alfen':
            return 'GreenCaravan+EasyEnergy';
        case 'Joulz\t':
            return 'GreenCaravan+EasyEnergy';
        default:
            return operatorName;
    }
};

module.exports = { changeOperator };
